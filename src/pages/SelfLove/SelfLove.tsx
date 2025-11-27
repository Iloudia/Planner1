import PageTemplate from "../../components/PageTemplate";
import "./SelfLove.css";

const sections = [
  {
    title: "Rituels care",
    items: [
      "Skincare, hydratation, soleil contrôlé",
      "Mouvements doux : stretching, yin, marche",
      "Moments off : sieste, lecture lente"
    ]
  },
  {
    title: "Recharge mentale",
    items: [
      "Affirmations et journal de compassion",
      "Détecter les signes de surcharge",
      "Listes SOS : musiques, appels, lieux refuges"
    ]
  },
  {
    title: "Cadres sains",
    items: [
      "Limites écran et notifications",
      "Rendez-vous avec soi-même dans le calendrier",
      "Rappels de micro-pauses au quotidien"
    ]
  }
];

function SelfLovePage() {
  return (
    <PageTemplate
      className="selflove-page"
      kicker="S'aimer soi-même"
      title="S'offrir du temps, sans culpabilité"
      summary="Des routines courtes mais régulières pour te traiter comme ta personne favorite."
      sections={sections}
      primaryCta={{ label: "Planifier un moment pour toi", to: "/calendrier" }}
      secondaryCta={{ label: "Reset hebdo", to: "/routine", variant: "ghost" }}
    />
  );
}

export default SelfLovePage;
