import { Link } from "react-router-dom"
import ResponsiveSiteImage from "../../components/ResponsiveSiteImage"
import { useAuth } from "../../context/AuthContext"
import { useBlogPublishing } from "../../context/BlogPublishingContext"
import { formatPublicationDate, type BlogCategory } from "./blogArticles"

type LatestBlogArticlesSectionProps = {
  category: BlogCategory
  id: string
}

const LatestBlogArticlesSection = ({ category, id }: LatestBlogArticlesSectionProps) => {
  const { isAdmin } = useAuth()
  const { articles } = useBlogPublishing()
  const latestArticles = articles
    .filter((article) => article.category === category)
    .sort((first, second) => second.publicationDate.localeCompare(first.publicationDate))
    .slice(0, 3)
  const titleId = `${id}-title`

  return (
    <section className="blog-section" id={id} aria-labelledby={titleId}>
      <header className="blog-section__header">
        <span className="blog-eyebrow">Nouveautés</span>
        <h2 id={titleId}>Derniers articles postés</h2>
        <p>Découvre les publications les plus récentes de la catégorie {category}.</p>
      </header>

      {latestArticles.length > 0 ? (
        <div className="blog-articles-grid">
          {latestArticles.map((article) => (
          <article className="blog-card" key={article.href}>
            <Link className="blog-card__image" to={article.href} aria-label={`Lire : ${article.title}`}>
              <ResponsiveSiteImage src={article.imageUrl} alt={article.imageAlt} loading="lazy" decoding="async" />
            </Link>
            <div className="blog-card__body">
              {isAdmin ? <span className={`blog-card__admin-status blog-card__admin-status--${article.status}`}>{article.status === "published" ? "Publié" : "Brouillon"}</span> : null}
              <div className="blog-card__meta">
                <span>{article.category}</span>
                <span>{article.readingTime}</span>
              </div>
              <time className="blog-card__date" dateTime={article.publicationDate}>
                {article.status === "draft" ? "Date prévue : " : "Publié le "}{formatPublicationDate(article.publicationDate)}
              </time>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <Link className="blog-text-link" to={article.href}>Lire l’article</Link>
            </div>
          </article>
          ))}
        </div>
      ) : !isAdmin ? (
        <p className="blog-empty-state">Aucun article n’a encore été publié.</p>
      ) : null}
    </section>
  )
}

export default LatestBlogArticlesSection
