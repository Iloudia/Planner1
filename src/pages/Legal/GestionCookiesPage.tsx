import { useEffect } from "react"
import PageHeading from "../../components/PageHeading"
import { useCookieConsent } from "../../context/CookieConsentContext"
import "./GestionCookiesPage.css"

const GestionCookiesPage = () => {
  const { acceptAll, rejectAll, openPreferences } = useCookieConsent()

  useEffect(() => {
    document.body.classList.add("legal-page--lux")
    return () => {
      document.body.classList.remove("legal-page--lux")
    }
  }, [])

  return (
    <>
        <PageHeading eyebrow="Cookies" title="Gestion des cookies" className="cookies-page__header" />
      <div className="legal-page">
        <p className="legal-page__intro">
          Lors de la consultation de ce site, des cookies peuvent etre deposes sur votre appareil (ordinateur, mobile ou
          tablette).
        </p>
        <h2 className="legal-section__title">Qu'est-ce qu'un cookie ?</h2>
        <p className="legal-section__text">
          Un cookie est un petit fichier texte qui permet au site de fonctionner correctement, d ameliorer votre
          experience et, si vous l acceptez, de mesurer la frequentation.
        </p>
        <section className="legal-section">
          <h2 className="legal-section__title">Cookies utilises</h2>
          <p className="legal-section__text">Ce site utilise les types de cookies suivants :</p>
          <ul className="legal-list">
            <li>
              <strong>Cookies necessaires</strong> ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¿Ãƒâ€šÃ‚Â½ indispensables au fonctionnement du site. Ils ne peuvent pas etre
              desactives.
            </li>
            <li>
              <strong>Cookies de mesure d audience (optionnels)</strong> ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¿Ãƒâ€šÃ‚Â½ permettent de comprendre l usage du site afin
              d ameliorer son contenu et ses performances.
            </li>
            <li>
              <strong>Cookies de personnalisation (optionnels)</strong> ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¿Ãƒâ€šÃ‚Â½ retiennent vos choix (ex. langue, preferences)
              pour personnaliser l experience.
            </li>
          </ul>
          <p className="legal-section__text">
            Aucun cookie non essentiel n est depose sans votre consentement. Certains cookies peuvent etre emis par des
            services tiers (ex. outils de mesure d audience) uniquement si vous les acceptez.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Consentement</h2>
          <p className="legal-section__text">
            Lors de votre premiere visite, un bandeau vous permet d accepter, de refuser ou de personnaliser votre choix.
            Vous pouvez modifier ou retirer votre consentement ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  tout moment.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Duree de conservation</h2>
          <p className="legal-section__text">
            Les cookies sont conserves pour une duree maximale de 13 mois, conformement a la reglementation en vigueur.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Gestion des cookies</h2>
          <p className="legal-section__text">
            Pour modifier vos choix, utilisez le bouton "Personnaliser" du bandeau cookies ou cliquez sur " Personnaliser" present en bas de page. Vos preferences sont appliquees immediatement.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Comment desactiver les cookies ?</h2>
          <p className="legal-section__text">
            Vous pouvez aussi gÃƒÆ’Ã‚Â©rer les cookies depuis votre navigateur (paramÃ¨tres \u003e confidentialitÃ© \u003e cookies). Vous
            pouvez refuser ou supprimer les cookies dÃƒÆ’Ã‚Â©jÃƒÆ’Ã‚Â  enregistrÃƒÆ’Ã‚Â©s. Le chemin exact dÃƒÆ’Ã‚Â©pend de votre navigateur.
          </p>
          <p className="legal-section__text">
            Attention : dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©sactiver les cookies essentiels bloque l'accÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¨s ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  l'espace sÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â©curisÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â© (connexion, sauvegarde).
          </p>
        </section>


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
      </div>
</>
  )
}

export default GestionCookiesPage




