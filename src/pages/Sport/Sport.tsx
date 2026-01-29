import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { Link } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import { useAuth } from "../../context/AuthContext"
import usePersistentState from "../../hooks/usePersistentState"
import { buildUserScopedKey } from "../../utils/userScopedKey"
import planner06 from "../../assets/tina-ghazi-dupe.jpeg"
import heroWorkout from "../../assets/tuany-kohler-dupe.jpeg"
import heroDiet from "../../assets/thayna-queiroz-dupe.jpeg"
import heroGoals from "../../assets/sport-1.jpg"
import "./Sport.css"

type SportBoardActivity = string

type SportBoardDay = {
  id: string
  label: string
  dateISO: string
  activity: SportBoardActivity
  done: boolean
}

const SPORT_BOARD_STORAGE_KEY = "planner.sportBoard.v2"
const SPORT_QUICK_STORAGE_KEY = "planner.sport.quickchips.v1"

const DAY_LABELS = [
  { id: "mon", label: "Lundi" },
  { id: "tue", label: "Mardi" },
  { id: "wed", label: "Mercredi" },
  { id: "thu", label: "Jeudi" },
  { id: "fri", label: "Vendredi" },
  { id: "sat", label: "Samedi" },
  { id: "sun", label: "Dimanche" },
] as const

const DEFAULT_BOARD_ACTIVITIES: SportBoardActivity[] = ["", "", "", "", "", "", ""]
const QUICK_DEFAULTS = [
  "+ Nouvel événement",
  "+ Nouvel exercice",
  "+ Routine du jour",
  "+ Nouvelle nourriture",
  "+ Daily meal",
  "+ Nouvel objectif",
]

const formatBoardDate = (isoDate: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(isoDate))

const formatLocalISODate = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getMonday = (reference: Date) => {
  const date = new Date(reference)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

const createDefaultBoard = (): SportBoardDay[] => {
  const start = getMonday(new Date())
  return DAY_LABELS.map(({ label }, index) => {
    const current = new Date(start)
    current.setDate(start.getDate() + index)
    return {
      id: `sport-board-${index}`,
      label,
      dateISO: formatLocalISODate(current),
      activity: DEFAULT_BOARD_ACTIVITIES[index % DEFAULT_BOARD_ACTIVITIES.length],
      done: false,
    }
  })
}

const computeWeekRange = (board: SportBoardDay[]) => {
  if (!Array.isArray(board) || board.length === 0) {
    return ""
  }

  const formatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" })
  const first = formatter.format(new Date(board[0].dateISO))
  const last = formatter.format(new Date(board[board.length - 1].dateISO))
  return `${first} - ${last}`
}

const legacyDefaults = new Set(["Cardio", "Renforcement", "Yoga", "Fitness", "Mobility", "Pilates", "Repos actif"])

const SportPage = () => {
  const { userEmail } = useAuth()
  const [board, setBoard] = usePersistentState<SportBoardDay[]>(SPORT_BOARD_STORAGE_KEY, createDefaultBoard)
  const [quickItems, setQuickItems] = usePersistentState<{ id: string; text: string }[]>(SPORT_QUICK_STORAGE_KEY, () => [])
  const [isEditingQuick, setIsEditingQuick] = useState(() =>
    quickItems.some((item) => item.text.trim().length > 0),
  )
  const [openLifeMenuId, setOpenLifeMenuId] = useState<string | null>(null)
  const quickStorageKey = useMemo(() => buildUserScopedKey(userEmail, SPORT_QUICK_STORAGE_KEY), [userEmail])
  const lifeCards = useMemo(
    () => [
      { id: "life-workout", label: "Workout", image: heroWorkout },
      { id: "life-diet", label: "Diet", image: heroDiet },
      { id: "life-goals", label: "Goals", image: heroGoals },
    ],
    [],
  )

  useEffect(() => {
    if (!Array.isArray(board) || board.length !== DAY_LABELS.length) {
      setBoard(createDefaultBoard())
      return
    }

    const currentWeekMonday = formatLocalISODate(getMonday(new Date()))
    const boardWeekMonday = board[0]?.dateISO

    if (boardWeekMonday !== currentWeekMonday) {
      setBoard(createDefaultBoard())
      return
    }

    let needsCleanup = false
    const cleaned = board.map((day, index) => {
      const activity = day.activity ?? DEFAULT_BOARD_ACTIVITIES[index % DEFAULT_BOARD_ACTIVITIES.length]
      if (legacyDefaults.has(activity)) {
        needsCleanup = true
        return { ...day, activity: "" }
      }
      if (activity !== day.activity) {
        needsCleanup = true
        return { ...day, activity }
      }
      return day
    })
    if (needsCleanup) {
      setBoard(cleaned)
    }
  }, [board, setBoard])

  const weekRange = useMemo(() => computeWeekRange(board), [board])

  const handleActivityChange = (dayId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextActivity = event.target.value
    setBoard((previous) => previous.map((day) => (day.id === dayId ? { ...day, activity: nextActivity } : day)))
  }

  const handleDoneToggle = (dayId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setBoard((previous) => previous.map((day) => (day.id === dayId ? { ...day, done: checked } : day)))
  }

  const addQuickItem = (text: string) => {
    setQuickItems((prev) => [...prev, { id: `chip-${Date.now()}`, text }])
    setIsEditingQuick(true)
  }

  const updateQuickItem = (id: string, text: string) => {
    setQuickItems((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)))
  }

  const startEditingQuickFromLabel = () => {
    setQuickItems((prev) => (prev.length > 0 ? prev : [{ id: `chip-${Date.now()}`, text: "" }]))
    setIsEditingQuick(true)
  }

  const removeQuickItem = (id: string) => {
    setQuickItems((prev) => {
      const next = prev.filter((item) => item.id !== id)
      if (next.length === 0) {
        setIsEditingQuick(false)
      }
      return next
    })
  }

  useEffect(() => {
    if (quickItems.length === 0) {
      setIsEditingQuick(false)
      return
    }
    if (quickItems.some((item) => item.text.trim().length > 0)) {
      setIsEditingQuick(true)
    }
  }, [quickItems])

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
      const trimmedItems = quickItems
        .map((item) => ({ ...item, text: item.text.trim() }))
        .filter((item) => item.text.length > 0)
      if (trimmedItems.length === 0) {
        setQuickItems([])
        setIsEditingQuick(false)
        return
      }
      setQuickItems(trimmedItems)
    }
    document.addEventListener("mousedown", handleClickOutsideQuick)
    return () => document.removeEventListener("mousedown", handleClickOutsideQuick)
  }, [isEditingQuick, quickItems, setQuickItems])

  useEffect(() => {
    const handlePageExit = () => {
      const hasQuickText = quickItems.some((item) => item.text.trim().length > 0)
      if (quickItems.length > 0 && !hasQuickText) {
        try {
          localStorage.removeItem(quickStorageKey)
        } catch {
          // ignore storage errors
        }
      }
    }
    window.addEventListener("beforeunload", handlePageExit)
    window.addEventListener("pagehide", handlePageExit)
    return () => {
      window.removeEventListener("beforeunload", handlePageExit)
      window.removeEventListener("pagehide", handlePageExit)
      handlePageExit()
    }
  }, [quickItems, quickStorageKey])

  useEffect(() => {
    if (!openLifeMenuId) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest(".sport-life-card__menu") || target.closest(".sport-life-card__menu-popover")) return
      setOpenLifeMenuId(null)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openLifeMenuId])

  return (
    <div className="sport-page">
<div className="sport-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Routine active" title="Sport" />

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
                      onChange={(event) => updateQuickItem(item.id, event.target.value)}
                      placeholder="Ajoute ton idée de séance"
                      maxLength={40}
                    />
                    <button type="button" className="sport-chip sport-chip--remove" onClick={() => removeQuickItem(item.id)}>
                      -
                    </button>
                  </div>
                ))}
                <div className="sport-chip__add-row">
                  <button type="button" className="sport-chip sport-chip--add" onClick={() => addQuickItem("")}>
                    +
                  </button>
                </div>
              </>
            ) : (
              QUICK_DEFAULTS.map((label) => (
                <button key={label} type="button" className="sport-chip" onClick={() => startEditingQuickFromLabel()}>
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
            {lifeCards.map((card) => (
              <Link
                key={card.id}
                className="sport-life-card"
                to={
                  card.id === "life-workout"
                    ? "/sport/workout"
                    : card.id === "life-diet"
                      ? "/diet"
                      : card.id === "life-goals"
                        ? "/goals"
                        : "#"
                }
                aria-label={`Ouvrir ${card.label}`}
              >
                <div className="sport-life-card__menu-wrapper">
                  <button
                    type="button"
                    className="sport-life-card__menu"
                    aria-label={`Modifier ${card.label}`}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setOpenLifeMenuId(openLifeMenuId === card.id ? null : card.id)
                    }}
                  >
                    <span aria-hidden="true">...</span>
                  </button>
                  {openLifeMenuId === card.id ? (
                    <div className="sport-life-card__menu-popover" role="menu" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="sport-life-card__menu-item">
                        Modifier la photo
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="sport-life-card__media">
                  <img src={card.image} alt={card.label} />
                </div>
                <h3>{card.label}</h3>
              </Link>
            ))}
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
            {board.map((day) => (
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
                <label className="sport-board-card__field">
                  <span>Séance</span>
                  <input
                    type="text"
                    value={day.activity}
                    onChange={handleActivityChange(day.id)}
                    placeholder="Écris le sport prévu"
                  />
                </label>
                <label className="sport-board-card__checkbox">
                  <input type="checkbox" checked={day.done} onChange={handleDoneToggle(day.id)} />
                  <span>Séance effectuée</span>
                </label>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="sport-page__footer-bar" aria-hidden="true" />
    </div>
  )
}

export default SportPage
