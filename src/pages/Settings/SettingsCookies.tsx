import { useEffect, useState } from "react"
import { useCookieConsent } from "../../context/CookieConsentContext"
import "./SettingsPage.css"

const SettingsCookies = () => {
  const { preferences, status, acceptAll, rejectAll, saveCustomPreferences } = useCookieConsent()
  const [analyticsEnabled, setAnalyticsEnabled] = useState(preferences.analytics)
  const [personalEnabled, setPersonalEnabled] = useState(preferences.preferences)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    setAnalyticsEnabled(preferences.analytics)
    setPersonalEnabled(preferences.preferences)
  }, [preferences.analytics, preferences.preferences])

  const showFeedback = (message: string) => {
    setFeedback(message)
    window.setTimeout(() => setFeedback(null), 3500)
  }

  const handleSave = () => {
    saveCustomPreferences({ analytics: analyticsEnabled, preferences: personalEnabled })
    showFeedback("Préférences cookies enregistrées")
  }

  const handleAcceptAll = () => {
    acceptAll()
    showFeedback("Tous les cookies sont maintenant activés")
  }

  const handleRejectAll = () => {
    rejectAll()
    showFeedback("Seuls les cookies essentiels restent actifs")
  }

  const hasPendingChanges = analyticsEnabled !== preferences.analytics || personalEnabled !== preferences.preferences

  return (
    <section className="settings-cookies">
      <h2>Gestion des cookies</h2>
      <p className="settings-section__intro">
        Ici tu peux ajuster l’utilisation des cookies directement depuis Planner. Les cookies essentiels sont requis pour
        la sécurité et le fonctionnement du site. Les autres sont optionnels et modifiables à tout moment.
      </p>

      <div className="cookie-cards">
        <article className="cookie-card">
          <header>
            <h3>Essentiels</h3>
            <span className="cookie-switch cookie-switch--locked">
              <input type="checkbox" checked readOnly />
              <span aria-hidden="true" />
            </span>
          </header>
          <p>Connexion sécurisée, sauvegarde locale et mémorisation des préférences indispensables.</p>
          <small>Activés en permanence pour assurer l’accès au planner.</small>
        </article>

        <article className="cookie-card">
          <header>
            <h3>Statistiques</h3>
            <label className="cookie-switch">
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(event) => setAnalyticsEnabled(event.target.checked)}
              />
              <span aria-hidden="true" />
            </label>
          </header>
          <p>
            Analyse anonyme des visites pour comprendre ce qui fonctionne, détecter les erreurs et améliorer les
            contenus.
          </p>
          <small>Sans ces cookies, nous ne suivons aucune statistique de navigation.</small>
        </article>

        <article className="cookie-card">
          <header>
            <h3>Personnalisation</h3>
            <label className="cookie-switch">
              <input
                type="checkbox"
                checked={personalEnabled}
                onChange={(event) => setPersonalEnabled(event.target.checked)}
              />
              <span aria-hidden="true" />
            </label>
          </header>
          <p>Permet d’adapter les suggestions (ex : catégories favorites, moodboard custom) et limiter les répétitions.</p>
          <small>Ils peuvent impliquer certains services partenaires (emailing, inspiration sociale).</small>
        </article>
      </div>

      <div className="cookie-actions">
        <button type="button" className="cookie-actions__ghost" onClick={handleRejectAll}>
          Tout refuser
        </button>
        <button type="button" className="cookie-actions__primary" onClick={handleSave} disabled={!hasPendingChanges}>
          Enregistrer mes choix
        </button>
        <button type="button" className="cookie-actions__outline" onClick={handleAcceptAll}>
          Tout accepter
        </button>
      </div>

      {feedback ? <p className="settings-success">{feedback}</p> : null}
      <p className="settings-note">
        Statut actuel : <strong>{status === "unknown" ? "à décider" : status}</strong>. Tu peux également gérer tes
        cookies depuis le bandeau ou le lien « Modifier mes cookies » présent en bas de page.
      </p>
    </section>
  )
}

export default SettingsCookies
