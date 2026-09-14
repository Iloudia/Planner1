import { Fragment, useEffect, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import BlogPublicationDate from "../BlogPublicationDate"
import darkCirclesImage from "../../../assets/makeup.webp"
import selfCareImage from "../../../assets/selflove.webp"
import plantImage from "../../../assets/Plante-verte.webp"
import routineImage from "../../../assets/Routine.webp"
import vitaminCImage from "../../../assets/Fleurs-blanches.webp"
import articleMarkdown from "./cernes.md?raw"
import vitaminCMarkdown from "./vitamine-c.md?raw"
import hairGrowthMarkdown from "./pousse-des-cheveux.md?raw"
import strongNailsMarkdown from "./ongles-forts.md?raw"
import "../../SelfLove/SelfLoveHome.css"
import "./BlogMentalArticlePage.css"

type ArticleIllustration = { image: string; alt: string }

const darkCirclesIllustrations: Record<string, ArticleIllustration> = {
  "2. Les cernes vasculaires : quand les vaisseaux deviennent visibles": {
    image: selfCareImage,
    alt: "Soin doux consacré à la zone fragile du contour des yeux",
  },
  "8. Combien faut-il dormir pour avoir l’air reposé ?": {
    image: plantImage,
    alt: "Environnement calme associé au repos et à un sommeil régulier",
  },
  "25. Une routine simple pour avoir le regard plus frais": {
    image: routineImage,
    alt: "Routine quotidienne simple pour prendre soin du contour des yeux",
  },
}

const vitaminCIllustrations: Record<string, ArticleIllustration> = {
  "2. La vitamine C est avant tout un antioxydant": {
    image: selfCareImage,
    alt: "Soin antioxydant intégré à une routine douce pour la peau",
  },
  "8. Quelle forme de vitamine C choisir ?": {
    image: plantImage,
    alt: "Sélection attentive d’un soin à la vitamine C adapté à sa peau",
  },
  "28. Une routine simple avec vitamine C": {
    image: routineImage,
    alt: "Routine quotidienne simple intégrant un soin à la vitamine C",
  },
}

const hairGrowthIllustrations: Record<string, ArticleIllustration> = {
  "2. Pousse lente ou casse : comment faire la différence ?": {
    image: plantImage,
    alt: "Observation attentive de la croissance et de l’état des longueurs",
  },
  "8. Faut-il laver souvent son cuir chevelu ?": {
    image: vitaminCImage,
    alt: "Routine douce adaptée aux besoins du cuir chevelu",
  },
  "27. Une routine simple pour conserver davantage de longueur": {
    image: routineImage,
    alt: "Routine capillaire simple pour limiter la casse et conserver les longueurs",
  },
}

const strongNailsIllustrations: Record<string, ArticleIllustration> = {
  "2. Le dédoublement : quand l’ongle se sépare en couches": {
    image: plantImage,
    alt: "Soin doux pour protéger des ongles fragiles et dédoublés",
  },
  "8. Arrête d’arracher les petites peaux": {
    image: selfCareImage,
    alt: "Soin hydratant pour les mains, les ongles et les cuticules",
  },
  "27. Une routine simple pour des ongles plus forts": {
    image: routineImage,
    alt: "Routine simple pour renforcer les ongles et protéger les cuticules",
  },
}

const suggestedArticles = [
  {
    title: "Cernes : comprendre pourquoi tu en as et comment avoir l’air plus reposé",
    description: "Comprendre les différents types de cernes et adopter des gestes adaptés pour avoir le regard plus reposé.",
    image: darkCirclesImage,
    href: "/blog/sante-beaute/cernes",
  },
  {
    title: "Vitamine C : pourquoi elle est si populaire et comment bien l’utiliser",
    description: "Choisir une formule adaptée et intégrer correctement la vitamine C à sa routine de soin.",
    image: vitaminCImage,
    href: "/blog/sante-beaute/article-2",
  },
  {
    title: "Pousse des cheveux : ce qui influence vraiment la croissance et comment éviter la casse",
    description: "Comprendre la croissance des cheveux, distinguer la pousse de la casse et adopter une routine adaptée.",
    image: selfCareImage,
    href: "/blog/sante-beaute/article-3",
  },
  {
    title: "Ongles : comment les rendre plus forts, éviter les cassures et protéger ses cuticules",
    description: "Comprendre ce qui fragilise les ongles et adopter des gestes simples pour limiter les cassures.",
    image: darkCirclesImage,
    href: "/blog/sante-beaute/article-4",
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

const healthBeautyArticles: Record<string, {
  markdown: string
  eyebrow: string
  readingTime: string
  image: string
  imageAlt: string
  illustrations: Record<string, ArticleIllustration>
  recommendationsDescription: string
}> = {
  "cernes": {
    markdown: articleMarkdown,
    eyebrow: "Santé & Beauté · Regard",
    readingTime: "22 min de lecture",
    image: darkCirclesImage,
    imageAlt: "Soin et maquillage pour avoir le regard plus reposé",
    illustrations: darkCirclesIllustrations,
    recommendationsDescription: "Continue ta lecture autour des soins, de la beauté et du bien-être au quotidien.",
  },
  "article-2": {
    markdown: vitaminCMarkdown,
    eyebrow: "Santé & Beauté · Soin de la peau",
    readingTime: "24 min de lecture",
    image: vitaminCImage,
    imageAlt: "Soin lumineux à la vitamine C intégré à une routine pour la peau",
    illustrations: vitaminCIllustrations,
    recommendationsDescription: "Continue ta lecture autour des actifs, des soins de la peau et de la beauté au quotidien.",
  },
  "article-3": {
    markdown: hairGrowthMarkdown,
    eyebrow: "Santé & Beauté · Cheveux",
    readingTime: "26 min de lecture",
    image: selfCareImage,
    imageAlt: "Routine douce consacrée au soin et à la croissance des cheveux",
    illustrations: hairGrowthIllustrations,
    recommendationsDescription: "Continue ta lecture autour des cheveux, des soins et du bien-être au quotidien.",
  },
  "article-4": {
    markdown: strongNailsMarkdown,
    eyebrow: "Santé & Beauté · Ongles",
    readingTime: "25 min de lecture",
    image: darkCirclesImage,
    imageAlt: "Soin des mains pour renforcer les ongles et protéger les cuticules",
    illustrations: strongNailsIllustrations,
    recommendationsDescription: "Continue ta lecture autour des ongles, des soins et de la beauté au quotidien.",
  },
}

const BlogHealthBeautyArticlePage = () => {
  const { articleSlug } = useParams()
  const article = articleSlug ? healthBeautyArticles[articleSlug] : undefined

  useEffect(() => {
    document.body.classList.add("mental-article-page--tone")
    return () => document.body.classList.remove("mental-article-page--tone")
  }, [])

  if (!article) {
    return (
      <div className="mental-article-page">
        <section className="mental-article-placeholder">
          <span>Santé &amp; Beauté</span>
          <h1>Article à venir</h1>
          <p>Ce nouvel article est en cours de préparation.</p>
          <Link to="/blog/sante-beaute">Retour aux articles Santé &amp; Beauté</Link>
        </section>
      </div>
    )
  }

  const normalizedMarkdown = article.markdown.replace(/\r/g, "")
  const markdownLines = normalizedMarkdown.split("\n")
  const titleIndex = markdownLines.findIndex((line) => line.startsWith("# "))
  const articleTitle = titleIndex >= 0 ? markdownLines[titleIndex].slice(2) : "Article Santé & Beauté"
  const articleBody = markdownLines.slice(titleIndex + 1).join("\n")
  const recommendations = suggestedArticles
    .filter((suggestion) => suggestion.href !== `/blog/sante-beaute/${articleSlug}`)
    .slice(0, 3)

  return (
    <div className="mental-article-page">
      <Link className="mental-article-page__back" to="/blog/sante-beaute">← Retour aux articles Santé &amp; Beauté</Link>

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
        <BlogPublicationDate className="mental-article__published-date" href={`/blog/sante-beaute/${articleSlug}`} />
      </article>

      <section className="self-love-rituals mental-article-recommendations" aria-labelledby="health-beauty-recommendations-title">
        <header className="self-love-rituals__header">
          <div>
            <h2 id="health-beauty-recommendations-title">Autres articles</h2>
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

export default BlogHealthBeautyArticlePage
