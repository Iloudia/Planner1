import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import "./Boutique.css"

import { benefits, boutiqueHeroBackdrop, categories, products } from "./boutiqueData"

const BoutiquePage = () => {
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"))
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products
    return products.filter((product) => product.mockup === activeFilter)
  }, [activeFilter])

  const bestSellers = products.filter((product) => product.bestSeller)
  const categoryProductMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      const match = products.find((product) => product.mockup === category.productType) ?? products[0]
      if (match) acc[category.id] = match.id
      return acc
    }, {})
  }, [])

  return (
    <div className="boutique-page">
      <section className="boutique-hero reveal" aria-labelledby="boutique-hero-title">
        <div className="boutique-hero__media" style={{ backgroundImage: `url(${boutiqueHeroBackdrop})` }}>
          <div className="boutique-hero__content">
            <span className="boutique-eyebrow">Boutique digitale</span>
            <h1 id="boutique-hero-title">Des ressources prêtes à vendre pour les créateurs ambitieux.</h1>
            <p className="boutique-hero__subtitle">
              Ebooks PDF, templates Canva, carrousels Instagram : tout est pensé pour booster tes ventes, ta visibilité et ton
              expertise en un temps record.
            </p>
            <div className="boutique-hero__actions">
              <a className="boutique-button boutique-button--primary" href="#produits">
                Voir la boutique
              </a>
              <a className="boutique-button boutique-button--ghost" href="#best-sellers">
                Voir les best-sellers
              </a>
            </div>
            <div className="boutique-hero__meta">
              <span>Accès immédiat</span>
              <span>|</span>
              <span>Mises à jour incluses</span>
              <span>|</span>
              <span>Usage commercial autorisé</span>
            </div>
          </div>
        </div>
      </section>

      <section className="boutique-section boutique-section--olive reveal" id="categories" aria-labelledby="boutique-categories-title">
        <div className="boutique-section__header">
          <span className="boutique-eyebrow">Catégories</span>
          <h2 id="boutique-categories-title">Choisis le format qui correspond à ta façon de créer.</h2>
          <p>Chaque format est construit pour simplifier ta production et maximiser tes conversions.</p>
        </div>
        <div className="boutique-categories">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/boutique/produit/${categoryProductMap[category.id]}`}
              className="boutique-category-card"
            >
              <div className="boutique-category-card__image">
                <img src={category.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="boutique-category-card__top">
                <h3>{category.title}</h3>
                <span className="boutique-category-card__tag">{category.highlight}</span>
              </div>
              <p>{category.description}</p>
              <span className="boutique-link-button">Explorer</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="boutique-section boutique-section--paper reveal" id="best-sellers" aria-labelledby="boutique-best-title">
        <div className="boutique-section__header">
          <span className="boutique-eyebrow">Best-sellers</span>
          <h2 id="boutique-best-title">Les favoris des créateurs en ce moment.</h2>
          <p>Des ressources ultra efficaces pour vendre, publier et performer sans surcharger ton planning.</p>
        </div>
        <div className="boutique-products boutique-products--featured">
          {bestSellers.map((product) => (
            <Link
              key={product.id}
              to={`/boutique/produit/${product.id}`}
              className="boutique-product-card boutique-product-card--featured"
            >
              <div className={`boutique-product__mockup boutique-product__mockup--${product.mockup}`} aria-hidden="true">
                <img className="boutique-product__image" src={product.image} alt="" loading="lazy" decoding="async" />
                <span className="boutique-product__mockup-label">{product.formatLabel}</span>
              </div>
              <div className="boutique-product__body">
                <div className="boutique-product__badge">Best-seller</div>
                <h3>{product.title}</h3>
                <p>{product.benefit}</p>
                <div className="boutique-product__meta">
                  <span>{product.format}</span>
                  <span className="boutique-product__price">{product.price}</span>
                </div>
                <span className="boutique-button boutique-button--primary">Acheter</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="boutique-section reveal" id="produits" aria-labelledby="boutique-products-title">
        <div className="boutique-section__header">
          <span className="boutique-eyebrow">Produits</span>
          <h2 id="boutique-products-title">Toute la boutique digitale.</h2>
          <p>Fais ton choix, personnalise et publie. Les CTA sont pensés pour la conversion.</p>
        </div>
        <div className="boutique-filters" role="list">
          <button
            type="button"
            className={`boutique-filter ${activeFilter === "all" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("all")}
            aria-pressed={activeFilter === "all"}
          >
            Tous
          </button>
          <button
            type="button"
            className={`boutique-filter ${activeFilter === "ebook" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("ebook")}
            aria-pressed={activeFilter === "ebook"}
          >
            Ebooks
          </button>
          <button
            type="button"
            className={`boutique-filter ${activeFilter === "template" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("template")}
            aria-pressed={activeFilter === "template"}
          >
            Templates
          </button>
          <button
            type="button"
            className={`boutique-filter ${activeFilter === "carousel" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("carousel")}
            aria-pressed={activeFilter === "carousel"}
          >
            Carrousels
          </button>
          <button
            type="button"
            className={`boutique-filter ${activeFilter === "bundle" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("bundle")}
            aria-pressed={activeFilter === "bundle"}
          >
            Bundles
          </button>
        </div>
        <div className="boutique-products">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/boutique/produit/${product.id}`} className="boutique-product-card">
              <div className={`boutique-product__mockup boutique-product__mockup--${product.mockup}`} aria-hidden="true">
                <img className="boutique-product__image" src={product.image} alt="" loading="lazy" decoding="async" />
                <span className="boutique-product__mockup-label">{product.formatLabel}</span>
              </div>
              <div className="boutique-product__body">
                {product.badge ? <span className="boutique-product__badge">{product.badge}</span> : null}
                <h3>{product.title}</h3>
                <p>{product.benefit}</p>
                <div className="boutique-product__meta">
                  <span>{product.format}</span>
                  <span className="boutique-product__price">{product.price}</span>
                </div>
                <span className="boutique-button boutique-button--primary">Acheter</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="boutique-section reveal" aria-labelledby="boutique-benefits-title">
        <div className="boutique-section__header">
          <span className="boutique-eyebrow">Promesse</span>
          <h2 id="boutique-benefits-title">Une boutique qui vend pendant que tu crées.</h2>
        </div>
        <div className="boutique-benefits">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="boutique-benefit-card">
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="boutique-cta reveal" aria-labelledby="boutique-cta-title">
        <div className="boutique-cta__content">
          <h2 id="boutique-cta-title">Prête à passer à la vitesse supérieure ?</h2>
          <p>Choisis tes ressources et lance ton prochain contenu dès aujourd'hui.</p>
        </div>
        <a className="boutique-button boutique-button--primary" href="#produits">
          Voir la boutique
        </a>
      </section>

      <section className="boutique-legal">
        <div className="boutique-legal__content">
          <span>Paiement sécurisé | Accès immédiat | Support sous 48h</span>
          <div className="boutique-legal__links">
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Confidentialité</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BoutiquePage
