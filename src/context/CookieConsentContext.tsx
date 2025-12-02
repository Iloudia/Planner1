import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react"

type CookieConsentStatus = "unknown" | "accepted" | "rejected" | "custom"

export type CookiePreferences = {
  essential: boolean
  analytics: boolean
  preferences: boolean
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
  saveCustomPreferences: (preferences: Pick<CookiePreferences, "analytics" | "preferences">) => void
  openPreferences: () => void
  closePreferences: () => void
}

const STORAGE_KEY = "planner.cookieConsent"

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  preferences: false,
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined)

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
    return {
      status: parsed.status ?? "unknown",
      preferences: {
        ...defaultPreferences,
        ...parsed.preferences,
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

  const persist = (next: CookieConsentState) => {
    setState(next)
  }

  const acceptAll = () => {
    persist({
      status: "accepted",
      preferences: { essential: true, analytics: true, preferences: true },
      decidedAt: Date.now(),
    })
    setIsPreferenceCenterOpen(false)
  }

  const rejectAll = () => {
    persist({
      status: "rejected",
      preferences: { ...defaultPreferences, analytics: false, preferences: false },
      decidedAt: Date.now(),
    })
    setIsPreferenceCenterOpen(false)
  }

  const saveCustomPreferences = (preferences: Pick<CookiePreferences, "analytics" | "preferences">) => {
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
