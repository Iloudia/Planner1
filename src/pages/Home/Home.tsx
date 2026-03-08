import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTasks } from "../../context/TasksContext"
import { useAuth } from "../../context/AuthContext"
import { useUserProfilePhoto } from "../../hooks/useUserProfilePhoto"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"

import planner01 from "../../assets/sport.webp"
import planner02 from "../../assets/MoodBoard.webp"
import planner03 from "../../assets/Journaling.webp"
import planner04 from "../../assets/Aimer.webp"
import planner05 from "../../assets/Habits.webp"
import planner06 from "../../assets/katie-huber-rhoades-dupe (1).webp"
import planner07 from "../../assets/ebony-forsyth-dupe.webp"
import planner08 from "../../assets/Routine.webp"
import planner09 from "../../assets/avocado-toast.webp"
import noeudPapillon from "../../assets/noeud-papillon.webp"

import "./Home.css"

const HOME_MOODBOARD_SUFFIX = "planner.home.moodboard"
const DEFAULT_HOME_MOODBOARD = planner02
const ONBOARDING_STORAGE_KEY = "planner.onboarding.answers.v1"

const DEFAULT_PROFILE_PHOTO = planner06
const CARD_USAGE_SUFFIX = "home.card-usage"
const MAX_TODOS = 3

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
  { image: planner01, alt: "Sport", kicker: "Ã‰nergie", title: "Sport", path: "/sport" },
  { image: planner06, alt: "Calendrier", kicker: "Vue globale", title: "Calendrier mensuel", path: "/calendrier" },
  { image: planner05, alt: "Wishlist", kicker: "Envies", title: "Wishlist", path: "/wishlist" },
  { image: planner03, alt: "Journaling", kicker: "Reflet", title: "Journaling", path: "/journaling" },
  { image: planner04, alt: "Self-love", kicker: "Soin", title: "S'aimer soi-mÃªme", path: "/self-love" },
  { image: planner07, alt: "Finances", kicker: "Budget", title: "Finances", path: "/finances" },
  { image: planner08, alt: "Routine", kicker: "Rythme", title: "Routine", path: "/routine" },
  { image: planner09, alt: "Cuisine", kicker: "Saveurs", title: "Cuisine", path: "/alimentation" },
]

const CATEGORY_TO_PATH: Record<string, string> = {
  sport: "/sport",
  journaling: "/journaling",
  "self-love": "/self-love",
  finances: "/finances",
  routine: "/routine",
  wishlist: "/wishlist",
  "calendrier mensuel": "/calendrier",
  cuisine: "/alimentation",
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

const capitalizeFirst = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value)

const formatDate = (dateStr: string) =>
  capitalizeFirst(
    new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
  )

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

  const progress = (start: Date, end: Date) =>
    clamp(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)

  return {
    year: progress(startYear, endYear),
    month: progress(startMonth, endMonth),
    day: progress(startDay, endDay),
  }
}

function safeReadStorage(key: string): string | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)
      return typeof parsed === "string" ? parsed : raw
    } catch {
      return raw
    }
  } catch {
    return null
  }
}

function safeWriteStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function safeRemoveStorage(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

async function fileToCompressedFitDataUrl(
  file: File,
  opts?: { maxSide?: number; quality?: number },
): Promise<string> {
  const maxSide = opts?.maxSide ?? 1600
  const quality = opts?.quality ?? 0.78

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."))
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null
      if (!result) reject(new Error("Fichier invalide."))
      else resolve(result)
    }
    reader.readAsDataURL(file)
  })

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Image non valide."))
    image.src = dataUrl
  })

  const width = img.width
  const height = img.height
  if (!width || !height) throw new Error("Image invalide.")

  const scale = Math.min(1, maxSide / Math.max(width, height))
  const outputWidth = Math.round(width * scale)
  const outputHeight = Math.round(height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = outputWidth
  canvas.height = outputHeight

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas indisponible.")

  ctx.drawImage(img, 0, 0, outputWidth, outputHeight)

  const webp = canvas.toDataURL("image/webp", quality)
  return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", quality)
}

function HomePage() {
  const navigate = useNavigate()
  const { tasks, isLoading: isTasksLoading, error: tasksError } = useTasks()
  const { userEmail, username } = useAuth()

  const safeEmail = userEmail ?? "anonymous"
  const scopedKey = useCallback((suffix: string) => buildUserScopedKey(safeEmail, suffix), [safeEmail])

  const homeMoodboardKey = useMemo(() => scopedKey(HOME_MOODBOARD_SUFFIX), [scopedKey])
  const todosKey = useMemo(() => scopedKey("todos"), [scopedKey])
  const cardUsageKey = useMemo(() => scopedKey(CARD_USAGE_SUFFIX), [scopedKey])
  const onboardingKey = useMemo(
    () => buildUserScopedKey(normalizeUserEmail(safeEmail), ONBOARDING_STORAGE_KEY),
    [safeEmail],
  )

  const [now, setNow] = useState(() => new Date())

  const { photoSrc: profileSrc, error: profileError, uploadPhoto } = useUserProfilePhoto({
    fallbackSrc: DEFAULT_PROFILE_PHOTO,
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [homeMoodboardSrc, setHomeMoodboardSrc] = useState<string>(() => {
    const stored = safeReadStorage(homeMoodboardKey)
    if (stored && stored.includes("activities.jpeg")) {
      return DEFAULT_HOME_MOODBOARD
    }
    return stored ?? DEFAULT_HOME_MOODBOARD
  })
  const [moodboardError, setMoodboardError] = useState<string | null>(null)
  const moodboardInputRef = useRef<HTMLInputElement | null>(null)

  const [todoInput, setTodoInput] = useState("")
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem(todosKey)
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed.slice(0, MAX_TODOS) : []
    } catch {
      return []
    }
  })

  const [progress, setProgress] = useState(() => computeProgress())
  const profileUsername = useMemo(() => username?.trim() || "", [username])
  const isTodoLimitReached = todos.length >= MAX_TODOS
  const [showTodoLimitMessage, setShowTodoLimitMessage] = useState(false)
  const [isProfilePhotoMenuOpen, setIsProfilePhotoMenuOpen] = useState(false)

  const [cardUsage, setCardUsage] = useState<Record<string, number>>(() => {
    const saved = safeReadStorage(cardUsageKey)
    if (!saved) return {}
    try {
      const parsed = JSON.parse(saved)
      return parsed && typeof parsed === "object" ? (parsed as Record<string, number>) : {}
    } catch {
      return {}
    }
  })

  const preferredCardOrder = useMemo(() => {
    try {
      const raw = localStorage.getItem(onboardingKey)
      if (!raw) return []
      const parsed = JSON.parse(raw) as { categories?: string[] }
      if (!Array.isArray(parsed?.categories)) return []
      const mapped = parsed.categories
        .map((category) => CATEGORY_TO_PATH[String(category).trim().toLowerCase()] ?? "")
        .filter(Boolean)
      return Array.from(new Set(mapped))
    } catch {
      return []
    }
  }, [onboardingKey])

  const orderedCards = useMemo(() => {
    const preferredIndex = new Map(preferredCardOrder.map((path, index) => [path, index]))
    const base = cards.map((card, index) => {
      const usage = cardUsage[card.path] ?? 0
      const usageScore = Math.floor(usage / 3)
      const preferredOrderIndex = preferredIndex.get(card.path)
      const isPreferred = preferredOrderIndex !== undefined
      const score = usageScore + (isPreferred ? 2 : 0)
      return {
        card,
        index,
        score,
        isPreferred,
        preferredOrderIndex: isPreferred ? preferredOrderIndex : Number.POSITIVE_INFINITY,
      }
    })

    return base
      .sort(
        (a, b) =>
          (b.score - a.score) ||
          (Number(b.isPreferred) - Number(a.isPreferred)) ||
          (a.preferredOrderIndex - b.preferredOrderIndex) ||
          (a.index - b.index),
      )
      .map((item) => item.card)
  }, [cardUsage, preferredCardOrder])

  useEffect(() => {
    const current = safeReadStorage(homeMoodboardKey)
    if (current && current.includes("activities.jpeg")) {
      setHomeMoodboardSrc(DEFAULT_HOME_MOODBOARD)
      safeWriteStorage(homeMoodboardKey, DEFAULT_HOME_MOODBOARD)
      return
    }
    if (current) {
      setHomeMoodboardSrc(current)
      return
    }

    const legacy = safeReadStorage("planner.home.moodboard")
    if (legacy) {
      if (legacy.includes("activities.jpeg")) {
        setHomeMoodboardSrc(DEFAULT_HOME_MOODBOARD)
        safeWriteStorage(homeMoodboardKey, DEFAULT_HOME_MOODBOARD)
        return
      }
      setHomeMoodboardSrc(legacy)
      safeWriteStorage(homeMoodboardKey, legacy)
      return
    }

    setHomeMoodboardSrc(DEFAULT_HOME_MOODBOARD)
  }, [homeMoodboardKey])

  useEffect(() => {
    if (!safeWriteStorage(homeMoodboardKey, homeMoodboardSrc)) {
      setMoodboardError("Impossible d'enregistrer le moodboard (stockage plein). Choisis une image plus legere.")
    }
  }, [homeMoodboardKey, homeMoodboardSrc])

  useEffect(() => {
    safeWriteStorage(todosKey, JSON.stringify(todos))
  }, [todosKey, todos])

  useEffect(() => {
    safeWriteStorage(cardUsageKey, JSON.stringify(cardUsage))
  }, [cardUsageKey, cardUsage])

  useEffect(() => {
    // Remove any old per-card customization so the default home cards are always shown.
    safeRemoveStorage(scopedKey("home.card-titles"))
    safeRemoveStorage(scopedKey("home.card-images"))
  }, [scopedKey])

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

  useEffect(() => {
    document.body.classList.add("home-page--lux")
    return () => {
      document.body.classList.remove("home-page--lux")
    }
  }, [])

  useEffect(() => {
    if (!showTodoLimitMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShowTodoLimitMessage(false)
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [showTodoLimitMessage])

  useEffect(() => {
    if (!isProfilePhotoMenuOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest(".home-profile-card__menu") || target.closest(".home-profile-card__menu-popover")) {
        return
      }
      setIsProfilePhotoMenuOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isProfilePhotoMenuOpen])

  const addTodo = () => {
    const text = todoInput.trim()
    if (!text) return
    if (isTodoLimitReached) {
      setShowTodoLimitMessage(true)
      return
    }

    setShowTodoLimitMessage(false)
    setTodos((prev) => {
      if (prev.length >= MAX_TODOS) {
        setShowTodoLimitMessage(true)
        return prev
      }
      return [{ id: `todo-${Date.now()}`, text, done: false }, ...prev]
    })
    setTodoInput("")
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((item) => item.id !== id))
  }

  const handleProfileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await uploadPhoto(file)
    } finally {
      event.target.value = ""
    }
  }

  const handleMoodboardInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setMoodboardError(null)
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setMoodboardError("Format non supporte. Choisis une image.")
      event.target.value = ""
      return
    }

    try {
      const compressed = await fileToCompressedFitDataUrl(file, { maxSide: 1600, quality: 0.78 })
      setHomeMoodboardSrc(compressed)
    } catch (error) {
      setMoodboardError(error instanceof Error ? error.message : "Erreur lors du traitement de l'image.")
    } finally {
      event.target.value = ""
    }
  }

  const bumpCardUsage = useCallback(
    (path: string) => {
      const stored = safeReadStorage(cardUsageKey)
      let base: Record<string, number> = {}
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed && typeof parsed === "object") {
            base = parsed as Record<string, number>
          }
        } catch {
          base = {}
        }
      }

      const next = { ...base, [path]: (base[path] ?? 0) + 1 }
      safeWriteStorage(cardUsageKey, JSON.stringify(next))
      setCardUsage(next)
    },
    [cardUsageKey],
  )

  const upcomingTasks = useMemo(() => {
    const nowTs = now.getTime()

    const normalized = tasks
      .map((task) => {
        const dateTs = new Date(`${task.date}T00:00`).getTime()
        const startDate = new Date(`${task.date}T${task.start ?? "00:00"}`)
        const endDate = new Date(`${task.date}T${task.end ?? task.start ?? "23:59"}`)
        const startTs = Number.isFinite(startDate.getTime()) ? startDate.getTime() : dateTs
        const endTs = Number.isFinite(endDate.getTime()) ? endDate.getTime() : startTs

        return {
          id: task.id,
          title: task.title,
          date: task.date,
          start: task.start,
          end: task.end,
          startTs,
          endTs,
        }
      })
      .filter((task) => task.endTs > nowTs)
      .sort((a, b) => a.startTs - b.startTs)
      .slice(0, 2)

    return normalized.map(({ startTs: _startTs, endTs: _endTs, ...task }) => task)
  }, [now, tasks])

  return (
    <div className="page home-page">
      <aside className="aside-right">
        <div className="profile-card">
          <div className="profile-photo">
            <img src={profileSrc} alt="Profil" loading="eager" decoding="async" width={220} height={220} />
            <div className="home-profile-card__menu">
              <button
                className="profile-menu"
                aria-label="Options photo de profil"
                aria-expanded={isProfilePhotoMenuOpen}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setIsProfilePhotoMenuOpen((previous) => !previous)
                }}
              >
                <span aria-hidden="true">...</span>
              </button>
              {isProfilePhotoMenuOpen ? (
                <div className="home-profile-card__menu-popover" role="menu" onClick={(event) => event.stopPropagation()}>
                  <button
                    type="button"
                    className="home-profile-card__menu-item"
                    onClick={() => {
                      setIsProfilePhotoMenuOpen(false)
                      fileInputRef.current?.click()
                    }}
                  >
                    Modifier la photo
                  </button>
                </div>
              ) : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="profile-file-input"
              onChange={handleProfileInput}
            />
          </div>

          <div className="profile-actions">{profileError ? <p className="profile-error">{profileError}</p> : null}</div>
        </div>

        <p className="profile-welcome">
          {`C'est un plaisir de te revoir${profileUsername ? `, ${profileUsername}` : ""}`}
          <img className="profile-welcome__bow" src={noeudPapillon} alt="" aria-hidden="true" loading="eager" decoding="async" />
        </p>

        <div className="progress-panel">
          <div className="progress-row">
            <div className="progress-label">
              <span>AnnÃ©e</span>
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
              <span>JournÃ©e</span>
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
              <h3>Bloc-notes</h3>
            </div>
          </div>

          <div className="todo-input">
            <input
              type="text"
              value={todoInput}
              onChange={(event) => setTodoInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  addTodo()
                }
              }}
              placeholder="Ajouter une tÃ¢che"
            />
            <button type="button" className="todo-add" onClick={addTodo} aria-label="Ajouter une tÃ¢che">
              +
            </button>
          </div>

          {false ? (
            <p className="todo-limit-message">Le bloc-notes est limité à 3 notes. Supprime-en une pour en ajouter une autre.</p>
          ) : null}

          {showTodoLimitMessage ? <p className="todo-limit-message">Le bloc-notes est limité à 3 notes.</p> : null}

          <ul className="todo-list">
            {todos.map((item) => (
              <li key={item.id} className={item.done ? "todo-item is-done" : "todo-item"}>
                <label>
                  <input type="checkbox" checked={item.done} onChange={() => toggleTodo(item.id)} />
                  <span>{item.text}</span>
                </label>
                <button type="button" onClick={() => deleteTodo(item.id)} aria-label="Supprimer la tÃ¢che">
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="board">
        <section className="home-hero-strip">
          <div className="home-hero-strip__center">
            <div className="today">{todayLabel()}</div>
            <h1>Organise tes journÃ©es avec intention</h1>
          </div>
        </section>

        <section className="card-grid">
          {orderedCards.map((card) => (
            <article
              key={card.title}
              className="card"
              role="button"
              tabIndex={0}
              onClick={() => {
                bumpCardUsage(card.path)
                navigate(card.path)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  bumpCardUsage(card.path)
                  navigate(card.path)
                }
              }}
            >
              <img
                src={card.image}
                alt={card.alt}
                loading="lazy"
                decoding="async"
                style={card.path === "/self-love" ? { objectPosition: "center 30%" } : undefined}
              />
              <div className="card-body">
                <h3>{card.title}</h3>
              </div>
            </article>
          ))}
        </section>
      </main>

      <aside className="aside-left">
        <div className="aside-title">Prochaines tÃ¢ches</div>
        <div className="task-window">
          <div className="task-list">
            {tasksError ? (
              <article className="task-card">
                <p className="task-title">Agenda indisponible</p>
                <p className="task-note">{tasksError}</p>
              </article>
            ) : isTasksLoading ? (
              <article className="task-card">
                <p className="task-title">Chargement de l'agenda</p>
                <p className="task-note">Tes prochains Ã©vÃ©nements arrivent...</p>
              </article>
            ) : upcomingTasks.length > 0 ? (
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
                <p className="task-title">Aucune tÃ¢che prÃ©vue</p>
                <p className="task-note">Ajoute une tÃ¢che dans le calendrier.</p>
              </article>
            )}
          </div>
        </div>
      </aside>

      <section className="home-moodboard">
        <div className="home-moodboard__top">
          <h2>Mon visionboard</h2>
          <div className="home-moodboard__top-actions">
            <button type="button" className="home-moodboard__button" onClick={() => moodboardInputRef.current?.click()}>
              Changer l'image
            </button>
          </div>

          <input
            ref={moodboardInputRef}
            type="file"
            accept="image/*"
            className="home-moodboard__file-input"
            onChange={handleMoodboardInput}
          />
        </div>

        {moodboardError ? <p className="home-moodboard__error">{moodboardError}</p> : null}

        <div className="home-moodboard__preview">
          <img src={homeMoodboardSrc} alt="Moodboard personnalisÃ©" loading="lazy" decoding="async" />
        </div>
      </section>
    </div>
  )
}

export default HomePage
