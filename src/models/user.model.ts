export type UserOnboarding = {
  source?: string
  sourceOther?: string
  reasons?: string[]
  reasonsOther?: string
  categories?: string[]
  priority?: string[]
  completedAt?: string
}

export type UserPersonalInfo = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export type UserIdentityInfo = {
  username?: string
  birthday?: string
  gender?: string
  language?: string
  country?: string
}

export type UserModel = {
  uid: string
  email: string
  createdAt?: string
  updatedAt?: string
  admin?: boolean
  status?: "actif" | "desactive"
  deletionPlannedAt?: string | null
  onboarding?: UserOnboarding
  personalInfo?: UserPersonalInfo
  identityInfo?: UserIdentityInfo
  // Reserve for future extensions: preferences, metrics, etc.
}
