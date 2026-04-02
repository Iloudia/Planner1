import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useTasks } from "../../context/TasksContext"
import { useAuth } from "../../context/AuthContext"
import MediaImage from "../../components/MediaImage"
import { useUserProfilePhoto } from "../../hooks/useUserProfilePhoto"
import { saveHomeCardsState, subscribeToHomeCardsState } from "../../services/firestore/homeCards"
import { saveHomeTodos, subscribeToHomeTodos, type HomeTodoItem } from "../../services/firestore/homeTodos"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"

import planner01 from "../../assets/sport.webp"
import planner02 from "../../assets/Moodboardsite.png"
import planner03 from "../../assets/Journaling.webp"
import planner04 from "../../assets/Aimer.webp"
import planner05 from "../../assets/Habits.webp"
import planner06 from "../../assets/katie-huber-rhoades-dupe (1).webp"
import planner07 from "../../assets/ebony-forsyth-dupe.webp"
import planner08 from "../../assets/Routine.webp"
import planner09 from "../../assets/avocado-toast.webp"
import noeudPapillon from "../../assets/noeud-papillon.webp"
import citationImage from "../../assets/Citation.png"

import "./Home.css"

const HOME_MOODBOARD_SUFFIX = "planner.home.moodboard"
const DEFAULT_HOME_MOODBOARD = planner02
const ONBOARDING_STORAGE_KEY = "planner.onboarding.answers.v1"

const DEFAULT_PROFILE_PHOTO = citationImage
const CARD_ORDER_SUFFIX = "home.card-order.v1"
const CARD_PROGRESS_SUFFIX = "home.card-progress.v2"
const LEGACY_CARD_USAGE_SUFFIX = "home.card-usage"
const CARD_CLICK_THRESHOLD = 3
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

type TodoItem = HomeTodoItem

const cards: CardItem[] = [
  { image: planner01, alt: "Sport", kicker: "Énergie", title: "Sport", path: "/sport" },
  { image: planner06, alt: "Calendrier", kicker: "Vue globale", title: "Calendrier", path: "/calendrier" },
  { image: planner05, alt: "Wishlist", kicker: "Envies", title: "Wishlist", path: "/wishlist" },
  { image: planner03, alt: "Journaling", kicker: "Reflet", title: "Journaling", path: "/journaling" },
  { image: planner04, alt: "Self-love", kicker: "Soin", title: "Mindset", path: "/mindset" },
  { image: planner07, alt: "Finances", kicker: "Budget", title: "Finances", path: "/finances" },
  { image: planner08, alt: "Routine", kicker: "Rythme", title: "Routine", path: "/routine" },
  { image: planner09, alt: "Courses & menus", kicker: "Saveurs", title: "Menu de la semaine", path: "/menu" },
]

const CARD_PATHS = cards.map((card) => card.path)
const CARD_PATH_SET = new Set(CARD_PATHS)

const CATEGORY_TO_PATH: Record<string, string> = {
  sport: "/sport",
  journaling: "/journaling",
  mindset: "/mindset",
  "mind set": "/mindset",
  "self love": "/mindset",
  "self-love": "/mindset",
  finances: "/finances",
  routine: "/routine",
  wishlist: "/wishlist",
  calendrier: "/calendrier",
  "calendrier mensuel": "/calendrier",
  "menu de la semaine": "/menu",
  cuisine: "/menu",
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

const normalizeTodos = (value: unknown): TodoItem[] => {
  if (!Array.isArray(value)) {
    return []
  }

  const seen = new Set<string>()
  const normalized: TodoItem[] = []

  value.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      return
    }

    const todo = entry as Partial<TodoItem>
    const id = typeof todo.id === "string" ? todo.id.trim() : ""
    const text = typeof todo.text === "string" ? todo.text.trim() : ""
    if (!id || !text || seen.has(id)) {
      return
    }

    seen.add(id)
    normalized.push({
      id,
      text,
      done: Boolean(todo.done),
    })
  })

  return normalized
}

const readTodosFromStorage = (storageKey: string) => {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      return []
    }
    return normalizeTodos(JSON.parse(raw))
  } catch {
    return []
  }
}

const extractTodoTimestamp = (todoId: string) => {
  const match = /^todo-(\d+)$/.exec(todoId)
  return match ? Number.parseInt(match[1] ?? "0", 10) : 0
}

const mergeTodos = (...collections: TodoItem[][]) => {
  const seen = new Set<string>()
  const merged: TodoItem[] = []

  collections.forEach((items) => {
    items.forEach((item) => {
      if (seen.has(item.id)) {
        return
      }
      seen.add(item.id)
      merged.push(item)
    })
  })

  return [...merged].sort((left, right) => {
    const rightTimestamp = extractTodoTimestamp(right.id)
    const leftTimestamp = extractTodoTimestamp(left.id)
    if (rightTimestamp !== leftTimestamp) {
      return rightTimestamp - leftTimestamp
    }
    return 0
  })
}

const areTodosEqual = (left: TodoItem[], right: TodoItem[]) =>
  left.length === right.length &&
  left.every(
    (item, index) =>
      item.id === right[index]?.id && item.text === right[index]?.text && item.done === right[index]?.done,
  )

const normalizeCardOrderPaths = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  const seen = new Set<string>()
  const normalized: string[] = []
  value.forEach((entry) => {
    if (typeof entry !== "string") {
      return
    }
    const path = entry.trim()
    if (!CARD_PATH_SET.has(path) || seen.has(path)) {
      return
    }
    seen.add(path)
    normalized.push(path)
  })

  return normalized
}

const normalizeCardClickProgress = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return {}
  }

  const normalized: Record<string, number> = {}
  Object.entries(value).forEach(([path, count]) => {
    if (!CARD_PATH_SET.has(path) || typeof count !== "number" || !Number.isFinite(count)) {
      return
    }
    const remainder = Math.floor(count) % CARD_CLICK_THRESHOLD
    if (remainder > 0) {
      normalized[path] = remainder
    }
  })
  return normalized
}

const buildBaseCardOrder = (preferredCardOrder: string[]) => {
  const preferred = preferredCardOrder.filter((path) => CARD_PATH_SET.has(path))
  const seen = new Set(preferred)
  const remaining = CARD_PATHS.filter((path) => !seen.has(path))
  return [...preferred, ...remaining]
}

const prioritizePreferredCardOrder = (paths: string[], preferredCardOrder: string[]) => {
  const normalizedPaths = toFullCardOrder(paths)
  const preferred = preferredCardOrder.filter((path) => CARD_PATH_SET.has(path))

  if (preferred.length === 0) {
    return normalizedPaths
  }

  const seen = new Set(preferred)
  return [...preferred, ...normalizedPaths.filter((path) => !seen.has(path))]
}

const deriveOrderFromLegacyUsage = (legacyUsage: Record<string, number>, preferredCardOrder: string[]) => {
  const preferredIndex = new Map(preferredCardOrder.map((path, index) => [path, index]))
  return cards
    .map((card, index) => {
      const usage = Number.isFinite(legacyUsage[card.path]) ? legacyUsage[card.path] : 0
      const preferredOrderIndex = preferredIndex.get(card.path)
      const isPreferred = preferredOrderIndex !== undefined
      return {
        path: card.path,
        index,
        usage,
        isPreferred,
        preferredOrderIndex: isPreferred ? preferredOrderIndex : Number.POSITIVE_INFINITY,
      }
    })
    .sort(
      (a, b) =>
        (Number(b.isPreferred) - Number(a.isPreferred)) ||
        (a.preferredOrderIndex - b.preferredOrderIndex) ||
        (b.usage - a.usage) ||
        (a.index - b.index),
    )
    .map((item) => item.path)
}

const readCardOrderFromStorage = (storageKey: string) => {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    return normalizeCardOrderPaths(parsed)
  } catch {
    return []
  }
}

const readCardClickProgressFromStorage = (storageKey: string) => {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw)
    return normalizeCardClickProgress(parsed)
  } catch {
    return {}
  }
}

const readLegacyCardUsageFromStorage = (storageKey: string) => {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") {
      return {}
    }

    const normalized: Record<string, number> = {}
    Object.entries(parsed).forEach(([path, usage]) => {
      if (!CARD_PATH_SET.has(path) || typeof usage !== "number" || !Number.isFinite(usage)) {
        return
      }
      normalized[path] = usage
    })
    return normalized
  } catch {
    return {}
  }
}

const deriveClickProgressFromLegacyUsage = (legacyUsage: Record<string, number>) => {
  const progress: Record<string, number> = {}
  Object.entries(legacyUsage).forEach(([path, usage]) => {
    const remainder = Math.floor(usage) % CARD_CLICK_THRESHOLD
    if (remainder > 0) {
      progress[path] = remainder
    }
  })
  return progress
}

const buildOrderedCardsFromPaths = (paths: string[]) => {
  const order = normalizeCardOrderPaths(paths)
  const byPath = new Map(cards.map((card) => [card.path, card]))
  const ordered = order.map((path) => byPath.get(path)).filter((card): card is CardItem => Boolean(card))
  const includedPaths = new Set(ordered.map((card) => card.path))
  const remaining = cards.filter((card) => !includedPaths.has(card.path))
  return [...ordered, ...remaining]
}

const toFullCardOrder = (paths: string[]) => buildOrderedCardsFromPaths(paths).map((card) => card.path)

const areOrdersEqual = (left: string[], right: string[]) =>
  left.length === right.length && left.every((path, index) => path === right[index])

const areClickProgressEqual = (left: Record<string, number>, right: Record<string, number>) => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  if (leftKeys.length !== rightKeys.length) {
    return false
  }
  return leftKeys.every((key) => right[key] === left[key])
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
  const { isAuthReady, userEmail, userId, username } = useAuth()

  const safeEmail = userEmail ?? "anonymous"
  const scopedKey = useCallback((suffix: string) => buildUserScopedKey(safeEmail, suffix), [safeEmail])

  const homeMoodboardKey = useMemo(() => scopedKey(HOME_MOODBOARD_SUFFIX), [scopedKey])
  const todosKey = useMemo(() => scopedKey("todos"), [scopedKey])
  const legacyAnonymousTodosKey = useMemo(() => buildUserScopedKey("anonymous", "todos"), [])
  const cardOrderKey = useMemo(() => scopedKey(CARD_ORDER_SUFFIX), [scopedKey])
  const cardProgressKey = useMemo(() => scopedKey(CARD_PROGRESS_SUFFIX), [scopedKey])
  const legacyCardUsageKey = useMemo(() => scopedKey(LEGACY_CARD_USAGE_SUFFIX), [scopedKey])
  const onboardingKey = useMemo(
    () => buildUserScopedKey(normalizeUserEmail(safeEmail), ONBOARDING_STORAGE_KEY),
    [safeEmail],
  )

  const [now, setNow] = useState(() => new Date())

  const { photoSrc: profileSrc, error: profileError, isLoaded: isProfilePhotoLoaded, uploadPhoto } = useUserProfilePhoto({
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
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [isHomeTodosLoaded, setIsHomeTodosLoaded] = useState(false)
  const lastPersistedTodosRef = useRef("")
  const homeTodosSeedRef = useRef<string | null>(null)

  const [progress, setProgress] = useState(() => computeProgress())
  const profileUsername = useMemo(() => username?.trim() || "", [username])
  const isTodoLimitReached = todos.length >= MAX_TODOS
  const [showTodoLimitMessage, setShowTodoLimitMessage] = useState(false)
  const [isProfilePhotoMenuOpen, setIsProfilePhotoMenuOpen] = useState(false)
  const [cardOrder, setCardOrder] = useState<string[]>([])
  const [cardClickProgress, setCardClickProgress] = useState<Record<string, number>>({})
  const [isHomeCardsLoaded, setIsHomeCardsLoaded] = useState(false)
  const homeCardsSeedRef = useRef<string | null>(null)

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

  const baseCardOrder = useMemo(() => buildBaseCardOrder(preferredCardOrder), [preferredCardOrder])

  const orderedCards = useMemo(() => {
    const effectiveOrder = prioritizePreferredCardOrder(cardOrder.length > 0 ? cardOrder : baseCardOrder, preferredCardOrder)
    return buildOrderedCardsFromPaths(effectiveOrder)
  }, [baseCardOrder, cardOrder, preferredCardOrder])

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
      setMoodboardError("Impossible d'enregistrer le moodboard (stockage plein). Choisis une image plus légère.")
    }
  }, [homeMoodboardKey, homeMoodboardSrc])

  useEffect(() => {
    if (!isAuthReady) {
      setIsHomeTodosLoaded(false)
      return
    }

    homeTodosSeedRef.current = null
    setIsHomeTodosLoaded(false)
    const localTodos = readTodosFromStorage(todosKey)
    const legacyAnonymousTodos =
      userId && legacyAnonymousTodosKey !== todosKey ? readTodosFromStorage(legacyAnonymousTodosKey) : []
    const fallbackTodos = mergeTodos(localTodos, legacyAnonymousTodos)
    const serializedFallbackTodos = JSON.stringify(fallbackTodos)

    if (!userId) {
      setTodos(fallbackTodos)
      lastPersistedTodosRef.current = serializedFallbackTodos
      safeWriteStorage(todosKey, serializedFallbackTodos)
      setIsHomeTodosLoaded(true)
      return
    }

    return subscribeToHomeTodos(
      userId,
      ({ todos: remoteTodos, hasStoredTodos }) => {
        const nextTodos = hasStoredTodos ? remoteTodos : mergeTodos(remoteTodos, fallbackTodos)
        const serializedNextTodos = JSON.stringify(nextTodos)
        setTodos((currentTodos) => (areTodosEqual(currentTodos, nextTodos) ? currentTodos : nextTodos))
        lastPersistedTodosRef.current = serializedNextTodos
        safeWriteStorage(todosKey, serializedNextTodos)
        if (legacyAnonymousTodosKey !== todosKey) {
          safeRemoveStorage(legacyAnonymousTodosKey)
        }
        setIsHomeTodosLoaded(true)

        if (!hasStoredTodos && serializedNextTodos !== homeTodosSeedRef.current) {
          homeTodosSeedRef.current = serializedNextTodos
          void saveHomeTodos(userId, nextTodos).catch((error) => {
            console.error("Home todos seed failed", error)
          })
        }
      },
      (error) => {
        console.error("Home todos load failed", error)
        setTodos(fallbackTodos)
        lastPersistedTodosRef.current = serializedFallbackTodos
        safeWriteStorage(todosKey, serializedFallbackTodos)
        setIsHomeTodosLoaded(true)
      },
    )
  }, [isAuthReady, legacyAnonymousTodosKey, todosKey, userId])

  useEffect(() => {
    if (!isAuthReady || !isHomeTodosLoaded) {
      return
    }

    const normalizedTodos = normalizeTodos(todos)
    const serializedTodos = JSON.stringify(normalizedTodos)
    if (serializedTodos === lastPersistedTodosRef.current) {
      return
    }

    lastPersistedTodosRef.current = serializedTodos
    safeWriteStorage(todosKey, serializedTodos)

    if (!userId) {
      return
    }

    void saveHomeTodos(userId, normalizedTodos).catch((error) => {
      console.error("Home todos save failed", error)
    })
  }, [isAuthReady, isHomeTodosLoaded, todos, todosKey, userId])

  useEffect(() => {
    if (!isAuthReady) {
      setIsHomeCardsLoaded(false)
      return
    }

    homeCardsSeedRef.current = null
    setIsHomeCardsLoaded(false)
    const localOrder = readCardOrderFromStorage(cardOrderKey)
    const localProgress = readCardClickProgressFromStorage(cardProgressKey)
    const legacyUsage = readLegacyCardUsageFromStorage(legacyCardUsageKey)
    const legacyOrder =
      Object.keys(legacyUsage).length > 0 ? deriveOrderFromLegacyUsage(legacyUsage, preferredCardOrder) : []
    const fallbackOrder = prioritizePreferredCardOrder(
      localOrder.length > 0 ? localOrder : legacyOrder.length > 0 ? legacyOrder : baseCardOrder,
      preferredCardOrder,
    )
    const fallbackProgress = normalizeCardClickProgress(localProgress)

    if (!userId) {
      setCardOrder(fallbackOrder)
      setCardClickProgress(fallbackProgress)
      safeRemoveStorage(legacyCardUsageKey)
      setIsHomeCardsLoaded(true)
      return
    }

    return subscribeToHomeCardsState(
      userId,
      ({ state: remoteState, hasStoredOrder, hasStoredClickProgress }) => {
        const nextOrder = prioritizePreferredCardOrder(
          hasStoredOrder ? remoteState.order : fallbackOrder,
          preferredCardOrder,
        )
        const nextProgress = hasStoredClickProgress
          ? normalizeCardClickProgress(remoteState.clickProgress)
          : fallbackProgress
        setCardOrder((currentOrder) => (areOrdersEqual(currentOrder, nextOrder) ? currentOrder : nextOrder))
        setCardClickProgress((currentProgress) =>
          areClickProgressEqual(currentProgress, nextProgress) ? currentProgress : nextProgress,
        )
        setIsHomeCardsLoaded(true)
        safeWriteStorage(cardOrderKey, JSON.stringify(nextOrder))
        safeWriteStorage(cardProgressKey, JSON.stringify(nextProgress))
        safeRemoveStorage(legacyCardUsageKey)

        const shouldSeedOrder = !hasStoredOrder
        const shouldSeedProgress = !hasStoredClickProgress && Object.keys(nextProgress).length > 0
        const seedSignature = JSON.stringify({ order: shouldSeedOrder ? nextOrder : null, clickProgress: shouldSeedProgress ? nextProgress : null })
        if ((shouldSeedOrder || shouldSeedProgress) && seedSignature !== homeCardsSeedRef.current) {
          homeCardsSeedRef.current = seedSignature
          void saveHomeCardsState(userId, { order: nextOrder, clickProgress: nextProgress }).catch((error) => {
            console.error("Home cards state seed failed", error)
          })
        }
      },
      (error) => {
        console.error("Home cards state load failed", error)
        setCardOrder(fallbackOrder)
        setCardClickProgress(fallbackProgress)
        setIsHomeCardsLoaded(true)
      },
    )
  }, [baseCardOrder, cardOrderKey, cardProgressKey, isAuthReady, legacyCardUsageKey, preferredCardOrder, userId])

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
      setMoodboardError("Format non supporté. Choisis une image.")
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

  const handleCardOpen = useCallback(
    (path: string) => {
      const currentOrder = cardOrder.length > 0 ? cardOrder : baseCardOrder
      const currentProgress = normalizeCardClickProgress(cardClickProgress)
      const nextProgress = { ...currentProgress }
      const nextCount = (nextProgress[path] ?? 0) + 1

      let nextOrder = toFullCardOrder(currentOrder)
      if (nextCount >= CARD_CLICK_THRESHOLD) {
        delete nextProgress[path]
        const index = currentOrder.indexOf(path)
        if (index > 0) {
          const reordered = [...currentOrder]
          ;[reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]]
          nextOrder = toFullCardOrder(reordered)
        }
      } else {
        nextProgress[path] = nextCount
      }

      setCardOrder(nextOrder)
      setCardClickProgress(nextProgress)
      safeWriteStorage(cardOrderKey, JSON.stringify(nextOrder))
      safeWriteStorage(cardProgressKey, JSON.stringify(nextProgress))

      if (userId) {
        void saveHomeCardsState(userId, { order: nextOrder, clickProgress: nextProgress }).catch((error) => {
          console.error("Home cards state save failed", error)
        })
      }

      navigate(path)
    },
    [baseCardOrder, cardClickProgress, cardOrder, cardOrderKey, cardProgressKey, navigate, userId],
  )

  const handleCalendarOpen = useCallback(() => {
    navigate("/calendrier")
  }, [navigate])

  const handleCalendarCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        handleCalendarOpen()
      }
    },
    [handleCalendarOpen],
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

  const isHomeLoading = !isAuthReady || !isProfilePhotoLoaded || !isHomeCardsLoaded || !isHomeTodosLoaded

  if (isHomeLoading) {
    return (
      <div className="page home-page home-page--loading" aria-busy="true" aria-live="polite">
        <span className="home-loading-a11y" role="status">Chargement</span>
      </div>
    )
  }

  return (
    <div className="page home-page">
      <aside className="aside-right">
        <div className="profile-card">
          <div className="profile-photo">
            <MediaImage src={profileSrc} alt="Profil" loading="eager" decoding="async" width={220} height={220} />
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
              maxLength={17}
              onChange={(event) => setTodoInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  addTodo()
                }
              }}
              placeholder=" Ex : faire les courses "
            />
            <button type="button" className="todo-add" onClick={addTodo} aria-label="Ajouter une tâche">
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
            <h1>Organise tes journées</h1>
          </div>
        </section>

        <section className="card-grid">
          {orderedCards.map((card) => (
            <article
              key={card.title}
              className="card"
              role="button"
              tabIndex={0}
              onClick={() => handleCardOpen(card.path)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCardOpen(card.path)
                }
              }}
            >
              <img
                src={card.image}
                alt={card.alt}
                loading="lazy"
                decoding="async"
                style={card.path === "/mindset" ? { objectPosition: "center 30%" } : undefined}
              />
              <div className="card-body">
                <h3>{card.title}</h3>
              </div>
            </article>
          ))}
        </section>
      </main>

      <aside className="aside-left">
        <div className="aside-title">Prochains événements</div>
        <div className="task-window">
          <div className="task-list">
            {tasksError ? (
              <article className="task-card" role="button" tabIndex={0} onClick={handleCalendarOpen} onKeyDown={handleCalendarCardKeyDown}>
                <p className="task-title">Agenda indisponible</p>
                <p className="task-note">{tasksError}</p>
              </article>
            ) : isTasksLoading ? (
              <article
                className="task-card"
                aria-busy="true"
                role="button"
                tabIndex={0}
                onClick={handleCalendarOpen}
                onKeyDown={handleCalendarCardKeyDown}
              >
                <span className="home-loading-a11y" role="status" aria-live="polite">
                  Chargement de l'agenda
                </span>
              </article>
            ) : upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <article
                  key={`${task.title}-${task.date}`}
                  className="task-card"
                  role="button"
                  tabIndex={0}
                  onClick={handleCalendarOpen}
                  onKeyDown={handleCalendarCardKeyDown}
                >
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
              <article className="task-card" role="button" tabIndex={0} onClick={handleCalendarOpen} onKeyDown={handleCalendarCardKeyDown}>
                <p className="task-title">Aucune tâche prévue</p>
                <p className="task-note">Ajoute une tâche dans le calendrier.</p>
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
          <img src={homeMoodboardSrc} alt="Moodboard personnalisé" loading="lazy" decoding="async" />
        </div>
      </section>
    </div>
  )
}

export default HomePage


