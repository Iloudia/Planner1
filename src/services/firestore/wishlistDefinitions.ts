export const WISHLIST_DEFINITION_VERSION = 9

export const baseWishlistCategoryDefinitions = [
  { id: "hair", title: "Cheveux", accent: "#f497c0", blurb: "Brushes, soins et accessoires pour les cheveux." },
  { id: "outfits", title: "V\u00eatements", accent: "#fcd67d", blurb: "Looks, tenues et pieces preferees." },
  { id: "makeup", title: "Makeup", accent: "#fbcada", blurb: "Maquillage, palettes et envies beaute." },
  { id: "skincare", title: "Skincare", accent: "#c1e7db", blurb: "Soins, masques et essentials glow." },
  { id: "books", title: "Livres", accent: "#b4cfff", blurb: "Lectures inspirantes et romans a garder." },
] as const

export const baseWishlistCategoryIds = new Set<string>(baseWishlistCategoryDefinitions.map((item) => item.id))
