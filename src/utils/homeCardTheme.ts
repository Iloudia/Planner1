export const HOME_CARD_THEMES = [
  { id: "classic", name: "Classique", description: "Fond blanc et contours discrets" },
  { id: "sand", name: "Sable", description: "Une finition douce et chaleureuse" },
  { id: "glass", name: "Verre", description: "Un fond translucide et lumineux" },
  { id: "ebony", name: "Ébène", description: "Un contraste profond et élégant" },
  { id: "blush", name: "Rose poudré", description: "Une tonalité délicate et féminine" },
  { id: "sage", name: "Sauge", description: "Une ambiance naturelle et apaisante" },
  { id: "terracotta", name: "Terracotta", description: "Une nuance solaire et enveloppante" },
  { id: "midnight", name: "Bleu nuit", description: "Une finition sombre et sophistiquée" },
] as const

export type HomeCardTheme = (typeof HOME_CARD_THEMES)[number]["id"]

export const DEFAULT_HOME_CARD_THEME: HomeCardTheme = "classic"

const HOME_CARD_THEME_IDS = new Set<HomeCardTheme>(HOME_CARD_THEMES.map((theme) => theme.id))

export const normalizeHomeCardTheme = (value: unknown): HomeCardTheme =>
  typeof value === "string" && HOME_CARD_THEME_IDS.has(value as HomeCardTheme)
    ? (value as HomeCardTheme)
    : DEFAULT_HOME_CARD_THEME

export const getCardThemeClassName = (value: unknown) =>
  `card-theme--${normalizeHomeCardTheme(value)}`
