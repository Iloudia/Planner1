import { useCookieConsent } from "../context/CookieConsentContext"

const CookieBanner = () => {
  const { shouldShowBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent()

  if (!shouldShowBanner) {
    return null
  }

  return (
    <section className="cookie-banner" role="region" aria-label="Consentement aux cookies">
      <div className="cookie-banner__content">
        <h2>Cookies & confidentialité</h2>
        <p>
          Nous utilisons des cookies essentiels pour faire fonctionner Me&rituals. Nous aimerions également activer les
          cookies de préférences (pour garder tes choix visuels) et de statistiques anonymes (pour comprendre l’usage du
          site). Rien n’est déposé sans ton accord.
        </p>
        <ul className="cookie-banner__list">
          <li>
            <strong>Essentiels :</strong> connexion sécurisée, sauvegarde, navigation.
          </li>
          <li>
            <strong>Statistiques :</strong> mesures anonymes afin d’améliorer le site.
          </li>
          <li>
            <strong>Préférences :</strong> garder ton thème, ta langue, tes vues favorites.
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