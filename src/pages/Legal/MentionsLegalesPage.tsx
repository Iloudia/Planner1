import PageHeading from "../../components/PageHeading"
import heroImage from "../../assets/victoria-harder-dupe.jpeg"
import "./MentionsLegalesPage.css"

const MentionsLegalesPage = () => (
  <>
    <section className="page-hero-banner" aria-hidden="true">
      <img src={heroImage} alt="" loading="lazy" />
    </section>
    <div className="page-accent-bar" aria-hidden="true" />
    <PageHeading eyebrow="Mentions légales" title="Mentions légales" />
    <div className="legal-page">
      <p className="legal-page__intro">
        Mentions légales complètes, incluant l'éditeur, l'hébergeur, la propriété intellectuelle et les règles d'utilisation du site Planner.
      </p>

      <section className="legal-section">
        <h2 className="legal-section__title">Éditeur du site</h2>
        <p className="legal-section__text">
          Nom : Vasseur Iloudia
          <br />
          Statut : Auto-entrepreneur
          <br />
          Email : cantact@meandrituals.com
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Directeur de la publication</h2>
        <p className="legal-section__text">Vasseur Iloudia</p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Hébergement</h2>
        <p className="legal-section__text">
          Le site est hébergé par :
          <br />
          [Nom de l'hébergeur]
          <br />
          [Adresse de l'hébergeur]
          <br />
          [Téléphone de l'hébergeur]
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Propriété intellectuelle</h2>
        <p className="legal-section__text">
          L'ensemble du contenu présent sur ce site (textes, images, graphismes, logo, structure) est la propriété exclusive de l'éditeur, sauf mention contraire. Toute reproduction, représentation, modification ou adaptation, totale ou partielle, est interdite sans autorisation préalable.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Responsabilité</h2>
        <p className="legal-section__text">
          L'éditeur s'efforce de fournir des informations aussi précises que possible. Il ne saurait toutefois être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour du contenu.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Données personnelles</h2>
        <p className="legal-section__text">
          Les informations relatives à la collecte et au traitement des données personnelles sont détaillées dans la page Politique de confidentialité. L'utilisation des cookies est expliquée dans la page Gestion des cookies.
        </p>
      </section>
    </div>
    <div className="page-footer-bar" aria-hidden="true" />
  </>
)

export default MentionsLegalesPage
