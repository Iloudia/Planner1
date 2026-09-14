import { useEffect } from "react"
import { Link } from "react-router-dom"
import journalingImage from "../../assets/Journaling.webp"
import glowUpEbookImage from "../../assets/couverture glow-up.png"
import EditorialQuote from "../../components/EditorialQuote"
import {
  formatPublicationDate,
  getBlogArticleByHref,
  getLatestBlogArticles,
  type BlogArticleMetadata,
  type BlogCategory,
} from "./blogArticles"
import "./BlogPage.css"

type BlogArticle = {
  category: string
  topic: BlogCategory
  title: string
  description: string
  image: string
  imageAlt: string
  meta: string
  href: string
  publicationDate?: string
}

const toBlogArticle = (article: BlogArticleMetadata): BlogArticle => ({
  ...article,
  topic: article.category,
  meta: article.readingTime,
})

const featuredArticles = [
  "/blog/mental/confiance-en-soi",
  "/blog/mental/article-2",
  "/blog/mode/style-personnel",
  "/blog/sport-nutrition/alimentation-flexible",
].flatMap((href) => {
  const article = getBlogArticleByHref(href)
  return article ? [toBlogArticle(article)] : []
})

const latestArticles: BlogArticle[] = getLatestBlogArticles(6).map(toBlogArticle)
const editorialArticle = getBlogArticleByHref("/blog/mental/article-4")!

const ArticleCard = ({ article, featured = false }: { article: BlogArticle; featured?: boolean }) => (
  <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
    <Link className="blog-card__image" to={article.href} aria-label={`Lire : ${article.title}`}>
      <img src={article.image} alt={article.imageAlt} loading="lazy" decoding="async" />
    </Link>
    <div className="blog-card__body">
      <div className="blog-card__meta">
        <span>{article.category}</span>
        <span>{article.meta}</span>
      </div>
      {article.publicationDate && (
        <time className="blog-card__date" dateTime={article.publicationDate}>
          Publié le {formatPublicationDate(article.publicationDate)}
        </time>
      )}
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <Link className="blog-text-link" to={article.href}>Lire l’article</Link>
    </div>
  </article>
)

const BlogPage = () => {
  useEffect(() => {
    document.body.classList.add("blog-page--tone")
    return () => document.body.classList.remove("blog-page--tone")
  }, [])

  return (
    <div className="blog-page">
      <header className="blog-header">
        <div className="blog-header__media">
          <img src={journalingImage} alt="Carnet ouvert pour prendre le temps d’écrire" />
          <div className="blog-header__headline">
            <span className="blog-eyebrow">Le blog Me&amp;rituals</span>
            <h1>Des mots pour avancer avec douceur et intention</h1>
          </div>
        </div>
        <div className="blog-header__intro">
          <span className="blog-eyebrow">Bienvenue</span>
          <h2>Le journal</h2>
          <p>Un espace de réflexion et de ressources pour mieux s’organiser, prendre soin de soi et construire un quotidien qui nous ressemble.</p>
          <p>Tu y trouveras des idées concrètes autour du journaling, du bien-être, du mouvement et de l’organisation personnelle.</p>
          <a className="blog-button" href="#articles-a-la-une">Découvrir le blog</a>
        </div>
      </header>

      <section className="blog-section" id="articles-a-la-une" aria-labelledby="featured-title">
        <header className="blog-section__header">
          <span className="blog-eyebrow">Sélection</span>
          <h2 id="featured-title">Articles à la une</h2>
          <p>Des pistes concrètes pour avancer avec plus de douceur dans les différentes facettes du quotidien.</p>
        </header>
        <div className="blog-featured-grid">
          {featuredArticles.map((article) => <ArticleCard key={article.title} article={article} featured />)}
        </div>
      </section>

      <section className="blog-editorial" id="article-focus" aria-labelledby="editorial-title">
        <div className="blog-editorial__media">
          <img src={editorialArticle.image} alt={editorialArticle.imageAlt} loading="lazy" decoding="async" />
        </div>
        <div className="blog-editorial__content">
          <span className="blog-eyebrow">Le dossier du moment</span>
          <h2 id="editorial-title">{editorialArticle.title}</h2>
          <p>{editorialArticle.description}</p>
          <p>Apprends à reconnaître les boucles mentales et à retrouver davantage de calme et de recul au quotidien.</p>
          <Link className="blog-button" to={editorialArticle.href}>Lire l’article</Link>
        </div>
      </section>

      <EditorialQuote className="blog-quote" quote="« Avancer doucement reste une façon d’avancer. »" />

      <section className="blog-section" id="tous-les-articles" aria-labelledby="all-articles-title">
        <header className="blog-section__header">
          <span className="blog-eyebrow">À parcourir</span>
          <h2 id="all-articles-title">Derniers articles</h2>
          <p>Organisation, bien-être, mouvement et inspiration : choisis le sujet qui accompagne ton envie du moment.</p>
        </header>
        <div className="blog-articles-grid">
          {latestArticles.map((article) => <ArticleCard key={article.href} article={article} />)}
        </div>
      </section>

      <section className="blog-ebook" aria-labelledby="blog-ebook-title">
        <Link
          className="blog-ebook__media"
          to="/boutique/produit/le-guide-complet-pour-devenir-la-meilleure-version-de-toi-meme-1774631866049"
          aria-label="Découvrir l’ebook Le guide complet pour devenir la meilleure version de toi-même"
        >
          <img
            src={glowUpEbookImage}
            alt="Couverture de l’ebook Le guide complet pour devenir la meilleure version de toi-même"
            loading="lazy"
            decoding="async"
          />
        </Link>
        <div className="blog-ebook__content">
          <span className="blog-eyebrow">La bibliothèque Me&amp;rituals</span>
          <h2 id="blog-ebook-title">Découvrir mes ebook</h2>
          <h3>Le guide complet pour devenir la meilleure version de toi-même</h3>
          <p>Un guide complet pour reprendre confiance en toi, évoluer chaque jour et construire une version de toi plus alignée.</p>
          <div className="blog-ebook__details" aria-label="Caractéristiques de l’ebook">
            <span>Guide complet</span>
            <span>Format numérique</span>
          </div>
          <Link className="blog-button" to="/boutique/produit/le-guide-complet-pour-devenir-la-meilleure-version-de-toi-meme-1774631866049">
            Découvrir l’ebook
          </Link>
        </div>
      </section>
    </div>
  )
}

export default BlogPage
