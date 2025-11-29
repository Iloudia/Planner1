import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import PageHeading from "../../components/PageHeading"
import workoutBanner1 from "../../assets/planner-01.jpg"
import workoutBanner2 from "../../assets/planner-02.jpg"
import workoutBanner3 from "../../assets/planner-03.jpg"
import workoutBanner4 from "../../assets/planner-04.jpg"
import workoutBanner5 from "../../assets/planner-05.jpg"
import workoutBanner6 from "../../assets/planner-06.jpg"
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
  const [exercises, setExercises] = useState<ExerciseCard[]>(DEFAULT_EXERCISES)
  const [videos, setVideos] = useState<VideoCard[]>(DEFAULT_VIDEOS)
  const [form, setForm] = useState({ title: "", muscle: "", category: "", image: "" })
  const [videoForm, setVideoForm] = useState({ title: "", url: "" })

  useEffect(() => {
    document.body.classList.add("planner-page--white")
    return () => {
      document.body.classList.remove("planner-page--white")
    }
  }, [])

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
  }

  const handleDeleteVideo = (videoId: string) => {
    setVideos((previous) => previous.filter((item) => item.id !== videoId))
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

  const rituals = useMemo(
    () => [
      "Hype playlist",
      "Gourde prete",
      "Mode avion / DND",
      "Stretch rapide",
      "Snack pre-workout",
    ],
    [],
  )

  return (
    <div className="workout-page">
      <div className="workout-banner-strip" aria-hidden="true">
        {[workoutBanner1, workoutBanner2, workoutBanner3, workoutBanner4, workoutBanner5, workoutBanner6].map(
          (src, index) => (
            <div key={index} className="workout-banner-strip__item">
              <img src={src} alt={`Inspiration ${index + 1}`} />
            </div>
          ),
        )}
      </div>
      <div className="workout-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Routine active" title="Workout board" />

      <div className="workout-layout">
        <section className="workout-rituals">
          <div className="workout-section-header">
            <h2>Pre-Workout Rituals</h2>
          </div>
          <ul>
            {rituals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="workout-exercises">
          <header className="workout-exercises__header">
            <div className="workout-section-header">
              <h2>Liste d'exercices</h2>
            </div>
          </header>

          <form className="workout-form" onSubmit={handleSubmit}>
            <label>
              <span>Titre</span>
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
                placeholder="Bras, fessiers, dos..."
              />
            </label>
            <label>
              <span>Type</span>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="HIIT, cardio, stretching..."
              />
            </label>
            <label>
              <span>Image (import)</span>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0])} />
            </label>
            <button type="submit">Ajouter la carte</button>
          </form>
        </section>

        <section className="workout-library workout-section--full">
          <div className="workout-cards">
            {exercises.map((exercise) => (
              <article key={exercise.id} className="workout-card">
                <button
                  type="button"
                  className="workout-card__delete"
                  aria-label={`Supprimer ${exercise.title}`}
                  onClick={() => handleDeleteExercise(exercise.id)}
                >
                  ×
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

        <section className="workout-videos workout-section--full">
          <form className="workout-video-form" onSubmit={handleVideoSubmit}>
            <label>
              <span>Titre</span>
              <input
                type="text"
                value={videoForm.title}
                onChange={(e) => setVideoForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Nom de la video"
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
              <article key={video.id} className="workout-video-card">
                <button
                  type="button"
                  className="workout-card__delete"
                  aria-label={`Supprimer ${video.title}`}
                  onClick={() => handleDeleteVideo(video.id)}
                >
                  ×
                </button>
                <div className="workout-video-thumb">
                  <img src={video.thumbnail} alt={video.title} />
                </div>
                <div className="workout-video-card__body">
                  <a href={video.url} target="_blank" rel="noreferrer">
                    {video.title}
                  </a>
                  <span>youtube.com</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <div className="workout-page__footer-bar" aria-hidden="true" />
    </div>
  )
}

export default WorkoutPage
