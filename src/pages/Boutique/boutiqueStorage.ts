import type { BoutiqueProduct } from "./boutiqueData"
import { buildApiUrl } from "../../utils/apiUrl"
import { resolvePublicUrl } from "../../utils/apiUrl"
import { auth } from "../../utils/firebase"

const CUSTOM_PRODUCTS_KEY = "boutique.customProducts.v1"
const CUSTOM_PRODUCTS_EVENT = "products:updated"
const CUSTOM_PRODUCTS_ENDPOINT = buildApiUrl("/api/custom-products")

type StoredProduct = BoutiqueProduct & { createdAt: string; updatedAt?: string }
let inMemoryProducts: StoredProduct[] | null = null

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

const normalizeProducts = (value: unknown) => {
  if (!Array.isArray(value)) return [] as StoredProduct[]
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const product = item as StoredProduct
      const image = typeof product.image === "string" ? resolvePublicUrl(product.image) : ""
      const gallery = Array.isArray(product.gallery)
        ? product.gallery.map((entry) => resolvePublicUrl(String(entry || ""))).filter(Boolean)
        : []

      return {
        ...product,
        image,
        gallery: image ? [image, ...gallery.filter((entry) => entry !== image)] : gallery,
        checkoutEnabled: product.checkoutEnabled !== false,
      }
    }) as StoredProduct[]
}

const readLocalProducts = () => {
  try {
    const raw = window.localStorage.getItem(CUSTOM_PRODUCTS_KEY)
    return normalizeProducts(safeParse(raw))
  } catch {
    return [] as StoredProduct[]
  }
}

export const loadCustomProducts = () => {
  if (inMemoryProducts === null) {
    inMemoryProducts = readLocalProducts()
  }
  return [...inMemoryProducts]
}

const emitProductsUpdated = () => {
  window.dispatchEvent(new CustomEvent(CUSTOM_PRODUCTS_EVENT))
}

const writeProducts = (products: StoredProduct[]) => {
  inMemoryProducts = [...products]
  try {
    window.localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products))
  } catch {
    // local cache write can fail (quota/privacy), keep in-memory + server data
  }
  emitProductsUpdated()
}

const buildAuthenticatedJsonHeaders = async () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  const user = auth.currentUser
  if (!user) {
    return headers
  }

  try {
    const token = await user.getIdToken()
    headers.Authorization = `Bearer ${token}`
  } catch {
    // ignore and let the API reject unauthorized requests
  }

  return headers
}

const pushRemoteUpdate = async (payload: Record<string, unknown>) => {
  try {
    const headers = await buildAuthenticatedJsonHeaders()
    const response = await fetch(CUSTOM_PRODUCTS_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as unknown
    return normalizeProducts(data)
  } catch {
    return null
  }
}

export const saveCustomProduct = (product: BoutiqueProduct) => {
  const timestamp = new Date().toISOString()
  const productWithDates: StoredProduct = {
    ...product,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  const existing = loadCustomProducts()
  const next: StoredProduct[] = [
    productWithDates,
    ...existing.filter((item) => item.id !== product.id),
  ]
  writeProducts(next)
  void (async () => {
    const synced = await pushRemoteUpdate({ action: "upsert", product: productWithDates })
    if (synced) {
      writeProducts(synced)
    }
  })()
}

export const publishCustomProduct = async (product: BoutiqueProduct) => {
  const timestamp = new Date().toISOString()
  const productWithDates: StoredProduct = {
    ...product,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
  const synced = await pushRemoteUpdate({ action: "upsert", product: productWithDates })
  if (!synced) {
    throw new Error("Serveur boutique inaccessible. Verifie que le serveur est demarre puis reessaie.")
  }
  writeProducts(synced)
  return synced
}

export const updateCustomProduct = (product: BoutiqueProduct) => {
  const existing = loadCustomProducts()
  const current = existing.find((item) => item.id === product.id)
  const productWithDates: StoredProduct = {
    ...product,
    createdAt: current?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const next = existing.map((item) =>
    item.id === product.id ? productWithDates : item,
  )
  writeProducts(next.length > 0 ? next : [productWithDates, ...existing])
  void (async () => {
    const synced = await pushRemoteUpdate({ action: "upsert", product: productWithDates })
    if (synced) {
      writeProducts(synced)
    }
  })()
}

export const deleteCustomProduct = (productId: string) => {
  const existing = loadCustomProducts()
  const next = existing.filter((item) => item.id !== productId)
  writeProducts(next)
  void (async () => {
    const synced = await pushRemoteUpdate({ action: "delete", productId })
    if (synced) {
      writeProducts(synced)
    }
  })()
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
    const data = (await response.json()) as unknown
    if (!Array.isArray(data)) {
      return loadCustomProducts()
    }
    const normalized = normalizeProducts(data)
    writeProducts(normalized)
    return normalized
  } catch {
    return loadCustomProducts()
  }
}

export const PRODUCTS_UPDATED_EVENT = CUSTOM_PRODUCTS_EVENT
