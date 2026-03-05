import "dotenv/config"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import express from "express"
import Stripe from "stripe"

const app = express()
const port = Number(process.env.PORT || 4242)

const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:5173"
const downloadsDir = process.env.DOWNLOADS_DIR || path.resolve(process.cwd(), "server", "downloads")
const downloadTokenSecret = process.env.DOWNLOAD_TOKEN_SECRET || "replace-me"
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ""
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

if (!stripeSecretKey) {
  console.warn("Missing STRIPE_SECRET_KEY. Stripe calls will fail until it is set.")
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" })

const products = [
  {
    id: "ebook-clarte",
    name: "Ebook Clarte d'offre",
    priceCents: 1900,
    fileName: "ebook-clarte.pdf",
  },
  {
    id: "template-lancement",
    name: "Pack Templates Lancement",
    priceCents: 2900,
    fileName: "template-lancement.zip",
  },
  {
    id: "carrousel-conversion",
    name: "Kit Carrousel Conversion",
    priceCents: 2400,
    fileName: "carrousel-conversion.zip",
  },
  {
    id: "ebook-pricing",
    name: "Ebook Pricing Magnetique",
    priceCents: 1700,
    fileName: "ebook-pricing.pdf",
  },
  {
    id: "template-portfolio",
    name: "Templates Portfolio Insta",
    priceCents: 2600,
    fileName: "template-portfolio.zip",
  },
  {
    id: "carrousel-story",
    name: "Carrousels Storytelling",
    priceCents: 2200,
    fileName: "carrousel-story.zip",
  },
  {
    id: "bundle-creator",
    name: "Bundle Creator Focus",
    priceCents: 4900,
    fileName: "bundle-creator.zip",
  },
  {
    id: "ebook-plan",
    name: "Ebook Plan d'action 30 jours",
    priceCents: 2100,
    fileName: "ebook-plan.pdf",
  },
]

const productById = new Map(products.map((product) => [product.id, product]))

const parseOrigins = () => {
  const raw = process.env.CORS_ORIGINS || appBaseUrl
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

const allowedOrigins = parseOrigins()

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin)
    res.header("Vary", "Origin")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }
  next()
})

app.use("/api/stripe-webhook", express.raw({ type: "application/json" }))
app.use(express.json())

const createDownloadToken = ({ productId, sessionId, expiresInHours = 48 }) => {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000
  const payload = JSON.stringify({ productId, sessionId, exp })
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
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null
  }
  const payload = JSON.parse(Buffer.from(payloadEncoded, "base64url").toString("utf-8"))
  if (!payload?.exp || Date.now() > payload.exp) {
    return null
  }
  return payload
}

const sendDownloadEmail = async ({ to, items }) => {
  const resendApiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || "Boutique <no-reply@example.com>"
  if (!resendApiKey) {
    console.warn("Missing RESEND_API_KEY. Email not sent.")
    return
  }

  const subject = "Tes liens de telechargement"
  const list = items
    .map(
      (item) =>
        `<li style="margin-bottom: 10px;"><strong>${item.productName}</strong><br /><a href="${item.downloadUrl}" style="color: #1f1b16;">Telecharger</a></li>`,
    )
    .join("")
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">Merci pour ton achat</h2>
      <p style="margin: 0 0 16px;">Voici tes liens securises de telechargement :</p>
      <ul style="padding-left: 18px; margin: 0 0 16px;">${list}</ul>
      <p style="margin: 0;">Ces liens expirent dans 48 heures.</p>
    </div>
  `

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  })
}
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { productId, items } = req.body || {}
    const normalizedItems = Array.isArray(items)
      ? items
          .map((item) => ({
            productId: String(item?.productId || ""),
            quantity: Number(item?.quantity || 1),
          }))
          .filter((item) => item.productId && Number.isFinite(item.quantity) && item.quantity > 0)
      : []

    if (!productId && normalizedItems.length === 0) {
      return res.status(400).json({ error: "Produit introuvable." })
    }

    const cartItems =
      normalizedItems.length > 0
        ? normalizedItems
        : [
            {
              productId,
              quantity: 1,
            },
          ]

    const lineItems = cartItems.map((item) => {
      const product = productById.get(item.productId)
      if (!product) {
        throw new Error(`Produit introuvable: ${item.productId}`)
      }
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

    const cancelUrl =
      normalizedItems.length > 0 ? `${appBaseUrl}/panier` : `${appBaseUrl}/boutique/produit/${productId}`

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appBaseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      line_items: lineItems,
      metadata: {
        items: JSON.stringify(cartItems),
      },
      allow_promotion_codes: true,
    })

    return res.json({ url: session.url })
  } catch (error) {
    console.error("Checkout session error:", error)
    return res.status(500).json({ error: "Impossible de creer la session de paiement." })
  }
})
app.get("/api/checkout-session", async (req, res) => {
  try {
    const sessionId = req.query.session_id
    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "Session invalide." })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== "paid") {
      return res.status(200).json({ paid: false })
    }

    const rawItems = session.metadata?.items
    const parsedItems = rawItems ? JSON.parse(rawItems) : null
    const cartItems = Array.isArray(parsedItems)
      ? parsedItems
          .map((item) => ({ productId: item?.productId, quantity: item?.quantity ?? 1 }))
          .filter((item) => typeof item.productId === "string")
      : []

    if (cartItems.length === 0) {
      return res.status(404).json({ error: "Produit introuvable." })
    }

    const downloads = cartItems
      .map((item) => productById.get(item.productId))
      .filter(Boolean)
      .map((product) => {
        const token = createDownloadToken({ productId: product.id, sessionId })
        const downloadUrl = `${appBaseUrl}/api/download?token=${token}`
        return { downloadUrl, productName: product.name }
      })

    if (downloads.length === 0) {
      return res.status(404).json({ error: "Produit introuvable." })
    }

    return res.status(200).json({
      paid: true,
      downloads,
      customerEmail: session.customer_details?.email ?? null,
    })
  } catch (error) {
    console.error("Checkout session lookup error:", error)
    return res.status(500).json({ error: "Impossible de verifier le paiement." })
  }
})
app.get("/api/download", (req, res) => {
  const token = req.query.token
  if (typeof token !== "string") {
    return res.status(400).send("Lien invalide.")
  }
  const payload = verifyDownloadToken(token)
  if (!payload) {
    return res.status(403).send("Lien expirÃ© ou invalide.")
  }
  const product = productById.get(payload.productId)
  if (!product) {
    return res.status(404).send("Produit introuvable.")
  }
  const filePath = path.join(downloadsDir, product.fileName)
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Fichier introuvable.")
  }
  return res.download(filePath, product.fileName)
})

app.post("/api/stripe-webhook", async (req, res) => {
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], stripeWebhookSecret)
  } catch (err) {
    console.error("Webhook signature error:", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const rawItems = session.metadata?.items
    const parsedItems = rawItems ? JSON.parse(rawItems) : null
    const cartItems = Array.isArray(parsedItems)
      ? parsedItems
          .map((item) => ({ productId: item?.productId, quantity: item?.quantity ?? 1 }))
          .filter((item) => typeof item.productId === "string")
      : []

    const downloads = cartItems
      .map((item) => productById.get(item.productId))
      .filter(Boolean)
      .map((product) => {
        const token = createDownloadToken({ productId: product.id, sessionId: session.id })
        const downloadUrl = `${appBaseUrl}/api/download?token=${token}`
        return { downloadUrl, productName: product.name }
      })

    const email = session.customer_details?.email
    if (email && downloads.length > 0) {
      await sendDownloadEmail({
        to: email,
        items: downloads,
      })
    }
  }

  res.json({ received: true })
})
app.listen(port, () => {
  console.log(`Boutique server listening on http://localhost:${port}`)
})





