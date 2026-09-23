import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendEmailVerification } from "firebase/auth"
import { useAuth } from "../../context/AuthContext"
import { useUserProfilePhoto } from "../../hooks/useUserProfilePhoto"
import { fetchApi } from "../../utils/apiUrl"
import { buildUserScopedKey } from "../../utils/userScopedKey"
import { auth } from "../../utils/firebase"
import defaultProfilePhoto from "../../assets/katie-huber-rhoades-dupe (1).webp"
import MediaImage from "../../components/MediaImage"
import PageHeading from "../../components/PageHeading"
import PageLoader from "../../components/PageLoader"
import "./Profile.css"

const CHANGE_LIMITS_KEY = "planner.profile.changeLimits.v1"

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

const basicRows: AccountRow[] = [
  { key: "firstName", label: "Prénom" },
  { key: "lastName", label: "Nom" },
  { key: "birthDate", label: "Date de naissance", type: "date" },
  { key: "gender", label: "Genre", type: "select" },
  { key: "email", label: "Email", type: "email" },
]

const accountRows: AccountRow[] = [
  { key: "username", label: "Pseudo" },
]

const settingsSections = [
  { id: "account", title: "Ton compte", description: "Gérer les informations personnelles et la sécurité." },
  { id: "languages", title: "Langues", description: "Choisir la langue principale de l'interface." },
]

const MS_IN_DAY = 1000 * 60 * 60 * 24

const ProfilePage = () => {
  const { isAuthReady, userEmail, userProfile, updateUserProfile, changePassword, deactivateAccount, deleteAccount, verifyPassword } = useAuth()
  const [activeId, setActiveId] = useState("account")
  const [profileData, setProfileData] = useState<ProfileData>({})
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
  const [dangerPassword, setDangerPassword] = useState("")
  const [dangerError, setDangerError] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const {
    photoSrc: avatarSrc,
    hasCustomPhoto,
    isLoaded: isProfilePhotoLoaded,
    error: avatarError,
    isBusy: isAvatarBusy,
    uploadPhoto,
    clearPhoto,
  } = useUserProfilePhoto({
    fallbackSrc: defaultProfilePhoto,
  })

  const safeEmail = userEmail ?? "anonymous"
  const changeLimitsKey = useMemo(() => buildUserScopedKey(safeEmail, CHANGE_LIMITS_KEY), [safeEmail])

  const activeSection = useMemo(
    () => settingsSections.find((section) => section.id === activeId) ?? settingsSections[0],
    [activeId]
  )

  useEffect(() => {
    setProfileData({
      personalInfo: userProfile.personalInfo ?? {},
      identityInfo: userProfile.identityInfo ?? {},
    })
  }, [userProfile])

  useEffect(() => {
    document.body.classList.add("profile-page--lux")
    return () => {
      document.body.classList.remove("profile-page--lux")
    }
  }, [])

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
        return { ok: false, message: "La date d'anniversaire ne peut être modifiée qu'une seule fois." }
      }
    }

    return { ok: true }
  }

  const persistProfileData = async (next: ProfileData) => {
    setProfileData(next)
    await updateUserProfile({
      personalInfo: next.personalInfo ?? {},
      identityInfo: next.identityInfo ?? {},
    })
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
          setEditInfo("Un email de confirmation a été envoyé.")
        }
      } catch {
        setEditError("Impossible d'envoyer l'email de confirmation.")
      }
    }
    if (editingKey === "username") {
      identity.username = pendingValue.trim()
    }

    try {
      await persistProfileData({ personalInfo: personal, identityInfo: identity })
    } catch {
      setEditError("Impossible d'enregistrer ces informations.")
      return
    }
    writeLimits(limits)
    setEditingKey(null)
    setPendingValue("")
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      event.target.value = ""
      return
    }
    await uploadPhoto(file)
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
    setPasswordSuccess("Mot de passe mis à jour.")
    setCurrentPassword("")
    setNewPassword("")
    setPasswordEditing(false)
  }

  const handlePasswordReset = async () => {
    setPasswordError("")
    setPasswordSuccess("")
    setResetInfo("")
    const currentUser = auth.currentUser
    const email = currentUser?.email?.trim()
    if (!email) {
      setPasswordError("Aucun email associé au compte.")
      return
    }
    try {
      const token = await currentUser.getIdToken()
      const response = await fetchApi("/api/email/password-reset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
      if (!response.ok) {
        let reason = "Impossible d'envoyer le lien de réinitialisation."
        try {
          const payload = await response.json()
          if (payload?.error) {
            reason = payload.error
          }
        } catch {
          // ignore
        }
        throw new Error(reason)
      }
      setResetInfo("Un lien de réinitialisation a été envoyé par email. Si vous ne le voyez pas, regardez dans les spams de votre boîte mail.")
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Impossible d'envoyer le lien de réinitialisation.")
    }
  }

  const handleDangerSubmit = async () => {
    setDangerError("")
    if (!dangerChoice || !dangerReason.trim() || !dangerPassword.trim()) {
      setDangerError("Merci de choisir une option, expliquer la raison et saisir le mot de passe.")
      return
    }

    const isPasswordValid = await verifyPassword(dangerPassword)
    if (!isPasswordValid) {
      setDangerError("Mot de passe incorrect.")
      return
    }

    const result =
      dangerChoice === "disable" ? await deactivateAccount() : await deleteAccount()

    if (!result.success) {
      setDangerError(result.error ?? "Action impossible.")
      return
    }

    setDangerPassword("")
    navigate("/login")
  }

  const isDangerReady = Boolean(dangerChoice && dangerReason.trim() && dangerPassword.trim())

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

  const isProfileLoading = !isAuthReady || !isProfilePhotoLoaded

  if (isProfileLoading) {
    return (
      <PageLoader />
    )
  }

  return (
    <>
      <PageHeading eyebrow="Paramètres" title="Personnalise ton expérience" />
      <div className="content-page settings-page">
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
                    <button type="button" className="account-avatar" onClick={() => fileInputRef.current?.click()} disabled={isAvatarBusy}>
                      {avatarSrc ? <MediaImage src={avatarSrc} alt="Photo de profil" loading="eager" decoding="async" width={64} height={64} /> : null}
                    </button>
                    <div className="account-avatar-actions">
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isAvatarBusy}>
                        Modifier la photo
                      </button>
                      <button type="button" className="is-danger" onClick={() => void clearPhoto()} disabled={isAvatarBusy || !hasCustomPhoto}>
                        Supprimer
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="account-avatar-input"
                      onChange={(event) => void handleAvatarChange(event)}
                    />
                  </div>
                  {avatarError ? <p className="account-info-error">{avatarError}</p> : null}
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
                                    <span>{pendingValue || "Ne pas préciser"}</span>
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
                                        { value: "", label: "Ne pas préciser" },
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
                    Désactiver ou supprimer le compte
                  </button>
                  <p>Programmer la désactivation pendant 30 jours ou supprimer immédiatement.</p>
                  {dangerOpen ? (
                    <div className="account-danger__panel">
                      <div className="account-danger__choices">
                        <button
                          type="button"
                          className={dangerChoice === "disable" ? "is-active" : ""}
                          onClick={() => setDangerChoice("disable")}
                        >
                          Désactiver
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
                        Pourquoi souhaites-tu le faire ?
                        <textarea
                          value={dangerReason}
                          onChange={(event) => setDangerReason(event.target.value)}
                          rows={3}
                          required
                          aria-required="true"
                        />
                      </label>
                      <label className="account-danger__confirm">
                        Mot de passe du compte
                        <input
                          type="password"
                          value={dangerPassword}
                          onChange={(event) => setDangerPassword(event.target.value)}
                          placeholder="Mot de passe"
                        />
                      </label>
                      {dangerError ? <span className="account-info-error">{dangerError}</span> : null}
                      <button
                        type="button"
                        className="account-danger__submit"
                        onClick={handleDangerSubmit}
                        disabled={!isDangerReady}
                      >
                        Confirmer
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <>
                <div className="settings-panel__header">
                  <h2>{activeSection?.title}</h2>
                  {activeSection?.description ? <p>{activeSection.description}</p> : null}
                </div>
                <div className="settings-options">
                  <div className="settings-option">
                    <span className="settings-option__label">Bientôt disponible</span>
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
