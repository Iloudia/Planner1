import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../../context/AuthContext"

const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"

const accountOptions = [
  {
    id: "info",
    label: "Informations sur le compte",
    description: "Consultez les informations de votre compte, comme votre numero de telephone et votre adresse e-mail.",
  },
  { id: "password", label: "Changez votre mot de passe", description: "Changez votre mot de passe a tout moment." },
  {
    id: "archive",
    label: "Telechargez une archive de vos donnees",
    description: "Decouvrez le type d informations stockees pour votre compte.",
  },
  { id: "disable", label: "Desactivez votre compte", description: "Decouvrez comment desactiver votre compte." },
]

const languageLabels: Record<string, string> = {
  "fr-FR": "Francais",
  "en-US": "Anglais",
  "es-ES": "Espagnol",
}

const formatDate = (value?: string) => {
  if (!value) return "Non renseigne"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
}

const formatDateTime = (value?: string) => {
  if (!value) return "Non renseigne"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })
}

const computeAge = (birthday?: string) => {
  if (!birthday) return null
  const birthDate = new Date(birthday)
  if (Number.isNaN(birthDate.getTime())) {
    return null
  }
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return age
}

const SettingsAccount = () => {
  const { userEmail, createdAt, verifyPassword } = useAuth()
  const [step, setStep] = useState<"list" | "password" | "details">("list")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<{ personal?: Record<string, unknown>; identity?: Record<string, unknown> }>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      setProfileData({ personal: parsed.personalInfo ?? {}, identity: parsed.identityInfo ?? {} })
    } catch {
      setProfileData({})
    }
  }, [])

  const personal = profileData.personal ?? {}
  const identity = profileData.identity ?? {}

  const username = (identity.username as string) ?? (userEmail?.split("@")[0] ?? "Non renseigne")
  const phone = (personal.phone as string) ?? "Non renseigne"
  const email = (personal.email as string) ?? userEmail ?? "Non renseigne"
  const country = (identity.country as string) ?? "Non renseigne"
  const languageCode = (identity.language as string) ?? ""
  const language = languageLabels[languageCode] ?? (languageCode || "Non renseigne")
  const gender = (identity.gender as string) || "Non precise"
  const birthday = (identity.birthday as string) ?? ""
  const age = computeAge(birthday)
  const formattedBirthday = formatDate(birthday)
  const formattedCreatedAt = formatDateTime(createdAt ?? undefined)

  const detailEntries = useMemo(
    () => [
      { label: "Nom d'utilisateur", value: username },
      { label: "Telephone", value: phone },
      { label: "E-mail", value: email },
      { label: "Creation de compte", value: formattedCreatedAt },
      { label: "Pays", value: country },
      { label: "Langue", value: language },
      { label: "Genre", value: gender || "Non precise" },
      { label: "Date de naissance", value: formattedBirthday },
      { label: "Age", value: age !== null ? `${age}` : "Non renseigne" },
    ],
    [username, phone, email, formattedCreatedAt, country, language, gender, formattedBirthday, age],
  )

  const handleConfirm = () => {
    if (!verifyPassword(password)) {
      setError("Mot de passe incorrect.")
      return
    }
    setError(null)
    setStep("details")
  }

  const handleReset = () => {
    setPassword("")
    setError(null)
    setStep("list")
  }

  if (step === "password") {
    return (
      <div className="settings-section">
        <h2>Confirmez votre mot de passe</h2>
        <p className="settings-section__intro">Veuillez saisir votre mot de passe pour obtenir ceci.</p>
        <div className="settings-password">
          <label>
            <span>Mot de passe du compte</span>
            <input
              type="password"
              className={error ? "settings-password__input is-error" : "settings-password__input"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(error)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleConfirm()
                }
              }}
            />
          </label>
          {error ? <p className="settings-error">{error}</p> : null}
          <button type="button" className="settings-password__forgot">
            Mot de passe oublie ?
          </button>
          <div className="settings-password__actions">
            <button type="button" onClick={handleReset}>
              Retour
            </button>
            <button type="button" className="settings-password__confirm" onClick={handleConfirm}>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "details") {
    return (
      <div className="settings-section">
        <h2>Informations sur le compte</h2>
        <dl className="settings-details">
          {detailEntries.map((entry) => (
            <div key={entry.label}>
              <dt>{entry.label}</dt>
              <dd>{entry.value}</dd>
            </div>
          ))}
        </dl>
        <p className="settings-note">Modifiez votre date de naissance sur votre profil.</p>
        <button type="button" className="settings-link" onClick={handleReset}>
          Retour aux options
        </button>
      </div>
    )
  }

  return (
    <div className="settings-section">
      <h2>Votre compte</h2>
      <p className="settings-section__intro">Gardez le controle de vos informations personnelles.</p>
      <div className="settings-options">
        {accountOptions.map((option) => (
          <button
            type="button"
            className="settings-option"
            key={option.id}
            onClick={() => {
              if (option.id === "info") {
                setStep("password")
              }
            }}
          >
            <span className="settings-option__label">{option.label}</span>
            <span className="settings-option__description">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SettingsAccount
