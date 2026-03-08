import { getDoc, setDoc } from "firebase/firestore"
import type { FirebaseUserDocument } from "../../models/firebase"
import type {
  DietCustomRecipe,
  DietFavoriteRecipeRef,
  DietWeekMeals,
  DietWeekPlan,
  SelfLoveArchiveEntry,
  WishlistCategoryRecord,
  WishlistItemRecord,
} from "../../types/personalization"
import { buildUserScopedKey } from "../../utils/userScopedKey"
import { uploadImage } from "../media/api"
import { saveDietCustomRecipe, saveDietPreferences, saveDietWeekPlan } from "./diet"
import { saveSelfLoveArchiveEntry } from "./selfLove"
import { userDocRef } from "./userPaths"
import { baseWishlistCategoryIds, WISHLIST_DEFINITION_VERSION } from "./wishlistDefinitions"
import { saveWishlistCategory, saveWishlistItem } from "./wishlist"

type PlannerMigrationKey = "wishlist" | "diet" | "selfLoveArchives"

type LegacyWishlistItem = {
  id: string
  categoryId: string
  title: string
  subtitle?: string
  imageUrl?: string
  imageName?: string
  link?: string
  subcategory?: string
  isDone?: boolean
}

type LegacyWishlistEntry = {
  title?: string
  items?: LegacyWishlistItem[]
  note?: string
  isFavorite?: boolean
  accent?: string
  cover?: string
  blurb?: string
  createdAt?: number
  order?: number
  usageCount?: number
  lastUsedAt?: number
  definitionVersion?: number
}

type LegacyWishlistState = Record<string, LegacyWishlistEntry>

type LegacySelfLoveLetter = {
  id: string
  template?: "classic" | "kitty"
  to?: string
  from?: string
  body?: string
  createdAt?: string
  openDate?: string
  sealedAt?: string
  innerChild?: { message: string; reassurance: string; neededWords: string }
  bestFriend?: { advice: string; selfTalk: string }
  entryType?: "letter" | "innerChild" | "bestFriend"
}

type LegacySelfLoveState = {
  savedLetters?: LegacySelfLoveLetter[]
}

type LegacyDietRecipe = {
  id: string
  title: string
  flavor: "sucre" | "sale"
  prepTime: string
  servings: string
  image?: string | null
  ingredients: string[]
  steps: string[]
  toppings?: string[]
  tips?: string[]
}

type LegacyRecipeMap = Record<string, Partial<Record<"morning" | "midday" | "evening", { id?: string }>>>

const migrationFieldMap: Record<PlannerMigrationKey, keyof NonNullable<FirebaseUserDocument["plannerMigrations"]>> = {
  wishlist: "wishlistImportedAt",
  diet: "dietImportedAt",
  selfLoveArchives: "selfLoveArchivesImportedAt",
}

const nowIso = () => new Date().toISOString()

const isBrowser = typeof window !== "undefined"

const isDataUrl = (value?: string | null) => typeof value === "string" && value.startsWith("data:")

const isRemoteUrl = (value?: string | null) => typeof value === "string" && /^https?:\/\//i.test(value)

const sanitizeName = (value: string, fallback: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback

const readUserStorage = <T,>(userEmail: string | null | undefined, key: string): T | null => {
  if (!isBrowser) return null
  const storageKey = buildUserScopedKey(userEmail, key)
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

const readUserStorageValue = (userEmail: string | null | undefined, key: string) => {
  if (!isBrowser) return null
  return window.localStorage.getItem(buildUserScopedKey(userEmail, key))
}

const dataUrlToFile = async (dataUrl: string, baseName: string) => {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  const mimeType = blob.type || "image/png"
  const extension = mimeType.split("/")[1] || "png"
  return new File([blob], `${sanitizeName(baseName, "media")}.${extension}`, { type: mimeType })
}

const maybeUploadLegacyImage = async (value: string | undefined, scope: Parameters<typeof uploadImage>[1], entityId: string) => {
  if (!value) return null
  if (isDataUrl(value)) {
    const file = await dataUrlToFile(value, entityId)
    const uploaded = await uploadImage(file, scope, entityId)
    return { url: uploaded.url, path: uploaded.path }
  }
  if (isRemoteUrl(value)) {
    return { url: value, path: undefined }
  }
  return null
}

const hasMigration = (docData: FirebaseUserDocument | undefined, key: PlannerMigrationKey) =>
  Boolean(docData?.plannerMigrations?.[migrationFieldMap[key]])

const markMigrationComplete = async (userId: string, key: PlannerMigrationKey) => {
  await setDoc(
    userDocRef(userId),
    {
      plannerMigrations: {
        [migrationFieldMap[key]]: nowIso(),
      },
    },
    { merge: true },
  )
}

export const ensurePlannerMigrationState = async (
  userId: string,
  key: PlannerMigrationKey,
  hasRemoteData: boolean,
) => {
  const snapshot = await getDoc(userDocRef(userId))
  const data = snapshot.data() as FirebaseUserDocument | undefined
  if (hasMigration(data, key)) {
    return { shouldRun: false, docData: data }
  }
  if (hasRemoteData) {
    await markMigrationComplete(userId, key)
    return { shouldRun: false, docData: data }
  }
  return { shouldRun: true, docData: data }
}

export const importLegacyWishlistIfNeeded = async (
  userId: string,
  userEmail: string | null | undefined,
  existingCategories: WishlistCategoryRecord[],
  existingItems: WishlistItemRecord[],
) => {
  const state = await ensurePlannerMigrationState(userId, "wishlist", existingCategories.length > 0 || existingItems.length > 0)
  if (!state.shouldRun) {
    return false
  }

  const legacy = readUserStorage<LegacyWishlistState>(userEmail, "planner.wishlist")
  if (!legacy || Object.keys(legacy).length === 0) {
    await markMigrationComplete(userId, "wishlist")
    return false
  }

  for (const [categoryId, entry] of Object.entries(legacy)) {
    const uploadedCover = await maybeUploadLegacyImage(entry.cover, "wishlist-category-cover", categoryId)
    const category: WishlistCategoryRecord = {
      id: categoryId,
      title: entry.title?.trim() || "Nouvelle categorie",
      blurb: entry.blurb?.trim() || "Ta categorie personnalisee.",
      accent: entry.accent?.trim() || "#f6a6c1",
      note: entry.note?.trim() || "",
      isFavorite: Boolean(entry.isFavorite),
      isBase: baseWishlistCategoryIds.has(categoryId),
      coverMode: uploadedCover?.url ? "custom" : "default",
      customCoverUrl: uploadedCover?.url,
      customCoverPath: uploadedCover?.path,
      order: typeof entry.order === "number" ? entry.order : entry.createdAt ?? Date.now(),
      usageCount: typeof entry.usageCount === "number" ? entry.usageCount : 0,
      lastUsedAt: typeof entry.lastUsedAt === "number" ? entry.lastUsedAt : 0,
      definitionVersion: entry.definitionVersion ?? WISHLIST_DEFINITION_VERSION,
      createdAt: entry.createdAt ?? Date.now(),
    }
    await saveWishlistCategory(userId, category)

    const legacyItems = Array.isArray(entry.items) ? entry.items : []
    for (let index = 0; index < legacyItems.length; index += 1) {
      const legacyItem = legacyItems[index]
      const uploadedImage = await maybeUploadLegacyImage(
        legacyItem.imageUrl,
        "wishlist-item-image",
        legacyItem.id || `${categoryId}-${index}`,
      )
      const item: WishlistItemRecord = {
        id: legacyItem.id || `${categoryId}-${Date.now()}-${index}`,
        categoryId,
        title: legacyItem.title?.trim() || "Element wishlist",
        subtitle: legacyItem.subtitle?.trim() || undefined,
        imageUrl: uploadedImage?.url,
        imagePath: uploadedImage?.path,
        imageName: legacyItem.imageName?.trim() || undefined,
        link: legacyItem.link?.trim() || undefined,
        subcategory: legacyItem.subcategory?.trim() || undefined,
        isDone: Boolean(legacyItem.isDone),
        sortOrder: Date.now() - index,
        createdAt: Date.now() - index,
      }
      await saveWishlistItem(userId, item)
    }
  }

  await markMigrationComplete(userId, "wishlist")
  return true
}

const normalizeDietMeals = (raw: unknown): DietWeekMeals => {
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const
  const meals = {} as DietWeekMeals
  for (const day of days) {
    const dayValue = raw && typeof raw === "object" ? (raw as Record<string, Record<string, string>>)[day] : undefined
    meals[day] = {
      morning: dayValue?.morning ?? "",
      midday: dayValue?.midday ?? "",
      evening: dayValue?.evening ?? "",
    }
  }
  return meals
}

const migrateLegacyDietImage = async (recipe: LegacyDietRecipe) => {
  if (!recipe.image) {
    return { imageUrl: "", imagePath: undefined }
  }
  const uploaded = await maybeUploadLegacyImage(recipe.image, "diet-custom-recipe-image", recipe.id)
  if (!uploaded) {
    return { imageUrl: "", imagePath: undefined }
  }
  return { imageUrl: uploaded.url, imagePath: uploaded.path }
}

const resolveFavoriteRefs = (favoriteIds: string[], customRecipeIds: Set<string>): DietFavoriteRecipeRef[] =>
  favoriteIds.map((recipeId) => ({
    source: customRecipeIds.has(recipeId) ? "custom" : "builtin",
    recipeId,
  }))

export const importLegacyDietIfNeeded = async (
  userId: string,
  userEmail: string | null | undefined,
  weekKey: string,
  hasWeekPlan: boolean,
  hasCustomRecipes: boolean,
  hasPreferences: boolean,
) => {
  const state = await ensurePlannerMigrationState(userId, "diet", hasWeekPlan || hasCustomRecipes || hasPreferences)
  if (!state.shouldRun) {
    return false
  }

  const weeklyPlanRaw = readUserStorage<Record<string, Record<string, string>>>(userEmail, "planner.diet.weeklyPlan")
  const weeklyRecipesRaw = readUserStorage<LegacyRecipeMap>(userEmail, "planner.diet.weeklyPlanRecipes")
  const customRecipesRaw = readUserStorage<LegacyDietRecipe[]>(userEmail, "planner.diet.customRecipes") ?? []
  const favoriteIdsRaw = readUserStorage<string[]>(userEmail, "planner.diet.recipeFavorites") ?? []
  const shoppingNotes = readUserStorageValue(userEmail, "planner.diet.groceriesNotes") ?? ""
  const cuisineGoals = readUserStorage<string[]>(userEmail, "planner.diet.cuisineGoals") ?? ["equilibre"]
  const fillOnlyEmptyStored = readUserStorageValue(userEmail, "planner.diet.generator.fillOnlyEmpty")
  const fillOnlyEmpty = fillOnlyEmptyStored == null ? true : fillOnlyEmptyStored === "true"

  if (!weeklyPlanRaw && customRecipesRaw.length === 0 && favoriteIdsRaw.length === 0 && !shoppingNotes.trim()) {
    await markMigrationComplete(userId, "diet")
    return false
  }

  const customRecipeIds = new Set<string>()
  for (const recipe of customRecipesRaw) {
    const media = await migrateLegacyDietImage(recipe)
    customRecipeIds.add(recipe.id)
    const nextRecipe: DietCustomRecipe = {
      id: recipe.id,
      title: recipe.title?.trim() || "Recette perso",
      flavor: recipe.flavor,
      prepTime: recipe.prepTime?.trim() || "-",
      servings: recipe.servings?.trim() || "-",
      imageUrl: media.imageUrl,
      imagePath: media.imagePath,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps : [],
      toppings: Array.isArray(recipe.toppings) ? recipe.toppings : [],
      tips: Array.isArray(recipe.tips) ? recipe.tips : [],
      createdAt: Date.now(),
    }
    await saveDietCustomRecipe(userId, nextRecipe)
  }

  const meals = normalizeDietMeals(weeklyPlanRaw)
  const recipeRefs: DietWeekPlan["recipeRefs"] = {
    Lundi: {},
    Mardi: {},
    Mercredi: {},
    Jeudi: {},
    Vendredi: {},
    Samedi: {},
    Dimanche: {},
  }

  for (const [day, slots] of Object.entries(weeklyRecipesRaw ?? {})) {
    if (!(day in recipeRefs) || !slots) continue
    for (const slot of ["morning", "midday", "evening"] as const) {
      const recipeId = slots[slot]?.id
      if (!recipeId) continue
      recipeRefs[day as keyof typeof recipeRefs][slot] = {
        source: customRecipeIds.has(recipeId) ? "custom" : "builtin",
        recipeId,
      }
    }
  }

  await saveDietWeekPlan(userId, {
    weekKey,
    weekStartDate: weekKey,
    meals,
    recipeRefs,
    shoppingNotes,
    cuisineGoalIds: Array.isArray(cuisineGoals) && cuisineGoals.length > 0 ? cuisineGoals : ["equilibre"],
    fillOnlyEmpty,
  })

  await saveDietPreferences(userId, {
    favoriteRecipes: resolveFavoriteRefs(Array.isArray(favoriteIdsRaw) ? favoriteIdsRaw : [], customRecipeIds),
  })

  await markMigrationComplete(userId, "diet")
  return true
}

export const importLegacySelfLoveArchivesIfNeeded = async (
  userId: string,
  userEmail: string | null | undefined,
  hasArchiveEntries: boolean,
) => {
  const state = await ensurePlannerMigrationState(userId, "selfLoveArchives", hasArchiveEntries)
  if (!state.shouldRun) {
    return false
  }

  const legacy = readUserStorage<LegacySelfLoveState>(userEmail, "planner.selfLove")
  const savedLetters = legacy?.savedLetters ?? []
  if (savedLetters.length === 0) {
    await markMigrationComplete(userId, "selfLoveArchives")
    return false
  }

  for (const letter of savedLetters) {
    const createdAt = letter.createdAt ? new Date(letter.createdAt).getTime() : Date.now()
    const entry: SelfLoveArchiveEntry = {
      id: letter.id,
      entryType: letter.entryType ?? "letter",
      template: letter.template ?? "classic",
      to: letter.to,
      from: letter.from,
      body: letter.body,
      openDate: letter.openDate,
      sealedAt: letter.sealedAt,
      innerChild: letter.innerChild,
      bestFriend: letter.bestFriend,
      createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
    }
    await saveSelfLoveArchiveEntry(userId, entry)
  }

  await markMigrationComplete(userId, "selfLoveArchives")
  return true
}
