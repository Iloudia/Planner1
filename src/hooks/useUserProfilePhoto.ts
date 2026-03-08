import { useCallback, useEffect, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { deleteMedia, resolveMediaUrl, uploadImage, type MediaUploadResult } from "../services/media/api"
import {
  clearUserProfilePhoto,
  saveUserProfilePhoto,
  subscribeToUserProfilePhoto,
} from "../services/firestore/profilePhoto"
import { buildUserScopedKey } from "../utils/userScopedKey"

const PROFILE_PHOTO_SUFFIX = "profile-photo"
const LEGACY_PROFILE_PHOTO_KEY = "profile-photo"

type UseUserProfilePhotoOptions = {
  fallbackSrc: string
}

const isBrowser = typeof window !== "undefined"

const isDataUrl = (value?: string | null) => typeof value === "string" && value.startsWith("data:")

const readStorageValue = (key: string) => {
  if (!isBrowser) return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const removeStorageValue = (key: string) => {
  if (!isBrowser) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

const dataUrlToFile = async (dataUrl: string, baseName: string) => {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  const mimeType = blob.type || "image/png"
  const extension = mimeType.split("/")[1] || "png"
  return new File([blob], `${baseName}.${extension}`, { type: mimeType })
}

export const useUserProfilePhoto = ({ fallbackSrc }: UseUserProfilePhotoOptions) => {
  const { isAuthReady, userId, userEmail } = useAuth()
  const [photoSrc, setPhotoSrc] = useState(fallbackSrc)
  const [photoPath, setPhotoPath] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remoteLoaded, setRemoteLoaded] = useState(false)
  const migrationStartedRef = useRef(false)
  const photoPathRef = useRef<string | null>(null)

  useEffect(() => {
    photoPathRef.current = photoPath
  }, [photoPath])

  const clearLegacyStorage = useCallback(() => {
    const scopedKey = buildUserScopedKey(userEmail, PROFILE_PHOTO_SUFFIX)
    removeStorageValue(scopedKey)
    removeStorageValue(LEGACY_PROFILE_PHOTO_KEY)
  }, [userEmail])

  useEffect(() => {
    if (!isAuthReady) return

    migrationStartedRef.current = false
    setRemoteLoaded(false)

    if (!userId) {
      setPhotoSrc(fallbackSrc)
      setPhotoPath(null)
      setRemoteLoaded(true)
      return
    }

    const unsubscribe = subscribeToUserProfilePhoto(
      userId,
      (photo) => {
        setPhotoSrc(photo?.url ? resolveMediaUrl(photo.url) : fallbackSrc)
        setPhotoPath(photo?.path || null)
        setRemoteLoaded(true)
      },
      (loadError) => {
        console.error("Profile photo subscription failed", loadError)
        setPhotoSrc(fallbackSrc)
        setPhotoPath(null)
        setRemoteLoaded(true)
      },
    )

    return unsubscribe
  }, [fallbackSrc, isAuthReady, userId])

  useEffect(() => {
    if (!isAuthReady || !userId || !remoteLoaded || migrationStartedRef.current) {
      return
    }

    migrationStartedRef.current = true

    if (photoPathRef.current || photoSrc !== fallbackSrc) {
      clearLegacyStorage()
      return
    }

    const scopedKey = buildUserScopedKey(userEmail, PROFILE_PHOTO_SUFFIX)
    const scopedLegacy = readStorageValue(scopedKey)
    const legacy = readStorageValue(LEGACY_PROFILE_PHOTO_KEY)
    const legacyDataUrl = [scopedLegacy, legacy].find((value) => isDataUrl(value))

    if (!legacyDataUrl) {
      clearLegacyStorage()
      return
    }

    void (async () => {
      setIsBusy(true)
      setError(null)
      let uploaded: MediaUploadResult | null = null

      try {
        const file = await dataUrlToFile(legacyDataUrl, "profile-photo")
        uploaded = await uploadImage(file, "profile-photo", "avatar")
        await saveUserProfilePhoto(userId, { url: uploaded.url, path: uploaded.path })
        clearLegacyStorage()
      } catch (migrationError) {
        console.error("Profile photo migration failed", migrationError)
        if (uploaded?.path) {
          void deleteMedia(uploaded.path).catch(() => undefined)
        }
      } finally {
        setIsBusy(false)
      }
    })()
  }, [clearLegacyStorage, fallbackSrc, isAuthReady, photoSrc, remoteLoaded, userEmail, userId])

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!userId) {
        setError("Utilisateur non connecte.")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Format non supporte. Choisis une image.")
        return
      }

      setIsBusy(true)
      setError(null)
      let uploaded: MediaUploadResult | null = null
      const previousPath = photoPathRef.current

      try {
        uploaded = await uploadImage(file, "profile-photo", "avatar")
        await saveUserProfilePhoto(userId, { url: uploaded.url, path: uploaded.path })
        if (previousPath) {
          void deleteMedia(previousPath).catch(() => undefined)
        }
        clearLegacyStorage()
      } catch (uploadError) {
        console.error("Profile photo upload failed", uploadError)
        if (uploaded?.path) {
          void deleteMedia(uploaded.path).catch(() => undefined)
        }
        setError(uploadError instanceof Error ? uploadError.message : "Impossible de televerser la photo.")
      } finally {
        setIsBusy(false)
      }
    },
    [clearLegacyStorage, userId],
  )

  const clearPhoto = useCallback(async () => {
    if (!userId) {
      setError("Utilisateur non connecte.")
      return
    }

    setIsBusy(true)
    setError(null)
    const previousPath = photoPathRef.current

    try {
      await clearUserProfilePhoto(userId)
      if (previousPath) {
        void deleteMedia(previousPath).catch(() => undefined)
      }
      clearLegacyStorage()
    } catch (clearError) {
      console.error("Profile photo delete failed", clearError)
      setError(clearError instanceof Error ? clearError.message : "Impossible de supprimer la photo.")
    } finally {
      setIsBusy(false)
    }
  }, [clearLegacyStorage, userId])

  return {
    photoSrc,
    hasCustomPhoto: Boolean(photoPath || (photoSrc && photoSrc !== fallbackSrc)),
    isBusy,
    error,
    uploadPhoto,
    clearPhoto,
  }
}
