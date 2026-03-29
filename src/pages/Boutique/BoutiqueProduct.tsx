import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import "./Boutique.css"
import { products } from "./boutiqueData"
import { fetchCustomProducts, loadCustomProducts, PRODUCTS_UPDATED_EVENT } from "./boutiqueStorage"
import { addToCart } from "./cartStorage"
import { useAuth } from "../../context/AuthContext"
import { createCheckoutSession } from "../../services/boutique/checkout"
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

const BoutiqueProductPage = () => {
  const { productId } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [customProducts, setCustomProducts] = useState(() => loadCustomProducts())
  const product = useMemo(
    () => [...products, ...customProducts].find((item) => item.id === productId) ?? null,
    [productId, customProducts],
  )
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [isCartAnimating, setIsCartAnimating] = useState(false)
  const [isCartToastVisible, setIsCartToastVisible] = useState(false)
  const cartAnimationTimeoutRef = useRef<number | null>(null)
  const cartToastTimeoutRef = useRef<number | null>(null)
  const recommendationsTrackRef = useRef<HTMLDivElement | null>(null)

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
    return () => {
      if (cartAnimationTimeoutRef.current) {
        window.clearTimeout(cartAnimationTimeoutRef.current)
      }
      if (cartToastTimeoutRef.current) {
        window.clearTimeout(cartToastTimeoutRef.current)
      }
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

  const isCheckoutAvailable = product?.checkoutEnabled !== false
  const pricing = useMemo(() => (product ? getProductPricing(product) : null), [product])
  const shouldShowDeliveryInfo = product?.mockup === "bundle" && product.features.length > 0
  const recommendedProducts = useMemo(
    () => [...products, ...customProducts].filter((item) => item.id !== product?.id).slice(0, 8),
    [customProducts, product?.id],
  )

  const handleRecommendationsScroll = (direction: "prev" | "next") => {
    const track = recommendationsTrackRef.current
    if (!track) return
    const scrollAmount = Math.max(track.clientWidth * 0.85, 280)
    track.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    })
  }

  const handleAddToCart = () => {
    if (!product || !isCheckoutAvailable) return
    addToCart(product, 1)
    if (cartAnimationTimeoutRef.current) {
      window.clearTimeout(cartAnimationTimeoutRef.current)
    }
    setIsCartAnimating(false)
    window.requestAnimationFrame(() => {
      setIsCartAnimating(true)
      cartAnimationTimeoutRef.current = window.setTimeout(() => setIsCartAnimating(false), 650)
    })

    if (cartToastTimeoutRef.current) {
      window.clearTimeout(cartToastTimeoutRef.current)
    }
    setIsCartToastVisible(true)
    cartToastTimeoutRef.current = window.setTimeout(() => setIsCartToastVisible(false), 6000)
  }

  const handleOpenCart = () => {
    setIsCartToastVisible(false)
    navigate("/panier")
  }

  const handleCheckout = async () => {
    if (!product || !isCheckoutAvailable) {
      return
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: {
            pathname: location.pathname,
            search: location.search,
          },
        },
      })
      return
    }

    setIsCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const checkoutUrl = await createCheckoutSession({ productId: product.id })
      window.location.href = checkoutUrl
    } catch (error) {
      console.error(error)
      setCheckoutError(error instanceof Error ? error.message : "Impossible de lancer le paiement. Reessaie dans quelques secondes.")
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="boutique-page boutique-detail">
        <section className="boutique-detail__header">
          <Link to="/boutique" className="boutique-link-button">
            &lt; Retour boutique
          </Link>
          <h1>Produit introuvable</h1>
          <p>Le produit demande n'existe pas encore.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="boutique-page boutique-detail">
      <button
        type="button"
        className={`boutique-cart-toast${isCartToastVisible ? " is-visible" : ""}`}
        role="status"
        aria-live="polite"
        onClick={handleOpenCart}
      >
        <span className="boutique-cart-toast__eyebrow">Ajoute a votre panier</span>
        {product ? (
          <div className="boutique-cart-toast__content">
            <img src={product.image} alt="" className="boutique-cart-toast__image" loading="lazy" decoding="async" />
            <div>
              <h1 className="boutique-cart-toast__title">{product.title}</h1>
              <p className="boutique-cart-toast__price">{pricing?.currentPrice ?? product.price}</p>
            </div>
          </div>
        ) : null}
      </button>
      <section className="boutique-detail__header">
        <div className="boutique-detail__intro sport-header">
          <span className="boutique-eyebrow">Produit digital</span>
          <h1>{product.title}</h1>
        </div>
      </section>

      <Link to="/boutique" className="boutique-link-button">
        &lt; Retour boutique
      </Link>

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
        <div className="boutique-detail__side">
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
            <button
              type="button"
              className="boutique-button boutique-button--primary"
              onClick={handleCheckout}
              disabled={isCheckoutLoading || !isCheckoutAvailable}
            >
              {!isCheckoutAvailable ? "Produit bientot disponible" : isCheckoutLoading ? "Redirection..." : "Acheter maintenant"}
            </button>
            <button
              type="button"
              className={`boutique-button boutique-button--ghost${isCartAnimating ? " is-animating" : ""}`}
              onClick={handleAddToCart}
              disabled={!isCheckoutAvailable}
            >
              Ajouter au panier
            </button>
            {!isCheckoutAvailable ? (
              <p className="boutique-checkout-error">Le fichier de telechargement n'est pas encore configure pour ce produit.</p>
            ) : null}
            {checkoutError ? <p className="boutique-checkout-error">{checkoutError}</p> : null}
            {shouldShowDeliveryInfo ? (
              <div className="boutique-detail__features">
                <h2>Infos de livraison</h2>
                <ul>
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {recommendedProducts.length > 0 ? (
        <section className="boutique-section boutique-recommendations" aria-labelledby="boutique-recommendations-title">
          <div className="boutique-section__header boutique-recommendations__header">
            <span className="boutique-eyebrow">Selection</span>
            <h2 id="boutique-recommendations-title">Tu vas aussi aimer</h2>
          </div>
          <div className="boutique-recommendations__carousel">
            <button
              type="button"
              className="boutique-recommendations__arrow boutique-recommendations__arrow--left"
              aria-label="Produits precedents"
              onClick={() => handleRecommendationsScroll("prev")}
            >
              &lt;
            </button>
            <div className="boutique-recommendations__track" ref={recommendationsTrackRef}>
              {recommendedProducts.map((item) => {
                const itemPricing = getProductPricing(item)

                return (
                  <Link key={item.id} to={`/boutique/produit/${item.id}`} className="boutique-product-card boutique-recommendations__card">
                    <div className={`boutique-product__mockup boutique-product__mockup--${item.mockup}`} aria-hidden="true">
                      <img className="boutique-product__image" src={item.image} alt="" loading="lazy" decoding="async" />
                      <span className="boutique-product__mockup-label">{item.formatLabel}</span>
                    </div>
                    <div className="boutique-product__body">
                      {item.badge ? <span className="boutique-product__badge">{item.badge}</span> : null}
                      {itemPricing.hasActivePromotion && itemPricing.promotionLabel ? (
                        <span className="boutique-product__badge">{itemPricing.promotionLabel}</span>
                      ) : null}
                      <h3>{item.title}</h3>
                      <p>{getProductCardBenefit(item.benefit, item.description)}</p>
                      <div className="boutique-product__meta">
                        <span>{item.format}</span>
                        <span className="boutique-product__price">
                          {itemPricing.hasActivePromotion ? <s className="boutique-price__base">{itemPricing.basePrice}</s> : null}
                          <strong>{itemPricing.currentPrice}</strong>
                        </span>
                      </div>
                      <span className="boutique-button boutique-button--primary">Voir le produit</span>
                    </div>
                  </Link>
                )
              })}
            </div>
            <button
              type="button"
              className="boutique-recommendations__arrow boutique-recommendations__arrow--right"
              aria-label="Produits suivants"
              onClick={() => handleRecommendationsScroll("next")}
            >
              &gt;
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default BoutiqueProductPage


