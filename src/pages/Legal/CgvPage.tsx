import { useEffect } from "react"
import AdministrativePageHeader from "../../components/AdministrativePageHeader"
import "./MentionsLegalesPage.css"

const CgvPage = () => {
  useEffect(() => {
    document.body.classList.add("legal-page--lux")
    return () => document.body.classList.remove("legal-page--lux")
  }, [])

  return (
    <>
      <AdministrativePageHeader eyebrow="Les" title="Conditions Générales de Vente" />
      <div className="legal-page legal-page--mentions">
        <div className="legal-page__columns">
          <div className="legal-page__column">
            <section className="legal-section">
              <h2 className="legal-section__title">Vendeur</h2>
              <p className="legal-section__text">
                [Nom / raison sociale]
                <br />
                [Adresse]
                <br />
                [Email]
                <br />
                [SIREN / SIRET]
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section__title">Objet</h2>
              <p className="legal-section__text">
                Les présentes CGV encadrent la vente aux particuliers de produits exclusivement numériques proposés sur
                le site : fichiers téléchargeables, PDF, templates et autres ressources digitales.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section__title">Prix et paiement</h2>
              <p className="legal-section__text">
                Les prix applicables sont ceux affichés au moment de la commande. Le paiement est réalisé en ligne de
                manière sécurisée. La commande est confirmée après validation du paiement.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section__title">Accès au produit numérique</h2>
              <p className="legal-section__text">
                L’accès au contenu numérique est fourni immédiatement après confirmation du paiement, par téléchargement
                ou depuis l’espace « Mes achats ». Le client doit signaler rapidement toute difficulté d’accès au service
                client.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section__title">Propriété intellectuelle</h2>
              <p className="legal-section__text">
                Les ressources achetées sont réservées à l’usage personnel du client. Il est interdit de les partager,
                revendre, redistribuer ou reproduire, en tout ou partie, sans autorisation écrite préalable.
              </p>
            </section>
          </div>

          <div className="legal-page__column">
            <section className="legal-section">
              <h2 className="legal-section__title">Droit de rétractation</h2>
              <p className="legal-section__text">
                Conformément à l’article L221-28 du Code de la consommation, avant le paiement, le client demande
                expressément que l’exécution du contrat commence immédiatement, avant la fin du délai de rétractation,
                et reconnaît perdre son droit de rétractation dès que l’accès au contenu numérique lui est fourni.
              </p>
              <p className="legal-section__text">
                Une fois le contenu numérique fourni dans ces conditions, aucun remboursement ne sera accordé pour un
                simple changement d’avis. Cette règle ne limite pas les droits légaux du client lorsque le produit est
                défectueux, inaccessible ou non conforme à ce qui a été vendu.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section__title">Responsabilité</h2>
              <p className="legal-section__text">
                Les ressources sont fournies pour l’usage décrit sur leur fiche. Le vendeur ne peut être tenu responsable
                d’une utilisation inadaptée, d’une modification du fichier par le client ou d’un résultat dépendant de
                facteurs extérieurs au produit.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section__title">Service client</h2>
              <p className="legal-section__text">
                Pour toute question, difficulté d’accès ou demande relative à une commande : [Email].
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section__title">Médiation de la consommation</h2>
              <p className="legal-section__text">
                Après une réclamation écrite préalable restée sans solution, le client peut recourir gratuitement au
                médiateur de la consommation suivant :
                <br />
                [Nom du médiateur]
                <br />
                [Adresse du médiateur]
                <br />
                [Site du médiateur]
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-section__title">Droit applicable</h2>
              <p className="legal-section__text">
                Les présentes CGV sont soumises au droit français, sans priver le consommateur des protections
                impératives dont il bénéficie.
              </p>
            </section>
          </div>
        </div>
        <p className="legal-page__footer">Dernière mise à jour : 24 septembre 2026.</p>
      </div>
    </>
  )
}

export default CgvPage
