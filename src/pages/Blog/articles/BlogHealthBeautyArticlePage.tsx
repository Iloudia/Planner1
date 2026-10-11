import { Fragment, useEffect, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import ResponsiveSiteImage from "../../../components/ResponsiveSiteImage"
import BlogPublicationDate from "../BlogPublicationDate"
import darkCirclesImage from "../../../assets/En finir avec les cernes.jpeg"
import selfCareImage from "../../../assets/selflove.webp"
import routineImage from "../../../assets/Routine.webp"
import sleepImage from "../../../assets/Sommeil.jpeg"
import betterSleepImage from "../../../assets/Avoir un meilleure sommeil.jpeg"
import iceCubesImage from "../../../assets/glaçons.jpeg"
import darkCirclesTypesImage from "../../../assets/Les différents types de cernes.png"
import manicure2Image from "../../../assets/Manicure2.jpeg"
import manicureImage from "../../../assets/Manicure.jpeg"
import manicure3Image from "../../../assets/Manicure3.jpeg"
import manicure4Image from "../../../assets/Manicure4.jpeg"
import manicure8Image from "../../../assets/Manucure8.jpeg"
import goldenCuticleOilImage from "../../../assets/Soin des cuticules à l’huile dorée.png"
import waterImage from "../../../assets/Eau.jpeg"
import nailAnatomyImage from "../../../assets/Anatomie détaillée de l’ongle.png"
import sheaButterImage from "../../../assets/beurre de karité.png"
import articleMarkdown from "./cernes.md?raw"
import strongNailsMarkdown from "./ongles-forts.md?raw"
import "../../SelfLove/SelfLoveHome.css"
import "./BlogMentalArticlePage.css"

type ArticleIllustration = {
  image: string
  alt: string
  objectPosition?: string
  objectFit?: "cover" | "contain"
}

const darkCirclesIllustrations: Record<string, ArticleIllustration> = {
  "Qu’est-ce qu’un cerne exactement ?": {
    image: darkCirclesTypesImage,
    alt: "Les différents types de cernes",
    objectFit: "contain",
  },
  "7. Est-ce réellement à cause du manque de sommeil ?": {
    image: sleepImage,
    alt: "Sommeil",
  },
  "8. Combien faut-il dormir pour avoir l’air reposé ?": {
    image: betterSleepImage,
    alt: "Avoir un meilleur sommeil",
  },
  "13. Le froid peut aider surtout sur les poches": {
    image: iceCubesImage,
    alt: "Glaçons",
    objectPosition: "center 65%",
  },
}

const strongNailsIllustrations: Record<string, ArticleIllustration> = {
  "De quoi est composé un ongle ?": {
    image: nailAnatomyImage,
    alt: "Schéma de l’anatomie de l’ongle vu de dessus et en coupe",
    objectFit: "contain",
  },
  "2. Pourquoi l’eau peut-elle dédoubler et fragiliser les ongles ?": {
    image: waterImage,
    alt: "Eau",
    objectPosition: "center 85%",
  },
  "6. Arrête d’arracher les petites peaux": {
    image: selfCareImage,
    alt: "Bouquet de ballons roses en forme de cœur",
  },
  "11. Manucure gel : comment éviter de fragiliser ses ongles ?": {
    image: manicure8Image,
    alt: "Soin des ongles après une manucure gel",
  },
  "14. Une huile à cuticules est-elle utile ?": {
    image: goldenCuticleOilImage,
    alt: "Soin des cuticules à l’huile dorée",
  },
}

const strongNailsRoutineImages = [manicureImage, manicure3Image, manicure4Image]
const darkCirclesRoutineImages = [darkCirclesImage, routineImage, selfCareImage]

const suggestedArticles = [
  {
    title: "Cernes : comprendre pourquoi tu en as et comment avoir l’air plus reposé",
    description: "Comprendre les différents types de cernes et adopter des gestes adaptés pour avoir le regard plus reposé.",
    image: darkCirclesImage,
    href: "/blog/sante-beaute/cernes",
  },
  {
    title: "Ongles : comment les rendre plus forts, éviter les cassures et protéger ses cuticules",
    description: "Comprendre ce qui fragilise les ongles et adopter des gestes simples pour limiter les cassures.",
    image: manicure2Image,
    href: "/blog/sante-beaute/article-4",
  },
]

const renderInline = (text: string, keyPrefix: string): ReactNode[] =>
  text.split(/(\*\*.*?\*\*|<br\s*\/?\s*>)/gi).filter(Boolean).map((part, index) =>
    /^<br\s*\/?\s*>$/i.test(part) ? (
      <br key={`${keyPrefix}-${index}`} />
    ) : part.startsWith("**") && part.endsWith("**") ? (
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

      if (heading.endsWith("Une routine simple pour des ongles plus forts")) {
        const cards: Array<{ title: string; items: string[] }> = []
        index += 1

        while (index < lines.length && lines[index].trim() !== "---") {
          const currentLine = lines[index].trim()
          if (!currentLine) {
            index += 1
            continue
          }

          const titleMatch = currentLine.match(/^\*\*(.+)\*\*$/)
          if (!titleMatch) {
            index += 1
            continue
          }

          const items: string[] = []
          const title = titleMatch[1]
          index += 1

          while (index < lines.length) {
            const itemLine = lines[index].trim()
            if (itemLine === "---" || /^\*\*(.+)\*\*$/.test(itemLine)) {
              break
            }
            if (itemLine.startsWith("* ")) {
              items.push(itemLine.slice(2))
            }
            index += 1
          }

          cards.push({ title, items })
        }

        blocks.push(
          <div className="nail-routine-grid" key={`routine-grid-${index}`}>
            {cards.map((card, cardIndex) => (
              <section className="nail-routine-card" key={card.title}>
                <ResponsiveSiteImage
                  className="nail-routine-card__image"
                  src={strongNailsRoutineImages[cardIndex]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="nail-routine-card__content">
                  <h3>{card.title}</h3>
                  <ul>
                    {card.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{renderInline(item, `routine-${cardIndex}-${itemIndex}`)}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>,
        )
        continue
      }

      if (heading.endsWith("Une routine simple pour avoir le regard plus frais")) {
        const cards: Array<{ title: string; items: string[] }> = []
        index += 1

        while (index < lines.length && lines[index].trim() !== "---") {
          const currentLine = lines[index].trim()
          if (!currentLine) {
            index += 1
            continue
          }

          const titleMatch = currentLine.match(/^\*\*(.+)\*\*$/)
          if (!titleMatch) {
            index += 1
            continue
          }

          const items: string[] = []
          const title = titleMatch[1]
          index += 1

          while (index < lines.length) {
            const itemLine = lines[index].trim()
            if (itemLine === "---" || /^\*\*(.+)\*\*$/.test(itemLine)) {
              break
            }
            if (itemLine.startsWith("* ")) {
              items.push(itemLine.slice(2))
            }
            index += 1
          }

          cards.push({ title, items })
        }

        blocks.push(
          <div className="cerne-routine-grid" key={`cerne-routine-grid-${index}`}>
            {cards.map((card, cardIndex) => (
              <section className="cerne-routine-card" key={card.title}>
                <ResponsiveSiteImage
                  className="cerne-routine-card__image"
                  src={darkCirclesRoutineImages[cardIndex]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="cerne-routine-card__content">
                  <h3>{card.title}</h3>
                  <ul>
                    {card.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{renderInline(item, `cerne-routine-${cardIndex}-${itemIndex}`)}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>,
        )
        continue
      }

      const illustration = illustrations[heading]
      if (illustration) {
        blocks.push(
          <figure className="mental-article__illustration" key={`illustration-${index}`}>
            <ResponsiveSiteImage
              src={illustration.image}
              alt={illustration.alt}
              loading="lazy"
              decoding="async"
              style={{
                objectFit: illustration.objectFit,
                objectPosition: illustration.objectPosition,
              }}
            />
          </figure>,
        )
      }
      index += 1
      continue
    }

    if (line === "**Crèmes riches pour les mains :**") {
      const items: string[] = []
      index += 1

      while (index < lines.length) {
        const itemLine = lines[index].trim()
        if (!itemLine) {
          index += 1
          continue
        }
        if (!itemLine.startsWith("* ")) {
          break
        }
        items.push(itemLine.slice(2))
        index += 1
      }

      blocks.push(
        <aside className="hand-cream-feature" key={`hand-creams-${index}`}>
          <ResponsiveSiteImage
            className="hand-cream-feature__image"
            src={sheaButterImage}
            alt="Beurre de karité"
            loading="lazy"
            decoding="async"
          />
          <div className="hand-cream-feature__content">
            <p><strong>Crèmes riches pour les mains :</strong></p>
            <ul>
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item, `hand-cream-${itemIndex}`)}</li>
              ))}
            </ul>
          </div>
        </aside>,
      )
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
    imageAlt: "Palette de fards, rouge à lèvres et produits de maquillage",
    illustrations: darkCirclesIllustrations,
    recommendationsDescription: "Continue ta lecture autour des soins, de la beauté et du bien-être au quotidien.",
  },
  "article-4": {
    markdown: strongNailsMarkdown,
    eyebrow: "Santé & Beauté · Ongles",
    readingTime: "25 min de lecture",
    image: manicure2Image,
    imageAlt: "Manucure et soin des ongles",
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
            <ResponsiveSiteImage
              src={article.image}
              alt={article.imageAlt}
              preload
              style={articleSlug === "cernes" ? { objectPosition: "center -120px" } : undefined}
            />
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
                <ResponsiveSiteImage src={recommendation.image} alt="" loading="lazy" decoding="async" />
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
