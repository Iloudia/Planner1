import { browserLocalPersistence, setPersistence } from "firebase/auth"
import { auth } from "../../utils/firebase"
import { buildApiUrl, fetchApi, getApiTargetLabel } from "../../utils/apiUrl"

export type PremiumPlanId = "monthly" | "yearly"

export type PremiumCheckoutStatus = {
  active: boolean
  status?: string
  plan?: PremiumPlanId
  currentPeriodEnd?: string | null
}

const parseErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as { error?: string }
    return payload?.error || fallback
  } catch {
    return fallback
  }
}

const buildAuthenticatedHeaders = async () => {
  const user = auth.currentUser
  if (!user) {
    throw new Error("Connecte-toi pour continuer.")
  }

  return {
    Authorization: `Bearer ${await user.getIdToken()}`,
    "Content-Type": "application/json",
  }
}

export const createPremiumCheckoutSession = async (plan: PremiumPlanId) => {
  const headers = await buildAuthenticatedHeaders()

  try {
    await setPersistence(auth, browserLocalPersistence)
    const response = await fetchApi("/api/premium/checkout-session", {
      method: "POST",
      headers,
      body: JSON.stringify({ plan }),
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Impossible de lancer l'abonnement Premium."))
    }

    const payload = (await response.json()) as { url?: string }
    if (!payload.url) {
      throw new Error("Lien de paiement manquant.")
    }
    return payload.url
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur Premium inaccessible : ${getApiTargetLabel()}`)
    }
    throw error
  }
}

export const confirmPremiumCheckoutSession = async (sessionId: string) => {
  const headers = await buildAuthenticatedHeaders()

  try {
    const response = await fetch(
      buildApiUrl(`/api/premium/checkout-session?session_id=${encodeURIComponent(sessionId)}`),
      { headers },
    )

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Impossible de vérifier l'abonnement Premium."))
    }

    const status = (await response.json()) as PremiumCheckoutStatus
    if (status.active) {
      await auth.currentUser?.getIdToken(true)
    }
    return status
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur Premium inaccessible : ${getApiTargetLabel()}`)
    }
    throw error
  }
}

export const createPremiumPortalSession = async () => {
  const headers = await buildAuthenticatedHeaders()

  try {
    const response = await fetchApi("/api/premium/portal-session", {
      method: "POST",
      headers,
    })
    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Impossible d'ouvrir la gestion de l'abonnement."))
    }

    const payload = (await response.json()) as { url?: string }
    if (!payload.url) {
      throw new Error("Lien de gestion manquant.")
    }
    return payload.url
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur Premium inaccessible : ${getApiTargetLabel()}`)
    }
    throw error
  }
}
