import { Fragment, useEffect, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import BlogPublicationDate from "../BlogPublicationDate"
import sportImage from "../../../assets/sport1.jpeg"
import nutritionImage from "../../../assets/food2.webp"
import mealImage from "../../../assets/avocado-toast.webp"
import smoothieImage from "../../../assets/Smoothie glow mangue passion.png"
import routineImage from "../../../assets/Routine.webp"
import workoutImage from "../../../assets/Backday.webp"
import habitsImage from "../../../assets/Habits.webp"
import flexibleEatingMarkdown from "./alimentation-flexible.md?raw"
import creatineMarkdown from "./creatine.md?raw"
import sportDisciplineMarkdown from "./discipline-sportive.md?raw"
import "../../SelfLove/SelfLoveHome.css"
import "./BlogMentalArticlePage.css"

type ArticleIllustration = { image: string; alt: string }

const flexibleEatingIllustrations: Record<string, ArticleIllustration> = {
  "2. Arrêter de classer les aliments en « bons » et « mauvais »": {
    image: nutritionImage,
    alt: "Alimentation variée associant équilibre nutritionnel et plaisir",
  },
  "17. Construis tes repas autour d’une base simple": {
    image: mealImage,
    alt: "Repas simple et équilibré composé d’aliments variés",
  },
  "36. Un exercice de 7 jours pour rendre ton alimentation plus flexible": {
    image: smoothieImage,
    alt: "Habitudes alimentaires souples intégrées progressivement au quotidien",
  },
}

const creatineIllustrations: Record<string, ArticleIllustration> = {
  "2. Pourquoi quelques répétitions supplémentaires peuvent faire une différence": {
    image: workoutImage,
    alt: "Entraînement de musculation soutenu par une progression régulière",
  },
  "8. Quelle créatine choisir ?": {
    image: smoothieImage,
    alt: "Complément intégré simplement à une routine sportive quotidienne",
  },
  "35. Une routine de créatine extrêmement simple": {
    image: routineImage,
    alt: "Routine quotidienne simple pour prendre régulièrement de la créatine",
  },
}

const sportDisciplineIllustrations: Record<string, ArticleIllustration> = {
  "2. Commence avec une fréquence réaliste": {
    image: workoutImage,
    alt: "Séance de sport intégrée à une fréquence réaliste et durable",
  },
  "18. Construire une habitude prend du temps": {
    image: habitsImage,
    alt: "Habitudes sportives construites progressivement avec régularité",
  },
  "36. Une semaine sportive réaliste pour débuter": {
    image: routineImage,
    alt: "Organisation simple d’une semaine sportive adaptée au quotidien",
  },
}

const suggestedArticles = [
  {
    title: "Alimentation flexible : manger sainement sans culpabiliser les aliments plaisir",
    description: "Construire une alimentation équilibrée et réaliste, tout en conservant une place pour le plaisir.",
    image: nutritionImage,
    href: "/blog/sport-nutrition/alimentation-flexible",
  },
  {
    title: "Créatine : à quoi elle sert, comment la prendre et ce que dit vraiment la recherche",
    description: "Comprendre ses effets, son dosage et son utilisation à partir des données disponibles.",
    image: sportImage,
    href: "/blog/sport-nutrition/article-2",
  },
  {
    title: "Discipline sportive : construire une routine durable sans tomber dans le tout ou rien",
    description: "Construire une routine sportive réaliste, régulière et suffisamment souple pour durer.",
    image: workoutImage,
    href: "/blog/sport-nutrition/article-3",
  },
  {
    title: "Retrouver de l’énergie au quotidien",
    description: "Des habitudes accessibles pour prendre soin de son corps et soutenir son énergie.",
    image: smoothieImage,
    href: "/blog/sport-nutrition/article-4",
  },
]

const renderInline = (text: string, keyPrefix: string): ReactNode[] =>
  text.split(/(\*\*.*?\*\*)/g).filter(Boolean).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={`${keyPrefix}-${index}`}>{part}</Fragment>
    ),
  )

const isBlockStart = (line: string) => /^(#{1,3})\s/.test(line) || line === "---" || line.startsWith("* ")

const renderMarkdown = (markdown: string, illustrations: Record<string, ArticleIllustration>) => {
  const lines = markdown.replace(/\r/g, "").split("\n")
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()

    if (!line) {
      index += 1
      continue
    }

    if (line === "---") {
      blocks.push(<hr key={`separator-${index}`} />)
      index += 1
      continue
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const heading = headingMatch[2]
      if (headingMatch[1].length === 3) {
        blocks.push(<h3 key={`heading-${index}`}>{renderInline(heading, `heading-${index}`)}</h3>)
      } else {
        blocks.push(<h2 key={`heading-${index}`}>{renderInline(heading, `heading-${index}`)}</h2>)
      }
      const illustration = illustrations[heading]
      if (illustration) {
        blocks.push(
          <figure className="mental-article__illustration" key={`illustration-${index}`}>
            <img src={illustration.image} alt={illustration.alt} loading="lazy" decoding="async" />
          </figure>,
        )
      }
      index += 1
      continue
    }

    if (line.startsWith("* ")) {
      const items: string[] = []
      while (index < lines.length && lines[index].trim().startsWith("* ")) {
        items.push(lines[index].trim().slice(2))
        index += 1
      }
      blocks.push(
        <ul key={`list-${index}`}>
          {items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `list-${index}-${itemIndex}`)}</li>)}
        </ul>,
      )
      continue
    }

    const paragraphLines = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }
    const paragraph = paragraphLines.join(" ")
    blocks.push(<p key={`paragraph-${index}`}>{renderInline(paragraph, `paragraph-${index}`)}</p>)
  }

  return blocks
}

const sportNutritionArticles: Record<string, {
  markdown: string
  eyebrow: string
  readingTime: string
  image: string
  imageAlt: string
  illustrations: Record<string, ArticleIllustration>
  recommendationsDescription: string
}> = {
  "alimentation-flexible": {
    markdown: flexibleEatingMarkdown,
    eyebrow: "Sport & Nutrition · Alimentation",
    readingTime: "28 min de lecture",
    image: nutritionImage,
    imageAlt: "Alimentation variée et équilibrée laissant une place aux aliments plaisir",
    illustrations: flexibleEatingIllustrations,
    recommendationsDescription: "Continue ta lecture autour de l’alimentation, du mouvement et d’un équilibre durable.",
  },
  "article-2": {
    markdown: creatineMarkdown,
    eyebrow: "Sport & Nutrition · Compléments",
    readingTime: "27 min de lecture",
    image: sportImage,
    imageAlt: "Entraînement sportif associé à une supplémentation en créatine",
    illustrations: creatineIllustrations,
    recommendationsDescription: "Continue ta lecture autour de la performance, de la nutrition et d’une pratique sportive équilibrée.",
  },
  "article-3": {
    markdown: sportDisciplineMarkdown,
    eyebrow: "Sport & Nutrition · Discipline",
    readingTime: "28 min de lecture",
    image: workoutImage,
    imageAlt: "Routine sportive régulière construite avec souplesse et discipline",
    illustrations: sportDisciplineIllustrations,
    recommendationsDescription: "Continue ta lecture autour de la régularité, du mouvement et d’une pratique sportive durable.",
  },
}

const BlogSportNutritionArticlePage = () => {
  const { articleSlug } = useParams()
  const article = articleSlug ? sportNutritionArticles[articleSlug] : undefined

  useEffect(() => {
    document.body.classList.add("mental-article-page--tone")
    return () => document.body.classList.remove("mental-article-page--tone")
  }, [])

  if (!article) {
    return (
      <div className="mental-article-page">
        <section className="mental-article-placeholder">
          <span>Sport &amp; Nutrition</span>
          <h1>Article à venir</h1>
          <p>Ce nouvel article est en cours de préparation.</p>
          <Link to="/blog/sport-nutrition">Retour aux articles Sport &amp; Nutrition</Link>
        </section>
      </div>
    )
  }

  const normalizedMarkdown = article.markdown.replace(/\r/g, "")
  const markdownLines = normalizedMarkdown.split("\n")
  const titleIndex = markdownLines.findIndex((line) => line.startsWith("# "))
  const articleTitle = titleIndex >= 0 ? markdownLines[titleIndex].slice(2) : "Article Sport & Nutrition"
  const articleBody = markdownLines.slice(titleIndex + 1).join("\n")
  const recommendations = suggestedArticles
    .filter((suggestion) => suggestion.href !== `/blog/sport-nutrition/${articleSlug}`)
    .slice(0, 3)

  return (
    <div className="mental-article-page">
      <Link className="mental-article-page__back" to="/blog/sport-nutrition">← Retour aux articles Sport &amp; Nutrition</Link>

      <article className="mental-article">
        <header className="mental-article__header">
          <div className="mental-article__headline">
            <span>{article.eyebrow}</span>
            <h1>{articleTitle}</h1>
            <p>{article.readingTime}</p>
          </div>
          <div className="mental-article__media">
            <img src={article.image} alt={article.imageAlt} />
          </div>
        </header>

        <div className="mental-article__content">{renderMarkdown(articleBody, article.illustrations)}</div>
        <BlogPublicationDate className="mental-article__published-date" href={`/blog/sport-nutrition/${articleSlug}`} />
      </article>

      <section className="self-love-rituals mental-article-recommendations" aria-labelledby="sport-nutrition-recommendations-title">
        <header className="self-love-rituals__header">
          <div>
            <h2 id="sport-nutrition-recommendations-title">Autres articles</h2>
            <p>{article.recommendationsDescription}</p>
          </div>
        </header>
        <div className="self-love-rituals__grid">
          {recommendations.map((recommendation) => (
            <Link className="self-love-ritual-card mental-article-recommendation" to={recommendation.href} key={recommendation.href}>
              <div className="self-love-ritual-card__media">
                <img src={recommendation.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="self-love-ritual-card__content">
                <h3>{recommendation.title}</h3>
                <p>{recommendation.description}</p>
                <span className="self-love-ritual-card__action">Lire l’article</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default BlogSportNutritionArticlePage
