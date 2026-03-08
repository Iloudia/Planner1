import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { WorkoutExercise, WorkoutSeriesItem, WorkoutSettings, WorkoutVideo } from "../types/personalization"
import { createClientId } from "../utils/clientId"
import { formatLocalISODate } from "../utils/weekKey"
import {
  deleteWorkoutExercise,
  deleteWorkoutSeriesItem,
  deleteWorkoutVideo,
  resetWorkoutSeriesCompletion,
  saveWorkoutExercise,
  saveWorkoutSeriesItem,
  saveWorkoutSettings,
  saveWorkoutVideo,
  subscribeToWorkoutExercises,
  subscribeToWorkoutSeries,
  subscribeToWorkoutSettings,
  subscribeToWorkoutVideos,
} from "../services/firestore/workout"

const WORKOUT_LOAD_ERROR = "Impossible de charger votre espace workout."
const WORKOUT_MUTATION_ERROR = "Impossible de mettre a jour votre espace workout."

const defaultExercises: WorkoutExercise[] = [
  {
    id: "ex-1",
    title: "Backday",
    muscle: "Dos",
    category: "Renforcement musculaire",
    note: "",
    imageMode: "default",
    isDefault: true,
    defaultKey: "backday",
    sortOrder: 0,
  },
  {
    id: "ex-2",
    title: "Legday",
    muscle: "Jambes",
    category: "Renforcement musculaire",
    note: "",
    imageMode: "default",
    isDefault: true,
    defaultKey: "legday",
    sortOrder: 1,
  },
]

const defaultVideos: WorkoutVideo[] = [
  {
    id: "vid-1",
    title: "Exercices leg day",
    url: "https://www.youtube.com/watch?v=gcIqwTuaP4o",
    thumbnailMode: "default",
    thumbnailUrl: "https://img.youtube.com/vi/gcIqwTuaP4o/hqdefault.jpg",
    isDefault: true,
    sortOrder: 0,
  },
  {
    id: "vid-2",
    title: "Entrainement Pilates complet",
    url: "https://www.youtube.com/watch?v=354ezj2UHdM",
    thumbnailMode: "default",
    thumbnailUrl: "https://img.youtube.com/vi/354ezj2UHdM/hqdefault.jpg",
    isDefault: true,
    sortOrder: 1,
  },
]

const defaultSeries: WorkoutSeriesItem[] = [
  { id: "serie-1", exerciseId: "ex-1", label: "3x12 incline dumbbell row", completed: false, sortOrder: 0 },
  { id: "serie-2", exerciseId: "ex-1", label: "4x10 Lat pull downs", completed: false, sortOrder: 1 },
  { id: "serie-3", exerciseId: "ex-1", label: "3x10 Cable rows", completed: false, sortOrder: 2 },
  { id: "serie-4", exerciseId: "ex-1", label: "Pull up (jusqu'a epuisement)", completed: false, sortOrder: 3 },
  { id: "serie-5", exerciseId: "ex-1", label: "3x10 Seated cable rows", completed: false, sortOrder: 4 },
  { id: "serie-6", exerciseId: "ex-1", label: "3x10 Bent over rows", completed: false, sortOrder: 5 },
  { id: "serie-7", exerciseId: "ex-2", label: "3x10 hip/leg press", completed: false, sortOrder: 6 },
  { id: "serie-8", exerciseId: "ex-2", label: "3x10 Hip thrust", completed: false, sortOrder: 7 },
  { id: "serie-9", exerciseId: "ex-2", label: "3x10 RDLs", completed: false, sortOrder: 8 },
  { id: "serie-10", exerciseId: "ex-2", label: "3x12 Leg extension", completed: false, sortOrder: 9 },
  { id: "serie-11", exerciseId: "ex-2", label: "Leg curls (jusqu'a epuisement)", completed: false, sortOrder: 10 },
  { id: "serie-12", exerciseId: "ex-2", label: "3x10 Squats", completed: false, sortOrder: 11 },
  { id: "serie-13", exerciseId: "ex-2", label: "3x12 Reverse lunges", completed: false, sortOrder: 12 },
]

const todayKey = () => formatLocalISODate(new Date())

const sortSeriesItems = (items: WorkoutSeriesItem[]) =>
  [...items].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder
    }
    if ((left.createdAt ?? 0) !== (right.createdAt ?? 0)) {
      return (left.createdAt ?? 0) - (right.createdAt ?? 0)
    }
    return left.id.localeCompare(right.id)
  })

const useUserWorkoutData = () => {
  const { isAuthReady, userId } = useAuth()
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [videos, setVideos] = useState<WorkoutVideo[]>([])
  const [series, setSeries] = useState<WorkoutSeriesItem[]>([])
  const [settings, setSettings] = useState<WorkoutSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const seedAttemptRef = useRef(false)
  const resetAttemptRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setExercises([])
      setVideos([])
      setSeries([])
      setSettings(null)
      setError(null)
      setIsLoading(false)
      seedAttemptRef.current = false
      resetAttemptRef.current = null
      return
    }

    let exercisesLoaded = false
    let videosLoaded = false
    let seriesLoaded = false
    let settingsLoaded = false
    const syncLoadingState = () => setIsLoading(!(exercisesLoaded && videosLoaded && seriesLoaded && settingsLoaded))

    setExercises([])
    setVideos([])
    setSeries([])
    setSettings(null)
    setError(null)
    setIsLoading(true)
    seedAttemptRef.current = false
    resetAttemptRef.current = null

    const unsubscribeExercises = subscribeToWorkoutExercises(
      userId,
      (nextExercises) => {
        exercisesLoaded = true
        setExercises(nextExercises)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Workout exercises load failed", loadError)
        exercisesLoaded = true
        setExercises([])
        setError(WORKOUT_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeVideos = subscribeToWorkoutVideos(
      userId,
      (nextVideos) => {
        videosLoaded = true
        setVideos(nextVideos)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Workout videos load failed", loadError)
        videosLoaded = true
        setVideos([])
        setError(WORKOUT_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeSeries = subscribeToWorkoutSeries(
      userId,
      (nextSeries) => {
        seriesLoaded = true
        setSeries(nextSeries)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Workout series load failed", loadError)
        seriesLoaded = true
        setSeries([])
        setError(WORKOUT_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeSettings = subscribeToWorkoutSettings(
      userId,
      (nextSettings) => {
        settingsLoaded = true
        setSettings(nextSettings)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Workout settings load failed", loadError)
        settingsLoaded = true
        setSettings(null)
        setError(WORKOUT_LOAD_ERROR)
        syncLoadingState()
      },
    )

    return () => {
      unsubscribeExercises()
      unsubscribeVideos()
      unsubscribeSeries()
      unsubscribeSettings()
    }
  }, [isAuthReady, userId])

  useEffect(() => {
    if (!userId || isLoading || settings || seedAttemptRef.current) {
      return
    }

    seedAttemptRef.current = true
    void (async () => {
      try {
        await Promise.all([
          ...defaultExercises.map((exercise) => saveWorkoutExercise(userId, exercise)),
          ...defaultVideos.map((video) => saveWorkoutVideo(userId, video)),
          ...defaultSeries.map((item) => saveWorkoutSeriesItem(userId, item)),
          saveWorkoutSettings(userId, { lastResetDate: todayKey() }),
        ])
      } catch (seedError) {
        console.error("Workout seed failed", seedError)
        setError(WORKOUT_MUTATION_ERROR)
      }
    })()
  }, [isLoading, settings, userId])

  const mutate = useCallback(
    async (operation: () => Promise<void>) => {
      try {
        setError(null)
        await operation()
      } catch (mutationError) {
        console.error("Workout mutation failed", mutationError)
        setError(WORKOUT_MUTATION_ERROR)
        throw mutationError
      }
    },
    [],
  )

  const updateExercise = useCallback(
    async (exerciseId: string, updates: Partial<WorkoutExercise>) => {
      if (!userId) return
      const current = exercises.find((item) => item.id === exerciseId)
      if (!current) return
      await mutate(() => saveWorkoutExercise(userId, { ...current, ...updates }))
    },
    [exercises, mutate, userId],
  )

  const createExercise = useCallback(
    async (input: Omit<WorkoutExercise, "id" | "createdAt" | "updatedAt" | "sortOrder" | "isDefault">) => {
      if (!userId) return null
      const id = createClientId("workout-ex")
      const exercise: WorkoutExercise = {
        id,
        title: input.title.trim(),
        muscle: input.muscle.trim(),
        category: input.category.trim(),
        note: input.note ?? "",
        imageMode: input.imageMode,
        imageUrl: input.imageUrl,
        imagePath: input.imagePath,
        isDefault: false,
        defaultKey: input.defaultKey,
        sortOrder: Date.now(),
        createdAt: Date.now(),
      }
      await mutate(() => saveWorkoutExercise(userId, exercise))
      return id
    },
    [mutate, userId],
  )

  const removeExercise = useCallback(
    async (exerciseId: string) => {
      if (!userId) return
      const relatedSeries = series.filter((item) => item.exerciseId === exerciseId)
      await mutate(async () => {
        await Promise.all([
          deleteWorkoutExercise(userId, exerciseId),
          ...relatedSeries.map((item) => deleteWorkoutSeriesItem(userId, item.id)),
        ])
      })
    },
    [mutate, series, userId],
  )

  const createVideo = useCallback(
    async (input: Omit<WorkoutVideo, "id" | "createdAt" | "updatedAt" | "sortOrder" | "isDefault">) => {
      if (!userId) return null
      const id = createClientId("workout-video")
      const video: WorkoutVideo = {
        id,
        title: input.title.trim(),
        url: input.url,
        thumbnailMode: input.thumbnailMode,
        thumbnailUrl: input.thumbnailUrl,
        thumbnailPath: input.thumbnailPath,
        duration: input.duration,
        isDefault: false,
        sortOrder: Date.now(),
        createdAt: Date.now(),
      }
      await mutate(() => saveWorkoutVideo(userId, video))
      return id
    },
    [mutate, userId],
  )

  const updateVideo = useCallback(
    async (videoId: string, updates: Partial<WorkoutVideo>) => {
      if (!userId) return
      const current = videos.find((item) => item.id === videoId)
      if (!current) return
      await mutate(() => saveWorkoutVideo(userId, { ...current, ...updates }))
    },
    [mutate, userId, videos],
  )

  const removeVideo = useCallback(
    async (videoId: string) => {
      if (!userId) return
      await mutate(() => deleteWorkoutVideo(userId, videoId))
    },
    [mutate, userId],
  )

  const createSeries = useCallback(
    async (exerciseId: string, input: { label: string; weight?: string }) => {
      if (!userId) return null
      const label = input.label.trim()
      if (!label) return null
      const id = createClientId("workout-series")
      const nextSortOrder = Math.max(
        Date.now(),
        series
          .filter((item) => item.exerciseId === exerciseId)
          .reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1,
      )
      const item: WorkoutSeriesItem = {
        id,
        exerciseId,
        label,
        completed: false,
        weight: input.weight?.trim() || undefined,
        sortOrder: nextSortOrder,
        createdAt: Date.now(),
      }

      setSeries((current) => sortSeriesItems([...current, item]))

      try {
        await mutate(() => saveWorkoutSeriesItem(userId, item))
        return id
      } catch (mutationError) {
        setSeries((current) => current.filter((existingItem) => existingItem.id !== id))
        throw mutationError
      }
    },
    [mutate, series, userId],
  )

  const updateSeries = useCallback(
    async (seriesId: string, updates: Partial<WorkoutSeriesItem>) => {
      if (!userId) return
      const current = series.find((item) => item.id === seriesId)
      if (!current) return
      await mutate(() => saveWorkoutSeriesItem(userId, { ...current, ...updates }))
    },
    [mutate, series, userId],
  )

  const removeSeries = useCallback(
    async (seriesId: string) => {
      if (!userId) return
      await mutate(() => deleteWorkoutSeriesItem(userId, seriesId))
    },
    [mutate, userId],
  )

  const updateExerciseNote = useCallback(
    async (exerciseId: string, note: string) => {
      await updateExercise(exerciseId, { note })
    },
    [updateExercise],
  )

  const resetCompletedSeriesIfNeeded = useCallback(async () => {
    if (!userId || !settings) return
    const today = todayKey()
    if (settings.lastResetDate === today) return
    if (resetAttemptRef.current === today) return

    resetAttemptRef.current = today
    await mutate(async () => {
      if (series.length > 0) {
        await resetWorkoutSeriesCompletion(userId, series)
      }
      await saveWorkoutSettings(userId, { lastResetDate: today })
    })
  }, [mutate, series, settings, userId])

  useEffect(() => {
    if (!userId || isLoading || !settings) {
      return
    }
    void resetCompletedSeriesIfNeeded().catch(() => undefined)
  }, [isLoading, resetCompletedSeriesIfNeeded, settings, userId])

  const seriesByExercise = useMemo(
    () =>
      series.reduce<Record<string, WorkoutSeriesItem[]>>((accumulator, item) => {
        if (!accumulator[item.exerciseId]) {
          accumulator[item.exerciseId] = []
        }
        accumulator[item.exerciseId]?.push(item)
        return accumulator
      }, {}),
    [series],
  )

  return useMemo(
    () => ({
      exercises,
      videos,
      seriesByExercise,
      isLoading,
      error,
      createExercise,
      updateExercise,
      deleteExercise: removeExercise,
      updateExerciseNote,
      createVideo,
      updateVideo,
      deleteVideo: removeVideo,
      createSeries,
      updateSeries,
      deleteSeries: removeSeries,
      resetCompletedSeriesIfNeeded,
    }),
    [
      createExercise,
      createSeries,
      createVideo,
      error,
      exercises,
      isLoading,
      removeExercise,
      removeSeries,
      removeVideo,
      resetCompletedSeriesIfNeeded,
      seriesByExercise,
      updateExercise,
      updateExerciseNote,
      updateSeries,
      updateVideo,
      videos,
    ],
  )
}

export default useUserWorkoutData
