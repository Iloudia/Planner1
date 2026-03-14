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
  digitalFiles?: BoutiqueDigitalFile[]
  checkoutEnabled?: boolean
}

export type BoutiqueDigitalFile = {
  id: string
  originalName: string
  downloadName: string
  storagePath: string
  mimeType: string
  sizeBytes: number
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
    description: "Designs premium prÃªts Ã  personnaliser pour un rendu pro en minutes.",
    highlight: "Gagner du temps",
    image: categoryTemplate,
    productType: "template",
  },
  {
    id: "carrousels",
    title: "Carrousels Instagram",
    description: "Storytelling clair, hooks puissants, et call-to-action optimisÃ©s.",
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
    title: "PensÃ© pour convertir",
    text: "Chaque ressource est orientÃ©e action, avec des hooks et des CTA prÃªts Ã  l'emploi.",
  },
  {
    title: "Gain de temps immÃ©diat",
    text: "Fini les pages blanches : tu personnalises, tu publies, tu vends.",
  },
  {
    title: "Designs premium",
    text: "Une esthÃ©tique Ã©lÃ©gante et moderne pour renforcer ta crÃ©dibilitÃ©.",
  },
  {
    title: "AccÃ¨s Ã  vie",
    text: "Tu tÃ©lÃ©charges et tu utilises quand tu veux, oÃ¹ tu veux.",
  },
]


