import { useCallback, useEffect, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { saveDailyGoalsTracker, subscribeToDailyGoalsTracker } from "../services/firestore/dailyGoalsTracker"
import type { DailyGoalsTrackerRecord } from "../types/personalization"
import { buildUserScopedKey } from "../utils/userScopedKey"
import { getWeekKey } from "../utils/weekKey"
import "./DailyGoalsTracker.css"

const HABIT_ROWS_DEFAULT = [
  "Workout",
  "5k+ pas",
  "Boire 2 litres d'eau",
  "Repas sains",
  "Pas de Fastfood",
  "1 fruit",
  "8 heures de sommeil",
]

const HABIT_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const HABIT_DAYS_FULL = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
const HABIT_ROWS_STORAGE_KEY = "planner.sportHabits.rows.v1"
const HABIT_CHECKS_STORAGE_KEY = "planner.sportHabits.checks.v1"

type HabitDataState = {
  weekKey: string
  checks: boolean[][]
}

const createEmptyHabitMatrix = (rowsCount: number) => Array.from({ length: rowsCount }, () => HABIT_DAYS.map(() => false))

const formatWeekRangeFromKey = (weekKey: string) => {
  if (!weekKey) return ""
  const start = new Date(weekKey)
  if (Number.isNaN(start.getTime())) return ""
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" })
  return `${formatter.format(start)} - ${formatter.format(end)}`
}

const normalizeRows = (value: unknown) => {
  if (!Array.isArray(value)) {
    return HABIT_ROWS_DEFAULT
  }
  const normalized = value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0)
  return normalized.length > 0 ? normalized : HABIT_ROWS_DEFAULT
}

const normalizeChecks = (value: unknown, rowsCount: number): boolean[][] => {
  const source = Array.isArray(value) ? value : []
  return Array.from({ length: rowsCount }, (_, rowIndex) => {
    const row = Array.isArray(source[rowIndex]) ? source[rowIndex] : []
    return HABIT_DAYS.map((_, dayIndex) => row[dayIndex] === true)
  })
}

const areChecksEqual = (left: boolean[][], right: boolean[][]) => {
  if (left.length !== right.length) {
    return false
  }
  return left.every((leftRow, rowIndex) => {
    const rightRow = right[rowIndex]
    if (!rightRow || leftRow.length !== rightRow.length) {
      return false
    }
    return leftRow.every((value, dayIndex) => value === rightRow[dayIndex])
  })
}

const areRowsEqual = (left: string[], right: string[]) => {
  if (left.length !== right.length) {
    return false
  }
  return left.every((entry, index) => entry === right[index])
}

const readLegacyItem = (userEmail: string | null, key: string) => {
  if (typeof window === "undefined") {
    return null
  }

  const keys = [buildUserScopedKey(userEmail, key), key]
  for (const storageKey of keys) {
    const value = window.localStorage.getItem(storageKey)
    if (value !== null) {
      return value
    }
  }

  return null
}

const readLegacyTracker = (
  userEmail: string | null,
  fallbackWeekKey: string,
): (DailyGoalsTrackerRecord & { hasLegacyData: boolean }) => {
  const defaultTracker: DailyGoalsTrackerRecord = {
    weekKey: fallbackWeekKey,
    rows: HABIT_ROWS_DEFAULT,
    checks: createEmptyHabitMatrix(HABIT_ROWS_DEFAULT.length),
  }

  const rawRows = readLegacyItem(userEmail, HABIT_ROWS_STORAGE_KEY)
  const rawChecks = readLegacyItem(userEmail, HABIT_CHECKS_STORAGE_KEY)
  const hasLegacyData = rawRows !== null || rawChecks !== null

  if (!hasLegacyData) {
    return { ...defaultTracker, hasLegacyData: false }
  }

  let parsedRows: unknown = null
  let parsedChecks: unknown = null
  let parsedWeekKey: unknown = null

  if (rawRows) {
    try {
      parsedRows = JSON.parse(rawRows)
    } catch {
      parsedRows = null
    }
  }

  if (rawChecks) {
    try {
      const parsed = JSON.parse(rawChecks) as { weekKey?: unknown; checks?: unknown }
      parsedWeekKey = parsed?.weekKey
      parsedChecks = parsed?.checks
    } catch {
      parsedChecks = null
      parsedWeekKey = null
    }
  }

  const rows = normalizeRows(parsedRows)
  const weekKey = typeof parsedWeekKey === "string" && parsedWeekKey ? parsedWeekKey : fallbackWeekKey
  const checks = normalizeChecks(parsedChecks, rows.length)

  return {
    weekKey,
    rows,
    checks,
    hasLegacyData: true,
  }
}

const clearLegacyTracker = (userEmail: string | null) => {
  if (typeof window === "undefined") {
    return
  }

  const keys = [
    buildUserScopedKey(userEmail, HABIT_ROWS_STORAGE_KEY),
    buildUserScopedKey(userEmail, HABIT_CHECKS_STORAGE_KEY),
    HABIT_ROWS_STORAGE_KEY,
    HABIT_CHECKS_STORAGE_KEY,
  ]

  keys.forEach((key) => window.localStorage.removeItem(key))
}

type DailyGoalsTrackerProps = {
  onLoadingStateChange?: (isLoading: boolean) => void
}

const DailyGoalsTracker = ({ onLoadingStateChange }: DailyGoalsTrackerProps) => {
  const { isAuthReady, userEmail, userId } = useAuth()
  const [habitRows, setHabitRows] = useState<string[]>(HABIT_ROWS_DEFAULT)
  const [habitData, setHabitData] = useState<HabitDataState>(() => ({
    weekKey: getWeekKey(new Date()),
    checks: createEmptyHabitMatrix(HABIT_ROWS_DEFAULT.length),
  }))
  const [isEditingHabits, setIsEditingHabits] = useState(false)
  const [newHabitLabel, setNewHabitLabel] = useState("")
  const [currentWeekKey, setCurrentWeekKey] = useState(() => getWeekKey(new Date()))
  const [trackerError, setTrackerError] = useState<string | null>(null)
  const [isTrackerLoading, setIsTrackerLoading] = useState(true)
  const migratedLegacyUserRef = useRef<string | null>(null)

  const habitChecks = habitData.checks
  const habitWeekRange = formatWeekRangeFromKey(currentWeekKey)

  const persistTracker = useCallback(
    async (rows: string[], data: HabitDataState) => {
      if (!userId) {
        return
      }
      try {
        setTrackerError(null)
        await saveDailyGoalsTracker(userId, {
          weekKey: data.weekKey,
          rows,
          checks: data.checks,
        })
      } catch (saveError) {
        console.error("Daily goals tracker save failed", saveError)
        setTrackerError("Impossible de synchroniser le tableau des objectifs.")
      }
    },
    [userId],
  )

  useEffect(() => {
    migratedLegacyUserRef.current = null

    if (!isAuthReady) {
      setIsTrackerLoading(true)
      return
    }

    if (!userId) {
      const fallbackWeekKey = getWeekKey(new Date())
      setHabitRows(HABIT_ROWS_DEFAULT)
      setHabitData({
        weekKey: fallbackWeekKey,
        checks: createEmptyHabitMatrix(HABIT_ROWS_DEFAULT.length),
      })
      setTrackerError(null)
      setIsTrackerLoading(false)
      return
    }

    setTrackerError(null)
    setIsTrackerLoading(true)
    const fallbackWeekKey = getWeekKey(new Date())

    return subscribeToDailyGoalsTracker(
      userId,
      fallbackWeekKey,
      (tracker) => {
        if (!tracker) {
          const legacyTracker = readLegacyTracker(userEmail, fallbackWeekKey)
          setHabitRows(legacyTracker.rows)
          setHabitData({
            weekKey: legacyTracker.weekKey,
            checks: legacyTracker.checks,
          })
          setIsTrackerLoading(false)

          if (legacyTracker.hasLegacyData && migratedLegacyUserRef.current !== userId) {
            migratedLegacyUserRef.current = userId
            void saveDailyGoalsTracker(userId, legacyTracker)
              .then(() => {
                clearLegacyTracker(userEmail)
                setTrackerError(null)
              })
              .catch((migrationError) => {
                console.error("Daily goals tracker migration failed", migrationError)
                setTrackerError("Impossible de synchroniser le tableau des objectifs.")
              })
          }
          return
        }

        const nextRows = tracker.rows.length > 0 ? tracker.rows : HABIT_ROWS_DEFAULT
        setHabitRows(nextRows)
        setHabitData({
          weekKey: tracker.weekKey || fallbackWeekKey,
          checks: normalizeChecks(tracker.checks, nextRows.length),
        })
        setTrackerError(null)
        setIsTrackerLoading(false)
      },
      (loadError) => {
        console.error("Daily goals tracker load failed", loadError)
        setTrackerError("Impossible de charger le tableau des objectifs.")
        setIsTrackerLoading(false)
      },
    )
  }, [isAuthReady, userEmail, userId])

  useEffect(() => {
    if (typeof window === "undefined") return
    const updateWeekKey = () => {
      const nextKey = getWeekKey(new Date())
      setCurrentWeekKey((prev) => (prev === nextKey ? prev : nextKey))
    }
    updateWeekKey()
    const intervalId = window.setInterval(updateWeekKey, 1000 * 60 * 60)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!userId || isTrackerLoading) {
      return
    }

    if (habitData.weekKey !== currentWeekKey) {
      const nextData = {
        weekKey: currentWeekKey,
        checks: createEmptyHabitMatrix(habitRows.length),
      }
      setHabitData(nextData)
      void persistTracker(habitRows, nextData)
      return
    }

    const normalizedChecks = normalizeChecks(habitData.checks, habitRows.length)
    if (!areChecksEqual(normalizedChecks, habitData.checks)) {
      const nextData = { ...habitData, checks: normalizedChecks }
      setHabitData(nextData)
      void persistTracker(habitRows, nextData)
    }
  }, [currentWeekKey, habitData, habitRows, isTrackerLoading, persistTracker, userId])

  const [rewardDay, setRewardDay] = useState<number | null>(null)
  const [showReward, setShowReward] = useState(false)
  const rewardTimeoutRef = useRef<number | null>(null)
  const canInteract = Boolean(userId) && !isTrackerLoading

  useEffect(() => {
    onLoadingStateChange?.(isTrackerLoading)
  }, [isTrackerLoading, onLoadingStateChange])

  useEffect(() => {
    if (!showReward) return
    if (rewardTimeoutRef.current) {
      window.clearTimeout(rewardTimeoutRef.current)
    }
    rewardTimeoutRef.current = window.setTimeout(() => setShowReward(false), 6000)
  }, [showReward, rewardDay])

  useEffect(() => {
    return () => {
      if (rewardTimeoutRef.current) {
        window.clearTimeout(rewardTimeoutRef.current)
      }
    }
  }, [])

  const finalizeHabitRows = useCallback(() => {
    const nextRows = habitRows.map((label, index) => {
      const trimmed = label.trim()
      if (trimmed) {
        return trimmed
      }
      return HABIT_ROWS_DEFAULT[index % HABIT_ROWS_DEFAULT.length] ?? "Objectif"
    })
    const nextChecks = normalizeChecks(habitData.checks, nextRows.length)
    const hasRowsChanged = !areRowsEqual(nextRows, habitRows)
    const hasChecksChanged = !areChecksEqual(nextChecks, habitData.checks)

    if (!hasRowsChanged && !hasChecksChanged) {
      return
    }

    const nextData = { ...habitData, checks: nextChecks }
    setHabitRows(nextRows)
    setHabitData(nextData)
    void persistTracker(nextRows, nextData)
  }, [habitData, habitRows, persistTracker])

  const toggleHabit = (rowIndex: number, dayIndex: number) => {
    if (!canInteract) {
      return
    }

    const wasChecked = habitData.checks[rowIndex]?.[dayIndex] ?? false
    const wasDayCompleted = habitRows.length > 0 && habitData.checks.every((row) => row[dayIndex])
    const nextData = {
      ...habitData,
      checks: habitData.checks.map((row, rIdx) =>
        row.map((value, dIdx) => (rIdx === rowIndex && dIdx === dayIndex ? !value : value)),
      ),
    }
    const isDayCompletedNow = habitRows.length > 0 && nextData.checks.every((row) => row[dayIndex])
    if (!wasChecked && !wasDayCompleted && isDayCompletedNow) {
      setRewardDay(dayIndex)
      setShowReward(true)
    }

    setHabitData(nextData)
    void persistTracker(habitRows, nextData)
  }

  const computeRowTotal = (rowIndex: number) =>
    habitChecks[rowIndex]?.reduce((sum, checked) => sum + (checked ? 1 : 0), 0) ?? 0

  const handleHabitLabelChange = (rowIndex: number, value: string) => {
    setHabitRows((previous) => previous.map((label, idx) => (idx === rowIndex ? value : label)))
  }

  const handleHabitLabelBlur = () => {
    finalizeHabitRows()
  }

  const handleHabitDelete = (rowIndex: number) => {
    if (!canInteract || habitRows.length <= 1) {
      return
    }
    const nextRows = habitRows.filter((_, idx) => idx !== rowIndex)
    const nextData = {
      ...habitData,
      checks: normalizeChecks(habitData.checks.filter((_, idx) => idx !== rowIndex), nextRows.length),
    }
    setHabitRows(nextRows)
    setHabitData(nextData)
    void persistTracker(nextRows, nextData)
  }

  const handleHabitAdd = () => {
    if (!canInteract) {
      return
    }

    const trimmed = newHabitLabel.trim()
    if (!trimmed) return
    const nextRows = [...habitRows, trimmed]
    const nextData = {
      ...habitData,
      checks: [...normalizeChecks(habitData.checks, habitRows.length), HABIT_DAYS.map(() => false)],
    }
    setHabitRows(nextRows)
    setHabitData(nextData)
    setNewHabitLabel("")
    void persistTracker(nextRows, nextData)
  }

  const handleToggleEdit = () => {
    if (isEditingHabits) {
      finalizeHabitRows()
    }
    setIsEditingHabits((prev) => !prev)
  }

  if (isTrackerLoading) {
    return (
      <div className="sport-habits__table-wrapper sport-habits__table-wrapper--loading" aria-busy="true" aria-live="polite">
        <span className="sport-habits__loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="sport-habits__table-wrapper">
      <div className="sport-habits__header">
        <div className="sport-habits__header-content">
          <h3>Objectifs quotidiens</h3>
          <p className="muted">Coche tes objectifs pour chaque jour.</p>
          {habitWeekRange ? <p className="sport-habits__week">Semaine du {habitWeekRange}</p> : null}
          {trackerError ? <p className="muted">{trackerError}</p> : null}
        </div>
        <div className="sport-habits__actions">
          <button
            type="button"
            className="sport-habits__edit-toggle"
            onClick={handleToggleEdit}
            disabled={!canInteract}
          >
            {isEditingHabits ? "Terminer" : "Ajouter un objectif"}
          </button>
        </div>
      </div>
      <div className="sport-habits__table" role="table" aria-label="Suivi des objectifs quotidiens">
        <div className="sport-habits__row sport-habits__row--head" role="row">
          <div className="sport-habits__cell sport-habits__cell--head" role="columnheader">
            Objectif
          </div>
          {HABIT_DAYS.map((day) => (
            <div key={day} className="sport-habits__cell sport-habits__cell--head" role="columnheader">
              {day}
            </div>
          ))}
          <div className="sport-habits__cell sport-habits__cell--head" role="columnheader">
            Total
          </div>
        </div>
        {habitRows.map((rowLabel, rowIndex) => (
          <div key={`${rowLabel}-${rowIndex}`} className="sport-habits__row" role="row">
            <div className="sport-habits__cell sport-habits__cell--label" role="rowheader">
              {isEditingHabits ? (
                <div className="sport-habits__label-editor">
                  <input
                    type="text"
                    value={rowLabel}
                    onChange={(event) => handleHabitLabelChange(rowIndex, event.target.value)}
                    onBlur={handleHabitLabelBlur}
                    className="sport-habits__label-input"
                    disabled={!canInteract}
                  />
                  {habitRows.length > 1 ? (
                    <button
                      type="button"
                      className="sport-habits__label-delete"
                      onClick={() => handleHabitDelete(rowIndex)}
                      aria-label={`Supprimer ${rowLabel}`}
                      disabled={!canInteract}
                    >
                      x
                    </button>
                  ) : null}
                </div>
              ) : (
                rowLabel
              )}
            </div>
            {HABIT_DAYS.map((day, dayIndex) => (
              <label
                key={`${rowLabel}-${day}`}
                className="sport-habits__cell sport-habits__cell--checkbox"
                role="cell"
                aria-label={`${rowLabel} ${day}`}
              >
                <input
                  type="checkbox"
                  checked={habitChecks[rowIndex]?.[dayIndex] ?? false}
                  onChange={() => toggleHabit(rowIndex, dayIndex)}
                  disabled={!canInteract}
                />
              </label>
            ))}
            <div className="sport-habits__cell sport-habits__cell--total" role="cell">
              {computeRowTotal(rowIndex)}
            </div>
          </div>
        ))}
      </div>
      {isEditingHabits ? (
        <div className="sport-habits__editor">
          <input
            type="text"
            value={newHabitLabel}
            onChange={(event) => setNewHabitLabel(event.target.value)}
            placeholder="Ex : S’étirer après chaque séance..."
            className="sport-habits__add-input"
            disabled={!canInteract}
          />
          <button type="button" className="sport-habits__add-button" onClick={handleHabitAdd} disabled={!canInteract}>
            Ajouter
          </button>
        </div>
      ) : null}
      {showReward && typeof rewardDay === "number" ? (
        <div
          className="sport-habits__reward-overlay"
          role="status"
          aria-live="polite"
          onClick={() => setShowReward(false)}
        >
          <div className="sport-habits__reward-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal__close sport-habits__reward-close"
              aria-label="Fermer"
              onClick={() => setShowReward(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h4>Journee validee</h4>
            <p>Bravo, tu as tout coche pour {HABIT_DAYS_FULL[rewardDay]}.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DailyGoalsTracker
