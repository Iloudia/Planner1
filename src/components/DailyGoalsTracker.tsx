import { useEffect, useRef, useState } from "react"
import usePersistentState from "../hooks/usePersistentState"
import "./DailyGoalsTracker.css"

const HABIT_ROWS_DEFAULT = [
  "Workout",
  "5k+ steps",
  "Drinking 2 Litres of Water",
  "Healthy meals",
  "No junk/ sugar",
  "1 Fruit",
  "8 Hours of Sleep",
]

const HABIT_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const HABIT_DAYS_FULL = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
const HABIT_ROWS_STORAGE_KEY = "planner.sportHabits.rows.v1"
const HABIT_CHECKS_STORAGE_KEY = "planner.sportHabits.checks.v1"

type HabitDataState = {
  weekKey: string
  checks: boolean[][]
}

const getMonday = (reference: Date) => {
  const date = new Date(reference)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

const createEmptyHabitMatrix = (rowsCount: number) => Array.from({ length: rowsCount }, () => HABIT_DAYS.map(() => false))

const getWeekKey = (reference: Date) => getMonday(reference).toISOString().split("T")[0]

const getDayIndex = (reference: Date) => {
  const day = reference.getDay()
  return (day + 6) % 7
}

const formatWeekRangeFromKey = (weekKey: string) => {
  if (!weekKey) return ""
  const start = new Date(weekKey)
  if (Number.isNaN(start.getTime())) return ""
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" })
  return `${formatter.format(start)} - ${formatter.format(end)}`
}

const DailyGoalsTracker = () => {
  const [habitRows, setHabitRows] = usePersistentState<string[]>(HABIT_ROWS_STORAGE_KEY, () => HABIT_ROWS_DEFAULT)
  const [habitData, setHabitData] = usePersistentState<HabitDataState>(HABIT_CHECKS_STORAGE_KEY, () => ({
    weekKey: getWeekKey(new Date()),
    checks: createEmptyHabitMatrix(HABIT_ROWS_DEFAULT.length),
  }))
  const [isEditingHabits, setIsEditingHabits] = useState(false)
  const [newHabitLabel, setNewHabitLabel] = useState("")
  const [currentWeekKey, setCurrentWeekKey] = useState(() => getWeekKey(new Date()))
  const habitChecks = habitData.checks
  const habitWeekRange = formatWeekRangeFromKey(currentWeekKey)
  const completedDays = HABIT_DAYS.map((_, dayIndex) =>
    habitRows.length > 0 && habitChecks.every((row) => row[dayIndex]),
  )

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
    setHabitData((previous) => {
      let updated = false
      let nextWeekKey = previous.weekKey
      let nextChecks = previous.checks

      if (previous.weekKey !== currentWeekKey) {
        nextWeekKey = currentWeekKey
        nextChecks = createEmptyHabitMatrix(habitRows.length)
        updated = true
      } else if (previous.checks.length !== habitRows.length) {
        nextChecks = habitRows.map((_, index) => previous.checks[index] ?? HABIT_DAYS.map(() => false))
        updated = true
      }

      if (!updated) return previous
      return { weekKey: nextWeekKey, checks: nextChecks }
    })
  }, [currentWeekKey, habitRows, setHabitData])

  const [rewardDay, setRewardDay] = useState<number | null>(null)
  const [showReward, setShowReward] = useState(false)
  const previousCompleted = useRef<boolean[]>(completedDays)

  useEffect(() => {
    const nextCompleted = completedDays
    let newlyCompleted: number | null = null
    nextCompleted.forEach((isDone, index) => {
      if (isDone && !previousCompleted.current[index]) {
        newlyCompleted = index
      }
    })
    previousCompleted.current = nextCompleted
    if (newlyCompleted !== null) {
      setRewardDay(newlyCompleted)
      setShowReward(true)
    }
  }, [completedDays])

  const toggleHabit = (rowIndex: number, dayIndex: number) => {
    setHabitData((previous) => ({
      ...previous,
      checks: previous.checks.map((row, rIdx) =>
        row.map((value, dIdx) => (rIdx === rowIndex && dIdx === dayIndex ? !value : value)),
      ),
    }))
  }

  const computeRowTotal = (rowIndex: number) =>
    habitChecks[rowIndex]?.reduce((sum, checked) => sum + (checked ? 1 : 0), 0) ?? 0

  const handleHabitLabelChange = (rowIndex: number, value: string) => {
    setHabitRows((previous) => previous.map((label, idx) => (idx === rowIndex ? value : label)))
  }

  const handleHabitLabelBlur = (rowIndex: number) => {
    setHabitRows((previous) =>
      previous.map((label, idx) => {
        if (idx !== rowIndex) return label
        const trimmed = label.trim()
        if (trimmed) return trimmed
        const fallback = HABIT_ROWS_DEFAULT[rowIndex % HABIT_ROWS_DEFAULT.length] ?? "Objectif"
        return fallback
      }),
    )
  }

  const handleHabitDelete = (rowIndex: number) => {
    setHabitRows((previous) => {
      if (previous.length <= 1) return previous
      return previous.filter((_, idx) => idx !== rowIndex)
    })
    setHabitData((previous) => ({
      ...previous,
      checks: previous.checks.filter((_, idx) => idx !== rowIndex),
    }))
  }

  const handleHabitAdd = () => {
    const trimmed = newHabitLabel.trim()
    if (!trimmed) return
    setHabitRows((previous) => [...previous, trimmed])
    setHabitData((previous) => ({
      ...previous,
      checks: [...previous.checks, HABIT_DAYS.map(() => false)],
    }))
    setNewHabitLabel("")
  }

  return (
    <div className="sport-habits__table-wrapper">
      <div className="sport-habits__header">
        <div className="sport-habits__header-content">
          <h3>Daily goals</h3>
          <p className="muted">Coche tes objectifs pour chaque jour.</p>
          {habitWeekRange ? <p className="sport-habits__week">Semaine du {habitWeekRange}</p> : null}
        </div>
        <div className="sport-habits__actions">
          <button type="button" className="sport-habits__edit-toggle" onClick={() => setIsEditingHabits((prev) => !prev)}>
            {isEditingHabits ? "Terminer" : "Personnaliser"}
          </button>
        </div>
      </div>
      <div className="sport-habits__table" role="table" aria-label="Suivi objectifs quotidiens">
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
                    onBlur={() => handleHabitLabelBlur(rowIndex)}
                    className="sport-habits__label-input"
                  />
                  {habitRows.length > 1 ? (
                    <button
                      type="button"
                      className="sport-habits__label-delete"
                      onClick={() => handleHabitDelete(rowIndex)}
                      aria-label={`Supprimer ${rowLabel}`}
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
            placeholder="Ajouter un objectif quotidien"
            className="sport-habits__add-input"
          />
          <button type="button" className="sport-habits__add-button" onClick={handleHabitAdd}>
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
            <h4>Jour validé ✨</h4>
            <p>Bravo, tu as tout coché pour {HABIT_DAYS_FULL[rewardDay]}.</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DailyGoalsTracker




