import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import ResponsiveSiteImage from "../../../components/ResponsiveSiteImage"
import BlogAdminActions from "../../../components/BlogAdminActions"
import { useAuth } from "../../../context/AuthContext"
import { useBlogPublishing } from "../../../context/BlogPublishingContext"
import { formatPublicationDate } from "../blogArticles"
import LatestBlogArticlesSection from "../LatestBlogArticlesSection"
import type { BlogCategory } from "../blogArticles"
import "../BlogPage.css"
import "./BlogHealthBeautyPage.css"

type BlogCategoryTemplateProps = {
  category: BlogCategory
  slug: string
  headerImage: string
  headerImageAlt: string
  headlineEyebrow: string
  introEyebrow: string
  introTitle: string
  introParagraphs: [string, string]
  sectionDescription: string
  articleDescription: string
  articleCount?: number
  articleBasePath?: string
  firstArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
  secondArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
  thirdArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
  fourthArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
  fifthArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
  sixthArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
  seventhArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
  eighthArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
  ninthArticle?: {
    slug: string
    title: string
    description: string
    readingTime: string
    image?: string
  }
}

const ARTICLES_PER_PAGE = 12

const BlogCategoryTemplate = ({
  category,
  slug,
  headerImage,
  headerImageAlt,
  headlineEyebrow,
  introEyebrow,
  introTitle,
  introParagraphs,
  sectionDescription,
}: BlogCategoryTemplateProps) => {
  const { isAdmin } = useAuth()
  const { articles } = useBlogPublishing()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryArticles = articles.filter((article) => article.category === category)
  const totalPages = Math.max(1, Math.ceil(categoryArticles.length / ARTICLES_PER_PAGE))
  const requestedPage = Number(searchParams.get("page"))
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, totalPages)
    : 1
  const firstArticleIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const visibleArticles = categoryArticles.slice(firstArticleIndex, firstArticleIndex + ARTICLES_PER_PAGE)
  const articlesId = `${slug}-articles`
  const articlesTitleId = `${articlesId}-title`

  useEffect(() => {
    document.body.classList.add("blog-health-page--solid")
    return () => document.body.classList.remove("blog-health-page--solid")
  }, [])

  const changePage = (page: number) => {
    setSearchParams(page === 1 ? {} : { page: String(page) })
    window.requestAnimationFrame(() => {
      document.getElementById(articlesId)?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <div className="blog-health-page">
      <BlogAdminActions />
      <header className="blog-header">
        <div className="blog-header__media">
          <ResponsiveSiteImage src={headerImage} alt={headerImageAlt} preload />
          <div className="blog-header__headline">
            <span className="blog-eyebrow">{headlineEyebrow}</span>
            <h1>{category}</h1>
          </div>
        </div>
        <div className="blog-header__intro">
          <span className="blog-eyebrow">{introEyebrow}</span>
          <h2>{introTitle}</h2>
          <p>{introParagraphs[0]}</p>
          <p>{introParagraphs[1]}</p>
        </div>
      </header>

      <LatestBlogArticlesSection category={category} id={`${slug}-derniers-articles`} />

      <section className="blog-health-page__articles" id={articlesId} aria-labelledby={articlesTitleId}>
        <header className="blog-section__header">
          <span className="blog-eyebrow">À découvrir</span>
          <h2 id={articlesTitleId}>Nos articles {category}</h2>
          <p>{sectionDescription}</p>
        </header>

        {visibleArticles.length > 0 ? (
          <div className="blog-articles-grid">
            {visibleArticles.map((article) => {
            const cardContent = (
              <>
              <div className="blog-card__image">
                <ResponsiveSiteImage src={article.imageUrl || headerImage} alt={article.imageAlt} loading="lazy" decoding="async" />
              </div>
              <div className="blog-card__body">
                {isAdmin ? <span className={`blog-card__admin-status blog-card__admin-status--${article.status}`}>{article.status === "published" ? "Publié" : "Brouillon"}</span> : null}
                <div className="blog-card__meta">
                  <span>{category}</span>
                  <span>{article.readingTime}</span>
                </div>
                {article.publicationDate ? <time className="blog-card__date" dateTime={article.publicationDate}>{article.status === "draft" ? "Date prévue : " : "Publié le "}{formatPublicationDate(article.publicationDate)}</time> : null}
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <span className="blog-text-link">Lire l’article</span>
              </div>
              </>
            )

            return article.href ? (
              <Link
                className="blog-card blog-card--clickable"
                to={article.href}
                aria-label={`Lire : ${article.title}`}
                key={article.href}
              >
                {cardContent}
              </Link>
            ) : (
              <article className="blog-card" key={article.href}>{cardContent}</article>
            )
            })}
          </div>
        ) : !isAdmin ? (
          <p className="blog-empty-state">Aucun article n’a encore été publié dans cette catégorie.</p>
        ) : null}

        <nav className="blog-pagination" aria-label={`Pagination des articles ${category}`}>
          <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              type="button"
              className={page === currentPage ? "is-active" : undefined}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => changePage(page)}
              key={page}
            >
              {page}
            </button>
          ))}
          <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
            Suivant
          </button>
        </nav>
      </section>
    </div>
  )
}

export default BlogCategoryTemplate
