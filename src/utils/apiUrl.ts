const API_BASE = String(import.meta.env.VITE_API_BASE || "").trim().replace(/\/+$/g, "")

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`)

const getResolvedApiBase = () => {
  if (typeof window !== "undefined") {
    return ""
  }
  return API_BASE
}

export const buildApiUrl = (path: string) => {
  const normalizedPath = normalizePath(path)
  const apiBase = getResolvedApiBase()
  return apiBase ? `${apiBase}${normalizedPath}` : normalizedPath
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
