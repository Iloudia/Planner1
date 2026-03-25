import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import "./Boutique.css"

import { benefits, boutiqueHeroBackdrop, categories, products } from "./boutiqueData"
import { fetchCustomProducts, loadCustomProducts, PRODUCTS_UPDATED_EVENT } from "./boutiqueStorage"
import { useAuth } from "../../context/AuthContext"
import { fetchOwnedDigitalProducts } from "../../services/boutique/checkout"

const BoutiquePage = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [customProducts, setCustomProducts] = useState(() => loadCustomProducts())
  const [isBoutiqueLoading, setIsBoutiqueLoading] = useState(true)
  const [ownedProductIds, setOwnedProductIds] = useState<string[]>([])
  const { isAuthReady, isAuthenticated } = useAuth()

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    let active = true
    const loadingTimeout = window.setTimeout(() => {
      if (active) {
        setIsBoutiqueLoading(false)
      }
    }, 250)

    fetchCustomProducts()
      .then((items) => {
        if (active) setCustomProducts(items)
      })
      .finally(() => {
        window.clearTimeout(loadingTimeout)
        if (active) {
          setIsBoutiqueLoading(false)
        }
      })
    return () => {
      active = false
      window.clearTimeout(loadingTimeout)
    }
  }, [])

  useEffect(() => {
    if (isBoutiqueLoading) {
      return
    }

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

    // Safety fallback: avoid a fully blank page if observer callbacks never fire.
    const revealFallback = window.setTimeout(() => {
      elements.forEach((element) => element.classList.add("is-visible"))
    }, 900)

    return () => {
      window.clearTimeout(revealFallback)
      observer.disconnect()
    }
  }, [isBoutiqueLoading])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "boutique.customProducts.v1") {
        setCustomProducts(loadCustomProducts())
      }
    }
    const handleProductsUpdated = () => {
      setCustomProducts(loadCustomProducts())
    }
    window.addEventListener("storage", handleStorage)
    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated as EventListener)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated as EventListener)
    }
  }, [])

  useEffect(() => {
    let active = true

    if (!isAuthReady) {
      return () => {
        active = false
      }
    }

    if (!isAuthenticated) {
      setOwnedProductIds([])
      return () => {
        active = false
      }
    }

    const loadOwnedProducts = async () => {
      try {
        const items = await fetchOwnedDigitalProducts()
        if (!active) {
          return
        }
        setOwnedProductIds(items.map((item) => item.productId))
      } catch (error) {
        if (!active) {
          return
        }
        console.error(error)
        setOwnedProductIds([])
      }
    }

    void loadOwnedProducts()

    return () => {
      active = false
    }
  }, [isAuthReady, isAuthenticated])

  const allProducts = useMemo(() => [...products, ...customProducts], [customProducts])
  const ownedProductsSet = useMemo(() => new Set(ownedProductIds), [ownedProductIds])

  const filteredProducts = useMemo(() => {
    const nextProducts = activeFilter === "all" ? [...allProducts] : allProducts.filter((product) => product.mockup === activeFilter)

    nextProducts.sort((left, right) => {
      const leftOwned = ownedProductsSet.has(left.id) ? 1 : 0
      const rightOwned = ownedProductsSet.has(right.id) ? 1 : 0
      if (leftOwned !== rightOwned) {
        return leftOwned - rightOwned
      }
      return 0
    })

    return nextProducts
  }, [activeFilter, allProducts, ownedProductsSet])

  const bestSellers = allProducts.filter((product) => product.bestSeller)
  const categoryProductMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      const match = allProducts.find((product) => product.mockup === category.productType) ?? allProducts[0]
      if (match) acc[category.id] = match.id
      return acc
    }, {})
  }, [allProducts])

  if (isBoutiqueLoading) {
    return (
      <div className="boutique-page boutique-page--loading" aria-busy="true" aria-live="polite">
        <span className="boutique-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="boutique-page">
      <section className="boutique-hero reveal" aria-labelledby="boutique-hero-title">
        <div className="boutique-hero__media" style={{ backgroundImage: `url(${boutiqueHeroBackdrop})` }}>
          <div className="boutique-hero__content">
            <span className="boutique-eyebrow">Boutique</span>
            <h1 id="boutique-hero-title">Des ressources prêtes à vendre pour les créateurs ambitieux.</h1>
            <p className="boutique-hero__subtitle">
              Ebooks PDF, templates Canva, carrousels Instagram : tout est pensé pour booster tes ventes, ta visibilité et ton
              expertise en un temps record.
            </p>
            <div className="boutique-hero__actions">
              <a className="boutique-button boutique-button--primary" href="#produits">
                Voir la boutique
              </a>
              <a className="boutique-button boutique-button--ghost" href="#promesse">
                La promesse
              </a>
            </div>
            <div className="boutique-hero__meta">
              <span>Accès immédiat</span>
              <span>|</span>
              <span>Mises à jour incluses</span>
            </div>
          </div>
        </div>
      </section>

      <section className="boutique-section boutique-section--olive reveal" id="categories" aria-labelledby="boutique-categories-title">
        <div className="boutique-section__header">
          <span className="boutique-eyebrow">Favoris</span>
          <h2 id="boutique-categories-title">Les favoris du moment.</h2>
          <p>Une sélection de produits repérés pour leur style, leur utilité et leur efficacité immédiate.</p>
        </div>
        <div className="boutique-categories">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={categoryProductMap[category.id] ? `/boutique/produit/${categoryProductMap[category.id]}` : `/boutique/${category.id}`}
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

      <section className="boutique-section reveal" id="produits" aria-labelledby="boutique-products-title">
        <div className="boutique-section__header">
          <span className="boutique-eyebrow">Produits</span>
          <h2 id="boutique-products-title">Toute la Boutique</h2>
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
        {filteredProducts.length === 0 ? (
          <p className="boutique-checkout-error">Aucun produit n'est encore publie dans cette categorie.</p>
        ) : null}
        <div className="boutique-products">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/boutique/produit/${product.id}`}
              className={`boutique-product-card${ownedProductsSet.has(product.id) ? " is-owned" : ""}`}
            >
              <div className={`boutique-product__mockup boutique-product__mockup--${product.mockup}`} aria-hidden="true">
                <img className="boutique-product__image" src={product.image} alt="" loading="lazy" decoding="async" />
                <span className="boutique-product__mockup-label">{product.formatLabel}</span>
              </div>
              <div className="boutique-product__body">
                {product.badge ? <span className="boutique-product__badge">{product.badge}</span> : null}
                {ownedProductsSet.has(product.id) ? <span className="boutique-product__owned">Deja achete</span> : null}
                <h3>{product.title}</h3>
                <p>{product.benefit}</p>
                <div className="boutique-product__meta">
                  <span>{product.format}</span>
                  <span className="boutique-product__price">{product.price}</span>
                </div>
                <span className={`boutique-button boutique-button--primary${ownedProductsSet.has(product.id) ? " is-disabled" : ""}`}>
                  {ownedProductsSet.has(product.id) ? "Disponible dans mes achats" : "Acheter"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="boutique-section reveal" id="promesse" aria-labelledby="boutique-benefits-title">
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

      <section className="boutique-legal"></section>
    </div>
  )
}

export default BoutiquePage
