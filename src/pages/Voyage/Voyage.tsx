import PageTemplate from "../../components/PageTemplate";
import "./Voyage.css";

const sections = [
  {
    title: "Rêver et choisir",
    items: [
      "Destinations shortlist avec saisons idéales",
      "Mood du trip : city-break, nature, slow",
      "Durée et budget cible"
    ]
  },
  {
    title: "Planifier doucement",
    items: [
      "Itinéraire par journée (souple)",
      "Transport, logement, to-dos admins",
      "Check-list sac et documents"
    ]
  },
  {
    title: "Souvenirs & partages",
    items: [
      "Highlights du séjour et lieux préférés",
      "Photos / liens utiles pour plus tard",
      "Idées pour la prochaine escapade"
    ]
  }
];

function VoyagePage() {
  return (
    <PageTemplate
      className="voyage-page"
      kicker="Voyage rêvé"
      title="Préparer sans stress, profiter sur place"
      summary="Destinations, itinéraires doux et check-lists prêtes. Tu poses tes idées, le planner garde le fil."
      sections={sections}
      primaryCta={{ label: "Tracer l'itinéraire", to: "/calendrier" }}
      secondaryCta={{ label: "Budget voyage", to: "/finances", variant: "ghost" }}
    />
  );
}

export default VoyagePage;
