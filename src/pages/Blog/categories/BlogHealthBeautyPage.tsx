import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import BlogPublicationDate from "../BlogPublicationDate"
import beautyImage from "../../../assets/beauty.jpeg"
import makeupImage from "../../../assets/makeup.webp"
import selfLoveImage from "../../../assets/selflove.webp"
import plantImage from "../../../assets/Plante-verte.webp"
import smoothieImage from "../../../assets/Smoothie glow mangue passion.png"
import vitaminCImage from "../../../assets/Fleurs-blanches.webp"
import "../BlogPage.css"
import "./BlogHealthBeautyPage.css"

const ARTICLES_PER_PAGE = 12
const testImages = [makeupImage, selfLoveImage, plantImage, smoothieImage]

const testArticles = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  title: index === 0
    ? "Cernes : comprendre pourquoi tu en as et comment avoir l’air plus reposé"
    : index === 1
      ? "Vitamine C : pourquoi elle est si populaire et comment bien l’utiliser"
      : index === 2
        ? "Pousse des cheveux : ce qui influence vraiment la croissance et comment éviter la casse"
        : index === 3
          ? "Ongles : comment les rendre plus forts, éviter les cassures et protéger ses cuticules"
    : `Article Santé & Beauté ${index + 1}`,
  description: index === 0
    ? "Comprendre les différents types de cernes et adopter des gestes adaptés pour avoir le regard plus reposé."
    : index === 1
      ? "Comprendre les bénéfices de la vitamine C, choisir une formule adaptée et l’intégrer correctement à sa routine."
      : index === 2
        ? "Comprendre la croissance des cheveux, distinguer la pousse de la casse et adopter une routine plus adaptée."
        : index === 3
          ? "Comprendre ce qui fragilise les ongles et adopter des gestes simples pour limiter les cassures et protéger les cuticules."
    : "Un article de test consacré aux conseils, aux inspirations et aux rituels pour prendre soin de soi.",
  image: index === 1 ? vitaminCImage : index === 2 ? selfLoveImage : index === 3 ? makeupImage : testImages[index % testImages.length],
  readingTime: index === 0
    ? "22 min de lecture"
    : index === 1
      ? "24 min de lecture"
      : index === 2
        ? "26 min de lecture"
        : index === 3
          ? "25 min de lecture"
      : `${4 + (index % 5)} min de lecture`,
  href: `/blog/sante-beaute/${index === 0 ? "cernes" : `article-${index + 1}`}`,
}))

const BlogHealthBeautyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const totalPages = Math.ceil(testArticles.length / ARTICLES_PER_PAGE)
  const requestedPage = Number(searchParams.get("page"))
  const currentPage = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, totalPages)
    : 1
  const firstArticleIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const visibleArticles = testArticles.slice(firstArticleIndex, firstArticleIndex + ARTICLES_PER_PAGE)

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
      <header className="blog-header">
        <div className="blog-header__media">
          <img src={beautyImage} alt="Univers consacré à la santé et à la beauté" />
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
        <div className="blog-articles-grid">
          {visibleArticles.map((article) => (
            <Link
              className="blog-card blog-card--clickable"
              to={article.href}
              aria-label={`Lire : ${article.title}`}
              key={article.id}
            >
              <div className="blog-card__image">
                <img src={article.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="blog-card__body">
                <div className="blog-card__meta">
                  <span>Santé &amp; Beauté</span>
                  <span>{article.readingTime}</span>
                </div>
                <BlogPublicationDate className="blog-card__date" href={article.href} />
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <span className="blog-text-link">Lire l’article</span>
              </div>
            </Link>
          ))}
        </div>

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
