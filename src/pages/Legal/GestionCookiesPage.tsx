import PageHeading from "../../components/PageHeading"
import { useCookieConsent } from "../../context/CookieConsentContext"
import heroImage from "../../assets/lindsay-piotter-dupe.jpeg"
import "./GestionCookiesPage.css"

const GestionCookiesPage = () => {
  const { acceptAll, rejectAll, openPreferences } = useCookieConsent()

  return (
    <>
      <section className="page-hero-banner" aria-hidden="true">
        <img src={heroImage} alt="" loading="lazy" />
      </section>
      <div className="page-accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Cookies" title="Gestion des cookies" />
      <div className="legal-page">
        <p className="legal-page__intro">
          Lors de la consultation de ce site, des cookies peuvent être déposés sur votre appareil (ordinateur, mobile ou
          tablette).
        </p>
        <p className="legal-section__text">
          Un cookie est un petit fichier texte qui permet à un site de fonctionner correctement, d’améliorer
          l’expérience utilisateur et de mesurer la fréquentation du site.
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

        <section className="legal-section">
          <h2 className="legal-section__title">Cookies utilisés</h2>
          <p className="legal-section__text">Ce site utilise les types de cookies suivants :</p>
          <ul className="legal-list">
            <li>
              <strong>Cookies nécessaires</strong> — Ces cookies sont indispensables au bon fonctionnement du site. Ils ne
              peuvent pas être désactivés.
            </li>
            <li>
              <strong>Cookies de mesure d’audience</strong> — Ils permettent de comprendre comment le site est utilisé
              (pages consultées, temps de navigation, etc.) afin d’améliorer son contenu et son fonctionnement.
            </li>
            <li>
              <strong>Cookies de personnalisation (le cas échéant)</strong> — Ils permettent d’adapter l’affichage ou
              certaines fonctionnalités selon vos préférences.
            </li>
          </ul>
          <p className="legal-section__text">
            Certains cookies peuvent être déposés par des services tiers utilisés sur le site (outils de statistiques,
            hébergement, etc.).
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Consentement</h2>
          <p className="legal-section__text">
            Lors de votre première visite, un bandeau vous informe de l’utilisation des cookies et vous permet d’accepter,
            refuser ou personnaliser votre choix. Votre consentement peut être modifié ou retiré à tout moment.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Durée de conservation</h2>
          <p className="legal-section__text">
            Les cookies sont conservés pour une durée maximale de 13 mois, conformément à la réglementation en vigueur.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Gestion des cookies</h2>
          <p className="legal-section__text">
            Vous pouvez à tout moment configurer votre navigateur pour accepter ou refuser les cookies, ou supprimer les
            cookies déjà enregistrés.
          </p>
          <p className="legal-section__text">
            Pour plus d’informations sur la gestion des cookies selon votre navigateur, vous pouvez consulter la
            documentation officielle de celui-ci.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Comment désactiver les cookies ?</h2>
          <p className="legal-section__text">
            Vous gardez la main via le bandeau affiché au premier chargement ou le bouton « Personnaliser » du pied de
            page. Il est également possible de les supprimer depuis votre navigateur :
          </p>
          <p className="legal-section__text">
            Pour désactiver manuellement les cookies depuis ton navigateur, rends-toi dans les paramètres, ouvre la rubrique
            de gestion des cookies puis désactive ceux que tu ne souhaites pas conserver. Chaque navigateur propose un
            chemin légèrement différent, mais cette option est toujours accessible depuis le menu principal.
          </p>
          <p className="legal-section__text">
            Attention : désactiver les cookies essentiels bloque l’accès à l’espace sécurisé (connexion, sauvegarde des
            données).
          </p>
        </section>
      </div>
      <div className="page-footer-bar" aria-hidden="true" />
    </>
  )
}

export default GestionCookiesPage
