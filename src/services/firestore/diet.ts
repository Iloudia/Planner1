import {
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"
import type {
  DietCustomRecipe,
  DietFavoriteRecipeRef,
  DietMealSlotId,
  DietPreferences,
  DietRecipeRef,
  DietWeekDay,
  DietWeekPlan,
} from "../../types/personalization"
import { dietCustomRecipeDocRef, dietCustomRecipesCollectionRef, dietPreferencesDocRef, dietWeeklyPlanDocRef } from "./userPaths"
import { toMillis } from "./shared"

type DietWeekPlanDoc = Omit<DietWeekPlan, never> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type DietCustomRecipeDoc = Omit<DietCustomRecipe, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type DietPreferencesDoc = DietPreferences & {
  updatedAt?: Timestamp | null
}

const weekDays: DietWeekDay[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const mealSlots: DietMealSlotId[] = ["morning", "midday", "evening"]

const isRecipeSource = (value: unknown): value is DietRecipeRef["source"] => value === "builtin" || value === "custom"

const normalizeText = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback)

const normalizeStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : []

const normalizeFavoriteRecipes = (value: unknown): DietFavoriteRecipeRef[] => {
  if (!Array.isArray(value)) {
    return []
  }

  const seen = new Set<string>()
  const normalized: DietFavoriteRecipeRef[] = []
  value.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return
    }
    const source = (entry as { source?: unknown }).source
    const recipeId = (entry as { recipeId?: unknown }).recipeId
    if (!isRecipeSource(source)) {
      return
    }
    if (typeof recipeId !== "string" || !recipeId.trim()) {
      return
    }
    const key = `${source}:${recipeId}`
    if (seen.has(key)) {
      return
    }
    seen.add(key)
    normalized.push({ source, recipeId })
  })
  return normalized
}

const normalizeDietWeekPlan = (plan: DietWeekPlan, fallbackWeekKey?: string): DietWeekPlan => {
  const meals = weekDays.reduce<DietWeekPlan["meals"]>((accumulator, day) => {
    const dayMeals = plan.meals?.[day]
    accumulator[day] = {
      morning: normalizeText(dayMeals?.morning, ""),
      midday: normalizeText(dayMeals?.midday, ""),
      evening: normalizeText(dayMeals?.evening, ""),
    }
    return accumulator
  }, {} as DietWeekPlan["meals"])

  const recipeRefs = weekDays.reduce<DietWeekPlan["recipeRefs"]>((accumulator, day) => {
    const dayRecipeRefs = plan.recipeRefs?.[day]
    const nextDayRefs: Partial<Record<DietMealSlotId, DietRecipeRef>> = {}
    mealSlots.forEach((slot) => {
      const recipeRef = dayRecipeRefs?.[slot]
      if (!recipeRef) {
        return
      }
      if (!isRecipeSource(recipeRef.source)) {
        return
      }
      if (typeof recipeRef.recipeId !== "string" || !recipeRef.recipeId.trim()) {
        return
      }
      nextDayRefs[slot] = {
        source: recipeRef.source,
        recipeId: recipeRef.recipeId,
      }
    })
    accumulator[day] = nextDayRefs
    return accumulator
  }, {} as DietWeekPlan["recipeRefs"])

  const weekKey = typeof plan.weekKey === "string" && plan.weekKey ? plan.weekKey : fallbackWeekKey ?? ""
  const weekStartDate = typeof plan.weekStartDate === "string" && plan.weekStartDate ? plan.weekStartDate : weekKey

  return {
    weekKey,
    weekStartDate,
    meals,
    recipeRefs,
    shoppingNotes: normalizeText(plan.shoppingNotes, ""),
    cuisineGoalIds: normalizeStringArray(plan.cuisineGoalIds),
    fillOnlyEmpty: typeof plan.fillOnlyEmpty === "boolean" ? plan.fillOnlyEmpty : true,
  }
}

export const subscribeToDietWeekPlan = (
  userId: string,
  weekKey: string,
  onPlan: (plan: DietWeekPlan | null) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe =>
  onSnapshot(
    dietWeeklyPlanDocRef(userId, weekKey),
    (snapshot) => {
      if (!snapshot.exists()) {
        onPlan(null)
        return
      }
      const data = snapshot.data() as DietWeekPlanDoc
      onPlan(
        normalizeDietWeekPlan(
          {
            weekKey: data.weekKey,
            weekStartDate: data.weekStartDate,
            meals: data.meals,
            recipeRefs: data.recipeRefs,
            shoppingNotes: data.shoppingNotes,
            cuisineGoalIds: data.cuisineGoalIds,
            fillOnlyEmpty: data.fillOnlyEmpty,
          },
          weekKey,
        ),
      )
    },
    onError,
  )

export const subscribeToDietCustomRecipes = (
  userId: string,
  onRecipes: (recipes: DietCustomRecipe[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const recipesQuery = query(dietCustomRecipesCollectionRef(userId), orderBy("createdAt", "desc"))
  return onSnapshot(
    recipesQuery,
    (snapshot) => {
      onRecipes(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as DietCustomRecipeDoc
          const flavor = data.flavor === "sucre" ? "sucre" : "sale"
          return {
            id: docSnap.id,
            title: normalizeText(data.title, "Recette perso"),
            flavor,
            prepTime: normalizeText(data.prepTime, "-"),
            servings: normalizeText(data.servings, "-"),
            imageUrl: normalizeText(data.imageUrl, ""),
            imagePath: data.imagePath,
            ingredients: normalizeStringArray(data.ingredients),
            steps: normalizeStringArray(data.steps),
            toppings: normalizeStringArray(data.toppings),
            tips: normalizeStringArray(data.tips),
            createdAt: toMillis(data.createdAt),
            updatedAt: toMillis(data.updatedAt),
          }
        }),
      )
    },
    onError,
  )
}

export const subscribeToDietPreferences = (
  userId: string,
  onPreferences: (preferences: DietPreferences | null) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe =>
  onSnapshot(
    dietPreferencesDocRef(userId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onPreferences(null)
        return
      }
      const data = snapshot.data() as DietPreferencesDoc
      onPreferences({
        favoriteRecipes: normalizeFavoriteRecipes(data.favoriteRecipes),
      })
    },
    onError,
  )

export const saveDietWeekPlan = async (userId: string, plan: DietWeekPlan) => {
  const normalizedPlan = normalizeDietWeekPlan(plan, plan.weekKey)
  await setDoc(
    dietWeeklyPlanDocRef(userId, normalizedPlan.weekKey),
    {
      weekKey: normalizedPlan.weekKey,
      weekStartDate: normalizedPlan.weekStartDate,
      meals: normalizedPlan.meals,
      recipeRefs: normalizedPlan.recipeRefs,
      shoppingNotes: normalizedPlan.shoppingNotes,
      cuisineGoalIds: normalizedPlan.cuisineGoalIds,
      fillOnlyEmpty: normalizedPlan.fillOnlyEmpty,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const saveDietCustomRecipe = async (userId: string, recipe: DietCustomRecipe) => {
  const flavor = recipe.flavor === "sucre" ? "sucre" : "sale"
  const title = normalizeText(recipe.title, "Recette perso").trim() || "Recette perso"
  const prepTime = normalizeText(recipe.prepTime, "-").trim() || "-"
  const servings = normalizeText(recipe.servings, "-").trim() || "-"
  const imageUrl = normalizeText(recipe.imageUrl, "")
  const imagePath = typeof recipe.imagePath === "string" && recipe.imagePath.trim() ? recipe.imagePath : null
  const createdAt =
    typeof recipe.createdAt === "number" && Number.isFinite(recipe.createdAt)
      ? Timestamp.fromMillis(recipe.createdAt)
      : serverTimestamp()

  await setDoc(
    dietCustomRecipeDocRef(userId, recipe.id),
    {
      title,
      flavor,
      prepTime,
      servings,
      imageUrl,
      imagePath,
      ingredients: normalizeStringArray(recipe.ingredients),
      steps: normalizeStringArray(recipe.steps),
      toppings: normalizeStringArray(recipe.toppings),
      tips: normalizeStringArray(recipe.tips),
      createdAt,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteDietCustomRecipe = async (userId: string, recipeId: string) => {
  await deleteDoc(dietCustomRecipeDocRef(userId, recipeId))
}

export const saveDietPreferences = async (userId: string, preferences: DietPreferences) => {
  const favoriteRecipes = normalizeFavoriteRecipes(preferences.favoriteRecipes)
  await setDoc(
    dietPreferencesDocRef(userId),
    {
      favoriteRecipes,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
