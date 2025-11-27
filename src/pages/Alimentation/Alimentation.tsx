import PageTemplate from "../../components/PageTemplate";
import "./Alimentation.css";

const sections = [
  {
    title: "Menus simples",
    items: [
      "Plan hebdo (midi/soir) selon énergie",
      "Recettes rapides, équilibrées ou confort",
      "Repas invités ou batch cooking notés"
    ]
  },
  {
    title: "Courses maîtrisées",
    items: [
      "Liste par rayon ou par recette",
      "Stocks du placard et du frais",
      "Budget courses vs prévu"
    ]
  },
  {
    title: "Hygiène de vie",
    items: [
      "Hydratation, fibres, protéines par jour",
      "Rappel collations intelligentes",
      "Notes digestion / énergie"
    ]
  }
];

function AlimentationPage() {
  return (
    <PageTemplate
      className="alimentation-page"
      kicker="Alimentation"
      title="Bien manger sans y passer des heures"
      summary="Des menus réalistes, une liste de courses claire et une vue budget pour rester serein."
      sections={sections}
      primaryCta={{ label: "Préparer les courses", to: "/alimentation" }}
      secondaryCta={{ label: "Planifier les repas", to: "/calendrier", variant: "ghost" }}
    />
  );
}

export default AlimentationPage;
