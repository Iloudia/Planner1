import "dotenv/config"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import express from "express"
import multer from "multer"
import Stripe from "stripe"
import { isFirebaseTokenVerificationConfigured, verifyFirebaseIdToken } from "./firebaseTokenVerifier.mjs"
import { deleteMediaFile, isAllowedImageScope, isAllowedVideoScope, storeImage, storeVideo } from "./mediaStorage.mjs"

const app = express()
const port = Number(process.env.PORT || 4242)
const host = process.env.HOST || process.env.SERVER_HOST || "127.0.0.1"

const appBaseUrl = String(process.env.APP_BASE_URL || "http://localhost:5173").trim().replace(/\/+$/g, "")
const apiPublicBaseUrl = String(process.env.API_PUBLIC_BASE_URL || appBaseUrl)
  .trim()
  .replace(/\/+$/g, "")
const defaultDataDir = path.resolve(process.cwd(), "server", "data")
const resolveConfiguredPath = (value, fallback) => path.resolve(String(value || fallback).trim() || fallback)
const customProductsFile = resolveConfiguredPath(process.env.CUSTOM_PRODUCTS_FILE, path.join(defaultDataDir, "custom-products.json"))
const purchasesFile = resolveConfiguredPath(process.env.PURCHASES_FILE, path.join(defaultDataDir, "purchases.json"))
const downloadsDir = process.env.DOWNLOADS_DIR || path.resolve(process.cwd(), "server", "downloads")
const mediaRootDir = process.env.MEDIA_ROOT_DIR || path.resolve(process.cwd(), "server", "media")
const mediaPublicBaseUrl = process.env.MEDIA_PUBLIC_BASE_URL || "/media"
const downloadTokenSecret = String(process.env.DOWNLOAD_TOKEN_SECRET || "").trim()
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ""
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""
const emailAttachmentMaxBytes = Math.max(Number.parseInt(process.env.EMAIL_ATTACHMENT_MAX_BYTES || "", 10) || 20 * 1024 * 1024, 0)
const adminEmails = new Set(
  String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean),
)

if (!downloadTokenSecret || downloadTokenSecret === "replace-me") {
  throw new Error("DOWNLOAD_TOKEN_SECRET must be set with a strong random value.")
}

if (!stripeSecretKey) {
  console.warn("Missing STRIPE_SECRET_KEY. Stripe calls will fail until it is set.")
}

if (adminEmails.size === 0) {
  console.warn("ADMIN_EMAILS is empty. Only Firebase tokens with admin custom claim can manage custom products.")
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" })
const MAX_UPLOAD_BYTES = 60 * 1024 * 1024
const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
  },
})
const mediaVideoUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
  },
})
const digitalDownloadUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
    files: 10,
  },
})

const seedCatalogProducts = [
  {
    id: "ebook-clarte",
    name: "Ebook Clarte d'offre",
    priceCents: 1900,
    digitalFiles: [
      {
        id: "main",
        originalName: "ebook-clarte.pdf",
        downloadName: "ebook-clarte.pdf",
        storagePath: "ebook-clarte.pdf",
        mimeType: "application/pdf",
      },
    ],
  },
  {
    id: "template-lancement",
    name: "Pack Templates Lancement",
    priceCents: 2900,
    digitalFiles: [
      {
        id: "main",
        originalName: "template-lancement.zip",
        downloadName: "template-lancement.zip",
        storagePath: "template-lancement.zip",
        mimeType: "application/zip",
      },
    ],
  },
  {
    id: "carrousel-conversion",
    name: "Kit Carrousel Conversion",
    priceCents: 2400,
    digitalFiles: [
      {
        id: "main",
        originalName: "carrousel-conversion.zip",
        downloadName: "carrousel-conversion.zip",
        storagePath: "carrousel-conversion.zip",
        mimeType: "application/zip",
      },
    ],
  },
  {
    id: "ebook-pricing",
    name: "Ebook Pricing Magnetique",
    priceCents: 1700,
    digitalFiles: [
      {
        id: "main",
        originalName: "ebook-pricing.pdf",
        downloadName: "ebook-pricing.pdf",
        storagePath: "ebook-pricing.pdf",
        mimeType: "application/pdf",
      },
    ],
  },
  {
    id: "template-portfolio",
    name: "Templates Portfolio Insta",
    priceCents: 2600,
    digitalFiles: [
      {
        id: "main",
        originalName: "template-portfolio.zip",
        downloadName: "template-portfolio.zip",
        storagePath: "template-portfolio.zip",
        mimeType: "application/zip",
      },
    ],
  },
  {
    id: "carrousel-story",
    name: "Carrousels Storytelling",
    priceCents: 2200,
    digitalFiles: [
      {
        id: "main",
        originalName: "carrousel-story.zip",
        downloadName: "carrousel-story.zip",
        storagePath: "carrousel-story.zip",
        mimeType: "application/zip",
      },
    ],
  },
  {
    id: "bundle-creator",
    name: "Bundle Creator Focus",
    priceCents: 4900,
    digitalFiles: [
      {
        id: "main",
        originalName: "bundle-creator.zip",
        downloadName: "bundle-creator.zip",
        storagePath: "bundle-creator.zip",
        mimeType: "application/zip",
      },
    ],
  },
  {
    id: "ebook-plan",
    name: "Ebook Plan d'action 30 jours",
    priceCents: 2100,
    digitalFiles: [
      {
        id: "main",
        originalName: "ebook-plan.pdf",
        downloadName: "ebook-plan.pdf",
        storagePath: "ebook-plan.pdf",
        mimeType: "application/pdf",
      },
    ],
  },
]

const allowedMockups = new Set(["ebook", "template", "carousel", "bundle"])
const allowedDigitalMimeTypes = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
])
const allowedDigitalExtensions = new Set([".pdf", ".zip"])
const seedCatalogById = new Map(seedCatalogProducts.map((product) => [product.id, product]))

const ensureForwardSlashes = (value) => String(value || "").replace(/\\/g, "/")
const toSafeSegment = (value, fallback = "asset") =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback
const joinBaseUrl = (baseUrl, relativePath) => `${String(baseUrl || "").replace(/\/+$/g, "")}${relativePath}`
const createHttpError = (statusCode, message) => Object.assign(new Error(message), { statusCode })
const safeParseJson = (value, fallback = null) => {
  try {
    return JSON.parse(String(value || ""))
  } catch {
    return fallback
  }
}

const writeJsonFileAtomic = (targetFile, payload) => {
  fs.mkdirSync(path.dirname(targetFile), { recursive: true })
  const temporaryFile = `${targetFile}.${process.pid}.${crypto.randomUUID()}.tmp`
  try {
    fs.writeFileSync(temporaryFile, JSON.stringify(payload, null, 2), "utf-8")
    fs.renameSync(temporaryFile, targetFile)
  } catch (error) {
    if (fs.existsSync(temporaryFile)) {
      fs.unlinkSync(temporaryFile)
    }
    throw error
  }
}

const formatPriceFromCents = (value) => {
  const cents = Number(value)
  if (!Number.isFinite(cents) || cents <= 0) {
    return ""
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })
    .format(cents / 100)
    .replace(/\u00a0/g, " ")
}

const parsePriceToCents = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(Math.round(value * 100), 0)
  }

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

const sanitizeText = (value, maxLength = 4000) => String(value || "").trim().slice(0, maxLength)
const escapeHtml = (value) =>
  String(value || "").replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      case "'":
        return "&#39;"
      default:
        return character
    }
  })

const sanitizeStringArray = (value, maxItems = 12, maxLength = 240) => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((entry) => sanitizeText(entry, maxLength))
    .filter(Boolean)
    .slice(0, maxItems)
}

const sanitizeFileName = (value, fallback = "fichier") => {
  const raw = path.basename(String(value || "").trim())
  const ext = path.extname(raw).toLowerCase()
  const base = path.basename(raw, ext)
  const safeBase =
    base
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  const safeExt = allowedDigitalExtensions.has(ext) ? ext : ""
  return `${safeBase}${safeExt}`
}

const detectDigitalMimeType = (fileName, mimeType) => {
  const extension = path.extname(String(fileName || "")).toLowerCase()
  if (allowedDigitalExtensions.has(extension)) {
    return extension === ".zip" ? "application/zip" : "application/pdf"
  }
  if (allowedDigitalMimeTypes.has(String(mimeType || "").toLowerCase())) {
    return String(mimeType || "").toLowerCase()
  }
  return ""
}

const normalizeStoredDigitalFiles = (value) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => {
      const downloadName = sanitizeFileName(entry?.downloadName || entry?.originalName || "fichier")
      const mimeType = detectDigitalMimeType(downloadName, entry?.mimeType)
      const storagePath = ensureForwardSlashes(String(entry?.storagePath || "")).replace(/^\/+/g, "")
      if (!downloadName || !mimeType || !storagePath) {
        return null
      }

      return {
        id: sanitizeText(entry?.id, 120) || crypto.randomUUID(),
        originalName: sanitizeText(entry?.originalName || downloadName, 255) || downloadName,
        downloadName,
        storagePath,
        mimeType,
        sizeBytes: Math.max(Number(entry?.sizeBytes || 0), 0),
      }
    })
    .filter(Boolean)
}

const normalizeGallery = (value) => {
  const gallery = sanitizeStringArray(value, 6, 4000)
  return gallery
}

const normalizePromotionPayload = (value) => {
  if (!value || typeof value !== "object" || value.enabled !== true) {
    return undefined
  }

  const rawPrice = sanitizeText(value.price, 80)
  const priceCents = parsePriceToCents(rawPrice)
  if (priceCents <= 0) {
    return undefined
  }

  const startsAt = sanitizeText(value.startsAt, 80)
  const endsAt = sanitizeText(value.endsAt, 80)

  return {
    enabled: true,
    price: formatPriceFromCents(priceCents),
    label: sanitizeText(value.label, 80),
    startsAt,
    endsAt,
  }
}

const isPromotionActive = (promotion) => {
  if (!promotion?.enabled) {
    return false
  }

  const now = Date.now()
  const startsAt = promotion.startsAt ? Date.parse(promotion.startsAt) : Number.NaN
  const endsAt = promotion.endsAt ? Date.parse(promotion.endsAt) : Number.NaN

  if (Number.isFinite(startsAt) && startsAt > now) {
    return false
  }
  if (Number.isFinite(endsAt) && endsAt < now) {
    return false
  }

  return true
}

const getEffectiveProductPrice = (product) => {
  const basePrice = sanitizeText(product?.price, 80)
  const basePriceCents = parsePriceToCents(basePrice)
  const promotion = normalizePromotionPayload(product?.promotion)
  const promotionPriceCents = parsePriceToCents(promotion?.price)

  if (promotion && isPromotionActive(promotion) && promotionPriceCents > 0 && promotionPriceCents < basePriceCents) {
    return {
      price: promotion.price,
      priceCents: promotionPriceCents,
      promotion,
    }
  }

  return {
    price: basePrice,
    priceCents: basePriceCents,
    promotion,
  }
}

const normalizeCustomProductPayload = (product, existingProduct) => {
  const id = sanitizeText(product?.id || existingProduct?.id, 160)
  const title = sanitizeText(product?.title || existingProduct?.title, 180)
  const rawPrice = sanitizeText(product?.price || existingProduct?.price, 80)
  const priceCents = parsePriceToCents(rawPrice)
  const promotion = normalizePromotionPayload(product?.promotion ?? existingProduct?.promotion)
  const image = sanitizeText(product?.image || existingProduct?.image, 4000)
  const video = sanitizeText(product?.video || existingProduct?.video, 4000)
  const gallery = normalizeGallery(product?.gallery ?? existingProduct?.gallery)
  const normalizedGallery = image ? [image, ...gallery.filter((entry) => entry !== image)].slice(0, 6) : gallery.slice(0, 6)
  const digitalFiles = normalizeStoredDigitalFiles(product?.digitalFiles)
  const preservedDigitalFiles = digitalFiles.length > 0 ? digitalFiles : normalizeStoredDigitalFiles(existingProduct?.digitalFiles)
  const features = sanitizeStringArray(product?.features, 12, 240)
  const fallbackFeatures = sanitizeStringArray(existingProduct?.features, 12, 240)

  return {
    id,
    title,
    benefit: sanitizeText(product?.benefit || existingProduct?.benefit || title, 220),
    price: priceCents > 0 ? formatPriceFromCents(priceCents) : rawPrice,
    promotion,
    format: sanitizeText(product?.format || existingProduct?.format || "PDF - contenu digital", 120),
    formatLabel: sanitizeText(product?.formatLabel || existingProduct?.formatLabel || "PDF", 80),
    badge: sanitizeText(product?.badge || existingProduct?.badge, 80),
    mockup: allowedMockups.has(String(product?.mockup || existingProduct?.mockup)) ? String(product?.mockup || existingProduct?.mockup) : "ebook",
    bestSeller: Boolean(product?.bestSeller ?? existingProduct?.bestSeller),
    image: image || normalizedGallery[0] || "",
    video,
    gallery: normalizedGallery,
    description: sanitizeText(product?.description || existingProduct?.description, 6000),
    features:
      features.length > 0
        ? features
        : fallbackFeatures.length > 0
          ? fallbackFeatures
          : ["Ressource digitale", "Acces immediat", "Usage commercial autorise"],
    digitalFiles: preservedDigitalFiles,
    createdAt: sanitizeText(existingProduct?.createdAt || product?.createdAt, 80) || new Date().toISOString(),
    updatedAt: sanitizeText(product?.updatedAt || existingProduct?.updatedAt, 80) || new Date().toISOString(),
  }
}

const validateCustomProduct = (product) => {
  if (!product?.id) {
    return "Identifiant produit manquant."
  }
  if (!product?.title) {
    return "Titre produit manquant."
  }
  if (parsePriceToCents(product?.price) <= 0) {
    return "Prix produit invalide."
  }
  if (!normalizeStoredDigitalFiles(product?.digitalFiles).length) {
    return "Ajoute au moins un fichier numerique avant publication."
  }
  return null
}

const readStoredCustomProducts = () => {
  try {
    if (!fs.existsSync(customProductsFile)) {
      return []
    }
    const raw = fs.readFileSync(customProductsFile, "utf-8")
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
      .map((entry) => normalizeCustomProductPayload(entry))
      .filter((entry) => entry.id)
  } catch (error) {
    console.error("Failed to read custom products:", error)
    return []
  }
}

const writeCustomProducts = (items) => {
  try {
    const normalizedItems = Array.isArray(items)
      ? items.map((entry) => normalizeCustomProductPayload(entry)).filter((entry) => entry.id)
      : []
    writeJsonFileAtomic(customProductsFile, normalizedItems)
  } catch (error) {
    console.error("Failed to write custom products:", error)
  }
}

const toPublicCustomProduct = (product) => ({
  id: product.id,
  title: product.title,
  benefit: product.benefit,
  price: product.price,
  promotion: product.promotion,
  format: product.format,
  formatLabel: product.formatLabel,
  badge: product.badge,
  mockup: product.mockup,
  bestSeller: product.bestSeller,
  image: product.image,
  video: product.video || "",
  gallery: product.gallery,
  description: product.description,
  features: product.features,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  checkoutEnabled: normalizeStoredDigitalFiles(product.digitalFiles).length > 0 && parsePriceToCents(product.price) > 0,
})

const getCatalogProductsById = () => {
  const catalog = new Map(seedCatalogById)
  for (const product of readStoredCustomProducts()) {
    const effectivePricing = getEffectiveProductPrice(product)
    catalog.set(product.id, {
      id: product.id,
      name: product.title,
      priceCents: effectivePricing.priceCents,
      price: effectivePricing.price,
      image: product.image,
      formatLabel: product.formatLabel,
      digitalFiles: normalizeStoredDigitalFiles(product.digitalFiles),
    })
  }
  return catalog
}

const getCatalogProductOrThrow = (productId) => {
  const catalogProduct = getCatalogProductsById().get(productId)
  if (!catalogProduct) {
    throw createHttpError(404, `Produit introuvable: ${productId}`)
  }
  if (!Array.isArray(catalogProduct.digitalFiles) || catalogProduct.digitalFiles.length === 0) {
    throw createHttpError(400, "Ce produit n'a pas encore de fichier telechargeable configure.")
  }
  if (!Number.isFinite(catalogProduct.priceCents) || catalogProduct.priceCents <= 0) {
    throw createHttpError(400, "Ce produit n'a pas de prix valide.")
  }
  return catalogProduct
}

const resolveDownloadAbsolutePath = (storagePath) => {
  const normalizedPath = ensureForwardSlashes(String(storagePath || "")).replace(/^\/+/g, "")
  const absolutePath = path.resolve(downloadsDir, normalizedPath)
  const downloadsRoot = path.resolve(downloadsDir)
  if (!absolutePath.startsWith(downloadsRoot)) {
    throw createHttpError(400, "Chemin de telechargement invalide.")
  }
  return absolutePath
}

const buildProductEmailAttachments = (cartItems) => {
  const catalog = getCatalogProductsById()
  const attachments = []
  let attachedPdfCount = 0
  let skippedPdfCount = 0
  let hasNonPdfFiles = false
  let totalAttachedBytes = 0

  for (const item of cartItems) {
    const product = catalog.get(item.productId)
    if (!product) {
      continue
    }

    for (const file of normalizeStoredDigitalFiles(product.digitalFiles)) {
      if (file.mimeType !== "application/pdf") {
        hasNonPdfFiles = true
        continue
      }

      try {
        const absolutePath = resolveDownloadAbsolutePath(file.storagePath)
        if (!fs.existsSync(absolutePath)) {
          skippedPdfCount += 1
          console.warn("Purchase email attachment skipped: file missing", {
            productId: product.id,
            storagePath: file.storagePath,
          })
          continue
        }

        const stats = fs.statSync(absolutePath)
        const fileSize = Math.max(stats.size || file.sizeBytes || 0, 0)
        if (!fileSize || totalAttachedBytes + fileSize > emailAttachmentMaxBytes) {
          skippedPdfCount += 1
          console.warn("Purchase email attachment skipped: size limit exceeded", {
            productId: product.id,
            storagePath: file.storagePath,
            fileSize,
            totalAttachedBytes,
            emailAttachmentMaxBytes,
          })
          continue
        }

        attachments.push({
          filename: sanitizeFileName(file.downloadName || `${product.id}.pdf`),
          content: fs.readFileSync(absolutePath).toString("base64"),
        })
        totalAttachedBytes += fileSize
        attachedPdfCount += 1
      } catch (error) {
        skippedPdfCount += 1
        console.warn("Purchase email attachment skipped: unexpected error", {
          productId: product.id,
          storagePath: file.storagePath,
          details: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }

  return {
    attachments,
    attachedPdfCount,
    skippedPdfCount,
    hasNonPdfFiles,
  }
}

const deleteDownloadFiles = (digitalFiles) => {
  for (const file of normalizeStoredDigitalFiles(digitalFiles)) {
    try {
      const absolutePath = resolveDownloadAbsolutePath(file.storagePath)
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath)
      }
    } catch (error) {
      console.warn("Failed to delete digital file", {
        storagePath: file?.storagePath ?? null,
        details: error instanceof Error ? error.message : String(error),
      })
    }
  }
}

const storeDigitalFile = ({ file, uid, productId }) => {
  const safeProductId = toSafeSegment(productId, "produit")
  const safeUid = toSafeSegment(uid, "admin")
  const extension = path.extname(String(file?.originalname || "")).toLowerCase()
  const detectedMimeType = detectDigitalMimeType(file?.originalname, file?.mimetype)
  if (!allowedDigitalExtensions.has(extension) || !detectedMimeType) {
    throw createHttpError(400, "Seuls les fichiers PDF et ZIP sont acceptes.")
  }

  const relativeDirectory = path.join("custom-products", safeUid, safeProductId)
  const storedFileName = `${Date.now()}-${crypto.randomUUID()}${extension}`
  const storagePath = ensureForwardSlashes(path.join(relativeDirectory, storedFileName))
  const absolutePath = resolveDownloadAbsolutePath(storagePath)

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  fs.writeFileSync(absolutePath, file.buffer)

  return {
    id: crypto.randomUUID(),
    originalName: sanitizeText(file.originalname, 255) || storedFileName,
    downloadName: sanitizeFileName(file.originalname || storedFileName),
    storagePath,
    mimeType: detectedMimeType,
    sizeBytes: file.buffer.byteLength,
  }
}

const normalizeCheckoutQuantity = (value) => {
  const quantity = Number.parseInt(String(value || "1"), 10)
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return 1
  }
  return Math.min(quantity, 99)
}

const normalizeCheckoutItems = ({ productId, items }) => {
  const rawItems = Array.isArray(items)
    ? items
        .map((item) => ({
          productId: sanitizeText(item?.productId, 160),
          quantity: normalizeCheckoutQuantity(item?.quantity),
        }))
        .filter((item) => item.productId)
    : productId
      ? [{ productId: sanitizeText(productId, 160), quantity: 1 }]
      : []

  const uniqueItems = new Map()
  for (const item of rawItems) {
    const existingItem = uniqueItems.get(item.productId)
    uniqueItems.set(item.productId, {
      productId: item.productId,
      quantity: existingItem ? normalizeCheckoutQuantity(existingItem.quantity + item.quantity) : item.quantity,
    })
  }
  return [...uniqueItems.values()]
}

const createDownloadToken = ({ productId, assetId, sessionId, uid, expiresInHours = 48 }) => {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000
  const payload = JSON.stringify({ productId, assetId, sessionId, uid, exp })
  const payloadEncoded = Buffer.from(payload).toString("base64url")
  const signature = crypto.createHmac("sha256", downloadTokenSecret).update(payloadEncoded).digest("base64url")
  return `${payloadEncoded}.${signature}`
}

const verifyDownloadToken = (token) => {
  if (!token || !token.includes(".")) {
    return null
  }

  const [payloadEncoded, signature] = token.split(".")
  const expected = crypto.createHmac("sha256", downloadTokenSecret).update(payloadEncoded).digest("base64url")
  const signatureBuffer = Buffer.from(signature || "")
  const expectedBuffer = Buffer.from(expected)
  if (signatureBuffer.length !== expectedBuffer.length) {
    return null
  }
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadEncoded, "base64url").toString("utf-8"))
    if (!payload?.exp || Date.now() > payload.exp) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

const buildProductDownloads = (cartItems, ownerContext) => {
  const catalog = getCatalogProductsById()
  const downloads = []
  for (const item of cartItems) {
    const product = catalog.get(item.productId)
    if (!product) {
      continue
    }

    for (const file of normalizeStoredDigitalFiles(product.digitalFiles)) {
      const token = createDownloadToken({
        productId: product.id,
        assetId: file.id,
        sessionId: ownerContext.sessionId,
        uid: ownerContext.uid,
      })
      downloads.push({
        downloadUrl: joinBaseUrl(apiPublicBaseUrl, `/api/download?token=${token}`),
        productName: product.name,
        fileName: file.downloadName,
        label: `${product.name} - ${file.downloadName}`,
      })
    }
  }
  return downloads
}

const parseOrigins = () => {
  const raw = process.env.CORS_ORIGINS || appBaseUrl
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

const allowedOrigins = parseOrigins()

const isAdminToken = (decodedToken) => {
  if (!decodedToken || typeof decodedToken !== "object") {
    return false
  }
  if (decodedToken.admin === true || decodedToken.role === "admin") {
    return true
  }
  const email = typeof decodedToken.email === "string" ? decodedToken.email.toLowerCase() : ""
  return Boolean(email && adminEmails.has(email))
}

const createRateLimiter = ({ windowMs, max, keyPrefix }) => {
  const hits = new Map()
  const cleanup = () => {
    const now = Date.now()
    for (const [key, entry] of hits.entries()) {
      if (entry.resetAt <= now) {
        hits.delete(key)
      }
    }
  }
  const timer = setInterval(cleanup, Math.max(windowMs, 30000))
  if (typeof timer.unref === "function") {
    timer.unref()
  }

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown"
    const key = `${keyPrefix}:${ip}`
    const now = Date.now()
    const current = hits.get(key)

    if (!current || current.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }

    if (current.count >= max) {
      const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000)
      res.setHeader("Retry-After", String(Math.max(retryAfterSeconds, 1)))
      return res.status(429).json({ error: "Trop de requetes. Merci de reessayer dans quelques instants." })
    }

    current.count += 1
    hits.set(key, current)
    return next()
  }
}

app.set("trust proxy", process.env.TRUST_PROXY === "1" || process.env.TRUST_PROXY === "true")

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin)
    res.header("Vary", "Origin")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "Authorization,Content-Type")
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }
  next()
})

app.use("/api/stripe-webhook", express.raw({ type: "application/json" }))
app.use(express.json({ limit: "50mb" }))
app.use("/media", express.static(mediaRootDir))

const apiRateLimit = createRateLimiter({ windowMs: 60 * 1000, max: 180, keyPrefix: "api" })
const sensitiveApiRateLimit = createRateLimiter({ windowMs: 60 * 1000, max: 30, keyPrefix: "sensitive" })

app.use("/api", apiRateLimit)
app.use("/api/custom-products", sensitiveApiRateLimit)
app.use("/api/media", sensitiveApiRateLimit)
app.use("/api/create-checkout-session", sensitiveApiRateLimit)
app.use("/api/checkout-session", sensitiveApiRateLimit)
app.use("/api/my-purchases", sensitiveApiRateLimit)
app.use("/api/download", sensitiveApiRateLimit)
app.use("/api/email", sensitiveApiRateLimit)

const firebaseAuth = async (req, res, next) => {
  if (!isFirebaseTokenVerificationConfigured) {
    return res.status(503).json({ error: "Firebase Auth n'est pas configure cote serveur." })
  }

  const authorization = req.headers.authorization || ""
  const [scheme, token] = authorization.split(" ")
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentification requise." })
  }

  try {
    const decoded = await verifyFirebaseIdToken(token)
    req.user = decoded
    return next()
  } catch (error) {
    console.error("Firebase auth failed:", error)
    return res.status(401).json({ error: "Jeton Firebase invalide." })
  }
}

const adminOnly = (req, res, next) => {
  const allowed = isAdminToken(req.user)
  if (allowed) {
    console.log("Admin access granted", {
      path: req.path,
      email: req.user?.email ?? null,
      uid: req.user?.uid ?? null,
    })
    return next()
  }
  console.warn("Admin access denied", {
    path: req.path,
    email: req.user?.email ?? null,
    uid: req.user?.uid ?? null,
    adminClaim: req.user?.admin === true,
    role: req.user?.role ?? null,
    adminEmailsConfigured: adminEmails.size,
  })
  return res.status(403).json({ error: "Acces admin requis." })
}

app.post("/api/media/upload-image", firebaseAuth, mediaUpload.single("file"), async (req, res) => {
  try {
    const scope = String(req.body?.scope || "")
    const entityId = String(req.body?.entityId || "")
    const uid = req.user?.uid
    const file = req.file

    if (!uid) {
      return res.status(401).json({ error: "Utilisateur introuvable." })
    }
    if (!file || !file.buffer) {
      return res.status(400).json({ error: "Aucun fichier image recu." })
    }
    if (!isAllowedImageScope(scope)) {
      return res.status(400).json({ error: "Scope media invalide." })
    }
    if (!file.mimetype?.startsWith("image/")) {
      return res.status(400).json({ error: "Seules les images sont acceptees." })
    }

    const payload = await storeImage({
      buffer: file.buffer,
      uid,
      scope,
      entityId,
      mediaRootDir,
      publicBaseUrl: mediaPublicBaseUrl,
    })

    return res.json(payload)
  } catch (error) {
    console.error("Media upload failed:", error)
    return res.status(500).json({ error: "Impossible de televerser cette image." })
  }
})

app.post("/api/media/upload-video", firebaseAuth, mediaVideoUpload.single("file"), async (req, res) => {
  try {
    const scope = String(req.body?.scope || "")
    const entityId = String(req.body?.entityId || "")
    const uid = req.user?.uid
    const file = req.file

    if (!uid) {
      return res.status(401).json({ error: "Utilisateur introuvable." })
    }
    if (!file || !file.buffer) {
      return res.status(400).json({ error: "Aucun fichier video recu." })
    }
    if (!isAllowedVideoScope(scope)) {
      return res.status(400).json({ error: "Scope media invalide." })
    }
    if (!file.mimetype?.startsWith("video/")) {
      return res.status(400).json({ error: "Seules les videos sont acceptees." })
    }

    const payload = await storeVideo({
      buffer: file.buffer,
      uid,
      scope,
      entityId,
      mediaRootDir,
      publicBaseUrl: mediaPublicBaseUrl,
      originalName: file.originalname,
      mimeType: file.mimetype,
    })

    return res.json(payload)
  } catch (error) {
    console.error("Video upload failed:", error)
    return res.status(500).json({ error: "Impossible de televerser cette video." })
  }
})

app.post("/api/media/delete", firebaseAuth, async (req, res) => {
  try {
    const uid = req.user?.uid
    const relativePath = String(req.body?.path || "")
    if (!uid) {
      return res.status(401).json({ error: "Utilisateur introuvable." })
    }
    if (!relativePath) {
      return res.status(400).json({ error: "Chemin media manquant." })
    }

    await deleteMediaFile({ uid, relativePath, mediaRootDir })
    return res.json({ ok: true })
  } catch (error) {
    console.error("Media delete failed:", error)
    return res.status(400).json({ error: "Impossible de supprimer ce media." })
  }
})

app.get("/api/custom-products", (req, res) => {
  const items = readStoredCustomProducts().map(toPublicCustomProduct)
  return res.json(items)
})

app.post("/api/custom-products/upload-digital-file", firebaseAuth, adminOnly, digitalDownloadUpload.array("files", 10), async (req, res) => {
  try {
    const uid = req.user?.uid
    const productId = sanitizeText(req.body?.productId, 160)
    const files = Array.isArray(req.files) ? req.files : []

    if (!uid) {
      return res.status(401).json({ error: "Utilisateur introuvable." })
    }
    if (!productId) {
      return res.status(400).json({ error: "Identifiant produit manquant." })
    }
    if (files.length === 0) {
      return res.status(400).json({ error: "Ajoute au moins un fichier numerique." })
    }

    const uploadedFiles = files.map((file) =>
      storeDigitalFile({
        file,
        uid,
        productId,
      }),
    )

    return res.json({ files: uploadedFiles })
  } catch (error) {
    console.error("Digital file upload failed:", error)
    return res.status(error?.statusCode || 500).json({
      error: error instanceof Error ? error.message : "Impossible de televerser ce fichier numerique.",
    })
  }
})

app.post("/api/custom-products", firebaseAuth, adminOnly, (req, res) => {
  const { action, product, productId } = req.body || {}
  const items = readStoredCustomProducts()

  if (action === "delete" && productId) {
    const existingProduct = items.find((item) => item?.id === productId)
    const next = items.filter((item) => item?.id !== productId)
    if (existingProduct) {
      deleteDownloadFiles(existingProduct.digitalFiles)
    }
    writeCustomProducts(next)
    return res.json(next.map(toPublicCustomProduct))
  }

  if (product && product.id) {
    const existingProduct = items.find((item) => item?.id === product.id)
    const normalizedProduct = {
      ...normalizeCustomProductPayload(product, existingProduct),
      updatedAt: new Date().toISOString(),
    }
    const validationError = validateCustomProduct(normalizedProduct)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const previousFiles = normalizeStoredDigitalFiles(existingProduct?.digitalFiles)
    const nextFiles = normalizeStoredDigitalFiles(normalizedProduct.digitalFiles)
    const nextFilePaths = new Set(nextFiles.map((entry) => entry.storagePath))
    const staleFiles = previousFiles.filter((entry) => !nextFilePaths.has(entry.storagePath))
    if (staleFiles.length > 0) {
      deleteDownloadFiles(staleFiles)
    }

    const next = items.filter((item) => item?.id !== product.id)
    next.unshift(normalizedProduct)
    writeCustomProducts(next)
    return res.json(next.map(toPublicCustomProduct))
  }

  return res.status(400).json({ error: "Requete invalide." })
})

const sendResendEmail = async ({ to, subject, html, attachments, idempotencyKey }) => {
  const resendApiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || "MeAndRituals <no-reply@example.com>"
  if (!resendApiKey) {
    console.warn("Missing RESEND_API_KEY. Email not sent.")
    return
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        ...(Array.isArray(attachments) && attachments.length > 0 ? { attachments } : {}),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Resend email send failed", {
        to,
        subject,
        status: response.status,
        details: errorText,
      })
      throw new Error(`Resend API error (${response.status}): ${errorText}`)
    }

    const payload = await response.json().catch(() => ({}))
    console.log("Resend email sent", {
      to,
      subject,
      id: payload?.id ?? null,
    })
    return { id: payload?.id ?? null }
  } catch (error) {
    console.error("Resend email unexpected error", {
      to,
      subject,
      details: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

const sendDownloadEmail = async ({ to, items, attachments, attachedPdfCount = 0, skippedPdfCount = 0, hasNonPdfFiles = false, sessionId }) => {
  const subject = "Merci pour ton achat | Tes fichiers MeAndRituals"
  const purchasesUrl = `${appBaseUrl}/mes-achats`
  const list = items
    .map(
      (item) =>
        `
          <tr>
            <td style="padding:0 0 14px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #eadfce;border-radius:14px;background:#fcf8f2;">
                <tr>
                  <td style="padding:16px 18px;font-family:Arial,sans-serif;color:#2b241c;">
                    <p style="margin:0 0 6px;font-size:15px;line-height:1.5;font-weight:700;">${escapeHtml(item.label || item.productName)}</p>
                    <p style="margin:0 0 14px;font-size:13px;line-height:1.6;color:#7c6c5a;">Lien securise valable 48 heures.</p>
                    <a href="${item.downloadUrl}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:#1f1b16;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">
                      Telecharger
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `,
    )
    .join("")
  const attachmentNote =
    attachedPdfCount > 0
      ? `<p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#2b241c;">${attachedPdfCount} PDF ${attachedPdfCount > 1 ? "sont joints" : "est joint"} a cet email pour un acces immediat.</p>`
      : ""
  const skippedNote =
    skippedPdfCount > 0
      ? `<p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#7a3d2b;">Certains PDF n'ont pas pu etre joints car ils sont trop volumineux pour un email. Utilise les liens de telechargement ci-dessous.</p>`
      : ""
  const zipNote = hasNonPdfFiles
    ? `<p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#2b241c;">Les fichiers ZIP ou autres ressources complementaires restent disponibles via les liens securises ci-dessous.</p>`
    : ""
  const html = `
    <div style="margin:0;padding:32px 16px;background:#fff8f1;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
        Merci pour ton achat. Tes fichiers sont prets et tes PDF sont joints a cet email quand leur taille le permet.
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #f3e7d7;border-radius:18px;overflow:hidden;">
        <tr>
          <td style="padding:24px 28px;background:linear-gradient(135deg,#1f1b16 0%,#3a2f24 100%);">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;letter-spacing:1px;color:#f8e7d0;text-transform:uppercase;">MeAndRituals</p>
            <h1 style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#ffffff;font-weight:600;">Merci pour ton achat</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 28px 20px;font-family:Arial,sans-serif;color:#2b241c;">
            <p style="margin:0 0 14px;font-size:18px;line-height:1.4;font-weight:600;">Tes fichiers sont prets.</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">
              Merci pour ta commande sur MeAndRituals. Tu trouveras ci-dessous tes liens de telechargement securises.
            </p>
            ${attachmentNote}
            ${skippedNote}
            ${zipNote}
            <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#7c6c5a;">
              Si besoin, tu peux aussi retrouver tes achats dans ton espace personnel.
            </p>
            <a href="${purchasesUrl}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#d6b98c;color:#1f1b16;text-decoration:none;font-size:14px;font-weight:700;">
              Ouvrir mes achats
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              ${list}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px 24px;border-top:1px solid #f2ece4;font-family:Arial,sans-serif;color:#7c6c5a;font-size:12px;line-height:1.7;">
            Les liens ci-dessus expirent dans 48 heures. Si un lien a expire, reconnecte-toi a ton compte et ouvre la page Mes achats.
          </td>
        </tr>
      </table>
    </div>
  `

  await sendResendEmail({
    to,
    subject,
    html,
    attachments,
    idempotencyKey: sessionId ? `purchase-email:${sessionId}` : undefined,
  })
}

const sanitizeName = (value) => String(value || "").replace(/[<>&"']/g, "")
const normalizeEmailValue = (value) => String(value || "").trim().toLowerCase()

const normalizePurchaseRecord = (entry, existingRecord) => {
  const sessionId = sanitizeText(entry?.sessionId || existingRecord?.sessionId, 255)
  const uid = sanitizeText(entry?.uid || existingRecord?.uid, 128)
  const items = normalizeCheckoutItems({ items: entry?.items ?? existingRecord?.items })

  if (!sessionId || !uid || items.length === 0) {
    return null
  }

  return {
    sessionId,
    uid,
    email: normalizeEmailValue(entry?.email || existingRecord?.email || ""),
    paymentStatus: sanitizeText(entry?.paymentStatus || existingRecord?.paymentStatus || "paid", 80) || "paid",
    purchasedAt: sanitizeText(entry?.purchasedAt || existingRecord?.purchasedAt, 80) || new Date().toISOString(),
    items,
    stripeCustomerId: sanitizeText(entry?.stripeCustomerId || existingRecord?.stripeCustomerId, 255),
    paymentIntentId: sanitizeText(entry?.paymentIntentId || existingRecord?.paymentIntentId, 255),
    emailSentAt: sanitizeText(entry?.emailSentAt || existingRecord?.emailSentAt, 80) || null,
  }
}

const readPurchaseRecords = () => {
  try {
    if (!fs.existsSync(purchasesFile)) {
      return []
    }
    const parsed = safeParseJson(fs.readFileSync(purchasesFile, "utf-8"), [])
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
      .map((entry) => normalizePurchaseRecord(entry))
      .filter(Boolean)
  } catch (error) {
    console.error("Failed to read purchase records:", error)
    return []
  }
}

const writePurchaseRecords = (records) => {
  const normalizedRecords = Array.isArray(records)
    ? records.map((entry) => normalizePurchaseRecord(entry)).filter(Boolean)
    : []
  writeJsonFileAtomic(purchasesFile, normalizedRecords)
}

const findPurchaseRecordBySessionId = (sessionId) =>
  readPurchaseRecords().find((entry) => entry.sessionId === sanitizeText(sessionId, 255)) || null

const upsertPurchaseRecord = (record) => {
  const existingRecords = readPurchaseRecords()
  const existingRecord = existingRecords.find((entry) => entry.sessionId === record?.sessionId)
  const normalizedRecord = normalizePurchaseRecord(record, existingRecord)
  if (!normalizedRecord) {
    throw createHttpError(400, "Enregistrement d'achat invalide.")
  }

  const nextRecords = [
    normalizedRecord,
    ...existingRecords.filter((entry) => entry.sessionId !== normalizedRecord.sessionId),
  ]
  writePurchaseRecords(nextRecords)
  return normalizedRecord
}

const markPurchaseEmailSent = (sessionId) => {
  const existingRecord = findPurchaseRecordBySessionId(sessionId)
  if (!existingRecord || existingRecord.emailSentAt) {
    return existingRecord
  }

  return upsertPurchaseRecord({
    ...existingRecord,
    emailSentAt: new Date().toISOString(),
  })
}

const getSessionOwnerUid = (session) =>
  sanitizeText(session?.metadata?.uid || session?.client_reference_id, 128)

const getSessionCustomerEmail = (session) =>
  normalizeEmailValue(session?.customer_details?.email || session?.customer_email || session?.metadata?.email || "")

const getCheckoutItemsFromSession = (session) =>
  normalizeCheckoutItems({
    items: safeParseJson(session?.metadata?.items, []),
  })

const buildPurchaseRecordFromSession = (session, existingRecord) => {
  const sessionId = sanitizeText(session?.id, 255)
  const uid = getSessionOwnerUid(session)
  const items = getCheckoutItemsFromSession(session)

  if (!sessionId || !uid || items.length === 0) {
    throw createHttpError(400, "Session Stripe incomplete pour cet achat.")
  }

  return normalizePurchaseRecord(
    {
      sessionId,
      uid,
      email: getSessionCustomerEmail(session),
      paymentStatus: sanitizeText(session?.payment_status || "paid", 80) || "paid",
      purchasedAt: sanitizeText(session?.created ? new Date(session.created * 1000).toISOString() : "", 80) || new Date().toISOString(),
      items,
      stripeCustomerId:
        typeof session?.customer === "string" ? session.customer : sanitizeText(session?.customer?.id, 255),
      paymentIntentId:
        typeof session?.payment_intent === "string"
          ? session.payment_intent
          : sanitizeText(session?.payment_intent?.id, 255),
    },
    existingRecord,
  )
}

const upsertPaidPurchaseFromSession = (session) => {
  if (session?.payment_status !== "paid") {
    return null
  }

  const existingRecord = findPurchaseRecordBySessionId(session.id)
  const nextRecord = buildPurchaseRecordFromSession(session, existingRecord)
  return upsertPurchaseRecord(nextRecord)
}

const hasPaidPurchaseAccess = ({ uid, sessionId, productId }) =>
  readPurchaseRecords().some(
    (record) =>
      record.paymentStatus === "paid" &&
      record.uid === sanitizeText(uid, 128) &&
      record.sessionId === sanitizeText(sessionId, 255) &&
      record.items.some((item) => item.productId === sanitizeText(productId, 160)),
  )

const buildOwnedDigitalProducts = (uid) => {
  const catalog = getCatalogProductsById()
  const seenProducts = new Set()
  const paidRecords = readPurchaseRecords()
    .filter((record) => record.paymentStatus === "paid" && record.uid === sanitizeText(uid, 128))
    .sort((left, right) => new Date(right.purchasedAt).getTime() - new Date(left.purchasedAt).getTime())

  const ownedProducts = []

  for (const record of paidRecords) {
    for (const item of record.items) {
      if (seenProducts.has(item.productId)) {
        continue
      }

      const product = catalog.get(item.productId)
      if (!product) {
        continue
      }

      const downloads = buildProductDownloads([{ productId: item.productId, quantity: 1 }], {
        sessionId: record.sessionId,
        uid: record.uid,
      })

      if (downloads.length === 0) {
        continue
      }

      seenProducts.add(item.productId)
      ownedProducts.push({
        productId: product.id,
        title: product.name,
        image: sanitizeText(product.image, 4000),
        price: product.price || formatPriceFromCents(product.priceCents),
        formatLabel:
          sanitizeText(product.formatLabel, 80) ||
          (normalizeStoredDigitalFiles(product.digitalFiles)[0]?.mimeType === "application/zip" ? "ZIP" : "PDF"),
        purchasedAt: record.purchasedAt,
        downloads,
      })
    }
  }

  return ownedProducts
}

const sendWelcomeEmail = async ({ to, firstName }) => {
  const safeFirstName = sanitizeName(firstName).trim()
  const subject = "Bienvenue sur MeAndRituals"
  const greeting = safeFirstName ? `Bienvenue ${safeFirstName},` : "Bienvenue,"
  const loginUrl = `${appBaseUrl}/login`
  const preheader = "Bienvenue sur MeAndRituals."
  const welcomePhotoPath = path.resolve(process.cwd(), "src", "assets", "Photo bienvenue.jpeg")
  const welcomePhotoSrc = fs.existsSync(welcomePhotoPath)
    ? `data:image/jpeg;base64,${fs.readFileSync(welcomePhotoPath).toString("base64")}`
    : ""
  const html = `
    <div style="margin:0;padding:0;background:#f8f0e6;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
        ${preheader}
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background:#f8f0e6;">
        <tr>
          <td align="center" style="padding:28px 16px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;background:#f8f0e6;">
              <tr>
                <td style="padding:0;background:#ffffff;border:1px solid rgba(0,0,0,0.12);">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding:22px 20px 20px;border-bottom:1px solid rgba(0,0,0,0.12);">
                        <div style="font-family:Georgia,'Times New Roman',serif;font-size:46px;line-height:1;color:#000000;font-style:italic;">
                          Me& rituals
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:14px 12px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding:8px 14px;background:#e7d3bc;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#000000;">
                              Accueil
                            </td>
                            <td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#4b5563;">
                              Boutique
                            </td>
                            <td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#4b5563;">
                              Panier
                            </td>
                            <td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#4b5563;">
                              Mes achats
                            </td>
                            <td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#4b5563;">
                              A propos
                            </td>
                            <td style="padding:8px 14px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#4b5563;">
                              Contact
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 0 0;font-family:Arial,sans-serif;color:#000000;">
                  <p style="margin:0 0 14px;font-size:22px;line-height:1.4;font-weight:700;">${greeting}</p>
                  <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#000000;">
                    Merci d'avoir cree ton compte. Ton espace MeAndRituals est pret.
                  </p>
                  <p style="margin:0 0 22px;font-size:15px;line-height:1.8;color:#000000;">
                    Tu peux maintenant retrouver ton planning, tes routines et tes objectifs dans un seul espace.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border:1px solid rgba(0,0,0,0.12);">
                    <tr>
                      <td style="padding:18px 18px 16px;">
                        ${
                          welcomePhotoSrc
                            ? `<img src="${welcomePhotoSrc}" alt="Photo bienvenue" width="584" style="display:block;width:100%;max-width:584px;height:auto;border:0;outline:none;text-decoration:none;" />`
                            : `<div style="padding:120px 24px;background:#f8f0e6;font-family:Arial,sans-serif;font-size:20px;font-weight:600;line-height:1.4;text-align:center;color:#000000;">Photo bienvenue</div>`
                        }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 0 22px;font-family:Arial,sans-serif;color:#000000;">
                  <p style="margin:0 0 22px;font-size:15px;line-height:1.8;color:#000000;">
                    Commence des maintenant et accede a ton espace personnel.
                  </p>
                  <a href="${loginUrl}" style="display:inline-block;padding:14px 24px;border-radius:0;background:#000000;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
                    Acceder a MeAndRituals
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:6px 16px 26px;font-family:Arial,sans-serif;color:#6b7280;font-size:12px;line-height:1.6;">
            Cet email est envoye automatiquement a la creation de ton compte.
          </td>
        </tr>
      </table>
    </div>
  `

  return sendResendEmail({ to, subject, html })
}

app.post("/api/email/welcome", firebaseAuth, async (req, res) => {
  try {
    const to = String(req.user?.email || "").trim()
    const firstName = String(req.body?.firstName || "").trim()
    if (!to) {
      return res.status(400).json({ error: "Email utilisateur introuvable." })
    }

    const delivery = await sendWelcomeEmail({ to, firstName })
    return res.json({ ok: true, emailId: delivery?.id ?? null, to })
  } catch (error) {
    console.error("Welcome email failed:", error)
    return res.status(500).json({ error: "Impossible d'envoyer l'email de bienvenue." })
  }
})

app.post("/api/email/welcome/admin-resend", firebaseAuth, adminOnly, async (req, res) => {
  try {
    const to = normalizeEmailValue(req.body?.email)
    const firstName = String(req.body?.firstName || "").trim()
    console.log("Admin welcome resend requested", {
      requestedBy: req.user?.email ?? req.user?.uid ?? "unknown",
      to,
    })
    if (!to || !to.includes("@")) {
      return res.status(400).json({ error: "Adresse e-mail invalide." })
    }

    const delivery = await sendWelcomeEmail({ to, firstName })
    console.log("Admin welcome email resent", {
      requestedBy: req.user?.email ?? req.user?.uid ?? "unknown",
      to,
      emailId: delivery?.id ?? null,
    })
    return res.json({
      ok: true,
      message: "E-mail de bienvenue envoye.",
      emailId: delivery?.id ?? null,
      to,
    })
  } catch (error) {
    console.error("Admin welcome email resend failed:", error)
    return res.status(500).json({ error: "Impossible de renvoyer l'email de bienvenue." })
  }
})
app.post("/api/create-checkout-session", firebaseAuth, async (req, res) => {
  try {
    const uid = sanitizeText(req.user?.uid, 128)
    const email = normalizeEmailValue(req.user?.email)
    const isCartCheckout = Array.isArray(req.body?.items)
    const cartItems = normalizeCheckoutItems(req.body || {})

    if (!uid) {
      return res.status(401).json({ error: "Authentification requise." })
    }
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Produit introuvable." })
    }

    const ownedProductIds = new Set(buildOwnedDigitalProducts(uid).map((item) => item.productId))
    const alreadyOwnedItems = cartItems.filter((item) => ownedProductIds.has(item.productId))

    if (alreadyOwnedItems.length > 0) {
      const firstOwnedProduct = getCatalogProductOrThrow(alreadyOwnedItems[0].productId)
      const errorMessage =
        alreadyOwnedItems.length > 1
          ? "Un ou plusieurs produits de ce panier ont deja ete achetes. Retire-les du panier ou ouvre Mes achats."
          : `${firstOwnedProduct.name} a deja ete achete. Retrouve-le dans Mes achats.`

      return res.status(409).json({ error: errorMessage })
    }

    const lineItems = cartItems.map((item) => {
      const product = getCatalogProductOrThrow(item.productId)
      return {
        price_data: {
          currency: "eur",
          unit_amount: product.priceCents,
          product_data: {
            name: product.name,
          },
        },
        quantity: item.quantity,
      }
    })

    const cancelUrl = isCartCheckout ? `${appBaseUrl}/panier` : `${appBaseUrl}/boutique/produit/${cartItems[0].productId}`

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appBaseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      line_items: lineItems,
      client_reference_id: uid,
      customer_email: email || undefined,
      metadata: {
        uid,
        email,
        items: JSON.stringify(cartItems),
      },
      allow_promotion_codes: true,
    })

    return res.json({ url: session.url })
  } catch (error) {
    console.error("Checkout session error:", error)
    return res.status(error?.statusCode || 500).json({
      error: error instanceof Error ? error.message : "Impossible de creer la session de paiement.",
    })
  }
})
app.get("/api/checkout-session", firebaseAuth, async (req, res) => {
  try {
    const uid = sanitizeText(req.user?.uid, 128)
    const sessionId = req.query.session_id
    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "Session invalide." })
    }
    if (!uid) {
      return res.status(401).json({ error: "Authentification requise." })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const sessionOwnerUid = getSessionOwnerUid(session)
    if (!sessionOwnerUid || sessionOwnerUid !== uid) {
      return res.status(403).json({ error: "Cette session de paiement n'appartient pas a ce compte." })
    }
    if (session.payment_status !== "paid") {
      return res.status(200).json({ paid: false })
    }

    const purchaseRecord = upsertPaidPurchaseFromSession(session)
    const cartItems = purchaseRecord?.items || getCheckoutItemsFromSession(session)

    if (cartItems.length === 0) {
      return res.status(404).json({ error: "Produit introuvable." })
    }

    const downloads = buildProductDownloads(cartItems, {
      sessionId,
      uid,
    })

    if (downloads.length === 0) {
      return res.status(404).json({ error: "Produit introuvable." })
    }

    return res.status(200).json({
      paid: true,
      downloads,
      customerEmail: getSessionCustomerEmail(session) || null,
    })
  } catch (error) {
    console.error("Checkout session lookup error:", error)
    return res.status(500).json({ error: "Impossible de verifier le paiement." })
  }
})

app.get("/api/my-purchases", firebaseAuth, async (req, res) => {
  try {
    const uid = sanitizeText(req.user?.uid, 128)
    if (!uid) {
      return res.status(401).json({ error: "Authentification requise." })
    }

    const items = buildOwnedDigitalProducts(uid)
    return res.status(200).json(items)
  } catch (error) {
    console.error("My purchases lookup error:", error)
    return res.status(500).json({ error: "Impossible de charger les achats." })
  }
})
app.get("/api/download", (req, res) => {
  const token = req.query.token
  if (typeof token !== "string") {
    return res.status(400).send("Lien invalide.")
  }
  const payload = verifyDownloadToken(token)
  if (!payload) {
    return res.status(403).send("Lien expire ou invalide.")
  }
  if (!payload?.uid || !payload?.sessionId || !payload?.productId) {
    return res.status(403).send("Lien expire ou invalide.")
  }
  if (!hasPaidPurchaseAccess({ uid: payload.uid, sessionId: payload.sessionId, productId: payload.productId })) {
    return res.status(403).send("Acces refuse.")
  }

  let product
  try {
    product = getCatalogProductOrThrow(payload.productId)
  } catch (error) {
    return res.status(error?.statusCode || 404).send(error instanceof Error ? error.message : "Produit introuvable.")
  }

  const digitalFiles = normalizeStoredDigitalFiles(product.digitalFiles)
  const file =
    digitalFiles.find((entry) => entry.id === payload.assetId) ||
    digitalFiles[0]

  if (!file) {
    return res.status(404).send("Produit introuvable.")
  }

  let filePath
  try {
    filePath = resolveDownloadAbsolutePath(file.storagePath)
  } catch (error) {
    return res.status(error?.statusCode || 400).send(error instanceof Error ? error.message : "Lien invalide.")
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Fichier introuvable.")
  }
  return res.download(filePath, file.downloadName)
})

app.post("/api/stripe-webhook", async (req, res) => {
  let event
  try {
    if (!stripeWebhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET manquant.")
    }
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], stripeWebhookSecret)
  } catch (err) {
    console.error("Webhook signature error:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object
    try {
      const purchaseRecord = upsertPaidPurchaseFromSession(session)

      if (purchaseRecord) {
        const downloads = buildProductDownloads(purchaseRecord.items, {
          sessionId: purchaseRecord.sessionId,
          uid: purchaseRecord.uid,
        })
        const emailAttachments = buildProductEmailAttachments(purchaseRecord.items)
        const email = purchaseRecord.email || getSessionCustomerEmail(session)

        if (email && downloads.length > 0 && !purchaseRecord.emailSentAt) {
          await sendDownloadEmail({
            to: email,
            items: downloads,
            attachments: emailAttachments.attachments,
            attachedPdfCount: emailAttachments.attachedPdfCount,
            skippedPdfCount: emailAttachments.skippedPdfCount,
            hasNonPdfFiles: emailAttachments.hasNonPdfFiles,
            sessionId: purchaseRecord.sessionId,
          })
          markPurchaseEmailSent(purchaseRecord.sessionId)
        }
      }
    } catch (error) {
      console.error("Webhook purchase persistence error:", error)
    }
  }

  res.json({ received: true })
})

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "Fichier trop volumineux pour cette route d'upload." })
    }
    return res.status(400).json({ error: "Upload invalide." })
  }
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ error: "Payload trop volumineux pour cette requete." })
  }
  return next(error)
})

app.listen(port, host, () => {
  console.log(`Boutique server listening on http://${host}:${port}`)
})





