import { useEffect, useMemo, useRef, useState, useCallback, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTasks } from "../../context/TasksContext"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"

import planner01 from "../../assets/sport.jpeg"
import planner02 from "../../assets/activities.jpeg"
import planner03 from "../../assets/mallika-jain-dupe.jpeg"
import planner04 from "../../assets/selflove.jpeg"
import planner05 from "../../assets/medhanshi-mandawewala-dupe.jpeg"
import planner06 from "../../assets/katie-huber-rhoades-dupe (1).jpeg"
import planner07 from "../../assets/ebony-forsyth-dupe.jpeg"
import planner08 from "../../assets/l-b-dupe.jpeg"
import planner09 from "../../assets/katie-mansfield-dupe.jpeg"

import "./Home.css"

const HOME_MOODBOARD_SUFFIX = "planner.home.moodboard"
const DEFAULT_HOME_MOODBOARD = planner02

const PROFILE_PHOTO_SUFFIX = "profile-photo"
const DEFAULT_PROFILE_PHOTO = planner06

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
  { image: planner06, alt: "Calendrier", kicker: "Vue globale", title: "Calendrier mensuel", path: "/calendrier" },
  { image: planner05, alt: "Wishlist", kicker: "Envie", title: "Wishlist", path: "/wishlist" },
  { image: planner02, alt: "ActivitÃ©s", kicker: "Fun", title: "ActivitÃ©s", path: "/activites" },
  { image: planner03, alt: "Journaling", kicker: "Reflet", title: "Journaling", path: "/journaling" },
  { image: planner04, alt: "Self-love", kicker: "Care", title: "S'aimer soi-meme", path: "/self-love" },
  { image: planner07, alt: "Finances", kicker: "Budget", title: "Finances", path: "/finances" },
  { image: planner08, alt: "Routine", kicker: "Rythme", title: "Routine", path: "/routine" },
  { image: planner09, alt: "Cuisine", kicker: "Saveurs", title: "Cuisine", path: "/alimentation" },
]

const clamp = (value: number) => Math.min(100, Math.max(0, value))

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })

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

/** --- Storage helpers (gÃ¨re legacy JSON.stringify) --- */
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
  localStorage.setItem(key, value)
}

function safeRemoveStorage(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

/** --- Compression profil : crop carrÃ© (petit) --- */
async function fileToCompressedSquareDataUrl(
  file: File,
  opts?: { size?: number; quality?: number }
): Promise<string> {
  const size = opts?.size ?? 320
  const quality = opts?.quality ?? 0.82

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
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = () => reject(new Error("Image non valide."))
    i.src = dataUrl
  })

  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas indisponible.")

  const sw = img.width
  const sh = img.height
  const s = Math.min(sw, sh)
  const sx = Math.floor((sw - s) / 2)
  const sy = Math.floor((sh - s) / 2)

  ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size)

  const tryWebp = canvas.toDataURL("image/webp", quality)
  const isWebp = tryWebp.startsWith("data:image/webp")
  return isWebp ? tryWebp : canvas.toDataURL("image/jpeg", quality)
}

/** --- Compression moodboard : conserve le ratio, limite grande dimension --- */
async function fileToCompressedFitDataUrl(
  file: File,
  opts?: { maxSide?: number; quality?: number }
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
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = () => reject(new Error("Image non valide."))
    i.src = dataUrl
  })

  const w = img.width
  const h = img.height
  if (!w || !h) throw new Error("Image invalide.")

  // resize en gardant ratio : la plus grande dimension = maxSide
  const scale = Math.min(1, maxSide / Math.max(w, h))
  const outW = Math.round(w * scale)
  const outH = Math.round(h * scale)

  const canvas = document.createElement("canvas")
  canvas.width = outW
  canvas.height = outH

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas indisponible.")

  ctx.drawImage(img, 0, 0, outW, outH)

  const tryWebp = canvas.toDataURL("image/webp", quality)
  const isWebp = tryWebp.startsWith("data:image/webp")
  return isWebp ? tryWebp : canvas.toDataURL("image/jpeg", quality)
}

function HomePage() {
  const navigate = useNavigate()
  const { tasks } = useTasks()
  const { userEmail } = useAuth()

  const safeEmail = userEmail ?? "anonymous"
  const scopedKey = useCallback((suffix: string) => buildUserScopedKey(safeEmail, suffix), [safeEmail])

  const profileStorageKey = useMemo(() => scopedKey(PROFILE_PHOTO_SUFFIX), [scopedKey])
  const homeMoodboardKey = useMemo(() => scopedKey(HOME_MOODBOARD_SUFFIX), [scopedKey])
  const todosKey = useMemo(() => scopedKey("todos"), [scopedKey])

  const [openCardMenu, setOpenCardMenu] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  /** âœ… Profil (persistÃ© + compressÃ©) */
  const [profileSrc, setProfileSrc] = useState<string>(() => safeReadStorage(profileStorageKey) ?? DEFAULT_PROFILE_PHOTO)
  const [profileError, setProfileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  /** âœ… Moodboard (persistÃ© + compressÃ©) */
  const [homeMoodboardSrc, setHomeMoodboardSrc] = useState<string>(() => safeReadStorage(homeMoodboardKey) ?? DEFAULT_HOME_MOODBOARD)
  const [moodboardError, setMoodboardError] = useState<string | null>(null)
  const moodboardInputRef = useRef<HTMLInputElement | null>(null)

  const [todoInput, setTodoInput] = useState("")
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem(todosKey)
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [progress, setProgress] = useState(() => computeProgress())
  const userInfo = { pseudo: "Planner lover", birthday: "12 mars", sign: "Poissons" }

  const isHomeCustom = homeMoodboardSrc !== DEFAULT_HOME_MOODBOARD

  /** --- Migration legacy profil --- */
  useEffect(() => {
    const current = safeReadStorage(profileStorageKey)
    if (current) {
      setProfileSrc(current)
      return
    }

    const legacy = safeReadStorage("profile-photo")
    if (legacy) {
      setProfileSrc(legacy)
      try {
        safeWriteStorage(profileStorageKey, legacy)
      } catch {
        // ignore
      }
      return
    }

    setProfileSrc(DEFAULT_PROFILE_PHOTO)
  }, [profileStorageKey])

  /** --- Persistance profil --- */
  useEffect(() => {
    try {
      safeWriteStorage(profileStorageKey, profileSrc)
    } catch {
      setProfileError("Impossible dâ€™enregistrer la photo (stockage plein). Choisis une image plus lÃ©gÃ¨re.")
    }
  }, [profileStorageKey, profileSrc])

  /** --- Migration legacy moodboard --- */
  useEffect(() => {
    const current = safeReadStorage(homeMoodboardKey)
    if (current) {
      setHomeMoodboardSrc(current)
      return
    }

    // anciennes clÃ©s possibles
    const legacy1 = safeReadStorage("planner.home.moodboard")
    if (legacy1) {
      setHomeMoodboardSrc(legacy1)
      try {
        safeWriteStorage(homeMoodboardKey, legacy1)
      } catch {
        // ignore
      }
      return
    }

    setHomeMoodboardSrc(DEFAULT_HOME_MOODBOARD)
  }, [homeMoodboardKey])

  /** --- Persistance moodboard --- */
  useEffect(() => {
    try {
      safeWriteStorage(homeMoodboardKey, homeMoodboardSrc)
    } catch {
      setMoodboardError("Impossible dâ€™enregistrer le moodboard (stockage plein). Choisis une image plus lÃ©gÃ¨re.")
    }
  }, [homeMoodboardKey, homeMoodboardSrc])

  useEffect(() => {
    localStorage.setItem(todosKey, JSON.stringify(todos))
  }, [todosKey, todos])

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
    if (!openCardMenu) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest(".card-menu") || target.closest(".card-menu-popover")) return
      setOpenCardMenu(null)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openCardMenu])

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

  const handleProfileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setProfileError(null)
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setProfileError("Format non supportÃ©. Choisis une image.")
      event.target.value = ""
      return
    }

    try {
      const compressed = await fileToCompressedSquareDataUrl(file, { size: 320, quality: 0.82 })
      setProfileSrc(compressed)
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Erreur lors du traitement de lâ€™image.")
    } finally {
      event.target.value = ""
    }
  }

  const resetProfilePhoto = () => {
    setProfileError(null)
    setProfileSrc(DEFAULT_PROFILE_PHOTO)
    safeRemoveStorage(profileStorageKey)
    safeRemoveStorage("profile-photo")
  }

  const handleMoodboardInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setMoodboardError(null)
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setMoodboardError("Format non supportÃ©. Choisis une image.")
      event.target.value = ""
      return
    }

    try {
      // moodboard = grande image => compress + resize ratio
      const compressed = await fileToCompressedFitDataUrl(file, { maxSide: 1600, quality: 0.78 })
      setHomeMoodboardSrc(compressed)
    } catch (e) {
      setMoodboardError(e instanceof Error ? e.message : "Erreur lors du traitement de lâ€™image.")
    } finally {
      event.target.value = ""
    }
  }

  const resetMoodboard = () => {
    setMoodboardError(null)
    setHomeMoodboardSrc(DEFAULT_HOME_MOODBOARD)
    safeRemoveStorage(homeMoodboardKey)
    safeRemoveStorage("planner.home.moodboard")
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
              <input ref={fileInputRef} type="file" accept="image/*" className="profile-file-input" onChange={handleProfileInput} />
            </div>

            <div className="profile-actions">
              {profileError ? <p className="profile-error">{profileError}</p> : null}
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
              <input type="text" value={todoInput} onChange={(e) => setTodoInput(e.target.value)} placeholder="Ajouter une tÃ¢che" />
              <button type="button" className="todo-add" onClick={addTodo} aria-label="Ajouter une tÃ¢che">
                +
              </button>
            </div>

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
              <p className="eyebrow">Planner Home</p>
              <div className="today">{todayLabel()}</div>
              <h1>Organise tes journÃ©es avec intention</h1>
            </div>
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
                <div className="card-menu-wrapper">
                  <button
                    type="button"
                    className="card-menu"
                    aria-label={`Modifier ${card.title}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      setOpenCardMenu(openCardMenu === card.title ? null : card.title)
                    }}
                  >
                    <span aria-hidden="true">...</span>
                  </button>

                  {openCardMenu === card.title ? (
                    <div className="card-menu-popover" role="menu" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="card-menu-popover__item">
                        Modifier la photo
                      </button>
                    </div>
                  ) : null}
                </div>

                <img src={card.image} alt={card.alt} />
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
                  <p className="task-title">Aucune tÃ¢che prÃ©vue</p>
                  <p className="task-note">Ajoute une tÃ¢che dans le calendrier.</p>
                </article>
              )}
            </div>
          </div>
        </aside>

        {/* âœ… Moodboard (fix) */}
        <section className="home-moodboard">
          <div className="home-moodboard__top">
            <div className="home-moodboard__top-actions">
              <button type="button" className="home-moodboard__button" onClick={() => moodboardInputRef.current?.click()}>
                Changer l'image
              </button>
              {isHomeCustom ? (
                <button type="button" className="home-moodboard__reset" onClick={resetMoodboard}>
                  RÃ©initialiser
                </button>
              ) : null}
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
            <img src={homeMoodboardSrc} alt="Moodboard personnalisÃ©" />
          </div>
        </section>

        <div className="home-footer-bar" aria-hidden="true" />
      </div>
    </>
  )
}

export default HomePage
