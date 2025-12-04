import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

const ADMIN_EMAIL = "admin@planner.local"
const ADMIN_PASSWORD = "Admin!2025#Planner"

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

const findRegisteredUser = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase()
  return readRegisteredUsers().find((user) => user.email.toLowerCase() === normalizedEmail)
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [accountCreatedAt, setAccountCreatedAt] = useState<string | null>(null)

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
      if (raw) {
        const parsed = JSON.parse(raw) as StoredUser
        if (isValidCredential(parsed)) {
          setUser(parsed)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
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

  const persistUser = (nextUser: StoredUser | null, remember = false) => {
    setUser(nextUser)
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

  const login = (credentials: { email: string; password: string; remember?: boolean }) => {
    const { email, password, remember = false } = credentials
    if (!email || !password) return false
    const normalizedEmail = email.trim()

    if (normalizedEmail.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      ensureAccountMeta(normalizedEmail)
      persistUser({ email: normalizedEmail, password }, remember)
      upsertRegisteredUser(normalizedEmail, password)
      return true
    }

    const registeredUser = findRegisteredUser(normalizedEmail)
    if (!registeredUser || registeredUser.password !== password) {
      return false
    }

    ensureAccountMeta(registeredUser.email)
    persistUser({ email: registeredUser.email, password: registeredUser.password }, remember)
    return true
  }

  const register = (credentials: { email: string; password: string; remember?: boolean }) => {
    const { email, password, remember = false } = credentials
    if (!email || !password) return false
    const normalizedEmail = email.trim()
    upsertRegisteredUser(normalizedEmail, password)
    ensureAccountMeta(normalizedEmail)
    persistUser({ email: normalizedEmail, password }, remember)
    return true
  }

  const logout = () => persistUser(null)

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
    }
  }, [user, accountCreatedAt])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
