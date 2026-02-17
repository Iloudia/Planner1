import { useEffect } from "react"
import PageHeading from "../../components/PageHeading"
import "./MentionsLegalesPage.css"

const MentionsLegalesPage = () => {
  useEffect(() => {
    document.body.classList.add("legal-page--lux")
    return () => {
      document.body.classList.remove("legal-page--lux")
    }
  }, [])

  return (
  <>
      <PageHeading eyebrow="Mentions lï¿½gales" title="Mentions lï¿½gales" className="mentions-legales__header" />
    <div className="legal-page">
      <p className="legal-page__intro">
        Mentions lï¿½gales complï¿½tes, incluant l'ï¿½diteur, l'hï¿½bergeur, la propriï¿½tï¿½ intellectuelle et les rï¿½gles d'utilisation du site Planner.
      </p>

      <section className="legal-section">
        <h2 className="legal-section__title">ï¿½diteur du site</h2>
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
        <h2 className="legal-section__title">Hï¿½bergement</h2>
        <p className="legal-section__text">
          Le site est hï¿½bergï¿½ par :
          <br />
          [Nom de l'hï¿½bergeur]
          <br />
          [Adresse de l'hï¿½bergeur]
          <br />
          [Tï¿½lï¿½phone de l'hï¿½bergeur]
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Propriï¿½tï¿½ intellectuelle</h2>
        <p className="legal-section__text">
          L'ensemble du contenu prï¿½sent sur ce site (textes, images, graphismes, logo, structure) est la propriï¿½tï¿½ exclusive de l'ï¿½diteur, sauf mention contraire. Toute reproduction, reprï¿½sentation, modification ou adaptation, totale ou partielle, est interdite sans autorisation prï¿½alable.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Responsabilitï¿½</h2>
        <p className="legal-section__text">
          L'ï¿½diteur s'efforce de fournir des informations aussi prï¿½cises que possible. Il ne saurait toutefois ï¿½tre tenu responsable des omissions, inexactitudes ou carences dans la mise ï¿½ jour du contenu.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Donnï¿½es personnelles</h2>
        <p className="legal-section__text">
          Les informations relatives ï¿½ la collecte et au traitement des donnï¿½es personnelles sont dï¿½taillï¿½es dans la page Politique de confidentialitï¿½. L'utilisation des cookies est expliquï¿½e dans la page Gestion des cookies.
        </p>
      </section>
    </div>
</>
  )
}

export default MentionsLegalesPage




