import heroBackdrop from "../../assets/rowena-regterschot-dupe.jpeg"
import categoryEbook from "../../assets/voyage.jpeg"
import categoryTemplate from "../../assets/food2.jpeg"
import categoryCarousel from "../../assets/lauren-lista-dupe.jpeg"
import productEbook from "../../assets/ebony-forsyth-dupe.jpeg"
import productTemplate from "../../assets/katie-huber-rhoades-dupe (1).jpeg"
import productCarousel from "../../assets/lindsay-piotter-dupe.jpeg"
import productPricing from "../../assets/lilie-hill-dupe.jpeg"
import productPortfolio from "../../assets/mallika-jain-dupe.jpeg"
import productStory from "../../assets/amy-rikard-dupe.jpeg"
import productBundle from "../../assets/lauren-lista-dupe.jpeg"
import productPlan from "../../assets/kalina-wolf-dupe.jpeg"

export const boutiqueHeroBackdrop = heroBackdrop

export type BoutiqueCategory = {
  id: "ebooks" | "templates" | "carrousels"
  title: string
  description: string
  highlight: string
  image: string
  productType: "ebook" | "template" | "carousel"
}

export type BoutiqueProduct = {
  id: string
  title: string
  benefit: string
  price: string
  format: string
  formatLabel: string
  badge: string
  mockup: "ebook" | "template" | "carousel" | "bundle"
  bestSeller: boolean
  image: string
  gallery: string[]
  description: string
  features: string[]
}

export const categories: BoutiqueCategory[] = [
  {
    id: "ebooks",
    title: "Ebooks PDF",
    description: "Guides actionnables, frameworks et checklists pour vendre plus vite.",
    highlight: "Structurer ton offre",
    image: categoryEbook,
    productType: "ebook",
  },
  {
    id: "templates",
    title: "Templates Canva",
    description: "Designs premium prêts à personnaliser pour un rendu pro en minutes.",
    highlight: "Gagner du temps",
    image: categoryTemplate,
    productType: "template",
  },
  {
    id: "carrousels",
    title: "Carrousels Instagram",
    description: "Storytelling clair, hooks puissants, et call-to-action optimisés.",
    highlight: "Booster l'engagement",
    image: categoryCarousel,
    productType: "carousel",
  },
]

const sharedGallery = [productEbook, productTemplate, productCarousel, productPricing, productPortfolio, productStory]

export const products: BoutiqueProduct[] = [
  {
    id: "ebook-clarte",
    title: "Ebook « Clarté d'offre »",
    benefit: "Trouve ton angle et vends avec confiance.",
    price: "19€",
    format: "PDF - 52 pages",
    formatLabel: "PDF",
    badge: "Best-seller",
    mockup: "ebook",
    bestSeller: true,
    image: productEbook,
    gallery: sharedGallery,
    description:
      "Un guide structurant pour clarifier ton positionnement, définir ta promesse et construire une offre facile à vendre.",
    features: [
      "Frameworks de positionnement et différenciation",
      "Exemples réels d'offres rentables",
      "Checklists de lancement rapide",
      "Feuilles d'exercices à remplir",
    ],
  },
  {
    id: "template-lancement",
    title: "Pack Templates « Lancement »",
    benefit: "Slides prêtes pour teaser, vendre, convertir.",
    price: "29€",
    format: "Canva - 45 pages",
    formatLabel: "Canva",
    badge: "Best-seller",
    mockup: "template",
    bestSeller: true,
    image: productTemplate,
    gallery: [productTemplate, productPortfolio, productPricing, productCarousel, productStory, productPlan],
    description: "Un pack complet de slides pour orchestrer un lancement fluide et premium.",
    features: [
      "Stories, carrousels et slides de vente",
      "Variantes couleurs et typographies",
      "CTA optimisés pour la conversion",
      "Guide d'usage rapide",
    ],
  },
  {
    id: "carrousel-conversion",
    title: "Kit Carrousel Conversion",
    benefit: "Hooks + structure pour vendre sans forcer.",
    price: "24€",
    format: "Canva - 30 carrousels",
    formatLabel: "Canva",
    badge: "Best-seller",
    mockup: "carousel",
    bestSeller: true,
    image: productCarousel,
    gallery: [productCarousel, productStory, productTemplate, productPortfolio, productPricing, productEbook],
    description: "Des structures de carrousels optimisées pour retenir l'attention et convertir.",
    features: [
      "Hooks prêts à l'emploi",
      "Storytelling et arguments de vente",
      "Slides de conclusion efficaces",
      "Format adaptable à tous les secteurs",
    ],
  },
  {
    id: "ebook-pricing",
    title: "Ebook Pricing Magnétique",
    benefit: "Construis des prix perçus comme évidents.",
    price: "17€",
    format: "PDF - 38 pages",
    formatLabel: "PDF",
    badge: "Nouveau",
    mockup: "ebook",
    bestSeller: false,
    image: productPricing,
    gallery: [productPricing, productEbook, productPlan, productTemplate, productCarousel, productStory],
    description: "Un système simple pour fixer des prix alignés avec ta valeur et ton marché.",
    features: [
      "Matrice valeur/prix",
      "Scripts de communication du prix",
      "Exercices pratiques",
      "Mini-calculateur de marge",
    ],
  },
  {
    id: "template-portfolio",
    title: "Templates Portfolio Insta",
    benefit: "Montre ta valeur avec un feed aligné.",
    price: "26€",
    format: "Canva - 28 pages",
    formatLabel: "Canva",
    badge: "Favori",
    mockup: "template",
    bestSeller: false,
    image: productPortfolio,
    gallery: [productPortfolio, productTemplate, productStory, productPricing, productCarousel, productPlan],
    description: "Des templates élégants pour présenter ton univers, tes offres et tes preuves.",
    features: [
      "Modules portfolio et avant/après",
      "Stories d'expertise",
      "CTA intégrables",
      "Exports rapides",
    ],
  },
  {
    id: "carrousel-story",
    title: "Carrousels Storytelling",
    benefit: "Crée des posts qui retiennent jusqu'à la dernière slide.",
    price: "22€",
    format: "Canva - 24 carrousels",
    formatLabel: "Canva",
    badge: "",
    mockup: "carousel",
    bestSeller: false,
    image: productStory,
    gallery: [productStory, productCarousel, productTemplate, productPortfolio, productPricing, productPlan],
    description: "Des structures narratives qui construisent une relation durable avec ton audience.",
    features: [
      "Frameworks de narration",
      "Slides de tension et résolution",
      "CTA d'engagement",
      "Mises en page dynamiques",
    ],
  },
  {
    id: "bundle-creator",
    title: "Bundle Creator Focus",
    benefit: "Tout ce qu'il faut pour un mois de contenu.",
    price: "49€",
    format: "PDF + Canva",
    formatLabel: "Bundle",
    badge: "Bundle",
    mockup: "bundle",
    bestSeller: false,
    image: productBundle,
    gallery: [productBundle, productTemplate, productCarousel, productEbook, productPricing, productStory],
    description: "Le mix idéal pour planifier, produire et publier sans stress pendant 4 semaines.",
    features: [
      "Calendrier éditorial complet",
      "Templates variés",
      "Checklists de production",
      "Bonus de déclinaison multi-formats",
    ],
  },
  {
    id: "ebook-plan",
    title: "Ebook Plan d'action 30 jours",
    benefit: "Transforme ta vision en plan clair.",
    price: "21€",
    format: "PDF - 60 pages",
    formatLabel: "PDF",
    badge: "",
    mockup: "ebook",
    bestSeller: false,
    image: productPlan,
    gallery: [productPlan, productEbook, productPricing, productTemplate, productCarousel, productStory],
    description: "Un plan de 30 jours pour rester focus et avancer sans te disperser.",
    features: [
      "Roadmap jour par jour",
      "Rituels de suivi",
      "Templates de planification",
      "Bilan de fin de cycle",
    ],
  },
]

export const benefits = [
  {
    title: "Pensé pour convertir",
    text: "Chaque ressource est orientée action, avec des hooks et des CTA prêts à l'emploi.",
  },
  {
    title: "Gain de temps immédiat",
    text: "Fini les pages blanches : tu personnalises, tu publies, tu vends.",
  },
  {
    title: "Designs premium",
    text: "Une esthétique élégante et moderne pour renforcer ta crédibilité.",
  },
  {
    title: "Accès à vie",
    text: "Tu télécharges et tu utilises quand tu veux, où tu veux.",
  },
]
