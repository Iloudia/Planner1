import PageTemplate from "../../components/PageTemplate";
import "./Calendrier.css";

const sections = [
  {
    title: "Vue mensuelle",
    items: [
      "Repères clés : jalons, anniversaires, jours off",
      "Couleurs par domaine : travail / perso / santé",
      "Champs rapides : lieu, durée, énergie requise"
    ]
  },
  {
    title: "Plan hebdo",
    items: [
      "3 priorités maxi par jour",
      "Buffers et blocs focus protégés",
      "Synchronisation tâches récurrentes"
    ]
  },
  {
    title: "Rappels utiles",
    items: [
      "Préparation J-1 ou J-2 pour les gros événements",
      "Petits check-ins quotidiens",
      "Moments pour soi intégrés au planning"
    ]
  }
];

function CalendrierPage() {
  return (
    <PageTemplate
      className="calendrier-page"
      kicker="Calendrier"
      title="Le mois en un clin d’œil, les blocs en sécurité"
      summary="Un calendrier qui protège ton énergie : blocs focus, buffers, et rappels pour préparer sans stress."
      sections={sections}
      primaryCta={{ label: "Bloquer un créneau", to: "/calendrier" }}
      secondaryCta={{ label: "Voir routines", to: "/routine", variant: "ghost" }}
    />
  );
}

export default CalendrierPage;
