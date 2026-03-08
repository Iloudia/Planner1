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
import type { DietCustomRecipe, DietPreferences, DietWeekPlan } from "../../types/personalization"
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
      onPlan({
        weekKey: data.weekKey,
        weekStartDate: data.weekStartDate,
        meals: data.meals,
        recipeRefs: data.recipeRefs,
        shoppingNotes: data.shoppingNotes,
        cuisineGoalIds: data.cuisineGoalIds,
        fillOnlyEmpty: data.fillOnlyEmpty,
      })
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
          return {
            id: docSnap.id,
            title: data.title,
            flavor: data.flavor,
            prepTime: data.prepTime,
            servings: data.servings,
            imageUrl: data.imageUrl,
            imagePath: data.imagePath,
            ingredients: data.ingredients ?? [],
            steps: data.steps ?? [],
            toppings: data.toppings ?? [],
            tips: data.tips ?? [],
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
        favoriteRecipes: Array.isArray(data.favoriteRecipes) ? data.favoriteRecipes : [],
      })
    },
    onError,
  )

export const saveDietWeekPlan = async (userId: string, plan: DietWeekPlan) => {
  await setDoc(
    dietWeeklyPlanDocRef(userId, plan.weekKey),
    {
      weekKey: plan.weekKey,
      weekStartDate: plan.weekStartDate,
      meals: plan.meals,
      recipeRefs: plan.recipeRefs,
      shoppingNotes: plan.shoppingNotes,
      cuisineGoalIds: plan.cuisineGoalIds,
      fillOnlyEmpty: plan.fillOnlyEmpty,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const saveDietCustomRecipe = async (userId: string, recipe: DietCustomRecipe) => {
  await setDoc(
    dietCustomRecipeDocRef(userId, recipe.id),
    {
      title: recipe.title,
      flavor: recipe.flavor,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      imageUrl: recipe.imageUrl,
      imagePath: recipe.imagePath ?? null,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      toppings: recipe.toppings,
      tips: recipe.tips,
      createdAt: recipe.createdAt ? Timestamp.fromMillis(recipe.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteDietCustomRecipe = async (userId: string, recipeId: string) => {
  await deleteDoc(dietCustomRecipeDocRef(userId, recipeId))
}

export const saveDietPreferences = async (userId: string, preferences: DietPreferences) => {
  await setDoc(
    dietPreferencesDocRef(userId),
    {
      favoriteRecipes: preferences.favoriteRecipes,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
