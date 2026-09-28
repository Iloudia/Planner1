import { useEffect } from "react"
import { Link } from "react-router-dom"
import AdministrativePageHeader from "../../components/AdministrativePageHeader"
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
      <AdministrativePageHeader eyebrow="Les" title="Mentions légales" />
      <div className="legal-page legal-page--mentions">
        <div className="legal-page__columns">
          <div className="legal-page__column">
            <section className="legal-section">
              <h2 className="legal-section__title">Éditeur du site</h2>
              <p className="legal-section__text">
                Nom : Vasseur Iloudia
                <br />
                Statut : Auto-entrepreneur
                <br />
                Email : contact@meandrituals.com
                <br />
                SIRET : 95166317800022
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
                Google LLC — Firebase Hosting
                <br />
                1600 Amphitheatre Parkway
                <br />
                Mountain View, California 94043, États-Unis
                <br />
                Téléphone : +1 650 253 0000
              </p>
            </section>
          </div>

          <div className="legal-page__column">
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
                Les informations relatives à la collecte et au traitement des données personnelles sont détaillées dans
                la page{" "}
                <Link to="/confidentialite" className="legal-link">
                  Politique de confidentialité
                </Link>
                . L'utilisation des cookies est expliquée dans la page{" "}
                <Link to="/cookies" className="legal-link">
                  Gestion des cookies
                </Link>
                .
                <br />
                <br />
                Les conditions applicables aux achats réalisés dans la boutique sont accessibles sur la page{" "}
                <Link to="/cgv" className="legal-link">
                  Conditions générales de vente
                </Link>
                .
                <br />
                <br />
                En cas de réclamation, le consommateur est invité à contacter préalablement Me&amp;rituals à l’adresse
                contact@meandrituals.com. Les coordonnées du médiateur de la consommation seront publiées dans cette
                rubrique dès sa désignation.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default MentionsLegalesPage
