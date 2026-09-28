import { createContext, useCallback, useContext, useEffect, useState, type ComponentType, type ReactNode } from "react"
import type { FirebaseUserDocument } from "../models/firebase"

export type UserProfileData = Pick<FirebaseUserDocument, "personalInfo" | "identityInfo">

export type AccountStatus = "actif" | "desactive"

export type AdminUserRecord = {
  email: string
  createdAt: string | null
  status: AccountStatus
  deletionPlannedAt: string | null
  personalInfo?: {
    firstName?: string
    lastName?: string
  }
  identityInfo?: {
    username?: string
    gender?: string
  }
  onboarding?: {
    source?: string
    sourceOther?: string
    reasons?: string[]
    reasonsOther?: string
    categories?: string[]
    priority?: string[]
    completedAt?: string | null
  }
}

export type ChangePasswordResult = {
  success: boolean
  error?: string
}

export type AuthAttemptResult = {
  success: boolean
  errorCode?: string
}

export type AccountActionResult = {
  success: boolean
  error?: string
  deleteAt?: string
  message?: string
}

export type RegistrationProfile = {
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

export type AuthProviderProps = {
  children: ReactNode
}

const authNotReady = (): AuthAttemptResult => ({ success: false, errorCode: "auth/initializing" })
const accountNotReady = (): AccountActionResult => ({ success: false, error: "Initialisation de la connexion en cours." })

const loadingAuthValue: AuthContextValue = {
  isAuthReady: false,
  isAuthenticated: false,
  isAdmin: false,
  userId: null,
  userEmail: null,
  username: null,
  userProfile: { personalInfo: {}, identityInfo: {} },
  createdAt: null,
  updateUserProfile: async () => undefined,
  login: async () => authNotReady(),
  register: async () => authNotReady(),
  loginWithGoogle: async () => authNotReady(),
  logout: async () => undefined,
  verifyPassword: async () => false,
  changePassword: async () => ({ success: false, error: "Initialisation de la connexion en cours." }),
  deactivateAccount: async () => accountNotReady(),
  deleteAccount: async () => accountNotReady(),
  scheduledDeletionDate: null,
  adminListUsers: async () => [],
  adminUpdateStatus: async () => accountNotReady(),
  adminDeleteUser: async () => accountNotReady(),
  adminResendWelcomeEmail: async () => accountNotReady(),
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type FirebaseAuthBridgeProps = {
  onValue: (value: AuthContextValue) => void
}

type FirebaseAuthBridge = ComponentType<FirebaseAuthBridgeProps>
let firebaseBridgePromise: Promise<FirebaseAuthBridge> | null = null

const loadFirebaseBridge = () => {
  firebaseBridgePromise ??= import("./AuthContextFirebase").then(({ FirebaseAuthBridge }) => FirebaseAuthBridge)
  return firebaseBridgePromise
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authValue, setAuthValue] = useState<AuthContextValue>(loadingAuthValue)
  const [FirebaseAuthBridge, setFirebaseAuthBridge] = useState<FirebaseAuthBridge | null>(null)

  useEffect(() => {
    let active = true
    void loadFirebaseBridge().then((Bridge) => {
      if (active) setFirebaseAuthBridge(() => Bridge)
    })
    return () => {
      active = false
    }
  }, [])

  const updateAuthValue = useCallback((value: AuthContextValue) => {
    setAuthValue(value)
  }, [])

  return (
    <AuthContext.Provider value={authValue}>
      {children}
      {FirebaseAuthBridge ? <FirebaseAuthBridge onValue={updateAuthValue} /> : null}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
