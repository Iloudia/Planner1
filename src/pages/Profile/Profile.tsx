import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendEmailVerification } from "firebase/auth"
import { useAuth } from "../../context/AuthContext"
import { useUserProfilePhoto } from "../../hooks/useUserProfilePhoto"
import { fetchApi } from "../../utils/apiUrl"
import { buildUserScopedKey } from "../../utils/userScopedKey"
import { auth } from "../../utils/firebase"
import { applyPageBackground, DEFAULT_PAGE_BACKGROUND, normalizePageBackground } from "../../utils/pageBackground"
import { HOME_CARD_THEMES, normalizeHomeCardTheme, type HomeCardTheme } from "../../utils/homeCardTheme"
import { CALENDAR_EVENT_CATEGORIES, CALENDAR_EVENT_PALETTES, normalizeCalendarEventPalette, type CalendarEventPaletteId } from "../../utils/calendarEventPalette"
import { applyColorMode, COLOR_MODES, normalizeColorMode, type ColorMode } from "../../utils/colorMode"
import { HOME_WELCOME_FONTS, normalizeHomeWelcomeFont, type HomeWelcomeFont } from "../../utils/homeWelcomeFont"
import { deleteMedia } from "../../services/media/api"
import { getPageBackgroundPreset, pageBackgroundPresets, type PageBackgroundPreset } from "../../data/pageBackgroundPresets"
import defaultProfilePhoto from "../../assets/katie-huber-rhoades-dupe (1).webp"
import MediaImage from "../../components/MediaImage"
import PageHeading from "../../components/PageHeading"
import PageLoader from "../../components/PageLoader"
import SettingsLanguages from "../Settings/SettingsLanguages"
import type { AppLanguage } from "../../i18n"
import { useTranslation } from "react-i18next"
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
  preferences?: {
    pageBackground?: string
    pageBackgroundPresetId?: string
    pageBackgroundImageUrl?: string
    pageBackgroundImagePath?: string
    homeCardTheme?: HomeCardTheme
    calendarEventPalette?: CalendarEventPaletteId
    colorMode?: ColorMode
    homeWelcomeMessage?: string
    homeWelcomeFont?: HomeWelcomeFont
    interfaceLanguage?: AppLanguage
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

const MS_IN_DAY = 1000 * 60 * 60 * 24

const getProfileBackgroundImage = (profile: ProfileData) =>
  getPageBackgroundPreset(profile.preferences?.pageBackgroundPresetId)?.src
  || profile.preferences?.pageBackgroundImageUrl
  || ""

const ProfilePage = () => {
  const { t, i18n } = useTranslation()
  const { isAuthReady, userEmail, userProfile, previewUserProfile, updateUserProfile, changePassword, deactivateAccount, deleteAccount, verifyPassword } = useAuth()
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
  const [personalizationStatus, setPersonalizationStatus] = useState<"" | "saving" | "saved" | "error">("")
  const [backgroundImageError, setBackgroundImageError] = useState("")
  const [backgroundImageStatus, setBackgroundImageStatus] = useState<"" | "saving" | "saved">("")
  const [isBackgroundImageBusy, setIsBackgroundImageBusy] = useState(false)
  const [cardThemeStatus, setCardThemeStatus] = useState<"" | "saving" | "saved" | "error">("")
  const [calendarPaletteStatus, setCalendarPaletteStatus] = useState<"" | "saving" | "saved" | "error">("")
  const [colorModeStatus, setColorModeStatus] = useState<"" | "saving" | "saved" | "error">("")
  const [welcomeFontStatus, setWelcomeFontStatus] = useState<"" | "saving" | "saved" | "error">("")
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

  const settingsSections = useMemo(() => [
    { id: "account", title: t("profile.accountTitle"), description: t("profile.accountDescription") },
    { id: "personalization", title: t("profile.personalizationTitle"), description: t("profile.personalizationDescription") },
    { id: "languages", title: t("profile.languagesTitle"), description: t("profile.languagesDescription") },
  ], [i18n.resolvedLanguage, t])

  const activeSection = useMemo(
    () => settingsSections.find((section) => section.id === activeId) ?? settingsSections[0],
    [activeId, settingsSections]
  )

  useEffect(() => {
    setProfileData({
      personalInfo: userProfile.personalInfo ?? {},
      identityInfo: userProfile.identityInfo ?? {},
      preferences: userProfile.preferences ?? {},
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
      preferences: next.preferences ?? {},
    })
  }

  const handlePageBackgroundChange = async (value: string) => {
    const pageBackground = normalizePageBackground(value)
    const nextProfileData = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        pageBackground,
      },
    }

    setProfileData(nextProfileData)
    applyPageBackground(pageBackground, getProfileBackgroundImage(nextProfileData))
    setPersonalizationStatus("saving")

    try {
      await persistProfileData(nextProfileData)
      applyPageBackground(pageBackground, getProfileBackgroundImage(nextProfileData))
      setPersonalizationStatus("saved")
    } catch {
      setPersonalizationStatus("error")
    }
  }

  const handleHomeCardThemeChange = async (homeCardTheme: HomeCardTheme) => {
    if (normalizeHomeCardTheme(profileData.preferences?.homeCardTheme) === homeCardTheme) return

    const previousProfileData = profileData
    const nextProfileData = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        homeCardTheme,
      },
    }

    setProfileData(nextProfileData)
    previewUserProfile(nextProfileData)
    setCardThemeStatus("saving")

    try {
      await persistProfileData(nextProfileData)
      setCardThemeStatus("saved")
    } catch {
      setProfileData(previousProfileData)
      previewUserProfile(previousProfileData)
      setCardThemeStatus("error")
    }
  }

  const handleCalendarPaletteChange = async (calendarEventPalette: CalendarEventPaletteId) => {
    if (normalizeCalendarEventPalette(profileData.preferences?.calendarEventPalette) === calendarEventPalette) return

    const previousProfileData = profileData
    const nextProfileData = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        calendarEventPalette,
      },
    }

    setProfileData(nextProfileData)
    previewUserProfile(nextProfileData)
    setCalendarPaletteStatus("saving")

    try {
      await persistProfileData(nextProfileData)
      setCalendarPaletteStatus("saved")
    } catch {
      setProfileData(previousProfileData)
      previewUserProfile(previousProfileData)
      setCalendarPaletteStatus("error")
    }
  }

  const handleColorModeChange = async (colorMode: ColorMode) => {
    if (normalizeColorMode(profileData.preferences?.colorMode) === colorMode) return

    const previousProfileData = profileData
    const previousMode = normalizeColorMode(previousProfileData.preferences?.colorMode)
    const nextProfileData = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        colorMode,
      },
    }

    setProfileData(nextProfileData)
    setColorModeStatus("saving")
    applyColorMode(colorMode)

    try {
      await persistProfileData(nextProfileData)
      setColorModeStatus("saved")
    } catch {
      setProfileData(previousProfileData)
      applyColorMode(previousMode)
      setColorModeStatus("error")
    }
  }

  const handleWelcomeFontChange = async (homeWelcomeFont: HomeWelcomeFont) => {
    if (normalizeHomeWelcomeFont(profileData.preferences?.homeWelcomeFont) === homeWelcomeFont) return

    const previousProfileData = profileData
    const nextProfileData = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        homeWelcomeFont,
      },
    }

    setProfileData(nextProfileData)
    previewUserProfile(nextProfileData)
    setWelcomeFontStatus("saving")

    try {
      await persistProfileData(nextProfileData)
      setWelcomeFontStatus("saved")
    } catch {
      setProfileData(previousProfileData)
      previewUserProfile(previousProfileData)
      setWelcomeFontStatus("error")
    }
  }

  const handleBackgroundImageDelete = async () => {
    const previousProfileData = profileData
    const previousPath = profileData.preferences?.pageBackgroundImagePath
    const nextProfileData = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        pageBackground: normalizePageBackground(profileData.preferences?.pageBackground),
        pageBackgroundPresetId: "",
        pageBackgroundImageUrl: "",
        pageBackgroundImagePath: "",
      },
    }

    setIsBackgroundImageBusy(true)
    setBackgroundImageError("")
    setBackgroundImageStatus("saving")
    applyPageBackground(nextProfileData.preferences.pageBackground)

    try {
      await persistProfileData(nextProfileData)
      applyPageBackground(nextProfileData.preferences.pageBackground)
      if (previousPath) {
        void deleteMedia(previousPath).catch(() => undefined)
      }
      setBackgroundImageStatus("saved")
    } catch (error) {
      setProfileData(previousProfileData)
      applyPageBackground(
        previousProfileData.preferences?.pageBackground,
        getProfileBackgroundImage(previousProfileData),
      )
      setBackgroundImageError(error instanceof Error ? error.message : "Impossible de supprimer cette image")
      setBackgroundImageStatus("")
    } finally {
      setIsBackgroundImageBusy(false)
    }
  }

  const handleBackgroundPresetSelect = async (preset: PageBackgroundPreset) => {
    if (profileData.preferences?.pageBackgroundPresetId === preset.id || isBackgroundImageBusy) return

    const previousProfileData = profileData
    const previousPath = profileData.preferences?.pageBackgroundImagePath
    const nextProfileData = {
      ...profileData,
      preferences: {
        ...profileData.preferences,
        pageBackground: normalizePageBackground(profileData.preferences?.pageBackground),
        pageBackgroundPresetId: preset.id,
        pageBackgroundImageUrl: "",
        pageBackgroundImagePath: "",
      },
    }

    setIsBackgroundImageBusy(true)
    setBackgroundImageError("")
    setBackgroundImageStatus("saving")
    setProfileData(nextProfileData)
    applyPageBackground(nextProfileData.preferences.pageBackground, preset.src)

    try {
      await persistProfileData(nextProfileData)
      applyPageBackground(nextProfileData.preferences.pageBackground, preset.src)
      if (previousPath) {
        void deleteMedia(previousPath).catch(() => undefined)
      }
      setBackgroundImageStatus("saved")
    } catch (error) {
      setProfileData(previousProfileData)
      applyPageBackground(
        previousProfileData.preferences?.pageBackground,
        getProfileBackgroundImage(previousProfileData),
      )
      setBackgroundImageError(error instanceof Error ? error.message : "Impossible d’enregistrer cette image")
      setBackgroundImageStatus("")
    } finally {
      setIsBackgroundImageBusy(false)
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
  const selectedBackgroundPreset = getPageBackgroundPreset(profileData.preferences?.pageBackgroundPresetId)
  const activeBackgroundImage = selectedBackgroundPreset?.src || profileData.preferences?.pageBackgroundImageUrl || ""

  if (isProfileLoading) {
    return (
      <PageLoader />
    )
  }

  return (
    <>
      <PageHeading eyebrow={t("settings.eyebrow")} title={t("settings.title")} />
      <div className="content-page settings-page">
        <section className="settings-layout">
          <nav className="settings-nav" aria-label={t("profile.sectionsLabel")}>
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
            ) : activeSection?.id === "personalization" ? (
              <div className="settings-section personalization-settings">
                <div className="settings-panel__header">
                  <h2>{activeSection.title}</h2>
                  <p>{activeSection.description}</p>
                </div>
                <section className="settings-display-group personalization-background" aria-labelledby="page-background-heading">
                  <div className="settings-display-group__header">
                    <div>
                      <h3 id="page-background-heading">Couleur de fond</h3>
                      <p>Cette couleur sera appliquée à l’arrière-plan de toutes tes pages.</p>
                    </div>
                  </div>
                  <div className="personalization-color">
                    <label className="personalization-color__picker">
                      <input
                        type="color"
                        value={normalizePageBackground(profileData.preferences?.pageBackground)}
                        onInput={(event) => applyPageBackground(
                          event.currentTarget.value,
                          getProfileBackgroundImage(profileData),
                        )}
                        onChange={(event) => void handlePageBackgroundChange(event.target.value)}
                        aria-label="Choisir la couleur de fond des pages"
                      />
                      <span aria-hidden="true" style={{ backgroundColor: normalizePageBackground(profileData.preferences?.pageBackground) }} />
                    </label>
                    <output className="personalization-color__value" aria-live="polite">
                      {normalizePageBackground(profileData.preferences?.pageBackground).toUpperCase()}
                    </output>
                    <button
                      type="button"
                      className="personalization-color__reset"
                      onClick={() => void handlePageBackgroundChange(DEFAULT_PAGE_BACKGROUND)}
                      disabled={normalizePageBackground(profileData.preferences?.pageBackground) === DEFAULT_PAGE_BACKGROUND}
                    >
                      Réinitialiser
                    </button>
                  </div>
                  {personalizationStatus === "saving" ? <p className="personalization-color__status">Enregistrement…</p> : null}
                  {personalizationStatus === "saved" ? <p className="personalization-color__status is-success">Couleur enregistrée</p> : null}
                  {personalizationStatus === "error" ? <p className="personalization-color__status is-error">Impossible d’enregistrer la couleur</p> : null}
                </section>
                <section className="settings-display-group personalization-background-image" aria-labelledby="page-background-image-heading">
                  <div className="settings-display-group__header">
                    <div>
                      <h3 id="page-background-image-heading">Image de fond</h3>
                      <p>Choisis une image qui s’adaptera à la taille de l’écran.</p>
                    </div>
                  </div>
                  <div className="personalization-library">
                    <div className="personalization-library__header">
                      <h4>Bibliothèque</h4>
                      <p>Choisis l’une des ambiances proposées.</p>
                    </div>
                    <div className="personalization-library__grid" role="group" aria-label="Images de fond prédéfinies">
                      {pageBackgroundPresets.map((preset) => {
                        const isSelected = selectedBackgroundPreset?.id === preset.id
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            className={`personalization-library__item${isSelected ? " is-selected" : ""}`}
                            aria-pressed={isSelected}
                            onClick={() => void handleBackgroundPresetSelect(preset)}
                            disabled={isBackgroundImageBusy}
                          >
                            <img src={preset.src} alt="" loading="lazy" decoding="async" />
                            <span className="personalization-library__name">{preset.name}</span>
                            {isSelected ? <span className="personalization-library__check" aria-hidden="true">✓</span> : null}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {activeBackgroundImage ? (
                    <div className="personalization-image__actions">
                      <button
                        type="button"
                        className="is-ghost"
                        onClick={() => void handleBackgroundImageDelete()}
                        disabled={isBackgroundImageBusy}
                      >
                        Retirer l’image de fond
                      </button>
                    </div>
                  ) : null}
                  {backgroundImageStatus === "saving" ? <p className="personalization-color__status">Enregistrement…</p> : null}
                  {backgroundImageStatus === "saved" ? <p className="personalization-color__status is-success">Image enregistrée</p> : null}
                  {backgroundImageError ? <p className="personalization-color__status is-error">{backgroundImageError}</p> : null}
                </section>
                <section className="settings-display-group personalization-card-theme" aria-labelledby="home-card-theme-heading">
                  <div className="settings-display-group__header">
                    <div>
                      <h3 id="home-card-theme-heading">Thème des cartes</h3>
                      <p>Choisis l’apparence des cartes principales de ta page d’accueil.</p>
                    </div>
                  </div>
                  <div className="personalization-card-theme__grid" role="radiogroup" aria-label="Thème des cartes de la page d’accueil">
                    {HOME_CARD_THEMES.map((theme) => {
                      const isSelected = normalizeHomeCardTheme(profileData.preferences?.homeCardTheme) === theme.id
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`personalization-card-theme__option personalization-card-theme__option--${theme.id}${isSelected ? " is-selected" : ""}`}
                          onClick={() => void handleHomeCardThemeChange(theme.id)}
                          disabled={cardThemeStatus === "saving"}
                        >
                          <span className="personalization-card-theme__preview" aria-hidden="true">
                            <span className="personalization-card-theme__preview-image" />
                            <span className="personalization-card-theme__preview-body">
                              <span />
                              <span />
                            </span>
                          </span>
                          <span className="personalization-card-theme__copy">
                            <strong>{theme.name}</strong>
                            <small>{theme.description}</small>
                          </span>
                          {isSelected ? <span className="personalization-card-theme__check" aria-hidden="true">✓</span> : null}
                        </button>
                      )
                    })}
                  </div>
                  {cardThemeStatus === "saving" ? <p className="personalization-color__status">Enregistrement…</p> : null}
                  {cardThemeStatus === "saved" ? <p className="personalization-color__status is-success">Thème enregistré</p> : null}
                  {cardThemeStatus === "error" ? <p className="personalization-color__status is-error">Impossible d’enregistrer le thème</p> : null}
                </section>
                <section className="settings-display-group personalization-welcome-font" aria-labelledby="welcome-font-heading">
                  <div className="settings-display-group__header">
                    <div>
                      <h3 id="welcome-font-heading">Typographie du message d’accueil</h3>
                      <p>Choisis la typographie utilisée pour ton message personnalisé sur la page d’accueil.</p>
                    </div>
                  </div>
                  <div className="personalization-welcome-font__grid" role="radiogroup" aria-label="Typographie du message d’accueil">
                    {HOME_WELCOME_FONTS.map((font) => {
                      const isSelected = normalizeHomeWelcomeFont(profileData.preferences?.homeWelcomeFont) === font.id
                      return (
                        <button
                          key={font.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`personalization-welcome-font__option personalization-welcome-font__option--${font.id}${isSelected ? " is-selected" : ""}`}
                          onClick={() => void handleWelcomeFontChange(font.id)}
                          disabled={welcomeFontStatus === "saving"}
                        >
                          <span className="personalization-welcome-font__preview" style={{ fontFamily: font.family }} aria-hidden="true">
                            Bonjour
                          </span>
                          <span className="personalization-welcome-font__name">{font.name}</span>
                          {isSelected ? <span className="personalization-welcome-font__check" aria-hidden="true">✓</span> : null}
                        </button>
                      )
                    })}
                  </div>
                  {welcomeFontStatus === "saving" ? <p className="personalization-color__status">Enregistrement…</p> : null}
                  {welcomeFontStatus === "saved" ? <p className="personalization-color__status is-success">Typographie enregistrée</p> : null}
                  {welcomeFontStatus === "error" ? <p className="personalization-color__status is-error">Impossible d’enregistrer la typographie</p> : null}
                </section>
                <section className="settings-display-group personalization-calendar-palette" aria-labelledby="calendar-palette-heading">
                  <div className="settings-display-group__header">
                    <div>
                      <h3 id="calendar-palette-heading">Couleurs du calendrier</h3>
                      <p>Choisis la palette utilisée pour distinguer les catégories de tes événements.</p>
                    </div>
                  </div>
                  <div className="personalization-calendar-palette__grid" role="radiogroup" aria-label="Palette des événements du calendrier">
                    {CALENDAR_EVENT_PALETTES.map((palette) => {
                      const isSelected = normalizeCalendarEventPalette(profileData.preferences?.calendarEventPalette) === palette.id
                      return (
                        <button
                          key={palette.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`personalization-calendar-palette__option${isSelected ? " is-selected" : ""}`}
                          onClick={() => void handleCalendarPaletteChange(palette.id)}
                          disabled={calendarPaletteStatus === "saving"}
                        >
                          <span className="personalization-calendar-palette__swatches" aria-hidden="true">
                            {CALENDAR_EVENT_CATEGORIES.map((category) => (
                              <span key={category} style={{ backgroundColor: palette.colors[category] }} />
                            ))}
                          </span>
                          <span className="personalization-calendar-palette__name">{palette.name}</span>
                          {isSelected ? <span className="personalization-calendar-palette__check" aria-hidden="true">✓</span> : null}
                        </button>
                      )
                    })}
                  </div>
                  <div className="personalization-calendar-palette__legend" aria-label="Ordre des couleurs">
                    {CALENDAR_EVENT_CATEGORIES.map((category) => <span key={category}>{category}</span>)}
                  </div>
                  {calendarPaletteStatus === "saving" ? <p className="personalization-color__status">Enregistrement…</p> : null}
                  {calendarPaletteStatus === "saved" ? <p className="personalization-color__status is-success">Palette enregistrée</p> : null}
                  {calendarPaletteStatus === "error" ? <p className="personalization-color__status is-error">Impossible d’enregistrer la palette</p> : null}
                </section>
                <section className="settings-display-group personalization-color-mode" aria-labelledby="color-mode-heading">
                  <div className="settings-display-group__header">
                    <div>
                      <h3 id="color-mode-heading">Mode d’affichage</h3>
                      <p>Choisis une interface claire ou sombre pour l’ensemble de ton espace.</p>
                    </div>
                  </div>
                  <div className="personalization-color-mode__options" role="radiogroup" aria-label="Mode d’affichage du site">
                    {COLOR_MODES.map((mode) => {
                      const isSelected = normalizeColorMode(profileData.preferences?.colorMode) === mode.id
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`personalization-color-mode__option personalization-color-mode__option--${mode.id}${isSelected ? " is-selected" : ""}`}
                          onClick={() => void handleColorModeChange(mode.id)}
                          disabled={colorModeStatus === "saving"}
                        >
                          <span className="personalization-color-mode__preview" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                          <span className="personalization-color-mode__copy">
                            <strong>{mode.name}</strong>
                            <small>{mode.description}</small>
                          </span>
                          {isSelected ? <span className="personalization-color-mode__check" aria-hidden="true">✓</span> : null}
                        </button>
                      )
                    })}
                  </div>
                  {colorModeStatus === "saving" ? <p className="personalization-color__status">Enregistrement…</p> : null}
                  {colorModeStatus === "saved" ? <p className="personalization-color__status is-success">Mode enregistré</p> : null}
                  {colorModeStatus === "error" ? <p className="personalization-color__status is-error">Impossible d’enregistrer le mode</p> : null}
                </section>
              </div>
            ) : activeSection?.id === "languages" ? (
              <SettingsLanguages />
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
