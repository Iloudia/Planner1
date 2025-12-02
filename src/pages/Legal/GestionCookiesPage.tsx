import { useCookieConsent } from "../../context/CookieConsentContext"
import "./GestionCookiesPage.css"

const GestionCookiesPage = () => {
  const { acceptAll, rejectAll, openPreferences } = useCookieConsent()

  return (
    <div className="legal-page">
      <div className="page-accent-bar" aria-hidden="true" />
      <header className="legal-page__header">
        <p className="legal-page__eyebrow">Gestion des cookies</p>
        <h1 className="legal-page__title">Vos choix, notre responsabilite</h1>
        <p className="legal-page__intro">
          Aucun cookie facultatif n est depose sans votre accord. Ce centre detaille les cookies utilises sur Planner et
          vous permet de modifier vos preferences a tout moment.
        </p>
        <div className="cookie-actions">
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
      </header>

      <section className="legal-section">
        <h2 className="legal-section__title">Cookies utilises sur Planner</h2>
        <p className="legal-section__text">Chaque categorie sert a un besoin precis :</p>
        <ul className="legal-list">
          <li>
            <strong>Essentiels</strong> : connexion securisee, protection CSRF, sauvegarde locale de vos progres, gestion
            de session. Sans eux, Planner ne peut pas fonctionner.
          </li>
          <li>
            <strong>Statistiques (optionnels)</strong> : mesure anonymisee du trafic (pages visitees, types d appareils)
            pour ameliorer nos pages. Active uniquement apres acceptation.
          </li>
          <li>
            <strong>Preferences (optionnels)</strong> : memorisation du theme, de la langue et des rubriques favorites
            pour retrouver votre interface personnalisee.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Comment desactiver les cookies ?</h2>
        <p className="legal-section__text">
          Vous gardez la main via le bandeau affiché au premier chargement ou le bouton « Personnaliser » du pied de
          page. Il est egalement possible de les supprimer depuis votre navigateur :
        </p>
        <ul className="legal-list">
          <li>
            <strong>Chrome / Edge :</strong> Parametres &gt; Confidentialite et securite &gt; Cookies.
          </li>
          <li>
            <strong>Firefox :</strong> Preferences &gt; Vie privee et securite &gt; Cookies et donnees de sites.
          </li>
          <li>
            <strong>Safari (iOS/macOS) :</strong> Reglages &gt; Safari &gt; Confidentialite &gt; Bloquer tous les cookies.
          </li>
        </ul>
        <p className="legal-section__text">
          Attention : desactiver les cookies essentiels bloque l acces a l espace securise (connexion, sauvegarde des
          donnees).
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Modifier vos choix quand vous le souhaitez</h2>
        <p className="legal-section__text">
          Vous pouvez ajuster uniquement certaines categories en suivant les etapes ci-dessous :
        </p>
        <ol className="legal-steps">
          <li>Cliquez sur « Personnaliser » (bouton ci-dessus ou dans le footer).</li>
          <li>Activez/desactivez les cookies de statistiques ou de preferences.</li>
          <li>Enregistrez : votre decision est appliquee immediatement et consignee.</li>
        </ol>
        <p className="legal-section__text">
          Pour en savoir plus sur le traitement de vos donnees personnelles, consultez notre{" "}
          <a className="legal-link" href="/confidentialite">
            politique de confidentialite
          </a>
          .
        </p>
      </section>

      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default GestionCookiesPage
