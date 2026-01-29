import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  type User,
  type UserCredential,
  GoogleAuthProvider,
  EmailAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  setPersistence,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { deleteObject, ref, uploadBytes } from "firebase/storage"
import { type FirebaseUserDocument } from "../models/firebase"
import { auth, db, storage } from "../utils/firebase"
const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30

export type AccountStatus = "actif" | "desactive"

export type AdminUserRecord = {
  email: string
  createdAt: string | null
  status: AccountStatus
  deletionPlannedAt: string | null
}

type ChangePasswordResult = {
  success: boolean
  error?: string
}

type AccountActionResult = {
  success: boolean
  error?: string
  deleteAt?: string
}

type RegistrationProfile = {
  firstName?: string
  lastName?: string
  username?: string
  birthday?: string
  gender?: string
  acceptTerms?: boolean
}

export type AuthContextValue = {
  isAuthReady: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  userEmail: string | null
  createdAt: string | null
  login: (credentials: { email: string; password: string; remember?: boolean }) => Promise<boolean>
  register: (credentials: { email: string; password: string; remember?: boolean; profile?: RegistrationProfile }) => Promise<boolean>
  loginWithGoogle: (credential: string) => Promise<boolean>
  logout: () => Promise<void>
  verifyPassword: (input: string) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<ChangePasswordResult>
  deactivateAccount: () => Promise<AccountActionResult>
  deleteAccount: () => Promise<AccountActionResult>
  scheduledDeletionDate: string | null
  adminListUsers: () => Promise<AdminUserRecord[]>
  adminUpdateStatus: (email: string, status: AccountStatus) => Promise<AccountActionResult>
  adminDeleteUser: (email: string) => Promise<AccountActionResult>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const normalizeEmail = (value: string) => String(value ?? "").trim().toLowerCase()

const nowIso = () => new Date().toISOString()

const buildUserDocument = (
  user: User,
  profile?: RegistrationProfile,
  options?: { includeCreatedAt?: boolean; status?: AccountStatus; admin?: boolean },
) => {
  const email = user.email ?? ""
  const payload: FirebaseUserDocument = {
    email,
    emailLower: normalizeEmail(email),
    updatedAt: nowIso(),
  }

  if (options?.includeCreatedAt) {
    payload.createdAt = user.metadata.creationTime ?? nowIso()
    payload.admin = options?.admin ?? false
  }

  if (options?.status) {
    payload.status = options.status
  }

  if (profile) {
    payload.personalInfo = {
      firstName: profile.firstName?.trim() || "",
      lastName: profile.lastName?.trim() || "",
      email,
    }
    payload.identityInfo = {
      username: profile.username?.trim() || "",
      birthday: profile.birthday?.trim() || "",
      gender: profile.gender?.trim() || "",
    }
    payload.acceptTerms = Boolean(profile.acceptTerms)
  }

  return payload
}

const uploadProfileSnapshot = async (uid: string, payload: FirebaseUserDocument) => {
  try {
    const snapshotRef = ref(storage, `users/${uid}/profile.json`)
    const body = JSON.stringify(payload, null, 2)
    const blob = new Blob([body], { type: "application/json" })
    await uploadBytes(snapshotRef, blob, { contentType: "application/json" })
  } catch (error) {
    console.error("Profile snapshot upload failed", error)
  }
}

const ensureUserDocument = async (user: User, profile?: RegistrationProfile) => {
  const docRef = doc(db, "users", user.uid)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) {
    const payload = buildUserDocument(user, profile, { includeCreatedAt: true, status: "actif", admin: false })
    payload.deletionPlannedAt = null
    await setDoc(docRef, payload)
    return payload
  }

  const data = snapshot.data() as FirebaseUserDocument
  const updates: Partial<FirebaseUserDocument> = {}
  if (!data.createdAt) {
    updates.createdAt = user.metadata.creationTime ?? nowIso()
  }
  if (!data.email && user.email) {
    updates.email = user.email
  }
  if (!data.emailLower && user.email) {
    updates.emailLower = normalizeEmail(user.email)
  }
  if (data.admin === undefined) {
    updates.admin = false
  }

  if (Object.keys(updates).length > 0) {
    updates.updatedAt = nowIso()
    await updateDoc(docRef, updates)
  }

  if (profile) {
    const payload = buildUserDocument(user, profile)
    await setDoc(docRef, payload, { merge: true })
  }

  const refreshed = await getDoc(docRef)
  return (refreshed.data() as FirebaseUserDocument) ?? data
}

const loadAdminUserByEmail = async (email: string) => {
  const normalized = normalizeEmail(email)
  if (!normalized) return null
  const usersRef = collection(db, "users")
  const byLower = query(usersRef, where("emailLower", "==", normalized))
  const snapshot = await getDocs(byLower)
  if (snapshot.docs[0]) return snapshot.docs[0]
  const byEmail = query(usersRef, where("email", "==", email))
  const fallbackSnapshot = await getDocs(byEmail)
  if (fallbackSnapshot.docs[0]) return fallbackSnapshot.docs[0]
  const allSnapshot = await getDocs(usersRef)
  return allSnapshot.docs.find((docSnap) => {
    const data = docSnap.data() as FirebaseUserDocument
    return normalizeEmail(data.email ?? "") === normalized
  }) ?? null
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authUser, setAuthUser] = useState<User | null>(auth.currentUser)
  const [userDoc, setUserDoc] = useState<FirebaseUserDocument | null>(null)
  const [accountCreatedAt, setAccountCreatedAt] = useState<string | null>(null)
  const [scheduledDeletionDate, setScheduledDeletionDate] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    let isMounted = true
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setAuthUser(nextUser)
      if (!nextUser) {
        setUserDoc(null)
        setAccountCreatedAt(null)
        setScheduledDeletionDate(null)
        if (isMounted) {
          setAuthReady(true)
        }
        return
      }

      try {
        const data = await ensureUserDocument(nextUser)
        setUserDoc(data)
        setAccountCreatedAt(data.createdAt ?? nextUser.metadata.creationTime ?? null)
        setScheduledDeletionDate(data.deletionPlannedAt ?? null)
        if (data.status === "desactive") {
          await signOut(auth)
        }
      } catch (error) {
        console.error("Firebase user load failed", error)
      } finally {
        if (isMounted) {
          setAuthReady(true)
        }
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const applyPersistence = useCallback(async (remember?: boolean) => {
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)
    } catch (error) {
      console.error("Auth persistence failed", error)
    }
  }, [])

  const login = useCallback(
    async (credentials: { email: string; password: string; remember?: boolean }) => {
      const { email, password, remember = false } = credentials
      if (!email || !password) return false
      try {
        await applyPersistence(remember)
        const result = await signInWithEmailAndPassword(auth, email, password)
        const data = await ensureUserDocument(result.user)
        if (data.status === "desactive") {
          await signOut(auth)
          return false
        }
        if (data.deletionPlannedAt) {
          const deleteAtTime = new Date(data.deletionPlannedAt).getTime()
          if (Number.isFinite(deleteAtTime) && deleteAtTime <= Date.now()) {
            await signOut(auth)
            return false
          }
        }
        return true
      } catch (error) {
        console.error("Login failed", error)
        return false
      }
    },
    [applyPersistence],
  )

  const register = useCallback(
    async (credentials: { email: string; password: string; remember?: boolean; profile?: RegistrationProfile }) => {
      const { email, password, remember = false, profile } = credentials
      if (!email || !password) return false
      try {
        await applyPersistence(remember)
        const result = await createUserWithEmailAndPassword(auth, email, password)
        const displayName = profile?.username || [profile?.firstName, profile?.lastName].filter(Boolean).join(" ")
        if (displayName) {
          await updateProfile(result.user, { displayName })
        }
        // Create the profile document without blocking onboarding navigation.
        void (async () => {
          try {
            const data = await ensureUserDocument(result.user, profile)
            await uploadProfileSnapshot(result.user.uid, data)
          } catch (error) {
            console.error("Post-register profile setup failed", error)
          }
        })()
        return true
      } catch (error) {
        console.error("Register failed", error)
        return false
      }
    },
    [applyPersistence],
  )

  const loginWithGoogle = useCallback(
    async (credential: string) => {
      if (!credential) return false
      try {
        await applyPersistence(true)
        const googleCredential = GoogleAuthProvider.credential(credential)
        const result: UserCredential = await signInWithCredential(auth, googleCredential)
        const data = await ensureUserDocument(result.user)
        if (result.additionalUserInfo?.isNewUser) {
          await uploadProfileSnapshot(result.user.uid, data)
        }
        if (data.status === "desactive") {
          await signOut(auth)
          return false
        }
        return true
      } catch (error) {
        console.error("Google login failed", error)
        return false
      }
    },
    [applyPersistence],
  )

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout failed", error)
    }
  }, [])

  const verifyPassword = useCallback(async (input: string) => {
    if (!auth.currentUser?.email) return false
    if (!input) return false
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, input)
      await reauthenticateWithCredential(auth.currentUser, credential)
      return true
    } catch (error) {
      console.error("Password verification failed", error)
      return false
    }
  }, [])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<ChangePasswordResult> => {
    const currentUser = auth.currentUser
    if (!currentUser?.email) {
      return { success: false, error: "Vous devez etre connecte pour changer votre mot de passe." }
    }
    if (!currentPassword || !newPassword) {
      return { success: false, error: "Tous les champs sont obligatoires." }
    }
    if (newPassword.length < 6) {
      return { success: false, error: "Le nouveau mot de passe doit contenir au moins 6 caracteres." }
    }
    if (newPassword === currentPassword) {
      return { success: false, error: "Le nouveau mot de passe doit etre different de l actuel." }
    }
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, newPassword)
      return { success: true }
    } catch (error) {
      console.error("Password change failed", error)
      return { success: false, error: "Mot de passe actuel invalide ou session expiree." }
    }
  }, [])

  const deactivateAccount = useCallback(async (): Promise<AccountActionResult> => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return { success: false, error: "Vous devez etre connecte pour desactiver votre compte." }
    }
    const deleteAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString()
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        deletionPlannedAt: deleteAt,
        updatedAt: nowIso(),
      })
      setScheduledDeletionDate(deleteAt)
      return { success: true, deleteAt }
    } catch (error) {
      console.error("Account deactivation failed", error)
      return { success: false, error: "Impossible de planifier la desactivation." }
    }
  }, [])

  const deleteAccount = useCallback(async (): Promise<AccountActionResult> => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return { success: false, error: "Vous devez etre connecte pour supprimer votre compte." }
    }
    try {
      await deleteDoc(doc(db, "users", currentUser.uid))
    } catch (error) {
      console.error("User document delete failed", error)
    }

    try {
      await deleteObject(ref(storage, `users/${currentUser.uid}/profile.json`))
    } catch {
      // ignore missing snapshot
    }

    try {
      await deleteUser(currentUser)
      return { success: true }
    } catch (error) {
      console.error("Account delete failed", error)
      return {
        success: false,
        error: "Suppression impossible sans reconnexion recente. Reconnectez-vous puis reessayez.",
      }
    }
  }, [])

  const adminListUsers = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"))
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as FirebaseUserDocument
        return {
          email: data.email ?? docSnap.id,
          createdAt: data.createdAt ?? null,
          status: (data.status ?? "actif") as AccountStatus,
          deletionPlannedAt: data.deletionPlannedAt ?? null,
        }
      })
    } catch (error) {
      console.error("Admin users load failed", error)
      return []
    }
  }, [])

  const adminUpdateStatus = useCallback(async (email: string, status: AccountStatus): Promise<AccountActionResult> => {
    if (!email) {
      return { success: false, error: "Email requis pour mettre à jour le statut." }
    }
    try {
      const targetDoc = await loadAdminUserByEmail(email)
      if (!targetDoc) {
        return { success: false, error: "Utilisateur introuvable." }
      }
      const updates: Partial<FirebaseUserDocument> = {
        status,
        updatedAt: nowIso(),
      }
      if (status === "actif") {
        updates.deletionPlannedAt = null
      }
      await updateDoc(targetDoc.ref, updates)
      if (auth.currentUser?.uid === targetDoc.id && status === "desactive") {
        await signOut(auth)
      }
      return { success: true }
    } catch (error) {
      console.error("Admin status update failed", error)
      return { success: false, error: "Mise à jour impossible." }
    }
  }, [])

  const adminDeleteUser = useCallback(async (email: string): Promise<AccountActionResult> => {
    if (!email) {
      return { success: false, error: "Email requis pour supprimer le compte." }
    }
    const currentEmail = auth.currentUser?.email
    if (currentEmail && normalizeEmail(currentEmail) === normalizeEmail(email)) {
      return { success: false, error: "Utilisez la suppression de compte depuis vos paramètres." }
    }
    try {
      const targetDoc = await loadAdminUserByEmail(email)
      if (!targetDoc) {
        return { success: false, error: "Utilisateur introuvable." }
      }
      await deleteDoc(targetDoc.ref)
      try {
        await deleteObject(ref(storage, `users/${targetDoc.id}/profile.json`))
      } catch {
        // ignore missing snapshot or permission errors
      }
      return { success: true }
    } catch (error) {
      console.error("Admin delete failed", error)
      return { success: false, error: "Suppression impossible avec les droits actuels." }
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const email = authUser?.email ?? null
    const isAdmin = Boolean(userDoc?.admin)
    return {
      isAuthReady: authReady,
      isAuthenticated: Boolean(authUser),
      isAdmin,
      userEmail: email,
      createdAt: accountCreatedAt,
      login,
      register,
      loginWithGoogle,
      logout,
      verifyPassword,
      changePassword,
      deactivateAccount,
      deleteAccount,
      scheduledDeletionDate,
      adminListUsers,
      adminUpdateStatus,
      adminDeleteUser,
    }
  }, [
    accountCreatedAt,
    adminDeleteUser,
    adminListUsers,
    adminUpdateStatus,
    authReady,
    authUser,
    changePassword,
    deactivateAccount,
    deleteAccount,
    login,
    loginWithGoogle,
    logout,
    register,
    scheduledDeletionDate,
    userDoc?.admin,
    verifyPassword,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
