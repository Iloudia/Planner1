const API_BASE = String(import.meta.env.VITE_API_BASE || "").trim().replace(/\/+$/g, "")

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`)

export const buildApiUrl = (path: string) => {
  const normalizedPath = normalizePath(path)
  return API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath
}

export const resolvePublicUrl = (value: string) => {
  if (!value) return value
  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value
  }

  return value.startsWith("/") ? buildApiUrl(value) : value
}

export const getApiTargetLabel = () => {
  if (API_BASE) return API_BASE
  if (typeof window !== "undefined") return window.location.origin
  return "same-origin"
}
