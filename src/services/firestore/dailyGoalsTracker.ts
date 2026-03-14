import {
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"
import type { DailyGoalsTrackerRecord } from "../../types/personalization"
import { goalsDailyTrackerDocRef } from "./userPaths"

const DAYS_PER_WEEK = 7

type DailyGoalsTrackerDoc = {
  weekKey?: string
  rows?: unknown
  checksByRow?: unknown
  checks?: unknown
  updatedAt?: Timestamp | null
}

const normalizeRows = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0)
}

const normalizeChecks = (value: unknown, rowsCount: number): boolean[][] => {
  const source = Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? value
      : null

  return Array.from({ length: rowsCount }, (_, rowIndex) => {
    const rowValue =
      Array.isArray(source)
        ? source[rowIndex]
        : source && typeof source === "object"
          ? (source as Record<string, unknown>)[String(rowIndex)]
          : null
    const row = Array.isArray(rowValue) ? rowValue : []
    return Array.from({ length: DAYS_PER_WEEK }, (_, dayIndex) => row[dayIndex] === true)
  })
}

const normalizeWeekKey = (value: unknown, fallbackWeekKey: string) => {
  if (typeof value !== "string" || !value.trim()) {
    return fallbackWeekKey
  }
  return value
}

const normalizeTracker = (
  raw: Pick<DailyGoalsTrackerRecord, "weekKey" | "rows" | "checks">,
  fallbackWeekKey: string,
): DailyGoalsTrackerRecord => {
  const rows = normalizeRows(raw.rows)
  const weekKey = normalizeWeekKey(raw.weekKey, fallbackWeekKey)
  const checks = normalizeChecks(raw.checks, rows.length)
  return { weekKey, rows, checks }
}

export const subscribeToDailyGoalsTracker = (
  userId: string,
  fallbackWeekKey: string,
  onTracker: (tracker: DailyGoalsTrackerRecord | null) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe =>
  onSnapshot(
    goalsDailyTrackerDocRef(userId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onTracker(null)
        return
      }

      const data = snapshot.data() as DailyGoalsTrackerDoc
      const normalized = normalizeTracker(
        {
          weekKey: data.weekKey ?? fallbackWeekKey,
          rows: data.rows ?? [],
          checks: data.checksByRow ?? data.checks ?? [],
        },
        fallbackWeekKey,
      )
      onTracker(normalized)
    },
    onError,
  )

export const saveDailyGoalsTracker = async (userId: string, tracker: DailyGoalsTrackerRecord) => {
  const normalized = normalizeTracker(tracker, tracker.weekKey)
  const checksByRow = normalized.checks.reduce<Record<string, boolean[]>>((accumulator, row, rowIndex) => {
    accumulator[String(rowIndex)] = Array.from({ length: DAYS_PER_WEEK }, (_, dayIndex) => row[dayIndex] === true)
    return accumulator
  }, {})

  await setDoc(
    goalsDailyTrackerDocRef(userId),
    {
      weekKey: normalized.weekKey,
      rows: normalized.rows,
      checksByRow,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
