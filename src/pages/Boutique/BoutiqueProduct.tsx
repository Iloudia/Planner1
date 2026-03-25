import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import "./Boutique.css"
import { products } from "./boutiqueData"
import { fetchCustomProducts, loadCustomProducts, PRODUCTS_UPDATED_EVENT } from "./boutiqueStorage"
import { addToCart } from "./cartStorage"
import { useAuth } from "../../context/AuthContext"
import { createCheckoutSession } from "../../services/boutique/checkout"

type ProductMedia = {
  type: "image" | "video"
  url: string
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

  const gallery = product?.gallery ?? []
  const mediaItems = useMemo<ProductMedia[]>(
    () => [
      ...gallery.map((url) => ({ type: "image" as const, url })),
      ...(product?.video ? [{ type: "video" as const, url: product.video }] : []),
    ],
    [gallery, product?.video],
  )
  const thumbnails = mediaItems.slice(1, 7)
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
  const shouldShowDeliveryInfo = product?.mockup === "bundle" && product.features.length > 0

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
              <p className="boutique-cart-toast__price">{product.price}</p>
            </div>
          </div>
        ) : null}
      </button>
      <section className="boutique-detail__header">
        <Link to="/boutique" className="boutique-link-button">
          &lt; Retour boutique
        </Link>
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
                aria-label={thumb.type === "video" ? "Voir la video du produit" : `Voir la photo ${index + 2}`}
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
          <div className="boutique-detail__intro">
            <span className="boutique-eyebrow">Produit digital</span>
            <h1>{product.title}</h1>
            <p>{product.benefit}</p>
          </div>

          <aside className="boutique-detail__info">
            <div className="boutique-detail__price">
              <span className="boutique-detail__price-label">Prix</span>
              <span className="boutique-detail__price-value">{product.price}</span>
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
    </div>
  )
}

export default BoutiqueProductPage


