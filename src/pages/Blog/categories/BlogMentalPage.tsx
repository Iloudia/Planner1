import healthImage from "../../../assets/sante.jpeg"
import selfConfidenceImage from "../../../assets/selfconfidence.jpeg"
import boundariesImage from "../../../assets/selflove.webp"
import thoughtsImage from "../../../assets/Journaling.webp"
import solitudeImage from "../../../assets/Plante-verte.webp"
import habitsImage from "../../../assets/Routine.webp"
import procrastinationImage from "../../../assets/Projets.jpeg"
import resilienceImage from "../../../assets/Perseverance.webp"
import comparisonImage from "../../../assets/MoodBoard.webp"
import BlogCategoryTemplate from "./BlogCategoryTemplate"

const BlogMentalPage = () => (
  <BlogCategoryTemplate
    category="Mental"
    slug="mental"
    headerImage={healthImage}
    headerImageAlt="Moment calme consacré au bien-être mental"
    headlineEyebrow="Prendre soin de son esprit"
    introEyebrow="Équilibre intérieur"
    introTitle="Cultiver un mental plus serein"
    introParagraphs={[
      "Découvre des réflexions et des outils pour mieux comprendre tes émotions, apaiser ton esprit et prendre du recul.",
      "Un espace pour avancer avec plus de douceur, renforcer ta confiance et préserver ton équilibre intérieur.",
    ]}
    sectionDescription="Des pistes concrètes pour prendre soin de ton équilibre émotionnel et avancer avec plus de sérénité."
    articleDescription="Un article de test consacré au bien-être mental, aux émotions et à la confiance en soi."
    articleCount={9}
    articleBasePath="/blog/mental"
    firstArticle={{
      slug: "confiance-en-soi",
      title: "Confiance en soi : comment la développer, arrêter de se comparer et oser prendre sa place",
      description: "Des repères concrets pour agir malgré le doute, sortir de la comparaison et construire une confiance plus solide.",
      readingTime: "18 min de lecture",
      image: selfConfidenceImage,
    }}
    secondArticle={{
      slug: "article-2",
      title: "Gestion des émotions : mieux gérer la colère, la frustration, la tristesse et la jalousie",
      description: "Des repères concrets pour comprendre ses émotions, éviter les réactions impulsives et répondre avec davantage de recul.",
      readingTime: "22 min de lecture",
      image: healthImage,
    }}
    thirdArticle={{
      slug: "article-3",
      title: "J’ai arrêté de me justifier en permanence",
      description: "Apprendre à poser ses limites, dire non avec respect et assumer ses choix sans rechercher constamment l’approbation.",
      readingTime: "20 min de lecture",
      image: boundariesImage,
    }}
    fourthArticle={{
      slug: "article-4",
      title: "Pensées négatives : arrêter de trop penser, sortir de la rumination et prendre du recul sur ses pensées",
      description: "Des outils concrets pour reconnaître les boucles mentales, distinguer les faits des interprétations et retrouver du recul.",
      readingTime: "24 min de lecture",
      image: thoughtsImage,
    }}
    fifthArticle={{
      slug: "article-5",
      title: "Solitude : apprendre à être bien seul, sans s’isoler",
      description: "Comprendre les différentes formes de solitude, apprécier sa propre compagnie et préserver des liens essentiels.",
      readingTime: "23 min de lecture",
      image: solitudeImage,
    }}
    sixthArticle={{
      slug: "article-6",
      title: "Habitudes mentales : 6 pratiques pour prendre soin de son esprit au quotidien",
      description: "Six pratiques accessibles pour développer davantage de recul, de clarté et d’intention au quotidien.",
      readingTime: "25 min de lecture",
      image: habitsImage,
    }}
    seventhArticle={{
      slug: "article-7",
      title: "Procrastination : pourquoi on repousse et comment enfin commencer",
      description: "Comprendre ce qui nous pousse à reporter et utiliser des méthodes concrètes pour commencer plus facilement.",
      readingTime: "28 min de lecture",
      image: procrastinationImage,
    }}
    eighthArticle={{
      slug: "article-8",
      title: "Échec : apprendre à rebondir, gérer la honte et recommencer",
      description: "Des repères pour traverser l’échec, distinguer les faits de son identité et construire une reprise plus solide.",
      readingTime: "25 min de lecture",
      image: resilienceImage,
    }}
    ninthArticle={{
      slug: "article-9",
      title: "Comparaison sociale : arrêter de se comparer et rester concentré sur son propre chemin",
      description: "Comprendre la comparaison sociale, mieux utiliser les réseaux et recentrer son attention sur sa propre progression.",
      readingTime: "27 min de lecture",
      image: comparisonImage,
    }}
  />
)

export default BlogMentalPage
