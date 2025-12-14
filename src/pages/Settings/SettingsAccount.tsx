import { FormEvent, useEffect, useMemo, useState } from "react"
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
  {
    id: "deactivate",
    label: "Desactiver ou supprimer le compte",
    description: "Planifiez une desactivation de 30 jours ou supprimez-le immediatement.",
  },
]

const languageLabels: Record<string, string> = {
  "fr-FR": "Francais",
  "en-US": "Anglais",
  "es-ES": "Espagnol",
}

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {open ? (
      <>
        <path
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
      </>
    ) : (
      <>
        <path
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.21 16.058 7 19 11.478 19c1.805 0 3.508-.43 5.02-1.196"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M6.228 6.228A10.45 10.45 0 0111.478 5c4.477 0 8.268 2.943 9.543 7a10.523 10.523 0 01-4.03 5.56"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M15 12a3 3 0 00-3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    )}
  </svg>
)

type PasswordField = "current" | "next" | "confirm"

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
  const { userEmail, createdAt, verifyPassword, changePassword, deactivateAccount, deleteAccount, scheduledDeletionDate } = useAuth()
  const [step, setStep] = useState<"list" | "password" | "details" | "change-password" | "deactivate">("list")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<{ personal?: Record<string, unknown>; identity?: Record<string, unknown> }>({})
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" })
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null)
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<string | null>(null)
  const [passwordVisibility, setPasswordVisibility] = useState({ current: false, next: false, confirm: false })
  const [accountActionError, setAccountActionError] = useState<string | null>(null)
  const [accountActionSuccess, setAccountActionSuccess] = useState<string | null>(null)

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const passwordInputType = (field: PasswordField) => (passwordVisibility[field] ? "text" : "password")

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

  const handlePasswordChangeReset = () => {
    setPasswordForm({ current: "", next: "", confirm: "" })
    setPasswordChangeError(null)
    setPasswordChangeSuccess(null)
    setPasswordVisibility({ current: false, next: false, confirm: false })
    setStep("list")
  }

  const handlePasswordChangeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordChangeSuccess(null)
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordChangeError("Merci de remplir tous les champs.")
      return
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordChangeError("Les nouveaux mots de passe ne correspondent pas.")
      return
    }
    const result = changePassword(passwordForm.current, passwordForm.next)
    if (!result.success) {
      setPasswordChangeError(result.error ?? "Impossible de changer le mot de passe.")
      return
    }
    setPasswordChangeError(null)
    setPasswordForm({ current: "", next: "", confirm: "" })
    setPasswordChangeSuccess("Votre mot de passe a ete mis a jour.")
  }

  const handleDeactivateAccount = () => {
    setAccountActionError(null)
    const result = deactivateAccount()
    if (!result.success) {
      setAccountActionSuccess(null)
      setAccountActionError(result.error ?? "Impossible de desactiver le compte.")
      return
    }
    const deletionDate = result.deleteAt ?? scheduledDeletionDate
    const formatted = deletionDate ? formatDateTime(deletionDate) : "30 jours"
    setAccountActionSuccess(`Votre compte restera actif jusqu'au ${formatted} avant suppression definitive.`)
  }

  const handleDeleteAccount = () => {
    setAccountActionError(null)
    const result = deleteAccount()
    if (!result.success) {
      setAccountActionError(result.error ?? "Impossible de supprimer le compte.")
      setAccountActionSuccess(null)
      return
    }
    setAccountActionSuccess("Votre compte a ete supprime.")
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

  if (step === "change-password") {
    return (
      <div className="settings-section">
        <h2>Changez votre mot de passe</h2>
        <p className="settings-section__intro">Renforcez la securite de votre compte Planner.</p>
        <form className="settings-password-change" onSubmit={handlePasswordChangeSubmit}>
          <label>
            <span>Mot de passe actuel</span>
            <div className="settings-password-field">
              <input
                type={passwordInputType("current")}
                value={passwordForm.current}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, current: event.target.value }))}
                required
              />
              <button
                type="button"
                className="settings-password-toggle"
                onClick={() => togglePasswordVisibility("current")}
                aria-label={passwordVisibility.current ? "Masquer le mot de passe actuel" : "Afficher le mot de passe actuel"}
                aria-pressed={passwordVisibility.current}
              >
                <EyeIcon open={passwordVisibility.current} />
              </button>
            </div>
          </label>
          <label>
            <span>Nouveau mot de passe</span>
            <div className="settings-password-field">
              <input
                type={passwordInputType("next")}
                value={passwordForm.next}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))}
                minLength={6}
                required
              />
              <button
                type="button"
                className="settings-password-toggle"
                onClick={() => togglePasswordVisibility("next")}
                aria-label={passwordVisibility.next ? "Masquer le nouveau mot de passe" : "Afficher le nouveau mot de passe"}
                aria-pressed={passwordVisibility.next}
              >
                <EyeIcon open={passwordVisibility.next} />
              </button>
            </div>
          </label>
          <label>
            <span>Confirmer le mot de passe</span>
            <div className="settings-password-field">
              <input
                type={passwordInputType("confirm")}
                value={passwordForm.confirm}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))}
                minLength={6}
                required
              />
              <button
                type="button"
                className="settings-password-toggle"
                onClick={() => togglePasswordVisibility("confirm")}
                aria-label={passwordVisibility.confirm ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"}
                aria-pressed={passwordVisibility.confirm}
              >
                <EyeIcon open={passwordVisibility.confirm} />
              </button>
            </div>
          </label>
          {passwordChangeError ? <p className="settings-error">{passwordChangeError}</p> : null}
          {passwordChangeSuccess ? <p className="settings-success">{passwordChangeSuccess}</p> : null}
          <p className="settings-note">
            Modifier votre mot de passe vous deconnectera de toutes vos sessions actives sauf celle que vous utilisez actuellement.
          </p>
          <div className="settings-password__actions">
            <button type="button" onClick={handlePasswordChangeReset}>
              Annuler
            </button>
            <button type="submit" className="settings-password__confirm">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (step === "deactivate") {
    const formattedDeletion = scheduledDeletionDate ? formatDateTime(scheduledDeletionDate) : null
    return (
      <div className="settings-section">
        <h2>Desactiver ou supprimer le compte</h2>
        <p className="settings-section__intro">
          Desactivez votre compte pour planifier sa suppression sous 30 jours ou supprimez-le immediatement si vous etes sur de votre choix.
        </p>
        {accountActionError ? <p className="settings-error">{accountActionError}</p> : null}
        {accountActionSuccess ? <p className="settings-success">{accountActionSuccess}</p> : null}
        {formattedDeletion ? <p className="settings-note">Suppression programmee le {formattedDeletion}.</p> : null}
        <div className="settings-dual-actions">
          <article className="settings-action-card">
            <h3>Desactiver le compte</h3>
            <p>Le compte restera accessible pendant 30 jours, puis il sera supprime automatiquement.</p>
            <button type="button" onClick={handleDeactivateAccount}>
              Desactiver mon compte
            </button>
          </article>
          <article className="settings-action-card settings-action-card--danger">
            <h3>Supprimer le compte</h3>
            <p>Supprime immediatement et definitivement vos donnees et sessions.</p>
            <button type="button" onClick={handleDeleteAccount}>
              Supprimer definitivement
            </button>
          </article>
        </div>
        <button type="button" className="settings-link" onClick={() => setStep("list")}>
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
              } else if (option.id === "password") {
                setPasswordForm({ current: "", next: "", confirm: "" })
                setPasswordChangeError(null)
                setPasswordChangeSuccess(null)
                setStep("change-password")
              } else if (option.id === "deactivate") {
                setAccountActionError(null)
                setAccountActionSuccess(null)
                setStep("deactivate")
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
