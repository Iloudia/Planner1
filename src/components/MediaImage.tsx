import { useEffect, useState, type ImgHTMLAttributes } from "react"
import { useAuth } from "../context/AuthContext"
import { resolveMediaUrl } from "../services/media/api"
import { auth } from "../utils/firebase"

type MediaImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string
}

const PLACEHOLDER_SRC = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="12" fill="#f3efe7"/>
    <path d="M16 42l10-12 8 8 6-7 8 11H16z" fill="#dccfbb"/>
    <circle cx="24" cy="23" r="5" fill="#d1c0a8"/>
  </svg>`,
)}`

type CachedResolvedSource = {
  src: string
}

const resolvedSourceCache = new Map<string, CachedResolvedSource>()
let cacheCleanupRegistered = false

const cleanupResolvedSourceCache = () => {
  for (const entry of resolvedSourceCache.values()) {
    if (entry.src.startsWith("blob:")) {
      URL.revokeObjectURL(entry.src)
    }
  }
  resolvedSourceCache.clear()
}

const ensureCacheCleanupRegistered = () => {
  if (cacheCleanupRegistered || typeof window === "undefined") {
    return
  }

  window.addEventListener("beforeunload", cleanupResolvedSourceCache, { once: true })
  cacheCleanupRegistered = true
}

const readCachedSource = (cacheKey: string) => {
  const cached = resolvedSourceCache.get(cacheKey)
  if (!cached) {
    return null
  }

  resolvedSourceCache.delete(cacheKey)
  resolvedSourceCache.set(cacheKey, cached)
  return cached.src
}

const rememberCachedSource = (cacheKey: string, entry: CachedResolvedSource) => {
  ensureCacheCleanupRegistered()
  resolvedSourceCache.delete(cacheKey)
  resolvedSourceCache.set(cacheKey, entry)
}

const buildMediaCandidates = (value: string) => {
  const resolved = resolveMediaUrl(value)
  const candidates: string[] = []

  if (!resolved) {
    return candidates
  }

  candidates.push(resolved)

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

const createAbortError = () => new Error("media-load-aborted")

const preloadImageSource = (value: string, signal: AbortSignal) =>
  new Promise<string>((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError())
      return
    }

    const image = new Image()

    const cleanup = () => {
      image.onload = null
      image.onerror = null
      signal.removeEventListener("abort", handleAbort)
    }

    const handleAbort = () => {
      cleanup()
      image.src = ""
      reject(createAbortError())
    }

    image.onload = () => {
      cleanup()
      resolve(value)
    }

    image.onerror = () => {
      cleanup()
      reject(new Error("image-load-failed"))
    }

    signal.addEventListener("abort", handleAbort, { once: true })
    image.src = value
  })

const getMediaCacheKey = (src: string, userId: string | null, protectedMedia: boolean) =>
  protectedMedia ? `protected:${userId ?? "anonymous"}:${src}` : `public:${src}`

const resolveProtectedSource = async (candidates: string[], signal: AbortSignal) => {
  const token = await auth.currentUser?.getIdToken()

  for (const candidate of candidates) {
    if (signal.aborted) {
      throw createAbortError()
    }

    try {
      const response = await fetch(candidate, {
        credentials: "include",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        signal,
      })

      if (!response.ok) {
        continue
      }

      const blob = await response.blob()
      if (signal.aborted || !blob.type.startsWith("image/")) {
        continue
      }

      const objectUrl = URL.createObjectURL(blob)

      try {
        await preloadImageSource(objectUrl, signal)
        return objectUrl
      } catch (error) {
        URL.revokeObjectURL(objectUrl)
        if (signal.aborted) {
          throw error
        }
      }
    } catch (error) {
      if (signal.aborted) {
        throw error
      }
    }
  }

  return null
}

const resolvePublicSource = async (candidates: string[], signal: AbortSignal) => {
  for (const candidate of candidates) {
    try {
      await preloadImageSource(candidate, signal)
      return candidate
    } catch (error) {
      if (signal.aborted) {
        throw error
      }
    }
  }

  return null
}

const MediaImage = ({ src, alt, onError, onLoad, ...props }: MediaImageProps) => {
  const { isAuthReady, userId } = useAuth()
  const [displaySrc, setDisplaySrc] = useState(PLACEHOLDER_SRC)
  const [hasResolvedSource, setHasResolvedSource] = useState(false)

  useEffect(() => {
    const normalizedSrc = src.trim()
    const nextCandidates = buildMediaCandidates(normalizedSrc)
    const protectedMedia = isProtectedMediaUrl(normalizedSrc)

    if (!normalizedSrc || nextCandidates.length === 0) {
      setDisplaySrc(PLACEHOLDER_SRC)
      setHasResolvedSource(false)
      return
    }

    if (protectedMedia && (!isAuthReady || !userId)) {
      setDisplaySrc(PLACEHOLDER_SRC)
      setHasResolvedSource(false)
      return
    }

    const cacheKey = getMediaCacheKey(normalizedSrc, userId, protectedMedia)
    const cachedSource = readCachedSource(cacheKey)
    if (cachedSource) {
      setDisplaySrc(cachedSource)
      setHasResolvedSource(true)
      return
    }

    const controller = new AbortController()

    void (async () => {
      setDisplaySrc(PLACEHOLDER_SRC)
      setHasResolvedSource(false)

      try {
        const resolvedSource = protectedMedia
          ? await resolveProtectedSource(nextCandidates, controller.signal)
          : await resolvePublicSource(nextCandidates, controller.signal)

        if (!resolvedSource || controller.signal.aborted) {
          return
        }

        rememberCachedSource(cacheKey, {
          src: resolvedSource,
        })

        setDisplaySrc(resolvedSource)
        setHasResolvedSource(true)
      } catch (error) {
        if (!controller.signal.aborted) {
          setDisplaySrc(PLACEHOLDER_SRC)
          setHasResolvedSource(false)
        }
      }
    })()

    return () => {
      controller.abort()
    }
  }, [isAuthReady, src, userId])

  return (
    <img
      {...props}
      alt={hasResolvedSource ? alt : ""}
      onError={(event) => {
        if (displaySrc !== PLACEHOLDER_SRC) {
          setDisplaySrc(PLACEHOLDER_SRC)
          setHasResolvedSource(false)
        }
        onError?.(event)
      }}
      onLoad={(event) => {
        if (displaySrc !== PLACEHOLDER_SRC) {
          onLoad?.(event)
        }
      }}
      src={displaySrc}
    />
  )
}

export default MediaImage
