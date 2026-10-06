import { Capacitor } from "@capacitor/core"

export type AppPlatform = "web" | "ios" | "android"

const platform = Capacitor.getPlatform() as AppPlatform
const isNative = Capacitor.isNativePlatform()

export const appRuntime = Object.freeze({
  isNative,
  platform,
  isAndroid: isNative && platform === "android",
  isIOS: isNative && platform === "ios",
})

export const initializeAppRuntime = () => {
  if (!appRuntime.isNative || typeof document === "undefined") return

  document.documentElement.classList.add("is-capacitor", `is-capacitor-${appRuntime.platform}`)
  document.documentElement.dataset.appPlatform = appRuntime.platform
}

export const openExternalUrl = async (url: string) => {
  if (!appRuntime.isNative) {
    window.location.href = url
    return
  }

  const { Browser } = await import("@capacitor/browser")
  await Browser.open({ url })
}

const appHosts = new Set(["meandrituals.com", "www.meandrituals.com"])

export const getInternalPathFromAppUrl = (value: string) => {
  try {
    const url = new URL(value)
    if ((url.protocol === "https:" || url.protocol === "http:") && !appHosts.has(url.hostname)) {
      return null
    }
    if (!["https:", "http:", "meandrituals:"].includes(url.protocol)) {
      return null
    }

    const customSchemePrefix = url.protocol === "meandrituals:" && url.hostname ? `/${url.hostname}` : ""
    const pathname = `${customSchemePrefix}${url.pathname}`.replace(/\/{2,}/g, "/") || "/"
    return `${pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}
