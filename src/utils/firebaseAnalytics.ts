import { getAnalytics, isSupported, setAnalyticsCollectionEnabled, type Analytics } from "firebase/analytics"
import { app, firebaseConfig } from "./firebase"

let analytics: Analytics | null = null
let analyticsReady: Promise<Analytics | null> | null = null
let analyticsConsentGranted = false

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void
}

const applyBrowserAnalyticsConsent = (enabled: boolean) => {
  if (typeof window === "undefined") return

  const analyticsWindow = window as AnalyticsWindow
  Reflect.set(analyticsWindow, `ga-disable-${firebaseConfig.measurementId}`, !enabled)
  analyticsWindow.gtag?.("consent", "update", {
    analytics_storage: enabled ? "granted" : "denied",
  })
}

const initAnalytics = () => {
  if (!analyticsReady) {
    analyticsReady = isSupported()
      .then((supported) => {
        if (!supported) return null
        analytics ??= getAnalytics(app)
        setAnalyticsCollectionEnabled(analytics, analyticsConsentGranted)
        return analytics
      })
      .catch(() => null)
  }

  return analyticsReady
}

const setAnalyticsConsent = (enabled: boolean) => {
  analyticsConsentGranted = enabled
  applyBrowserAnalyticsConsent(enabled)

  if (enabled) {
    return initAnalytics().then((instance) => {
      if (instance) setAnalyticsCollectionEnabled(instance, true)
      return instance
    })
  }

  if (analytics) setAnalyticsCollectionEnabled(analytics, false)
  return Promise.resolve(analytics)
}

export { setAnalyticsConsent }
