import type { BoutiqueProduct, BoutiqueProductPromotion } from "../models/product.model"

export const parsePriceToCents = (value: string) => {
  const normalized = String(value || "")
    .trim()
    .replace(/\u00a0/g, "")
    .replace(/\s+/g, "")
    .replace("€", "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "")

  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0
  }

  return Math.round(parsed * 100)
}

export const formatPriceFromCents = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })
    .format(Math.max(value, 0) / 100)
    .replace(/\u00a0/g, " ")

const normalizePromotion = (promotion?: BoutiqueProductPromotion) => {
  if (!promotion?.enabled) return null

  const promoPriceCents = parsePriceToCents(promotion.price)
  if (promoPriceCents <= 0) return null

  const startsAt = promotion.startsAt ? Date.parse(promotion.startsAt) : Number.NaN
  const endsAt = promotion.endsAt ? Date.parse(promotion.endsAt) : Number.NaN
  const now = Date.now()

  if (Number.isFinite(startsAt) && startsAt > now) return null
  if (Number.isFinite(endsAt) && endsAt < now) return null

  return {
    ...promotion,
    price: formatPriceFromCents(promoPriceCents),
    promoPriceCents,
  }
}

export const getProductPricing = (product: Pick<BoutiqueProduct, "price" | "promotion">) => {
  const basePriceCents = parsePriceToCents(product.price)
  const promotion = normalizePromotion(product.promotion)
  const hasActivePromotion = Boolean(promotion && basePriceCents > 0 && promotion.promoPriceCents < basePriceCents)
  const currentPriceCents = hasActivePromotion ? promotion!.promoPriceCents : basePriceCents

  return {
    basePrice: basePriceCents > 0 ? formatPriceFromCents(basePriceCents) : product.price,
    basePriceCents,
    currentPrice: currentPriceCents > 0 ? formatPriceFromCents(currentPriceCents) : product.price,
    currentPriceCents,
    hasActivePromotion,
    promotionLabel: hasActivePromotion ? promotion?.label?.trim() || "" : "",
  }
}

export const normalizePriceInput = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const cents = parsePriceToCents(trimmed)
  return cents > 0 ? formatPriceFromCents(cents) : trimmed
}

export const normalizePromotionPercentage = (value: string | number) => {
  const raw = String(value ?? "").trim().replace(",", ".")
  if (!raw) return 0
  const parsed = Number.parseFloat(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return 0
  return Math.min(Math.round(parsed * 100) / 100, 100)
}

export const getDiscountedPriceFromPercentage = (price: string, percentage: string | number) => {
  const basePriceCents = parsePriceToCents(price)
  const discount = normalizePromotionPercentage(percentage)
  if (basePriceCents <= 0 || discount <= 0) return ""
  const discountedCents = Math.max(Math.round(basePriceCents * (1 - discount / 100)), 0)
  return discountedCents > 0 ? formatPriceFromCents(discountedCents) : ""
}

export const getPromotionPercentageFromPrices = (price: string, promotionPrice: string) => {
  const basePriceCents = parsePriceToCents(price)
  const promoPriceCents = parsePriceToCents(promotionPrice)
  if (basePriceCents <= 0 || promoPriceCents <= 0 || promoPriceCents >= basePriceCents) return 0
  return Math.round(((basePriceCents - promoPriceCents) / basePriceCents) * 10000) / 100
}
