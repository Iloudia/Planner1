export type BoutiqueCategory = {
  id: "ebooks" | "templates" | "carrousels" | "moodboards"
  title: string
  description: string
  highlight: string
  image: string
  productType: "ebook" | "template" | "carousel" | "moodboard"
}

export type BoutiqueDigitalFile = {
  id: string
  originalName: string
  downloadName: string
  storagePath: string
  mimeType: string
  sizeBytes: number
}

export type BoutiqueProduct = {
  id: string
  title: string
  benefit: string
  price: string
  format: string
  formatLabel: string
  badge: string
  mockup: "ebook" | "template" | "carousel" | "moodboard" | "bundle"
  bestSeller: boolean
  image: string
  video?: string
  gallery: string[]
  description: string
  features: string[]
  digitalFiles?: BoutiqueDigitalFile[]
  checkoutEnabled?: boolean
}
