export const WISHLIST_DEFINITION_VERSION = 8

export const baseWishlistCategoryDefinitions = [
  { id: "hair", title: "Cheveux", accent: "#f497c0", blurb: "Brushes, soins et accessoires pour les cheveux." },
  { id: "outfits", title: "V\u00eatements", accent: "#fcd67d", blurb: "Looks, tenues et pieces preferees." },
  { id: "makeup", title: "Makeup", accent: "#fbcada", blurb: "Maquillage, palettes et envies beaute." },
  { id: "electronics", title: "\u00c9lectronique", accent: "#c9d9ff", blurb: "Gadgets tech et accessoires utiles." },
  { id: "skincare", title: "Skincare", accent: "#c1e7db", blurb: "Soins, masques et essentials glow." },
  { id: "books", title: "Livres", accent: "#b4cfff", blurb: "Lectures inspirantes et romans a garder." },
  { id: "room", title: "Chambre", accent: "#d9c5ff", blurb: "Deco, ambiance et objets cozy." },
  { id: "travel", title: "Voyages", accent: "#f6b094", blurb: "Destinations et experiences a vivre." },
  { id: "jewelry", title: "Bijoux", accent: "#ffd4a8", blurb: "Bagues, colliers et pieces brillantes." },
  { id: "bag", title: "Sac", accent: "#f3b4c5", blurb: "Sacs tendance et intemporels." },
] as const

export const baseWishlistCategoryIds = new Set<string>(baseWishlistCategoryDefinitions.map((item) => item.id))
