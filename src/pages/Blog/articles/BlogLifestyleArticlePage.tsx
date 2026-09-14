import { Fragment, useEffect, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import BlogPublicationDate from "../BlogPublicationDate"
import soloDateImage from "../../../assets/l-b-dupe.webp"
import cafeImage from "../../../assets/Photo bienvenue.jpeg"
import cityImage from "../../../assets/voyage.webp"
import reflectionImage from "../../../assets/selfconfidence3.jpeg"
import practiceImage from "../../../assets/selflove5.jpeg"
import articleMarkdown from "./solo-dates.md?raw"
import cosyActivitiesMarkdown from "./activites-cosy-pluie.md?raw"
import "../../SelfLove/SelfLoveHome.css"
import "./BlogMentalArticlePage.css"

type ArticleIllustration = { image: string; alt: string }

const soloDateIllustrations: Record<string, ArticleIllustration> = {
  "2. Le sentiment de choix change beaucoup de choses": {
    image: cafeImage,
    alt: "Moment choisi pour profiter calmement de sa propre compagnie",
  },
  "8. Restaurant seul : le niveau supérieur": {
    image: reflectionImage,
    alt: "Sortie en solo pour apprendre à apprécier sa propre compagnie",
  },
  "29. Un défi solo date sur 4 semaines": {
    image: practiceImage,
    alt: "Rendez-vous avec soi-même organisé comme un rituel personnel",
  },
}

const cosyActivitiesIllustrations: Record<string, ArticleIllustration> = {
  "2. Crée une nouvelle playlist": {
    image: cafeImage,
    alt: "Ambiance cosy accompagnée d’une playlist pour une journée pluvieuse",
  },
  "8. Organise une soirée jeux": {
    image: reflectionImage,
    alt: "Activité calme et chaleureuse à faire chez soi lorsqu’il pleut",
  },
  "20. Joue à un jeu vidéo": {
    image: practiceImage,
    alt: "Moment de détente confortable à la maison pendant une journée pluvieuse",
  },
}

const suggestedArticles = [
  {
    title: "Solo dates : apprendre à sortir seul et apprécier sa propre compagnie",
    description: "Apprendre à sortir seul, découvrir ses goûts et apprécier pleinement sa propre compagnie.",
    image: soloDateImage,
    href: "/blog/lifestyle/solo-dates",
  },
  {
    title: "20 activités cosy à faire quand il pleut",
    description: "Créer, ralentir et profiter pleinement d’une journée pluvieuse dans une ambiance chaleureuse.",
    image: cafeImage,
    href: "/blog/lifestyle/article-2",
  },
  {
    title: "Redécouvrir sa propre ville",
    description: "Changer de regard sur les lieux familiers et retrouver le plaisir de l’exploration.",
    image: cityImage,
    href: "/blog/lifestyle/article-3",
  },
  {
    title: "Faire de la place aux petits rituels",
    description: "Construire des moments simples qui rendent les journées plus personnelles et plus apaisantes.",
    image: practiceImage,
    href: "/blog/lifestyle/article-4",
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

const lifestyleArticles: Record<string, {
  markdown: string
  eyebrow: string
  readingTime: string
  image: string
  imageAlt: string
  illustrations: Record<string, ArticleIllustration>
  recommendationsDescription: string
}> = {
  "solo-dates": {
    markdown: articleMarkdown,
    eyebrow: "Lifestyle · Solo dates",
    readingTime: "26 min de lecture",
    image: soloDateImage,
    imageAlt: "Moment calme consacré à une sortie en solo",
    illustrations: soloDateIllustrations,
    recommendationsDescription: "Continue ta lecture autour du quotidien, des expériences en solo et de l’art de vivre.",
  },
  "article-2": {
    markdown: cosyActivitiesMarkdown,
    eyebrow: "Lifestyle · Journée cosy",
    readingTime: "18 min de lecture",
    image: cafeImage,
    imageAlt: "Ambiance chaleureuse pour profiter d’une journée pluvieuse à la maison",
    illustrations: cosyActivitiesIllustrations,
    recommendationsDescription: "Continue ta lecture autour des moments cosy, de la créativité et de l’art de vivre.",
  },
}

const BlogLifestyleArticlePage = () => {
  const { articleSlug } = useParams()
  const article = articleSlug ? lifestyleArticles[articleSlug] : undefined

  useEffect(() => {
    document.body.classList.add("mental-article-page--tone")
    return () => document.body.classList.remove("mental-article-page--tone")
  }, [])

  if (!article) {
    return (
      <div className="mental-article-page">
        <section className="mental-article-placeholder">
          <span>Lifestyle</span>
          <h1>Article à venir</h1>
          <p>Ce nouvel article est en cours de préparation.</p>
          <Link to="/blog/lifestyle">Retour aux articles Lifestyle</Link>
        </section>
      </div>
    )
  }

  const normalizedMarkdown = article.markdown.replace(/\r/g, "")
  const markdownLines = normalizedMarkdown.split("\n")
  const titleIndex = markdownLines.findIndex((line) => line.startsWith("# "))
  const articleTitle = titleIndex >= 0 ? markdownLines[titleIndex].slice(2) : "Article Lifestyle"
  const articleBody = markdownLines.slice(titleIndex + 1).join("\n")
  const recommendations = suggestedArticles
    .filter((suggestion) => suggestion.href !== `/blog/lifestyle/${articleSlug}`)
    .slice(0, 3)

  return (
    <div className="mental-article-page">
      <Link className="mental-article-page__back" to="/blog/lifestyle">← Retour aux articles Lifestyle</Link>

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
        <BlogPublicationDate className="mental-article__published-date" href={`/blog/lifestyle/${articleSlug}`} />
      </article>

      <section className="self-love-rituals mental-article-recommendations" aria-labelledby="lifestyle-article-recommendations-title">
        <header className="self-love-rituals__header">
          <div>
            <h2 id="lifestyle-article-recommendations-title">Autres articles</h2>
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

export default BlogLifestyleArticlePage
