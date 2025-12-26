import { useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { buildUserScopedKey } from "../utils/userScopedKey"

function resolveInitial<T>(value: T | (() => T)): T {
  return typeof value === "function" ? (value as () => T)() : value
}

function readFromStorage<T>(storageKey: string, fallback: () => T) {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored === null) {
      return fallback()
    }
    try {
      return JSON.parse(stored) as T
    } catch {
      // Non-JSON payload (legacy): try using raw string
      return stored as unknown as T
    }
  } catch {
    return fallback()
  }
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

  const [state, setState] = useState<T>(() => readFromStorage<T>(storageKey, getInitial))

  useEffect(() => {
    setState((previous) => readFromStorage<T>(storageKey, () => previous ?? getInitial()))
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
