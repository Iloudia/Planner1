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

const formatBoardTabDateParts = (isoDate: string) => {
  const date = new Date(`${isoDate}T00:00:00`)
  return {
    dayNumber: new Intl.DateTimeFormat("fr-FR", { day: "2-digit" }).format(date),
    monthLabel: new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date),
  }
}

const formatBoardTabLabel = (label: string) => {
  const normalized = label.trim().toLowerCase()
  const labels: Record<string, string> = {
    lundi: "Lun",
    mardi: "Mar",
    mercredi: "Mer",
    jeudi: "Jeu",
    vendredi: "Ven",
    samedi: "Sam",
    dimanche: "Dim",
  }
  return labels[normalized] ?? label.slice(0, 3)
}

const computeWeekRange = (dateKeys: string[]) => {
  if (dateKeys.length === 0) {
    return ""
  }
  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" })
  const first = formatter.format(new Date(dateKeys[0]))
  const last = formatter.format(new Date(dateKeys[dateKeys.length - 1]))
  return `${first} - ${last}`
}

type TimeDraft = {
  startTime: string
  endTime: string
}

const normalizeTimeValue = (value?: string) => (typeof value === "string" ? value : "")

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
  const [timeDrafts, setTimeDrafts] = useState<Record<string, TimeDraft>>({})
  const activityDraftsRef = useRef<Record<string, string>>({})
  const activitySaveTimeoutsRef = useRef<Record<string, number>>({})
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
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
    setTimeDrafts((currentDrafts) => {
      const nextDrafts = Object.fromEntries(
        board.days.map((day) => [
          day.id,
          {
            startTime: currentDrafts[day.id]?.startTime ?? normalizeTimeValue(day.startTime),
            endTime: currentDrafts[day.id]?.endTime ?? normalizeTimeValue(day.endTime),
          },
        ]),
      )

      return JSON.stringify(nextDrafts) === JSON.stringify(currentDrafts) ? currentDrafts : nextDrafts
    })
  }, [board.days])

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
    if (board.days.length === 0) {
      setSelectedDayId(null)
      return
    }

    setSelectedDayId((currentDayId) => {
      if (currentDayId && board.days.some((day) => day.id === currentDayId)) {
        return currentDayId
      }
      return board.days.find((day) => !day.done)?.id ?? board.days[0]?.id ?? null
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
  const selectedDay = useMemo(
    () => board.days.find((day) => day.id === selectedDayId) ?? board.days[0] ?? null,
    [board.days, selectedDayId],
  )

  const clearActivitySaveTimeout = (dayId: string) => {
    const timeoutId = activitySaveTimeoutsRef.current[dayId]
    if (!timeoutId) {
      return
    }
    window.clearTimeout(timeoutId)
    delete activitySaveTimeoutsRef.current[dayId]
  }

  const commitActivityValue = async (dayId: string, nextValue: string) => {
    if (!canEdit) return false
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

  const handleTimeChange =
    (dayId: string, field: keyof TimeDraft) => (event: ChangeEvent<HTMLInputElement>) => {
      const currentDay = board.days.find((day) => day.id === dayId)
      const nextValue = event.target.value
      setTimeDrafts((currentDrafts) => ({
        ...currentDrafts,
        [dayId]: {
          startTime: currentDrafts[dayId]?.startTime ?? normalizeTimeValue(currentDay?.startTime),
          endTime: currentDrafts[dayId]?.endTime ?? normalizeTimeValue(currentDay?.endTime),
          [field]: nextValue,
        },
      }))
    }

  const commitTimeValue = async (dayId: string, field: keyof TimeDraft, nextValue: string) => {
    if (!canEdit) return
    await updateBoardDay(dayId, { [field]: nextValue })
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
      <PageHeading eyebrow="Énergie" title="Sport" />
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
          <div className="sport-board__desktop-list" role="list" aria-label="Planning desktop tablette">
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

                <div className="sport-board-card__time-row">
                  <label className="sport-board-card__field">
                    <span>Début</span>
                    <input
                      type="time"
                      value={timeDrafts[day.id]?.startTime ?? normalizeTimeValue(day.startTime)}
                      onChange={handleTimeChange(day.id, "startTime")}
                      onBlur={(event) => void commitTimeValue(day.id, "startTime", event.currentTarget.value)}
                      disabled={!canEdit}
                    />
                  </label>
                  <label className="sport-board-card__field">
                    <span>Fin</span>
                    <input
                      type="time"
                      value={timeDrafts[day.id]?.endTime ?? normalizeTimeValue(day.endTime)}
                      onChange={handleTimeChange(day.id, "endTime")}
                      onBlur={(event) => void commitTimeValue(day.id, "endTime", event.currentTarget.value)}
                      disabled={!canEdit}
                    />
                  </label>
                </div>

                <label className="sport-board-card__checkbox">
                  <input type="checkbox" checked={day.done} onChange={handleDoneToggle(day.id)} disabled={!canEdit} />
                  <span>Séance effectuée</span>
                </label>
              </article>
            ))}
          </div>

          <div className="sport-board__mobile-view">
            <div className="sport-board__tabs" role="tablist" aria-label="Jours de la semaine">
              {board.days.map((day) => {
                const isSelected = day.id === selectedDay?.id
                const { dayNumber } = formatBoardTabDateParts(day.dateISO)
                return (
                  <button
                    key={day.id}
                    type="button"
                    className={`sport-board__tab${isSelected ? " is-active" : ""}${day.done ? " is-done" : ""}`}
                    role="tab"
                    id={`sport-board-tab-${day.id}`}
                    aria-selected={isSelected}
                    aria-controls={`sport-board-panel-${day.id}`}
                    onClick={() => setSelectedDayId(day.id)}
                  >
                    <span className="sport-board__tab-day">{formatBoardTabLabel(day.label)}</span>
                    <span className="sport-board__tab-number">{dayNumber}</span>
                  </button>
                )
              })}
            </div>

            {selectedDay ? (
              <article
                key={selectedDay.id}
                className="sport-board-card sport-board-card--detail"
                role="tabpanel"
                id={`sport-board-panel-${selectedDay.id}`}
                aria-labelledby={`sport-board-tab-${selectedDay.id}`}
              >
                <header className="sport-board-card__header">
                  <div>
                    <h3>{selectedDay.label}</h3>
                    <time dateTime={selectedDay.dateISO}>{formatBoardDate(selectedDay.dateISO)}</time>
                  </div>
                  <span className={`sport-board-card__status${selectedDay.done ? " is-done" : ""}`}>
                    {selectedDay.done ? "Fait" : "À planifier"}
                  </span>
                </header>

                <form onSubmit={(event) => void handleActivitySubmit(selectedDay.id)(event)}>
                  <label className="sport-board-card__field">
                    <span>Séance</span>
                    <input
                      type="text"
                      name="activity"
                      value={activityDrafts[selectedDay.id] ?? selectedDay.activity}
                      onChange={handleActivityChange(selectedDay.id)}
                      onBlur={(event) => {
                        clearActivitySaveTimeout(selectedDay.id)
                        void commitActivityValue(selectedDay.id, event.currentTarget.value)
                      }}
                      onKeyDown={(event) => void handleActivityKeyDown(selectedDay.id)(event)}
                      placeholder="Ex : Legday"
                      enterKeyHint="done"
                      disabled={!canEdit}
                    />
                  </label>
                </form>

                <div className="sport-board-card__time-row">
                  <label className="sport-board-card__field">
                    <span>Début</span>
                    <input
                      type="time"
                      value={timeDrafts[selectedDay.id]?.startTime ?? normalizeTimeValue(selectedDay.startTime)}
                      onChange={handleTimeChange(selectedDay.id, "startTime")}
                      onBlur={(event) =>
                        void commitTimeValue(selectedDay.id, "startTime", event.currentTarget.value)
                      }
                      disabled={!canEdit}
                    />
                  </label>
                  <label className="sport-board-card__field">
                    <span>Fin</span>
                    <input
                      type="time"
                      value={timeDrafts[selectedDay.id]?.endTime ?? normalizeTimeValue(selectedDay.endTime)}
                      onChange={handleTimeChange(selectedDay.id, "endTime")}
                      onBlur={(event) => void commitTimeValue(selectedDay.id, "endTime", event.currentTarget.value)}
                      disabled={!canEdit}
                    />
                  </label>
                </div>

                <label className="sport-board-card__checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDay.done}
                    onChange={handleDoneToggle(selectedDay.id)}
                    disabled={!canEdit}
                  />
                  <span>Séance effectuée</span>
                </label>
              </article>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

export default SportPage
