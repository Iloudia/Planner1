import { useEffect, useState } from "react"
import { useCookieConsent } from "../context/CookieConsentContext"
import { useTranslation } from "react-i18next"

const CookiePreferencesModal = () => {
  const { t } = useTranslation()
  const { isPreferenceCenterOpen, closePreferences, preferences, saveCustomPreferences, acceptAll, rejectAll } =
    useCookieConsent()
  const [preferencesEnabled, setPreferencesEnabled] = useState(preferences.preferences)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(preferences.analytics)

  useEffect(() => {
    if (isPreferenceCenterOpen) {
      setPreferencesEnabled(preferences.preferences)
      setAnalyticsEnabled(preferences.analytics)
    }
  }, [isPreferenceCenterOpen, preferences.analytics, preferences.preferences])

  useEffect(() => {
    if (!isPreferenceCenterOpen) return
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePreferences()
      }
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [isPreferenceCenterOpen, closePreferences])

  if (!isPreferenceCenterOpen) {
    return null
  }

  const handleSave = () => {
    saveCustomPreferences({ preferences: preferencesEnabled, analytics: analyticsEnabled })
  }

  return (
    <div className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
      <div className="cookie-modal__backdrop" onClick={closePreferences} aria-hidden="true" />
      <div className="cookie-modal__panel">
        <header className="cookie-modal__header">
          <div>
            <h2 id="cookie-modal-title">{t("cookies.modalTitle")}</h2>
            <p>{t("cookies.modalIntro")}</p>
          </div>
          <button type="button" className="modal__close" aria-label={t("common.close")} onClick={closePreferences}>
            ×
          </button>
        </header>

        <div className="cookie-modal__groups">
          <article className="cookie-modal__group">
            <div>
              <h3 className="cookie-modal__group-title">{t("cookies.essentialActive")}</h3>
              <p className="cookie-modal__group-text">{t("cookies.essentialDetail")}</p>
            </div>
            <div className="cookie-modal__switch cookie-modal__switch--locked">
              <span>{t("cookies.activePlural")}</span>
            </div>
          </article>

          <article className="cookie-modal__group">
            <div>
              <h3 className="cookie-modal__group-title">{t("cookies.analytics")}</h3>
              <p className="cookie-modal__group-text">{t("cookies.analyticsDetail")}</p>
            </div>
            <label className="cookie-modal__switch">
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(event) => setAnalyticsEnabled(event.target.checked)}
              />
              <span>{analyticsEnabled ? t("cookies.active") : t("cookies.disabled")}</span>
            </label>
          </article>

          <article className="cookie-modal__group">
            <div>
              <h3 className="cookie-modal__group-title">{t("cookies.preferences")}</h3>
              <p className="cookie-modal__group-text">{t("cookies.preferencesDetail")}</p>
            </div>
            <label className="cookie-modal__switch">
              <input
                type="checkbox"
                checked={preferencesEnabled}
                onChange={(event) => setPreferencesEnabled(event.target.checked)}
              />
              <span>{preferencesEnabled ? t("cookies.active") : t("cookies.disabled")}</span>
            </label>
          </article>
        </div>

        <div className="cookie-modal__actions">
          <button type="button" className="cookie-banner__action cookie-banner__action--ghost sport-cancel-button-match" onClick={rejectAll}>
            {t("cookies.rejectAll")}
          </button>
          <button type="button" className="cookie-banner__action cookie-banner__action--outline sport-cancel-button-match" onClick={acceptAll}>
            {t("cookies.acceptAll")}
          </button>
          <button type="button" className="cookie-banner__action cookie-banner__action--primary sport-workout-button-match" onClick={handleSave}>
            {t("cookies.save")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookiePreferencesModal
