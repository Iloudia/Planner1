import PageTemplate from "../../components/PageTemplate";
import "./Routine.css";

const sections = [
  {
    title: "Matin",
    items: [
      "Réveil doux, lumière + eau",
      "3 intentions, 1 tâche prioritaire",
      "Ancrage : respiration, mobilité, café"
    ]
  },
  {
    title: "Soir",
    items: [
      "Déconnexion progressive",
      "Préparer demain (vêtements, agenda, repas)",
      "Petit rituel gratitude ou lecture"
    ]
  },
  {
    title: "Reset hebdo",
    items: [
      "Ranger 20 minutes, laver les points clés",
      "Revue des tâches ouvertes",
      "Planifier 3 blocs focus + 1 récompense"
    ]
  }
];

function RoutinePage() {
  return (
    <PageTemplate
      className="routine-page"
      kicker="Routine"
      title="Des routines courtes, réalistes, tenables"
      summary="Structurer les débuts et fins de journée, préparer la semaine, garder le cap sans y passer des heures."
      sections={sections}
      primaryCta={{ label: "Programmer un reset", to: "/calendrier" }}
      secondaryCta={{ label: "Tracker les habitudes", to: "/routine", variant: "ghost" }}
    />
  );
}

export default RoutinePage;
