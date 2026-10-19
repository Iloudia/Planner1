import { useTranslation } from "react-i18next"
import { useAppLanguage } from "../context/LanguageContext"

type LanguageSwitcherProps = {
  className?: string
}

const LanguageSwitcher = ({ className = "" }: LanguageSwitcherProps) => {
  const { t } = useTranslation()
  const { language, setLanguage } = useAppLanguage()

  return (
    <div className={`language-switcher ${className}`.trim()} aria-label={t("header.language")}>
      <button
        type="button"
        className={language === "fr" ? "is-active" : ""}
        aria-pressed={language === "fr"}
        onClick={() => void setLanguage("fr")}
      >
        FR
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={language === "en" ? "is-active" : ""}
        aria-pressed={language === "en"}
        onClick={() => void setLanguage("en")}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher
