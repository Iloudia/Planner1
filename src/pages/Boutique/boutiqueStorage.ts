import type { BoutiqueProduct } from "./boutiqueData"

const CUSTOM_PRODUCTS_KEY = "boutique.customProducts.v1"
const CUSTOM_PRODUCTS_EVENT = "products:updated"
const API_BASE = import.meta.env.VITE_API_BASE || ""
const CUSTOM_PRODUCTS_ENDPOINT = `${API_BASE}/api/custom-products`

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

const pushRemoteUpdate = async (payload: Record<string, unknown>) => {
  try {
    await fetch(CUSTOM_PRODUCTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch {
    // ignore remote sync errors, local storage remains the source of truth for now
  }
}

export const saveCustomProduct = (product: BoutiqueProduct) => {
  const existing = loadCustomProducts()
  const next: StoredProduct[] = [
    { ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ...existing,
  ]
  writeProducts(next)
  void pushRemoteUpdate({ action: "upsert", product })
}

export const updateCustomProduct = (product: BoutiqueProduct) => {
  const existing = loadCustomProducts()
  const next = existing.map((item) =>
    item.id === product.id ? { ...item, ...product, updatedAt: new Date().toISOString() } : item,
  )
  writeProducts(next)
  void pushRemoteUpdate({ action: "upsert", product })
}

export const deleteCustomProduct = (productId: string) => {
  const existing = loadCustomProducts()
  const next = existing.filter((item) => item.id !== productId)
  writeProducts(next)
  void pushRemoteUpdate({ action: "delete", productId })
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

export const fetchCustomProducts = async () => {
  try {
    const response = await fetch(CUSTOM_PRODUCTS_ENDPOINT)
    if (!response.ok) {
      return loadCustomProducts()
    }
    const data = (await response.json()) as StoredProduct[]
    if (!Array.isArray(data)) {
      return loadCustomProducts()
    }
    writeProducts(data)
    return data
  } catch {
    return loadCustomProducts()
  }
}

export const PRODUCTS_UPDATED_EVENT = CUSTOM_PRODUCTS_EVENT
