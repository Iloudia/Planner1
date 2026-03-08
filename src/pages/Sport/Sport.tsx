import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react"
import { Link } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import { useAuth } from "../../context/AuthContext"
import useUserSportDashboard from "../../hooks/useUserSportDashboard"
import { createClientId } from "../../utils/clientId"
import { getWeekKey } from "../../utils/weekKey"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"
import heroWorkout from "../../assets/tuany-kohler-dupe.webp"
import heroDiet from "../../assets/thayna-queiroz-dupe.webp"
import heroGoals from "../../assets/sport-1.webp"
import "./Sport.css"

const QUICK_DEFAULTS = [
  "+ Nouvel evenement",
  "+ Nouvel exercice",
  "+ Routine du jour",
  "+ Nouvelle nourriture",
  "+ Daily meal",
  "+ Nouvel objectif",
]

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

const lifeCardDefinitions = [
  { id: "life-workout", label: "Workout", route: "/sport/workout", key: "workout" as const, image: heroWorkout },
  { id: "life-diet", label: "Diet", route: "/diet", key: "diet" as const, image: heroDiet },
  { id: "life-goals", label: "Goals", route: "/goals", key: "goals" as const, image: heroGoals },
]

const SPORT_BOARD_DRAFTS_STORAGE_KEY = "planner.sport.board.drafts.v1"

const SportPage = () => {
  const { userEmail, userId } = useAuth()
  const weekKey = getWeekKey()
  const { board, dashboard, isLoading, error, updateBoardDay, saveQuickItems } =
    useUserSportDashboard(weekKey)
  const canEdit = Boolean(userId)
  const [isEditingQuick, setIsEditingQuick] = useState(false)
  const [activityDrafts, setActivityDrafts] = useState<Record<string, string>>({})
  const [savedActivityDayId, setSavedActivityDayId] = useState<string | null>(null)
  const activityDraftsRef = useRef<Record<string, string>>({})
  const activitySaveTimeoutsRef = useRef<Record<string, number>>({})
  const savedActivityFeedbackTimeoutRef = useRef<number | null>(null)
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
    if (dashboard.quickItems.some((item) => item.text.trim().length > 0)) {
      setIsEditingQuick(true)
    }
  }, [dashboard.quickItems])

  useEffect(() => {
    if (canEdit) return
    setIsEditingQuick(false)
  }, [canEdit])

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

  const quickItems = dashboard.quickItems
  const weekRange = useMemo(() => computeWeekRange(board.days.map((day) => day.dateISO)), [board.days])

  const persistQuickItems = async (items: typeof dashboard.quickItems) => {
    if (!canEdit) return
    const normalized = items
      .map((item, index) => ({
        id: item.id,
        text: item.text,
        sortOrder: item.sortOrder ?? index,
      }))
      .filter((item) => item.text.trim().length > 0 || isEditingQuick)
    await saveQuickItems(normalized)
  }

  const addQuickItem = async () => {
    if (!canEdit) return
    const nextItems = [
      ...quickItems,
      {
        id: createClientId("sport-chip"),
        text: "",
        sortOrder: quickItems.length,
      },
    ]
    setIsEditingQuick(true)
    await saveQuickItems(nextItems)
  }

  const updateQuickItem = async (id: string, text: string) => {
    if (!canEdit) return
    const nextItems = quickItems.map((item) => (item.id === id ? { ...item, text } : item))
    await saveQuickItems(nextItems)
  }

  const removeQuickItem = async (id: string) => {
    if (!canEdit) return
    const nextItems = quickItems
      .filter((item) => item.id !== id)
      .map((item, index) => ({ ...item, sortOrder: index }))
    if (nextItems.length === 0) {
      setIsEditingQuick(false)
    }
    await saveQuickItems(nextItems)
  }

  const startEditingQuickFromLabel = async () => {
    if (!canEdit) return
    if (quickItems.length === 0) {
      await addQuickItem()
      return
    }
    setIsEditingQuick(true)
  }

  const finalizeQuickItems = async () => {
    if (!canEdit) return
    const trimmedItems = quickItems
      .map((item, index) => ({
        ...item,
        text: item.text.trim(),
        sortOrder: index,
      }))
      .filter((item) => item.text.length > 0)
    setIsEditingQuick(trimmedItems.length > 0)
    await saveQuickItems(trimmedItems)
  }

  useEffect(() => {
    if (!isEditingQuick) return
    const handleClickOutsideQuick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        target.closest(".sport-chip__inline-editor") ||
        target.closest(".sport-chip--add") ||
        target.closest(".sport-chip--remove")
      ) {
        return
      }
      void finalizeQuickItems()
    }
    document.addEventListener("mousedown", handleClickOutsideQuick)
    return () => document.removeEventListener("mousedown", handleClickOutsideQuick)
  }, [dashboard.quickItems, isEditingQuick])

  const clearActivitySaveTimeout = (dayId: string) => {
    const timeoutId = activitySaveTimeoutsRef.current[dayId]
    if (!timeoutId) {
      return
    }
    window.clearTimeout(timeoutId)
    delete activitySaveTimeoutsRef.current[dayId]
  }

  const showSavedActivityFeedback = (dayId: string) => {
    if (savedActivityFeedbackTimeoutRef.current) {
      window.clearTimeout(savedActivityFeedbackTimeoutRef.current)
    }
    setSavedActivityDayId(dayId)
    savedActivityFeedbackTimeoutRef.current = window.setTimeout(() => {
      setSavedActivityDayId(null)
      savedActivityFeedbackTimeoutRef.current = null
    }, 2000)
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
    if (event.key !== "Enter") {
      return
    }
    event.preventDefault()
    clearActivitySaveTimeout(dayId)
    const wasCommitted = await commitActivityValue(dayId, event.currentTarget.value)
    if (!wasCommitted) {
      return
    }
    event.currentTarget.blur()
    showSavedActivityFeedback(dayId)
  }

  useEffect(
    () => () => {
      Object.values(activitySaveTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      activitySaveTimeoutsRef.current = {}
      if (savedActivityFeedbackTimeoutRef.current) {
        window.clearTimeout(savedActivityFeedbackTimeoutRef.current)
      }
    },
    [],
  )

  const handleDoneToggle = (dayId: string) => async (event: ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return
    await updateBoardDay(dayId, { done: event.target.checked })
  }

  return (
    <div className="sport-page">
      <PageHeading eyebrow="Routine active" title="Sport" />
      {!canEdit ? <p className="routine-note__composer-hint">Connecte-toi pour enregistrer ton espace sport.</p> : null}
      {error ? <p className="routine-note__composer-hint">{error}</p> : null}
      {isLoading ? <p className="routine-note__composer-hint">Chargement de ton espace sport...</p> : null}

      <section className="sport-quick-panels">
        <div className="sport-quick-panel">
          <div className="sport-quick-panel__header">
            <span className="sport-quick-panel__title">Ajouts rapides</span>
          </div>
          <div className="sport-quick-panel__chips">
            {isEditingQuick && quickItems.length > 0 ? (
              <>
                {quickItems.map((item) => (
                  <div key={item.id} className="sport-chip__inline-editor">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(event) => void updateQuickItem(item.id, event.target.value)}
                      placeholder="Ajoute ton idee de seance"
                      maxLength={40}
                      disabled={!canEdit}
                    />
                    <button
                      type="button"
                      className="sport-chip sport-chip--remove"
                      onClick={() => void removeQuickItem(item.id)}
                      disabled={!canEdit}
                    >
                      -
                    </button>
                  </div>
                ))}
                <div className="sport-chip__add-row">
                  <button type="button" className="sport-chip sport-chip--add" onClick={() => void addQuickItem()} disabled={!canEdit}>
                    +
                  </button>
                </div>
              </>
            ) : (
              QUICK_DEFAULTS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="sport-chip"
                  onClick={() => void startEditingQuickFromLabel()}
                  disabled={!canEdit}
                >
                  {label}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="sport-quick-panel">
          <div className="sport-quick-panel__header">
            <span className="sport-quick-panel__title">My Life</span>
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
                    {day.done ? "Fait" : "A planifier"}
                  </span>
                </header>
                <label className="sport-board-card__field">
                  <span>Seance</span>
                  <input
                    type="text"
                    value={activityDrafts[day.id] ?? day.activity}
                    onChange={handleActivityChange(day.id)}
                    onBlur={(event) => {
                      clearActivitySaveTimeout(day.id)
                      void commitActivityValue(day.id, event.currentTarget.value)
                    }}
                    onKeyDown={(event) => void handleActivityKeyDown(day.id)(event)}
                    placeholder="Ecris le sport prevu"
                    enterKeyHint="done"
                    disabled={!canEdit}
                  />
                  {savedActivityDayId === day.id ? <span className="sport-board-card__feedback">Enregistre</span> : null}
                </label>
                <label className="sport-board-card__checkbox">
                  <input type="checkbox" checked={day.done} onChange={handleDoneToggle(day.id)} disabled={!canEdit} />
                  <span>Seance effectuee</span>
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
