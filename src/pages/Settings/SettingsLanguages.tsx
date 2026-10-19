import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppLanguage } from "../../context/LanguageContext"
import type { AppLanguage } from "../../i18n"

const languageOptions: Array<{ code: AppLanguage; labelKey: string; native: string }> = [
  { code: "fr", labelKey: "common.french", native: "Français" },
  { code: "en", labelKey: "common.english", native: "English" },
]

const SettingsLanguages = () => {
  const { t } = useTranslation()
  const { language, setLanguage } = useAppLanguage()
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleLanguageChange = async (nextLanguage: AppLanguage) => {
    if (nextLanguage === language || isSaving) return
    setIsSaving(true)
    setShowConfirmation(false)
    try {
      await setLanguage(nextLanguage)
      setShowConfirmation(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="settings-section">
      <h2>{t("settings.languageTitle")}</h2>
      <p className="settings-section__intro">{t("settings.languageIntro")}</p>
      <p className="settings-section__text">{t("settings.languageHelp")}</p>

      <div className="language-form">
        <div className="language-results" role="radiogroup" aria-label={t("settings.languageTitle")}>
          {languageOptions.map((option) => {
            const isSelected = language === option.code
            return (
              <button
                key={option.code}
                type="button"
                className={isSelected ? "language-row is-selected" : "language-row"}
                role="radio"
                aria-checked={isSelected}
                disabled={isSaving}
                onClick={() => void handleLanguageChange(option.code)}
              >
                <div className="language-row__info">
                  <strong>{t(option.labelKey)}</strong>
                  <span lang={option.code}>{option.native}</span>
                </div>
                <span className={isSelected ? "language-row__check is-checked" : "language-row__check"} aria-hidden="true">
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            )
          })}
        </div>

        <p className="language-selection__note">{t("settings.detected")}</p>
        <p className="language-selection__current" aria-live="polite">
          {showConfirmation
            ? t("settings.saved")
            : t("settings.current", { language: language === "en" ? "English" : "Français" })}
        </p>
      </div>
    </div>
  )
}

export default SettingsLanguages
