import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"

const DISPLAY_STORAGE_KEY = "planner.display.preferences"

type BackgroundTone = "light" | "dark"

type DisplayPreferences = {
  fontScale: number
  backgroundTone: BackgroundTone
}

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

const SettingsDisplay = () => {
  const { userEmail } = useAuth()
  const storageKey = useMemo(() => buildUserScopedKey(userEmail, DISPLAY_STORAGE_KEY), [userEmail])
  const [preferences, setPreferences] = useState<DisplayPreferences>(() => ({
    fontScale: 1,
    backgroundTone: "light",
  }))

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as Partial<DisplayPreferences>
      setPreferences((prev) => ({
        fontScale: typeof parsed.fontScale === "number" ? parsed.fontScale : prev.fontScale,
        backgroundTone: parsed.backgroundTone === "dark" ? "dark" : prev.backgroundTone,
      }))
    } catch {
      // ignore malformed storage
    }
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences))
    } catch {
      // ignore quota errors
    }
  }, [preferences, storageKey])

  useEffect(() => {
    document.documentElement.style.setProperty("--user-font-scale", preferences.fontScale.toString())
    document.documentElement.dataset.backgroundTone = preferences.backgroundTone
  }, [preferences])

  const currentFontLabel = useMemo(() => {
    const option = FONT_SCALE_OPTIONS.find((choice) => choice.value === preferences.fontScale)
    return option?.label ?? "M"
  }, [preferences.fontScale])

  return (
    <div className="settings-section">
      <h2>Affichage</h2>
      <p className="settings-section__intro">Adapte la lecture et l ambiance visuelle de Planner.</p>

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
              className={preferences.fontScale === option.value ? "font-scale-option is-active" : "font-scale-option"}
              onClick={() => setPreferences((prev) => ({ ...prev, fontScale: option.value }))}
              aria-pressed={preferences.fontScale === option.value}
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
            <h3>Couleur</h3>
            <p>Le choix fin des couleurs arrivera tres vite.</p>
          </div>
        </header>
        <div className="color-placeholder">
          <span>Disponible prochainement</span>
        </div>
      </section>

      <section className="settings-display-group">
        <header className="settings-display-group__header">
          <div>
            <h3>Arriere-plan</h3>
            <p>Opte pour une ambiance claire ou plus sombre.</p>
          </div>
        </header>
        <div className="background-tone-selector" role="group" aria-label="Choisir le ton de l arriere-plan">
          {BACKGROUND_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={preferences.backgroundTone === option.id ? "tone-option is-active" : "tone-option"}
              onClick={() => setPreferences((prev) => ({ ...prev, backgroundTone: option.id }))}
              aria-pressed={preferences.backgroundTone === option.id}
            >
              <span className="tone-option__label">{option.label}</span>
              <span className="tone-option__description">{option.description}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default SettingsDisplay
