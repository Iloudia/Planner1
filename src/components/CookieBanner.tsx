import { useCookieConsent } from "../context/CookieConsentContext"

const CookieBanner = () => {
  const { shouldShowBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent()

  if (!shouldShowBanner) {
    return null
  }

  return (
    <section className="cookie-banner" role="region" aria-label="Consentement aux cookies">
      <div className="cookie-banner__content">
        <h2>Cookies & confidentialite</h2>
        <p>
          Nous utilisons des cookies essentiels pour faire fonctionner Planner. Nous aimerions egalement activer les
          cookies de preferences (pour garder tes choix visuels) et de statistiques anonymes (pour comprendre l usage du
          site). Rien n est depose sans ton accord.
        </p>
        <ul className="cookie-banner__list">
          <li>
            <strong>Essentiels :</strong> connexion securisee, sauvegarde, navigation.
          </li>
          <li>
            <strong>Statistiques :</strong> mesures anonymes afin d ameliorer Planner.
          </li>
          <li>
            <strong>Preferences :</strong> garder ton theme, ta langue, tes vues favorites.
          </li>
        </ul>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="cookie-banner__action cookie-banner__action--ghost" onClick={rejectAll}>
          Refuser
        </button>
        <button type="button" className="cookie-banner__action cookie-banner__action--outline" onClick={openPreferences}>
          Personnaliser
        </button>
        <button type="button" className="cookie-banner__action cookie-banner__action--primary" onClick={acceptAll}>
          Accepter
        </button>
      </div>
    </section>
  )
}

export default CookieBanner
