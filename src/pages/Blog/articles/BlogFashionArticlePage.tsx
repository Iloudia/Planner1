import { Fragment, useEffect, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import ResponsiveSiteImage from "../../../components/ResponsiveSiteImage"
import BlogPublicationDate from "../BlogPublicationDate"
import styleImage from "../../../assets/noeud-papillon.webp"
import moodboardImage from "../../../assets/MoodBoard.webp"
import wardrobeImage from "../../../assets/l-b-dupe.webp"
import signatureImage from "../../../assets/tuany-kohler-dupe.webp"
import natureColorsImage from "../../../assets/nature-match-paon.webp"
import kingfisherImage from "../../../assets/nature-match-martin-pecheur.webp"
import sunsetImage from "../../../assets/nature-match-coucher-soleil.webp"
import flowerImage from "../../../assets/nature-match-fleur.webp"
import agateImage from "../../../assets/nature-match-agate.webp"
import styleMarkdown from "./style-personnel.md?raw"
import capsuleWardrobeMarkdown from "./capsule-wardrobe.md?raw"
import clothingMaterialsMarkdown from "./matieres-vetements.md?raw"
import natureColorsMarkdown from "./couleurs-nature.md?raw"
import "../../SelfLove/SelfLoveHome.css"
import "./BlogMentalArticlePage.css"

type ArticleIllustration = { image: string; alt: string }

const styleIllustrations: Record<string, ArticleIllustration> = {
  "7. Crée tes formules de tenue": {
    image: wardrobeImage,
    alt: "Livre ouvert et tasse de thé sur un lit",
  },
  "21. Pinterest doit servir à trouver des motifs, pas à copier des personnes": {
    image: moodboardImage,
    alt: "Tableau de visualisation consacré à l’indépendance financière et à la création de contenu",
  },
  "40. Le défi de 7 jours pour trouver ton style": {
    image: signatureImage,
    alt: "Chaussures de sport et sac rouge posés sur le sol d’une salle",
  },
}

const capsuleWardrobeIllustrations: Record<string, ArticleIllustration> = {
  "7. Choisis une palette facile à associer": {
    image: moodboardImage,
    alt: "Tableau de visualisation consacré à l’indépendance financière et à la création de contenu",
  },
  "25. Adapte la capsule selon les saisons": {
    image: styleImage,
    alt: "Nœud en ruban rose pâle",
  },
  "40. Une méthode simple pour construire ta capsule": {
    image: wardrobeImage,
    alt: "Livre ouvert et tasse de thé sur un lit",
  },
}

const clothingMaterialsIllustrations: Record<string, ArticleIllustration> = {
  "3. Le coton : le classique polyvalent": {
    image: styleImage,
    alt: "Nœud en ruban rose pâle",
  },
  "22. Le polyester : beaucoup plus complexe que sa mauvaise réputation": {
    image: wardrobeImage,
    alt: "Livre ouvert et tasse de thé sur un lit",
  },
  "42. Comment choisir un vêtement en magasin ?": {
    image: signatureImage,
    alt: "Chaussures de sport et sac rouge posés sur le sol d’une salle",
  },
}

const natureColorsIllustrations: Record<string, ArticleIllustration> = {
  "3. Le martin-pêcheur : turquoise et orange brûlé": {
    image: kingfisherImage,
    alt: "Martin-pêcheur au plumage bleu turquoise et orange brûlé",
  },
  "4. Le coucher de soleil : corail, terracotta, rose et violet": {
    image: sunsetImage,
    alt: "Coucher de soleil aux nuances corail, roses, violettes et bleu profond",
  },
  "5. Les fleurs : bordeaux, magenta et vert": {
    image: flowerImage,
    alt: "Fleur bordeaux et magenta entourée de feuillage vert",
  },
  "6. Les minéraux : ocre, caramel, crème et bleu ardoise": {
    image: agateImage,
    alt: "Strates minérales ocre, caramel, crème et bleu ardoise",
  },
}

const suggestedArticles = [
  {
    title: "Style personnel : comment trouver ton style sans copier toutes les tendances",
    description: "Observer ses habitudes et construire un style cohérent avec sa vraie vie.",
    image: styleImage,
    href: "/blog/mode/style-personnel",
  },
  {
    title: "Capsule wardrobe : créer une garde-robe simple, cohérente et facile à porter",
    description: "Mieux utiliser les vêtements que tu possèdes et construire une garde-robe cohérente avec ta vraie vie.",
    image: wardrobeImage,
    href: "/blog/mode/article-2",
  },
  {
    title: "Matières : comprendre coton, lin, laine, cachemire, polyester, viscose et soie",
    description: "Comprendre les principales matières textiles pour choisir des vêtements adaptés à leur usage.",
    image: signatureImage,
    href: "/blog/mode/article-3",
  },
  {
    title: "Si la nature dit que c’est un match, c’est un match",
    description: "Observer les palettes naturelles pour créer des associations de couleurs plus audacieuses et cohérentes.",
    image: natureColorsImage,
    href: "/blog/mode/couleurs-nature",
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
            <ResponsiveSiteImage src={illustration.image} alt={illustration.alt} loading="lazy" decoding="async" />
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

const fashionArticles: Record<string, {
  markdown: string
  eyebrow: string
  readingTime: string
  image: string
  imageAlt: string
  illustrations: Record<string, ArticleIllustration>
  recommendationsDescription: string
}> = {
  "style-personnel": {
    markdown: styleMarkdown,
    eyebrow: "Mode · Style personnel",
    readingTime: "29 min de lecture",
    image: styleImage,
    imageAlt: "Nœud en ruban rose pâle",
    illustrations: styleIllustrations,
    recommendationsDescription: "Continue ta lecture autour du style, des inspirations et d’une garde-robe qui te ressemble.",
  },
  "article-2": {
    markdown: capsuleWardrobeMarkdown,
    eyebrow: "Mode · Capsule wardrobe",
    readingTime: "27 min de lecture",
    image: wardrobeImage,
    imageAlt: "Livre ouvert et tasse de thé sur un lit",
    illustrations: capsuleWardrobeIllustrations,
    recommendationsDescription: "Continue ta lecture autour du style, des associations et d’une garde-robe plus cohérente.",
  },
  "article-3": {
    markdown: clothingMaterialsMarkdown,
    eyebrow: "Mode · Matières",
    readingTime: "29 min de lecture",
    image: signatureImage,
    imageAlt: "Chaussures de sport et sac rouge posés sur le sol d’une salle",
    illustrations: clothingMaterialsIllustrations,
    recommendationsDescription: "Continue ta lecture autour des matières, du style et de choix vestimentaires plus adaptés.",
  },
  "couleurs-nature": {
    markdown: natureColorsMarkdown,
    eyebrow: "Mode · Couleurs",
    readingTime: "14 min de lecture",
    image: natureColorsImage,
    imageAlt: "Détail de plumes de paon aux nuances bleues, vertes et bronze",
    illustrations: natureColorsIllustrations,
    recommendationsDescription: "Continue ta lecture autour des couleurs, du style personnel et d’une garde-robe plus cohérente.",
  },
}

const BlogFashionArticlePage = () => {
  const { articleSlug } = useParams()
  const article = articleSlug ? fashionArticles[articleSlug] : undefined

  useEffect(() => {
    document.body.classList.add("mental-article-page--tone")
    return () => document.body.classList.remove("mental-article-page--tone")
  }, [])

  if (!article) {
    return (
      <div className="mental-article-page">
        <section className="mental-article-placeholder">
          <span>Mode</span>
          <h1>Article à venir</h1>
          <p>Ce nouvel article est en cours de préparation.</p>
          <Link to="/blog/mode">Retour aux articles Mode</Link>
        </section>
      </div>
    )
  }

  const normalizedMarkdown = article.markdown.replace(/\r/g, "")
  const markdownLines = normalizedMarkdown.split("\n")
  const titleIndex = markdownLines.findIndex((line) => line.startsWith("# "))
  const articleTitle = titleIndex >= 0 ? markdownLines[titleIndex].slice(2) : "Article Mode"
  const articleBody = markdownLines.slice(titleIndex + 1).join("\n")
  const recommendations = suggestedArticles
    .filter((suggestion) => suggestion.href !== `/blog/mode/${articleSlug}`)
    .slice(0, 3)

  return (
    <div className="mental-article-page">
      <Link className="mental-article-page__back" to="/blog/mode">← Retour aux articles Mode</Link>

      <article className="mental-article">
        <header className="mental-article__header">
          <div className="mental-article__headline">
            <span>{article.eyebrow}</span>
            <h1>{articleTitle}</h1>
            <p>{article.readingTime}</p>
          </div>
          <div className="mental-article__media">
            <ResponsiveSiteImage src={article.image} alt={article.imageAlt} preload />
          </div>
        </header>

        <div className="mental-article__content">{renderMarkdown(articleBody, article.illustrations)}</div>
        <BlogPublicationDate className="mental-article__published-date" href={`/blog/mode/${articleSlug}`} />
      </article>

      <section className="self-love-rituals mental-article-recommendations" aria-labelledby="fashion-recommendations-title">
        <header className="self-love-rituals__header">
          <div>
            <h2 id="fashion-recommendations-title">Autres articles</h2>
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

export default BlogFashionArticlePage
