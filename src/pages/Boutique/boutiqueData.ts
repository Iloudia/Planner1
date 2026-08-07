import heroBackdrop from "../../assets/plante.jpeg"
import categoryEbook from "../../assets/couverture glow-up.png"
import categoryTemplate from "../../assets/Couvertur levelup.png"
import categoryCarousel from "../../assets/Journal de couple.png"
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
    title: "Le guide complet pour devenir la meilleure version de toi-même",
    description: "Un guide complet pour reprendre confiance en toi, évoluer chaque jour et construire une version de toi plus alignée.",
    image: categoryEbook,
    productType: "ebook",
  },
  {
    id: "templates",
    title: "21 jours pour reconstruire la confiance en soi",
    description: "Un guide de 21 jours pour reconstruire la confiance en soi, reprendre ton pouvoir et avancer avec plus d'assurance.",
    image: categoryTemplate,
    productType: "template",
  },
  {
    id: "carrousels",
    title: "Journal de couple",
    description: "Un journal à remplir à deux pour créer des souvenirs, ouvrir de vraies discussions et renforcer votre lien au quotidien.",
    image: categoryCarousel,
    productType: "carousel",
  },
]

const sharedGallery = [productEbook, productTemplate, productCarousel, productPricing, productPortfolio, productStory]

export const products: BoutiqueProduct[] = []

export const benefits = [
  {
    title: "Des ressources pour tous tes projets",
    text: "Retrouve des ebooks, templates Canva, vision boards, signatures, carrousels Instagram et bien d'autres outils prêts à l'emploi.",
  },
  {
    title: "Qualité & simplicité",
    text: "Chaque ressource est créée avec soin pour être facile à utiliser, esthétique et vraiment utile au quotidien.",
  },
  {
    title: "Téléchargement instantané",
    text: "Achète, télécharge et profite de tes ressources immédiatement. Accès à vie, où et quand tu veux.",
  },
]
