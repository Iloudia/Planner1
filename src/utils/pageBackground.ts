export const DEFAULT_PAGE_BACKGROUND = "#f8f6f1"

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i

export const normalizePageBackground = (value?: string | null) => {
  const color = value?.trim()
  return color && HEX_COLOR_PATTERN.test(color) ? color.toLowerCase() : DEFAULT_PAGE_BACKGROUND
}

const toCssUrl = (value: string) => `url(${JSON.stringify(value)})`

export const applyPageBackground = (color?: string | null, imageUrl?: string | null) => {
  const root = document.documentElement
  const normalizedColor = normalizePageBackground(color)
  const normalizedImageUrl = imageUrl?.trim() ?? ""

  root.style.setProperty("--page-background-color", normalizedColor)

  if (normalizedImageUrl) {
    const cssImage = toCssUrl(normalizedImageUrl)
    root.style.setProperty("--page-background", `var(--page-background-color) ${cssImage} center / cover no-repeat fixed`)
    root.dataset.pageBackgroundImage = "true"
    return
  }

  root.style.setProperty("--page-background", "var(--page-background-color)")
  delete root.dataset.pageBackgroundImage
}
