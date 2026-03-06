import { useEffect, useState } from "react"
import { useCookieConsent } from "../context/CookieConsentContext"

const CookiePreferencesModal = () => {
  const { isPreferenceCenterOpen, closePreferences, preferences, saveCustomPreferences, acceptAll, rejectAll } =
    useCookieConsent()
  const [preferencesEnabled, setPreferencesEnabled] = useState(preferences.preferences)

  useEffect(() => {
    if (isPreferenceCenterOpen) {
      setPreferencesEnabled(preferences.preferences)
    }
  }, [isPreferenceCenterOpen, preferences.preferences])

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
    saveCustomPreferences({ preferences: preferencesEnabled })
  }

  return (
    <div className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
      <div className="cookie-modal__backdrop" onClick={closePreferences} aria-hidden="true" />
      <div className="cookie-modal__panel">
        <header className="cookie-modal__header">
          <div>
            <p className="cookie-modal__eyebrow">Centre de preferences</p>
            <h2 id="cookie-modal-title">Choisis les cookies que tu acceptes</h2>
            <p>Les cookies essentiels sont toujours actifs pour des raisons de securite.</p>
          </div>
          <button type="button" className="modal__close" aria-label="Fermer" onClick={closePreferences}>
            ×
          </button>
        </header>

        <div className="cookie-modal__groups">
          <article className="cookie-modal__group">
            <div>
              <p className="cookie-modal__group-title">Essentiels (toujours actifs)</p>
              <p className="cookie-modal__group-text">
                Acces securise, authentification, conservation de tes parametres systeme. Impossible de les desactiver.
              </p>
            </div>
            <div className="cookie-modal__switch cookie-modal__switch--locked">
              <span>Actifs</span>
            </div>
          </article>

          <article className="cookie-modal__group">
            <div>
              <p className="cookie-modal__group-title">Preferences</p>
              <p className="cookie-modal__group-text">
                Retiennent tes themes, ta langue et les dernieres vues consultees pour personnaliser ton espace.
              </p>
            </div>
            <label className="cookie-modal__switch">
              <input
                type="checkbox"
                checked={preferencesEnabled}
                onChange={(event) => setPreferencesEnabled(event.target.checked)}
              />
              <span>{preferencesEnabled ? "Actif" : "Desactive"}</span>
            </label>
          </article>
        </div>

        <div className="cookie-modal__actions">
          <button type="button" className="cookie-banner__action cookie-banner__action--ghost" onClick={rejectAll}>
            Refuser tout
          </button>
          <button type="button" className="cookie-banner__action cookie-banner__action--outline" onClick={acceptAll}>
            Accepter tout
          </button>
          <button type="button" className="cookie-banner__action cookie-banner__action--primary" onClick={handleSave}>
            Enregistrer mes choix
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookiePreferencesModal
