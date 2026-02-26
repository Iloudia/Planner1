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
      <PageHeading eyebrow="Confidentialité" title="Politique de confidentialité" className="confidentialite-page__header" />
    <div className="legal-page">
      <p className="legal-page__intro">
        La présente politique de confidentialité a pour objectif d’informer les utilisateurs du site sur la manière dont
        leurs données personnelles sont collectées, utilisées et protégées.
      </p>

      <section className="legal-section">
        <h2 className="legal-section__title">Responsable du traitement</h2>
        <p className="legal-section__text">
          Le responsable du traitement des données est [Ton nom / Prénom], éditrice du site [Nom du site]. Pour toute
          question relative aux données personnelles, vous pouvez contacter : [email de contact].
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Données collectées</h2>
        <p className="legal-section__text">
          Selon l’utilisation du site, les données suivantes peuvent être collectées :
        </p>
        <ul className="legal-list">
          <li>prénom</li>
          <li>adresse email</li>
          <li>messages envoyés via les formulaires</li>
          <li>données de navigation (cookies)</li>
          <li>informations nécessaires à l’accès aux services</li>
        </ul>
        <p className="legal-section__text">
          Dans le cadre de l’achat de produits (ebooks ou autres contenus payants), certaines données peuvent être
          collectées à des fins de gestion de commande. Les données bancaires ne sont jamais stockées par le site et sont
          traitées exclusivement par des prestataires de paiement sécurisés.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Finalité de la collecte</h2>
        <p className="legal-section__text">
          Les données personnelles sont collectées pour :
        </p>
        <ul className="legal-list">
          <li>permettre l’accès et l’utilisation du site</li>
          <li>répondre aux messages et demandes</li>
          <li>envoyer des contenus ou informations liées au projet</li>
          <li>gérer les commandes et la facturation</li>
          <li>améliorer le fonctionnement du site</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Base légale</h2>
        <p className="legal-section__text">
          La collecte des données repose sur :
        </p>
        <ul className="legal-list">
          <li>le consentement de l’utilisateur</li>
          <li>l’exécution d’un contrat (achat de produits)</li>
          <li>le respect d’obligations légales</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Durée de conservation</h2>
        <p className="legal-section__text">
          Les données sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles sont
          collectées, et conformément aux obligations légales en vigueur.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Partage des données</h2>
        <p className="legal-section__text">
          Les données peuvent être transmises à des prestataires techniques (hébergement, outils d’emailing, paiement,
          statistiques) uniquement dans le cadre du fonctionnement du site.
        </p>
        <p className="legal-section__text">Aucune donnée personnelle n’est vendue ou cédée à des tiers.</p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Sécurité</h2>
        <p className="legal-section__text">
          Le site met en œuvre des mesures de sécurité pour protéger les données personnelles contre tout accès non
          autorisé, perte ou divulgation.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Droits des utilisateurs</h2>
        <p className="legal-section__text">
          Conformément à la réglementation en vigueur, vous disposez des droits suivants :
        </p>
        <ul className="legal-list">
          <li>droit d’accès</li>
          <li>droit de rectification</li>
          <li>droit de suppression</li>
          <li>droit d’opposition</li>
          <li>droit à la limitation du traitement</li>
        </ul>
        <p className="legal-section__text">
          Pour exercer ces droits, il suffit d’envoyer un email à : contact@meandrituals.com
        </p>
      </section>
    </div>
</>
  )
}

export default ConfidentialitePage