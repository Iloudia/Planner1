import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import defaultMoodboard from "../assets/MoodBoard.png"

const STORAGE_KEY = "planner.custom.moodboard"

type MoodboardContextValue = {
  moodboardSrc: string
  isCustom: boolean
  updateMoodboard: (dataUrl: string) => void
  resetMoodboard: () => void
}

const MoodboardContext = createContext<MoodboardContextValue | undefined>(undefined)

export function MoodboardProvider({ children }: { children: ReactNode }) {
  const [moodboardSrc, setMoodboardSrc] = useState<string>(defaultMoodboard)
  const [isCustom, setIsCustom] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setMoodboardSrc(stored)
        setIsCustom(true)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const persist = useCallback((value: string | null) => {
    try {
      if (value) {
        window.localStorage.setItem(STORAGE_KEY, value)
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const updateMoodboard = useCallback(
    (dataUrl: string) => {
      setMoodboardSrc(dataUrl)
      setIsCustom(true)
      persist(dataUrl)
    },
    [persist],
  )

  const resetMoodboard = useCallback(() => {
    setMoodboardSrc(defaultMoodboard)
    setIsCustom(false)
    persist(null)
  }, [persist])

  const value = useMemo(
    () => ({
      moodboardSrc,
      isCustom,
      updateMoodboard,
      resetMoodboard,
    }),
    [isCustom, moodboardSrc, resetMoodboard, updateMoodboard],
  )

  return <MoodboardContext.Provider value={value}>{children}</MoodboardContext.Provider>
}

export function useMoodboard() {
  const context = useContext(MoodboardContext)
  if (!context) {
    throw new Error("useMoodboard doit etre utilise dans MoodboardProvider")
  }
  return context
}
