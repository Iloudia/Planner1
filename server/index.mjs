import "dotenv/config"
import crypto from "node:crypto"
import fs from "node:fs"
import fsPromises from "node:fs/promises"
import path from "node:path"
import express from "express"
import multer from "multer"
import Stripe from "stripe"
import { getFirebaseAdminAuth, getFirebaseAdminDb, isFirebaseAdminConfigured } from "./firebaseAdmin.mjs"
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
const contactRecipientEmail = String(process.env.CONTACT_EMAIL_TO || "contact@meandrituals.com")
  .trim()
  .toLowerCase()

if (!downloadTokenSecret || downloadTokenSecret === "replace-me") {
  throw new Error("DOWNLOAD_TOKEN_SECRET must be set with a strong random value.")
}

if (!stripeSecretKey) {
  console.warn("Missing STRIPE_SECRET_KEY. Stripe calls will fail until it is set.")
}

if (adminEmails.size === 0) {
  console.warn("ADMIN_EMAILS is empty. Only Firebase tokens with admin custom claim can manage custom products.")
}

if (!isFirebaseAdminConfigured) {
  console.warn("Firebase Admin SDK is not configured. Admin account deletion will be unavailable.")
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" })
const MAX_UPLOAD_BYTES = 500 * 1024 * 1024
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
const isValidEmailAddress = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim())
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
          : ["Ressource digitale", "Accès immédiat", "Usage commercial autorisé"],
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
    return "Ajoute au moins un fichier numérique avant publication."
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
    throw createHttpError(400, "Ce produit n'a pas encore de fichier téléchargeable configuré.")
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
    throw createHttpError(400, "Chemin de téléchargement invalide.")
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
    throw createHttpError(400, "Seuls les fichiers PDF et ZIP sont acceptés.")
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
      return res.status(429).json({ error: "Trop de requêtes. Merci de réessayer dans quelques instants." })
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
app.use("/api/admin", sensitiveApiRateLimit)

const firebaseAuth = async (req, res, next) => {
  if (!isFirebaseTokenVerificationConfigured) {
    return res.status(503).json({ error: "Firebase Auth n'est pas configuré côté serveur." })
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
  return res.status(403).json({ error: "Accès admin requis." })
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
      return res.status(400).json({ error: "Aucun fichier image reçu." })
    }
    if (!isAllowedImageScope(scope)) {
      return res.status(400).json({ error: "Scope media invalide." })
    }
    if (!file.mimetype?.startsWith("image/")) {
      return res.status(400).json({ error: "Seules les images sont acceptées." })
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
    return res.status(500).json({ error: "Impossible de téléverser cette image." })
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
      return res.status(400).json({ error: "Aucun fichier vidéo reçu." })
    }
    if (!isAllowedVideoScope(scope)) {
      return res.status(400).json({ error: "Scope media invalide." })
    }
    if (!file.mimetype?.startsWith("video/")) {
      return res.status(400).json({ error: "Seules les vidéos sont acceptées." })
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
    return res.status(500).json({ error: "Impossible de téléverser cette vidéo." })
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
    return res.status(400).json({ error: "Impossible de supprimer ce média." })
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
      return res.status(400).json({ error: "Ajoute au moins un fichier numérique." })
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
      error: error instanceof Error ? error.message : "Impossible de téléverser ce fichier numérique.",
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

  return res.status(400).json({ error: "Requête invalide." })
})

const sendResendEmail = async ({ to, subject, html, text, attachments, idempotencyKey }) => {
  const resendApiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || "MeAndRituals <no-reply@example.com>"
  if (!resendApiKey) {
    console.warn("Missing RESEND_API_KEY. Email not sent.")
    return
  }

  try {
    const normalizedAttachments = Array.isArray(attachments)
      ? attachments.map((attachment) => {
          const normalized = { ...attachment }
          if (typeof attachment?.contentId === "string" && attachment.contentId) {
            normalized.content_id = attachment.contentId
            normalized.content_disposition = "inline"
            delete normalized.contentId
          }
          if (typeof attachment?.contentType === "string" && attachment.contentType) {
            normalized.content_type = attachment.contentType
            delete normalized.contentType
          }
          return normalized
        })
      : undefined
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
        ...(typeof text === "string" ? { text } : {}),
        ...(Array.isArray(normalizedAttachments) && normalizedAttachments.length > 0 ? { attachments: normalizedAttachments } : {}),
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

const renderEmailHeroImage = ({ attachment, contentId, alt, fallbackLabel }) =>
  attachment
    ? `<img src="cid:${contentId}" alt="${alt}" width="552" height="276" style="display:block;width:100%;max-width:552px;height:276px;object-fit:cover;border:0;outline:none;text-decoration:none;" />`
    : `<div style="padding:120px 24px;background:#f1ece4;font-family:Arial,sans-serif;font-size:20px;font-weight:600;line-height:1.4;text-align:center;color:#000000;">${fallbackLabel}</div>`

const renderEmailShell = ({
  preheader,
  homeUrl,
  shopUrl,
  aboutUrl,
  contactUrl,
  introHtml,
  imageHtml,
  ctaDescription,
  ctaUrl,
  ctaLabel,
  extraContentHtml = "",
  footerNote = "",
}) => `
  <div style="margin:0;padding:0;background:#f8f0e6;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${preheader}
    </div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background:#f8f0e6;">
      <tr>
        <td align="center" style="padding:22px 14px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;background:#f8f0e6;border:1px solid rgba(0,0,0,0.18);">
            <tr>
              <td style="padding:0;background:#f8f0e6;border-bottom:1px solid rgba(0,0,0,0.18);">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding:18px 20px 16px;border-bottom:1px solid rgba(0,0,0,0.18);">
                      <div style="font-family:Arial,sans-serif;font-size:11px;line-height:1.4;letter-spacing:2px;text-transform:uppercase;color:#000000;margin:0 0 10px;">
                        MeAndRituals
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:12px 10px 13px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                        <tr>
                          <td style="padding:4px 10px;">
                            <a href="${homeUrl}" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#000000;text-decoration:none;">
                              Accueil
                            </a>
                          </td>
                          <td style="padding:4px 10px;">
                            <a href="${shopUrl}" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#000000;text-decoration:none;">
                              Boutique
                            </a>
                          </td>
                          <td style="padding:4px 10px;">
                            <a href="${aboutUrl}" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#000000;text-decoration:none;">
                              A propos
                            </a>
                          </td>
                          <td style="padding:4px 10px;">
                            <a href="${contactUrl}" style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#000000;text-decoration:none;">
                              Contact
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:28px 28px 10px;font-family:Arial,sans-serif;color:#000000;">
                ${introHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 18px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f8f0e6;border:1px solid rgba(0,0,0,0.18);">
                  <tr>
                    <td style="padding:14px 14px 10px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid rgba(0,0,0,0.18);background:#ffffff;">
                        <tr>
                          <td style="padding:0;">
                            ${imageHtml}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 28px 30px;font-family:Arial,sans-serif;color:#000000;">
                <div style="width:84px;height:1px;background:#000000;margin:0 auto 20px;"></div>
                <p style="margin:0 auto 20px;max-width:420px;font-size:15px;line-height:1.8;color:#000000;">
                  ${ctaDescription}
                </p>
                <a href="${ctaUrl}" style="display:inline-block;padding:14px 26px;background:#e3d7ca;border:1px solid #000000;color:#000000;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                  ${ctaLabel}
                </a>
              </td>
            </tr>
            ${extraContentHtml}
          </table>
        </td>
      </tr>
      ${
        footerNote
          ? `
      <tr>
        <td align="center" style="padding:4px 16px 18px;font-family:Arial,sans-serif;color:#000000;font-size:12px;line-height:1.6;">
          ${footerNote}
        </td>
      </tr>
      `
          : ""
      }
    </table>
  </div>
`

const sendDownloadEmail = async ({ to, items, attachments, attachedPdfCount = 0, skippedPdfCount = 0, hasNonPdfFiles = false, sessionId }) => {
  const subject = "Merci pour ton achat | Tes fichiers MeAndRituals"
  const purchasesUrl = `${appBaseUrl}/mes-achats`
  const homeUrl = `${appBaseUrl}/`
  const shopUrl = `${appBaseUrl}/boutique`
  const aboutUrl = `${appBaseUrl}/a-propos`
  const contactUrl = `${appBaseUrl}/contact`
  const preheader = "Merci pour ton achat. Tes fichiers sont prêts et tes PDF sont joints à cet email quand leur taille le permet."
  const purchasePhotoPath = path.resolve(process.cwd(), "src", "assets", "email-perseverance.png")
  const purchasePhotoAttachment = fs.existsSync(purchasePhotoPath)
    ? {
        content: fs.readFileSync(purchasePhotoPath).toString("base64"),
        filename: "purchase-photo.png",
        contentType: "image/png",
        contentId: "purchase-photo",
      }
    : null
  const list = items
    .map(
      (item) =>
        `
          <tr>
            <td style="padding:0 0 14px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid rgba(0,0,0,0.18);background:#ffffff;">
                <tr>
                  <td style="padding:16px 18px;font-family:Arial,sans-serif;color:#000000;">
                    <p style="margin:0 0 6px;font-size:15px;line-height:1.6;font-weight:700;color:#000000;">${escapeHtml(item.label || item.productName)}</p>
                    <p style="margin:0 0 14px;font-size:13px;line-height:1.7;color:#000000;">Lien sécurisé valable 48 heures.</p>
                    <a href="${item.downloadUrl}" style="display:inline-block;padding:10px 16px;border:1px solid #000000;background:#e3d7ca;color:#000000;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                      Télécharger
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
      ? `<p style="margin:0 auto 14px;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">${attachedPdfCount} PDF ${attachedPdfCount > 1 ? "sont joints" : "est joint"} à cet email pour un accès immédiat.</p>`
      : ""
  const skippedNote =
    skippedPdfCount > 0
      ? `<p style="margin:0 auto 14px;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">Certains PDF n'ont pas pu être joints car ils sont trop volumineux pour un email. Utilise les liens de téléchargement ci-dessous.</p>`
      : ""
  const zipNote = hasNonPdfFiles
    ? `<p style="margin:0 auto 14px;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">Les fichiers ZIP ou autres ressources complémentaires restent disponibles via les liens sécurisés ci-dessous.</p>`
    : ""
  const html = renderEmailShell({
    preheader,
    homeUrl,
    shopUrl,
    aboutUrl,
    contactUrl,
    introHtml: `
      <p style="margin:0 0 14px;font-size:28px;line-height:1.2;font-weight:700;color:#000000;">Merci pour ton achat,</p>
      <p style="margin:0 auto 14px;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">
        Tes fichiers sont prêts. Merci pour ta commande sur MeAndRituals.
      </p>
      <p style="margin:0 auto 14px;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">
        Tu trouveras ci-dessous tes liens de téléchargement sécurisés ainsi que l'accès à la page Mes achats pour retrouver tout ton contenu.
      </p>
      ${attachmentNote}
      ${skippedNote}
      ${zipNote}
    `,
    imageHtml: renderEmailHeroImage({
      attachment: purchasePhotoAttachment,
      contentId: "purchase-photo",
      alt: "Photo achat",
      fallbackLabel: "Photo achat",
    }),
    ctaDescription: "Retrouve dès maintenant tous tes fichiers et tes liens de téléchargement.",
    ctaUrl: purchasesUrl,
    ctaLabel: "Ouvrir mes achats",
    extraContentHtml: `
      <tr>
        <td style="padding:0 28px 10px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${list}
          </table>
        </td>
      </tr>
    `,
    footerNote: "Les liens ci-dessus expirent dans 48 heures. Si un lien a expiré, reconnecte-toi à ton compte et ouvre la page Mes achats.",
  })

  await sendResendEmail({
    to,
    subject,
    html,
    attachments: [
      ...(purchasePhotoAttachment ? [purchasePhotoAttachment] : []),
      ...(Array.isArray(attachments) ? attachments : []),
    ],
    idempotencyKey: sessionId ? `purchase-email:${sessionId}` : undefined,
  })
}

const sendContactEmail = async ({ firstName, lastName, email, subject, message, origin, ip }) => {
  const safeFirstName = sanitizeText(firstName, 80)
  const safeLastName = sanitizeText(lastName, 80)
  const safeEmail = normalizeEmailValue(email)
  const safeSubject = sanitizeText(subject, 160)
  const safeMessage = sanitizeText(message, 5000)
  const senderName = [safeFirstName, safeLastName].filter(Boolean).join(" ")
  const messageHtml = escapeHtml(safeMessage).replace(/\r?\n/g, "<br />")
  const html = `
    <div style="margin:0;padding:32px 16px;background:#f7f3ee;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e8ddd1;">
        <tr>
          <td style="padding:24px 28px;background:#1f1b16;color:#ffffff;">
            <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#d9c6b1;">MeAndRituals</p>
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:600;">Nouveau message de contact</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;font-family:Arial,sans-serif;color:#2b241c;">
            <p style="margin:0 0 18px;font-size:15px;line-height:1.7;">Un message a été envoyé depuis le formulaire de contact du site.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
              <tr>
                <td style="padding:0 0 10px;font-size:13px;font-weight:700;width:120px;">Nom</td>
                <td style="padding:0 0 10px;font-size:14px;">${escapeHtml(senderName || "-")}</td>
              </tr>
              <tr>
                <td style="padding:0 0 10px;font-size:13px;font-weight:700;width:120px;">Email</td>
                <td style="padding:0 0 10px;font-size:14px;">${escapeHtml(safeEmail)}</td>
              </tr>
              <tr>
                <td style="padding:0 0 10px;font-size:13px;font-weight:700;width:120px;">Sujet</td>
                <td style="padding:0 0 10px;font-size:14px;">${escapeHtml(safeSubject)}</td>
              </tr>
              <tr>
                <td style="padding:0 0 10px;font-size:13px;font-weight:700;width:120px;vertical-align:top;">Message</td>
                <td style="padding:0 0 10px;font-size:14px;line-height:1.7;">${messageHtml}</td>
              </tr>
              <tr>
                <td style="padding:10px 0 0;font-size:12px;font-weight:700;width:120px;vertical-align:top;color:#6f6256;">Origine</td>
                <td style="padding:10px 0 0;font-size:12px;color:#6f6256;">${escapeHtml(origin || "inconnue")} | ${escapeHtml(ip || "ip inconnue")}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `
  const text = [
    "Nouveau message de contact MeAndRituals",
    "",
    `Nom: ${senderName || "-"}`,
    `Email: ${safeEmail}`,
    `Sujet: ${safeSubject}`,
    "",
    safeMessage,
    "",
    `Origine: ${origin || "inconnue"}`,
    `IP: ${ip || "ip inconnue"}`,
  ].join("\n")

  return sendResendEmail({
    to: contactRecipientEmail,
    subject: `Contact site | ${safeSubject}`,
    html,
    text,
    idempotencyKey: `contact:${crypto.createHash("sha256").update(`${safeEmail}|${safeSubject}|${safeMessage}`).digest("hex")}`,
  })
}

const sanitizeName = (value) => String(value || "").replace(/[<>&"']/g, "")
const normalizeEmailValue = (value) => String(value || "").trim().toLowerCase()

const resolveUserMediaDirectory = (uid) => {
  const safeUid = sanitizeText(uid, 128)
  if (!safeUid) {
    return null
  }

  const usersRoot = path.resolve(mediaRootDir, "users")
  const userMediaDir = path.resolve(usersRoot, safeUid)
  if (!userMediaDir.startsWith(`${usersRoot}${path.sep}`)) {
    throw new Error("invalid-user-media-directory")
  }

  return userMediaDir
}

const listFirestoreUserTargets = async ({ adminDb, email, uid }) => {
  const usersCollection = adminDb.collection("users")
  const targets = new Map()

  if (uid) {
    targets.set(uid, usersCollection.doc(uid))
  }

  const [emailLowerSnapshot, emailSnapshot] = await Promise.all([
    usersCollection.where("emailLower", "==", email).get(),
    usersCollection.where("email", "==", email).get(),
  ])

  emailLowerSnapshot.docs.forEach((docSnap) => targets.set(docSnap.id, docSnap.ref))
  emailSnapshot.docs.forEach((docSnap) => targets.set(docSnap.id, docSnap.ref))

  return Array.from(targets.entries()).map(([id, ref]) => ({ id, ref }))
}

const deleteUserMediaDirectories = async (userIds) => {
  const uniqueIds = Array.from(new Set((Array.isArray(userIds) ? userIds : []).map((entry) => sanitizeText(entry, 128)).filter(Boolean)))

  if (uniqueIds.length === 0) {
    return false
  }

  await Promise.all(
    uniqueIds.map(async (uid) => {
      const userMediaDir = resolveUserMediaDirectory(uid)
      if (!userMediaDir) {
        return
      }
      await fsPromises.rm(userMediaDir, { recursive: true, force: true })
    }),
  )

  return true
}

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
  const homeUrl = `${appBaseUrl}/`
  const shopUrl = `${appBaseUrl}/boutique`
  const aboutUrl = `${appBaseUrl}/a-propos`
  const contactUrl = `${appBaseUrl}/contact`
  const preheader = "Bienvenue sur MeAndRituals."
  const welcomePhotoPath = path.resolve(process.cwd(), "src", "assets", "email-perseverance.png")
  const welcomePhotoAttachment = fs.existsSync(welcomePhotoPath)
    ? {
        content: fs.readFileSync(welcomePhotoPath).toString("base64"),
        filename: "welcome-photo.png",
        contentType: "image/png",
        contentId: "welcome-photo",
      }
    : null
  const html = renderEmailShell({
    preheader,
    homeUrl,
    shopUrl,
    aboutUrl,
    contactUrl,
    introHtml: `
      <p style="margin:0 0 14px;font-size:28px;line-height:1.2;font-weight:700;color:#000000;">${greeting}</p>
      <p style="margin:0 auto 14px;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">
        Je suis ravie de te compter parmi nous. Tu viens de rejoindre un espace pens&eacute; pour t&rsquo;accompagner au quotidien, que ce soit pour organiser tes s&eacute;ances de sport, planifier tes repas, g&eacute;rer ta wishlist ou simplement structurer tes envies et tes objectifs.
      </p>
      <p style="margin:0 auto 14px;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">
        Ici, tout est con&ccedil;u pour te simplifier la vie et t&rsquo;aider &agrave; rester motiv&eacute;e, organis&eacute;e et inspir&eacute;e.
      </p>
      <p style="margin:0 auto 14px;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">
        Prends le temps de d&eacute;couvrir les diff&eacute;rentes fonctionnalit&eacute;s, personnalise ton espace selon tes besoins et fais-en un outil qui te ressemble vraiment.
      </p>
      <p style="margin:0 auto;max-width:470px;font-size:15px;line-height:1.8;color:#000000;">
        Si tu as la moindre question ou besoin d&rsquo;aide, je suis l&agrave; pour toi.
      </p>
    `,
    imageHtml: renderEmailHeroImage({
      attachment: welcomePhotoAttachment,
      contentId: "welcome-photo",
      alt: "Photo bienvenue",
      fallbackLabel: "Photo bienvenue",
    }),
    ctaDescription: "Commence d&egrave;s maintenant et simplifie ton quotidien",
    ctaUrl: loginUrl,
    ctaLabel: "Acc&eacute;der &agrave; mon espace",
    footerNote: "Cet email est envoyé automatiquement à la création de ton compte.",
  })

  return sendResendEmail({
    to,
    subject,
    html,
    attachments: welcomePhotoAttachment ? [welcomePhotoAttachment] : undefined,
  })
}

app.post("/api/email/contact", async (req, res) => {
  try {
    const firstName = sanitizeText(req.body?.firstName, 80)
    const lastName = sanitizeText(req.body?.lastName, 80)
    const email = normalizeEmailValue(req.body?.email)
    const subject = sanitizeText(req.body?.subject, 160)
    const message = sanitizeText(req.body?.message, 5000)
    const website = sanitizeText(req.body?.website, 120)

    if (website) {
      return res.json({ ok: true })
    }
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: "Tous les champs du formulaire sont requis." })
    }
    if (!isValidEmailAddress(email)) {
      return res.status(400).json({ error: "Adresse e-mail invalide." })
    }
    if (!process.env.RESEND_API_KEY) {
      return res.status(503).json({ error: "Le service d'envoi d'e-mails n'est pas configuré." })
    }

    const delivery = await sendContactEmail({
      firstName,
      lastName,
      email,
      subject,
      message,
      origin: req.headers.origin || req.headers.referer || appBaseUrl,
      ip: req.ip || req.socket?.remoteAddress || "unknown",
    })

    return res.json({
      ok: true,
      message: "Message envoyé.",
      emailId: delivery?.id ?? null,
      to: contactRecipientEmail,
    })
  } catch (error) {
    console.error("Contact email failed:", error)
    return res.status(500).json({ error: "Impossible d'envoyer ton message pour le moment." })
  }
})

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
      message: "E-mail de bienvenue envoyé.",
      emailId: delivery?.id ?? null,
      to,
    })
  } catch (error) {
    console.error("Admin welcome email resend failed:", error)
    return res.status(500).json({ error: "Impossible de renvoyer l'email de bienvenue." })
  }
})

app.post("/api/admin/users/delete", firebaseAuth, adminOnly, async (req, res) => {
  if (!isFirebaseAdminConfigured) {
    return res.status(503).json({
      error:
        "La suppression complete des comptes n'est pas configuree sur le serveur. Ajoute une configuration Firebase Admin.",
    })
  }

  try {
    const email = normalizeEmailValue(req.body?.email)
    const requesterEmail = normalizeEmailValue(req.user?.email)

    if (!email || !isValidEmailAddress(email)) {
      return res.status(400).json({ error: "Adresse e-mail invalide." })
    }

    if (requesterEmail && requesterEmail === email) {
      return res.status(400).json({ error: "Utilise la suppression de compte depuis tes parametres." })
    }

    const adminAuth = getFirebaseAdminAuth()
    const adminDb = getFirebaseAdminDb()

    let authUser = null
    try {
      authUser = await adminAuth.getUserByEmail(email)
    } catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === "auth/user-not-found")) {
        throw error
      }
    }

    const authUid = sanitizeText(authUser?.uid, 128)
    const firestoreTargets = await listFirestoreUserTargets({
      adminDb,
      email,
      uid: authUid,
    })

    if (!authUid && firestoreTargets.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable." })
    }

    let authDeleted = false
    if (authUid) {
      await adminAuth.deleteUser(authUid)
      authDeleted = true
    }

    let firestoreDeleted = false
    if (firestoreTargets.length > 0) {
      await Promise.all(firestoreTargets.map(({ ref }) => adminDb.recursiveDelete(ref)))
      firestoreDeleted = true
    }

    const mediaDeleted = await deleteUserMediaDirectories([
      authUid,
      ...firestoreTargets.map(({ id }) => id),
    ])

    console.log("Admin user deleted", {
      requestedBy: req.user?.email ?? req.user?.uid ?? "unknown",
      email,
      uid: authUid || null,
      authDeleted,
      firestoreDeleted,
      mediaDeleted,
    })

    return res.json({
      ok: true,
      authDeleted,
      firestoreDeleted,
      mediaDeleted,
    })
  } catch (error) {
    console.error("Admin user delete failed:", error)
    return res.status(500).json({ error: "Impossible de supprimer completement ce compte." })
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
          ? "Un ou plusieurs produits de ce panier ont déjà été achetés. Retire-les du panier ou ouvre Mes achats."
          : `${firstOwnedProduct.name} a déjà été acheté. Retrouve-le dans Mes achats.`

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
      error: error instanceof Error ? error.message : "Impossible de créer la session de paiement.",
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
      return res.status(403).json({ error: "Cette session de paiement n'appartient pas à ce compte." })
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
    return res.status(500).json({ error: "Impossible de vérifier le paiement." })
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
    return res.status(403).send("Accès refusé.")
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
    return res.status(413).json({ error: "Payload trop volumineux pour cette requête." })
  }
  return next(error)
})

app.listen(port, host, () => {
  console.log(`Boutique server listening on http://${host}:${port}`)
})





