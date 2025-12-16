import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTasks } from "../../context/TasksContext"
import planner01 from "../../assets/sport.jpeg"
import planner02 from "../../assets/activities.jpeg"
import planner03 from "../../assets/mallika-jain-dupe.jpeg"
import planner04 from "../../assets/selflove.jpeg"
import planner05 from "../../assets/medhanshi-mandawewala-dupe.jpeg"
import planner06 from "../../assets/katie-huber-rhoades-dupe (1).jpeg"
import planner07 from "../../assets/ebony-forsyth-dupe.jpeg"
import planner08 from "../../assets/l-b-dupe.jpeg"
import planner09 from "../../assets/katie-mansfield-dupe.jpeg"
import { useMoodboard } from "../../context/MoodboardContext"
import "./Home.css"

type CardItem = {
  image: string
  alt: string
  kicker: string
  title: string
  path: string
}

type TaskDisplay = {
  id: string
  title: string
  date: string
  start?: string
  end?: string
}

const cards: CardItem[] = [
  { image: planner01, alt: "Sport", kicker: "Energie", title: "Sport", path: "/sport" },
  { image: planner02, alt: "Activites", kicker: "Fun", title: "Activites", path: "/activites" },
  { image: planner03, alt: "Journaling", kicker: "Reflet", title: "Journaling", path: "/journaling" },
  { image: planner04, alt: "Self-love", kicker: "Care", title: "S'aimer soi-meme", path: "/self-love" },
  { image: planner05, alt: "Wishlist", kicker: "Envie", title: "Wishlist", path: "/wishlist" },
  { image: planner06, alt: "Calendrier", kicker: "Vue globale", title: "Calendrier mensuel", path: "/calendrier" },
  { image: planner07, alt: "Finances", kicker: "Budget", title: "Finances", path: "/finances" },
  { image: planner08, alt: "Routine", kicker: "Rythme", title: "Routine", path: "/routine" },
  { image: planner09, alt: "Cuisine", kicker: "Saveurs", title: "Cuisine", path: "/alimentation" },
]

const clamp = (value: number) => Math.min(100, Math.max(0, value))

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })

const todayLabel = () =>
  new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

const computeProgress = () => {
  const now = new Date()
  const startYear = new Date(now.getFullYear(), 0, 1)
  const endYear = new Date(now.getFullYear() + 1, 0, 1)
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  const progress = (start: Date, end: Date) => clamp(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)

  return {
    year: progress(startYear, endYear),
    month: progress(startMonth, endMonth),
    day: progress(startDay, endDay),
  }
}

function HomePage() {
  const navigate = useNavigate()
  const { tasks } = useTasks()
  const [now, setNow] = useState(() => new Date())
  const [profileSrc, setProfileSrc] = useState<string>(planner02)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const moodboardInputRef = useRef<HTMLInputElement | null>(null)
  const [todoInput, setTodoInput] = useState("")
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    const saved = localStorage.getItem("planner-todos")
    if (!saved) return []
    try {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [progress, setProgress] = useState(() => computeProgress())
  const userInfo = { pseudo: "Planner lover", birthday: "12 mars", sign: "Poissons" }
  const { moodboardSrc, updateMoodboard, resetMoodboard, isCustom } = useMoodboard()

  useEffect(() => {
    const savedProfile = localStorage.getItem("planner-profile-photo")
    if (savedProfile) setProfileSrc(savedProfile)
  }, [])

  useEffect(() => {
    localStorage.setItem("planner-todos", JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const update = () => setProgress(computeProgress())
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [])

  const addTodo = () => {
    const text = todoInput.trim()
    if (!text) return
    setTodos((prev) => [{ id: `todo-${Date.now()}`, text, done: false }, ...prev])
    setTodoInput("")
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((item) => item.id !== id))
  }

  const handleMoodboardInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null
      if (result) {
        updateMoodboard(result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  const upcomingTasks = useMemo(() => {
    const nowTs = now.getTime()
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const baseTasks = tasks

    const normalized = baseTasks
      .map((task) => {
        const dateTs = new Date(`${task.date}T00:00`).getTime()
        const startDate = new Date(`${task.date}T${task.start ?? "00:00"}`)
        const startTs = Number.isFinite(startDate.getTime()) ? startDate.getTime() : dateTs
        return {
          id: task.id,
          title: task.title,
          date: task.date,
          start: task.start,
          end: task.end,
          dateTs: Number.isFinite(dateTs) ? dateTs : 0,
          startTs,
        }
      })
      .filter((task) => task.startTs >= nowTs || task.dateTs >= todayMidnight)
      .sort((a, b) => a.startTs - b.startTs)
      .slice(0, 2)

    return normalized.map(({ dateTs: _dateTs, startTs: _startTs, ...task }) => task)
  }, [now, tasks])

  return (
    <>
      <div className="page home-page">
        <aside className="aside-right">
          <div className="profile-card">
            <div className="profile-photo">
              <img src={profileSrc} alt="Profil" />
              <button className="profile-menu" aria-label="Modifier la photo" type="button" onClick={() => fileInputRef.current?.click()}>
                <span aria-hidden="true">...</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="profile-file-input"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    const result = typeof reader.result === "string" ? reader.result : null
                    if (!result) return
                    setProfileSrc(result)
                    localStorage.setItem("planner-profile-photo", result)
                  }
                  reader.readAsDataURL(file)
                }}
              />
            </div>
          </div>

          <div className="profile-info">
            <div>
              <p className="eyebrow">Pseudo</p>
              <strong>{userInfo.pseudo}</strong>
            </div>
            <div>
              <p className="eyebrow">Anniversaire</p>
              <strong>{userInfo.birthday}</strong>
            </div>
            <div>
              <p className="eyebrow">Signe</p>
              <strong>{userInfo.sign}</strong>
            </div>
          </div>

          <div className="progress-panel">
            <div className="progress-row">
              <div className="progress-label">
                <span>Annee</span>
                <span>{progress.year.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress.year}%` }} />
              </div>
            </div>
            <div className="progress-row">
              <div className="progress-label">
                <span>Mois</span>
                <span>{progress.month.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress.month}%` }} />
              </div>
            </div>
            <div className="progress-row">
              <div className="progress-label">
                <span>Journee</span>
                <span>{progress.day.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress.day}%` }} />
              </div>
            </div>
          </div>

          <div className="notes">
            <div className="notes-header">
              <div>
                <h3>Bloc notes</h3>
              </div>
            </div>
            <div className="todo-input">
              <button type="button" className="todo-add" onClick={addTodo} aria-label="Ajouter une tache">
                +
              </button>
              <input type="text" value={todoInput} onChange={(e) => setTodoInput(e.target.value)} placeholder="Ajouter une tache" />
            </div>
            <ul className="todo-list">
              {todos.map((item) => (
                <li key={item.id} className={item.done ? "todo-item is-done" : "todo-item"}>
                  <label>
                    <input type="checkbox" checked={item.done} onChange={() => toggleTodo(item.id)} />
                    <span>{item.text}</span>
                  </label>
                  <button type="button" onClick={() => deleteTodo(item.id)} aria-label="Supprimer la tache">
                    x
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="board">
          <section className="home-hero-strip">
            <div>
              <p className="eyebrow">Planner Home</p>
              <h1>Organise tes journees avec intention</h1>
            </div>
            <div className="today">{todayLabel()}</div>
          </section>
          <section className="card-grid">
            {cards.map((card) => (
              <article
                key={card.title}
                className="card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(card.path)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") navigate(card.path)
                }}
              >
                <img src={card.image} alt={card.alt} />
                <div className="card-body">
                  <h3>{card.title}</h3>
                </div>
              </article>
            ))}
          </section>
        </main>

        <aside className="aside-left">
          <div className="aside-title">Prochaines taches</div>
          <div className="task-window">
            <div className="task-list">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <article key={`${task.title}-${task.date}`} className="task-card">
                    <div className="task-card__header">
                      <p className="task-date">{formatDate(task.date)}</p>
                    </div>
                    <h4 className="task-title">{task.title}</h4>
                    {task.start || task.end ? (
                      <div className="task-meta">
                        <span className="task-time-chip">
                          {task.start ?? ""} {task.end ? `- ${task.end}` : ""}
                        </span>
                      </div>
                    ) : null}
                  </article>
                ))
              ) : (
                <article className="task-card">
                  <p className="task-title">Aucune tache prevue</p>
                  <p className="task-note">Ajoute une tache dans le calendrier.</p>
                </article>
              )}
            </div>
          </div>
        </aside>
        <section className="home-moodboard">
          <div className="home-moodboard__top">
            <button type="button" className="home-moodboard__button" onClick={() => moodboardInputRef.current?.click()}>
              Changer l image
            </button>
            <input ref={moodboardInputRef} type="file" accept="image/*" className="home-moodboard__file-input" onChange={handleMoodboardInput} />
          </div>
          <div className="home-moodboard__preview">
            {isCustom ? (
              <button type="button" className="home-moodboard__reset" onClick={resetMoodboard}>
                Reinitialiser
              </button>
            ) : null}
            <img src={moodboardSrc} alt="Moodboard personnalise" />
          </div>
        </section>
        <div className="home-footer-bar" aria-hidden="true" />
      </div>
    </>
  )
}

export default HomePage
