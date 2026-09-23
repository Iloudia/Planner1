import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react"

type CookieConsentStatus = "unknown" | "accepted" | "rejected" | "custom"

export type CookiePreferences = {
  essential: boolean
  preferences: boolean
  analytics: boolean
}

type CookieConsentState = {
  status: CookieConsentStatus
  preferences: CookiePreferences
  decidedAt?: number
}

type CookieConsentContextValue = {
  status: CookieConsentStatus
  preferences: CookiePreferences
  shouldShowBanner: boolean
  isPreferenceCenterOpen: boolean
  acceptAll: () => void
  rejectAll: () => void
  saveCustomPreferences: (preferences: Pick<CookiePreferences, "preferences" | "analytics">) => void
  openPreferences: () => void
  closePreferences: () => void
}

const STORAGE_KEY = "planner.cookieConsent"

const OPTIONAL_STORAGE_KEY_SUFFIXES = [
  "planner.display.preferences",
  "planner.language.preference",
  "planner.auth.email_history.v1",
  "planner.auth.remember",
  "dietPageActiveTab",
]

const ANALYTICS_COOKIE_NAMES = ["_ga", "_gid", "_gat"]
const ANALYTICS_COOKIE_PREFIXES = ["_ga_", "_gat_", "_gac_"]

const defaultPreferences: CookiePreferences = {
  essential: true,
  preferences: false,
  analytics: false,
}

const isConsentExpired = (decidedAt?: number) => {
  if (!decidedAt || !Number.isFinite(decidedAt)) return true
  const limit = new Date()
  limit.setMonth(limit.getMonth() - 13)
  return decidedAt < limit.getTime()
}

const isOptionalStorageKey = (key: string) =>
  OPTIONAL_STORAGE_KEY_SUFFIXES.some((suffix) => key === suffix || key.endsWith(`:${suffix}`))

const removeCookie = (name: string) => {
  const hostname = window.location.hostname
  const labels = hostname.split(".")
  const parentDomain = labels.length > 2 ? labels.slice(-2).join(".") : hostname
  const domainAttributes = Array.from(new Set([
    "",
    `; domain=${hostname}`,
    `; domain=.${hostname}`,
    `; domain=${parentDomain}`,
    `; domain=.${parentDomain}`,
  ]))
  domainAttributes.forEach((domain) => {
    document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}; SameSite=Lax`
  })
}

const clearOptionalClientStorage = ({ preferences, analytics }: Pick<CookiePreferences, "preferences" | "analytics">) => {
  if (!preferences) {
    removeCookie("googtrans")
    try {
      Object.keys(window.localStorage).forEach((key) => {
        if (isOptionalStorageKey(key)) {
          window.localStorage.removeItem(key)
        }
      })
    } catch {
      // ignore storage failures
    }
  }

  if (!analytics) {
    document.cookie
      .split(";")
      .map((cookie) => cookie.split("=")[0]?.trim())
      .filter((name): name is string => Boolean(name))
      .filter((name) => ANALYTICS_COOKIE_NAMES.includes(name) || ANALYTICS_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix)))
      .forEach(removeCookie)
  }
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined)
const validStatuses = new Set<CookieConsentStatus>(["unknown", "accepted", "rejected", "custom"])

const readStoredPreferences = (): CookieConsentState => {
  if (typeof window === "undefined") {
    return { status: "unknown", preferences: defaultPreferences }
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { status: "unknown", preferences: defaultPreferences }
    }
    const parsed = JSON.parse(stored) as CookieConsentState
    if (!parsed || !parsed.preferences) {
      return { status: "unknown", preferences: defaultPreferences }
    }
    if (isConsentExpired(parsed.decidedAt)) {
      return { status: "unknown", preferences: defaultPreferences }
    }
    const incoming = parsed.preferences as Partial<CookiePreferences>
    const preferencesEnabled = Boolean(incoming.preferences)
    const analyticsEnabled = Boolean(incoming.analytics)
    const storedStatus = validStatuses.has(parsed.status) ? parsed.status : "unknown"
    const status = storedStatus === "accepted" && (!preferencesEnabled || !analyticsEnabled)
      ? "custom"
      : storedStatus
    return {
      status,
      preferences: {
        ...defaultPreferences,
        preferences: status === "rejected" ? false : preferencesEnabled,
        analytics: status === "rejected" ? false : analyticsEnabled,
        essential: true,
      },
      decidedAt: parsed.decidedAt,
    }
  } catch {
    return { status: "unknown", preferences: defaultPreferences }
  }
}

export const CookieConsentProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<CookieConsentState>(() => readStoredPreferences())
  const [isPreferenceCenterOpen, setIsPreferenceCenterOpen] = useState(false)

  useEffect(() => {
    if (state.status === "unknown") {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore storage failures
    }
  }, [state])
  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return
    }
    clearOptionalClientStorage(state.preferences)
  }, [state.preferences.analytics, state.preferences.preferences])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setState(readStoredPreferences())
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const persist = (next: CookieConsentState) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // The in-memory choice still applies for the current page.
    }
    setState(next)
  }

  const acceptAll = () => {
    persist({
      status: "accepted",
      preferences: { essential: true, preferences: true, analytics: true },
      decidedAt: Date.now(),
    })
    setIsPreferenceCenterOpen(false)
  }

  const rejectAll = () => {
    persist({
      status: "rejected",
      preferences: { ...defaultPreferences, preferences: false, analytics: false },
      decidedAt: Date.now(),
    })
    setIsPreferenceCenterOpen(false)
  }

  const saveCustomPreferences = (preferences: Pick<CookiePreferences, "preferences" | "analytics">) => {
    persist({
      status: "custom",
      preferences: { ...defaultPreferences, ...preferences },
      decidedAt: Date.now(),
    })
    setIsPreferenceCenterOpen(false)
  }

  const openPreferences = () => setIsPreferenceCenterOpen(true)
  const closePreferences = () => setIsPreferenceCenterOpen(false)

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      status: state.status,
      preferences: state.preferences,
      shouldShowBanner: state.status === "unknown",
      isPreferenceCenterOpen,
      acceptAll,
      rejectAll,
      saveCustomPreferences,
      openPreferences,
      closePreferences,
    }),
    [state, isPreferenceCenterOpen],
  )

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider")
  }
  return context
}
