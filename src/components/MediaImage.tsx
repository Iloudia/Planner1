import { useEffect, useState, type ImgHTMLAttributes } from "react"
import { useAuth } from "../context/AuthContext"
import { resolveMediaUrl } from "../services/media/api"
import { auth } from "../utils/firebase"

type MediaImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string
}

const buildMediaCandidates = (value: string) => {
  const resolved = resolveMediaUrl(value)
  const candidates: string[] = []

  if (!resolved) {
    return candidates
  }

  if (typeof window !== "undefined") {
    try {
      const url = new URL(resolved, window.location.origin)
      if (url.pathname.startsWith("/media/")) {
        const sameOriginPath = `${url.pathname}${url.search}${url.hash}`
        if (url.origin !== window.location.origin) {
          candidates.push(sameOriginPath)
        }
      }
    } catch {
      // ignore malformed values
    }
  }

  candidates.push(resolved)
  return Array.from(new Set(candidates.filter(Boolean)))
}

const isProtectedMediaUrl = (value: string) => {
  if (!value) {
    return false
  }

  const resolved = resolveMediaUrl(value)

  try {
    const url = typeof window !== "undefined" ? new URL(resolved, window.location.origin) : new URL(resolved, "http://localhost")
    return /^\/media\/users\//.test(url.pathname)
  } catch {
    return /^\/?media\/users\//.test(resolved)
  }
}

const MediaImage = ({ src, ...props }: MediaImageProps) => {
  const { isAuthReady, userId } = useAuth()
  const mediaCandidates = buildMediaCandidates(src)
  const fallbackSrc = mediaCandidates[0] ?? resolveMediaUrl(src)
  const [displaySrc, setDisplaySrc] = useState(fallbackSrc)

  useEffect(() => {
    const nextCandidates = buildMediaCandidates(src)
    const nextFallbackSrc = nextCandidates[0] ?? resolveMediaUrl(src)

    if (!src || !isProtectedMediaUrl(src)) {
      setDisplaySrc(nextFallbackSrc)
      return
    }

    if (!isAuthReady) {
      setDisplaySrc("")
      return
    }

    if (!userId) {
      setDisplaySrc(nextFallbackSrc)
      return
    }

    let isActive = true
    let objectUrl: string | null = null

    void (async () => {
      const token = await auth.currentUser?.getIdToken()
      for (const candidate of nextCandidates) {
        try {
          const response = await fetch(candidate, {
            credentials: "include",
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : undefined,
          })

          if (!response.ok) {
            continue
          }

          const blob = await response.blob()
          objectUrl = URL.createObjectURL(blob)

          if (isActive) {
            setDisplaySrc(objectUrl)
          }
          return
        } catch {
          // try next candidate
        }
      }

      if (isActive) {
        setDisplaySrc(nextFallbackSrc)
      }
    })()

    return () => {
      isActive = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [fallbackSrc, isAuthReady, src, userId])

  return <img {...props} src={displaySrc} />
}

export default MediaImage
