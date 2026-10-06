import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { appRuntime, getInternalPathFromAppUrl, openExternalUrl } from "./runtime"

const MobileRuntimeBridge = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!appRuntime.isNative) return

    let disposed = false
    const listenerHandles: Array<{ remove: () => Promise<void> }> = []

    void import("@capacitor/app").then(async ({ App }) => {
      if (disposed) return

      const backButtonHandle = await App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack && location.pathname !== "/") {
          navigate(-1)
          return
        }
        void App.exitApp()
      })

      const appUrlHandle = await App.addListener("appUrlOpen", ({ url }) => {
        const target = getInternalPathFromAppUrl(url)
        if (target) navigate(target)
      })

      if (disposed) {
        await backButtonHandle.remove()
        await appUrlHandle.remove()
        return
      }

      listenerHandles.push(backButtonHandle, appUrlHandle)
    })

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest<HTMLAnchorElement>("a[href]")
      if (!anchor || anchor.hasAttribute("data-capacitor-internal")) return

      let url: URL
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }

      if (!["http:", "https:"].includes(url.protocol) || url.origin === window.location.origin) return

      event.preventDefault()
      void openExternalUrl(url.href)
    }

    document.addEventListener("click", handleDocumentClick, true)

    return () => {
      disposed = true
      document.removeEventListener("click", handleDocumentClick, true)
      listenerHandles.forEach((handle) => void handle.remove())
    }
  }, [location.pathname, navigate])

  return null
}

export default MobileRuntimeBridge
