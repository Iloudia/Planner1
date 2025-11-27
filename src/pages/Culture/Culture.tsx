import PageTemplate from "../../components/PageTemplate";
import "./Culture.css";

const sections = [
  {
    title: "Lectures",
    items: [
      "Pile à lire + en cours + terminé",
      "Notes par chapitre et citations clés",
      "Rappel des prochaines sorties"
    ]
  },
  {
    title: "Écrans & sorties",
    items: [
      "Films / séries à voir, plateformes et durées",
      "Expos, concerts, pièces à ne pas rater",
      "Avis rapides pour souvenir"
    ]
  },
  {
    title: "Inspiration",
    items: [
      "Liens, newsletters, podcasts favoris",
      "Rituels culture (15 min/jour)",
      "Partage : qui pourrait aimer quoi ?"
    ]
  }
];

function CulturePage() {
  return (
    <PageTemplate
      className="culture-page"
      kicker="Lecture & culture"
      title="Nourrir ta curiosité sans t’éparpiller"
      summary="Centralise tes lectures, écrans et idées de sorties pour piocher facilement au bon moment."
      sections={sections}
      primaryCta={{ label: "Planifier un moment culture", to: "/calendrier" }}
      secondaryCta={{ label: "Voir les envies", to: "/wishlist", variant: "ghost" }}
    />
  );
}

export default CulturePage;
