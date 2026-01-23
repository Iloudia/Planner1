import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import PageHeading from "../../components/PageHeading"
import usePersistentState from "../../hooks/usePersistentState"
import workoutHero from "../../assets/tuany-kohler-dupe.jpeg"
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
}

type SeriesItem = {
  id: string
  label: string
  completed: boolean
}

const STORAGE_KEYS = {
  exercises: "planner.workout.exercises",
  videos: "planner.workout.videos",
  series: "planner.workout.series",
}

const DEFAULT_EXERCISES: ExerciseCard[] = [
  {
    id: "ex-1",
    title: "Push / Pull split",
    muscle: "Haut du corps",
    category: "Force",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ex-2",
    title: "Sprint Hiit",
    muscle: "Cardio",
    category: "HIIT",
    image: "https://images.unsplash.com/photo-1518611012118-4fb9fa2b9555?auto=format&fit=crop&w=800&q=80",
  },
]

const DEFAULT_VIDEOS: VideoCard[] = [
  {
    id: "vid-1",
    title: "Full body mobilite",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
]

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
  const [seriesByExercise, setSeriesByExercise] = usePersistentState<Record<string, SeriesItem[]>>(STORAGE_KEYS.series, () => ({}))
  const [seriesInput, setSeriesInput] = useState("")

  useEffect(() => {
    document.body.classList.add("planner-page--white")
    return () => {
      document.body.classList.remove("planner-page--white")
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
  }, [selectedExerciseId])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = form.title.trim()
    if (!title) return
    const newCard: ExerciseCard = {
      id: `ex-${Date.now()}`,
      title,
      muscle: form.muscle.trim() || "Muscle",
      category: form.category.trim() || "Type",
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80",
    }
    setExercises((prev) => [newCard, ...prev])
    setForm({ title: "", muscle: "", category: "", image: "" })
  }

  const handleVideoSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = videoForm.title.trim() || "Session video"
    const id = extractYoutubeId(videoForm.url.trim())
    if (!id) return
    const nextVideo: VideoCard = {
      id: `vid-${Date.now()}`,
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
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
  }

  const handleClosePlanner = () => {
    setSelectedExerciseId(null)
  }

  const handleAddSeries = (exerciseId: string) => {
    const label = seriesInput.trim()
    if (!label) return
    setSeriesByExercise((previous) => {
      const current = previous[exerciseId] ?? []
      const nextItem: SeriesItem = {
        id: `serie-${Date.now()}`,
        label,
        completed: false,
      }
      return {
        ...previous,
        [exerciseId]: [...current, nextItem],
      }
    })
    setSeriesInput("")
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

  return (
    <div className="workout-page">
      <div className="workout-hero-image">
        <img src={workoutHero} alt="Ambiance workout" />
      </div>
      <div className="workout-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Routine active" title="Workout board" />

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
                <span>Muscle cible</span>
                <input
                  type="text"
                  value={form.muscle}
                  onChange={(e) => setForm((prev) => ({ ...prev, muscle: e.target.value }))}
                  placeholder="Ex : Bras, fessiers, dos..."
                />
              </label>
              <label>
                <span>Type</span>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex : HIIT, cardio, stretching..."
                />
              </label>
            </div>
            <div className="workout-form__photo-compact">
              <span>Ajoute une image depuis ton ordinateur.</span>
            <div className="activities-form__photo-actions">
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
                <small className="workout-photo-compact__hint">
                  {form.image ? "Image importée" : "Formats image acceptés (JPG, PNG, GIF)."}
                </small>
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
                  <button
                    type="button"
                    className="workout-card__delete"
                    aria-label={`Supprimer ${exercise.title}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleDeleteExercise(exercise.id)
                    }}
                  >
                    &times;
                  </button>
                  <div className="workout-card__media">
                    <img src={exercise.image} alt={exercise.title} />
                  </div>
                  <div className="workout-card__body">
                    <h3>{exercise.title}</h3>
                    <p className="workout-card__meta">
                      <span>{exercise.muscle}</span>
                      <span>{exercise.category}</span>
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
            <button type="submit">Ajouter la video</button>
          </form>
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
                <button
                  type="button"
                  className="workout-card__delete"
                  aria-label={`Supprimer ${video.title}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDeleteVideo(video.id)
                  }}
                >
                  &times;
                </button>
                <div className="workout-video-thumb">
                  <img src={video.thumbnail} alt={video.title} />
                </div>
                <div className="workout-video-card__body">
                  <p>{video.title}</p>
                  <span>youtube.com</span>
                </div>
              </article>
            ))}
          </div>
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
            <button
              type="button"
              className="workout-modal__close"
              onClick={handleClosePlanner}
              aria-label="Fermer le plan d'entraînement"
            >
              &times;
            </button>
            <div className="workout-modal__cover">
              <img src={selectedExercise.image} alt={selectedExercise.title} />
            </div>
            <div className="workout-modal__body">
              <header className="workout-modal__header">
                <div>
                  <p className="workout-modal__eyebrow">Ajoute tes exercices pour cette session.</p>
                  <h3 id="workout-modal-title">{selectedExercise.title}</h3>
                  <p className="workout-modal__meta">
                    <span>{selectedExercise.muscle}</span>
                    <span>{selectedExercise.category}</span>
                  </p>
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
                <button type="submit">Ajouter une série</button>
              </form>
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


