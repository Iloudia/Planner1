export const CALENDAR_EVENT_CATEGORIES = ["Perso", "Travail", "Sport", "Rendez-vous", "Repos"] as const

export type CalendarEventCategory = (typeof CALENDAR_EVENT_CATEGORIES)[number]
export type CalendarEventColors = Record<CalendarEventCategory, string>

export const CALENDAR_EVENT_PALETTES = [
  {
    id: "classic",
    name: "Élégance",
    colors: { Perso: "#7F96A8", Travail: "#C8B39B", Sport: "#E3C9A4", "Rendez-vous": "#F2D9C7", Repos: "#F8EFE5" },
  },
  {
    id: "blush",
    name: "Rose poudré",
    colors: { Perso: "#E28FA4", Travail: "#B85F7B", Sport: "#F1B07F", "Rendez-vous": "#CE7894", Repos: "#FAE8ED" },
  },
  {
    id: "sage",
    name: "Sauge",
    colors: { Perso: "#98B88A", Travail: "#668763", Sport: "#C8D26E", "Rendez-vous": "#78986C", Repos: "#EDF3E3" },
  },
  {
    id: "ocean",
    name: "Océan",
    colors: { Perso: "#82B7D0", Travail: "#527F99", Sport: "#71B8AD", "Rendez-vous": "#A8CEE1", Repos: "#EBF4F7" },
  },
  {
    id: "sunset",
    name: "Coucher de soleil",
    colors: { Perso: "#E57E5E", Travail: "#B85A42", Sport: "#DFA234", "Rendez-vous": "#F0AA88", Repos: "#FBE5D2" },
  },
  {
    id: "lavender",
    name: "Lavande",
    colors: { Perso: "#AE8CCE", Travail: "#8A68AA", Sport: "#C9A9DF", "Rendez-vous": "#9B75B4", Repos: "#F0E7F5" },
  },
] as const satisfies ReadonlyArray<{ id: string; name: string; colors: CalendarEventColors }>

export type CalendarEventPaletteId = (typeof CALENDAR_EVENT_PALETTES)[number]["id"]

export const DEFAULT_CALENDAR_EVENT_PALETTE: CalendarEventPaletteId = "classic"

const CALENDAR_EVENT_PALETTE_IDS = new Set<CalendarEventPaletteId>(
  CALENDAR_EVENT_PALETTES.map((palette) => palette.id),
)

export const normalizeCalendarEventPalette = (value: unknown): CalendarEventPaletteId =>
  typeof value === "string" && CALENDAR_EVENT_PALETTE_IDS.has(value as CalendarEventPaletteId)
    ? (value as CalendarEventPaletteId)
    : DEFAULT_CALENDAR_EVENT_PALETTE

export const getCalendarEventPalette = (value: unknown) => {
  const paletteId = normalizeCalendarEventPalette(value)
  return CALENDAR_EVENT_PALETTES.find((palette) => palette.id === paletteId) ?? CALENDAR_EVENT_PALETTES[0]
}

export const getCalendarEventColors = (value: unknown): CalendarEventColors =>
  getCalendarEventPalette(value).colors
