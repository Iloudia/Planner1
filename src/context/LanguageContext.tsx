import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "./AuthContext"
import { LANGUAGE_STORAGE_KEY, normalizeAppLanguage, type AppLanguage } from "../i18n"

type LanguageContextValue = {
  language: AppLanguage
  setLanguage: (language: AppLanguage) => Promise<void>
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation()
  const { isAuthReady, isAuthenticated, userProfile, updateUserProfile } = useAuth()
  const [language, setLanguageState] = useState<AppLanguage>(() => normalizeAppLanguage(i18n.resolvedLanguage))
  const synchronizedProfileLanguage = useRef<string | null>(null)

  const applyLanguage = useCallback(async (nextLanguage: AppLanguage, persistProfile: boolean) => {
    setLanguageState(nextLanguage)
    document.documentElement.lang = nextLanguage
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    } catch {
      // The language still applies for the current session when storage is unavailable.
    }
    await i18n.changeLanguage(nextLanguage)

    if (persistProfile && isAuthenticated && userProfile.preferences?.interfaceLanguage !== nextLanguage) {
      try {
        await updateUserProfile({
          personalInfo: userProfile.personalInfo ?? {},
          identityInfo: userProfile.identityInfo ?? {},
          preferences: {
            ...userProfile.preferences,
            interfaceLanguage: nextLanguage,
          },
        })
      } catch (error) {
        console.warn("Language preference could not be synchronized with the user profile.", error)
      }
    }
  }, [i18n, isAuthenticated, updateUserProfile, userProfile])

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated) return
    const profileLanguage = userProfile.preferences?.interfaceLanguage
    if (!profileLanguage || synchronizedProfileLanguage.current === profileLanguage) return

    synchronizedProfileLanguage.current = profileLanguage
    const normalizedLanguage = normalizeAppLanguage(profileLanguage)
    if (normalizedLanguage !== language) {
      void applyLanguage(normalizedLanguage, false)
    }
  }, [applyLanguage, isAuthReady, isAuthenticated, language, userProfile.preferences?.interfaceLanguage])

  const setLanguage = useCallback(
    (nextLanguage: AppLanguage) => applyLanguage(nextLanguage, true),
    [applyLanguage],
  )

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useAppLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useAppLanguage must be used within LanguageProvider")
  return context
}
