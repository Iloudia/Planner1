import { FormEvent, useEffect, useMemo, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useCookieConsent } from "../../context/CookieConsentContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"

const LANGUAGE_STORAGE_KEY = "planner.language.preference"
const GOOGLE_TRANSLATE_COOKIE = "googtrans"
const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script"

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: any
  }
}

const languageCodeMap: Record<string, string> = {
  "fr-FR": "fr",
  "en-US": "en",
  "en-GB": "en",
  "es-ES": "es",
  "de-DE": "de",
  "it-IT": "it",
  "pt-BR": "pt",
  "nl-NL": "nl",
  "sv-SE": "sv",
  "hi-IN": "hi",
  "ja-JP": "ja",
  "zh-CN": "zh-CN",
  "ar-SA": "ar",
}

type LanguageOption = {
  code: string
  label: string
  native: string
}

const languageOptions: LanguageOption[] = [
  { code: "fr-FR", label: "Francais", native: "Français" },
  { code: "en-US", label: "Anglais (Etats-Unis)", native: "English" },
  { code: "en-GB", label: "Anglais (Royaume-Uni)", native: "English (UK)" },
  { code: "es-ES", label: "Espagnol", native: "Español" },
  { code: "de-DE", label: "Allemand", native: "Deutsch" },
  { code: "it-IT", label: "Italien", native: "Italiano" },
  { code: "pt-BR", label: "Portugais (Bresil)", native: "Português" },
  { code: "nl-NL", label: "Neerlandais", native: "Nederlands" },
  { code: "sv-SE", label: "Suedois", native: "Svenska" },
  { code: "hi-IN", label: "Hindi", native: "हिन्दी" },
  { code: "ja-JP", label: "Japonais", native: "日本語" },
  { code: "zh-CN", label: "Chinois (simplifie)", native: "中文" },
  { code: "ar-SA", label: "Arabe", native: "العربية" },
]

const SettingsLanguages = () => {
  const { preferences, openPreferences } = useCookieConsent()
  const { userEmail } = useAuth()
  const storageKey = useMemo(() => buildUserScopedKey(userEmail, LANGUAGE_STORAGE_KEY), [userEmail])
  const [savedLanguage, setSavedLanguage] = useState<string>("fr-FR")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("fr-FR")
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setSavedLanguage(saved)
        setSelectedLanguage(saved)
      }
    } catch {
      // ignore storage read errors
    }
  }, [storageKey])

  const filteredLanguages = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return languageOptions
    return languageOptions.filter((lang) => lang.label.toLowerCase().startsWith(term) || lang.native.toLowerCase().startsWith(term))
  }, [searchTerm])

  const ensureGoogleTranslate = () => {
    if (document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
      return
    }
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        if (!document.getElementById("google_translate_element")) {
          const container = document.createElement("div")
          container.id = "google_translate_element"
          container.className = "google-translate-element"
          document.body.appendChild(container)
        }
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement({ pageLanguage: "fr", autoDisplay: false }, "google_translate_element")
        }
      }
    }
    const script = document.createElement("script")
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    document.body.appendChild(script)
  }

  const setGoogleTranslateCookie = (language: string) => {
    const target = languageCodeMap[language] ?? language.split("-")[0]?.toLowerCase() ?? "fr"
    const value = `/fr/${target}`
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${value}; path=/;`
  }

  const clearGoogleTranslateCookie = () => {
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
  }

  const handleSave = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedLanguage) {
      return
    }
    if (!preferences.preferences && selectedLanguage !== "fr-FR") {
      openPreferences()
      return
    }
    setSavedLanguage(selectedLanguage)
    try {
      if (preferences.preferences) {
        localStorage.setItem(storageKey, selectedLanguage)
      } else {
        localStorage.removeItem(storageKey)
      }
    } catch {
      // ignore storage errors
    }
    if (selectedLanguage !== "fr-FR") {
      ensureGoogleTranslate()
      setGoogleTranslateCookie(selectedLanguage)
      window.location.reload()
      return
    }
    clearGoogleTranslateCookie()
    window.location.reload()
  }
  return (
    <div className="settings-section">
      <h2>Langues</h2>
      <p className="settings-section__intro">Selectionnez la langue</p>
      <p className="settings-section__text">
        Choisissez la ou les langues que vous souhaitez utiliser pour personnaliser votre experience.
      </p>

      <form className="language-form" onSubmit={handleSave}>
        <div className="language-search">
          <input
            type="search"
            placeholder="Rechercher une langue"
            aria-label="Rechercher une langue"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="language-results" role="listbox" aria-label="Resultats des langues disponibles">
          {filteredLanguages.length === 0 ? (
            <p className="language-empty">Aucune langue ne correspond à votre recherche.</p>
          ) : null}
          {filteredLanguages.map((language) => {
            const isSelected = selectedLanguage === language.code
            return (
              <button
                key={language.code}
                type="button"
                className={isSelected ? "language-row is-selected" : "language-row"}
                role="option"
                aria-selected={isSelected}
                onClick={() => setSelectedLanguage((prev) => (prev === language.code ? "" : language.code))}
              >
                <div className="language-row__info">
                  <strong>{language.label}</strong>
                  <span>{language.native}</span>
                </div>
                <span className={isSelected ? "language-row__check is-checked" : "language-row__check"} aria-hidden="true">
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            )
          })}
        </div>

        <div className="language-actions">
          <button type="submit" className="language-actions__confirm" disabled={!selectedLanguage || selectedLanguage === savedLanguage}>
            Confirmer
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsLanguages
