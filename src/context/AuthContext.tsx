import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

const ADMIN_EMAIL = "admin@planner.local"
const ADMIN_PASSWORD = "Admin!2025#Planner"

export type AuthContextValue = {
  isAuthenticated: boolean
  isAdmin: boolean
  userEmail: string | null
  login: (credentials: { email: string; password: string; remember?: boolean }) => boolean
  register: (credentials: { email: string; password: string; remember?: boolean }) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = "planner.auth.user"

type StoredUser = {
  email: string
  password: string
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<StoredUser | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as StoredUser
        if (parsed?.email && parsed?.password) {
          setUser(parsed)
        }
      }
    } catch (error) {
      console.error("Auth storage read failed", error)
    }
  }, [])

  const persistUser = (nextUser: StoredUser | null) => {
    setUser(nextUser)
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const login = (credentials: { email: string; password: string; remember?: boolean }) => {
    const { email, password, remember = true } = credentials
    if (!email || !password) return false
    if (remember) {
      persistUser({ email, password })
    } else {
      setUser({ email, password })
      localStorage.removeItem(STORAGE_KEY)
    }
    return true
  }

  const register = (credentials: { email: string; password: string; remember?: boolean }) => {
    const { email, password, remember = true } = credentials
    if (!email || !password) return false
    if (remember) {
      persistUser({ email, password })
    } else {
      setUser({ email, password })
      localStorage.removeItem(STORAGE_KEY)
    }
    return true
  }

  const logout = () => persistUser(null)

  const value = useMemo<AuthContextValue>(() => {
    const email = user?.email ?? null
    const isAdmin = email?.toLowerCase() === ADMIN_EMAIL && user?.password === ADMIN_PASSWORD
    return {
      isAuthenticated: Boolean(user),
      isAdmin,
      userEmail: email,
      login,
      register,
      logout,
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
