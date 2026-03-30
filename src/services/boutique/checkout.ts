import { browserLocalPersistence, setPersistence } from "firebase/auth"
import { auth } from "../../utils/firebase"
import { buildApiUrl, fetchApi, getApiTargetLabel } from "../../utils/apiUrl"

export type CheckoutDownload = {
  downloadUrl: string
  productName: string
  fileName?: string
  label?: string
}

export type CheckoutStatus = {
  paid: boolean
  downloads?: CheckoutDownload[]
  customerEmail?: string | null
  error?: string
}

export type OwnedDigitalProduct = {
  productId: string
  title: string
  image: string
  price: string
  formatLabel: string
  purchasedAt: string
  downloads: CheckoutDownload[]
}

type CheckoutPayload = {
  productId?: string
  items?: Array<{ productId: string; quantity: number }>
}

const parseErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as { error?: string }
    if (payload?.error) {
      return payload.error
    }
  } catch {
    // ignore malformed JSON payloads
  }

  try {
    const text = await response.text()
    if (text) {
      return text
    }
  } catch {
    // ignore malformed text payloads
  }

  return fallback
}

const buildAuthenticatedJsonHeaders = async () => {
  const user = auth.currentUser
  if (!user) {
    throw new Error("Connecte-toi pour continuer.")
  }

  const token = await user.getIdToken()
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

export const createCheckoutSession = async (payload: CheckoutPayload) => {
  const headers = await buildAuthenticatedJsonHeaders()

  try {
    // Keep the Firebase session across the full Stripe redirect flow, including
    // cases where the success URL opens in a fresh browsing context.
    await setPersistence(auth, browserLocalPersistence)

    const response = await fetchApi("/api/create-checkout-session", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Impossible de lancer le paiement."))
    }

    const data = (await response.json()) as { url?: string }
    if (!data?.url) {
      throw new Error("Lien de paiement manquant.")
    }

    return data.url
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur boutique inaccessible: ${getApiTargetLabel()}`)
    }
    throw error
  }
}

export const fetchCheckoutSessionStatus = async (sessionId: string) => {
  const headers = await buildAuthenticatedJsonHeaders()

  try {
    const response = await fetch(buildApiUrl(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`), {
      headers,
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Impossible de vérifier le paiement."))
    }

    return (await response.json()) as CheckoutStatus
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur boutique inaccessible: ${getApiTargetLabel()}`)
    }
    throw error
  }
}

export const fetchOwnedDigitalProducts = async () => {
  const headers = await buildAuthenticatedJsonHeaders()

  try {
    const response = await fetch(buildApiUrl("/api/my-purchases"), {
      headers,
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Impossible de charger tes achats."))
    }

    return (await response.json()) as OwnedDigitalProduct[]
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur boutique inaccessible: ${getApiTargetLabel()}`)
    }
    throw error
  }
}
