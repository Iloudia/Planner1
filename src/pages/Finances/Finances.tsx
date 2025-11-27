import PageTemplate from "../../components/PageTemplate";
import "./Finances.css";

const sections = [
  {
    title: "Budget clair",
    items: [
      "Enveloppes mensuelles : fixe, variable, fun",
      "Vue comparée prévisionnel vs réel",
      "Alertes douces quand on s'approche du plafond"
    ]
  },
  {
    title: "Suivi et habitudes",
    items: [
      "Entrées rapides (montant, catégorie, note)",
      "Récurrences automatiques",
      "Objectifs d’épargne et progrès visuel"
    ]
  },
  {
    title: "Décisions éclairées",
    items: [
      "Wishlist connectée au budget",
      "Rappels d’échéances et renouvellements",
      "Mini-revues hebdo de 10 minutes"
    ]
  }
];

function FinancesPage() {
  return (
    <PageTemplate
      className="finances-page"
      kicker="Finances"
      title="Budgéter sans stresser, décider en conscience"
      summary="Un tableau simple pour suivre dépenses, épargne et envies. La visibilité qui évite les surprises."
      sections={sections}
      primaryCta={{ label: "Entrer une dépense", to: "/finances" }}
      secondaryCta={{ label: "Voir les envies", to: "/wishlist", variant: "ghost" }}
    />
  );
}

export default FinancesPage;
