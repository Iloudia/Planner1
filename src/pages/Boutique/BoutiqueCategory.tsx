import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import "./Boutique.css"

import { categories, products } from "./boutiqueData"
import { fetchCustomProducts, loadCustomProducts, PRODUCTS_UPDATED_EVENT } from "./boutiqueStorage"
import { getProductPricing } from "../../utils/productPricing"

type ProductMedia = {
  type: "image" | "video"
  url: string
}

const DEFAULT_PRODUCT_BENEFIT = "Nouvelle ressource à découvrir."

const getProductCardBenefit = (benefit: string, description: string) => {
  const trimmedBenefit = benefit.trim()
  if (trimmedBenefit && trimmedBenefit !== DEFAULT_PRODUCT_BENEFIT) {
    return trimmedBenefit
  }

  const descriptionStart = description.trim().split("\n").find(Boolean)?.trim() ?? ""
  return descriptionStart.slice(0, 90) || trimmedBenefit || DEFAULT_PRODUCT_BENEFIT
}

const BoutiqueCategoryPage = () => {
  const { categoryId } = useParams()
  const [customProducts, setCustomProducts] = useState(() => loadCustomProducts())
  const category = useMemo(() => categories.find((item) => item.id === categoryId), [categoryId])
  const allProducts = useMemo(() => [...products, ...customProducts], [customProducts])
  const product = useMemo(() => {
    if (category) {
      const match = allProducts.find((item) => item.mockup === category.productType)
      return match ?? allProducts[0]
    }
    return allProducts[0]
  }, [allProducts, category])

  const gallery = product?.gallery ?? []
  const mediaItems = useMemo<ProductMedia[]>(() => {
    const coverMedia = product?.image ? [{ type: "image" as const, url: product.image }] : []
    const galleryMedia = gallery
      .filter((url) => url && url !== product?.image)
      .map((url) => ({ type: "image" as const, url }))

    return [
      ...coverMedia,
      ...galleryMedia,
      ...(product?.video ? [{ type: "video" as const, url: product.video }] : []),
    ]
  }, [gallery, product?.image, product?.video])
  const thumbnails = mediaItems.slice(0, 7)
  const [activeMedia, setActiveMedia] = useState<ProductMedia | null>(mediaItems[0] ?? null)
  const pricing = useMemo(() => (product ? getProductPricing(product) : null), [product])

  useEffect(() => {
    setActiveMedia(mediaItems[0] ?? null)
  }, [mediaItems, product?.id])

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    let active = true
    fetchCustomProducts().then((items) => {
      if (active) setCustomProducts(items)
    })
    const handleStorage = () => setCustomProducts(loadCustomProducts())
    window.addEventListener("storage", handleStorage)
    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleStorage as EventListener)
    return () => {
      active = false
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleStorage as EventListener)
    }
  }, [])

  if (!category || !product) {
    return (
      <div className="boutique-page boutique-detail">
        <section className="boutique-detail__header">
          <Link to="/boutique" className="boutique-link-button">
            &lt; Retour boutique
          </Link>
          <h1>Categorie introuvable</h1>
          <p>La categorie demandee n'existe pas encore.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="boutique-page boutique-detail">
      <section className="boutique-detail__header">
        <Link to="/boutique" className="boutique-link-button">
          &lt; Retour boutique
        </Link>
        <div>
          <span className="boutique-eyebrow">Categorie {category.title}</span>
          <h1>{product.title}</h1>
          <p>{getProductCardBenefit(product.benefit, product.description)}</p>
        </div>
      </section>

      <section className="boutique-detail__layout">
        <div className="boutique-detail__gallery">
          <div className="boutique-detail__main">
            {activeMedia?.type === "video" ? (
              <video src={activeMedia.url} controls playsInline preload="metadata" />
            ) : (
              <img src={activeMedia?.url ?? product.image} alt={product.title} loading="lazy" decoding="async" />
            )}
          </div>
          <div className="boutique-detail__thumbs">
            {thumbnails.map((thumb, index) => (
              <button
                key={`${product.id}-thumb-${thumb.type}-${index}`}
                type="button"
                className={`boutique-detail__thumb${thumb.url === activeMedia?.url && thumb.type === activeMedia?.type ? " is-active" : ""}`}
                onClick={() => setActiveMedia(thumb)}
                aria-label={thumb.type === "video" ? "Voir la video du produit" : index === 0 ? "Voir la photo de couverture" : `Voir la photo ${index + 1}`}
              >
                {thumb.type === "video" ? (
                  <>
                    <video src={thumb.url} muted playsInline preload="metadata" />
                    <span className="boutique-detail__thumb-badge">Video</span>
                  </>
                ) : (
                  <img src={thumb.url} alt="" loading="lazy" decoding="async" />
                )}
              </button>
            ))}
          </div>
        </div>

        <aside className="boutique-detail__info">
          <div className="boutique-detail__price">
            <span className="boutique-detail__price-label">Prix</span>
            <span className="boutique-detail__price-value">
              {pricing?.hasActivePromotion ? <s className="boutique-price__base">{pricing.basePrice}</s> : null}
              <strong>{pricing?.currentPrice ?? product.price}</strong>
            </span>
          </div>
          <p className="boutique-detail__description">{product.description}</p>
          <div className="boutique-detail__meta">
            <span>{product.format}</span>
            <span>Acces immediat</span>
          </div>
          <Link to={`/boutique/produit/${product.id}`} className="boutique-button boutique-button--primary">
            Voir le produit
          </Link>
          <div className="boutique-detail__features">
            <h2>Ce que tu recois</h2>
            <ul>
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default BoutiqueCategoryPage

