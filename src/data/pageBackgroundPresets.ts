import blackLace from "../assets/Personnalisation/Bordure de dentelle noire sur ivoire.png"
import floralFrame from "../assets/Personnalisation/Cadre floral ornemental monochrome.png"
import sageLace from "../assets/Personnalisation/Dentelle précieuse aux cristaux vert sauge.png"
import silverFlorals from "../assets/Personnalisation/Élégantes volutes florales argentées.png"
import iridescentMosaic from "../assets/Personnalisation/Mosaïque nacrée aux reflets irisés.png"
import pearlMosaic from "../assets/Personnalisation/Mosaïque nacrée de coquillages et perles.png"
import pinkLips from "../assets/Personnalisation/Motif romantique de lèvres roses.png"
import pinkTartan from "../assets/Personnalisation/Motif tartan rose pastel en tissu.png"
import liquidSilver from "../assets/Personnalisation/Réseau de verre liquide argenté.png"
import whiteFeathers from "../assets/Personnalisation/Tapis de plumes blanches superposées.png"
import pastelPeonies from "../assets/Personnalisation/Tapis luxuriant de pivoines pastel.png"
import leopardFur from "../assets/Personnalisation/Texture de fourrure léopard hyperréaliste.png"
import fourLeafClover from "../assets/Personnalisation/Trèfle à quatre feuilles aquarellé.png"
import ivorySatin from "../assets/Personnalisation/Vagues de satin ivoire en lumière douce.png"

export type PageBackgroundPreset = {
  id: string
  name: string
  src: string
}

export const pageBackgroundPresets: PageBackgroundPreset[] = [
  { id: "black-lace", name: "Dentelle noire", src: blackLace },
  { id: "floral-frame", name: "Cadre floral", src: floralFrame },
  { id: "sage-lace", name: "Dentelle sauge", src: sageLace },
  { id: "silver-florals", name: "Volutes argentées", src: silverFlorals },
  { id: "iridescent-mosaic", name: "Nacre irisée", src: iridescentMosaic },
  { id: "pearl-mosaic", name: "Coquillages nacrés", src: pearlMosaic },
  { id: "pink-lips", name: "Lèvres roses", src: pinkLips },
  { id: "pink-tartan", name: "Tartan rose", src: pinkTartan },
  { id: "liquid-silver", name: "Verre argenté", src: liquidSilver },
  { id: "white-feathers", name: "Plumes blanches", src: whiteFeathers },
  { id: "pastel-peonies", name: "Pivoines pastel", src: pastelPeonies },
  { id: "leopard-fur", name: "Léopard", src: leopardFur },
  { id: "four-leaf-clover", name: "Trèfle aquarellé", src: fourLeafClover },
  { id: "ivory-satin", name: "Satin ivoire", src: ivorySatin },
]

const legacyPresetIds: Record<string, string> = {
  peacock: "black-lace",
  peony: "floral-frame",
  sunset: "sage-lace",
  agate: "silver-florals",
  kingfisher: "iridescent-mosaic",
  "pink-lilies": "pearl-mosaic",
  ambition: "pink-lips",
  balance: "pink-tartan",
  "white-flowers": "liquid-silver",
  "green-plant": "white-feathers",
}

export const getPageBackgroundPreset = (id?: string | null) => {
  const normalizedId = id ? legacyPresetIds[id] ?? id : ""
  return pageBackgroundPresets.find((preset) => preset.id === normalizedId)
}
