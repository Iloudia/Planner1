export const HOME_WELCOME_FONTS = [
  { id: "playfair", name: "Élégante", family: '"Playfair Display", "Times New Roman", serif' },
  { id: "manrope", name: "Moderne", family: '"Manrope", Arial, sans-serif' },
  { id: "libre", name: "Littéraire", family: '"Libre Baskerville", Georgia, serif' },
  { id: "italiana", name: "Raffinée", family: '"Italiana", Georgia, serif' },
  { id: "inter", name: "Minimaliste", family: '"Inter", Arial, sans-serif' },
  { id: "kapakana", name: "Manuscrite", family: '"Kapakana", cursive' },
] as const

export type HomeWelcomeFont = (typeof HOME_WELCOME_FONTS)[number]["id"]

export const DEFAULT_HOME_WELCOME_FONT: HomeWelcomeFont = "playfair"

const HOME_WELCOME_FONT_IDS = new Set<HomeWelcomeFont>(HOME_WELCOME_FONTS.map((font) => font.id))

export const normalizeHomeWelcomeFont = (value: unknown): HomeWelcomeFont =>
  typeof value === "string" && HOME_WELCOME_FONT_IDS.has(value as HomeWelcomeFont)
    ? (value as HomeWelcomeFont)
    : DEFAULT_HOME_WELCOME_FONT

export const getHomeWelcomeFontClassName = (value: unknown) =>
  `profile-welcome-font--${normalizeHomeWelcomeFont(value)}`
