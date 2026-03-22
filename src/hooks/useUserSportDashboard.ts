import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { MediaRef, SportDashboardRecord, SportLifeCardKey, SportQuickItem, SportWeekBoardRecord } from "../types/personalization"
import { formatLocalISODate, getWeekStart } from "../utils/weekKey"
import {
  clearSportLifeCardMedia,
  saveSportDashboard,
  saveSportWeekBoard,
  subscribeToSportDashboard,
  subscribeToSportWeekBoard,
} from "../services/firestore/sportDashboard"

const SPORT_LOAD_ERROR = "Impossible de charger votre espace sport."
const SPORT_MUTATION_ERROR = "Impossible de mettre à jour votre espace sport."

const DAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const

const buildEmptyBoard = (weekKey: string): SportWeekBoardRecord => {
  const monday = getWeekStart(new Date(`${weekKey}T00:00:00`))
  return {
    weekKey,
    weekStartDate: weekKey,
    days: DAY_LABELS.map((label, index) => {
      const current = new Date(monday)
      current.setDate(monday.getDate() + index)
      return {
        id: `sport-board-${index}`,
        label,
        dateISO: formatLocalISODate(current),
        activity: "",
        done: false,
      }
    }),
  }
}

const emptyDashboard: SportDashboardRecord = {
  quickItems: [],
  lifeCardMedia: {},
}

const normalizeQuickItems = (items: Array<Pick<SportQuickItem, "id" | "text"> & Partial<SportQuickItem>>) =>
  items
    .map((item, index) => ({
      id: item.id,
      text: item.text,
      sortOrder: item.sortOrder ?? index,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder)

const useUserSportDashboard = (weekKey: string) => {
  const { isAuthReady, userId } = useAuth()
  const [dashboard, setDashboard] = useState<SportDashboardRecord>(emptyDashboard)
  const [board, setBoard] = useState<SportWeekBoardRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const seedAttemptRef = useRef(false)

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setDashboard(emptyDashboard)
      setBoard(null)
      setError(null)
      setIsLoading(false)
      seedAttemptRef.current = false
      return
    }

    let dashboardLoaded = false
    let boardLoaded = false
    const syncLoadingState = () => setIsLoading(!(dashboardLoaded && boardLoaded))

    setDashboard(emptyDashboard)
    setBoard(null)
    setError(null)
    setIsLoading(true)
    seedAttemptRef.current = false

    const unsubscribeDashboard = subscribeToSportDashboard(
      userId,
      (nextDashboard) => {
        dashboardLoaded = true
        setDashboard({
          quickItems: normalizeQuickItems(nextDashboard.quickItems ?? []),
          lifeCardMedia: nextDashboard.lifeCardMedia ?? {},
        })
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Sport dashboard load failed", loadError)
        dashboardLoaded = true
        setDashboard(emptyDashboard)
        setError(SPORT_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeBoard = subscribeToSportWeekBoard(
      userId,
      weekKey,
      (nextBoard) => {
        boardLoaded = true
        setBoard(nextBoard)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Sport week board load failed", loadError)
        boardLoaded = true
        setBoard(null)
        setError(SPORT_LOAD_ERROR)
        syncLoadingState()
      },
    )

    return () => {
      unsubscribeDashboard()
      unsubscribeBoard()
    }
  }, [isAuthReady, userId, weekKey])

  useEffect(() => {
    if (!userId || isLoading || seedAttemptRef.current) {
      return
    }

    const currentBoard = board ?? buildEmptyBoard(weekKey)
    const shouldSeed = !board || dashboard.quickItems.length === 0
    if (!shouldSeed) {
      return
    }

    seedAttemptRef.current = true
    void (async () => {
      try {
        await Promise.all([
          saveSportDashboard(userId, {
            quickItems: dashboard.quickItems,
            lifeCardMedia: dashboard.lifeCardMedia,
          }),
          board ? Promise.resolve() : saveSportWeekBoard(userId, currentBoard),
        ])
      } catch (seedError) {
        console.error("Sport seed failed", seedError)
        setError(SPORT_MUTATION_ERROR)
      }
    })()
  }, [board, dashboard.lifeCardMedia, dashboard.quickItems, isLoading, userId, weekKey])

  const mutate = useCallback(
    async (operation: () => Promise<void>) => {
      try {
        setError(null)
        await operation()
      } catch (mutationError) {
        console.error("Sport mutation failed", mutationError)
        setError(SPORT_MUTATION_ERROR)
        throw mutationError
      }
    },
    [],
  )

  const updateBoardDay = useCallback(
    async (dayId: string, updates: Partial<SportWeekBoardRecord["days"][number]>) => {
      if (!userId) return
      const currentBoard = board ?? buildEmptyBoard(weekKey)
      const nextBoard: SportWeekBoardRecord = {
        ...currentBoard,
        days: currentBoard.days.map((day) => (day.id === dayId ? { ...day, ...updates } : day)),
      }
      await mutate(() => saveSportWeekBoard(userId, nextBoard))
    },
    [board, mutate, userId, weekKey],
  )

  const saveQuickItems = useCallback(
    async (items: Array<Pick<SportQuickItem, "id" | "text"> & Partial<SportQuickItem>>) => {
      if (!userId) return
      await mutate(() =>
        saveSportDashboard(userId, {
          ...dashboard,
          quickItems: normalizeQuickItems(items),
        }),
      )
    },
    [dashboard, mutate, userId],
  )

  const updateLifeCardMedia = useCallback(
    async (key: SportLifeCardKey, media?: MediaRef | null) => {
      if (!userId) return
      if (!media) {
        await mutate(() => clearSportLifeCardMedia(userId, key))
        return
      }
      await mutate(() =>
        saveSportDashboard(userId, {
          ...dashboard,
          lifeCardMedia: {
            ...dashboard.lifeCardMedia,
            [key]: media,
          },
        }),
      )
    },
    [dashboard, mutate, userId],
  )

  return useMemo(
    () => ({
      board: board ?? buildEmptyBoard(weekKey),
      dashboard,
      isLoading,
      error,
      updateBoardDay,
      saveQuickItems,
      updateLifeCardMedia,
    }),
    [board, dashboard, error, isLoading, saveQuickItems, updateBoardDay, updateLifeCardMedia, weekKey],
  )
}

export default useUserSportDashboard
