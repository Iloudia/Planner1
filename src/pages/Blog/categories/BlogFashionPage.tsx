import modeImage from "../../../assets/Mode.jpeg"
import styleImage from "../../../assets/noeud-papillon.webp"
import wardrobeImage from "../../../assets/l-b-dupe.webp"
import materialImage from "../../../assets/tuany-kohler-dupe.webp"
import qualityImage from "../../../assets/ruby--dupe.webp"
import BlogCategoryTemplate from "./BlogCategoryTemplate"

const BlogFashionPage = () => (
  <BlogCategoryTemplate
    category="Mode"
    slug="mode"
    articleBasePath="/blog/mode"
    headerImage={modeImage}
    headerImageAlt="Univers de la mode et du style"
    headlineEyebrow="Style et inspiration"
    introEyebrow="Exprimer son style"
    introTitle="Une mode qui te ressemble"
    introParagraphs={[
      "Découvre des inspirations et des conseils pour construire un style personnel, élégant et agréable à porter au quotidien.",
      "Une approche de la mode pensée pour choisir ses pièces avec intention et se sentir pleinement soi-même.",
    ]}
    sectionDescription="Des idées et des conseils pour affirmer ton style et composer une garde-robe qui te ressemble."
    articleDescription="Un article de test consacré à la mode, au style personnel et aux inspirations du quotidien."
    articleCount={4}
    firstArticle={{
      slug: "style-personnel",
      title: "Style personnel : comment trouver ton style sans copier toutes les tendances",
      description: "Observer ses habitudes, identifier ses silhouettes préférées et construire un style cohérent avec sa vraie vie.",
      readingTime: "29 min de lecture",
      image: styleImage,
    }}
    secondArticle={{
      slug: "article-2",
      title: "Capsule wardrobe : créer une garde-robe simple, cohérente et facile à porter",
      description: "Mieux utiliser les vêtements que tu possèdes et construire une garde-robe cohérente avec ta vraie vie.",
      readingTime: "27 min de lecture",
      image: wardrobeImage,
    }}
    thirdArticle={{
      slug: "article-3",
      title: "Matières : comprendre coton, lin, laine, cachemire, polyester, viscose et soie",
      description: "Comprendre les principales matières textiles pour choisir des vêtements adaptés à leur usage et mieux les entretenir.",
      readingTime: "29 min de lecture",
      image: materialImage,
    }}
    fourthArticle={{
      slug: "article-4",
      title: "Qualité : comment reconnaître un vêtement bien construit sans se fier uniquement au prix",
      description: "Apprendre à inspecter les coutures, les finitions, la matière et la coupe pour mieux évaluer un vêtement.",
      readingTime: "31 min de lecture",
      image: qualityImage,
    }}
  />
)

export default BlogFashionPage
