import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { buildUserScopedKey } from "../utils/userScopedKey"
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
  const { userEmail } = useAuth()
  const storageKey = useMemo(() => buildUserScopedKey(userEmail, STORAGE_KEY), [userEmail])
  const [moodboardSrc, setMoodboardSrc] = useState<string>(defaultMoodboard)
  const [isCustom, setIsCustom] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored) {
        setMoodboardSrc(stored)
        setIsCustom(true)
        return
      }
      setMoodboardSrc(defaultMoodboard)
      setIsCustom(false)
    } catch {
      // ignore storage errors
    }
  }, [storageKey])

  const persist = useCallback(
    (value: string | null) => {
      try {
        if (value) {
          window.localStorage.setItem(storageKey, value)
        } else {
          window.localStorage.removeItem(storageKey)
        }
      } catch {
        // ignore storage errors
      }
    },
    [storageKey],
  )

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
