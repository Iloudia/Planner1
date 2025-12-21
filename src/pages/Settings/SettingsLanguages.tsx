import { FormEvent, useEffect, useMemo, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"

const LANGUAGE_STORAGE_KEY = "planner.language.preference"

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

  const handleSave = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedLanguage) {
      return
    }
    setSavedLanguage(selectedLanguage)
    try {
      localStorage.setItem(storageKey, selectedLanguage)
    } catch {
      // ignore storage errors
    }
  }

  const handleCancel = () => {
    setSelectedLanguage(savedLanguage)
    setSearchTerm("")
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
            <p className="language-empty">Aucune langue ne correspond a votre recherche.</p>
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
          <button type="button" className="language-actions__secondary" onClick={handleCancel}>
            Annuler
          </button>
          <button type="submit" className="language-actions__primary" disabled={!selectedLanguage || selectedLanguage === savedLanguage}>
            Suivant
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsLanguages
