import { useLayoutEffect, type ImgHTMLAttributes } from "react"

import backday from "../assets/Backday.webp"
import backdayMobile from "../assets/Backday-mobile.webp"
import flowers from "../assets/Fleurs-blanches.webp"
import flowersMobile from "../assets/Fleurs-blanches-mobile.webp"
import habits from "../assets/Habits.webp"
import habitsMobile from "../assets/Habits-mobile.webp"
import journaling from "../assets/Journaling.webp"
import journalingMobile from "../assets/Journaling-mobile.webp"
import mode from "../assets/Mode.webp"
import modeMobile from "../assets/Mode-mobile.webp"
import moodboard from "../assets/MoodBoard.webp"
import moodboardMobile from "../assets/MoodBoard-mobile.webp"
import perseverance from "../assets/Perseverance.webp"
import perseveranceMobile from "../assets/Perseverance-mobile.webp"
import welcome from "../assets/Photo bienvenue.webp"
import welcomeMobile from "../assets/Photo bienvenue-mobile.webp"
import greenPlant from "../assets/Plante-verte.webp"
import greenPlantMobile from "../assets/Plante-verte-mobile.webp"
import projects from "../assets/Projets.webp"
import projectsMobile from "../assets/Projets-mobile.webp"
import routine from "../assets/Routine.webp"
import routineMobile from "../assets/Routine-mobile.webp"
import confidenceTwo from "../assets/Selfconfidence2.webp"
import confidenceTwoMobile from "../assets/Selfconfidence2-mobile.webp"
import smoothie from "../assets/Smoothie glow mangue passion.webp"
import smoothieMobile from "../assets/Smoothie glow mangue passion-mobile.webp"
import avocadoToast from "../assets/avocado-toast.webp"
import avocadoToastMobile from "../assets/avocado-toast-mobile.webp"
import beauty from "../assets/beauty.webp"
import beautyMobile from "../assets/beauty-mobile.webp"
import glowUpCover from "../assets/couverture glow-up.webp"
import glowUpCoverMobile from "../assets/couverture glow-up-mobile.webp"
import food from "../assets/food2.webp"
import foodMobile from "../assets/food2-mobile.webp"
import wardrobe from "../assets/l-b-dupe.webp"
import wardrobeMobile from "../assets/l-b-dupe-mobile.webp"
import makeup from "../assets/makeup.webp"
import makeupMobile from "../assets/makeup-mobile.webp"
import bow from "../assets/noeud-papillon.webp"
import bowMobile from "../assets/noeud-papillon-mobile.webp"
import pinkAccessories from "../assets/ruby--dupe.webp"
import pinkAccessoriesMobile from "../assets/ruby--dupe-mobile.webp"
import health from "../assets/sante.webp"
import healthMobile from "../assets/sante-mobile.webp"
import confidence from "../assets/selfconfidence.webp"
import confidenceMobile from "../assets/selfconfidence-mobile.webp"
import innerDialogue from "../assets/selfconfidence3.webp"
import innerDialogueMobile from "../assets/selfconfidence3-mobile.webp"
import selfLove from "../assets/selflove.webp"
import selfLoveMobile from "../assets/selflove-mobile.webp"
import selfLoveFive from "../assets/selflove5.webp"
import selfLoveFiveMobile from "../assets/selflove5-mobile.webp"
import sport from "../assets/sport1.webp"
import sportMobile from "../assets/sport1-mobile.webp"
import materials from "../assets/tuany-kohler-dupe.webp"
import materialsMobile from "../assets/tuany-kohler-dupe-mobile.webp"
import travel from "../assets/voyage.webp"
import travelMobile from "../assets/voyage-mobile.webp"
import boutiquePlant from "../assets/plante.webp"
import boutiquePlantMobile from "../assets/plante-mobile.webp"
import levelUpCover from "../assets/Couvertur levelup.webp"
import levelUpCoverMobile from "../assets/Couvertur levelup-mobile.webp"
import coupleJournal from "../assets/Journal de couple.webp"
import coupleJournalMobile from "../assets/Journal de couple-mobile.webp"

const mobileSources = new Map<string, string>([
  [backday, backdayMobile],
  [flowers, flowersMobile],
  [habits, habitsMobile],
  [journaling, journalingMobile],
  [mode, modeMobile],
  [moodboard, moodboardMobile],
  [perseverance, perseveranceMobile],
  [welcome, welcomeMobile],
  [greenPlant, greenPlantMobile],
  [projects, projectsMobile],
  [routine, routineMobile],
  [confidenceTwo, confidenceTwoMobile],
  [smoothie, smoothieMobile],
  [avocadoToast, avocadoToastMobile],
  [beauty, beautyMobile],
  [glowUpCover, glowUpCoverMobile],
  [food, foodMobile],
  [wardrobe, wardrobeMobile],
  [makeup, makeupMobile],
  [bow, bowMobile],
  [pinkAccessories, pinkAccessoriesMobile],
  [health, healthMobile],
  [confidence, confidenceMobile],
  [innerDialogue, innerDialogueMobile],
  [selfLove, selfLoveMobile],
  [selfLoveFive, selfLoveFiveMobile],
  [sport, sportMobile],
  [materials, materialsMobile],
  [travel, travelMobile],
  [boutiquePlant, boutiquePlantMobile],
  [levelUpCover, levelUpCoverMobile],
  [coupleJournal, coupleJournalMobile],
])

const sourceDimensions = new Map<string, readonly [number, number]>([
  [backday, [1760, 2200]],
  [flowers, [1650, 2200]],
  [habits, [1650, 2200]],
  [journaling, [1650, 2200]],
  [mode, [1467, 2200]],
  [moodboard, [2200, 1408]],
  [perseverance, [1650, 2200]],
  [welcome, [564, 752]],
  [greenPlant, [1650, 2200]],
  [projects, [1650, 2200]],
  [routine, [1571, 2200]],
  [confidenceTwo, [1650, 2200]],
  [smoothie, [1024, 1536]],
  [avocadoToast, [1467, 2200]],
  [beauty, [1080, 1920]],
  [glowUpCover, [1800, 1800]],
  [food, [1206, 1932]],
  [wardrobe, [1440, 1800]],
  [makeup, [1080, 1920]],
  [bow, [1536, 1024]],
  [pinkAccessories, [1238, 2200]],
  [health, [1650, 2200]],
  [confidence, [1179, 2075]],
  [innerDialogue, [1751, 2200]],
  [selfLove, [1467, 2200]],
  [selfLoveFive, [1650, 2200]],
  [sport, [1650, 2200]],
  [materials, [1238, 2200]],
  [travel, [1650, 2200]],
  [boutiquePlant, [1350, 1800]],
  [levelUpCover, [1800, 1800]],
  [coupleJournal, [1080, 1080]],
])

type ResponsiveSiteImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  preload?: boolean
}

const defaultSizes = "(max-width: 767px) calc(100vw - 2rem), (max-width: 1199px) 50vw, 600px"

const ResponsiveSiteImage = ({ src, preload = false, fetchPriority, loading, sizes, srcSet, ...props }: ResponsiveSiteImageProps) => {
  const mobileSrc = mobileSources.get(src)
  const dimensions = sourceDimensions.get(src)
  const mobileWidth = dimensions ? Math.min(800, dimensions[0]) : undefined
  const responsiveSrcSet =
    srcSet ?? (mobileSrc && dimensions && mobileWidth && mobileWidth < dimensions[0]
      ? `${mobileSrc} ${mobileWidth}w, ${src} ${dimensions[0]}w`
      : undefined)
  const responsiveSizes = responsiveSrcSet ? sizes ?? defaultSizes : sizes

  useLayoutEffect(() => {
    if (!preload) {
      return
    }

    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = mobileSrc ?? src
    link.setAttribute("fetchpriority", "high")
    if (responsiveSrcSet) {
      link.imageSrcset = responsiveSrcSet
      link.imageSizes = responsiveSizes ?? defaultSizes
    }
    document.head.appendChild(link)

    return () => {
      link.remove()
    }
  }, [mobileSrc, preload, responsiveSizes, responsiveSrcSet, src])

  return (
    <img
      src={src}
      srcSet={responsiveSrcSet}
      sizes={responsiveSizes}
      width={dimensions?.[0]}
      height={dimensions?.[1]}
      fetchPriority={preload ? "high" : fetchPriority}
      loading={preload ? "eager" : loading}
      {...props}
    />
  )
}

export default ResponsiveSiteImage
