import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { buildUserScopedKey } from "../utils/userScopedKey"

function resolveInitial<T>(value: T | (() => T)): T {
  return typeof value === "function" ? (value as () => T)() : value
}

function usePersistentState<T>(key: string, initialState: T | (() => T)) {
  const { userEmail } = useAuth()
  const storageKey = useMemo(() => buildUserScopedKey(userEmail, key), [key, userEmail])
  const initialRef = useRef<T | null>(null)

  const getInitial = () => {
    if (initialRef.current === null) {
      initialRef.current = resolveInitial(initialState)
    }
    return initialRef.current
  }

  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // ignore read errors
    }
    return getInitial()
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) {
        setState(JSON.parse(stored) as T)
        return
      }
    } catch {
      // ignore read errors
    }
    setState(getInitial())
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // ignore write errors (storage full or disabled)
    }
  }, [storageKey, state])

  return [state, setState] as const
}

export default usePersistentState
