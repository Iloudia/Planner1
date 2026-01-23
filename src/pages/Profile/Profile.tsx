import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { useAuth } from "../../context/AuthContext"
import { useTasks } from "../../context/TasksContext"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"
import defaultProfilePhoto from "../../assets/katie-huber-rhoades-dupe (1).jpeg"
import "./Profile.css"

const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"
const ONBOARDING_STORAGE_KEY = "planner.onboarding.answers.v1"
const PROFILE_PHOTO_SUFFIX = "profile-photo"
const LAST_LOGIN_SUFFIX = "planner.profile.lastLogin"

type ProfileData = {
  personalInfo?: {
    firstName?: string
    lastName?: string
    email?: string
  }
  identityInfo?: {
    username?: string
    birthday?: string
    gender?: string
    language?: string
  }
}

type OnboardingAnswers = {
  categories?: string[]
  priority?: string
  reasons?: string[]
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "Non renseigne"
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return "Non renseigne"
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })
}

const formatDateTime = (dateStr?: string | null) => {
  if (!dateStr) return "Non renseigne"
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return "Non renseigne"
  return date.toLocaleString("fr-FR", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

const zodiacFromDate = (dateStr?: string | null) => {
  if (!dateStr) return "Non renseigne"
  const parts = dateStr.split("-").map((part) => Number(part))
  if (parts.length !== 3) return "Non renseigne"
  const [year, month, day] = parts
  if (!year || !month || !day) return "Non renseigne"
  const value = month * 100 + day
  if (value >= 321 && value <= 419) return "Belier"
  if (value >= 420 && value <= 520) return "Taureau"
  if (value >= 521 && value <= 620) return "Gemeaux"
  if (value >= 621 && value <= 722) return "Cancer"
  if (value >= 723 && value <= 822) return "Lion"
  if (value >= 823 && value <= 922) return "Vierge"
  if (value >= 923 && value <= 1022) return "Balance"
  if (value >= 1023 && value <= 1121) return "Scorpion"
  if (value >= 1122 && value <= 1221) return "Sagittaire"
  if (value >= 1222 || value <= 119) return "Capricorne"
  if (value >= 120 && value <= 218) return "Verseau"
  if (value >= 219 && value <= 320) return "Poissons"
  return "Non renseigne"
}

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

function ProfilePage() {
  const { userEmail, createdAt } = useAuth()
  const { tasks } = useTasks()

  const safeEmail = userEmail ?? "anonymous"
  const profilePhotoKey = useMemo(() => buildUserScopedKey(safeEmail, PROFILE_PHOTO_SUFFIX), [safeEmail])
  const profileDataKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(safeEmail), PROFILE_STORAGE_KEY), [safeEmail])
  const onboardingKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(safeEmail), ONBOARDING_STORAGE_KEY), [safeEmail])
  const lastLoginKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(safeEmail), LAST_LOGIN_SUFFIX), [safeEmail])

  const [profileSrc, setProfileSrc] = useState(() => localStorage.getItem(profilePhotoKey) ?? localStorage.getItem("profile-photo") ?? defaultProfilePhoto)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [onboarding, setOnboarding] = useState<OnboardingAnswers>({})
  const [lastLogin, setLastLogin] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(profileDataKey)
      if (!raw) {
        setProfileData({})
        return
      }
      setProfileData(JSON.parse(raw) as ProfileData)
    } catch {
      setProfileData({})
    }
  }, [profileDataKey])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(onboardingKey)
      if (!raw) {
        setOnboarding({})
        return
      }
      setOnboarding(JSON.parse(raw) as OnboardingAnswers)
    } catch {
      setOnboarding({})
    }
  }, [onboardingKey])

  useEffect(() => {
    const previous = localStorage.getItem(lastLoginKey) ?? ""
    setLastLogin(previous)
    try {
      localStorage.setItem(lastLoginKey, new Date().toISOString())
    } catch {
      // ignore
    }
  }, [lastLoginKey])

  useEffect(() => {
    const handleStorage = () => {
      setProfileSrc(localStorage.getItem(profilePhotoKey) ?? localStorage.getItem("profile-photo") ?? defaultProfilePhoto)
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [profilePhotoKey])

  const handleProfileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setProfileError(null)
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setProfileError("Format non supporte.")
      event.target.value = ""
      return
    }

    try {
      const compressed = await fileToCompressedSquareDataUrl(file, { size: 320, quality: 0.82 })
      setProfileSrc(compressed)
      try {
        localStorage.setItem(profilePhotoKey, compressed)
        localStorage.setItem("profile-photo", compressed)
      } catch {
        // ignore
      }
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Erreur lors du traitement de l image.")
    } finally {
      event.target.value = ""
    }
  }

  const personal = profileData.personalInfo ?? {}
  const identity = profileData.identityInfo ?? {}
  const username = identity.username ?? (userEmail ? userEmail.split("@")[0] : "Utilisateur")
  const firstName = personal.firstName ?? ""
  const lastName = personal.lastName ?? ""
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim()
  const nameValue = fullName || username
  const emailValue = personal.email ?? userEmail ?? "Non renseigne"
  const birthday = identity.birthday ?? ""
  const gender = identity.gender ?? "Non renseigne"
  const language = identity.language ?? (typeof navigator !== "undefined" ? navigator.language : "Non renseigne")
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Non renseigne"
  const zodiac = zodiacFromDate(birthday)
  const createdLabel = formatDateTime(createdAt ?? null)
  const categories = Array.isArray(onboarding.categories) && onboarding.categories.length > 0 ? onboarding.categories : []
  const priority = onboarding.priority ?? "Non renseigne"

  const upcomingTasks = useMemo(() => {
    const nowTs = Date.now()
    return tasks
      .map((task) => {
        const dateTs = new Date(`${task.date}T00:00`).getTime()
        const startDate = new Date(`${task.date}T${task.start ?? "00:00"}`)
        const startTs = Number.isFinite(startDate.getTime()) ? startDate.getTime() : dateTs
        return { ...task, startTs, dateTs }
      })
      .filter((task) => task.startTs >= nowTs || task.dateTs >= nowTs)
      .sort((a, b) => a.startTs - b.startTs)
      .slice(0, 3)
  }, [tasks])

  return (
    <div className="content-page profile-page">
      <div className="profile-top">
        <section className="section-card profile-card profile-card--identity">
          <div className="profile-identity">
            <div className="profile-identity__photo">
              <img src={profileSrc} alt="Profil" />
              <button type="button" className="profile-identity__edit" onClick={() => fileInputRef.current?.click()}>
                Modifier la photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="profile-identity__file" onChange={handleProfileInput} />
            </div>
            <div className="profile-identity__info">
              <div className="profile-identity__names">
                <div className="profile-identity__line">{lastName || "Non renseigne"}</div>
                <div className="profile-identity__line">{firstName || "Non renseigne"}</div>
              </div>
              <div className="profile-identity__meta">
                <div className="profile-identity__row">
                  <span className="profile-identity__label">Email</span>
                  <span>{emailValue}</span>
                </div>
                <div className="profile-identity__row">
                  <span className="profile-identity__label">Signe astrologique</span>
                  <span>{zodiac}</span>
                </div>
                <div className="profile-identity__row">
                  <span className="profile-identity__label">Anniversaire</span>
                  <span>{formatDate(birthday)}</span>
                </div>
                <div className="profile-identity__row">
                  <span className="profile-identity__label">Genre</span>
                  <span>{gender}</span>
                </div>
              </div>
            </div>
          </div>
          {profileError ? <p className="profile-error">{profileError}</p> : null}
        </section>

        <section className="section-card profile-card profile-card--resume">
          <h3>Resume</h3>
          <div className="profile-list">
            <div className="profile-list__row">
              <span className="profile-list__label">Pseudo</span>
              <span>{username}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Email</span>
              <span>{emailValue}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Photo</span>
              <span>{profileSrc === defaultProfilePhoto ? "Par defaut" : "Personnalisee"}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Creation du compte</span>
              <span>{createdLabel}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="profile-sections">
        <section className="section-card profile-card profile-card--personal">
          <h3>Informations personnelles</h3>
          <div className="profile-list">
            <div className="profile-list__row">
              <span className="profile-list__label">Prenom / Nom</span>
              <span>{nameValue || "Non renseigne"}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Signe astrologique</span>
              <span>{zodiac}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Anniversaire</span>
              <span>{formatDate(birthday)}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Genre</span>
              <span>{gender}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Fuseau horaire</span>
              <span>{timezone}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Langue</span>
              <span>{language}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Email (non public)</span>
              <span>{emailValue}</span>
            </div>
          </div>
          <p className="profile-note">Visible uniquement par vous.</p>
        </section>

        <section className="section-card profile-card profile-card--preferences">
          <h3>Preferences</h3>
          <div className="profile-list">
            <div className="profile-list__row">
              <span className="profile-list__label">Categories favorites</span>
              <span>{categories.length > 0 ? categories.join(", ") : "Non renseigne"}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Objectif</span>
              <span>{priority || "Non renseigne"}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Confidentialite</span>
              <span>Non renseigne</span>
            </div>
          </div>
        </section>

        <section className="section-card profile-card profile-card--security">
          <h3>Securite</h3>
          <div className="profile-list">
            <div className="profile-list__row">
              <span className="profile-list__label">Dernier changement mot de passe</span>
              <span>Non disponible</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Appareils connectes</span>
              <span>Non disponible</span>
            </div>
          </div>
        </section>

        <section className="section-card profile-card profile-card--activity">
          <h3>Resume d activite</h3>
          <div className="profile-list">
            <div className="profile-list__row">
              <span className="profile-list__label">Derniere connexion</span>
              <span>{formatDateTime(lastLogin || null)}</span>
            </div>
            <div className="profile-list__row">
              <span className="profile-list__label">Dernieres actions</span>
              <span>Non disponible</span>
            </div>
          </div>
          {upcomingTasks.length > 0 ? (
            <ul className="profile-activity-list">
              {upcomingTasks.map((task) => (
                <li key={task.id}>
                  <span className="profile-activity-title">{task.title}</span>
                  <span className="profile-activity-meta">{formatDate(task.date)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default ProfilePage
