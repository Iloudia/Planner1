import type { BoutiqueProduct } from "./boutiqueData"

const CUSTOM_PRODUCTS_KEY = "boutique.customProducts.v1"
const CUSTOM_PRODUCTS_EVENT = "products:updated"

type StoredProduct = BoutiqueProduct & { createdAt: string; updatedAt?: string }

const safeParse = (raw: string | null) => {
  if (!raw) return [] as StoredProduct[]
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item === "object") as StoredProduct[]
  } catch {
    return []
  }
}

export const loadCustomProducts = () => {
  const raw = window.localStorage.getItem(CUSTOM_PRODUCTS_KEY)
  return safeParse(raw)
}

const emitProductsUpdated = () => {
  window.dispatchEvent(new CustomEvent(CUSTOM_PRODUCTS_EVENT))
}

const writeProducts = (products: StoredProduct[]) => {
  window.localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products))
  emitProductsUpdated()
}

export const saveCustomProduct = (product: BoutiqueProduct) => {
  const existing = loadCustomProducts()
  const next: StoredProduct[] = [
    { ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ...existing,
  ]
  writeProducts(next)
}

export const updateCustomProduct = (product: BoutiqueProduct) => {
  const existing = loadCustomProducts()
  const next = existing.map((item) =>
    item.id === product.id ? { ...item, ...product, updatedAt: new Date().toISOString() } : item,
  )
  writeProducts(next)
}

export const deleteCustomProduct = (productId: string) => {
  const existing = loadCustomProducts()
  const next = existing.filter((item) => item.id !== productId)
  writeProducts(next)
}

export const compactCustomProducts = () => {
  const existing = loadCustomProducts()
  const next = existing.map((item) => ({
    ...item,
    image: item.image,
    gallery: item.image ? [item.image] : [],
    updatedAt: new Date().toISOString(),
  }))
  writeProducts(next)
}

export const PRODUCTS_UPDATED_EVENT = CUSTOM_PRODUCTS_EVENT
