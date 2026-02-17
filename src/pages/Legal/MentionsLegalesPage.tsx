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
    <div className="legal-page">
      <PageHeading eyebrow="Mentions l�gales" title="Mentions l�gales" />
      <p className="legal-page__intro">
        Mentions l�gales compl�tes, incluant l'�diteur, l'h�bergeur, la propri�t� intellectuelle et les r�gles d'utilisation du site Planner.
      </p>

      <section className="legal-section">
        <h2 className="legal-section__title">�diteur du site</h2>
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
        <h2 className="legal-section__title">H�bergement</h2>
        <p className="legal-section__text">
          Le site est h�berg� par :
          <br />
          [Nom de l'h�bergeur]
          <br />
          [Adresse de l'h�bergeur]
          <br />
          [T�l�phone de l'h�bergeur]
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Propri�t� intellectuelle</h2>
        <p className="legal-section__text">
          L'ensemble du contenu pr�sent sur ce site (textes, images, graphismes, logo, structure) est la propri�t� exclusive de l'�diteur, sauf mention contraire. Toute reproduction, repr�sentation, modification ou adaptation, totale ou partielle, est interdite sans autorisation pr�alable.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Responsabilit�</h2>
        <p className="legal-section__text">
          L'�diteur s'efforce de fournir des informations aussi pr�cises que possible. Il ne saurait toutefois �tre tenu responsable des omissions, inexactitudes ou carences dans la mise � jour du contenu.
        </p>
      </section>

      <section className="legal-section">
        <h2 className="legal-section__title">Donn�es personnelles</h2>
        <p className="legal-section__text">
          Les informations relatives � la collecte et au traitement des donn�es personnelles sont d�taill�es dans la page Politique de confidentialit�. L'utilisation des cookies est expliqu�e dans la page Gestion des cookies.
        </p>
      </section>
    </div>
</>
  )
}

export default MentionsLegalesPage




