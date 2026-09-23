import { useCookieConsent } from "../context/CookieConsentContext"

const CookieBanner = () => {
  const { shouldShowBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent()

  if (!shouldShowBanner) {
    return null
  }

  return (
    <>
      <div className="cookie-banner__backdrop" aria-hidden="true" />
      <section className="cookie-banner" role="region" aria-label="Consentement aux cookies">
        <div className="cookie-banner__content">
          <h2>Cookies & confidentialité</h2>
          <p>
            Nous utilisons des stockages essentiels pour faire fonctionner Me&rituals. Avec ton accord, nous pouvons
            aussi mémoriser tes préférences et mesurer l’audience. Les traceurs optionnels restent désactivés par défaut.
          </p>
          <ul className="cookie-banner__list">
            <li>
              <strong>Essentiels :</strong> connexion sécurisée, sauvegarde, navigation.
            </li>
            <li>
              <strong>Préférences :</strong> garder ton thème, ta langue, tes vues favorites.
            </li>
            <li>
              <strong>Mesure d’audience :</strong> comprendre l’utilisation du site pour l’améliorer.
            </li>
          </ul>
        </div>
        <div className="cookie-banner__actions">
          <button type="button" className="cookie-banner__action cookie-banner__action--ghost sport-cancel-button-match" onClick={rejectAll}>
            Refuser
          </button>
          <button type="button" className="cookie-banner__action cookie-banner__action--outline sport-cancel-button-match" onClick={openPreferences}>
            Personnaliser
          </button>
          <button type="button" className="cookie-banner__action cookie-banner__action--primary sport-workout-button-match" onClick={acceptAll}>
            Accepter
          </button>
        </div>
      </section>
    </>
  )
}

export default CookieBanner
