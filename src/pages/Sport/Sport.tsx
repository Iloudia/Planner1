import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react"
import { Link } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import { useAuth } from "../../context/AuthContext"
import useUserSportDashboard from "../../hooks/useUserSportDashboard"
import { getWeekKey } from "../../utils/weekKey"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"
import heroWorkout from "../../assets/tuany-kohler-dupe.webp"
import heroDiet from "../../assets/thayna-queiroz-dupe.webp"
import heroGoals from "../../assets/sport-1.webp"
import "./Sport.css"

const formatBoardDate = (isoDate: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(isoDate))

const computeWeekRange = (dateKeys: string[]) => {
  if (dateKeys.length === 0) {
    return ""
  }
  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" })
  const first = formatter.format(new Date(dateKeys[0]))
  const last = formatter.format(new Date(dateKeys[dateKeys.length - 1]))
  return `${first} - ${last}`
}

const getNextMondayMidnight = (reference: Date) => {
  const next = new Date(reference)
  next.setHours(0, 0, 0, 0)
  const day = next.getDay()
  const daysUntilNextMonday = day === 0 ? 1 : 8 - day
  next.setDate(next.getDate() + daysUntilNextMonday)
  return next
}

const lifeCardDefinitions = [
  { id: "life-workout", label: "Exercices", route: "/sport/workout", key: "workout" as const, image: heroWorkout },
  { id: "life-diet", label: "Diet", route: "/diet", key: "diet" as const, image: heroDiet },
  { id: "life-goals", label: "Goals", route: "/goals", key: "goals" as const, image: heroGoals },
]

const SPORT_BOARD_DRAFTS_STORAGE_KEY = "planner.sport.board.drafts.v1"

const SportPage = () => {
  const { isAuthReady, userEmail, userId } = useAuth()
  const [weekKey, setWeekKey] = useState(() => getWeekKey())
  const { board, dashboard, isLoading, error, updateBoardDay } = useUserSportDashboard(weekKey)
  const canEdit = Boolean(userId)
  const isSportLoading = !isAuthReady || isLoading
  const [activityDrafts, setActivityDrafts] = useState<Record<string, string>>({})
  const activityDraftsRef = useRef<Record<string, string>>({})
  const activitySaveTimeoutsRef = useRef<Record<string, number>>({})
  const boardDraftsStorageKey = useMemo(
    () => buildUserScopedKey(normalizeUserEmail(userEmail), `${SPORT_BOARD_DRAFTS_STORAGE_KEY}.${weekKey}`),
    [userEmail, weekKey],
  )

  useEffect(() => {
    document.body.classList.add("sport-page--lux")
    return () => {
      document.body.classList.remove("sport-page--lux")
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    let timeoutId: number | null = null

    const scheduleWeeklyRollover = () => {
      const now = new Date()
      const nextMondayMidnight = getNextMondayMidnight(now)
      const delay = Math.max(1000, nextMondayMidnight.getTime() - now.getTime())

      timeoutId = window.setTimeout(() => {
        setWeekKey(getWeekKey())
        scheduleWeeklyRollover()
      }, delay)
    }

    scheduleWeeklyRollover()
    const syncOnVisibility = () => setWeekKey(getWeekKey())
    window.addEventListener("visibilitychange", syncOnVisibility)

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      window.removeEventListener("visibilitychange", syncOnVisibility)
    }
  }, [])

  useEffect(() => {
    activityDraftsRef.current = activityDrafts
  }, [activityDrafts])

  useEffect(() => {
    if (typeof window === "undefined") {
      setActivityDrafts({})
      return
    }

    try {
      const raw = window.localStorage.getItem(boardDraftsStorageKey)
      if (!raw) {
        setActivityDrafts({})
        return
      }
      const parsed = JSON.parse(raw) as Record<string, string>
      setActivityDrafts(parsed && typeof parsed === "object" ? parsed : {})
    } catch {
      setActivityDrafts({})
    }
  }, [boardDraftsStorageKey])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const pendingDrafts = Object.fromEntries(
      Object.entries(activityDrafts).filter(([dayId, value]) => {
        const currentDay = board.days.find((day) => day.id === dayId)
        return currentDay && value !== currentDay.activity
      }),
    )

    try {
      if (Object.keys(pendingDrafts).length === 0) {
        window.localStorage.removeItem(boardDraftsStorageKey)
      } else {
        window.localStorage.setItem(boardDraftsStorageKey, JSON.stringify(pendingDrafts))
      }
    } catch {
      // ignore storage failures
    }
  }, [activityDrafts, board.days, boardDraftsStorageKey])

  useEffect(() => {
    setActivityDrafts((currentDrafts) => {
      const nextDrafts: Record<string, string> = {}
      board.days.forEach((day) => {
        const currentDraft = currentDrafts[day.id]
        if (currentDraft !== undefined && currentDraft !== day.activity) {
          nextDrafts[day.id] = currentDraft
        }
      })
      return Object.keys(nextDrafts).length === Object.keys(currentDrafts).length &&
        Object.entries(nextDrafts).every(([key, value]) => currentDrafts[key] === value)
        ? currentDrafts
        : nextDrafts
    })
  }, [board.days])

  useEffect(() => {
    if (!canEdit) {
      return
    }

    Object.entries(activityDrafts).forEach(([dayId, draft]) => {
      const currentDay = board.days.find((day) => day.id === dayId)
      if (!currentDay || currentDay.activity === draft || activitySaveTimeoutsRef.current[dayId]) {
        return
      }
      activitySaveTimeoutsRef.current[dayId] = window.setTimeout(() => {
        void commitActivityDraft(dayId)
      }, 700)
    })
  }, [activityDrafts, board.days, canEdit])

  const weekRange = useMemo(() => computeWeekRange(board.days.map((day) => day.dateISO)), [board.days])

  const clearActivitySaveTimeout = (dayId: string) => {
    const timeoutId = activitySaveTimeoutsRef.current[dayId]
    if (!timeoutId) {
      return
    }
    window.clearTimeout(timeoutId)
    delete activitySaveTimeoutsRef.current[dayId]
  }

  const commitActivityValue = async (dayId: string, nextValue: string) => {
    if (!canEdit) return
    const draft = nextValue
    const currentDay = board.days.find((day) => day.id === dayId)
    if (!currentDay) {
      return false
    }
    if (currentDay.activity === draft) {
      setActivityDrafts((currentDrafts) => {
        if (!(dayId in currentDrafts)) {
          return currentDrafts
        }
        const nextDrafts = { ...currentDrafts }
        delete nextDrafts[dayId]
        return nextDrafts
      })
      return true
    }
    await updateBoardDay(dayId, { activity: draft })
    return true
  }

  const commitActivityDraft = async (dayId: string) => commitActivityValue(dayId, activityDraftsRef.current[dayId] ?? "")

  const handleActivityChange = (dayId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value
    activityDraftsRef.current = {
      ...activityDraftsRef.current,
      [dayId]: nextValue,
    }
    setActivityDrafts((currentDrafts) => ({
      ...currentDrafts,
      [dayId]: nextValue,
    }))
    clearActivitySaveTimeout(dayId)
    if (!canEdit) return
    activitySaveTimeoutsRef.current[dayId] = window.setTimeout(() => {
      delete activitySaveTimeoutsRef.current[dayId]
      void commitActivityDraft(dayId)
    }, 700)
  }

  const handleActivityKeyDown = (dayId: string) => async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" && event.code !== "Enter" && event.code !== "NumpadEnter") {
      return
    }
    event.preventDefault()
    clearActivitySaveTimeout(dayId)
    const input = event.currentTarget
    const wasCommitted = await commitActivityValue(dayId, input.value)
    if (!wasCommitted) {
      return
    }
    input.blur()
  }

  const handleActivitySubmit = (dayId: string) => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearActivitySaveTimeout(dayId)
    const formData = new FormData(event.currentTarget)
    const nextValue = String(formData.get("activity") ?? "")
    const wasCommitted = await commitActivityValue(dayId, nextValue)
    if (!wasCommitted) {
      return
    }
    const input = event.currentTarget.elements.namedItem("activity")
    if (input instanceof HTMLInputElement) {
      input.blur()
    }
  }

  useEffect(
    () => () => {
      Object.values(activitySaveTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      activitySaveTimeoutsRef.current = {}
    },
    [],
  )

  const handleDoneToggle = (dayId: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return
    await updateBoardDay(dayId, { done: event.target.checked })
  }

  if (isSportLoading) {
    return (
      <div className="sport-page sport-page--loading" aria-busy="true" aria-live="polite">
        <span className="sport-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="sport-page">
      <PageHeading eyebrow="Routine active" title="Sport" />
      {!canEdit ? <p className="routine-note__composer-hint">Connecte-toi pour enregistrer ton espace sport.</p> : null}
      {error ? <p className="routine-note__composer-hint">{error}</p> : null}

      <section className="sport-quick-panels">
        <div className="sport-quick-panel">
          <div className="sport-quick-panel__header">
            <h2 className="sport-quick-panel__title">My Life</h2>
          </div>
          <div className="sport-quick-panel__cards">
            {lifeCardDefinitions.map((card) => {
              const media = dashboard.lifeCardMedia[card.key]
              const image = media?.url || card.image
              return (
                <Link key={card.id} className="sport-life-card" to={card.route} aria-label={`Ouvrir ${card.label}`}>
                  <div className="sport-life-card__media">
                    <img src={image} alt={card.label} loading="lazy" decoding="async" />
                  </div>
                  <h3>{card.label}</h3>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="sport-board">
        <header className="sport-section-header">
          <div>
            <h2>Planning de sport</h2>
          </div>
          {weekRange ? <p className="sport-board__range">Semaine du {weekRange}</p> : null}
        </header>

        <div className="sport-board__group">
          <div className="sport-board__columns" role="list">
            {board.days.map((day) => (
              <article key={day.id} className="sport-board-card" role="listitem">
                <header className="sport-board-card__header">
                  <div>
                    <h3>{day.label}</h3>
                    <time dateTime={day.dateISO}>{formatBoardDate(day.dateISO)}</time>
                  </div>
                  <span className={`sport-board-card__status${day.done ? " is-done" : ""}`}>
                    {day.done ? "Fait" : "À planifier"}
                  </span>
                </header>
<form onSubmit={(event) => void handleActivitySubmit(day.id)(event)}>
                  <label className="sport-board-card__field">
                    <span>Séance</span>
                    <input
                      type="text"
                      name="activity"
                      value={activityDrafts[day.id] ?? day.activity}
                      onChange={handleActivityChange(day.id)}
                      onBlur={(event) => {
                        clearActivitySaveTimeout(day.id)
                        void commitActivityValue(day.id, event.currentTarget.value)
                      }}
                      onKeyDown={(event) => void handleActivityKeyDown(day.id)(event)}
                      placeholder="Ex : Legday"
                      enterKeyHint="done"
                      disabled={!canEdit}
                    />
                  </label>
                </form>
                <label className="sport-board-card__checkbox">
                  <input type="checkbox" checked={day.done} onChange={handleDoneToggle(day.id)} disabled={!canEdit} />
                  <span>Séance effectuée</span>
                </label>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SportPage
