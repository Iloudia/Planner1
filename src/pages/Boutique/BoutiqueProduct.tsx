import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import "./Boutique.css"

import { products } from "./boutiqueData"

const BoutiqueProductPage = () => {
  const { productId } = useParams()
  const product = useMemo(() => products.find((item) => item.id === productId) ?? null, [productId])
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const gallery = product?.gallery ?? []
  const thumbnails = gallery.slice(1, 6)
  const [activeImage, setActiveImage] = useState(gallery[0] ?? product?.image ?? "")

  useEffect(() => {
    setActiveImage(gallery[0] ?? product?.image ?? "")
  }, [gallery, product?.image, product?.id])

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  const handleCheckout = async () => {
    if (!product) {
      return
    }
    setIsCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const apiBase = import.meta.env.VITE_API_BASE || ""
      const response = await fetch(`${apiBase}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      })
      if (!response.ok) {
        throw new Error("Impossible de lancer le paiement.")
      }
      const data = await response.json()
      if (!data?.url) {
        throw new Error("Lien de paiement manquant.")
      }
      window.location.href = data.url
    } catch (error) {
      console.error(error)
      setCheckoutError("Impossible de lancer le paiement. RÃ©essaie dans quelques secondes.")
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="boutique-page boutique-detail">
        <section className="boutique-detail__header">
          <Link to="/boutique" className="boutique-link-button">
            Retour boutique
          </Link>
          <h1>Produit introuvable</h1>
          <p>Le produit demandé n'existe pas encore.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="boutique-page boutique-detail">
      <section className="boutique-detail__header">
        <Link to="/boutique" className="boutique-link-button">
          Retour boutique
        </Link>
      </section>

      <section className="boutique-detail__layout">
        <div className="boutique-detail__gallery">
          <div className="boutique-detail__main">
            <img src={activeImage} alt={product.title} loading="lazy" decoding="async" />
          </div>
          <div className="boutique-detail__thumbs">
            {thumbnails.map((thumb, index) => (
              <button
                key={`${product.id}-thumb-${index}`}
                type="button"
                className={`boutique-detail__thumb${thumb === activeImage ? " is-active" : ""}`}
                onClick={() => setActiveImage(thumb)}
                aria-label={`Voir la photo ${index + 2}`}
              >
                <img src={thumb} alt="" loading="lazy" decoding="async" />
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
              <span>Accès immédiat</span>
              <span>Licence commerciale incluse</span>
            </div>
            <button
              type="button"
              className="boutique-button boutique-button--primary"
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading ? "Redirection..." : "Acheter maintenant"}
            </button>
            {checkoutError ? <p className="boutique-checkout-error">{checkoutError}</p> : null}
            <div className="boutique-detail__features">
              <h2>Ce que tu reçois</h2>
              <ul>
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default BoutiqueProductPage
