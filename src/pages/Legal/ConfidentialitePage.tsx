import { useEffect } from "react"
import PageHeading from "../../components/PageHeading"
import "./ConfidentialitePage.css"

const ConfidentialitePage = () => {
  useEffect(() => {
    document.body.classList.add("legal-page--lux")
    return () => {
      document.body.classList.remove("legal-page--lux")
    }
  }, [])

  return (
  <>
      <PageHeading eyebrow="ConfidentialitÃ©" title="Politique de confidentialitÃ©" className="confidentialite-page__header" />
    <div className="legal-page">
      <p className="legal-page__intro">
        La prÃ©sente politique de confidentialitÃ© a pour objectif dâ€™informer les utilisateurs du site sur la maniÃ¨re dont
        leurs donnÃ©es personnelles sont collectÃ©es, utilisÃ©es et protÃ©gÃ©es.
      </p>

      <section className="legal-section">
        <h2 className="legal-section__title">Responsable du traitement</h2>
        <p className="legal-section__text">
          Le responsable du traitement des donnÃ©es est [Ton nom / PrÃ©nom], Ã©ditrice du site [Nom du site]. Pour toute
          question relative aux donnÃ©es personnelles, vous pouvez contacter : [email de contact].
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">DonnÃ©es collectÃ©es</h2>
        <p className="legal-section__text">
          Selon lâ€™utilisation du site, les donnÃ©es suivantes peuvent Ãªtre collectÃ©es :
        </p>
        <ul className="legal-list">
          <li>prÃ©nom</li>
          <li>adresse email</li>
          <li>messages envoyÃ©s via les formulaires</li>
          <li>donnÃ©es de navigation (cookies)</li>
          <li>informations nÃ©cessaires Ã  lâ€™accÃ¨s aux services</li>
        </ul>
        <p className="legal-section__text">
          Dans le cadre de lâ€™achat de produits (ebooks ou autres contenus payants), certaines donnÃ©es peuvent Ãªtre
          collectÃ©es Ã  des fins de gestion de commande. Les donnÃ©es bancaires ne sont jamais stockÃ©es par le site et sont
          traitÃ©es exclusivement par des prestataires de paiement sÃ©curisÃ©s.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">FinalitÃ© de la collecte</h2>
        <p className="legal-section__text">
          Les donnÃ©es personnelles sont collectÃ©es pour :
        </p>
        <ul className="legal-list">
          <li>permettre lâ€™accÃ¨s et lâ€™utilisation du site</li>
          <li>rÃ©pondre aux messages et demandes</li>
          <li>envoyer des contenus ou informations liÃ©es au projet</li>
          <li>gÃ©rer les commandes et la facturation</li>
          <li>amÃ©liorer le fonctionnement du site</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Base lÃ©gale</h2>
        <p className="legal-section__text">
          La collecte des donnÃ©es repose sur :
        </p>
        <ul className="legal-list">
          <li>le consentement de lâ€™utilisateur</li>
          <li>lâ€™exÃ©cution dâ€™un contrat (achat de produits)</li>
          <li>le respect dâ€™obligations lÃ©gales</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">DurÃ©e de conservation</h2>
        <p className="legal-section__text">
          Les donnÃ©es sont conservÃ©es uniquement pendant la durÃ©e nÃ©cessaire aux finalitÃ©s pour lesquelles elles sont
          collectÃ©es, et conformÃ©ment aux obligations lÃ©gales en vigueur.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Partage des donnÃ©es</h2>
        <p className="legal-section__text">
          Les donnÃ©es peuvent Ãªtre transmises Ã  des prestataires techniques (hÃ©bergement, outils dâ€™emailing, paiement,
          statistiques) uniquement dans le cadre du fonctionnement du site.
        </p>
        <p className="legal-section__text">Aucune donnÃ©e personnelle nâ€™est vendue ou cÃ©dÃ©e Ã  des tiers.</p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">SÃ©curitÃ©</h2>
        <p className="legal-section__text">
          Le site met en Å“uvre des mesures de sÃ©curitÃ© pour protÃ©ger les donnÃ©es personnelles contre tout accÃ¨s non
          autorisÃ©, perte ou divulgation.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Droits des utilisateurs</h2>
        <p className="legal-section__text">
          ConformÃ©ment Ã  la rÃ©glementation en vigueur, vous disposez des droits suivants :
        </p>
        <ul className="legal-list">
          <li>droit dâ€™accÃ¨s</li>
          <li>droit de rectification</li>
          <li>droit de suppression</li>
          <li>droit dâ€™opposition</li>
          <li>droit Ã  la limitation du traitement</li>
        </ul>
        <p className="legal-section__text">
          Pour exercer ces droits, il suffit dâ€™envoyer un email Ã  : contact@meandrituals.com
        </p>
      </section>
    </div>
</>
  )
}

export default ConfidentialitePage






