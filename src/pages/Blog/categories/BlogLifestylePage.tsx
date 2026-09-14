import lifestyleImage from "../../../assets/l-b-dupe.webp"
import cosyImage from "../../../assets/Photo bienvenue.jpeg"
import BlogCategoryTemplate from "./BlogCategoryTemplate"

const BlogLifestylePage = () => (
  <BlogCategoryTemplate
    category="Lifestyle"
    slug="lifestyle"
    headerImage={lifestyleImage}
    headerImageAlt="Inspiration pour un art de vivre doux et équilibré"
    headlineEyebrow="L’art du quotidien"
    introEyebrow="Vivre avec intention"
    introTitle="Créer un quotidien qui te ressemble"
    introParagraphs={[
      "Découvre des inspirations pour organiser ton quotidien, nourrir ta créativité et accorder plus de place à ce qui compte.",
      "Un regard doux sur l’art de vivre, les habitudes et les petits rituels qui rendent chaque journée plus personnelle.",
    ]}
    sectionDescription="Des inspirations pour organiser, embellir et apprécier pleinement les différentes facettes du quotidien."
    articleDescription="Un article de test consacré au lifestyle, aux habitudes et aux inspirations du quotidien."
    articleCount={2}
    articleBasePath="/blog/lifestyle"
    firstArticle={{
      slug: "solo-dates",
      title: "Solo dates : apprendre à sortir seul et apprécier sa propre compagnie",
      description: "Des idées et des repères concrets pour apprendre à sortir seul, découvrir ses goûts et apprécier sa propre compagnie.",
      readingTime: "26 min de lecture",
      image: lifestyleImage,
    }}
    secondArticle={{
      slug: "article-2",
      title: "20 activités cosy à faire quand il pleut",
      description: "Vingt idées simples pour créer, ralentir, prendre soin de soi et profiter pleinement d’une journée pluvieuse.",
      readingTime: "18 min de lecture",
      image: cosyImage,
    }}
  />
)

export default BlogLifestylePage
