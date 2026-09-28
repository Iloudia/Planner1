import { Link } from "react-router-dom"
import ResponsiveSiteImage from "../../components/ResponsiveSiteImage"
import {
  formatPublicationDate,
  getLatestBlogArticlesByCategory,
  type BlogCategory,
} from "./blogArticles"

type LatestBlogArticlesSectionProps = {
  category: BlogCategory
  id: string
}

const LatestBlogArticlesSection = ({ category, id }: LatestBlogArticlesSectionProps) => {
  const latestArticles = getLatestBlogArticlesByCategory(category)
  const titleId = `${id}-title`

  return (
    <section className="blog-section" id={id} aria-labelledby={titleId}>
      <header className="blog-section__header">
        <span className="blog-eyebrow">Nouveautés</span>
        <h2 id={titleId}>Derniers articles postés</h2>
        <p>Découvre les publications les plus récentes de la catégorie {category}.</p>
      </header>

      <div className="blog-articles-grid">
        {latestArticles.map((article) => (
          <article className="blog-card" key={article.href}>
            <Link className="blog-card__image" to={article.href} aria-label={`Lire : ${article.title}`}>
              <ResponsiveSiteImage src={article.image} alt={article.imageAlt} loading="lazy" decoding="async" />
            </Link>
            <div className="blog-card__body">
              <div className="blog-card__meta">
                <span>{article.category}</span>
                <span>{article.readingTime}</span>
              </div>
              <time className="blog-card__date" dateTime={article.publicationDate}>
                Publié le {formatPublicationDate(article.publicationDate)}
              </time>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <Link className="blog-text-link" to={article.href}>Lire l’article</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LatestBlogArticlesSection
