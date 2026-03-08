import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { FinanceEntry, FinanceEntryInput, MonthlySnapshot } from "../types/personalization"
import {
  createFinanceEntry,
  deleteFinanceEntry,
  deleteFinanceMonthlySnapshot,
  saveFinanceMonthlySnapshot,
  subscribeToFinanceEntries,
  subscribeToFinanceMonthlySnapshots,
} from "../services/firestore/financeEntries"

const FINANCE_LOAD_ERROR = "Impossible de charger vos données financières."
const FINANCE_MUTATION_ERROR = "Impossible de mettre à jour vos finances."

const useUserFinanceData = () => {
  const { isAuthReady, userId } = useAuth()
  const [entries, setEntries] = useState<FinanceEntry[]>([])
  const [monthlySnapshots, setMonthlySnapshots] = useState<Record<string, MonthlySnapshot>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setEntries([])
      setMonthlySnapshots({})
      setError(null)
      setIsLoading(false)
      return
    }

    let entriesLoaded = false
    let snapshotsLoaded = false

    const syncLoadingState = () => {
      setIsLoading(!(entriesLoaded && snapshotsLoaded))
    }

    setEntries([])
    setMonthlySnapshots({})
    setError(null)
    setIsLoading(true)

    const unsubscribeEntries = subscribeToFinanceEntries(
      userId,
      (nextEntries) => {
        entriesLoaded = true
        setEntries(nextEntries)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Finance entries load failed", loadError)
        entriesLoaded = true
        setEntries([])
        setError(FINANCE_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeSnapshots = subscribeToFinanceMonthlySnapshots(
      userId,
      (nextSnapshots) => {
        snapshotsLoaded = true
        setMonthlySnapshots(nextSnapshots)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Finance snapshots load failed", loadError)
        snapshotsLoaded = true
        setMonthlySnapshots({})
        setError(FINANCE_LOAD_ERROR)
        syncLoadingState()
      },
    )

    return () => {
      unsubscribeEntries()
      unsubscribeSnapshots()
    }
  }, [isAuthReady, userId])

  const addEntry = useCallback(
    async (entry: FinanceEntryInput) => {
      if (!userId) return
      try {
        setError(null)
        await createFinanceEntry(userId, entry)
      } catch (mutationError) {
        console.error("Finance entry create failed", mutationError)
        setError(FINANCE_MUTATION_ERROR)
        throw mutationError
      }
    },
    [userId],
  )

  const deleteEntry = useCallback(
    async (entryId: string) => {
      if (!userId) return
      try {
        setError(null)
        await deleteFinanceEntry(userId, entryId)
      } catch (mutationError) {
        console.error("Finance entry delete failed", mutationError)
        setError(FINANCE_MUTATION_ERROR)
        throw mutationError
      }
    },
    [userId],
  )

  const saveMonthlySnapshot = useCallback(
    async (monthKey: string, startingAmount: number) => {
      if (!userId) return
      try {
        setError(null)
        await saveFinanceMonthlySnapshot(userId, monthKey, startingAmount)
      } catch (mutationError) {
        console.error("Finance snapshot save failed", mutationError)
        setError(FINANCE_MUTATION_ERROR)
        throw mutationError
      }
    },
    [userId],
  )

  const deleteMonthlySnapshot = useCallback(
    async (monthKey: string) => {
      if (!userId) return
      try {
        setError(null)
        await deleteFinanceMonthlySnapshot(userId, monthKey)
      } catch (mutationError) {
        console.error("Finance snapshot delete failed", mutationError)
        setError(FINANCE_MUTATION_ERROR)
        throw mutationError
      }
    },
    [userId],
  )

  return useMemo(
    () => ({
      entries,
      monthlySnapshots,
      isLoading,
      error,
      addEntry,
      deleteEntry,
      saveMonthlySnapshot,
      deleteMonthlySnapshot,
    }),
    [addEntry, deleteEntry, deleteMonthlySnapshot, entries, error, isLoading, monthlySnapshots, saveMonthlySnapshot],
  )
}

export default useUserFinanceData
