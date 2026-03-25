import { auth } from "../../utils/firebase"
import { buildApiUrl, getApiTargetLabel } from "../../utils/apiUrl"
import type { BoutiqueDigitalFile } from "../../models/product.model"

const parseErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as { error?: string }
    if (payload?.error) {
      return payload.error
    }
  } catch {
    // ignore malformed JSON
  }

  try {
    const text = await response.text()
    if (text) {
      return text
    }
  } catch {
    // ignore text parsing failures
  }

  return fallback
}

const buildAuthHeaders = async () => {
  const user = auth.currentUser
  if (!user) {
    throw new Error("Utilisateur non connecte.")
  }

  const token = await user.getIdToken()
  return {
    Authorization: `Bearer ${token}`,
  }
}

export const uploadDigitalProductFiles = async (files: File[], productId: string) => {
  if (!productId.trim()) {
    throw new Error("Identifiant produit manquant.")
  }
  if (files.length === 0) {
    throw new Error("Ajoute au moins un fichier numerique.")
  }

  const headers = await buildAuthHeaders()
  const formData = new FormData()
  formData.append("productId", productId)
  files.forEach((file) => formData.append("files", file))

  try {
    const response = await fetch(buildApiUrl("/api/custom-products/upload-digital-file"), {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Digital product upload failed"))
    }

    const payload = (await response.json()) as { files?: BoutiqueDigitalFile[] }
    return Array.isArray(payload.files) ? payload.files : []
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur boutique inaccessible: ${getApiTargetLabel()}`)
    }
    throw error
  }
}
