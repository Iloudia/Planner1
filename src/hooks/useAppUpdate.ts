import { useCallback, useEffect, useRef, useState } from "react"

const VERSION_ENDPOINT = "/version.json"
const VERSION_POLL_INTERVAL_MS = 60_000
const AUTO_RELOAD_GUARD_KEY = "planner.app-update.auto-reload-target"

type CheckContext = "initial" | "poll"

type VersionPayload = {
  version?: unknown
}

const fetchLatestVersion = async (signal?: AbortSignal) => {
  const cacheBustingUrl = `${VERSION_ENDPOINT}?v=${Date.now()}`
  const response = await fetch(cacheBustingUrl, {
    cache: "no-store",
    credentials: "same-origin",
    signal,
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as VersionPayload
  const version = typeof payload.version === "string" ? payload.version.trim() : ""
  return version || null
}

export const useAppUpdate = () => {
  const [detectedVersion, setDetectedVersion] = useState<string | null>(null)
  const dismissedVersionRef = useRef<string | null>(null)

  const applyUpdate = useCallback(() => {
    if (detectedVersion) {
      sessionStorage.setItem(AUTO_RELOAD_GUARD_KEY, detectedVersion)
    }
    window.location.reload()
  }, [detectedVersion])

  const dismissUpdate = useCallback(() => {
    dismissedVersionRef.current = detectedVersion
    setDetectedVersion(null)
  }, [detectedVersion])

  useEffect(() => {
    if (import.meta.env.DEV) {
      return
    }

    let isDisposed = false
    const abortController = new AbortController()

    const checkVersion = async (context: CheckContext) => {
      try {
        const latestVersion = await fetchLatestVersion(abortController.signal)
        if (isDisposed || !latestVersion || latestVersion === __APP_VERSION__) {
          return
        }

        if (context === "initial") {
          const previousAutoReloadTarget = sessionStorage.getItem(AUTO_RELOAD_GUARD_KEY)
          if (previousAutoReloadTarget !== latestVersion) {
            sessionStorage.setItem(AUTO_RELOAD_GUARD_KEY, latestVersion)
            window.location.reload()
            return
          }
        }

        if (dismissedVersionRef.current === latestVersion) {
          return
        }

        setDetectedVersion((currentVersion) => (currentVersion === latestVersion ? currentVersion : latestVersion))
      } catch (error) {
        if (!abortController.signal.aborted && import.meta.env.DEV) {
          console.warn("Unable to check app version", error)
        }
      }
    }

    void checkVersion("initial")

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return
      }
      void checkVersion("poll")
    }, VERSION_POLL_INTERVAL_MS)

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkVersion("poll")
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      isDisposed = true
      abortController.abort()
      window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  return {
    isUpdateAvailable: Boolean(detectedVersion),
    applyUpdate,
    dismissUpdate,
  }
}

