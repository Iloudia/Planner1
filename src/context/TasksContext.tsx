import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import usePersistentState from '../hooks/usePersistentState'
import type { ScheduledTask } from '../data/sampleData'
import { sampleTasks } from '../data/sampleData'

type TasksContextValue = {
  tasks: ScheduledTask[]
  addTask: (task: ScheduledTask) => void
  updateTask: (taskId: string, updates: Partial<Pick<ScheduledTask, 'start' | 'end' | 'color'>>) => void
  removeTask: (taskId: string) => void
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined)

type TasksProviderProps = {
  children: ReactNode
}

const STORAGE_KEY = 'planner.calendar.tasks'

export const TasksProvider = ({ children }: TasksProviderProps) => {
  const [tasks, setTasks] = usePersistentState<ScheduledTask[]>(STORAGE_KEY, () => sampleTasks)

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      addTask: (task) => {
        setTasks((previous) => [task, ...previous])
      },
      updateTask: (taskId, updates) => {
        setTasks((previous) => previous.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
      },
      removeTask: (taskId) => {
        setTasks((previous) => previous.filter((task) => task.id !== taskId))
      },
    }),
    [tasks, setTasks],
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export const useTasks = () => {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}
