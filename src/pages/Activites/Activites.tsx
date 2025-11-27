import PageTemplate from "../../components/PageTemplate";
import "./Activites.css";

const sections = [
  {
    title: "Idées à saisir",
    items: [
      "Sorties culture (expo, ciné, théâtre)",
      "Ateliers / cours (cuisine, danse, photo)",
      "Moments chill : cafés, balades, pique-niques"
    ]
  },
  {
    title: "Organisation simple",
    items: [
      "Budget par activité et par mois",
      "Disponibilités rapides et invitations",
      "Listes de lieux à tester par quartier"
    ]
  },
  {
    title: "Souvenirs & feedback",
    items: [
      "Notes rapides après la sortie",
      "Top 3 à refaire avec la bonne personne",
      "Photos + liens pour mémoire future"
    ]
  }
];

function ActivitesPage() {
  return (
    <PageTemplate
      className="activites-page"
      kicker="Activités"
      title="Des moments qui sortent du quotidien"
      summary="Capte les idées, planifie-les, et garde ce qui t’a plu. Moins de scrolling, plus de moments vécus."
      sections={sections}
      primaryCta={{ label: "Ajouter une activité", to: "/calendrier" }}
      secondaryCta={{ label: "Wishlist sorties", to: "/wishlist", variant: "ghost" }}
    />
  );
}

export default ActivitesPage;
