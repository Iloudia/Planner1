import { useEffect, useMemo, useRef, useState, useCallback, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTasks } from "../../context/TasksContext"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"

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
const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"
const ONBOARDING_STORAGE_KEY = "planner.onboarding.answers.v1"

const PROFILE_PHOTO_SUFFIX = "profile-photo"
const DEFAULT_PROFILE_PHOTO = planner06
const CARD_TITLES_SUFFIX = "home.card-titles"
const CARD_IMAGES_SUFFIX = "home.card-images"
const CARD_USAGE_SUFFIX = "home.card-usage"

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
  { image: planner01, alt: "Sport", kicker: "Énergie", title: "Sport", path: "/sport" },
  { image: planner06, alt: "Calendrier", kicker: "Vue globale", title: "Calendrier mensuel", path: "/calendrier" },
  { image: planner05, alt: "Wishlist", kicker: "Envie", title: "Wishlist", path: "/wishlist" },
  { image: planner03, alt: "Journaling", kicker: "Reflet", title: "Journaling", path: "/journaling" },
  { image: planner04, alt: "Self-love", kicker: "Care", title: "S'aimer soi-même", path: "/self-love" },
  { image: planner07, alt: "Finances", kicker: "Budget", title: "Finances", path: "/finances" },
  { image: planner08, alt: "Routine", kicker: "Rythme", title: "Routine", path: "/routine" },
  { image: planner09, alt: "Cuisine", kicker: "Saveurs", title: "Cuisine", path: "/alimentation" },
]

const CATEGORY_TO_PATH: Record<string, string> = {
  "sport": "/sport",
  "journaling": "/journaling",
  "self-love": "/self-love",
  "finances": "/finances",
  "routine": "/routine",
  "wishlist": "/wishlist",
  "calendrier mensuel": "/calendrier",
  "cuisine": "/alimentation",
}

const defaultCardTitle = (path: string) => cards.find((card) => card.path === path)?.title ?? ""

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

const readProfileUsername = (key: string) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return ""
    const parsed = JSON.parse(raw) as { identityInfo?: { username?: string } }
    return parsed?.identityInfo?.username ?? ""
  } catch {
    return ""
  }
}

/** --- Storage helpers (gère legacy JSON.stringify) --- */
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

/** --- Compression profil : crop carré (petit) --- */
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
  const profileDataKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(safeEmail), PROFILE_STORAGE_KEY), [safeEmail])
  const homeMoodboardKey = useMemo(() => scopedKey(HOME_MOODBOARD_SUFFIX), [scopedKey])
  const todosKey = useMemo(() => scopedKey("todos"), [scopedKey])
  const cardTitlesKey = useMemo(() => scopedKey(CARD_TITLES_SUFFIX), [scopedKey])
  const cardImagesKey = useMemo(() => scopedKey(CARD_IMAGES_SUFFIX), [scopedKey])
  const cardUsageKey = useMemo(() => scopedKey(CARD_USAGE_SUFFIX), [scopedKey])
  const onboardingKey = useMemo(
    () => buildUserScopedKey(normalizeUserEmail(safeEmail), ONBOARDING_STORAGE_KEY),
    [safeEmail],
  )

  const [openCardMenu, setOpenCardMenu] = useState<string | null>(null)
  const [editingCardPath, setEditingCardPath] = useState<string | null>(null)
  const [cardTitleDrafts, setCardTitleDrafts] = useState<Record<string, string>>({})
  const [now, setNow] = useState(() => new Date())
  const cardFileInputsRef = useRef<Record<string, HTMLInputElement | null>>({})

  /** ? Profil (persisté + compressé) */
  const [profileSrc, setProfileSrc] = useState<string>(() => safeReadStorage(profileStorageKey) ?? DEFAULT_PROFILE_PHOTO)
  const [profileError, setProfileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  /** ? Moodboard (persisté + compressé) */
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
  const profileUsername = useMemo(() => readProfileUsername(profileDataKey), [profileDataKey])

  const isHomeCustom = homeMoodboardSrc !== DEFAULT_HOME_MOODBOARD

  const [cardTitleOverrides, setCardTitleOverrides] = useState<Record<string, string>>(() => {
    const saved = safeReadStorage(cardTitlesKey)
    if (!saved) return {}
    try {
      const parsed = JSON.parse(saved)
      return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {}
    } catch {
      return {}
    }
  })
  const [cardImageOverrides, setCardImageOverrides] = useState<Record<string, string>>(() => {
    const saved = safeReadStorage(cardImagesKey)
    if (!saved) return {}
    try {
      const parsed = JSON.parse(saved)
      return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {}
    } catch {
      return {}
    }
  })

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
        usage,
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
      setProfileError("Impossible d’enregistrer la photo (stockage plein). Choisis une image plus légère.")
    }
  }, [profileStorageKey, profileSrc])

  /** --- Migration legacy moodboard --- */
  useEffect(() => {
    const current = safeReadStorage(homeMoodboardKey)
    if (current) {
      setHomeMoodboardSrc(current)
      return
    }

    // anciennes clés possibles
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
      setMoodboardError("Impossible d’enregistrer le moodboard (stockage plein). Choisis une image plus légère.")
    }
  }, [homeMoodboardKey, homeMoodboardSrc])

  useEffect(() => {
    localStorage.setItem(todosKey, JSON.stringify(todos))
  }, [todosKey, todos])

  useEffect(() => {
    safeWriteStorage(cardTitlesKey, JSON.stringify(cardTitleOverrides))
  }, [cardTitlesKey, cardTitleOverrides])

  useEffect(() => {
    safeWriteStorage(cardImagesKey, JSON.stringify(cardImageOverrides))
  }, [cardImagesKey, cardImageOverrides])

  useEffect(() => {
    safeWriteStorage(cardUsageKey, JSON.stringify(cardUsage))
  }, [cardUsageKey, cardUsage])

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
    document.body.classList.add('calendar-page--beige')
    return () => {
      document.body.classList.remove('calendar-page--beige')
    }
  }, [])

  useEffect(() => {
    if (!openCardMenu) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.closest(".profile-menu") || target.closest(".card-menu-popover")) return
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
      setProfileError("Format non supporté. Choisis une image.")
      event.target.value = ""
      return
    }


 try {
  const compressed = await fileToCompressedSquareDataUrl(file, { size: 320, quality: 0.82 })
  setProfileSrc(compressed)
} catch (e) {
  setProfileError(e instanceof Error ? e.message : "Erreur lors du traitement de l’image.")
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
    setMoodboardError("Format non supporté. Choisis une image.")
    event.target.value = ""
    return
  }

  try {
    // moodboard = grande image => compress + resize ratio
    const compressed = await fileToCompressedFitDataUrl(file, { maxSide: 1600, quality: 0.78 })
    setHomeMoodboardSrc(compressed)
  } catch (e) {
    setMoodboardError(e instanceof Error ? e.message : "Erreur lors du traitement de l’image.")
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

const getCardTitle = useCallback(
  (card: CardItem) => cardTitleOverrides[card.path] ?? card.title,
  [cardTitleOverrides]
)

const getCardImage = useCallback(
  (card: CardItem) => cardImageOverrides[card.path] ?? card.image,
  [cardImageOverrides]
)

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
const startEditCardTitle = (card: CardItem) => {
  setOpenCardMenu(null)
  setEditingCardPath(card.path)
  setCardTitleDrafts((prev) => ({ ...prev, [card.path]: getCardTitle(card) }))
}

const triggerCardImagePicker = (card: CardItem) => {
  setOpenCardMenu(null)
  cardFileInputsRef.current[card.path]?.click()
}

const handleCardImageChange = async (card: CardItem, file?: File) => {
  if (!file) return
  if (!file.type.startsWith("image/")) {
    return
  }

  try {
    const compressed = await fileToCompressedFitDataUrl(file, { maxSide: 1200, quality: 0.8 })
    setCardImageOverrides((prev) => ({ ...prev, [card.path]: compressed }))
  } catch {
    // ignore errors silently to avoid UI noise
  }
}

const commitCardTitle = (path: string) => {
  const nextValue = (cardTitleDrafts[path] ?? "").trim()
  const defaultTitle = defaultCardTitle(path)
  setCardTitleOverrides((prev) => {
    const next = { ...prev }
    if (nextValue.length === 0 || nextValue === defaultTitle) {
      delete next[path]
    } else {
      next[path] = nextValue
    }
    return next
  })
  setEditingCardPath(null)
}

  const upcomingTasks = useMemo(() => {
    const nowTs = now.getTime()
    const baseTasks = tasks

    const normalized = baseTasks
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
          dateTs: Number.isFinite(dateTs) ? dateTs : 0,
          startTs,
          endTs,
        }
      })
      .filter((task) => task.endTs > nowTs)
      .sort((a, b) => a.startTs - b.startTs)
      .slice(0, 2)

    return normalized.map(({ dateTs: _dateTs, startTs: _startTs, endTs: _endTs, ...task }) => task)
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

        <p className="profile-welcome">
          {`C'est un plaisir de te revoir${profileUsername ? `, ${profileUsername}` : ""}.`}
        </p>

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
              <h3>Bloc-notes</h3>
            </div>
          </div>

          <div className="todo-input">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Spacebar") {
                  event.preventDefault()
                  addTodo()
                }
              }}
              placeholder="Ajouter une tâche"
            />
            <button type="button" className="todo-add" onClick={addTodo} aria-label="Ajouter une tâche">
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
          <div className="home-hero-strip__center">
            <div className="today">{todayLabel()}</div>
            <h1>Organise tes journées avec intention</h1>
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
                if (editingCardPath) return
                bumpCardUsage(card.path)
                navigate(card.path)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !editingCardPath) {
                  bumpCardUsage(card.path)
                  navigate(card.path)
                }
              }}
            >
              <div className="card-menu-wrapper">
                <button
                  type="button"
                  className="profile-menu"
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
                    <button
                      type="button"
                      className="card-menu-popover__item"
                      onClick={() => startEditCardTitle(card)}
                    >
                      Modifier le texte
                    </button>
                    <button
                      type="button"
                      className="card-menu-popover__item"
                      onClick={() => triggerCardImagePicker(card)}
                    >
                      Modifier la photo
                    </button>
                  </div>
                ) : null}
              </div>

              <img src={getCardImage(card)} alt={card.alt} />
              <input
                ref={(node) => {
                  cardFileInputsRef.current[card.path] = node
                }}
                type="file"
                accept="image/*"
                className="card-file-input"
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => {
                  void handleCardImageChange(card, event.target.files?.[0])
                  event.target.value = ""
                }}
              />
              <div className="card-body">
                {editingCardPath === card.path ? (
                  <input
                    type="text"
                    className="card-title-input"
                    value={cardTitleDrafts[card.path] ?? getCardTitle(card)}
                    onChange={(event) =>
                      setCardTitleDrafts((prev) => ({ ...prev, [card.path]: event.target.value }))
                    }
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => {
                      event.stopPropagation()
                      if (event.key === "Enter") {
                        event.preventDefault()
                        commitCardTitle(card.path)
                      }
                      if (event.key === "Escape") {
                        event.preventDefault()
                        setCardTitleDrafts((prev) => ({ ...prev, [card.path]: getCardTitle(card) }))
                        setEditingCardPath(null)
                      }
                    }}
                    onBlur={() => commitCardTitle(card.path)}
                    autoFocus
                  />
                ) : (
                  <h3>{getCardTitle(card)}</h3>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>

      <aside className="aside-left">
        <div className="aside-title">Prochaines tâches</div>
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
                <p className="task-title">Aucune tâche prévue</p>
                <p className="task-note">Ajoute une tâche dans le calendrier.</p>
              </article>
            )}
          </div>
        </div>
      </aside>

      {/* ? Moodboard (fix) */}
      <section className="home-moodboard">
        <div className="home-moodboard__top">
          <h2>Moodboard</h2>
          <div className="home-moodboard__top-actions">
            <button type="button" className="home-moodboard__button" onClick={() => moodboardInputRef.current?.click()}>
              Changer l'image
            </button>
            {isHomeCustom ? (
              <button type="button" className="home-moodboard__reset" onClick={resetMoodboard}>
                Réinitialiser
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
          <img src={homeMoodboardSrc} alt="Moodboard personnalisé" />
        </div>
      </section>

      <div className="home-footer-bar" aria-hidden="true" />
    </div>
  </>
)
}

export default HomePage


