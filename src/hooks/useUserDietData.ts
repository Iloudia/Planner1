import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type {
  DietCustomRecipe,
  DietFavoriteRecipeRef,
  DietMealSlotId,
  DietPreferences,
  DietRecipeRef,
  DietWeekDay,
  DietWeekPlan,
} from "../types/personalization"
import { createClientId } from "../utils/clientId"
import { importLegacyDietIfNeeded } from "../services/firestore/plannerMigrations"
import {
  deleteDietCustomRecipe,
  saveDietCustomRecipe,
  saveDietPreferences,
  saveDietWeekPlan,
  subscribeToDietCustomRecipes,
  subscribeToDietPreferences,
  subscribeToDietWeekPlan,
} from "../services/firestore/diet"

const DIET_LOAD_ERROR = "Impossible de charger votre espace alimentation."
const DIET_MUTATION_ERROR = "Impossible de mettre a jour vos donnees alimentation."

const weekDays: DietWeekDay[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
const mealSlots: DietMealSlotId[] = ["morning", "midday", "evening"]

const buildEmptyMeals = (): DietWeekPlan["meals"] =>
  weekDays.reduce<DietWeekPlan["meals"]>((accumulator, day) => {
    accumulator[day] = {
      morning: "",
      midday: "",
      evening: "",
    }
    return accumulator
  }, {} as DietWeekPlan["meals"])

const buildEmptyRecipeRefs = (): DietWeekPlan["recipeRefs"] =>
  weekDays.reduce<DietWeekPlan["recipeRefs"]>((accumulator, day) => {
    accumulator[day] = {}
    return accumulator
  }, {} as DietWeekPlan["recipeRefs"])

const buildDefaultWeekPlan = (weekKey: string): DietWeekPlan => ({
  weekKey,
  weekStartDate: weekKey,
  meals: buildEmptyMeals(),
  recipeRefs: buildEmptyRecipeRefs(),
  shoppingNotes: "",
  cuisineGoalIds: ["equilibre"],
  fillOnlyEmpty: true,
})

const emptyPreferences: DietPreferences = {
  favoriteRecipes: [],
}

const removeRecipeRefFromPlan = (plan: DietWeekPlan, day: DietWeekDay, slot: DietMealSlotId) => {
  const dayRefs = plan.recipeRefs[day] ?? {}
  const nextDayRefs = { ...dayRefs }
  delete nextDayRefs[slot]
  return {
    ...plan,
    recipeRefs: {
      ...plan.recipeRefs,
      [day]: nextDayRefs,
    },
  }
}

const sameRecipeRef = (left: DietFavoriteRecipeRef, right: DietFavoriteRecipeRef) =>
  left.source === right.source && left.recipeId === right.recipeId

const useUserDietData = (weekKey: string) => {
  const { isAuthReady, userId, userEmail } = useAuth()
  const [weekPlan, setWeekPlan] = useState<DietWeekPlan | null>(null)
  const [customRecipes, setCustomRecipes] = useState<DietCustomRecipe[]>([])
  const [preferences, setPreferences] = useState<DietPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const seedAttemptRef = useRef(false)
  const migrationAttemptRef = useRef(false)
  const [migrationResolved, setMigrationResolved] = useState(false)

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setWeekPlan(null)
      setCustomRecipes([])
      setPreferences(null)
      setError(null)
      setIsLoading(false)
      seedAttemptRef.current = false
      migrationAttemptRef.current = false
      setMigrationResolved(false)
      return
    }

    let planLoaded = false
    let recipesLoaded = false
    let preferencesLoaded = false
    const syncLoadingState = () => setIsLoading(!(planLoaded && recipesLoaded && preferencesLoaded))

    setWeekPlan(null)
    setCustomRecipes([])
    setPreferences(null)
    setError(null)
    setIsLoading(true)
    seedAttemptRef.current = false
    migrationAttemptRef.current = false
    setMigrationResolved(false)

    const unsubscribePlan = subscribeToDietWeekPlan(
      userId,
      weekKey,
      (nextPlan) => {
        planLoaded = true
        setWeekPlan(nextPlan)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Diet week plan load failed", loadError)
        planLoaded = true
        setWeekPlan(null)
        setError(DIET_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeRecipes = subscribeToDietCustomRecipes(
      userId,
      (nextRecipes) => {
        recipesLoaded = true
        setCustomRecipes(nextRecipes)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Diet recipes load failed", loadError)
        recipesLoaded = true
        setCustomRecipes([])
        setError(DIET_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribePreferences = subscribeToDietPreferences(
      userId,
      (nextPreferences) => {
        preferencesLoaded = true
        setPreferences(nextPreferences)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Diet preferences load failed", loadError)
        preferencesLoaded = true
        setPreferences(null)
        setError(DIET_LOAD_ERROR)
        syncLoadingState()
      },
    )

    return () => {
      unsubscribePlan()
      unsubscribeRecipes()
      unsubscribePreferences()
    }
  }, [isAuthReady, userId, weekKey])

  useEffect(() => {
    if (!userId || !userEmail || isLoading || migrationAttemptRef.current) {
      return
    }
    migrationAttemptRef.current = true
    void importLegacyDietIfNeeded(
      userId,
      userEmail,
      weekKey,
      Boolean(weekPlan),
      customRecipes.length > 0,
      Boolean(preferences),
    )
      .catch((migrationError) => {
        console.error("Diet migration failed", migrationError)
        setError(DIET_MUTATION_ERROR)
      })
      .finally(() => {
        setMigrationResolved(true)
      })
  }, [customRecipes.length, isLoading, preferences, userEmail, userId, weekKey, weekPlan])

  useEffect(() => {
    if (!userId || isLoading || seedAttemptRef.current || !migrationResolved) {
      return
    }
    if (weekPlan && preferences) {
      return
    }
    seedAttemptRef.current = true
    void (async () => {
      try {
        await Promise.all([
          weekPlan ? Promise.resolve() : saveDietWeekPlan(userId, buildDefaultWeekPlan(weekKey)),
          preferences ? Promise.resolve() : saveDietPreferences(userId, emptyPreferences),
        ])
      } catch (seedError) {
        console.error("Diet seed failed", seedError)
        setError(DIET_MUTATION_ERROR)
      }
    })()
  }, [isLoading, migrationResolved, preferences, userId, weekKey, weekPlan])

  const mutate = useCallback(
    async (operation: () => Promise<void>) => {
      try {
        setError(null)
        await operation()
      } catch (mutationError) {
        console.error("Diet mutation failed", mutationError)
        setError(DIET_MUTATION_ERROR)
        throw mutationError
      }
    },
    [],
  )

  const activePlan = weekPlan ?? buildDefaultWeekPlan(weekKey)
  const activePreferences = preferences ?? emptyPreferences

  const saveWeekPlan = useCallback(
    async (plan: DietWeekPlan) => {
      if (!userId) return
      await mutate(() => saveDietWeekPlan(userId, plan))
    },
    [mutate, userId],
  )

  const updateMeal = useCallback(
    async (day: DietWeekDay, slot: DietMealSlotId, value: string) => {
      if (!userId) return
      const nextPlanBase = {
        ...activePlan,
        meals: {
          ...activePlan.meals,
          [day]: {
            ...activePlan.meals[day],
            [slot]: value,
          },
        },
      }
      const currentValue = activePlan.meals[day]?.[slot] ?? ""
      const nextPlan = currentValue === value ? nextPlanBase : removeRecipeRefFromPlan(nextPlanBase, day, slot)
      await mutate(() => saveDietWeekPlan(userId, nextPlan))
    },
    [activePlan, mutate, userId],
  )

  const saveShoppingNotes = useCallback(
    async (shoppingNotes: string) => {
      if (!userId) return
      await mutate(() => saveDietWeekPlan(userId, { ...activePlan, shoppingNotes }))
    },
    [activePlan, mutate, userId],
  )

  const saveCuisineGoals = useCallback(
    async (cuisineGoalIds: string[]) => {
      if (!userId) return
      await mutate(() => saveDietWeekPlan(userId, { ...activePlan, cuisineGoalIds }))
    },
    [activePlan, mutate, userId],
  )

  const saveFillOnlyEmpty = useCallback(
    async (fillOnlyEmpty: boolean) => {
      if (!userId) return
      await mutate(() => saveDietWeekPlan(userId, { ...activePlan, fillOnlyEmpty }))
    },
    [activePlan, mutate, userId],
  )

  const assignRecipeToSlot = useCallback(
    async (day: DietWeekDay, slot: DietMealSlotId, mealName: string, recipeRef: DietRecipeRef) => {
      if (!userId) return
      await mutate(() =>
        saveDietWeekPlan(userId, {
          ...activePlan,
          meals: {
            ...activePlan.meals,
            [day]: {
              ...activePlan.meals[day],
              [slot]: mealName,
            },
          },
          recipeRefs: {
            ...activePlan.recipeRefs,
            [day]: {
              ...(activePlan.recipeRefs[day] ?? {}),
              [slot]: recipeRef,
            },
          },
        }),
      )
    },
    [activePlan, mutate, userId],
  )

  const removeRecipeFromSlot = useCallback(
    async (day: DietWeekDay, slot: DietMealSlotId) => {
      if (!userId) return
      const nextPlan = removeRecipeRefFromPlan(
        {
          ...activePlan,
          meals: {
            ...activePlan.meals,
            [day]: {
              ...activePlan.meals[day],
              [slot]: "",
            },
          },
        },
        day,
        slot,
      )
      await mutate(() => saveDietWeekPlan(userId, nextPlan))
    },
    [activePlan, mutate, userId],
  )

  const toggleFavoriteRecipe = useCallback(
    async (recipeRef: DietFavoriteRecipeRef) => {
      if (!userId) return
      const exists = activePreferences.favoriteRecipes.some((entry) => sameRecipeRef(entry, recipeRef))
      const favoriteRecipes = exists
        ? activePreferences.favoriteRecipes.filter((entry) => !sameRecipeRef(entry, recipeRef))
        : [...activePreferences.favoriteRecipes, recipeRef]
      await mutate(() => saveDietPreferences(userId, { favoriteRecipes }))
    },
    [activePreferences.favoriteRecipes, mutate, userId],
  )

  const createCustomRecipe = useCallback(
    async (input: Omit<DietCustomRecipe, "id" | "createdAt" | "updatedAt">) => {
      if (!userId) return null
      const recipe: DietCustomRecipe = {
        id: createClientId("diet-recipe"),
        title: input.title.trim(),
        flavor: input.flavor,
        prepTime: input.prepTime.trim() || "-",
        servings: input.servings.trim() || "-",
        imageUrl: input.imageUrl,
        imagePath: input.imagePath,
        ingredients: input.ingredients,
        steps: input.steps,
        toppings: input.toppings,
        tips: input.tips,
        createdAt: Date.now(),
      }
      await mutate(() => saveDietCustomRecipe(userId, recipe))
      return recipe.id
    },
    [mutate, userId],
  )

  const updateCustomRecipe = useCallback(
    async (recipeId: string, updates: Partial<DietCustomRecipe>) => {
      if (!userId) return
      const current = customRecipes.find((recipe) => recipe.id === recipeId)
      if (!current) return
      await mutate(() => saveDietCustomRecipe(userId, { ...current, ...updates }))
    },
    [customRecipes, mutate, userId],
  )

  const removeCustomRecipe = useCallback(
    async (recipeId: string) => {
      if (!userId) return
      await mutate(() => deleteDietCustomRecipe(userId, recipeId))
    },
    [mutate, userId],
  )

  return useMemo(
    () => ({
      weekPlan: activePlan,
      customRecipes,
      favoriteRecipes: activePreferences.favoriteRecipes,
      isLoading,
      error,
      saveWeekPlan,
      updateMeal,
      saveShoppingNotes,
      saveCuisineGoals,
      saveFillOnlyEmpty,
      assignRecipeToSlot,
      removeRecipeFromSlot,
      toggleFavoriteRecipe,
      createCustomRecipe,
      updateCustomRecipe,
      deleteCustomRecipe: removeCustomRecipe,
    }),
    [
      activePlan,
      activePreferences.favoriteRecipes,
      assignRecipeToSlot,
      createCustomRecipe,
      customRecipes,
      error,
      isLoading,
      removeCustomRecipe,
      removeRecipeFromSlot,
      saveWeekPlan,
      saveCuisineGoals,
      saveFillOnlyEmpty,
      saveShoppingNotes,
      toggleFavoriteRecipe,
      updateCustomRecipe,
      updateMeal,
    ],
  )
}

export default useUserDietData
