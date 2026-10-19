import { useCookieConsent } from "../context/CookieConsentContext"
import { useTranslation } from "react-i18next"

const CookieBanner = () => {
  const { t } = useTranslation()
  const { shouldShowBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent()

  if (!shouldShowBanner) {
    return null
  }

  return (
    <>
      <div className="cookie-banner__backdrop" aria-hidden="true" />
      <section className="cookie-banner" role="region" aria-label={t("cookies.consent")}>
        <div className="cookie-banner__content">
          <h2>{t("cookies.title")}</h2>
          <p>{t("cookies.description")}</p>
          <ul className="cookie-banner__list">
            <li>
              <strong>{t("cookies.essentialLabel")}</strong> {t("cookies.essentialShort")}
            </li>
            <li>
              <strong>{t("cookies.preferencesLabel")}</strong> {t("cookies.preferencesShort")}
            </li>
            <li>
              <strong>{t("cookies.analyticsLabel")}</strong> {t("cookies.analyticsShort")}
            </li>
          </ul>
        </div>
        <div className="cookie-banner__actions">
          <button type="button" className="cookie-banner__action cookie-banner__action--ghost sport-cancel-button-match" onClick={rejectAll}>
            {t("cookies.reject")}
          </button>
          <button type="button" className="cookie-banner__action cookie-banner__action--outline sport-cancel-button-match" onClick={openPreferences}>
            {t("cookies.customize")}
          </button>
          <button type="button" className="cookie-banner__action cookie-banner__action--primary sport-workout-button-match" onClick={acceptAll}>
            {t("cookies.accept")}
          </button>
        </div>
      </section>
    </>
  )
}

export default CookieBanner
