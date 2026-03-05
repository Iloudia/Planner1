import type { BoutiqueProduct } from "./boutiqueData"

const CART_KEY = "boutique.cart.v1"

type CartItem = {
  productId: string
  quantity: number
  addedAt: string
}

const readCart = (): CartItem[] => {
  const raw = window.localStorage.getItem(CART_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item === "object") as CartItem[]
  } catch {
    return []
  }
}

const writeCart = (items: CartItem[]) => {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent("cart:updated"))
}

export const loadCartItems = () => readCart()

export const addToCart = (product: BoutiqueProduct, quantity = 1) => {
  const items = readCart()
  const existing = items.find((item) => item.productId === product.id)
  if (existing) {
    existing.quantity += quantity
  } else {
    items.unshift({ productId: product.id, quantity, addedAt: new Date().toISOString() })
  }
  writeCart(items)
}

export const removeFromCart = (productId: string) => {
  const items = readCart().filter((item) => item.productId !== productId)
  writeCart(items)
}

export const clearCart = () => writeCart([])

export type { CartItem }
