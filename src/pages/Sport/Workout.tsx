import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type TouchEvent } from "react"
import { createPortal } from "react-dom"
import MediaImage from "../../components/MediaImage"
import PageHeading from "../../components/PageHeading"
import useUserWorkoutData from "../../hooks/useUserWorkoutData"
import { deleteMedia, uploadImage } from "../../services/media/api"
import backdayImage from "../../assets/Backday.webp"
import legdayImage from "../../assets/legday.webp"
import "./Workout.css"

type ExerciseFormState = {
  title: string
  muscle: string
  category: string
}

type VideoFormState = {
  title: string
  url: string
}

type CreatorRecommendation = {
  id: string
  name: string
  platform: "YouTube" | "Instagram"
  focus: string
  level: string
  description: string
  url: string
}

const defaultExerciseImages: Record<string, string> = {
  backday: backdayImage,
  legday: legdayImage,
}

const MUSCLE_OPTIONS = [
  "Abdos",
  "Avant-bras",
  "Biceps",
  "Bras",
  "Dos",
  "Épaules",
  "Fessiers",
  "Ischios",
  "Jambes",
  "Lombaires",
  "Mollets",
  "Obliques",
  "Pectoraux",
  "Quadriceps",
  "Tout le corps",
  "Triceps",
]

const MUSCLE_PLACEHOLDER = "Sélectionner un muscle"
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined

const CREATOR_RECOMMENDATIONS: CreatorRecommendation[] = [
  {
    id: "sissy-mua-youtube",
    name: "Sissy Mua",
    platform: "YouTube",
    focus: "HIIT / Renfo",
    level: "Tous niveaux",
    description: "Séances énergiques de renfo et HIIT avec un coaching motivé et progressif.",
    url: "https://www.youtube.com/@SissyMUA",
  },
  {
    id: "lidia-mera-youtube",
    name: "Lidia Mera",
    platform: "YouTube",
    focus: "Pilates",
    level: "Débutant à avancé",
    description: "Routines pilates fluides et full body, parfaites pour tonifier sans impact.",
    url: "https://www.youtube.com/@lidiavmera",
  },
  {
    id: "madfit-youtube",
    name: "MadFit",
    platform: "YouTube",
    focus: "Home workout",
    level: "Tous niveaux",
    description: "Workouts maison courts et efficaces, souvent sans matériel et faciles à suivre.",
    url: "https://www.youtube.com/@MadFit",
  },
  {
    id: "anisia-martinez-instagram",
    name: "Anisia Martinez",
    platform: "Instagram",
    focus: "Core / Full body",
    level: "Débutant",
    description: "Reels orientés core et full body avec idées de séances rapides et accessibles.",
    url: "https://www.instagram.com/anisiamartinezz_/",
  },
  {
    id: "leila-hopson-instagram",
    name: "Leila Hopson",
    platform: "Instagram",
    focus: "Cardio / Tonicité",
    level: "Tous niveaux",
    description: "Contenus cardio et tonicité avec formats courts, répétables et motivants.",
    url: "https://www.instagram.com/leilafitjourney/",
  },
]

const parseIsoDuration = (value: string) => {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(value)
  if (!match) return null
  const hours = Number(match[1] ?? 0)
  const minutes = Number(match[2] ?? 0)
  const seconds = Number(match[3] ?? 0)
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const safeMinutes = Math.floor(totalSeconds / 60)
  const safeSeconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}:${String(safeMinutes % 60).padStart(2, "0")}:${String(safeSeconds).padStart(2, "0")}`
  }
  return `${safeMinutes}:${String(safeSeconds).padStart(2, "0")}`
}

const fetchYoutubeDuration = async (videoId: string) => {
  if (!YOUTUBE_API_KEY) return null
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`,
    )
    if (!response.ok) return null
    const data = (await response.json()) as { items?: Array<{ contentDetails?: { duration?: string } }> }
    const duration = data.items?.[0]?.contentDetails?.duration
    return duration ? parseIsoDuration(duration) : null
  } catch {
    return null
  }
}

const extractYoutubeId = (url: string) => {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1)
    }
    const idParam = parsed.searchParams.get("v")
    if (idParam) return idParam
    if (parsed.pathname.includes("/embed/")) {
      return parsed.pathname.split("/embed/")[1]
    }
    return null
  } catch {
    return null
  }
}

const getCreatorCardsPerView = () => {
  if (typeof window === "undefined") return 1
  const width = window.innerWidth
  if (width >= 1536) return 5
  if (width >= 1280) return 4
  if (width >= 1024) return 3
  if (width >= 768) return 2
  return 1
}

const WorkoutPage = () => {
  const {
    exercises,
    videos,
    seriesByExercise,
    isLoading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
    updateExerciseNote,
    createVideo,
    deleteVideo,
    createSeries,
    updateSeries,
    deleteSeries,
  } = useUserWorkoutData()

  const [form, setForm] = useState<ExerciseFormState>({ title: "", muscle: "", category: "" })
  const [formImageFile, setFormImageFile] = useState<File | null>(null)
  const [formImagePreview, setFormImagePreview] = useState("")
  const [videoForm, setVideoForm] = useState<VideoFormState>({ title: "", url: "" })
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)
  const [seriesInput, setSeriesInput] = useState("")
  const [seriesWeightInput, setSeriesWeightInput] = useState("")
  const [noteDraft, setNoteDraft] = useState("")
  const [isMuscleMenuOpen, setIsMuscleMenuOpen] = useState(false)
  const [openExerciseMenuId, setOpenExerciseMenuId] = useState<string | null>(null)
  const [isModalMenuOpen, setIsModalMenuOpen] = useState(false)
  const [activeCreatorIndex, setActiveCreatorIndex] = useState(0)
  const [creatorCardsPerView, setCreatorCardsPerView] = useState(getCreatorCardsPerView)
  const [activeExerciseMenuStyle, setActiveExerciseMenuStyle] = useState<CSSProperties>({})
  const muscleMenuRef = useRef<HTMLDivElement | null>(null)
  const creatorTouchStartXRef = useRef<number | null>(null)
  const creatorTouchDeltaXRef = useRef(0)
  const exerciseMenuPopoverRef = useRef<HTMLDivElement | null>(null)
  const exerciseMenuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    document.body.classList.add("workout-page--lux")
    return () => {
      document.body.classList.remove("workout-page--lux")
    }
  }, [])

  useEffect(() => {
    if (!selectedExerciseId) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedExerciseId(null)
        setIsModalMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedExerciseId])

  useEffect(() => {
    if (!isMuscleMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (muscleMenuRef.current?.contains(event.target as Node)) return
      setIsMuscleMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMuscleMenuOpen(false)
      }
    }
    window.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMuscleMenuOpen])

  useEffect(() => {
    const handleOutsideMenu = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest(".workout-card__menu") || target?.closest(".workout-card__menu-panel")) {
        return
      }
      setOpenExerciseMenuId(null)
      setIsModalMenuOpen(false)
    }
    window.addEventListener("pointerdown", handleOutsideMenu)
    return () => window.removeEventListener("pointerdown", handleOutsideMenu)
  }, [])

  useEffect(() => {
    if (!openExerciseMenuId) {
      setActiveExerciseMenuStyle({})
      return
    }

    const updateExerciseMenuPosition = () => {
      const trigger = exerciseMenuButtonRefs.current[openExerciseMenuId]
      const popover = exerciseMenuPopoverRef.current
      if (!trigger || !popover) return

      const triggerRect = trigger.getBoundingClientRect()
      const popoverRect = popover.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const viewportMargin = 12
      const gap = 8

      let left = triggerRect.right - popoverRect.width
      left = Math.min(Math.max(left, viewportMargin), viewportWidth - popoverRect.width - viewportMargin)

      let top = triggerRect.bottom + gap
      if (top + popoverRect.height > viewportHeight - viewportMargin) {
        top = Math.max(viewportMargin, triggerRect.top - popoverRect.height - gap)
      }

      setActiveExerciseMenuStyle({
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
      })
    }

    const frame = window.requestAnimationFrame(updateExerciseMenuPosition)
    window.addEventListener("resize", updateExerciseMenuPosition)
    window.addEventListener("scroll", updateExerciseMenuPosition, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("resize", updateExerciseMenuPosition)
      window.removeEventListener("scroll", updateExerciseMenuPosition, true)
    }
  }, [openExerciseMenuId])

  useEffect(() => {
    const updateCreatorCardsPerView = () => {
      setCreatorCardsPerView(getCreatorCardsPerView())
    }

    updateCreatorCardsPerView()
    window.addEventListener("resize", updateCreatorCardsPerView)
    return () => window.removeEventListener("resize", updateCreatorCardsPerView)
  }, [])

  const selectedExercise = useMemo(
    () => exercises.find((exercise) => exercise.id === selectedExerciseId) ?? null,
    [exercises, selectedExerciseId],
  )
  const selectedSeries = useMemo(
    () => (selectedExerciseId ? seriesByExercise[selectedExerciseId] ?? [] : []),
    [selectedExerciseId, seriesByExercise],
  )
  const completedSeriesCount = useMemo(
    () => selectedSeries.filter((item) => item.completed).length,
    [selectedSeries],
  )
  const maxCreatorIndex = Math.max(0, CREATOR_RECOMMENDATIONS.length - creatorCardsPerView)
  const creatorPositionCount = maxCreatorIndex + 1
  const hasMultipleCreators = creatorPositionCount > 1
  const creatorDotIndexes = useMemo(
    () => Array.from({ length: creatorPositionCount }, (_, index) => index),
    [creatorPositionCount],
  )

  useEffect(() => {
    setSeriesInput("")
    setSeriesWeightInput("")
    setNoteDraft(selectedExercise?.note ?? "")
  }, [selectedExercise])

  useEffect(() => {
    setActiveCreatorIndex((currentIndex) => Math.min(currentIndex, maxCreatorIndex))
  }, [maxCreatorIndex])

  const setCreatorSlide = (nextIndex: number) => {
    if (!hasMultipleCreators) {
      setActiveCreatorIndex(0)
      return
    }
    const normalizedIndex = (nextIndex + creatorPositionCount) % creatorPositionCount
    setActiveCreatorIndex(normalizedIndex)
  }

  const showPreviousCreator = () => {
    setCreatorSlide(activeCreatorIndex - 1)
  }

  const showNextCreator = () => {
    setCreatorSlide(activeCreatorIndex + 1)
  }

  const handleCreatorsTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleCreators) return
    creatorTouchStartXRef.current = event.touches[0]?.clientX ?? null
    creatorTouchDeltaXRef.current = 0
  }

  const handleCreatorsTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (creatorTouchStartXRef.current === null) return
    creatorTouchDeltaXRef.current = (event.touches[0]?.clientX ?? 0) - creatorTouchStartXRef.current
  }

  const handleCreatorsTouchEnd = () => {
    if (creatorTouchStartXRef.current === null) return
    const swipeThreshold = 42
    if (creatorTouchDeltaXRef.current <= -swipeThreshold) {
      showNextCreator()
    } else if (creatorTouchDeltaXRef.current >= swipeThreshold) {
      showPreviousCreator()
    }
    creatorTouchStartXRef.current = null
    creatorTouchDeltaXRef.current = 0
  }

  const resolveExerciseImage = (exercise: (typeof exercises)[number]) => {
    if (exercise.imageMode === "custom" && exercise.imageUrl) {
      return exercise.imageUrl
    }
    if (exercise.defaultKey && defaultExerciseImages[exercise.defaultKey]) {
      return defaultExerciseImages[exercise.defaultKey]
    }
    return exercise.imageUrl || "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80"
  }

  const resetExerciseForm = () => {
    setForm({ title: "", muscle: "", category: "" })
    setFormImageFile(null)
    setFormImagePreview("")
  }

  const handleImageChange = (file?: File | null) => {
    if (!file) {
      setFormImageFile(null)
      setFormImagePreview("")
      return
    }
    setFormImageFile(file)
    setFormImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) return

    let media: { url: string; path: string } | null = null
    if (formImageFile) {
      media = await uploadImage(formImageFile, "workout-exercise-image", title)
    }

    try {
      await createExercise({
        title,
        muscle: form.muscle.trim() || "Muscle",
        category: form.category.trim() || "",
        note: "",
        imageMode: media ? "custom" : "default",
        imageUrl: media?.url,
        imagePath: media?.path,
      })
      resetExerciseForm()
    } catch {
      if (media?.path) {
        void deleteMedia(media.path).catch(() => undefined)
      }
    }
  }

  const handleVideoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = videoForm.title.trim() || "Session vidéo"
    const id = extractYoutubeId(videoForm.url.trim())
    if (!id) return
    const duration = await fetchYoutubeDuration(id)
    await createVideo({
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnailMode: "default",
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      duration: duration ?? undefined,
    })
    setVideoForm({ title: "", url: "" })
  }

  const handleReplaceExerciseImage = async (exerciseId: string, file?: File | null) => {
    if (!file) return
    const current = exercises.find((item) => item.id === exerciseId)
    if (!current) return
    const uploaded = await uploadImage(file, "workout-exercise-image", exerciseId)
    try {
      await updateExercise(exerciseId, {
        imageMode: "custom",
        imageUrl: uploaded.url,
        imagePath: uploaded.path,
      })
      if (current.imagePath) {
        void deleteMedia(current.imagePath).catch(() => undefined)
      }
    } catch {
      void deleteMedia(uploaded.path).catch(() => undefined)
    }
  }

  const handleDeleteExercise = async (exerciseId: string) => {
    const current = exercises.find((item) => item.id === exerciseId)
    if (!current) return
    await deleteExercise(exerciseId)
    if (current.imagePath) {
      void deleteMedia(current.imagePath).catch(() => undefined)
    }
    if (selectedExerciseId === exerciseId) {
      setSelectedExerciseId(null)
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    const current = videos.find((item) => item.id === videoId)
    if (!current) return
    await deleteVideo(videoId)
    if (current.thumbnailPath) {
      void deleteMedia(current.thumbnailPath).catch(() => undefined)
    }
  }

  const handleOpenVideo = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleOpenPlanner = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId)
    setOpenExerciseMenuId(null)
    setIsModalMenuOpen(false)
  }

  const handleClosePlanner = () => {
    setSelectedExerciseId(null)
    setIsModalMenuOpen(false)
  }

  const handleAddSeries = async (exerciseId: string) => {
    const label = seriesInput.trim()
    if (!label) return
    await createSeries(exerciseId, {
      label,
      weight: seriesWeightInput.trim() || undefined,
    })
    setSeriesInput("")
    setSeriesWeightInput("")
  }

  const handleSaveNote = async () => {
    if (!selectedExerciseId) return
    await updateExerciseNote(selectedExerciseId, noteDraft)
  }

  const isWorkoutLoading = isLoading

  if (isWorkoutLoading) {
    return (
      <div className="workout-page workout-page--loading" aria-busy="true" aria-live="polite">
        <span className="workout-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="workout-page">
      <div className="workout-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Routine active" title="Exercices" />
      {error ? <p className="routine-note__composer-hint">{error}</p> : null}

      <div className="workout-layout">
        <section className="workout-exercises">
          <header className="workout-exercises__header">
            <div className="workout-section-header">
              <h2>Liste d'exercices</h2>
            </div>
          </header>

          <form className="workout-form" onSubmit={handleSubmit}>
            <div className="workout-form__fields">
              <label>
                <span>Nom</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                  placeholder="Ex : Deadlift"
                  required
                />
              </label>
              <label>
                <span>Muscle ciblé</span>
                <div className="workout-form__select" ref={muscleMenuRef}>
                  <button
                    type="button"
                    className={form.muscle ? "workout-form__select-trigger" : "workout-form__select-trigger is-placeholder"}
                    aria-haspopup="listbox"
                    aria-expanded={isMuscleMenuOpen}
                    onClick={() => setIsMuscleMenuOpen((previous) => !previous)}
                  >
                    <span>{form.muscle || MUSCLE_PLACEHOLDER}</span>
                    <svg className="workout-form__select-chevron" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {isMuscleMenuOpen ? (
                    <div className="workout-form__select-menu" role="listbox">
                      {MUSCLE_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          role="option"
                          aria-selected={form.muscle === option}
                          className={form.muscle === option ? "is-selected" : undefined}
                          onMouseDown={(event) => {
                            event.preventDefault()
                            setForm((previous) => ({ ...previous, muscle: option }))
                            setIsMuscleMenuOpen(false)
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </label>
              <label>
                <span>Type <small>(optionnel)</small></span>
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
                  placeholder="Ex : HIIT, cardio, stretching..."
                />
              </label>
            </div>
            <div className="workout-form__photo-compact">
              <div className={`workout-form__photo-preview${formImagePreview ? " workout-form__photo-preview--has-image" : ""}`}>
                {formImagePreview ? (
                  <img className="workout-form__photo-img" src={formImagePreview} alt="Aperçu de la photo sélectionnée" loading="lazy" decoding="async" />
                ) : null}
                <div className="workout-form__photo-actions">
                  {!formImagePreview ? (
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          handleImageChange(event.target.files?.[0])
                          event.target.value = ""
                        }}
                      />
                      Choisir une photo
                    </label>
                  ) : null}
                  {formImagePreview ? (
                    <button type="button" onClick={() => handleImageChange(null)}>
                      Retirer
                    </button>
                  ) : null}
                </div>
                <span className="workout-form__photo-hint">Formats d'image acceptés (JPG, PNG, GIF).</span>
              </div>
            </div>
            <button type="submit">Ajouter la carte</button>
          </form>
        </section>

        {exercises.length > 0 ? (
          <section className="workout-library workout-section--full">
            <div className="workout-cards">
              {exercises.map((exercise) => (
                <article
                  key={exercise.id}
                  className="workout-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenPlanner(exercise.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      handleOpenPlanner(exercise.id)
                    }
                  }}
                >
                  <div className="workout-card__menu">
                    <button
                      type="button"
                      className="profile-menu"
                      ref={(node) => {
                        exerciseMenuButtonRefs.current[exercise.id] = node
                      }}
                      aria-label={`Options pour ${exercise.title}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setOpenExerciseMenuId((previous) => (previous === exercise.id ? null : exercise.id))
                      }}
                    >
                      <span aria-hidden="true">...</span>
                    </button>
                    {openExerciseMenuId === exercise.id ? (
                      createPortal(
                        <div
                          ref={exerciseMenuPopoverRef}
                          className="workout-card__menu-panel workout-card__menu-panel--floating"
                          role="menu"
                          style={activeExerciseMenuStyle}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <label className="workout-card__menu-item">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                void handleReplaceExerciseImage(exercise.id, event.target.files?.[0])
                                event.target.value = ""
                                setOpenExerciseMenuId(null)
                              }}
                            />
                            Modifier la photo
                          </label>
                          <button
                            type="button"
                            className="workout-card__menu-item workout-card__menu-item--danger"
                            onClick={(event) => {
                              event.stopPropagation()
                              void handleDeleteExercise(exercise.id)
                              setOpenExerciseMenuId(null)
                            }}
                          >
                            Supprimer
                          </button>
                        </div>,
                        document.body,
                      )
                    ) : null}
                  </div>
                  <div className="workout-card__media">
                    <MediaImage src={resolveExerciseImage(exercise)} alt={exercise.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="workout-card__body">
                    <h3>{exercise.title}</h3>
                    <p className="workout-card__meta">
                      <span>{exercise.muscle}</span>
                      {exercise.category ? <span>{exercise.category}</span> : null}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="workout-videos workout-section--full">
          <form className="workout-video-form" onSubmit={handleVideoSubmit}>
            <label>
              <span>Titre</span>
              <input
                id="workout-video-title"
                type="text"
                value={videoForm.title}
                onChange={(event) => setVideoForm((previous) => ({ ...previous, title: event.target.value }))}
                placeholder="Ex : 30 min pilates full body..."
              />
            </label>
            <label>
              <span>URL YouTube</span>
              <input
                type="url"
                value={videoForm.url}
                onChange={(event) => setVideoForm((previous) => ({ ...previous, url: event.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </label>
            <button type="submit">Ajouter la vidéo</button>
          </form>
          {videos.length === 0 ? (
            <div className="workout-video-empty">
              <p className="wishlist-modal__empty">Aucune vidéo ajoutée pour le moment.</p>
            </div>
          ) : (
            <div className="workout-video-grid">
              {videos.map((video) => (
                <article
                  key={video.id}
                  className="workout-video-card"
                  role="link"
                  tabIndex={0}
                  onClick={() => handleOpenVideo(video.url)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      handleOpenVideo(video.url)
                    }
                  }}
                >
                  <div className="workout-card__menu">
                    <button
                      type="button"
                      className="modal__close workout-video-card__delete"
                      aria-label={`Supprimer ${video.title}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        void handleDeleteVideo(video.id)
                      }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                  <div className="workout-video-thumb">
                    <img src={video.thumbnailUrl} alt={video.title} loading="lazy" decoding="async" />
                  </div>
                  <div className="workout-video-card__body">
                    <div className="workout-video-card__title-row">
                      <p>{video.title}</p>
                      {video.duration ? <span className="workout-video-card__duration">{video.duration}</span> : null}
                    </div>
                    <span className="workout-video-card__source">youtube.com</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="workout-creators workout-section--full" aria-label="Recommandations YouTube et Instagram">
          <header className="workout-creators__header">
            <h2>Recommandations YouTube & Instagram</h2>
            <p>Des comptes efficaces et faciles à intégrer dans ta routine.</p>
          </header>
          <div className={`workout-creators__carousel${hasMultipleCreators ? "" : " workout-creators__carousel--static"}`}>
            {hasMultipleCreators ? (
              <button
                type="button"
                className="workout-creators__nav workout-creators__nav--prev"
                onClick={showPreviousCreator}
                aria-label="Voir la recommandation precedente"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 6 8 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
            <div
              className="workout-creators__grid"
              onTouchStart={handleCreatorsTouchStart}
              onTouchMove={handleCreatorsTouchMove}
              onTouchEnd={handleCreatorsTouchEnd}
              onTouchCancel={handleCreatorsTouchEnd}
              style={{ "--workout-creators-per-view": String(creatorCardsPerView) } as CSSProperties}
            >
              <div
                className="workout-creators__track"
                style={{ transform: `translateX(-${(activeCreatorIndex * 100) / creatorCardsPerView}%)` }}
              >
                {CREATOR_RECOMMENDATIONS.map((creator, index) => (
                  <div
                    key={creator.id}
                    className="workout-creators__slide"
                    aria-hidden={index < activeCreatorIndex || index >= activeCreatorIndex + creatorCardsPerView}
                  >
                    <article className="workout-creator-card">
                      <div className="workout-creator-card__top">
                        <span
                          className={`workout-creator-card__platform workout-creator-card__platform--${creator.platform.toLowerCase()}`}
                        >
                          {creator.platform}
                        </span>
                        <h3>{creator.name}</h3>
                      </div>
                      <p className="workout-creator-card__description">{creator.description}</p>
                      <div className="workout-creator-card__meta">
                        <span>{creator.focus}</span>
                        <span>{creator.level}</span>
                      </div>
                      <a href={creator.url} target="_blank" rel="noreferrer" className="workout-creator-card__link">
                        Voir le profil
                      </a>
                    </article>
                  </div>
                ))}
              </div>
            </div>
            {hasMultipleCreators ? (
              <button
                type="button"
                className="workout-creators__nav workout-creators__nav--next"
                onClick={showNextCreator}
                aria-label="Voir la recommandation suivante"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
          </div>
          {hasMultipleCreators ? (
            <div className="workout-creators__dots" aria-label="Position dans le carousel">
              {creatorDotIndexes.map((index) => (
                <button
                  key={index}
                  type="button"
                  className={`workout-creators__dot${index === activeCreatorIndex ? " is-active" : ""}`}
                  aria-label={`Afficher les recommandations ${index + 1}`}
                  aria-pressed={index === activeCreatorIndex}
                  onClick={() => setCreatorSlide(index)}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
      <div className="workout-page__footer-bar" aria-hidden="true" />

      {selectedExercise ? (
        <div
          className="workout-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="workout-modal-title"
          onClick={handleClosePlanner}
        >
          <div className="workout-modal__panel" onClick={(event) => event.stopPropagation()}>
            <div className="workout-modal__menu">
              <button type="button" className="profile-menu" aria-label="Options" onClick={() => setIsModalMenuOpen((previous) => !previous)}>
                <span aria-hidden="true">...</span>
              </button>
              {isModalMenuOpen && selectedExerciseId ? (
                <div className="workout-card__menu-panel" role="menu">
                  <label className="workout-card__menu-item">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        void handleReplaceExerciseImage(selectedExerciseId, event.target.files?.[0])
                        event.target.value = ""
                        setIsModalMenuOpen(false)
                      }}
                    />
                    Modifier la photo
                  </label>
                  <button
                    type="button"
                    className="workout-card__menu-item workout-card__menu-item--danger"
                    onClick={() => {
                      void handleDeleteExercise(selectedExerciseId)
                      setIsModalMenuOpen(false)
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              ) : null}
            </div>
            <div className="workout-modal__cover">
              <MediaImage src={resolveExerciseImage(selectedExercise)} alt={selectedExercise.title} loading="lazy" decoding="async" />
            </div>
            <div className="workout-modal__body">
              <header className="workout-modal__header">
                <div>
                  <p className="workout-modal__eyebrow">Ajoute tes exercices pour cette session.</p>
                  <h3 id="workout-modal-title">{selectedExercise.title}</h3>
                </div>
              </header>
              <div className="workout-modal__content">
                <form
                  className="workout-modal__series-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (selectedExerciseId) {
                      void handleAddSeries(selectedExerciseId)
                    }
                  }}
                >
                  <input
                    type="text"
                    value={seriesInput}
                    onChange={(event) => setSeriesInput(event.target.value)}
                    placeholder="Ex : 4 x 12 squats, 10 min rameur..."
                  />
                  <input
                    type="text"
                    value={seriesWeightInput}
                    onChange={(event) => setSeriesWeightInput(event.target.value)}
                    placeholder="Ex : Charge (kg)"
                    className="workout-modal__series-weight-input"
                  />
                  <button type="submit">Ajouter une série</button>
                </form>
                <div className="workout-modal__note">
                  <label>
                    <span>Notes de séance</span>
                    <textarea
                      rows={3}
                      value={noteDraft}
                      onChange={(event) => setNoteDraft(event.target.value)}
                      onBlur={() => void handleSaveNote()}
                      placeholder="Ex : Ressenti, charge, remarque..."
                    />
                  </label>
                </div>
                {selectedSeries.length === 0 ? (
                  <p className="workout-modal__empty">Aucun élément pour le moment.</p>
                ) : (
                  <ul className="workout-modal__series-list">
                    {selectedSeries.map((serie) => (
                      <li key={serie.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={serie.completed}
                            onChange={() => void updateSeries(serie.id, { completed: !serie.completed })}
                          />
                          <span>{serie.label}</span>
                        </label>
                        <input
                          type="text"
                          className="workout-modal__series-weight"
                          value={serie.weight ?? ""}
                          onChange={(event) => void updateSeries(serie.id, { weight: event.target.value.trim() || undefined })}
                          placeholder="kg"
                          aria-label={`Poids pour ${serie.label}`}
                        />
                        <button type="button" aria-label={`Supprimer ${serie.label}`} onClick={() => void deleteSeries(serie.id)}>
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <footer className="workout-modal__footer">
              <div className="workout-modal__summary">
                {completedSeriesCount}/{selectedSeries.length} séries cochées
              </div>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default WorkoutPage
