import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import PageHeading from "../../components/PageHeading"
import usePersistentState from "../../hooks/usePersistentState"
import workoutHero from "../../assets/tuany-kohler-dupe.jpeg"
import backdayImage from "../../assets/Backday.jpg"
import legdayImage from "../../assets/legday.jpg"
import "./Workout.css"

type ExerciseCard = {
  id: string
  title: string
  muscle: string
  category: string
  image: string
}

type VideoCard = {
  id: string
  title: string
  url: string
  thumbnail: string
  duration?: string
}

type SeriesItem = {
  id: string
  label: string
  completed: boolean
  weight?: string
}

const STORAGE_KEYS = {
  exercises: "planner.workout.exercises",
  videos: "planner.workout.videos",
  series: "planner.workout.series",
  notes: "planner.workout.notes",
}

const SPORT_BOARD_STORAGE_KEY = "planner.sportBoard.v2"
const WORKOUT_RESET_KEY = "planner.workout.lastReset"

const DEFAULT_EXERCISES: ExerciseCard[] = [
  {
    id: "ex-1",
    title: "Backday",
    muscle: "Dos",
    category: "Renforcement musculaire",
    image: backdayImage,
  },
  {
    id: "ex-2",
    title: "Legday",
    muscle: "Jambes",
    category: "Renforcement musculaire",
    image: legdayImage,
  },
]

const DEFAULT_VIDEOS: VideoCard[] = [
  {
    id: "vid-1",
    title: "Exercices leg day",
    url: "https://youtu.be/gcIqwTuaP4o?si=WzujDHWfFJwP0WlW",
    thumbnail: "https://img.youtube.com/vi/gcIqwTuaP4o/hqdefault.jpg",
  },
  {
    id: "vid-2",
    title: "Entraînement Pilates complet",
    url: "https://youtu.be/354ezj2UHdM?si=LObxLx7v79fzZ9np",
    thumbnail: "https://img.youtube.com/vi/354ezj2UHdM/hqdefault.jpg",
  },
]

const DEFAULT_SERIES: Record<string, SeriesItem[]> = {
  "ex-1": [
    { id: "serie-1", label: "3x12 incline dumbbell row", completed: false },
    { id: "serie-2", label: "4x10 Lat pull downs", completed: false },
    { id: "serie-3", label: "3x10 Cable rows", completed: false },
    { id: "serie-4", label: "Pull up ( jusqu'à épuisement )", completed: false },
    { id: "serie-5", label: "3x10 Seated cable rows", completed: false },
    { id: "serie-6", label: "3x10 Bent over rows", completed: false },
  ],
  "ex-2": [
    { id: "serie-7", label: "3x10 hip/leg press", completed: false },
    { id: "serie-8", label: "3x10 Hip thrust", completed: false },
    { id: "serie-9", label: "3x10 Rdls", completed: false },
    { id: "serie-10", label: "3x12 Leg extension", completed: false },
    { id: "serie-11", label: "Leg cuurls ( jusqu'à épuisement )", completed: false },
    { id: "serie-12", label: "3x10 Squats", completed: false },
    { id: "serie-13", label: "3x12 Reverse lunges", completed: false },
  ],
}

const MUSCLE_OPTIONS = [
  "Abdos",
  "Avant-bras",
  "Biceps",
  "Bras",
  "Dos",
  "�?paules",
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

const formatLocalISODate = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

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
  } catch (error) {
    return null
  }
}

const WorkoutPage = () => {
  const [exercises, setExercises] = usePersistentState<ExerciseCard[]>(STORAGE_KEYS.exercises, () => DEFAULT_EXERCISES)
  const [videos, setVideos] = usePersistentState<VideoCard[]>(STORAGE_KEYS.videos, () => DEFAULT_VIDEOS)
  const [form, setForm] = useState({ title: "", muscle: "", category: "", image: "" })
  const [videoForm, setVideoForm] = useState({ title: "", url: "" })
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)
  const [seriesByExercise, setSeriesByExercise] = usePersistentState<Record<string, SeriesItem[]>>(STORAGE_KEYS.series, () => DEFAULT_SERIES)
  const [notesByExercise, setNotesByExercise] = usePersistentState<Record<string, string>>(STORAGE_KEYS.notes, () => ({}))
  const [seriesInput, setSeriesInput] = useState("")
  const [seriesWeightInput, setSeriesWeightInput] = useState("")
  const [isMuscleMenuOpen, setIsMuscleMenuOpen] = useState(false)
  const [openExerciseMenuId, setOpenExerciseMenuId] = useState<string | null>(null)
  const [openVideoMenuId, setOpenVideoMenuId] = useState<string | null>(null)
  const [isModalMenuOpen, setIsModalMenuOpen] = useState(false)
  const muscleMenuRef = useRef<HTMLDivElement | null>(null)

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
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedExerciseId])

  useEffect(() => {
    setSeriesInput("")
    setSeriesWeightInput("")
  }, [selectedExerciseId])

  useEffect(() => {
    if (!isMuscleMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!muscleMenuRef.current) return
      if (muscleMenuRef.current.contains(event.target as Node)) return
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
      setOpenVideoMenuId(null)
      setIsModalMenuOpen(false)
    }
    window.addEventListener("pointerdown", handleOutsideMenu)
    return () => window.removeEventListener("pointerdown", handleOutsideMenu)
  }, [])


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) return
    const newCard: ExerciseCard = {
      id: `ex-${Date.now()}`,
      title,
      muscle: form.muscle.trim() || "Muscle",
      category: form.category.trim() || "",
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80",
    }
    setExercises((prev) => [newCard, ...prev])
    setForm({ title: "", muscle: "", category: "", image: "" })
  }

  const handleVideoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = videoForm.title.trim() || "Session vidéo"
    const id = extractYoutubeId(videoForm.url.trim())
    if (!id) return
    const duration = await fetchYoutubeDuration(id)
    const nextVideo: VideoCard = {
      id: `vid-${Date.now()}`,
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      duration: duration ?? undefined,
    }
    setVideos((prev) => [nextVideo, ...prev])
    setVideoForm({ title: "", url: "" })
  }


  const handleDeleteExercise = (exerciseId: string) => {
    setExercises((previous) => previous.filter((item) => item.id !== exerciseId))
    setSeriesByExercise((previous) => {
      if (!previous[exerciseId]) return previous
      const next = { ...previous }
      delete next[exerciseId]
      return next
    })
    if (selectedExerciseId === exerciseId) {
      setSelectedExerciseId(null)
    }
  }

  const handleDeleteVideo = (videoId: string) => {
    setVideos((previous) => previous.filter((item) => item.id !== videoId))
  }

  const handleOpenVideo = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleOpenPlanner = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId)
    setOpenExerciseMenuId(null)
    setOpenVideoMenuId(null)
    setIsModalMenuOpen(false)
  }

  const handleClosePlanner = () => {
    setSelectedExerciseId(null)
    setIsModalMenuOpen(false)
  }

  const handleAddSeries = (exerciseId: string) => {
    const label = seriesInput.trim()
    if (!label) return
    const weight = seriesWeightInput.trim()
    setSeriesByExercise((previous) => {
      const current = previous[exerciseId] ?? []
      const nextItem: SeriesItem = {
        id: `série-${Date.now()}`,
        label,
        completed: false,
        weight: weight.length > 0 ? weight : undefined,
      }
      return {
        ...previous,
        [exerciseId]: [...current, nextItem],
      }
    })
    setSeriesInput("")
    setSeriesWeightInput("")
  }

  const toggleSeriesItem = (exerciseId: string, seriesId: string) => {
    setSeriesByExercise((previous) => {
      const current = previous[exerciseId] ?? []
      return {
        ...previous,
        [exerciseId]: current.map((item) =>
          item.id === seriesId ? { ...item, completed: !item.completed } : item,
        ),
      }
    })
  }

  const updateSeriesWeight = (exerciseId: string, seriesId: string, value: string) => {
    setSeriesByExercise((previous) => {
      const current = previous[exerciseId] ?? []
      return {
        ...previous,
        [exerciseId]: current.map((item) =>
          item.id === seriesId ? { ...item, weight: value.trim() || undefined } : item,
        ),
      }
    })
  }

  const handleDeleteSeries = (exerciseId: string, seriesId: string) => {
    setSeriesByExercise((previous) => {
      const current = previous[exerciseId] ?? []
      return {
        ...previous,
        [exerciseId]: current.filter((item) => item.id !== seriesId),
      }
    })
  }

  const handleImageChange = (file: File | undefined | null) => {
    if (!file) {
      setForm((prev) => ({ ...prev, image: "" }))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setForm((prev) => ({ ...prev, image: result }))
    }
    reader.readAsDataURL(file)
  }

  const updateExerciseImage = (exerciseId: string, file: File | undefined | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      if (!result) return
      setExercises((previous) =>
        previous.map((item) => (item.id === exerciseId ? { ...item, image: result } : item)),
      )
    }
    reader.readAsDataURL(file)
  }

  const updateVideoThumbnail = (videoId: string, file: File | undefined | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      if (!result) return
      setVideos((previous) =>
        previous.map((item) => (item.id === videoId ? { ...item, thumbnail: result } : item)),
      )
    }
    reader.readAsDataURL(file)
  }

  const selectedExercise = useMemo(
    () => exercises.find((exercise) => exercise.id === selectedExerciseId) ?? null,
    [exercises, selectedExerciseId],
  )

  const selectedSeries = useMemo(() => {
    if (!selectedExerciseId) return []
    return seriesByExercise[selectedExerciseId] ?? []
  }, [seriesByExercise, selectedExerciseId])

  const completedSeriesCount = useMemo(
    () => selectedSeries.filter((item) => item.completed).length,
    [selectedSeries],
  )

  const currentNote = selectedExerciseId ? notesByExercise[selectedExerciseId] ?? "" : ""

  useEffect(() => {
    if (typeof window === "undefined") return
    const today = formatLocalISODate(new Date())
    const lastReset = window.localStorage.getItem(WORKOUT_RESET_KEY)
    if (lastReset === today) return
    setSeriesByExercise((previous) => {
      const next: Record<string, SeriesItem[]> = {}
      Object.entries(previous).forEach(([key, items]) => {
        next[key] = items.map((item) => ({ ...item, completed: false }))
      })
      return next
    })
    window.localStorage.setItem(WORKOUT_RESET_KEY, today)
  }, [setSeriesByExercise])


  return (
    <div className="workout-page">
<div className="workout-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Routine active" title="Workout" />

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
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
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
                    onClick={() => setIsMuscleMenuOpen((prev) => !prev)}
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
                            setForm((prev) => ({ ...prev, muscle: option }))
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
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex : HIIT, cardio, stretching..."
                />
              </label>
            </div>
            <div className="workout-form__photo-compact">
              <div
                className={`workout-form__photo-preview${form.image ? " workout-form__photo-preview--has-image" : ""}`}
              >
                {form.image ? (
                  <img className="workout-form__photo-img" src={form.image} alt="Aperçu de la photo sélectionnée" />
                ) : (
                  <p>Ajoute une image depuis ton ordinateur.</p>
                )}
                <div className="workout-form__photo-actions">
                  {!form.image ? (
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
                  {form.image ? (
                    <button type="button" onClick={() => setForm((prev) => ({ ...prev, image: "" }))}>
                      Retirer
                    </button>
                  ) : null}
                </div>
                <span className="workout-form__photo-hint">Formats image acceptés (JPG, PNG, GIF).</span>
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
                      aria-label={`Options pour ${exercise.title}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        setOpenExerciseMenuId((previous) => (previous === exercise.id ? null : exercise.id))
                        setOpenVideoMenuId(null)
                      }}
                    >
                      <span aria-hidden="true">...</span>
                    </button>
                    {openExerciseMenuId === exercise.id ? (
                      <div className="workout-card__menu-panel" role="menu" onClick={(event) => event.stopPropagation()}>
                        <label className="workout-card__menu-item">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              updateExerciseImage(exercise.id, event.target.files?.[0])
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
                            handleDeleteExercise(exercise.id)
                            setOpenExerciseMenuId(null)
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className="workout-card__media">
                    <img src={exercise.image} alt={exercise.title} />
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
                onChange={(e) => setVideoForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Nom de la vidéo"
              />
            </label>
            <label>
              <span>URL YouTube</span>
              <input
                type="url"
                value={videoForm.url}
                onChange={(e) => setVideoForm((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </label>
            <button type="submit">Ajouter la vidéo</button>
          </form>
          {videos.length === 0 ? (
            <div className="workout-video-empty">
              <p className="wishlist-modal__empty">
                Aucune vidéo ajoutée pour le moment. Commence en ajoutant ta première vidéo.
              </p>
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
                    className="modal__close"
                    aria-label={`Options pour ${video.title}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      setOpenVideoMenuId((previous) => (previous === video.id ? null : video.id))
                      setOpenExerciseMenuId(null)
                    }}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                    {openVideoMenuId === video.id ? (
                      <div className="workout-card__menu-panel" role="menu" onClick={(event) => event.stopPropagation()}>
                        <label className="workout-card__menu-item">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              updateVideoThumbnail(video.id, event.target.files?.[0])
                              event.target.value = ""
                              setOpenVideoMenuId(null)
                            }}
                          />
                          Modifier la photo
                        </label>
                        <button
                          type="button"
                          className="workout-card__menu-item workout-card__menu-item--danger"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleDeleteVideo(video.id)
                            setOpenVideoMenuId(null)
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className="workout-video-thumb">
                    <img src={video.thumbnail} alt={video.title} />
                  </div>
                <div className="workout-video-card__body">
                  <div className="workout-video-card__title-row">
                    <p>{video.title}</p>
                    {video.duration ? (
                      <span className="workout-video-card__duration">{video.duration}</span>
                    ) : null}
                  </div>
                  <span className="workout-video-card__source">youtube.com</span>
                </div>
              </article>
            ))}
          </div>
          )}
        </section>
      </div>
      <div className="workout-page__footer-bar" aria-hidden="true" />

      {selectedExercise && (
        <div
          className="workout-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="workout-modal-title"
          onClick={handleClosePlanner}
        >
          <div className="workout-modal__panel" onClick={(event) => event.stopPropagation()}>
            <div className="workout-modal__menu">
              <button
                type="button"
                className="modal__close"
                aria-label="Fermer"
                onClick={handleClosePlanner}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {isModalMenuOpen && selectedExerciseId ? (
                <div className="workout-card__menu-panel" role="menu">
                  <label className="workout-card__menu-item">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        updateExerciseImage(selectedExerciseId, event.target.files?.[0])
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
                      handleDeleteExercise(selectedExerciseId)
                      setIsModalMenuOpen(false)
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              ) : null}
            </div>
            <div className="workout-modal__cover">
              <img src={selectedExercise.image} alt={selectedExercise.title} />
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
                      handleAddSeries(selectedExerciseId)
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
                    placeholder="Charge (kg)"
                    className="workout-modal__series-weight-input"
                  />
                  <button type="submit">Ajouter une série</button>
                </form>
                <div className="workout-modal__note">
                  <label>
                    <span>Notes de s�ance</span>
                    <textarea
                      rows={3}
                      value={currentNote}
                      onChange={(event) => {
                        if (!selectedExerciseId) return
                        const next = event.target.value
                        setNotesByExercise((previous) => ({
                          ...previous,
                          [selectedExerciseId]: next,
                        }))
                      }}
                      placeholder="Ressenti, charge, remarque..."
                    />
                  </label>
                </div>
                {selectedSeries.length === 0 ? (
                  <p className="workout-modal__empty">
                    Aucun élément encore. Clique sur "Ajouter une série" pour enregistrer tes envies dans cette catégorie.
                  </p>
                ) : (
                  <ul className="workout-modal__series-list">
                    {selectedSeries.map((serie) => (
                      <li key={serie.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={serie.completed}
                            onChange={() => selectedExerciseId && toggleSeriesItem(selectedExerciseId, serie.id)}
                          />
                          <span>{serie.label}</span>
                        </label>
                        {serie.weight ? (
                          <input
                            type="text"
                            className="workout-modal__series-weight"
                            value={serie.weight}
                            onChange={(event) => selectedExerciseId && updateSeriesWeight(selectedExerciseId, serie.id, event.target.value)}
                            placeholder="kg"
                            aria-label={`Poids pour ${serie.label}`}
                          />
                        ) : null}
                        <button
                          type="button"
                          aria-label={`Supprimer ${serie.label}`}
                          onClick={() => selectedExerciseId && handleDeleteSeries(selectedExerciseId, serie.id)}
                        >
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
      )}
    </div>
  )
}

export default WorkoutPage


