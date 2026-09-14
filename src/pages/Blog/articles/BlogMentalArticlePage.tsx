import { Fragment, useEffect, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import BlogPublicationDate from "../BlogPublicationDate"
import articleImage from "../../../assets/selfconfidence.jpeg"
import emotionsArticleImage from "../../../assets/sante.jpeg"
import comparisonArticleImage from "../../../assets/Selfconfidence2.jpeg"
import strengthImage from "../../../assets/Journaling.webp"
import boundariesImage from "../../../assets/selflove.webp"
import innerDialogueImage from "../../../assets/selfconfidence3.jpeg"
import practiceImage from "../../../assets/selflove5.jpeg"
import solitudeImage from "../../../assets/Plante-verte.webp"
import habitsImage from "../../../assets/Routine.webp"
import procrastinationImage from "../../../assets/Projets.jpeg"
import resilienceImage from "../../../assets/Perseverance.webp"
import socialComparisonImage from "../../../assets/MoodBoard.webp"
import articleMarkdown from "./confiance-en-soi.md?raw"
import emotionsMarkdown from "./gestion-des-emotions.md?raw"
import boundariesMarkdown from "./arreter-de-se-justifier.md?raw"
import negativeThoughtsMarkdown from "./pensees-negatives.md?raw"
import solitudeMarkdown from "./solitude.md?raw"
import mentalHabitsMarkdown from "./habitudes-mentales.md?raw"
import procrastinationMarkdown from "./procrastination.md?raw"
import resilienceMarkdown from "./echec-et-resilience.md?raw"
import socialComparisonMarkdown from "./comparaison-sociale.md?raw"
import "../../SelfLove/SelfLoveHome.css"
import "./BlogMentalArticlePage.css"

const suggestedArticles = [
  {
    title: "Confiance en soi : comment la développer, arrêter de se comparer et oser prendre sa place",
    description: "Des repères concrets pour agir malgré le doute, sortir de la comparaison et construire une confiance plus solide.",
    image: articleImage,
    href: "/blog/mental/confiance-en-soi",
  },
  {
    title: "Gestion des émotions : mieux gérer la colère, la frustration, la tristesse et la jalousie",
    description: "Comprendre ses émotions et apprendre à choisir une réponse plus juste dans les moments difficiles.",
    image: emotionsArticleImage,
    href: "/blog/mental/article-2",
  },
  {
    title: "J’ai arrêté de me justifier en permanence",
    description: "Apprendre à poser ses limites et assumer ses choix sans rechercher constamment l’approbation des autres.",
    image: boundariesImage,
    href: "/blog/mental/article-3",
  },
  {
    title: "Pensées négatives : arrêter de trop penser, sortir de la rumination et prendre du recul sur ses pensées",
    description: "Reconnaître les boucles mentales, distinguer les faits des interprétations et retrouver davantage de recul.",
    image: strengthImage,
    href: "/blog/mental/article-4",
  },
  {
    title: "Solitude : apprendre à être bien seul, sans s’isoler",
    description: "Apprécier sa propre compagnie tout en préservant des relations et un équilibre social essentiels.",
    image: solitudeImage,
    href: "/blog/mental/article-5",
  },
  {
    title: "Habitudes mentales : 6 pratiques pour prendre soin de son esprit au quotidien",
    description: "Six pratiques accessibles pour développer davantage de recul, de clarté et d’intention au quotidien.",
    image: habitsImage,
    href: "/blog/mental/article-6",
  },
  {
    title: "Procrastination : pourquoi on repousse et comment enfin commencer",
    description: "Comprendre ce qui nous pousse à reporter et utiliser des méthodes concrètes pour commencer plus facilement.",
    image: procrastinationImage,
    href: "/blog/mental/article-7",
  },
  {
    title: "Échec : apprendre à rebondir, gérer la honte et recommencer",
    description: "Traverser l’échec, distinguer les faits de son identité et construire une reprise plus solide.",
    image: resilienceImage,
    href: "/blog/mental/article-8",
  },
  {
    title: "Comparaison sociale : arrêter de se comparer et rester concentré sur son propre chemin",
    description: "Mieux utiliser les réseaux sociaux et recentrer son attention sur sa propre progression.",
    image: socialComparisonImage,
    href: "/blog/mental/article-9",
  },
]

type ArticleIllustration = { image: string; alt: string }

const confidenceIllustrations: Record<string, ArticleIllustration> = {
  "2. Arrêter de se comparer constamment aux autres": {
    image: comparisonArticleImage,
    alt: "Illustration sur la comparaison aux autres",
  },
  "8. Faire attention à son dialogue intérieur": {
    image: innerDialogueImage,
    alt: "Illustration sur le dialogue intérieur",
  },
  "Un exercice de 7 jours pour renforcer sa confiance": {
    image: practiceImage,
    alt: "Moment calme consacré à une routine personnelle",
  },
}

const emotionsIllustrations: Record<string, ArticleIllustration> = {
  "2. Apprendre à nommer précisément ce que l’on ressent": {
    image: comparisonArticleImage,
    alt: "Moment de réflexion pour identifier précisément ses émotions",
  },
  "8. Éviter le piège de la rumination": {
    image: innerDialogueImage,
    alt: "Moment calme pour prendre du recul sur ses pensées",
  },
  "Une méthode en 5 étapes pour les moments émotionnellement difficiles": {
    image: practiceImage,
    alt: "Routine personnelle pour mieux traverser un moment émotionnel difficile",
  },
}

const boundariesIllustrations: Record<string, ArticleIllustration> = {
  "2. Vous n’avez pas besoin d’un procès pour dire non": {
    image: comparisonArticleImage,
    alt: "Moment de réflexion avant de poser une limite avec calme",
  },
  "8. Arrêter de dire oui immédiatement": {
    image: innerDialogueImage,
    alt: "Pause nécessaire avant de répondre à une demande",
  },
  "Un exercice de 7 jours pour moins chercher l’approbation": {
    image: practiceImage,
    alt: "Routine personnelle pour apprendre à poser ses limites",
  },
}

const negativeThoughtsIllustrations: Record<string, ArticleIllustration> = {
  "2. Une pensée n’est pas forcément un fait": {
    image: comparisonArticleImage,
    alt: "Moment de réflexion pour distinguer une pensée d’un fait",
  },
  "8. Faire attention à son dialogue intérieur": {
    image: innerDialogueImage,
    alt: "Moment calme pour observer son dialogue intérieur",
  },
  "Une méthode en 5 étapes pour sortir d’une boucle mentale": {
    image: practiceImage,
    alt: "Routine personnelle pour prendre du recul sur ses pensées",
  },
}

const solitudeIllustrations: Record<string, ArticleIllustration> = {
  "2. Apprendre à être seul ne signifie pas devenir antisocial": {
    image: comparisonArticleImage,
    alt: "Moment paisible passé seul sans rompre avec les autres",
  },
  "8. Construire une vie que l’on apprécie même lorsqu’on est seul": {
    image: innerDialogueImage,
    alt: "Temps calme consacré à une activité personnelle",
  },
  "Un exercice de 7 jours pour apprendre à mieux vivre la solitude": {
    image: practiceImage,
    alt: "Routine personnelle pour mieux vivre les moments de solitude",
  },
}

const mentalHabitsIllustrations: Record<string, ArticleIllustration> = {
  "2. La méditation : apprendre à observer sans réagir immédiatement": {
    image: comparisonArticleImage,
    alt: "Moment calme consacré à la méditation et à l’observation de ses pensées",
  },
  "8. Ne pas transformer les bonnes habitudes en nouvelles obligations": {
    image: innerDialogueImage,
    alt: "Routine mentale simple et adaptée à son quotidien",
  },
  "Un défi de 7 jours pour construire ses premières habitudes mentales": {
    image: practiceImage,
    alt: "Pratique quotidienne pour construire de nouvelles habitudes mentales",
  },
}

const procrastinationIllustrations: Record<string, ArticleIllustration> = {
  "2. La procrastination peut être une stratégie émotionnelle": {
    image: comparisonArticleImage,
    alt: "Moment de réflexion pour comprendre ce qui conduit à repousser une tâche",
  },
  "8. Préparer le démarrage à l’avance": {
    image: innerDialogueImage,
    alt: "Organisation simple pour faciliter le démarrage d’une tâche",
  },
  "25. Un exercice de 7 jours contre la procrastination": {
    image: practiceImage,
    alt: "Routine quotidienne pour commencer plus facilement et moins procrastiner",
  },
}

const resilienceIllustrations: Record<string, ArticleIllustration> = {
  "2. La honte après un échec : pourquoi elle est si forte": {
    image: comparisonArticleImage,
    alt: "Moment de recul pour traverser la honte après un échec",
  },
  "8. Parler à soi comme à quelqu’un que l’on entraîne": {
    image: innerDialogueImage,
    alt: "Dialogue intérieur constructif après une difficulté",
  },
  "26. Un exercice de 7 jours pour recommencer après un échec": {
    image: practiceImage,
    alt: "Étapes quotidiennes pour reprendre confiance et recommencer",
  },
}

const socialComparisonIllustrations: Record<string, ArticleIllustration> = {
  "2. Pourquoi les réseaux sociaux amplifient-ils la comparaison ?": {
    image: comparisonArticleImage,
    alt: "Réflexion sur la comparaison sociale à travers les réseaux sociaux",
  },
  "8. Comparer des dimensions comparables": {
    image: innerDialogueImage,
    alt: "Moment de recul pour comparer des trajectoires de manière plus juste",
  },
  "29. Un exercice de 7 jours pour réduire la comparaison sociale": {
    image: practiceImage,
    alt: "Pratique quotidienne pour réduire la comparaison sociale",
  },
}

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

const mentalArticles: Record<string, {
  markdown: string
  eyebrow: string
  readingTime: string
  image: string
  imageAlt: string
  illustrations: Record<string, ArticleIllustration>
  recommendationsDescription: string
}> = {
  "confiance-en-soi": {
    markdown: articleMarkdown,
    eyebrow: "Mental · Confiance en soi",
    readingTime: "18 min de lecture",
    image: articleImage,
    imageAlt: "Moment calme consacré à la confiance en soi",
    illustrations: confidenceIllustrations,
    recommendationsDescription: "Continue ta lecture autour de la confiance en soi et du bien-être mental.",
  },
  "article-2": {
    markdown: emotionsMarkdown,
    eyebrow: "Mental · Gestion des émotions",
    readingTime: "22 min de lecture",
    image: emotionsArticleImage,
    imageAlt: "Moment calme consacré à la gestion des émotions",
    illustrations: emotionsIllustrations,
    recommendationsDescription: "Continue ta lecture autour des émotions, de la confiance en soi et du bien-être mental.",
  },
  "article-3": {
    markdown: boundariesMarkdown,
    eyebrow: "Mental · Assertivité",
    readingTime: "20 min de lecture",
    image: boundariesImage,
    imageAlt: "Moment calme consacré à l’affirmation de soi et aux limites personnelles",
    illustrations: boundariesIllustrations,
    recommendationsDescription: "Continue ta lecture autour de l’assertivité, des limites personnelles et du bien-être mental.",
  },
  "article-4": {
    markdown: negativeThoughtsMarkdown,
    eyebrow: "Mental · Pensées négatives",
    readingTime: "24 min de lecture",
    image: strengthImage,
    imageAlt: "Carnet ouvert pour prendre du recul sur ses pensées",
    illustrations: negativeThoughtsIllustrations,
    recommendationsDescription: "Continue ta lecture autour des pensées, des émotions et du bien-être mental.",
  },
  "article-5": {
    markdown: solitudeMarkdown,
    eyebrow: "Mental · Solitude",
    readingTime: "23 min de lecture",
    image: solitudeImage,
    imageAlt: "Moment calme consacré à soi dans un environnement apaisant",
    illustrations: solitudeIllustrations,
    recommendationsDescription: "Continue ta lecture autour de la solitude, des relations et du bien-être mental.",
  },
  "article-6": {
    markdown: mentalHabitsMarkdown,
    eyebrow: "Mental · Habitudes mentales",
    readingTime: "25 min de lecture",
    image: habitsImage,
    imageAlt: "Moment calme consacré à une routine mentale quotidienne",
    illustrations: mentalHabitsIllustrations,
    recommendationsDescription: "Continue ta lecture autour des habitudes, des pensées et du bien-être mental.",
  },
  "article-7": {
    markdown: procrastinationMarkdown,
    eyebrow: "Mental · Procrastination",
    readingTime: "28 min de lecture",
    image: procrastinationImage,
    imageAlt: "Espace de travail consacré au passage à l’action",
    illustrations: procrastinationIllustrations,
    recommendationsDescription: "Continue ta lecture autour de la motivation, des habitudes et du bien-être mental.",
  },
  "article-8": {
    markdown: resilienceMarkdown,
    eyebrow: "Mental · Résilience",
    readingTime: "25 min de lecture",
    image: resilienceImage,
    imageAlt: "Moment de persévérance après une difficulté",
    illustrations: resilienceIllustrations,
    recommendationsDescription: "Continue ta lecture autour de la résilience, de la confiance et du bien-être mental.",
  },
  "article-9": {
    markdown: socialComparisonMarkdown,
    eyebrow: "Mental · Comparaison sociale",
    readingTime: "27 min de lecture",
    image: socialComparisonImage,
    imageAlt: "Composition visuelle consacrée aux aspirations et à son propre chemin",
    illustrations: socialComparisonIllustrations,
    recommendationsDescription: "Continue ta lecture autour de la comparaison, de la confiance et du bien-être mental.",
  },
}

const BlogMentalArticlePage = () => {
  const { articleSlug } = useParams()
  const article = articleSlug ? mentalArticles[articleSlug] : undefined

  useEffect(() => {
    document.body.classList.add("mental-article-page--tone")
    return () => document.body.classList.remove("mental-article-page--tone")
  }, [])

  if (!article) {
    return (
      <div className="mental-article-page">
        <section className="mental-article-placeholder">
          <span>Mental</span>
          <h1>Article à venir</h1>
          <p>Ce nouvel article est en cours de préparation.</p>
          <Link to="/blog/mental">Retour aux articles Mental</Link>
        </section>
      </div>
    )
  }

  const normalizedMarkdown = article.markdown.replace(/\r/g, "")
  const markdownLines = normalizedMarkdown.split("\n")
  const titleIndex = markdownLines.findIndex((line) => line.startsWith("# "))
  const articleTitle = titleIndex >= 0 ? markdownLines[titleIndex].slice(2) : "Article Mental"
  const articleBody = markdownLines.slice(titleIndex + 1).join("\n")
  const recommendations = suggestedArticles
    .filter((suggestion) => suggestion.href !== `/blog/mental/${articleSlug}`)
    .slice(0, 3)

  return (
    <div className="mental-article-page">
      <Link className="mental-article-page__back" to="/blog/mental">← Retour aux articles Mental</Link>

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
        <BlogPublicationDate className="mental-article__published-date" href={`/blog/mental/${articleSlug}`} />
      </article>

      <section className="self-love-rituals mental-article-recommendations" aria-labelledby="mental-article-recommendations-title">
        <header className="self-love-rituals__header">
          <div>
            <h2 id="mental-article-recommendations-title">Autres articles</h2>
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

export default BlogMentalArticlePage
