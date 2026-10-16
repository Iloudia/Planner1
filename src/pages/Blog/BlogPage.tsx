import { useEffect } from "react"
import { Link } from "react-router-dom"
import blogHeroImage from "../../assets/Bouquet de lys roses éclatants.png"
import glowUpEbookImage from "../../assets/couverture glow-up.webp"
import EditorialQuote from "../../components/EditorialQuote"
import ResponsiveSiteImage from "../../components/ResponsiveSiteImage"
import BlogAdminActions from "../../components/BlogAdminActions"
import { useAuth } from "../../context/AuthContext"
import { useBlogPublishing } from "../../context/BlogPublishingContext"
import {
  formatPublicationDate,
  type BlogCategory,
} from "./blogArticles"
import type { BlogCmsArticle } from "../../services/firestore/blogArticles"
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
  status: "draft" | "published"
}

const toBlogArticle = (article: BlogCmsArticle): BlogArticle => ({
  category: article.category,
  topic: article.category,
  title: article.title,
  description: article.description,
  image: article.imageUrl,
  imageAlt: article.imageAlt,
  meta: article.readingTime,
  href: article.href,
  publicationDate: article.publicationDate,
  status: article.status,
})

const featuredHrefs = [
  "/blog/sante-beaute/article-4",
  "/blog/mental/confiance-en-soi",
  "/blog/mental/article-2",
  "/blog/mode/style-personnel",
  "/blog/sport-nutrition/alimentation-flexible",
]

const ArticleCard = ({ article, featured = false, showStatus = false }: { article: BlogArticle; featured?: boolean; showStatus?: boolean }) => (
  <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
    <Link className="blog-card__image" to={article.href} aria-label={`Lire : ${article.title}`}>
      <ResponsiveSiteImage
        src={article.image}
        alt={article.imageAlt}
        sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1100px) 45vw, 360px"
        loading="lazy"
        decoding="async"
      />
    </Link>
    <div className="blog-card__body">
      {showStatus ? <span className={`blog-card__admin-status blog-card__admin-status--${article.status}`}>{article.status === "published" ? "Publié" : "Brouillon"}</span> : null}
      <div className="blog-card__meta">
        <span>{article.category}</span>
        <span>{article.meta}</span>
      </div>
      {article.publicationDate && (
        <time className="blog-card__date" dateTime={article.publicationDate}>
          {article.status === "draft" ? "Date prévue : " : "Publié le "}{formatPublicationDate(article.publicationDate)}
        </time>
      )}
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <Link className="blog-text-link" to={article.href}>Lire l’article</Link>
    </div>
  </article>
)

const BlogPage = () => {
  const { isAdmin } = useAuth()
  const { articles } = useBlogPublishing()
  const visibleArticles = articles.map(toBlogArticle)
  const articlesByHref = new Map(visibleArticles.map((article) => [article.href, article]))
  const featuredArticles = featuredHrefs.flatMap((href) => {
    const article = articlesByHref.get(href)
    return article ? [article] : []
  })
  const latestArticles = [...visibleArticles]
    .sort((first, second) => (second.publicationDate ?? "").localeCompare(first.publicationDate ?? ""))
    .slice(0, 6)
  const editorialArticle = articlesByHref.get("/blog/mental/article-4")

  useEffect(() => {
    document.body.classList.add("blog-page--tone")
    return () => document.body.classList.remove("blog-page--tone")
  }, [])

  return (
    <div className="blog-page">
      <BlogAdminActions />
      <header className="blog-header">
        <div className="blog-header__media">
          <ResponsiveSiteImage src={blogHeroImage} alt="Bouquet de lys roses éclatants" sizes="100vw" preload />
          <div className="blog-header__headline">
            <span className="blog-eyebrow">Le blog Me&amp;rituals</span>
            <h1>Bienvenue sur le blog</h1>
          </div>
        </div>
        <div className="blog-header__intro">
          <span className="blog-eyebrow">À découvrir</span>
          <h2>Des conseils pour un quotidien plus équilibré</h2>
          <p>Retrouve des articles autour du bien-être, de la santé et de la beauté, du mental, de la mode, du sport, de la nutrition et du lifestyle.</p>
          <p>Des conseils concrets, des idées inspirantes et des ressources accessibles pour prendre soin de toi.</p>
          <a className="blog-button sport-workout-button-match" href="#articles-a-la-une">Découvrir les articles</a>
        </div>
      </header>

      <section className="blog-section" id="articles-a-la-une" aria-labelledby="featured-title">
        <header className="blog-section__header">
          <span className="blog-eyebrow">Sélection</span>
          <h2 id="featured-title">Articles à la une</h2>
          <p>Des pistes concrètes pour avancer avec plus de douceur dans les différentes facettes du quotidien.</p>
        </header>
        {featuredArticles.length > 0 ? (
          <div className="blog-featured-grid">
            {featuredArticles.map((article) => <ArticleCard key={article.title} article={article} featured showStatus={isAdmin} />)}
          </div>
        ) : !isAdmin ? (
          <p className="blog-empty-state">Aucun article n’a encore été publié.</p>
        ) : null}
      </section>

      {editorialArticle ? <section className="blog-editorial" id="article-focus" aria-labelledby="editorial-title">
        <div className="blog-editorial__media">
          <ResponsiveSiteImage
            src={editorialArticle.image}
            alt={editorialArticle.imageAlt}
            sizes="(max-width: 767px) calc(100vw - 2rem), 50vw"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="blog-editorial__content">
          <span className="blog-eyebrow">Le dossier du moment</span>
          <h2 id="editorial-title">{editorialArticle.title}</h2>
          <p>{editorialArticle.description}</p>
          <p>Apprends à reconnaître les boucles mentales et à retrouver davantage de calme et de recul au quotidien.</p>
          <Link className="blog-button sport-workout-button-match" to={editorialArticle.href}>Lire l’article</Link>
        </div>
      </section> : null}

      <EditorialQuote className="blog-quote" quote="« Avancer doucement reste une façon d’avancer. »" />

      <section className="blog-section" id="tous-les-articles" aria-labelledby="all-articles-title">
        <header className="blog-section__header">
          <span className="blog-eyebrow">À parcourir</span>
          <h2 id="all-articles-title">Derniers articles</h2>
          <p>Organisation, bien-être, mouvement et inspiration : choisis le sujet qui accompagne ton envie du moment.</p>
        </header>
        {latestArticles.length > 0 ? (
          <div className="blog-articles-grid">
            {latestArticles.map((article) => <ArticleCard key={article.href} article={article} showStatus={isAdmin} />)}
          </div>
        ) : !isAdmin ? (
          <p className="blog-empty-state">Aucun article n’a encore été publié.</p>
        ) : null}
      </section>

      <section className="blog-ebook" aria-labelledby="blog-ebook-title">
        <Link
          className="blog-ebook__media"
          to="/boutique/produit/le-guide-complet-pour-devenir-la-meilleure-version-de-toi-meme-1774631866049"
          aria-label="Découvrir l’ebook Le guide complet pour devenir la meilleure version de toi-même"
        >
          <ResponsiveSiteImage
            src={glowUpEbookImage}
            alt="Couverture de l’ebook Le guide complet pour devenir la meilleure version de toi-même"
            sizes="(max-width: 767px) calc(100vw - 5rem), 390px"
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
          <Link className="blog-button sport-workout-button-match" to="/boutique/produit/le-guide-complet-pour-devenir-la-meilleure-version-de-toi-meme-1774631866049">
            Découvrir l’ebook
          </Link>
        </div>
      </section>
    </div>
  )
}

export default BlogPage
