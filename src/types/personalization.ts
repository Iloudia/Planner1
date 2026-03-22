export type MoodValue = "bright" | "good" | "neutral" | "low" | "overwhelmed"
export type EnergyLevel = "low" | "medium" | "high"
export type PostFeeling = "better" | "same" | "clearer" | "tiredRelieved"
export type AnchorType = "gratitude" | "victory"

export type JournalEntry = {
  id: string
  date: string
  mood?: MoodValue | string
  energy?: EnergyLevel
  keyword?: string
  question?: string
  questionAnswer?: string
  content?: string
  postFeeling?: PostFeeling
  positiveAnchor?: string
  positiveAnchorType?: AnchorType | string
  createdAt?: number
}

export type JournalEntryInput = Omit<JournalEntry, "id" | "createdAt">

export type ExpenseCategory =
  | "food"
  | "housing"
  | "transport"
  | "clothing"
  | "beauty"
  | "leisure"
  | "health"
  | "friends"

export type FlowDirection = "in" | "out"

export type FinanceEntry = {
  id: string
  label: string
  amount: number
  date: string
  direction: FlowDirection
  category?: ExpenseCategory
}

export type FinanceEntryInput = Omit<FinanceEntry, "id">

export type MonthlySnapshot = {
  startingAmount: number
}

export type MediaRef = {
  url: string
  path: string
}

export type WishlistCategoryId = string

export type WishlistCategoryRecord = {
  id: WishlistCategoryId
  title: string
  blurb: string
  accent: string
  note: string
  isFavorite: boolean
  isBase: boolean
  coverMode: "default" | "custom"
  customCoverUrl?: string
  customCoverPath?: string
  order: number
  usageCount: number
  lastUsedAt: number
  definitionVersion?: number
  createdAt?: number
  updatedAt?: number
}

export type WishlistItemRecord = {
  id: string
  categoryId: WishlistCategoryId
  title: string
  subtitle?: string
  imageUrl?: string
  imagePath?: string
  imageName?: string
  link?: string
  subcategory?: string
  isDone: boolean
  sortOrder: number
  createdAt?: number
  updatedAt?: number
}

export type SportQuickItem = {
  id: string
  text: string
  sortOrder: number
}

export type SportLifeCardKey = "workout" | "diet" | "goals"

export type SportDashboardRecord = {
  quickItems: SportQuickItem[]
  lifeCardMedia: Partial<Record<SportLifeCardKey, MediaRef>>
}

export type SportBoardDay = {
  id: string
  label: string
  dateISO: string
  activity: string
  done: boolean
}

export type SportWeekBoardRecord = {
  weekKey: string
  weekStartDate: string
  days: SportBoardDay[]
}

export type WorkoutExercise = {
  id: string
  title: string
  muscle: string
  category: string
  note: string
  imageMode: "default" | "custom"
  imageUrl?: string
  imagePath?: string
  isDefault: boolean
  defaultKey?: string
  sortOrder: number
  createdAt?: number
  updatedAt?: number
}

export type WorkoutVideo = {
  id: string
  title: string
  url: string
  thumbnailMode: "default" | "custom"
  thumbnailUrl: string
  thumbnailPath?: string
  duration?: string
  isDefault: boolean
  sortOrder: number
  createdAt?: number
  updatedAt?: number
}

export type WorkoutSeriesItem = {
  id: string
  exerciseId: string
  label: string
  completed: boolean
  weight?: string
  sortOrder: number
  createdAt?: number
  updatedAt?: number
}

export type WorkoutSettings = {
  lastResetDate: string
}

export type SelfLoveDraft = {
  letterTo: string
  letterFrom: string
  letterBody: string
  kittyLetterBody: string
  futureLetterTo: string
  futureLetterFrom: string
  futureLetterBody: string
  futureLetterOpenDate: string
  innerChildMessage: string
  innerChildReassurance: string
  innerChildNeededWords: string
  bestFriendAdvice: string
  bestFriendSelfTalk: string
  bestFriendSelfKindness: string
}

export type SelfLovePhotoSlot = {
  id: string
  slotIndex: number
  imageUrl?: string
  imagePath?: string
  updatedAt?: number
}

export type BodyGoalPhotoSlot = {
  id: string
  slotIndex: number
  imageUrl?: string
  imagePath?: string
  updatedAt?: number
}

export type SelfLoveQuality = {
  id: string
  text: string
  sortOrder: number
  isDefault: boolean
  createdAt?: number
  updatedAt?: number
}

export type SelfLoveThought = {
  id: string
  text: string
  sortOrder: number
  isDefault: boolean
  createdAt?: number
  updatedAt?: number
}

export type SelfLoveInnerChildSnapshot = {
  message: string
  reassurance: string
  neededWords: string
}

export type SelfLoveBestFriendSnapshot = {
  advice: string
  selfTalk: string
  selfKindness?: string
}

export type SelfLoveArchiveEntry = {
  id: string
  entryType: "letter" | "innerChild" | "bestFriend"
  template?: "classic" | "kitty"
  to?: string
  from?: string
  body?: string
  openDate?: string
  sealedAt?: string
  innerChild?: SelfLoveInnerChildSnapshot
  bestFriend?: SelfLoveBestFriendSnapshot
  createdAt?: number
  updatedAt?: number
}

export type RoutinePeriod = "morning" | "evening"

export type RoutineRecord = {
  id: string
  period: RoutinePeriod
  title: string
  detail?: string
  isCompleted: boolean
  isDefault: boolean
  sortOrder: number
  createdAt?: number
  updatedAt?: number
}

export type DailyGoalsTrackerRecord = {
  weekKey: string
  rows: string[]
  checks: boolean[][]
  updatedAt?: number
}

export type DietWeekDay =
  | "Lundi"
  | "Mardi"
  | "Mercredi"
  | "Jeudi"
  | "Vendredi"
  | "Samedi"
  | "Dimanche"

export type DietMealSlotId = "morning" | "midday" | "evening"

export type DietRecipeSource = "builtin" | "custom"

export type DietRecipeRef = {
  source: DietRecipeSource
  recipeId: string
}

export type DietWeekMeals = Record<DietWeekDay, Record<DietMealSlotId, string>>

export type DietWeekRecipeRefs = Record<DietWeekDay, Partial<Record<DietMealSlotId, DietRecipeRef>>>

export type DietWeekPlan = {
  weekKey: string
  weekStartDate: string
  meals: DietWeekMeals
  recipeRefs: DietWeekRecipeRefs
  shoppingNotes: string
  cuisineGoalIds: string[]
  fillOnlyEmpty: boolean
}

export type DietCustomRecipe = {
  id: string
  title: string
  flavor: "sucre" | "sale"
  prepTime: string
  servings: string
  imageUrl: string
  imagePath?: string
  ingredients: string[]
  steps: string[]
  toppings: string[]
  tips: string[]
  createdAt?: number
  updatedAt?: number
}

export type DietFavoriteRecipeRef = {
  source: DietRecipeSource
  recipeId: string
}

export type DietPreferences = {
  favoriteRecipes: DietFavoriteRecipeRef[]
}
