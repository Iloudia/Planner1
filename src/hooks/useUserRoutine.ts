import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { eveningRoutine as defaultEveningRoutine, morningRoutine as defaultMorningRoutine } from "../data/sampleData"
import { useAuth } from "../context/AuthContext"
import type { RoutineRecord, RoutineSettings } from "../types/personalization"
import { createClientId } from "../utils/clientId"
import { formatLocalISODate } from "../utils/weekKey"
import { deleteRoutineItem, getRoutineSettings, saveRoutineItem, saveRoutineSettings, subscribeToRoutineItems } from "../services/firestore/routine"

const ROUTINE_LOAD_ERROR = "Impossible de charger tes routines."
const ROUTINE_MUTATION_ERROR = "Impossible de mettre à jour tes routines."

const ROUTINE_TITLE_MIGRATIONS: Record<string, string> = {
  "morning-1": "Étirements doux",
}

const getTodayKey = () => formatLocalISODate(new Date())

const isItemCompletedOnDate = (item: RoutineRecord, dateKey: string) => {
  if (!item.isCompleted || !item.updatedAt) {
    return false
  }
  return formatLocalISODate(new Date(item.updatedAt)) === dateKey
}

const seededDefaults: RoutineRecord[] = [
  ...defaultMorningRoutine.map((item, index) => ({
    id: item.id,
    period: "morning" as const,
    title: item.title,
    detail: item.detail,
    isCompleted: false,
    isDefault: true,
    sortOrder: index,
  })),
  ...defaultEveningRoutine.map((item, index) => ({
    id: item.id,
    period: "evening" as const,
    title: item.title,
    detail: item.detail,
    isCompleted: false,
    isDefault: true,
    sortOrder: index,
  })),
]

const useUserRoutine = () => {
  const { isAuthReady, userId } = useAuth()
  const [items, setItems] = useState<RoutineRecord[]>([])
  const [settings, setSettings] = useState<RoutineSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [todayKey, setTodayKey] = useState(getTodayKey)
  const seedAttemptRef = useRef(false)
  const settingsBackfillAttemptRef = useRef(false)
  const migrationAttemptRef = useRef(false)

  useEffect(() => {
    let timeoutId: number | null = null
    const scheduleNextDayCheck = () => {
      const now = new Date()
      const nextMidnight = new Date(now)
      nextMidnight.setHours(24, 0, 0, 50)
      timeoutId = window.setTimeout(() => {
        setTodayKey(getTodayKey())
        scheduleNextDayCheck()
      }, Math.max(nextMidnight.getTime() - now.getTime(), 1000))
    }

    scheduleNextDayCheck()
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setItems([])
      setSettings(null)
      setError(null)
      setIsLoading(false)
      seedAttemptRef.current = false
      settingsBackfillAttemptRef.current = false
      migrationAttemptRef.current = false
      return
    }

    setItems([])
    setSettings(null)
    setError(null)
    setIsLoading(true)
    seedAttemptRef.current = false
    settingsBackfillAttemptRef.current = false
    migrationAttemptRef.current = false

    let itemsLoaded = false
    let settingsLoaded = false
    const syncLoadingState = () => setIsLoading(!(itemsLoaded && settingsLoaded))

    const unsubscribeItems = subscribeToRoutineItems(
      userId,
      (nextItems) => {
        itemsLoaded = true
        setItems(nextItems)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Routine load failed", loadError)
        itemsLoaded = true
        setItems([])
        setError(ROUTINE_LOAD_ERROR)
        syncLoadingState()
      },
    )

    void getRoutineSettings(userId)
      .then((nextSettings) => {
        settingsLoaded = true
        setSettings(nextSettings)
        syncLoadingState()
      })
      .catch((loadError) => {
        console.error("Routine settings load failed", loadError)
        settingsLoaded = true
        setSettings(null)
        setError(ROUTINE_LOAD_ERROR)
        syncLoadingState()
      })

    return unsubscribeItems
  }, [isAuthReady, userId])

  useEffect(() => {
    if (!userId || isLoading || settings || settingsBackfillAttemptRef.current || items.length === 0) {
      return
    }

    settingsBackfillAttemptRef.current = true
    void (async () => {
      try {
        const nextSettings = { seededAt: Date.now() }
        await saveRoutineSettings(userId, nextSettings)
        setSettings(nextSettings)
      } catch (backfillError) {
        console.error("Routine settings backfill failed", backfillError)
        setError(ROUTINE_MUTATION_ERROR)
      }
    })()
  }, [isLoading, items.length, settings, userId])

  useEffect(() => {
    if (!userId || isLoading || settings || seedAttemptRef.current || items.length > 0) {
      return
    }
    seedAttemptRef.current = true
    void (async () => {
      try {
        const nextSettings = { seededAt: Date.now() }
        await Promise.all([
          ...seededDefaults.map((item) => saveRoutineItem(userId, item)),
          saveRoutineSettings(userId, nextSettings),
        ])
        setSettings(nextSettings)
      } catch (seedError) {
        console.error("Routine seed failed", seedError)
        setError(ROUTINE_MUTATION_ERROR)
      }
    })()
  }, [isLoading, items.length, settings, userId])

  useEffect(() => {
    if (!userId || isLoading || migrationAttemptRef.current || items.length === 0) {
      return
    }

    const itemsToMigrate = items.filter((item) => {
      const expectedTitle = ROUTINE_TITLE_MIGRATIONS[item.id]
      return expectedTitle !== undefined && item.title !== expectedTitle
    })

    migrationAttemptRef.current = true

    if (itemsToMigrate.length === 0) {
      return
    }

    void (async () => {
      try {
        await Promise.all(
          itemsToMigrate.map((item) =>
            saveRoutineItem(userId, {
              ...item,
              title: ROUTINE_TITLE_MIGRATIONS[item.id] ?? item.title,
            }),
          ),
        )
      } catch (migrationError) {
        console.error("Routine migration failed", migrationError)
        setError(ROUTINE_MUTATION_ERROR)
      }
    })()
  }, [isLoading, items, userId])

  const mutate = useCallback(
    async (operation: () => Promise<void>) => {
      try {
        setError(null)
        await operation()
      } catch (mutationError) {
        console.error("Routine mutation failed", mutationError)
        setError(ROUTINE_MUTATION_ERROR)
        throw mutationError
      }
    },
    [],
  )

  const addItem = useCallback(
    async (input: { period: "morning" | "evening"; title: string; detail?: string }) => {
      if (!userId) return null
      const periodItems = items.filter((item) => item.period === input.period)
      const nextSortOrder = periodItems.reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1
      const item: RoutineRecord = {
        id: createClientId(input.period),
        period: input.period,
        title: input.title.trim(),
        detail: input.detail?.trim() || undefined,
        isCompleted: false,
        isDefault: false,
        sortOrder: nextSortOrder,
        createdAt: Date.now(),
      }
      await mutate(() => saveRoutineItem(userId, item))
      return item.id
    },
    [items, mutate, userId],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!userId) return
      await mutate(() => deleteRoutineItem(userId, itemId))
    },
    [mutate, userId],
  )

  const toggleItem = useCallback(
    async (itemId: string) => {
      if (!userId) return
      const current = items.find((item) => item.id === itemId)
      if (!current) return
      const isCompletedToday = isItemCompletedOnDate(current, todayKey)
      await mutate(() =>
        saveRoutineItem(userId, {
          ...current,
          isCompleted: !isCompletedToday,
        }),
      )
    },
    [items, mutate, todayKey, userId],
  )

  const completedSet = useMemo(
    () => new Set(items.filter((item) => isItemCompletedOnDate(item, todayKey)).map((item) => item.id)),
    [items, todayKey],
  )

  return useMemo(
    () => ({
      items,
      completedSet,
      isLoading,
      error,
      addItem,
      removeItem,
      toggleItem,
    }),
    [addItem, completedSet, error, isLoading, items, removeItem, toggleItem],
  )
}

export default useUserRoutine
