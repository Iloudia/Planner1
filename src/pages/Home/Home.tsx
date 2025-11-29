import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import planner01 from "../../assets/planner-01.jpg"
import planner02 from "../../assets/planner-02.jpg"
import planner03 from "../../assets/planner-03.jpg"
import planner04 from "../../assets/planner-04.jpg"
import planner05 from "../../assets/planner-05.jpg"
import planner06 from "../../assets/planner-06.jpg"
import planner07 from "../../assets/planner-07.jpg"
import planner08 from "../../assets/planner-08.jpg"
import "./Home.css"

type Task = {
  date: string
  title: string
  note: string
}

type CardItem = {
  image: string
  alt: string
  kicker: string
  title: string
  path: string
}

const cards: CardItem[] = [
  { image: planner01, alt: "Sport", kicker: "Energie", title: "Sport", path: "/sport" },
  { image: planner02, alt: "Activités", kicker: "Fun", title: "Activités", path: "/activites" },
  { image: planner03, alt: "Journaling", kicker: "Reflet", title: "Journaling", path: "/journaling" },
  { image: planner04, alt: "Self-love", kicker: "Care", title: "S'aimer soi-même", path: "/self-love" },
  { image: planner05, alt: "Wishlist", kicker: "Envie", title: "Wishlist", path: "/wishlist" },
  { image: planner06, alt: "Calendrier", kicker: "Vue globale", title: "Calendrier mensuel", path: "/calendrier" },
  { image: planner07, alt: "Finances", kicker: "Budget", title: "Finances", path: "/finances" },
  { image: planner08, alt: "Routine", kicker: "Rythme", title: "Routine", path: "/routine" },
]

const taskData: Task[] = [
  { date: "2025-11-27", title: "Ranger l'espace de travail", note: "20 min pour désencombrer le bureau avant la prochaine session de focus." },
  { date: "2025-11-28", title: "Session sport - force", note: "Upper body - 45 min, noter la progression sur les tractions et le développé." },
  { date: "2025-11-29", title: "Planifier les repas", note: "Lister 3 dîners simples + batch cooking du dimanche soir." },
  { date: "2025-11-30", title: "Journaling longue forme", note: "Bilan du mois, victoires + obstacles, intentions pour la semaine prochaine." },
  { date: "2025-12-01", title: "Check finances", note: "Mettre à jour le suivi budget et programmer l'épargne automatique." },
  { date: "2025-12-02", title: "Routine self-care", note: "1h pour soi : lecture + soin visage, sans écran." },
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

const findFirstFutureIndex = (tasks: Task[]) => {
  const now = new Date()
  const idx = tasks.findIndex((task) => new Date(task.date).getTime() >= now.getTime())
  return idx >= 0 ? idx : 0
}

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
  const sortedTasks = useMemo(() => [...taskData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [])
  const [currentTask, setCurrentTask] = useState(() => findFirstFutureIndex(sortedTasks))
  const [profileSrc, setProfileSrc] = useState<string>(planner02)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [todoInput, setTodoInput] = useState("")
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>([])
  const [progress, setProgress] = useState(() => computeProgress())
  const taskOffset = sortedTasks.length ? (currentTask / sortedTasks.length) * 100 : 0
  const userInfo = { pseudo: "Planner lover", birthday: "12 mars", sign: "Poissons" }

  useEffect(() => {
    const savedTodos = localStorage.getItem("planner-todos")
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch {
        setTodos([])
      }
    }
    const savedProfile = localStorage.getItem("planner-profile-photo")
    if (savedProfile) setProfileSrc(savedProfile)
  }, [])

  useEffect(() => {
    localStorage.setItem("planner-todos", JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    if (!sortedTasks.length) return
    const id = setInterval(() => setCurrentTask((prev) => (prev + 1) % sortedTasks.length), 6500)
    return () => clearInterval(id)
  }, [sortedTasks.length])

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

  return (
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
              <span>Année</span>
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
              <span>Journée</span>
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
              <p className="eyebrow">Liste rapide</p>
              <h3>Tâches perso</h3>
            </div>
          </div>
          <div className="todo-input">
            <button type="button" className="todo-add" onClick={addTodo} aria-label="Ajouter une tâche">
              +
            </button>
            <input type="text" value={todoInput} onChange={(e) => setTodoInput(e.target.value)} placeholder="Ajouter une tâche" />
          </div>
          <ul className="todo-list">
            {todos.map((item) => (
              <li key={item.id} className={item.done ? "todo-item is-done" : "todo-item"}>
                <label>
                  <input type="checkbox" checked={item.done} onChange={() => toggleTodo(item.id)} />
                  <span>{item.text}</span>
                </label>
                <button type="button" onClick={() => deleteTodo(item.id)} aria-label="Supprimer la tâche">
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
            <h1>Organise tes journées avec intention</h1>
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
                <p className="card-kicker">{card.kicker}</p>
                <h3>{card.title}</h3>
              </div>
            </article>
          ))}
        </section>
      </main>

      <aside className="aside-left">
        <div className="aside-title">
          <span className="dot" />
          Prochaines tâches
        </div>
        <div className="task-window">
          <div className="task-list" style={{ transform: `translateY(-${taskOffset}%)` }}>
            {sortedTasks.map((task) => (
              <article key={`${task.title}-${task.date}`} className="task-card">
                <p className="task-date">{formatDate(task.date)}</p>
                <h4 className="task-title">{task.title}</h4>
                <p className="task-note">{task.note}</p>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default HomePage
