import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { ScheduledTask } from "../data/sampleData"
import { useAuth } from "./AuthContext"
import {
  createCalendarEvent,
  deleteCalendarEvent,
  subscribeToCalendarEvents,
  updateCalendarEvent,
} from "../services/firestore/calendarEvents"

type TasksContextValue = {
  tasks: ScheduledTask[]
  isLoading: boolean
  error: string | null
  addTask: (task: ScheduledTask) => Promise<void>
  updateTask: (taskId: string, updates: Partial<Pick<ScheduledTask, "start" | "end" | "color" | "date">>) => Promise<void>
  removeTask: (taskId: string) => Promise<void>
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined)

type TasksProviderProps = {
  children: ReactNode
}

export const TasksProvider = ({ children }: TasksProviderProps) => {
  const { isAuthReady, userId } = useAuth()
  const [tasks, setTasks] = useState<ScheduledTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setTasks([])
      setError(null)
      setIsLoading(false)
      return
    }

    setTasks([])
    setError(null)
    setIsLoading(true)

    return subscribeToCalendarEvents(
      userId,
      (nextTasks) => {
        setTasks(nextTasks)
        setError(null)
        setIsLoading(false)
      },
      (loadError) => {
        console.error("Calendar events load failed", loadError)
        setTasks([])
        setError("Impossible de charger votre agenda.")
        setIsLoading(false)
      },
    )
  }, [isAuthReady, userId])

  const addTask = useCallback(
    async (task: ScheduledTask) => {
      if (!userId) {
        const authError = new Error("Utilisateur non connecté.")
        setError("Impossible d'ajouter cet événement.")
        throw authError
      }

      try {
        setError(null)
        await createCalendarEvent(userId, task)
      } catch (createError) {
        console.error("Calendar event create failed", createError)
        setError("Impossible d'ajouter cet événement.")
        throw createError
      }
    },
    [userId],
  )

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Pick<ScheduledTask, "start" | "end" | "color" | "date">>) => {
      if (!userId) return
      const currentTask = tasks.find((task) => task.id === taskId)
      if (!currentTask) return

      try {
        setError(null)
        await updateCalendarEvent(userId, { ...currentTask, ...updates })
      } catch (updateError) {
        console.error("Calendar event update failed", updateError)
        setError("Impossible de mettre à jour cet événement.")
      }
    },
    [tasks, userId],
  )

  const removeTask = useCallback(
    async (taskId: string) => {
      if (!userId) return
      try {
        setError(null)
        await deleteCalendarEvent(userId, taskId)
      } catch (removeError) {
        console.error("Calendar event delete failed", removeError)
        setError("Impossible de supprimer cet événement.")
      }
    },
    [userId],
  )

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      isLoading,
      error,
      addTask,
      updateTask,
      removeTask,
    }),
    [addTask, error, isLoading, removeTask, tasks, updateTask],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export const useTasks = () => {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}
