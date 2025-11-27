import PageTemplate from "../../components/PageTemplate";
import "./Projets.css";

const sections = [
  {
    title: "Clarté et portée",
    items: [
      "Pourquoi / résultat attendu",
      "Portée définie, hors-scope explicite",
      "Mesure de succès simple"
    ]
  },
  {
    title: "Roadmap légère",
    items: [
      "Milestones avec dates cibles",
      "Backlog priorisé (now / next / later)",
      "Prochaine action concrète visible"
    ]
  },
  {
    title: "Suivi qui motive",
    items: [
      "Check hebdo : obstacles, besoin d’aide",
      "Revue mensuelle des livrables",
      "Section célébrations et apprentissages"
    ]
  }
];

function ProjetsPage() {
  return (
    <PageTemplate
      className="projets-page"
      kicker="Projets"
      title="Tes projets perso, cadrés et vivants"
      summary="Une roadmap claire, un backlog réaliste et des actions visibles. Finis les projets qui dorment."
      sections={sections}
      primaryCta={{ label: "Planifier un jalon", to: "/calendrier" }}
      secondaryCta={{ label: "Ajouter une idée", to: "/projets", variant: "ghost" }}
    />
  );
}

export default ProjetsPage;
