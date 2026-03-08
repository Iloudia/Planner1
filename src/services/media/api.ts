import { auth } from "../../utils/firebase"
import { buildApiUrl, getApiTargetLabel, resolvePublicUrl } from "../../utils/apiUrl"

export type MediaUploadScope =
  | "profile-photo"
  | "wishlist-category-cover"
  | "wishlist-item-image"
  | "sport-life-card"
  | "workout-exercise-image"
  | "workout-video-thumbnail"
  | "self-love-photo"
  | "diet-custom-recipe-image"

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
  try {
    const payload = (await response.json()) as { error?: string }
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

export const uploadImage = async (file: File, scope: MediaUploadScope, entityId?: string) => {
  const headers = await buildAuthHeaders()
  const formData = new FormData()
  formData.append("file", file)
  formData.append("scope", scope)
  if (entityId) {
    formData.append("entityId", entityId)
  }

  try {
    const response = await fetch(buildApiUrl("/api/media/upload-image"), {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "Media upload failed"))
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
