export type FirebaseUserDocument = {
  email: string
  emailLower: string
  updatedAt: string
  createdAt?: string | null
  admin?: boolean
  status?: "actif" | "desactive"
  deletionPlannedAt?: string | null
  profilePhotoUrl?: string | null
  profilePhotoPath?: string | null
  acceptTerms?: boolean
  personalInfo?: {
    firstName?: string
    lastName?: string
    email?: string
  }
  identityInfo?: {
    username?: string
    birthday?: string
    gender?: string
  }
  onboarding?: {
    source?: string
    sourceOther?: string
    reasons?: string[]
    reasonsOther?: string
    categories?: string[]
    completedAt?: string
  }
  plannerMigrations?: {
    wishlistImportedAt?: string
    dietImportedAt?: string
    selfLoveArchivesImportedAt?: string
  }
  homeCardOrder?: string[]
  homeCardClickProgress?: Record<string, number>
  homeTodos?: Array<{
    id: string
    text: string
    done: boolean
  }>
}
