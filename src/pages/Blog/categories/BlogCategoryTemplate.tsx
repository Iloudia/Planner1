import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import BlogPublicationDate from "../BlogPublicationDate"
import "../BlogPage.css"
import "./BlogHealthBeautyPage.css"

type BlogCategoryTemplateProps = {
  category: string
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
  articleDescription,
  articleCount = 24,
  articleBasePath,
  firstArticle,
  secondArticle,
  thirdArticle,
  fourthArticle,
  fifthArticle,
  sixthArticle,
  seventhArticle,
  eighthArticle,
  ninthArticle,
}: BlogCategoryTemplateProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const testArticles = Array.from({ length: articleCount }, (_, index) => ({
    id: index + 1,
    title: index === 0 && firstArticle
      ? firstArticle.title
      : index === 1 && secondArticle
        ? secondArticle.title
        : index === 2 && thirdArticle
          ? thirdArticle.title
          : index === 3 && fourthArticle
            ? fourthArticle.title
            : index === 4 && fifthArticle
              ? fifthArticle.title
              : index === 5 && sixthArticle
                ? sixthArticle.title
                : index === 6 && seventhArticle
                  ? seventhArticle.title
                  : index === 7 && eighthArticle
                    ? eighthArticle.title
                    : index === 8 && ninthArticle
                      ? ninthArticle.title
        : `Article ${category} ${index + 1}`,
    description: index === 0 && firstArticle
      ? firstArticle.description
      : index === 1 && secondArticle
        ? secondArticle.description
        : index === 2 && thirdArticle
          ? thirdArticle.description
          : index === 3 && fourthArticle
            ? fourthArticle.description
            : index === 4 && fifthArticle
              ? fifthArticle.description
              : index === 5 && sixthArticle
                ? sixthArticle.description
                : index === 6 && seventhArticle
                  ? seventhArticle.description
                  : index === 7 && eighthArticle
                    ? eighthArticle.description
                    : index === 8 && ninthArticle
                      ? ninthArticle.description
        : articleDescription,
    readingTime: index === 0 && firstArticle
      ? firstArticle.readingTime
      : index === 1 && secondArticle
        ? secondArticle.readingTime
        : index === 2 && thirdArticle
          ? thirdArticle.readingTime
          : index === 3 && fourthArticle
            ? fourthArticle.readingTime
            : index === 4 && fifthArticle
              ? fifthArticle.readingTime
              : index === 5 && sixthArticle
                ? sixthArticle.readingTime
                : index === 6 && seventhArticle
                  ? seventhArticle.readingTime
                  : index === 7 && eighthArticle
                    ? eighthArticle.readingTime
                    : index === 8 && ninthArticle
                      ? ninthArticle.readingTime
        : `${4 + (index % 5)} min de lecture`,
    image: index === 0 && firstArticle?.image
      ? firstArticle.image
      : index === 1 && secondArticle?.image
        ? secondArticle.image
        : index === 2 && thirdArticle?.image
          ? thirdArticle.image
          : index === 3 && fourthArticle?.image
            ? fourthArticle.image
            : index === 4 && fifthArticle?.image
              ? fifthArticle.image
              : index === 5 && sixthArticle?.image
                ? sixthArticle.image
                : index === 6 && seventhArticle?.image
                  ? seventhArticle.image
                  : index === 7 && eighthArticle?.image
                    ? eighthArticle.image
                    : index === 8 && ninthArticle?.image
                      ? ninthArticle.image
        : headerImage,
    href: articleBasePath
      ? `${articleBasePath}/${index === 0 && firstArticle
        ? firstArticle.slug
        : index === 1 && secondArticle
          ? secondArticle.slug
          : index === 2 && thirdArticle
            ? thirdArticle.slug
            : index === 3 && fourthArticle
              ? fourthArticle.slug
              : index === 4 && fifthArticle
                ? fifthArticle.slug
                : index === 5 && sixthArticle
                  ? sixthArticle.slug
                  : index === 6 && seventhArticle
                    ? seventhArticle.slug
                    : index === 7 && eighthArticle
                      ? eighthArticle.slug
                      : index === 8 && ninthArticle
                        ? ninthArticle.slug
          : `article-${index + 1}`}`
      : undefined,
  }))
  const totalPages = Math.ceil(testArticles.length / ARTICLES_PER_PAGE)
  const requestedPage = Number(searchParams.get("page"))
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, totalPages)
    : 1
  const firstArticleIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const visibleArticles = testArticles.slice(firstArticleIndex, firstArticleIndex + ARTICLES_PER_PAGE)
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
      <header className="blog-header">
        <div className="blog-header__media">
          <img src={headerImage} alt={headerImageAlt} />
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

      <section className="blog-health-page__articles" id={articlesId} aria-labelledby={articlesTitleId}>
        <header className="blog-section__header">
          <span className="blog-eyebrow">À découvrir</span>
          <h2 id={articlesTitleId}>Nos articles {category}</h2>
          <p>{sectionDescription}</p>
        </header>

        <div className="blog-articles-grid">
          {visibleArticles.map((article) => {
            const cardContent = (
              <>
              <div className="blog-card__image">
                <img src={article.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="blog-card__body">
                <div className="blog-card__meta">
                  <span>{category}</span>
                  <span>{article.readingTime}</span>
                </div>
                {article.href && <BlogPublicationDate className="blog-card__date" href={article.href} />}
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
                key={article.id}
              >
                {cardContent}
              </Link>
            ) : (
              <article className="blog-card" key={article.id}>{cardContent}</article>
            )
          })}
        </div>

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
