import PageHeading from "../../components/PageHeading"
import "./ConfidentialitePage.css"

const ConfidentialitePage = () => (
  <>
    <div className="page-accent-bar" aria-hidden="true" />
    <PageHeading eyebrow="Confidentialité" title="Politique de confidentialité" />
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
          Selon l’utilisation du site, les données suivantes peuvent être collectées : prénom, adresse email, messages
          envoyés via les formulaires, données de navigation (cookies), informations nécessaires à l’accès aux services.
          Dans le cadre de l’achat de produits (ebooks ou autres contenus payants), certaines données peuvent être
          collectées à des fins de gestion de commande. Les données bancaires ne sont jamais stockées par le site et sont
          traitées exclusivement par des prestataires de paiement sécurisés.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Finalité de la collecte</h2>
        <p className="legal-section__text">
          Les données personnelles sont collectées pour : permettre l’accès et l’utilisation du site, répondre aux
          messages et demandes, envoyer des contenus ou informations liées au projet, gérer les commandes et la
          facturation, améliorer le fonctionnement du site.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Base légale</h2>
        <p className="legal-section__text">
          La collecte des données repose sur : le consentement de l’utilisateur, l’exécution d’un contrat (achat de
          produits), le respect d’obligations légales.
        </p>
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
          statistiques) uniquement dans le cadre du fonctionnement du site. Aucune donnée personnelle n’est vendue ou
          cédée à des tiers.
        </p>
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
          Conformément à la réglementation en vigueur, vous disposez des droits suivants : droit d’accès, droit de
          rectification, droit de suppression, droit d’opposition, droit à la limitation du traitement. Pour exercer ces
          droits, il suffit d’envoyer un email à : [email de contact].
        </p>
      </section>
    </div>
    <div className="page-footer-bar" aria-hidden="true" />
  </>
)

export default ConfidentialitePage
