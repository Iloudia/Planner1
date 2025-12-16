import PageHeading from "../../components/PageHeading"
import { useCookieConsent } from "../../context/CookieConsentContext"
import "./GestionCookiesPage.css"

const GestionCookiesPage = () => {
  const { acceptAll, rejectAll, openPreferences } = useCookieConsent()

  return (
    <>
      <div className="page-accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Cookies" title="Gestion des cookies" />
      <div className="legal-page">
        <p className="legal-page__intro">
          Lors de la consultation de Planner, des cookies peuvent être déposés sur ton appareil (ordinateur, mobile ou
          tablette) pour assurer le bon fonctionnement du site et améliorer ton expérience.
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
          <h2 className="legal-section__title">Qu’est-ce qu’un cookie ?</h2>
          <p className="legal-section__text">
            Un cookie est un petit fichier texte qui permet à un site de fonctionner correctement, d’améliorer l’expérience
            utilisateur et de mesurer la fréquentation. Certains cookies proviennent directement de Planner, d’autres sont
            déposés par des services tiers (hébergement, statistiques, intégrations externes…).
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Cookies utilisés</h2>
          <p className="legal-section__text">
            Ce site utilise les types de cookies suivants. Les cookies nécessaires sont indispensables et ne peuvent pas être
            désactivés. Les autres sont optionnels et dépendent de ton consentement.
          </p>
          <ul className="legal-list">
            <li>
              <strong>Cookies nécessaires</strong> : connexion sécurisée, protection CSRF, sauvegarde locale de tes progrès et
              accès à ton espace personnel.
            </li>
            <li>
              <strong>Cookies de mesure d’audience</strong> : mesure anonyme du trafic (pages consultées, durée de navigation,
              type d’appareil) pour optimiser les contenus.
            </li>
            <li>
              <strong>Cookies de personnalisation</strong> (si activés) : mémorisation de tes préférences (thème, langue,
              catégories favorites) pour adapter l’affichage.
            </li>
          </ul>
          <p className="legal-section__text">
            Certains cookies peuvent provenir de partenaires (hébergeur, outils de statistiques, services externes). Ils ne
            sont utilisés que si tu les acceptes via le bandeau ou cette page.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Consentement et durée</h2>
          <p className="legal-section__text">
            Lors de ta première visite, un bandeau te permet d’accepter, refuser ou personnaliser le dépôt de cookies. Tu peux
            modifier ce choix à tout moment via le lien « Modifier mes cookies » en bas de page. Les préférences sont
            conservées pour une durée maximale de 13 mois conformément à la réglementation.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Gestion des cookies</h2>
          <p className="legal-section__text">
            Tu peux configurer ton navigateur pour accepter ou refuser les cookies, ou supprimer ceux déjà enregistrés. Consulte
            la documentation officielle de ton navigateur pour connaître la marche à suivre : l’option « gestion des cookies »
            est toujours accessible depuis les paramètres.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section__title">Comment desactiver les cookies ?</h2>
          <p className="legal-section__text">
            Vous gardez la main via le bandeau affiché au premier chargement ou le bouton « Personnaliser » du pied de page. Il
            est egalement possible de les supprimer depuis votre navigateur :
          </p>
          <p className="legal-section__text">
            Pour desactiver manuellement les cookies depuis ton navigateur, rends-toi dans les parametres, ouvre la rubrique de
            gestion des cookies puis desactive ceux que tu ne souhaites pas conserver. Chaque navigateur propose un chemin
            legerement different, mais cette option est toujours accessible depuis le menu principal.
          </p>
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
            Pour en savoir plus sur le traitement de vos donnees personnelles, consultez notre <a className="legal-link" href="/confidentialite">politique de confidentialite</a>.
          </p>
        </section>
      </div>
      <div className="page-footer-bar" aria-hidden="true" />
    </>
  )
}

export default GestionCookiesPage
