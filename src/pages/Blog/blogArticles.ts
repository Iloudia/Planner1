import makeupImage from "../../assets/makeup.webp"
import vitaminCImage from "../../assets/Fleurs-blanches.webp"
import selfCareImage from "../../assets/selflove.webp"
import styleImage from "../../assets/noeud-papillon.webp"
import wardrobeImage from "../../assets/l-b-dupe.webp"
import materialImage from "../../assets/tuany-kohler-dupe.webp"
import qualityImage from "../../assets/ruby--dupe.webp"
import confidenceImage from "../../assets/selfconfidence.webp"
import mentalImage from "../../assets/sante.webp"
import thoughtsImage from "../../assets/Journaling.webp"
import solitudeImage from "../../assets/Plante-verte.webp"
import habitsImage from "../../assets/Routine.webp"
import procrastinationImage from "../../assets/Projets.webp"
import resilienceImage from "../../assets/Perseverance.webp"
import comparisonImage from "../../assets/MoodBoard.webp"
import nutritionImage from "../../assets/food2.webp"
import sportImage from "../../assets/sport1.webp"
import workoutImage from "../../assets/Backday.webp"
import cosyImage from "../../assets/Photo bienvenue.webp"

export type BlogCategory = "Santé & Beauté" | "Mode" | "Mental" | "Sport & Nutrition" | "Lifestyle"

export type BlogArticleMetadata = {
  category: BlogCategory
  title: string
  description: string
  image: string
  imageAlt: string
  readingTime: string
  href: string
  publicationDate: string
}

export const blogArticles: BlogArticleMetadata[] = [
  {
    category: "Lifestyle",
    title: "20 activités cosy à faire quand il pleut",
    description: "Vingt idées simples pour créer, ralentir, prendre soin de soi et profiter pleinement d’une journée pluvieuse.",
    image: cosyImage,
    imageAlt: "Fleur rose posée sur les pages ouvertes d’un livre",
    readingTime: "18 min de lecture",
    href: "/blog/lifestyle/article-2",
    publicationDate: "2026-09-14",
  },
  {
    category: "Santé & Beauté",
    title: "Ongles : comment les rendre plus forts, éviter les cassures et protéger ses cuticules",
    description: "Comprendre ce qui fragilise les ongles et adopter des gestes simples pour limiter les cassures et protéger les cuticules.",
    image: makeupImage,
    imageAlt: "Palette de fards, rouge à lèvres et produits de maquillage",
    readingTime: "25 min de lecture",
    href: "/blog/sante-beaute/article-4",
    publicationDate: "2026-09-13",
  },
  {
    category: "Mental",
    title: "Comparaison sociale : arrêter de se comparer et rester concentré sur son propre chemin",
    description: "Comprendre la comparaison sociale, mieux utiliser les réseaux et recentrer son attention sur sa propre progression.",
    image: comparisonImage,
    imageAlt: "Tableau de visualisation consacré à l’indépendance financière et à la création de contenu",
    readingTime: "27 min de lecture",
    href: "/blog/mental/article-9",
    publicationDate: "2026-09-12",
  },
  {
    category: "Sport & Nutrition",
    title: "Discipline sportive : construire une routine durable sans tomber dans le tout ou rien",
    description: "Construire une routine sportive réaliste, régulière et suffisamment souple pour durer dans une vraie vie.",
    image: workoutImage,
    imageAlt: "Femme effectuant un tirage vertical à la salle de sport",
    readingTime: "28 min de lecture",
    href: "/blog/sport-nutrition/article-3",
    publicationDate: "2026-09-11",
  },
  {
    category: "Mode",
    title: "Qualité : comment reconnaître un vêtement bien construit sans se fier uniquement au prix",
    description: "Apprendre à inspecter les coutures, les finitions, la matière et la coupe pour mieux évaluer un vêtement.",
    image: qualityImage,
    imageAlt: "Miroir à main, brosse à cheveux et accessoires roses",
    readingTime: "31 min de lecture",
    href: "/blog/mode/article-4",
    publicationDate: "2026-09-10",
  },
  {
    category: "Mental",
    title: "Confiance en soi : comment la développer, arrêter de se comparer et oser prendre sa place",
    description: "Des repères concrets pour agir malgré le doute, sortir de la comparaison et construire une confiance plus solide.",
    image: confidenceImage,
    imageAlt: "Femme debout sur un rocher face à l’océan",
    readingTime: "18 min de lecture",
    href: "/blog/mental/confiance-en-soi",
    publicationDate: "2026-09-09",
  },
  {
    category: "Santé & Beauté",
    title: "Pousse des cheveux : ce qui influence vraiment la croissance et comment éviter la casse",
    description: "Comprendre la croissance des cheveux, distinguer la pousse de la casse et adopter une routine plus adaptée.",
    image: selfCareImage,
    imageAlt: "Bouquet de ballons roses en forme de cœur",
    readingTime: "26 min de lecture",
    href: "/blog/sante-beaute/article-3",
    publicationDate: "2026-09-08",
  },
  {
    category: "Mode",
    title: "Matières : comprendre coton, lin, laine, cachemire, polyester, viscose et soie",
    description: "Comprendre les principales matières textiles pour choisir des vêtements adaptés à leur usage et mieux les entretenir.",
    image: materialImage,
    imageAlt: "Chaussures de sport et sac rouge posés sur le sol d’une salle",
    readingTime: "29 min de lecture",
    href: "/blog/mode/article-3",
    publicationDate: "2026-09-07",
  },
  {
    category: "Mental",
    title: "Échec : apprendre à rebondir, gérer la honte et recommencer",
    description: "Des repères pour traverser l’échec, distinguer les faits de son identité et construire une reprise plus solide.",
    image: resilienceImage,
    imageAlt: "Ordinateur portable, tasse et magazines sur une table sombre",
    readingTime: "25 min de lecture",
    href: "/blog/mental/article-8",
    publicationDate: "2026-09-05",
  },
  {
    category: "Lifestyle",
    title: "Solo dates : apprendre à sortir seul et apprécier sa propre compagnie",
    description: "Des idées et des repères concrets pour apprendre à sortir seul, découvrir ses goûts et apprécier sa propre compagnie.",
    image: wardrobeImage,
    imageAlt: "Livre ouvert et tasse de thé sur un lit",
    readingTime: "26 min de lecture",
    href: "/blog/lifestyle/solo-dates",
    publicationDate: "2026-09-03",
  },
  {
    category: "Sport & Nutrition",
    title: "Créatine : à quoi elle sert, comment la prendre et ce que dit vraiment la recherche",
    description: "Comprendre les effets de la créatine, son dosage, son utilisation et les réponses apportées par la recherche.",
    image: sportImage,
    imageAlt: "Joueuse tenant une raquette de padel sur un terrain bleu",
    readingTime: "27 min de lecture",
    href: "/blog/sport-nutrition/article-2",
    publicationDate: "2026-09-01",
  },
  {
    category: "Mental",
    title: "Procrastination : pourquoi on repousse et comment enfin commencer",
    description: "Comprendre ce qui nous pousse à reporter et utiliser des méthodes concrètes pour commencer plus facilement.",
    image: procrastinationImage,
    imageAlt: "Carnet d’objectifs, café glacé et lunettes sur une table en marbre",
    readingTime: "28 min de lecture",
    href: "/blog/mental/article-7",
    publicationDate: "2026-08-30",
  },
  {
    category: "Santé & Beauté",
    title: "Vitamine C : pourquoi elle est si populaire et comment bien l’utiliser",
    description: "Comprendre les bénéfices de la vitamine C, choisir une formule adaptée et l’intégrer correctement à sa routine.",
    image: vitaminCImage,
    imageAlt: "Bouquet de tulipes blanches dans un vase",
    readingTime: "24 min de lecture",
    href: "/blog/sante-beaute/article-2",
    publicationDate: "2026-08-28",
  },
  {
    category: "Mode",
    title: "Capsule wardrobe : créer une garde-robe simple, cohérente et facile à porter",
    description: "Mieux utiliser les vêtements que tu possèdes et construire une garde-robe cohérente avec ta vraie vie.",
    image: wardrobeImage,
    imageAlt: "Livre ouvert et tasse de thé sur un lit",
    readingTime: "27 min de lecture",
    href: "/blog/mode/article-2",
    publicationDate: "2026-08-25",
  },
  {
    category: "Mental",
    title: "Habitudes mentales : 6 pratiques pour prendre soin de son esprit au quotidien",
    description: "Six pratiques accessibles pour développer davantage de recul, de clarté et d’intention au quotidien.",
    image: habitsImage,
    imageAlt: "Tasse de matcha posée sur des draps blancs",
    readingTime: "25 min de lecture",
    href: "/blog/mental/article-6",
    publicationDate: "2026-08-22",
  },
  {
    category: "Sport & Nutrition",
    title: "Alimentation flexible : manger sainement sans culpabiliser les aliments plaisir",
    description: "Construire une alimentation équilibrée et réaliste, tout en conservant une place pour le plaisir sans culpabilité.",
    image: nutritionImage,
    imageAlt: "Deux cafés glacés vus de dessus",
    readingTime: "28 min de lecture",
    href: "/blog/sport-nutrition/alimentation-flexible",
    publicationDate: "2026-08-19",
  },
  {
    category: "Santé & Beauté",
    title: "Cernes : comprendre pourquoi tu en as et comment avoir l’air plus reposé",
    description: "Comprendre les différents types de cernes et adopter des gestes adaptés pour avoir le regard plus reposé.",
    image: makeupImage,
    imageAlt: "Palette de fards, rouge à lèvres et produits de maquillage",
    readingTime: "22 min de lecture",
    href: "/blog/sante-beaute/cernes",
    publicationDate: "2026-08-16",
  },
  {
    category: "Mental",
    title: "Solitude : apprendre à être bien seul, sans s’isoler",
    description: "Comprendre les différentes formes de solitude, apprécier sa propre compagnie et préserver des liens essentiels.",
    image: solitudeImage,
    imageAlt: "Grandes feuilles vertes devant un mur clair",
    readingTime: "23 min de lecture",
    href: "/blog/mental/article-5",
    publicationDate: "2026-08-13",
  },
  {
    category: "Mode",
    title: "Style personnel : comment trouver ton style sans copier toutes les tendances",
    description: "Observer ses habitudes, identifier ses silhouettes préférées et construire un style cohérent avec sa vraie vie.",
    image: styleImage,
    imageAlt: "Nœud en ruban rose pâle",
    readingTime: "29 min de lecture",
    href: "/blog/mode/style-personnel",
    publicationDate: "2026-08-10",
  },
  {
    category: "Mental",
    title: "Pensées négatives : arrêter de trop penser, sortir de la rumination et prendre du recul sur ses pensées",
    description: "Des outils concrets pour reconnaître les boucles mentales, distinguer les faits des interprétations et retrouver du recul.",
    image: thoughtsImage,
    imageAlt: "Carnet ligné ouvert avec un stylo sur une table en bois",
    readingTime: "24 min de lecture",
    href: "/blog/mental/article-4",
    publicationDate: "2026-08-07",
  },
  {
    category: "Mental",
    title: "J’ai arrêté de me justifier en permanence",
    description: "Apprendre à poser ses limites, dire non avec respect et assumer ses choix sans rechercher constamment l’approbation.",
    image: selfCareImage,
    imageAlt: "Bouquet de ballons roses en forme de cœur",
    readingTime: "20 min de lecture",
    href: "/blog/mental/article-3",
    publicationDate: "2026-08-04",
  },
  {
    category: "Mental",
    title: "Gestion des émotions : mieux gérer la colère, la frustration, la tristesse et la jalousie",
    description: "Des repères concrets pour comprendre ses émotions, éviter les réactions impulsives et répondre avec davantage de recul.",
    image: mentalImage,
    imageAlt: "Grandes feuilles vertes devant un mur clair",
    readingTime: "22 min de lecture",
    href: "/blog/mental/article-2",
    publicationDate: "2026-08-01",
  },
]

export const formatPublicationDate = (publicationDate: string) => {
  const [year, month, day] = publicationDate.split("-")
  return `${day}/${month}/${year}`
}

export const getBlogArticleByHref = (href: string) => blogArticles.find((article) => article.href === href)

export const getLatestBlogArticles = (limit = 6) =>
  [...blogArticles]
    .sort((first, second) => second.publicationDate.localeCompare(first.publicationDate))
    .slice(0, limit)

export const getLatestBlogArticlesByCategory = (category: BlogCategory, limit = 3) =>
  blogArticles
    .filter((article) => article.category === category)
    .sort((first, second) => second.publicationDate.localeCompare(first.publicationDate))
    .slice(0, limit)
