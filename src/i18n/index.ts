import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import { resources } from "./resources"

export type AppLanguage = "fr" | "en"

export const LANGUAGE_STORAGE_KEY = "planner.language.preference.v2"

export const normalizeAppLanguage = (value?: string | null): AppLanguage =>
  String(value ?? "").toLowerCase().startsWith("en") ? "en" : "fr"

const readInitialLanguage = (): AppLanguage => {
  if (typeof window === "undefined") return "fr"

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (storedLanguage) return normalizeAppLanguage(storedLanguage)
  } catch {
    // Browser detection below remains available when storage is unavailable.
  }

  const preferredLanguages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language]
  const supportedPreference = preferredLanguages.find((language) => /^(fr|en)(-|$)/i.test(language))
  return normalizeAppLanguage(supportedPreference)
}

const initialLanguage = readInitialLanguage()

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  initAsync: false,
  fallbackLng: "fr",
  supportedLngs: ["fr", "en"],
  interpolation: { escapeValue: false },
  returnNull: false,
})

if (typeof document !== "undefined") {
  document.documentElement.lang = initialLanguage
}

export default i18n
