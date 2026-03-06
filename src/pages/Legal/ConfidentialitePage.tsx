import { useEffect } from "react"
import PageHeading from "../../components/PageHeading"
import { Link } from "react-router-dom"
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
          Le responsable du traitement des données est Vasseur Iloudia, éditrice du site Me&rituals. Pour toute
          question relative aux données personnelles, vous pouvez contacter : contact@meandrituals.com.
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
        <p className="legal-section__text">
          Les données sont fournies par l’utilisateur ou générées par l’usage du site (cookies, journaux techniques).
        </p>
        <p className="legal-section__text">
          Pour plus d’informations sur les cookies utilisés, consultez notre page{" "}
          <Link to="/cookies" className="legal-link">
            Cookies
          </Link>
          .
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Finalité de la collecte</h2>
        <p className="legal-section__text">
          Les données personnelles sont collectées pour :
        </p>
        <ul className="legal-list">
          <li>permettre l’accès et l’utilisation du site → intérêt légitime</li>
          <li>répondre aux messages et demandes → intérêt légitime</li>
          <li>envoyer des contenus ou informations liées au projet → consentement</li>
          <li>gérer les commandes et la facturation → exécution du contrat et obligations légales</li>
          <li>améliorer le fonctionnement du site → intérêt légitime</li>
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
          Les durées de conservation varient selon le type de données :
        </p>
        <ul className="legal-list">
          <li>
            données stockées localement dans votre navigateur (préférences, panier, contenus enregistrés) : conservées
            jusqu’à suppression par l’utilisateur ou nettoyage du navigateur
          </li>
          <li>
            messages et échanges de contact : conservés le temps nécessaire au suivi de votre demande, puis supprimés
            lorsque cela n’est plus utile
          </li>
          <li>
            données liées aux commandes et à la facturation : conservées par les prestataires de paiement et selon les
            obligations légales applicables
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Partage des données</h2>
        <p className="legal-section__text">
          Les données peuvent être transmises à des prestataires techniques uniquement dans le cadre du fonctionnement
          du site, par exemple :
        </p>
        <ul className="legal-list">
          <li>hébergeur du site</li>
          <li>prestataire de paiement (Stripe)</li>
          <li>service d’emailing (Resend)</li>
        </ul>
        <p className="legal-section__text">
          Certains de ces prestataires peuvent être situés en dehors de l’Union européenne. Dans ce cas, les transferts
          de données sont encadrés par des garanties appropriées (ex. clauses contractuelles types).
        </p>
        <p className="legal-section__text">Aucune donnée personnelle n’est vendue ou cédée à des tiers.</p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Sécurité</h2>
        <p className="legal-section__text">
          Le site met en œuvre des mesures de sécurité pour protéger les données personnelles contre tout accès non
          autorisé, perte ou divulgation.
        </p>
        <p className="legal-section__text">Aucune décision automatisée ni profilage n’est mis en œuvre.</p>
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
          <li>droit à la portabilité</li>
          <li>droit de retirer son consentement</li>
          <li>droit d’introduire une réclamation auprès de la CNIL</li>
        </ul>
        <p className="legal-section__text">
          Pour exercer ces droits, il suffit d’envoyer un email à : contact@meandrituals.com
        </p>

      </section>
      <p className="legal-page__footer">Dernière mise à jour : 6 mars 2026.</p>
    </div>
</>
  )
}

export default ConfidentialitePage
