import { useEffect, useMemo } from "react"
import type { ChangeEvent } from "react"
import { Link } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import usePersistentState from "../../hooks/usePersistentState"
import planner01 from "../../assets/planner-01.jpg"
import planner02 from "../../assets/planner-02.jpg"
import planner03 from "../../assets/planner-03.jpg"
import planner06 from "../../assets/planner-06.jpg"
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

const DAY_LABELS = [
  { id: "mon", label: "Lundi" },
  { id: "tue", label: "Mardi" },
  { id: "wed", label: "Mercredi" },
  { id: "thu", label: "Jeudi" },
  { id: "fri", label: "Vendredi" },
  { id: "sat", label: "Samedi" },
  { id: "sun", label: "Dimanche" },
] as const

const DEFAULT_BOARD_ACTIVITIES: SportBoardActivity[] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
]

const formatBoardDate = (isoDate: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" }).format(new Date(isoDate))

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
      dateISO: current.toISOString().split("T")[0],
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

const SportPage = () => {
  const [board, setBoard] = usePersistentState<SportBoardDay[]>(SPORT_BOARD_STORAGE_KEY, createDefaultBoard)
  const legacyDefaults = useMemo(
    () => new Set(["Cardio", "Renforcement", "Yoga", "Fitness", "Mobility", "Pilates", "Repos actif"]),
    [],
  )
  const lifeCards = useMemo(
    () => [
      { id: "life-workout", label: "Workout", image: planner01 },
      { id: "life-diet", label: "Diet", image: planner02 },
      { id: "life-goals", label: "Goals", image: planner03 },
    ],
    [],
  )

  useEffect(() => {
    document.body.classList.add("planner-page--white")
    return () => {
      document.body.classList.remove("planner-page--white")
    }
  }, [])

  useEffect(() => {
    if (!Array.isArray(board) || board.length !== DAY_LABELS.length) {
      setBoard(createDefaultBoard())
      return
    }
    let needsCleanup = false
    const cleaned = board.map((day) => {
      if (legacyDefaults.has(day.activity)) {
        needsCleanup = true
        return { ...day, activity: "" }
      }
      return day
    })
    if (needsCleanup) {
      setBoard(cleaned)
    }
  }, [board, legacyDefaults, setBoard])

  const weekRange = useMemo(() => computeWeekRange(board), [board])

  const handleActivityChange = (dayId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const nextActivity = event.target.value
    setBoard((previous) => previous.map((day) => (day.id === dayId ? { ...day, activity: nextActivity } : day)))
  }

  const handleDoneToggle = (dayId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setBoard((previous) => previous.map((day) => (day.id === dayId ? { ...day, done: checked } : day)))
  }

  return (
    <div className="sport-page">
      <div className="sport-hero-image">
        <img src={planner06} alt="Ambiance sport" />
      </div>
      <div className="sport-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Routine active" title="Programme de sport" />

      <section className="sport-quick-panels">
        <div className="sport-quick-panel">
          <div className="sport-quick-panel__header">
            <span className="sport-quick-panel__title">Ajouts rapides</span>
          </div>
          <div className="sport-quick-panel__divider" />
          <div className="sport-quick-panel__chips">
            {[
              "+ Nouvel événement",
              "+ Nouvel exercice",
              "+ Routine du jour",
              "+ Nouvelle nourriture",
              "+ Daily meal",
              "+ Nouvel objectif",
            ].map((label) => (
              <button key={label} type="button" className="sport-chip">
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="sport-quick-panel">
          <div className="sport-quick-panel__header">
            <span className="sport-quick-panel__title">My Life</span>
          </div>
          <div className="sport-quick-panel__divider" />
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
                  <input type="text" value={day.activity} onChange={handleActivityChange(day.id)} placeholder="Écris le sport prévu" />
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
