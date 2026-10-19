export const COLOR_MODES = [
  { id: "light", name: "Clair", description: "L’apparence actuelle du site" },
  { id: "dark", name: "Sombre", description: "Une interface sombre et reposante" },
] as const

export type ColorMode = (typeof COLOR_MODES)[number]["id"]

export const DEFAULT_COLOR_MODE: ColorMode = "light"
export const COLOR_MODE_STORAGE_KEY = "planner.color-mode.v1"

export const normalizeColorMode = (value: unknown): ColorMode =>
  value === "dark" ? "dark" : DEFAULT_COLOR_MODE

export const applyColorMode = (value: unknown) => {
  const mode = normalizeColorMode(value)
  document.documentElement.dataset.colorMode = mode
  document.documentElement.style.colorScheme = mode

  try {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)
  } catch {
    // Le thème reste appliqué même si le stockage local est indisponible.
  }
}
