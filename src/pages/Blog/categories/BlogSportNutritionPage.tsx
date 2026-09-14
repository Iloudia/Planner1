import sportImage from "../../../assets/sport1.jpeg"
import foodImage from "../../../assets/food2.webp"
import workoutImage from "../../../assets/Backday.webp"
import BlogCategoryTemplate from "./BlogCategoryTemplate"

const BlogSportNutritionPage = () => (
  <BlogCategoryTemplate
    category="Sport & Nutrition"
    slug="sport-nutrition"
    articleBasePath="/blog/sport-nutrition"
    headerImage={sportImage}
    headerImageAlt="Univers consacré au sport et à la nutrition"
    headlineEyebrow="Bouger et se nourrir"
    introEyebrow="Énergie au quotidien"
    introTitle="Trouver son équilibre"
    introParagraphs={[
      "Découvre des conseils pour bouger régulièrement, progresser à ton rythme et construire une alimentation équilibrée.",
      "Une approche simple du sport et de la nutrition pour prendre soin de ton énergie sans rechercher la perfection.",
    ]}
    sectionDescription="Des conseils pour associer mouvement, alimentation et plaisir dans un quotidien équilibré."
    articleDescription="Un article de test consacré au sport, à la nutrition et à une énergie durable au quotidien."
    articleCount={3}
    firstArticle={{
      slug: "alimentation-flexible",
      title: "Alimentation flexible : manger sainement sans culpabiliser les aliments plaisir",
      description: "Construire une alimentation équilibrée et réaliste, tout en conservant une place pour le plaisir sans culpabilité.",
      readingTime: "28 min de lecture",
      image: foodImage,
    }}
    secondArticle={{
      slug: "article-2",
      title: "Créatine : à quoi elle sert, comment la prendre et ce que dit vraiment la recherche",
      description: "Comprendre les effets de la créatine, son dosage, son utilisation et les réponses apportées par la recherche.",
      readingTime: "27 min de lecture",
      image: sportImage,
    }}
    thirdArticle={{
      slug: "article-3",
      title: "Discipline sportive : construire une routine durable sans tomber dans le tout ou rien",
      description: "Construire une routine sportive réaliste, régulière et suffisamment souple pour durer dans une vraie vie.",
      readingTime: "28 min de lecture",
      image: workoutImage,
    }}
  />
)

export default BlogSportNutritionPage
