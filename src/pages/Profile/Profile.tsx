import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"
import { auth } from "../../utils/firebase"
import PageHeading from "../../components/PageHeading"
import "./Profile.css"

const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"
const PROFILE_PHOTO_SUFFIX = "profile-photo"
const CHANGE_LIMITS_KEY = "planner.profile.changeLimits.v1"
const DISPLAY_STORAGE_KEY = "planner.display.preferences"

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
  }
}

type EditableKey = "firstName" | "lastName" | "birthDate" | "gender" | "email" | "username"

type AccountRow = {
  key: EditableKey
  label: string
  type?: "text" | "email" | "date" | "select"
}

type ChangeLimits = {
  firstNameAt?: string
  lastNameAt?: string
  birthDateAt?: string
}

type BackgroundTone = "light" | "dark"

type ThemeTone = "rose" | "caramel" | "mint"

type DisplayPreferences = {
  fontScale: number
  backgroundTone: BackgroundTone
  themeTone: ThemeTone
}

const basicRows: AccountRow[] = [
  { key: "firstName", label: "Prenom" },
  { key: "lastName", label: "Nom" },
  { key: "birthDate", label: "Date de naissance", type: "date" },
  { key: "gender", label: "Genre", type: "select" },
  { key: "email", label: "Email", type: "email" },
]

const accountRows: AccountRow[] = [
  { key: "username", label: "Pseudo" },
]

const settingsSections = [
  { id: "account", title: "Votre compte", description: "Gerer les informations personnelles et la securite." },
  { id: "display", title: "Affichage", description: "Modifier la taille de la police et l ambiance visuelle." },
  { id: "languages", title: "Langues", description: "Choisir la langue principale de l interface." },
]

const FONT_SCALE_OPTIONS = [
  { id: "xs", label: "XS", value: 0.9, sample: "Aa" },
  { id: "sm", label: "S", value: 0.97, sample: "Aa" },
  { id: "md", label: "M", value: 1, sample: "Aa" },
  { id: "lg", label: "L", value: 1.08, sample: "Aa" },
  { id: "xl", label: "XL", value: 1.18, sample: "Aa" },
]

const BACKGROUND_OPTIONS: { id: BackgroundTone; label: string; description: string }[] = [
  { id: "light", label: "Clair", description: "Fond lumineux et aere" },
  { id: "dark", label: "Sombre", description: "Fond doux et contraste" },
]

const THEME_OPTIONS: { id: ThemeTone; label: string; description: string }[] = [
  { id: "rose", label: "Rose", description: "Notes douces et romantiques" },
  { id: "caramel", label: "Caramel", description: "Beige chaud et naturel" },
  { id: "mint", label: "Menthe", description: "Fraicheur et douceur" },
]

const MS_IN_DAY = 1000 * 60 * 60 * 24

const ProfilePage = () => {
  const { userEmail, changePassword, deactivateAccount, deleteAccount } = useAuth()
  const [activeId, setActiveId] = useState("account")
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [avatarSrc, setAvatarSrc] = useState<string>("")
  const [editingKey, setEditingKey] = useState<EditableKey | null>(null)
  const [pendingValue, setPendingValue] = useState("")
  const [editError, setEditError] = useState("")
  const [editInfo, setEditInfo] = useState("")
  const [genderMenuOpen, setGenderMenuOpen] = useState(false)
  const genderMenuRef = useRef<HTMLDivElement | null>(null)
  const [passwordEditing, setPasswordEditing] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [resetInfo, setResetInfo] = useState("")
  const [dangerOpen, setDangerOpen] = useState(false)
  const [dangerChoice, setDangerChoice] = useState<"disable" | "delete" | "">("")
  const [dangerReason, setDangerReason] = useState("")
  const [dangerConfirm, setDangerConfirm] = useState(false)
  const [dangerError, setDangerError] = useState("")
  const [displayPrefs, setDisplayPrefs] = useState<DisplayPreferences>({
    fontScale: 1,
    backgroundTone: "light",
    themeTone: "rose",
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  const safeEmail = userEmail ?? "anonymous"
  const profileDataKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(safeEmail), PROFILE_STORAGE_KEY), [safeEmail])
  const profilePhotoKey = useMemo(() => buildUserScopedKey(safeEmail, PROFILE_PHOTO_SUFFIX), [safeEmail])
  const changeLimitsKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(safeEmail), CHANGE_LIMITS_KEY), [safeEmail])
  const displayPrefsKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(safeEmail), DISPLAY_STORAGE_KEY), [safeEmail])

  const activeSection = useMemo(
    () => settingsSections.find((section) => section.id === activeId) ?? settingsSections[0],
    [activeId]
  )

  useEffect(() => {
    try {
      const raw = localStorage.getItem(profileDataKey)
      if (raw) {
        setProfileData(JSON.parse(raw) as ProfileData)
      }
    } catch {
      setProfileData({})
    }
  }, [profileDataKey])

  useEffect(() => {
    const stored = localStorage.getItem(profilePhotoKey) ?? localStorage.getItem("profile-photo") ?? ""
    setAvatarSrc(stored)
  }, [profilePhotoKey])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(displayPrefsKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as Partial<DisplayPreferences>
      setDisplayPrefs((prev) => ({
        fontScale: typeof parsed.fontScale === "number" ? parsed.fontScale : prev.fontScale,
        backgroundTone: parsed.backgroundTone === "dark" ? "dark" : prev.backgroundTone,
        themeTone: parsed.themeTone === "caramel" || parsed.themeTone === "mint" ? parsed.themeTone : prev.themeTone,
      }))
    } catch {
      // ignore
    }
  }, [displayPrefsKey])

  useEffect(() => {
    try {
      localStorage.setItem(displayPrefsKey, JSON.stringify(displayPrefs))
    } catch {
      // ignore
    }
  }, [displayPrefs, displayPrefsKey])

  useEffect(() => {
    document.documentElement.style.setProperty("--user-font-scale", displayPrefs.fontScale.toString())
    document.documentElement.dataset.backgroundTone = displayPrefs.backgroundTone
    document.documentElement.dataset.theme = displayPrefs.themeTone
  }, [displayPrefs])

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!genderMenuRef.current || genderMenuRef.current.contains(event.target as Node)) return
      setGenderMenuOpen(false)
    }
    if (genderMenuOpen) {
      document.addEventListener("mousedown", handleOutside)
    }
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [genderMenuOpen])

  const handlePanelClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest(".account-info-row") || target.closest(".account-info-edit") || target.closest(".account-select")) {
      return
    }
    setEditingKey(null)
    setPasswordEditing(false)
    setPendingValue("")
    setEditError("")
    setEditInfo("")
  }

  const readLimits = (): ChangeLimits => {
    try {
      const raw = localStorage.getItem(changeLimitsKey)
      return raw ? (JSON.parse(raw) as ChangeLimits) : {}
    } catch {
      return {}
    }
  }

  const writeLimits = (next: ChangeLimits) => {
    try {
      localStorage.setItem(changeLimitsKey, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  const canEdit = (key: EditableKey) => {
    const limits = readLimits()
    const now = Date.now()

    if (key === "firstName" || key === "lastName") {
      const last = key === "firstName" ? limits.firstNameAt : limits.lastNameAt
      if (last) {
        const diffDays = (now - new Date(last).getTime()) / MS_IN_DAY
        if (diffDays < 30) {
          return { ok: false, message: "Modifiable tous les 30 jours." }
        }
      }
    }

    if (key === "birthDate") {
      if (limits.birthDateAt) {
        return { ok: false, message: "La date d'anniversaire ne peut etre modifiee qu'une seule fois." }
      }
    }

    return { ok: true }
  }

  const persistProfileData = (next: ProfileData) => {
    setProfileData(next)
    try {
      localStorage.setItem(profileDataKey, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  const startEdit = (key: EditableKey) => {
    if (editingKey === key) {
      setEditingKey(null)
      setPendingValue("")
      setEditError("")
      setEditInfo("")
      return
    }
    const check = canEdit(key)
    if (!check.ok) {
      setEditError(check.message ?? "Modification indisponible.")
      return
    }
    setPasswordEditing(false)
    setPasswordError("")
    setPasswordSuccess("")
    setEditError("")
    setEditInfo("")
    setEditingKey(key)
    setPendingValue(getDisplayValue(key))
  }

  const cancelEdit = () => {
    setEditingKey(null)
    setPendingValue("")
    setEditError("")
    setEditInfo("")
  }

  const saveEdit = async () => {
    if (!editingKey) return
    const personal = { ...profileData.personalInfo }
    const identity = { ...profileData.identityInfo }
    const limits = readLimits()
    const nowIso = new Date().toISOString()

    if (editingKey === "firstName") {
      personal.firstName = pendingValue.trim()
      limits.firstNameAt = nowIso
    }
    if (editingKey === "lastName") {
      personal.lastName = pendingValue.trim()
      limits.lastNameAt = nowIso
    }
    if (editingKey === "birthDate") {
      identity.birthday = pendingValue
      limits.birthDateAt = nowIso
    }
    if (editingKey === "gender") {
      identity.gender = pendingValue
    }
    if (editingKey === "email") {
      personal.email = pendingValue.trim()
      try {
        if (auth.currentUser) {
          await sendEmailVerification(auth.currentUser)
          setEditInfo("Un email de confirmation a ete envoye.")
        }
      } catch {
        setEditError("Impossible d'envoyer l'email de confirmation.")
      }
    }
    if (editingKey === "username") {
      identity.username = pendingValue.trim()
    }

    persistProfileData({ personalInfo: personal, identityInfo: identity })
    writeLimits(limits)
    setEditingKey(null)
    setPendingValue("")
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setAvatarSrc(result)
      try {
        localStorage.setItem(profilePhotoKey, result)
        localStorage.setItem("profile-photo", result)
      } catch {
        // ignore
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ""
  }

  const handlePasswordSave = async () => {
    setPasswordError("")
    setPasswordSuccess("")
    setResetInfo("")
    const result = await changePassword(currentPassword, newPassword)
    if (!result.success) {
      setPasswordError(result.error ?? "Impossible de changer le mot de passe.")
      return
    }
    setPasswordSuccess("Mot de passe mis a jour.")
    setCurrentPassword("")
    setNewPassword("")
    setPasswordEditing(false)
  }

  const handlePasswordReset = async () => {
    setPasswordError("")
    setPasswordSuccess("")
    setResetInfo("")
    const email = getDisplayValue("email")
    if (!email) {
      setPasswordError("Aucun email associe au compte.")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setResetInfo("Un lien de reinitialisation a ete envoye par email.")
    } catch {
      setPasswordError("Impossible d envoyer le lien de reinitialisation.")
    }
  }

  const handleDangerSubmit = async () => {
    setDangerError("")
    if (!dangerConfirm || !dangerChoice || !dangerReason.trim()) {
      setDangerError("Merci de choisir une option, expliquer la raison et confirmer.")
      return
    }

    const result =
      dangerChoice === "disable" ? await deactivateAccount() : await deleteAccount()

    if (!result.success) {
      setDangerError(result.error ?? "Action impossible.")
      return
    }

    navigate("/login")
  }

  const getDisplayValue = (key: EditableKey) => {
    const personal = profileData.personalInfo ?? {}
    const identity = profileData.identityInfo ?? {}

    if (key === "firstName") return personal.firstName ?? ""
    if (key === "lastName") return personal.lastName ?? ""
    if (key === "birthDate") return identity.birthday ?? ""
    if (key === "gender") return identity.gender ?? ""
    if (key === "email") return personal.email ?? userEmail ?? ""
    if (key === "username") return identity.username ?? ""
    return ""
  }

  const formatDisplayValue = (key: EditableKey) => {
    const value = getDisplayValue(key)
    return value ? value : "Non renseigné"
  }

  const currentFontLabel = useMemo(() => {
    const option = FONT_SCALE_OPTIONS.find((choice) => choice.value === displayPrefs.fontScale)
    return option?.label ?? "M"
  }, [displayPrefs.fontScale])

  return (
    <>
      <div className="content-page settings-page">
        <PageHeading eyebrow="Paramètres" title="Personnalise ton expérience" />
        <section className="settings-layout">
          <nav className="settings-nav" aria-label="Sections profil">
            <ul>
              {settingsSections.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    className={section.id === activeId ? "is-active" : ""}
                    onClick={() => setActiveId(section.id)}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="settings-panel" ref={panelRef} onClick={handlePanelClick}>
            {activeSection?.id === "account" ? (
              <div className="account-settings">
                <div className="account-block">
                  <h2>Informations de base</h2>
                  <div className="account-avatar-row">
                    <button type="button" className="account-avatar" onClick={() => fileInputRef.current?.click()}>
                      {avatarSrc ? <img src={avatarSrc} alt="Profil" /> : null}
                    </button>
                    <div className="account-avatar-actions">
                      <button type="button" onClick={() => fileInputRef.current?.click()}>
                        Modifier la photo
                      </button>
                      <button type="button" className="is-danger" onClick={() => setAvatarSrc("")}>Supprimer</button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="account-avatar-input"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  {editError ? <p className="account-info-error">{editError}</p> : null}
                  {editInfo ? <p className="account-info-success">{editInfo}</p> : null}
                  <div className="account-info-list">
                    {basicRows.map((row) => {
                      const isOpen = editingKey === row.key
                      return (
                        <div className={`account-info-row${isOpen ? " is-open" : ""}`} key={row.key}>
                          <button type="button" className="account-info-main" onClick={() => startEdit(row.key)}>
                            <span className="account-info-label">{row.label}</span>
                            <span className="account-info-value">{formatDisplayValue(row.key)}</span>
                            <span className="account-info-arrow" aria-hidden="true">›</span>
                          </button>
                          {isOpen ? (
                            <div className="account-info-edit">
                              {row.type === "select" ? (
                                <div className="account-select" ref={genderMenuRef}>
                                  <button
                                    type="button"
                                    className={pendingValue ? "account-select__trigger" : "account-select__trigger is-placeholder"}
                                    aria-haspopup="listbox"
                                    aria-expanded={genderMenuOpen}
                                    onClick={() => setGenderMenuOpen((prev) => !prev)}
                                  >
                                    <span>{pendingValue || "Ne pas preciser"}</span>
                                    <svg className="account-select__chevron" viewBox="0 0 20 20" aria-hidden="true">
                                      <path
                                        d="M5 7.5L10 12.5L15 7.5"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                  {genderMenuOpen ? (
                                    <div className="account-select__menu" role="listbox">
                                      {[
                                        { value: "", label: "Ne pas preciser" },
                                        { value: "femme", label: "Femme" },
                                        { value: "homme", label: "Homme" },
                                      ].map((option) => (
                                        <button
                                          key={option.label}
                                          type="button"
                                          role="option"
                                          aria-selected={pendingValue === option.value}
                                          className={pendingValue === option.value ? "is-selected" : undefined}
                                          onMouseDown={(event) => {
                                            event.preventDefault()
                                            setPendingValue(option.value)
                                            setGenderMenuOpen(false)
                                          }}
                                        >
                                          {option.label}
                                        </button>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              ) : (
                                <input
                                  type={row.type ?? "text"}
                                  value={pendingValue}
                                  onChange={(event) => setPendingValue(event.target.value)}
                                />
                              )}
                              <div className="account-info-actions">
                                <button type="button" onClick={saveEdit}>Enregistrer</button>
                                <button type="button" className="is-ghost" onClick={cancelEdit}>Annuler</button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="account-block">
                  <h2>Informations du compte</h2>
                  <div className="account-info-list">
                    {accountRows.map((row) => {
                      const isOpen = editingKey === row.key
                      return (
                        <div className={`account-info-row${isOpen ? " is-open" : ""}`} key={row.key}>
                          <button type="button" className="account-info-main" onClick={() => startEdit(row.key)}>
                            <span className="account-info-label">{row.label}</span>
                            <span className="account-info-value">{formatDisplayValue(row.key)}</span>
                            <span className="account-info-arrow" aria-hidden="true">›</span>
                          </button>
                          {isOpen ? (
                            <div className="account-info-edit">
                              <input
                                type={row.type ?? "text"}
                                value={pendingValue}
                                onChange={(event) => setPendingValue(event.target.value)}
                              />
                              <div className="account-info-actions">
                                <button type="button" onClick={saveEdit}>Enregistrer</button>
                                <button type="button" className="is-ghost" onClick={cancelEdit}>Annuler</button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}

                    <div className={`account-info-row${passwordEditing ? " is-open" : ""}`}>
                      <button
                        type="button"
                        className="account-info-main"
                        onClick={() => {
                          setEditingKey(null)
                          setPendingValue("")
                          setPasswordEditing((prev) => !prev)
                        }}
                      >
                        <span className="account-info-label">Mot de passe</span>
                        <span className="account-info-value">••••••••</span>
                        <span className="account-info-arrow" aria-hidden="true">›</span>
                      </button>
                      {passwordEditing ? (
                        <div className="account-info-edit">
                          <input
                            type="password"
                            placeholder="Mot de passe actuel"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                          />
                          <input
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                          />
                          {passwordError ? <span className="account-info-error">{passwordError}</span> : null}
                          {passwordSuccess ? <span className="account-info-success">{passwordSuccess}</span> : null}
                          {resetInfo ? <span className="account-info-success">{resetInfo}</span> : null}
                          <div className="account-info-actions">
                            <button type="button" onClick={handlePasswordSave}>Enregistrer</button>
                            <button type="button" className="is-ghost" onClick={() => setPasswordEditing(false)}>Annuler</button>
                          </div>
                          <button type="button" className="account-info-forgot" onClick={handlePasswordReset}>
                            Mot de passe oublié
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="account-danger">
                  <button type="button" className="account-danger__toggle" onClick={() => setDangerOpen((prev) => !prev)}>
                    Desactiver ou supprimer le compte
                  </button>
                  <p>Programmer la desactivation pendant 30 jours ou supprimer immediatement.</p>
                  {dangerOpen ? (
                    <div className="account-danger__panel">
                      <div className="account-danger__choices">
                        <button
                          type="button"
                          className={dangerChoice === "disable" ? "is-active" : ""}
                          onClick={() => setDangerChoice("disable")}
                        >
                          Desactiver
                        </button>
                        <button
                          type="button"
                          className={dangerChoice === "delete" ? "is-active" : ""}
                          onClick={() => setDangerChoice("delete")}
                        >
                          Supprimer
                        </button>
                      </div>
                      <label className="account-danger__label">
                        Pourquoi souhaitez-vous le faire ?
                        <textarea value={dangerReason} onChange={(event) => setDangerReason(event.target.value)} rows={3} />
                      </label>
                      <label className="account-danger__confirm">
                        <input
                          type="checkbox"
                          checked={dangerConfirm}
                          onChange={(event) => setDangerConfirm(event.target.checked)}
                        />
                        Je confirme mon choix
                      </label>
                      {dangerError ? <span className="account-info-error">{dangerError}</span> : null}
                      <button type="button" className="account-danger__submit" onClick={handleDangerSubmit}>
                        Confirmer
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : activeSection?.id === "display" ? (
              <div className="settings-section">
                <h2>Affichage</h2>
                <p className="settings-section__intro">Modifier la taille de la police et l ambiance visuelle.</p>

                <section className="settings-display-group">
                  <header className="settings-display-group__header">
                    <div>
                      <h3>Taille de la police</h3>
                      <p>Ajuste la taille globale du texte pour tout le site.</p>
                    </div>
                    <span className="settings-display-group__value">{currentFontLabel}</span>
                  </header>
                  <div className="font-scale-selector" role="group" aria-label="Choisir la taille de police">
                    {FONT_SCALE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={displayPrefs.fontScale === option.value ? "font-scale-option is-active" : "font-scale-option"}
                        onClick={() => setDisplayPrefs((prev) => ({ ...prev, fontScale: option.value }))}
                        aria-pressed={displayPrefs.fontScale === option.value}
                      >
                        <span className="font-scale-option__sample" aria-hidden="true" style={{ transform: `scale(${option.value + 0.1})` }}>
                          {option.sample}
                        </span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="settings-display-group">
                  <header className="settings-display-group__header">
                    <div>
                      <h3>Couleurs</h3>
                      <p>Bientôt disponible</p>
                    </div>
                  </header>
                </section>

                <section className="settings-display-group">
                  <header className="settings-display-group__header">
                    <div>
                      <h3>Arriere-plan</h3>
                      <p>Bientôt disponible</p>
                    </div>
                  </header>
                </section>
              </div>
            ) : (
              <>
                <div className="settings-panel__header">
                  <h2>{activeSection?.title}</h2>
                  {activeSection?.description ? <p>{activeSection.description}</p> : null}
                </div>
                <div className="settings-options">
                  <div className="settings-option">
                    <span className="settings-option__label">Bientot disponible</span>
                    <span className="settings-option__description">Cette section sera personnalisable prochainement.</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default ProfilePage
