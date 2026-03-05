import type { BoutiqueProduct } from "./boutiqueData"

const CUSTOM_PRODUCTS_KEY = "boutique.customProducts.v1"

type StoredProduct = BoutiqueProduct & { createdAt: string }

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

export const saveCustomProduct = (product: BoutiqueProduct) => {
  const existing = loadCustomProducts()
  const next: StoredProduct[] = [{ ...product, createdAt: new Date().toISOString() }, ...existing]
  window.localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(next))
}
