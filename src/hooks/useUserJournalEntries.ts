import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { JournalEntry, JournalEntryInput } from "../types/personalization"
import { createJournalEntry, deleteJournalEntry, subscribeToJournalEntries } from "../services/firestore/journalEntries"

const JOURNAL_LOAD_ERROR = "Impossible de charger vos entrées de journaling."
const JOURNAL_SAVE_ERROR = "Impossible d'enregistrer cette page."
const JOURNAL_DELETE_ERROR = "Impossible de supprimer cette entrée."

const useUserJournalEntries = () => {
  const { isAuthReady, userId } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setEntries([])
      setError(null)
      setIsLoading(false)
      return
    }

    setError(null)
    setIsLoading(true)

    return subscribeToJournalEntries(
      userId,
      (nextEntries) => {
        setEntries(nextEntries)
        setError(null)
        setIsLoading(false)
      },
      (loadError) => {
        console.error("Journal entries load failed", loadError)
        setEntries([])
        setError(JOURNAL_LOAD_ERROR)
        setIsLoading(false)
      },
    )
  }, [isAuthReady, userId])

  const createEntry = useCallback(
    async (entry: JournalEntryInput) => {
      if (!userId) return
      try {
        setError(null)
        await createJournalEntry(userId, entry)
      } catch (createError) {
        console.error("Journal entry create failed", createError)
        setError(JOURNAL_SAVE_ERROR)
        throw createError
      }
    },
    [userId],
  )

  const deleteEntry = useCallback(
    async (entryId: string) => {
      if (!userId) return
      try {
        setError(null)
        await deleteJournalEntry(userId, entryId)
      } catch (deleteError) {
        console.error("Journal entry delete failed", deleteError)
        setError(JOURNAL_DELETE_ERROR)
        throw deleteError
      }
    },
    [userId],
  )

  return useMemo(
    () => ({
      entries,
      isLoading,
      error,
      createEntry,
      deleteEntry,
    }),
    [createEntry, deleteEntry, entries, error, isLoading],
  )
}

export default useUserJournalEntries
