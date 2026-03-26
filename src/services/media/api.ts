import { auth } from "../../utils/firebase"
import { buildApiUrl, getApiTargetLabel, resolvePublicUrl } from "../../utils/apiUrl"

export type ImageUploadScope =
  | "profile-photo"
  | "wishlist-category-cover"
  | "wishlist-item-image"
  | "sport-life-card"
  | "boutique-product-image"
  | "workout-exercise-image"
  | "workout-video-thumbnail"
  | "self-love-photo"
  | "diet-custom-recipe-image"

export type VideoUploadScope = "boutique-product-video"

export type MediaUploadResult = {
  url: string
  path: string
  width: number | null
  height: number | null
  mimeType: string
  sizeBytes: number
}

export const resolveMediaUrl = (value: string) => {
  return resolvePublicUrl(value)
}

const parseErrorMessage = async (response: Response, fallback: string) => {
  if (response.status === 413) {
    return "Fichier trop volumineux pour l'upload. Reduis sa taille puis reessaie."
  }

  try {
    const payload = (await response.clone().json()) as { error?: string }
    if (payload?.error) {
      return payload.error
    }
  } catch {
    // ignore
  }

  try {
    const text = await response.text()
    if (text) {
      return text
    }
  } catch {
    // ignore
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

const uploadMedia = async (file: File, scope: string, endpoint: string, fallbackMessage: string, entityId?: string) => {
  const headers = await buildAuthHeaders()
  const formData = new FormData()
  formData.append("file", file)
  formData.append("scope", scope)
  if (entityId) {
    formData.append("entityId", entityId)
  }

  try {
    const response = await fetch(buildApiUrl(endpoint), {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`La route ${endpoint} est introuvable sur l'API configuree. Le serveur doit etre redeploye ou redemarre.`)
      }
      throw new Error(await parseErrorMessage(response, fallbackMessage))
    }

    const payload = (await response.json()) as MediaUploadResult
    return {
      ...payload,
      url: resolveMediaUrl(payload.url),
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur media inaccessible: ${getApiTargetLabel()}`)
    }
    throw error
  }
}

export const uploadImage = async (file: File, scope: ImageUploadScope, entityId?: string) =>
  uploadMedia(file, scope, "/api/media/upload-image", "Impossible de televerser cette image.", entityId)

export const uploadVideo = async (file: File, scope: VideoUploadScope, entityId?: string) =>
  uploadMedia(file, scope, "/api/media/upload-video", "Impossible de televerser cette video.", entityId)

export const deleteMedia = async (path: string) => {
  const headers = await buildAuthHeaders()
  try {
    const response = await fetch(buildApiUrl("/api/media/delete"), {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Media delete failed"))
    }

    return response.json()
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serveur media inaccessible: ${getApiTargetLabel()}`)
    }
    throw error
  }
}
