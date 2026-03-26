const API_BASE = String(import.meta.env.VITE_API_BASE || "").trim().replace(/\/+$/g, "")

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`)

const getResolvedApiBase = () => API_BASE

const getSameOriginFallbackUrl = (path: string) => {
  if (typeof window === "undefined" || !API_BASE) {
    return null
  }

  try {
    const apiOrigin = new URL(API_BASE).origin
    if (window.location.origin === apiOrigin) {
      return null
    }
  } catch {
    return null
  }

  return normalizePath(path)
}

export const buildApiUrl = (path: string) => {
  const normalizedPath = normalizePath(path)
  const apiBase = getResolvedApiBase()
  return apiBase ? `${apiBase}${normalizedPath}` : normalizedPath
}

export const fetchApi = async (path: string, init?: RequestInit) => {
  const primaryUrl = buildApiUrl(path)

  try {
    return await fetch(primaryUrl, init)
  } catch (error) {
    const fallbackUrl = getSameOriginFallbackUrl(path)
    if (error instanceof TypeError && fallbackUrl && fallbackUrl !== primaryUrl) {
      return fetch(fallbackUrl, init)
    }
    throw error
  }
}

export const resolvePublicUrl = (value: string) => {
  if (!value) return value
  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value
  }

  return value.startsWith("/") ? buildApiUrl(value) : value
}

export const getApiTargetLabel = () => {
  const apiBase = getResolvedApiBase()
  if (apiBase) return apiBase
  if (typeof window !== "undefined") return window.location.origin
  return "same-origin"
}
