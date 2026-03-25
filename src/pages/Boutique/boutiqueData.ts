import heroBackdrop from "../../assets/rowena-regterschot-dupe.webp"
import categoryEbook from "../../assets/voyage.webp"
import categoryTemplate from "../../assets/food2.webp"
import categoryCarousel from "../../assets/lauren-lista-dupe.webp"
import productEbook from "../../assets/ebony-forsyth-dupe.webp"
import productTemplate from "../../assets/katie-huber-rhoades-dupe (1).webp"
import productCarousel from "../../assets/lindsay-piotter-dupe.webp"
import productPricing from "../../assets/lilie-hill-dupe.webp"
import productPortfolio from "../../assets/mallika-jain-dupe.webp"
import productStory from "../../assets/amy-rikard-dupe.webp"
import productBundle from "../../assets/lauren-lista-dupe.webp"
import productPlan from "../../assets/kalina-wolf-dupe.webp"
import type { BoutiqueCategory, BoutiqueProduct } from "../../models/product.model"

export const boutiqueHeroBackdrop = heroBackdrop

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
]

export const benefits = [
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



