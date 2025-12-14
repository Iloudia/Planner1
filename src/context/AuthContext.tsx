import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

const ADMIN_EMAIL = "admin@planner.local"
const ADMIN_PASSWORD = "Admin!2025#Planner"
const SESSION_ID_KEY = "planner.auth.sessionId"
const SESSION_MAP_KEY = "planner.auth.sessions"
const ACCOUNT_DEACTIVATION_KEY = "planner.account.deactivation"

type ChangePasswordResult = {
  success: boolean
  error?: string
}

type AccountActionResult = {
  success: boolean
  error?: string
  deleteAt?: string
}

export type AuthContextValue = {
  isAuthenticated: boolean
  isAdmin: boolean
  userEmail: string | null
  createdAt: string | null
  login: (credentials: { email: string; password: string; remember?: boolean }) => boolean
  register: (credentials: { email: string; password: string; remember?: boolean }) => boolean
  loginWithGoogle: (credential: string) => boolean
  logout: () => void
  verifyPassword: (input: string) => boolean
  changePassword: (currentPassword: string, newPassword: string) => ChangePasswordResult
  deactivateAccount: () => AccountActionResult
  deleteAccount: () => AccountActionResult
  scheduledDeletionDate: string | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = "planner.auth.user"
const ACCOUNT_META_KEY = "planner.account.meta"
const USERS_STORAGE_KEY = "planner.auth.users"

type StoredUser = {
  email: string
  password: string
}

type RegisteredUser = {
  email: string
  password: string
}

type AccountMeta = {
  createdAt: string
}

type SessionMap = Record<string, string[]>
type DeactivationRecord = {
  deleteAt: string
}
type DeactivationMap = Record<string, DeactivationRecord>

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30

const normalizeEmail = (value: string) => value.trim().toLowerCase()

const readSessionMap = (): SessionMap => {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(SESSION_MAP_KEY)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object") {
      return parsed as SessionMap
    }
  } catch (error) {
    console.error("Session map read failed", error)
  }
  return {}
}

const writeSessionMap = (map: SessionMap) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(SESSION_MAP_KEY, JSON.stringify(map))
  } catch (error) {
    console.error("Session map write failed", error)
  }
}

const readDeactivationMap = (): DeactivationMap => {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(ACCOUNT_DEACTIVATION_KEY)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object") {
      return parsed as DeactivationMap
    }
  } catch (error) {
    console.error("Deactivation map read failed", error)
  }
  return {}
}

const writeDeactivationMap = (map: DeactivationMap) => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(ACCOUNT_DEACTIVATION_KEY, JSON.stringify(map))
  } catch (error) {
    console.error("Deactivation map write failed", error)
  }
}

const getDeactivationEntry = (email: string) => {
  const normalized = normalizeEmail(email)
  const map = readDeactivationMap()
  return map[normalized]
}

const scheduleDeactivationForEmail = (email: string, deleteAt: string) => {
  const normalized = normalizeEmail(email)
  const map = readDeactivationMap()
  map[normalized] = { deleteAt }
  writeDeactivationMap(map)
}

const clearDeactivationForEmail = (email: string) => {
  const normalized = normalizeEmail(email)
  const map = readDeactivationMap()
  if (map[normalized]) {
    delete map[normalized]
    writeDeactivationMap(map)
  }
}

const addSessionForEmail = (email: string, sessionId: string) => {
  if (!email || !sessionId) return
  const normalized = normalizeEmail(email)
  const map = readSessionMap()
  const existing = map[normalized] ?? []
  if (!existing.includes(sessionId)) {
    map[normalized] = [...existing, sessionId]
    writeSessionMap(map)
  }
}

const removeSessionForEmail = (email: string, sessionId: string) => {
  if (!email || !sessionId) return
  const normalized = normalizeEmail(email)
  const map = readSessionMap()
  const existing = map[normalized]
  if (!existing) return
  const next = existing.filter((id) => id !== sessionId)
  if (next.length > 0) {
    map[normalized] = next
  } else {
    delete map[normalized]
  }
  writeSessionMap(map)
}

const replaceSessionsForEmail = (email: string, sessionIds: string[]) => {
  const normalized = normalizeEmail(email)
  const unique = sessionIds.filter(Boolean)
  const map = readSessionMap()
  if (unique.length > 0) {
    map[normalized] = Array.from(new Set(unique))
  } else {
    delete map[normalized]
  }
  writeSessionMap(map)
}

const isSessionAllowedForEmail = (email: string, sessionId: string | null) => {
  if (!email || !sessionId) return false
  const normalized = normalizeEmail(email)
  const map = readSessionMap()
  const allowed = map[normalized]
  if (!allowed || allowed.length === 0) {
    return true
  }
  return allowed.includes(sessionId)
}

const generateSessionId = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }
  return `sess-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
}

const readStoredSessionIdentifier = () => {
  if (typeof window === "undefined") return null
  try {
    return window.sessionStorage.getItem(SESSION_ID_KEY) ?? window.localStorage.getItem(SESSION_ID_KEY)
  } catch (error) {
    console.error("Session identifier read failed", error)
    return null
  }
}

const persistSessionIdentifier = (value: string | null, remember: boolean) => {
  if (typeof window === "undefined") return
  try {
    if (value) {
      window.sessionStorage.setItem(SESSION_ID_KEY, value)
      if (remember) {
        window.localStorage.setItem(SESSION_ID_KEY, value)
      } else {
        window.localStorage.removeItem(SESSION_ID_KEY)
      }
    } else {
      window.sessionStorage.removeItem(SESSION_ID_KEY)
      window.localStorage.removeItem(SESSION_ID_KEY)
    }
  } catch (error) {
    console.error("Session identifier write failed", error)
  }
}

const readAccountMetaMap = (): Record<string, AccountMeta> => {
  try {
    const raw = localStorage.getItem(ACCOUNT_META_KEY)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, AccountMeta>
    }
  } catch (error) {
    console.error("Account meta read failed", error)
  }
  return {}
}

const writeAccountMetaMap = (map: Record<string, AccountMeta>) => {
  try {
    localStorage.setItem(ACCOUNT_META_KEY, JSON.stringify(map))
  } catch (error) {
    console.error("Account meta write failed", error)
  }
}

const ensureAccountMeta = (email: string): AccountMeta => {
  const map = readAccountMetaMap()
  if (!map[email]) {
    map[email] = { createdAt: new Date().toISOString() }
    writeAccountMetaMap(map)
  }
  return map[email]
}

const readRegisteredUsers = (): RegisteredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is RegisteredUser => !!item?.email && !!item?.password)
    }
  } catch (error) {
    console.error("Registered users read failed", error)
  }
  return []
}

const writeRegisteredUsers = (users: RegisteredUser[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Registered users write failed", error)
  }
}

const upsertRegisteredUser = (email: string, password: string) => {
  const normalizedEmail = email.trim()
  const users = readRegisteredUsers()
  const index = users.findIndex((user) => user.email.toLowerCase() === normalizedEmail.toLowerCase())
  if (index >= 0) {
    users[index] = { email: normalizedEmail, password }
  } else {
    users.push({ email: normalizedEmail, password })
  }
  writeRegisteredUsers(users)
}

const removeRegisteredUserEntry = (email: string) => {
  const normalizedEmail = normalizeEmail(email)
  const users = readRegisteredUsers().filter((user) => user.email.toLowerCase() !== normalizedEmail)
  writeRegisteredUsers(users)
}

const findRegisteredUser = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase()
  return readRegisteredUsers().find((user) => user.email.toLowerCase() === normalizedEmail)
}

const deleteAccountMetaEntry = (email: string) => {
  const map = readAccountMetaMap()
  const normalized = normalizeEmail(email)
  if (map[normalized]) {
    delete map[normalized]
    writeAccountMetaMap(map)
  }
}

const purgeAccountData = (email: string) => {
  removeRegisteredUserEntry(email)
  deleteAccountMetaEntry(email)
  clearDeactivationForEmail(email)
}

const evaluateDeactivationStatus = (email: string) => {
  const entry = getDeactivationEntry(email)
  if (!entry) {
    return { allowed: true, deleteAt: null as string | null }
  }
  const deleteAtTime = new Date(entry.deleteAt).getTime()
  if (Number.isFinite(deleteAtTime) && deleteAtTime <= Date.now()) {
    purgeAccountData(email)
    return { allowed: false, deleteAt: null as string | null }
  }
  return { allowed: true, deleteAt: entry.deleteAt }
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [accountCreatedAt, setAccountCreatedAt] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(() => readStoredSessionIdentifier())
  const [rememberChoice, setRememberChoice] = useState(false)
  const [scheduledDeletionDate, setScheduledDeletionDate] = useState<string | null>(null)

  const isValidCredential = (candidate: StoredUser | null) => {
    if (!candidate?.email || !candidate?.password) {
      return false
    }
    const normalizedEmail = candidate.email.trim()
    if (normalizedEmail.toLowerCase() === ADMIN_EMAIL && candidate.password === ADMIN_PASSWORD) {
      return true
    }
    const registered = findRegisteredUser(normalizedEmail)
    return Boolean(registered && registered.password === candidate.password)
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        persistSessionIdentifier(null, false)
        setSessionId(null)
        return
      }
      const parsed = JSON.parse(raw) as StoredUser
      if (!isValidCredential(parsed)) {
        localStorage.removeItem(STORAGE_KEY)
        persistSessionIdentifier(null, false)
        setSessionId(null)
        return
      }
      const status = evaluateDeactivationStatus(parsed.email)
      if (!status.allowed) {
        localStorage.removeItem(STORAGE_KEY)
        persistSessionIdentifier(null, false)
        setSessionId(null)
        setScheduledDeletionDate(null)
        return
      }
      let storedSession = readStoredSessionIdentifier()
      if (storedSession && !isSessionAllowedForEmail(parsed.email, storedSession)) {
        localStorage.removeItem(STORAGE_KEY)
        persistSessionIdentifier(null, false)
        setSessionId(null)
        return
      }
      if (!storedSession) {
        storedSession = beginSession(parsed.email, true)
      } else {
        ensureSessionRegistered(parsed.email, storedSession, true)
      }
      setUser(parsed)
      setRememberChoice(true)
      setScheduledDeletionDate(status.deleteAt ?? null)
    } catch (error) {
      console.error("Auth storage read failed", error)
    }
  }, [])

  useEffect(() => {
    if (user?.email) {
      const meta = ensureAccountMeta(user.email)
      setAccountCreatedAt(meta.createdAt)
    } else {
      setAccountCreatedAt(null)
    }
  }, [user?.email])

  useEffect(() => {
    if (!user?.email) {
      setScheduledDeletionDate(null)
      return
    }
    const status = evaluateDeactivationStatus(user.email)
    if (!status.allowed) {
      endSession(user.email)
      persistUser(null)
      return
    }
    setScheduledDeletionDate(status.deleteAt ?? null)
  }, [user?.email])

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleStorage = () => {
      if (user?.email && sessionId && !isSessionAllowedForEmail(user.email, sessionId)) {
        removeSessionForEmail(user.email, sessionId)
        persistUser(null)
        setSessionId(null)
        persistSessionIdentifier(null, false)
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [sessionId, user?.email])

  const persistUser = (nextUser: StoredUser | null, remember = false) => {
    setUser(nextUser)
    setRememberChoice(Boolean(nextUser) && remember)
    if (!nextUser) {
      setScheduledDeletionDate(null)
    }
    try {
      if (nextUser && remember) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error("Auth storage write failed", error)
    }
  }

  const beginSession = (email: string, remember: boolean) => {
    const newSessionId = generateSessionId()
    setSessionId(newSessionId)
    persistSessionIdentifier(newSessionId, remember)
    addSessionForEmail(email, newSessionId)
    return newSessionId
  }

  const ensureSessionRegistered = (email: string, id: string, remember: boolean) => {
    if (!id) return
    setSessionId(id)
    persistSessionIdentifier(id, remember)
    addSessionForEmail(email, id)
  }

  const endSession = (email?: string | null) => {
    if (email && sessionId) {
      removeSessionForEmail(email, sessionId)
    }
    setSessionId(null)
    persistSessionIdentifier(null, false)
  }

  const login = (credentials: { email: string; password: string; remember?: boolean }) => {
    const { email, password, remember = false } = credentials
    if (!email || !password) return false
    const normalizedEmail = email.trim()
    const status = evaluateDeactivationStatus(normalizedEmail)
    if (!status.allowed) {
      return false
    }

    if (normalizedEmail.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      ensureAccountMeta(normalizedEmail)
      persistUser({ email: normalizedEmail, password }, remember)
      beginSession(normalizedEmail, remember)
      upsertRegisteredUser(normalizedEmail, password)
      setScheduledDeletionDate(status.deleteAt ?? null)
      return true
    }

    const registeredUser = findRegisteredUser(normalizedEmail)
    if (!registeredUser || registeredUser.password !== password) {
      return false
    }

    ensureAccountMeta(registeredUser.email)
    persistUser({ email: registeredUser.email, password: registeredUser.password }, remember)
    beginSession(registeredUser.email, remember)
    setScheduledDeletionDate(status.deleteAt ?? null)
    return true
  }

  const register = (credentials: { email: string; password: string; remember?: boolean }) => {
    const { email, password, remember = false } = credentials
    if (!email || !password) return false
    const normalizedEmail = email.trim()
    upsertRegisteredUser(normalizedEmail, password)
    ensureAccountMeta(normalizedEmail)
    persistUser({ email: normalizedEmail, password }, remember)
    beginSession(normalizedEmail, remember)
    setScheduledDeletionDate(null)
    return true
  }

  const logout = () => {
    endSession(user?.email ?? null)
    persistUser(null)
  }

  const loginWithGoogle = (credential: string) => {
    try {
      const payload = credential.split(".")[1]
      const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/")
      const decodedPayload = atob(normalizedPayload)
      const parsed = JSON.parse(decodedPayload) as { email?: string }
      if (!parsed.email) {
        return false
      }
      ensureAccountMeta(parsed.email)
      upsertRegisteredUser(parsed.email, "__google__")
      persistUser({ email: parsed.email, password: "__google__" }, true)
      beginSession(parsed.email, true)
      return true
    } catch (error) {
      console.error("Invalid Google credential", error)
      return false
    }
  }

  const verifyPassword = (input: string) => {
    if (!user) return false
    return user.password === input
  }

  const changePassword = (currentPassword: string, newPassword: string): ChangePasswordResult => {
    if (!user?.email) {
      return { success: false, error: "Vous devez etre connecte pour changer votre mot de passe." }
    }
    if (user.password === "__google__") {
      return { success: false, error: "Ce compte utilise la connexion Google. Changez votre mot de passe depuis Google." }
    }
    if (!currentPassword || !newPassword) {
      return { success: false, error: "Tous les champs sont obligatoires." }
    }
    if (!verifyPassword(currentPassword)) {
      return { success: false, error: "Le mot de passe actuel est incorrect." }
    }
    if (newPassword.length < 6) {
      return { success: false, error: "Le nouveau mot de passe doit contenir au moins 6 caracteres." }
    }
    if (newPassword === currentPassword) {
      return { success: false, error: "Le nouveau mot de passe doit etre different de l actuel." }
    }
    upsertRegisteredUser(user.email, newPassword)
    const updatedUser = { email: user.email, password: newPassword }
    const remember = rememberChoice
    persistUser(updatedUser, remember)
    let activeSessionId = sessionId
    if (!activeSessionId) {
      activeSessionId = beginSession(user.email, remember)
    } else {
      ensureSessionRegistered(user.email, activeSessionId, remember)
    }
    replaceSessionsForEmail(user.email, activeSessionId ? [activeSessionId] : [])
    return { success: true }
  }

  const deactivateAccount = (): AccountActionResult => {
    if (!user?.email) {
      return { success: false, error: "Vous devez etre connecte pour desactiver votre compte." }
    }
    const deleteAt = new Date(Date.now() + THIRTY_DAYS_MS).toISOString()
    scheduleDeactivationForEmail(user.email, deleteAt)
    setScheduledDeletionDate(deleteAt)
    return { success: true, deleteAt }
  }

  const deleteAccount = (): AccountActionResult => {
    if (!user?.email) {
      return { success: false, error: "Vous devez etre connecte pour supprimer votre compte." }
    }
    purgeAccountData(user.email)
    setScheduledDeletionDate(null)
    endSession(user.email)
    persistUser(null)
    return { success: true }
  }

  const value = useMemo<AuthContextValue>(() => {
    const email = user?.email ?? null
    const isAdmin = email?.toLowerCase() === ADMIN_EMAIL && user?.password === ADMIN_PASSWORD
    return {
      isAuthenticated: Boolean(user),
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
    }
  }, [user, accountCreatedAt, scheduledDeletionDate])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
