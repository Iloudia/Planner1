import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import ResponsiveSiteImage from "../../../components/ResponsiveSiteImage"
import BlogAdminActions from "../../../components/BlogAdminActions"
import { useAuth } from "../../../context/AuthContext"
import { useBlogPublishing } from "../../../context/BlogPublishingContext"
import { formatPublicationDate } from "../blogArticles"
import LatestBlogArticlesSection from "../LatestBlogArticlesSection"
import beautyImage from "../../../assets/beauty.webp"
import "../BlogPage.css"
import "./BlogHealthBeautyPage.css"

const ARTICLES_PER_PAGE = 12

const BlogHealthBeautyPage = () => {
  const { isAdmin } = useAuth()
  const { articles } = useBlogPublishing()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryArticles = articles.filter((article) => article.category === "Santé & Beauté")
  const totalPages = Math.max(1, Math.ceil(categoryArticles.length / ARTICLES_PER_PAGE))
  const requestedPage = Number(searchParams.get("page"))
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, totalPages)
    : 1
  const firstArticleIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const visibleArticles = categoryArticles.slice(firstArticleIndex, firstArticleIndex + ARTICLES_PER_PAGE)

  useEffect(() => {
    document.body.classList.add("blog-health-page--solid")
    return () => document.body.classList.remove("blog-health-page--solid")
  }, [])

  const changePage = (page: number) => {
    setSearchParams(page === 1 ? {} : { page: String(page) })
    window.requestAnimationFrame(() => {
      document.getElementById("sante-beaute-articles")?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <div className="blog-health-page">
      <BlogAdminActions />
      <header className="blog-header">
        <div className="blog-header__media">
          <ResponsiveSiteImage src={beautyImage} alt="Masques en tissu disposés sur le visage imprimé dans un magazine" preload />
          <div className="blog-header__headline">
            <span className="blog-eyebrow">Prendre soin de soi</span>
            <h1>Santé et beauté</h1>
          </div>
        </div>
        <div className="blog-header__intro">
          <span className="blog-eyebrow">Bien-être au quotidien</span>
          <h2>Se sentir bien, naturellement</h2>
          <p>
            Découvre des conseils et des inspirations pour prendre soin de ta santé, de ta peau et de ton bien-être avec douceur.
          </p>
          <p>
            Une approche simple et équilibrée de la beauté, pensée pour t’aider à te sentir bien dans ton corps et dans ton quotidien.
          </p>
        </div>
      </header>

      <LatestBlogArticlesSection category="Santé & Beauté" id="sante-beaute-derniers-articles" />

      <section
        className="blog-health-page__articles"
        id="sante-beaute-articles"
        aria-labelledby="sante-beaute-articles-title"
      >
        <header className="blog-section__header">
          <span className="blog-eyebrow">À découvrir</span>
          <h2 id="sante-beaute-articles-title">Nos articles Santé &amp; Beauté</h2>
          <p>Des conseils et des inspirations pour prendre soin de soi avec douceur au quotidien.</p>
        </header>
        {visibleArticles.length > 0 ? (
          <div className="blog-articles-grid">
            {visibleArticles.map((article) => (
            <Link
              className="blog-card blog-card--clickable"
              to={article.href}
              aria-label={`Lire : ${article.title}`}
              key={article.href}
            >
              <div className="blog-card__image">
                <ResponsiveSiteImage src={article.imageUrl || beautyImage} alt={article.imageAlt} loading="lazy" decoding="async" />
              </div>
              <div className="blog-card__body">
                {isAdmin ? <span className={`blog-card__admin-status blog-card__admin-status--${article.status}`}>{article.status === "published" ? "Publié" : "Brouillon"}</span> : null}
                <div className="blog-card__meta">
                  <span>Santé &amp; Beauté</span>
                  <span>{article.readingTime}</span>
                </div>
                {article.publicationDate ? <time className="blog-card__date" dateTime={article.publicationDate}>{article.status === "draft" ? "Date prévue : " : "Publié le "}{formatPublicationDate(article.publicationDate)}</time> : null}
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <span className="blog-text-link">Lire l’article</span>
              </div>
            </Link>
            ))}
          </div>
        ) : !isAdmin ? (
          <p className="blog-empty-state">Aucun article n’a encore été publié dans cette catégorie.</p>
        ) : null}

        <nav className="blog-pagination" aria-label="Pagination des articles">
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

export default BlogHealthBeautyPage
