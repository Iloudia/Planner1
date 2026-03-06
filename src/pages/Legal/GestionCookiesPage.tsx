import { useEffect } from "react"
import PageHeading from "../../components/PageHeading"
import { Link } from "react-router-dom"
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
          Lors de la consultation de ce site, des cookies et traceurs locaux peuvent être déposés sur votre appareil
          (ordinateur, mobile ou tablette).
        </p>
        <h2 className="legal-section__title">Qu'est-ce qu'un cookie ?</h2>
        <p className="legal-section__text">
          Un cookie est un petit fichier texte qui permet au site de fonctionner correctement et d’améliorer votre
          expérience.
        </p>
        <section className="legal-section">
          <h2 className="legal-section__title">Cookies utilisés</h2>
          <p className="legal-section__text">Ce site utilise les types de cookies suivants :</p>
          <ul className="legal-list">
            <li>
              <strong>Cookies nécessaires</strong> – indispensables au fonctionnement du site. Ils ne peuvent pas être
              désactivés.
            </li>
            <li>
              <strong>Cookies de personnalisation (optionnels)</strong> – retiennent vos choix (ex. langue, préférences)
              pour personnaliser l’expérience.
            </li>
          </ul>
          <p className="legal-section__text">
            Aucun cookie non essentiel n’est déposé sans votre consentement.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Liste des cookies et traceurs</h2>
          <p className="legal-section__text">
            Ce tableau liste les principaux cookies et stockages locaux utilisés sur le site.
          </p>
          <div className="legal-table__wrap">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Finalité</th>
                  <th>Durée</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>planner.cookieConsent (stockage local)</td>
                  <td>Mémoriser vos choix de cookies</td>
                  <td>13 mois</td>
                  <td>Nécessaire</td>
                </tr>
                <tr>
                  <td>boutique.cart.v1 (stockage local)</td>
                  <td>Conserver le contenu du panier</td>
                  <td>Jusqu’à suppression</td>
                  <td>Nécessaire</td>
                </tr>
                <tr>
                  <td>planner.language.preference (stockage local)</td>
                  <td>Mémoriser la langue choisie</td>
                  <td>Jusqu’à suppression</td>
                  <td>Personnalisation</td>
                </tr>
                <tr>
                  <td>googtrans (cookie)</td>
                  <td>Préférences de traduction (Google Translate)</td>
                  <td>Session</td>
                  <td>Personnalisation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Consentement</h2>
          <p className="legal-section__text">
            Lors de votre première visite, un bandeau vous permet d’accepter, de refuser ou de personnaliser votre choix.
            Vous pouvez modifier ou retirer votre consentement à tout moment.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Durée de conservation</h2>
          <p className="legal-section__text">
            Le choix exprimé via le bandeau cookies est conservé pour une durée maximale de 13 mois. Les cookies et
            traceurs strictement nécessaires ou de personnalisation sont conservés le temps nécessaire à leur finalité
            ou jusqu’à suppression par l’utilisateur.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Gestion des cookies</h2>
          <p className="legal-section__text">
            Pour modifier vos choix, utilisez le bouton "Personnaliser" du bandeau cookies ou cliquez sur "Personnaliser" présent en bas de page. Vos préférences sont appliquées immédiatement.
          </p>
          <p className="legal-section__text">
            Pour plus d’informations sur le traitement des données personnelles, consultez la{" "}
            <Link to="/confidentialite" className="legal-link">
              politique de confidentialité
            </Link>
            .
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Comment désactiver les cookies ?</h2>
          <p className="legal-section__text">
            Vous pouvez aussi gérer les cookies depuis votre navigateur (paramètres &gt; confidentialité &gt; cookies). Vous
            pouvez refuser ou supprimer les cookies déjà enregistrés. Le chemin exact dépend de votre navigateur.
          </p>
          <p className="legal-section__text">
            Attention : désactiver les cookies essentiels bloque l'accès à l'espace sécurisé (connexion, sauvegarde).
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
