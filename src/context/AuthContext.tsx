import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { FirebaseError } from "firebase/app"
import {
  type User,
  type UserCredential,
  GoogleAuthProvider,
  EmailAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  onIdTokenChanged,
  onAuthStateChanged,
  reauthenticateWithCredential,
  setPersistence,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
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
import { type FirebaseUserDocument } from "../models/firebase"
import { buildApiUrl, fetchApi, getApiTargetLabel } from "../utils/apiUrl"
import { auth, db } from "../utils/firebase"
import { buildUserScopedKey, normalizeUserEmail } from "../utils/userScopedKey"
const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30
const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"

type UserProfileData = Pick<FirebaseUserDocument, "personalInfo" | "identityInfo">

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

type AuthAttemptResult = {
  success: boolean
  errorCode?: string
}

type AccountActionResult = {
  success: boolean
  error?: string
  deleteAt?: string
  message?: string
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
  userId: string | null
  userEmail: string | null
  username: string | null
  userProfile: UserProfileData
  createdAt: string | null
  updateUserProfile: (profile: UserProfileData) => Promise<void>
  login: (credentials: { email: string; password: string; remember?: boolean }) => Promise<AuthAttemptResult>
  register: (credentials: { email: string; password: string; remember?: boolean; profile?: RegistrationProfile }) => Promise<AuthAttemptResult>
  loginWithGoogle: (credential?: string) => Promise<AuthAttemptResult>
  logout: () => Promise<void>
  verifyPassword: (input: string) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<ChangePasswordResult>
  deactivateAccount: () => Promise<AccountActionResult>
  deleteAccount: () => Promise<AccountActionResult>
  scheduledDeletionDate: string | null
  adminListUsers: () => Promise<AdminUserRecord[]>
  adminUpdateStatus: (email: string, status: AccountStatus) => Promise<AccountActionResult>
  adminDeleteUser: (email: string) => Promise<AccountActionResult>
  adminResendWelcomeEmail: (payload: { email: string; firstName?: string }) => Promise<AccountActionResult>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const normalizeEmail = (value: string) => String(value ?? "").trim().toLowerCase()

const nowIso = () => new Date().toISOString()

const emptyUserProfile: UserProfileData = {
  personalInfo: {},
  identityInfo: {},
}

const readLocalProfile = (email: string | null | undefined): UserProfileData => {
  if (typeof window === "undefined") {
    return emptyUserProfile
  }

  const key = buildUserScopedKey(normalizeUserEmail(email), PROFILE_STORAGE_KEY)

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return emptyUserProfile
    }
    const parsed = JSON.parse(raw) as UserProfileData
    return {
      personalInfo: parsed.personalInfo ?? {},
      identityInfo: parsed.identityInfo ?? {},
    }
  } catch {
    // ignore malformed storage entries
  }

  return emptyUserProfile
}

const writeLocalProfile = (email: string | null | undefined, profile: UserProfileData) => {
  if (typeof window === "undefined") {
    return
  }

  const key = buildUserScopedKey(normalizeUserEmail(email), PROFILE_STORAGE_KEY)
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        personalInfo: profile.personalInfo ?? {},
        identityInfo: profile.identityInfo ?? {},
      }),
    )
  } catch {
    // ignore storage failures
  }
}

const mergeProfileData = (base: UserProfileData, fallback?: UserProfileData, email?: string | null): UserProfileData => {
  const personalInfo = {
    firstName: base.personalInfo?.firstName?.trim() || fallback?.personalInfo?.firstName?.trim() || "",
    lastName: base.personalInfo?.lastName?.trim() || fallback?.personalInfo?.lastName?.trim() || "",
    email: base.personalInfo?.email?.trim() || fallback?.personalInfo?.email?.trim() || email || "",
  }

  const identityInfo = {
    username: base.identityInfo?.username?.trim() || fallback?.identityInfo?.username?.trim() || "",
    birthday: base.identityInfo?.birthday?.trim() || fallback?.identityInfo?.birthday?.trim() || "",
    gender: base.identityInfo?.gender?.trim() || fallback?.identityInfo?.gender?.trim() || "",
  }

  return { personalInfo, identityInfo }
}

const hasProfileDiff = (left: UserProfileData, right: UserProfileData) =>
  JSON.stringify(mergeProfileData(left)) !== JSON.stringify(mergeProfileData(right))

const notifyWelcomeEmail = async (firstName?: string) => {
  const user = auth.currentUser
  if (!user) return
  const token = await user.getIdToken()
  const response = await fetch(buildApiUrl("/api/email/welcome"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: firstName?.trim() || "",
    }),
  })

  if (!response.ok) {
    let reason = `status ${response.status}`
    try {
      const payload = (await response.json()) as { error?: string }
      if (payload?.error) {
        reason = payload.error
      }
    } catch {
      // ignore malformed payloads
    }
    throw new Error(reason)
  }
}

const clearServerMediaSession = async () => {
  try {
    await fetchApi("/api/auth/media-session", {
      method: "DELETE",
      credentials: "include",
    })
  } catch (error) {
    if (error instanceof TypeError) {
      console.warn(`Media session clear skipped: server unreachable (${getApiTargetLabel()})`)
      return
    }
    console.error("Media session clear failed", error)
  }
}

const syncServerMediaSession = async (user: User) => {
  const token = await user.getIdToken()
  const response = await fetchApi("/api/auth/media-session", {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let reason = `status ${response.status}`
    try {
      const payload = (await response.json()) as { error?: string }
      if (payload?.error) {
        reason = payload.error
      }
    } catch {
      // ignore malformed payloads
    }
    throw new Error(reason)
  }

  const payload = (await response.json().catch(() => ({}))) as { isAdmin?: boolean }
  return {
    isAdmin: Boolean(payload?.isAdmin),
  }
}

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
  const [isAdminApproved, setIsAdminApproved] = useState(false)
  const [accountCreatedAt, setAccountCreatedAt] = useState<string | null>(null)
  const [scheduledDeletionDate, setScheduledDeletionDate] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    let isMounted = true
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setAuthUser(nextUser)
      if (!nextUser) {
        setUserDoc(null)
        setIsAdminApproved(false)
        setAccountCreatedAt(null)
        setScheduledDeletionDate(null)
        await clearServerMediaSession()
        if (isMounted) {
          setAuthReady(true)
        }
        return
      }

      try {
        let data = await ensureUserDocument(nextUser)
        const localProfile = readLocalProfile(nextUser.email)
        const mergedProfile = mergeProfileData(
          {
            personalInfo: data.personalInfo,
            identityInfo: data.identityInfo,
          },
          localProfile,
          nextUser.email,
        )

        if (
          hasProfileDiff({ personalInfo: data.personalInfo, identityInfo: data.identityInfo }, mergedProfile)
        ) {
          const updates: Partial<FirebaseUserDocument> = {
            personalInfo: mergedProfile.personalInfo,
            identityInfo: mergedProfile.identityInfo,
            updatedAt: nowIso(),
          }
          await setDoc(doc(db, "users", nextUser.uid), updates, { merge: true })
          data = {
            ...data,
            ...updates,
          }
        }

        writeLocalProfile(nextUser.email, {
          personalInfo: data.personalInfo ?? {},
          identityInfo: data.identityInfo ?? {},
        })

        try {
          const sessionState = await syncServerMediaSession(nextUser)
          if (isMounted) {
            setIsAdminApproved(sessionState.isAdmin)
          }
        } catch (error) {
          if (error instanceof TypeError) {
            console.warn(`Media session sync skipped: server unreachable (${getApiTargetLabel()})`)
          } else {
            console.error("Media session sync failed", error)
          }
          if (isMounted) {
            setIsAdminApproved(false)
          }
        }

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

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      if (!nextUser) {
        return
      }

      try {
        const sessionState = await syncServerMediaSession(nextUser)
        setIsAdminApproved(sessionState.isAdmin)
      } catch (error) {
        if (error instanceof TypeError) {
          console.warn(`Media session refresh skipped: server unreachable (${getApiTargetLabel()})`)
          return
        }
        console.error("Media session refresh failed", error)
      }
    })

    return () => {
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
      const trimmedEmail = email.trim()
      if (!trimmedEmail || !password) return { success: false, errorCode: "auth/missing-credentials" }
      try {
        await applyPersistence(remember)
        const result = await signInWithEmailAndPassword(auth, trimmedEmail, password)
        const data = await ensureUserDocument(result.user)
        if (data.status === "desactive") {
          await signOut(auth)
          return { success: false, errorCode: "auth/user-disabled" }
        }
        if (data.deletionPlannedAt) {
          const deleteAtTime = new Date(data.deletionPlannedAt).getTime()
          if (Number.isFinite(deleteAtTime) && deleteAtTime <= Date.now()) {
            await signOut(auth)
            return { success: false, errorCode: "app/account-deleted" }
          }
        }
        return { success: true }
      } catch (error) {
        console.error("Login failed", error)
        return {
          success: false,
          errorCode: error instanceof FirebaseError ? error.code : "auth/unknown",
        }
      }
    },
    [applyPersistence],
  )

  const register = useCallback(
    async (credentials: { email: string; password: string; remember?: boolean; profile?: RegistrationProfile }) => {
      const { email, password, remember = false, profile } = credentials
      const trimmedEmail = email.trim()
      if (!trimmedEmail || !password) return { success: false, errorCode: "auth/missing-credentials" }
      try {
        await applyPersistence(remember)
        if (profile) {
          writeLocalProfile(trimmedEmail, {
            personalInfo: {
              firstName: profile.firstName?.trim() || "",
              lastName: profile.lastName?.trim() || "",
              email: trimmedEmail,
            },
            identityInfo: {
              username: profile.username?.trim() || "",
              birthday: profile.birthday?.trim() || "",
              gender: profile.gender?.trim() || "",
            },
          })
        }
        const result = await createUserWithEmailAndPassword(auth, trimmedEmail, password)
        const displayName = profile?.username || [profile?.firstName, profile?.lastName].filter(Boolean).join(" ")
        if (displayName) {
          await updateProfile(result.user, { displayName })
        }
        await ensureUserDocument(result.user, profile)
        // Send welcome email asynchronously to keep signup flow fast and resilient.
        void notifyWelcomeEmail(profile?.firstName).catch((error) => {
          if (error instanceof TypeError) {
            console.warn(`Welcome email skipped: server unreachable (${getApiTargetLabel()})`)
            return
          }
          console.error("Welcome email dispatch failed", error)
        })
        return { success: true }
      } catch (error) {
        console.error("Register failed", error)
        return {
          success: false,
          errorCode: error instanceof FirebaseError ? error.code : "auth/unknown",
        }
      }
    },
    [applyPersistence],
  )

  const loginWithGoogle = useCallback(
    async (credential?: string) => {
      try {
        await applyPersistence(true)
        const result: UserCredential = credential
          ? await signInWithCredential(auth, GoogleAuthProvider.credential(credential))
          : await signInWithPopup(auth, new GoogleAuthProvider())
        const data = await ensureUserDocument(result.user)
        if (data.status === "desactive") {
          await signOut(auth)
          return { success: false, errorCode: "auth/user-disabled" }
        }
        return { success: true }
      } catch (error) {
        console.error("Google login failed", error)
        return {
          success: false,
          errorCode: error instanceof FirebaseError ? error.code : "auth/unknown",
        }
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

  const updateUserProfile = useCallback(
    async (profile: UserProfileData) => {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error("Utilisateur non connecte.")
      }

      const mergedProfile = mergeProfileData(profile, undefined, currentUser.email)
      const updates: Partial<FirebaseUserDocument> = {
        personalInfo: mergedProfile.personalInfo,
        identityInfo: mergedProfile.identityInfo,
        updatedAt: nowIso(),
      }

      await setDoc(doc(db, "users", currentUser.uid), updates, { merge: true })
      writeLocalProfile(currentUser.email, mergedProfile)
      setUserDoc((prev) => (prev ? { ...prev, ...updates } : ({ ...updates } as FirebaseUserDocument)))
    },
    [],
  )

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
      return { success: false, error: "Tu dois être connecté pour changer ton mot de passe." }
    }
    if (!currentPassword || !newPassword) {
      return { success: false, error: "Tous les champs sont obligatoires." }
    }
    if (newPassword.length < 6) {
      return { success: false, error: "Le nouveau mot de passe doit contenir au moins 6 caractères." }
    }
    if (newPassword === currentPassword) {
      return { success: false, error: "Le nouveau mot de passe doit être différent de l’actuel." }
    }
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, newPassword)
      return { success: true }
    } catch (error) {
      console.error("Password change failed", error)
      return { success: false, error: "Mot de passe actuel invalide ou session expirée." }
    }
  }, [])

  const deactivateAccount = useCallback(async (): Promise<AccountActionResult> => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return { success: false, error: "Tu dois être connecté pour désactiver ton compte." }
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
      return { success: false, error: "Impossible de planifier la désactivation." }
    }
  }, [])

  const deleteAccount = useCallback(async (): Promise<AccountActionResult> => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return { success: false, error: "Tu dois être connecté pour supprimer ton compte." }
    }
    try {
      await deleteDoc(doc(db, "users", currentUser.uid))
    } catch (error) {
      console.error("User document delete failed", error)
    }

    try {
      await deleteUser(currentUser)
      return { success: true }
    } catch (error) {
      console.error("Account delete failed", error)
      return {
        success: false,
        error: "Suppression impossible sans reconnexion récente. Reconnecte-toi puis réessaie.",
      }
    }
  }, [])

  const deleteAccountViaServer = useCallback(async (): Promise<AccountActionResult> => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return { success: false, error: "Tu dois Ãªtre connectÃ© pour supprimer ton compte." }
    }

    try {
      const token = await currentUser.getIdToken()
      const response = await fetch(buildApiUrl("/api/account/delete"), {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        let reason = `status ${response.status}`
        try {
          const payload = (await response.json()) as { error?: string }
          if (payload?.error) {
            reason = payload.error
          }
        } catch {
          // ignore malformed response bodies
        }
        return { success: false, error: reason }
      }

      await signOut(auth)
      return { success: true }
    } catch (error) {
      if (error instanceof TypeError) {
        return { success: false, error: `Serveur compte inaccessible (${getApiTargetLabel()}).` }
      }
      console.error("Account delete failed", error)
      return {
        success: false,
        error: "Suppression complete impossible pour le moment.",
      }
    }
  }, [])

  const deleteAccountFinal = useCallback(async (): Promise<AccountActionResult> => {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return { success: false, error: "Tu dois etre connecte pour supprimer ton compte." }
    }

    try {
      const token = await currentUser.getIdToken()
      const response = await fetch(buildApiUrl("/api/account/delete"), {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        let reason = `status ${response.status}`
        try {
          const payload = (await response.json()) as { error?: string }
          if (payload?.error) {
            reason = payload.error
          }
        } catch {
          // ignore malformed response bodies
        }
        return { success: false, error: reason }
      }

      await signOut(auth)
      return { success: true }
    } catch (error) {
      if (error instanceof TypeError) {
        return { success: false, error: `Serveur compte inaccessible (${getApiTargetLabel()}).` }
      }
      console.error("Account delete failed", error)
      return {
        success: false,
        error: "Suppression complete impossible pour le moment.",
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
      return { success: false, error: "E-mail requis pour mettre à jour le statut." }
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
      return { success: false, error: "E-mail requis pour supprimer le compte." }
    }
    const currentEmail = auth.currentUser?.email
    if (currentEmail && normalizeEmail(currentEmail) === normalizeEmail(email)) {
      return { success: false, error: "Utilise la suppression de compte depuis tes paramètres." }
    }

    const currentUser = auth.currentUser
    if (!currentUser) {
      return { success: false, error: "Tu dois etre connecte pour effectuer cette action." }
    }

    try {
      const normalizedEmail = normalizeEmail(email)
      const token = await currentUser.getIdToken()
      const response = await fetch(buildApiUrl("/api/admin/users/delete"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      })

      if (!response.ok) {
        let reason = `status ${response.status}`
        try {
          const payload = (await response.json()) as { error?: string }
          if (payload?.error) {
            reason = payload.error
          }
        } catch {
          // ignore malformed response bodies
        }
        console.error("Admin delete failed", {
          email: normalizedEmail,
          status: response.status,
          reason,
        })
        return { success: false, error: reason }
      }

      return { success: true }
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Admin delete network error", {
          email,
          target: getApiTargetLabel(),
        })
        return { success: false, error: `Serveur admin inaccessible (${getApiTargetLabel()}).` }
      }
      console.error("Admin delete failed", error)
      return { success: false, error: "Suppression impossible avec les droits actuels." }
    }
  }, [])

  const adminResendWelcomeEmail = useCallback(
    async ({ email, firstName }: { email: string; firstName?: string }): Promise<AccountActionResult> => {
      const to = normalizeEmail(email)
      if (!to) {
        return { success: false, error: "E-mail requis pour renvoyer le message de bienvenue." }
      }

      const currentUser = auth.currentUser
      if (!currentUser) {
        return { success: false, error: "Tu dois etre connecte pour effectuer cette action." }
      }

      try {
        console.log("Admin welcome resend started", { to })
        const token = await currentUser.getIdToken()
        const response = await fetch(buildApiUrl("/api/email/welcome/admin-resend"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: to,
            firstName: firstName?.trim() || "",
          }),
        })

        if (!response.ok) {
          let reason = `status ${response.status}`
          try {
            const payload = (await response.json()) as { error?: string }
            if (payload?.error) {
              reason = payload.error
            }
          } catch {
            // ignore malformed response bodies
          }
          console.error("Admin welcome resend failed", {
            to,
            status: response.status,
            reason,
          })
          return { success: false, error: reason }
        }

        const payload = (await response.json().catch(() => ({}))) as {
          message?: string
          emailId?: string | null
          to?: string
        }
        console.log("Admin welcome resend succeeded", {
          to,
          emailId: payload?.emailId ?? null,
          backendTo: payload?.to ?? null,
        })
        return {
          success: true,
          message: payload?.emailId
            ? `E-mail envoye (id: ${payload.emailId}).`
            : payload?.message || "E-mail de bienvenue envoye.",
        }
      } catch (error) {
        if (error instanceof TypeError) {
          console.error("Admin welcome resend network error", {
            to,
            target: getApiTargetLabel(),
          })
          return { success: false, error: `Serveur email inaccessible (${getApiTargetLabel()}).` }
        }
        console.error("Admin welcome email resend failed", error)
        return { success: false, error: "Envoi du mail impossible avec les droits actuels." }
      }
    },
    [],
  )

  const userId = authUser?.uid ?? null

  const value = useMemo<AuthContextValue>(() => {
    const email = authUser?.email ?? null
    const isAdmin = isAdminApproved || Boolean(userDoc?.admin)
    const username = userDoc?.identityInfo?.username?.trim() || null
    const userProfile = mergeProfileData(
      {
        personalInfo: userDoc?.personalInfo,
        identityInfo: userDoc?.identityInfo,
      },
      undefined,
      email,
    )
    return {
      isAuthReady: authReady,
      isAuthenticated: Boolean(authUser),
      isAdmin,
      userId,
      userEmail: email,
      username,
      userProfile,
      createdAt: accountCreatedAt,
      updateUserProfile,
      login,
      register,
      loginWithGoogle,
      logout,
      verifyPassword,
      changePassword,
      deactivateAccount,
      deleteAccount: deleteAccountFinal,
      scheduledDeletionDate,
      adminListUsers,
      adminUpdateStatus,
      adminDeleteUser,
      adminResendWelcomeEmail,
    }
  }, [
    accountCreatedAt,
    adminDeleteUser,
    adminListUsers,
    adminResendWelcomeEmail,
    adminUpdateStatus,
    authReady,
    authUser,
    changePassword,
    deactivateAccount,
    deleteAccountFinal,
    isAdminApproved,
    login,
    loginWithGoogle,
    logout,
    register,
    scheduledDeletionDate,
    updateUserProfile,
    userDoc?.admin,
    userDoc?.identityInfo,
    userDoc?.personalInfo,
    userId,
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
