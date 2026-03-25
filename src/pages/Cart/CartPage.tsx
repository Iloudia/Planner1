import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "../Boutique/Boutique.css"
import "./Cart.css"
import { products } from "../Boutique/boutiqueData"
import { loadCustomProducts } from "../Boutique/boutiqueStorage"
import { clearCart, loadCartItems, removeFromCart } from "../Boutique/cartStorage"
import { useAuth } from "../../context/AuthContext"
import { createCheckoutSession } from "../../services/boutique/checkout"
const parsePriceToCents = (price: string) => {
  const normalized = price.replace(/[^0-9,\.]/g, "").replace(",", ".")
  const value = Number.parseFloat(normalized)
  if (Number.isNaN(value)) return 0
  return Math.round(value * 100)
}

const formatCents = (cents: number) => {
  const euros = (cents / 100).toFixed(2).replace(".", ",")
  return `${euros}€`
}

const CartPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isCartLoading, setIsCartLoading] = useState(true)
  const [cartItems, setCartItems] = useState(() => loadCartItems())
  const [customProducts, setCustomProducts] = useState(() => loadCustomProducts())
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    const handleUpdate = () => {
      setCartItems(loadCartItems())
      setCustomProducts(loadCustomProducts())
    }
    window.addEventListener("storage", handleUpdate)
    window.addEventListener("cart:updated", handleUpdate as EventListener)
    return () => {
      window.removeEventListener("storage", handleUpdate)
      window.removeEventListener("cart:updated", handleUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    setIsCartLoading(false)
  }, [])

  const allProducts = useMemo(() => [...products, ...customProducts], [customProducts])
  const lineItems = useMemo(() => {
    return cartItems
      .map((item) => ({
        item,
        product: allProducts.find((product) => product.id === item.productId) ?? null,
      }))
      .filter((entry) => entry.product !== null)
  }, [cartItems, allProducts])

  const totalCents = useMemo(() => {
    return lineItems.reduce((sum, entry) => {
      const priceCents = parsePriceToCents(entry.product!.price)
      return sum + priceCents * entry.item.quantity
    }, 0)
  }, [lineItems])

  const unavailableItems = useMemo(
    () => lineItems.filter(({ product }) => product?.checkoutEnabled === false),
    [lineItems],
  )

  const handleCheckout = async () => {
    if (lineItems.length === 0 || unavailableItems.length > 0) return

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
      const payloadItems = lineItems.map(({ item }) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
      const checkoutUrl = await createCheckoutSession({ items: payloadItems })
      window.location.href = checkoutUrl
    } catch (error) {
      console.error(error)
      setCheckoutError(error instanceof Error ? error.message : "Impossible de lancer le paiement. Reessaie dans quelques secondes.")
    } finally {
      setIsCheckoutLoading(false)
    }
  }

  if (isCartLoading) {
    return (
      <div className="cart-page cart-page--loading" aria-busy="true" aria-live="polite">
        <span className="cart-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="boutique-page cart-page">
      <section className="cart-hero">
        <div>
          <span className="boutique-eyebrow">Panier</span>
          <h1>Ton panier</h1>
          <p>Retrouve ici toutes les ressources ajoutées.</p>
        </div>
        <Link to="/boutique" className="boutique-button boutique-button--ghost">
          Continuer mes achats
        </Link>
      </section>

      {lineItems.length === 0 ? (
        <section className="cart-empty">
          <p>Ton panier est vide pour le moment.</p>
          <Link to="/boutique" className="boutique-button boutique-button--primary">
            Voir la boutique
          </Link>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {lineItems.map(({ item, product }) => (
              <article
                key={item.productId}
                className="cart-item"
                onClick={() => navigate(`/boutique/produit/${item.productId}`)}
              >
                <div className="cart-item__media">
                  <img src={product!.image} alt={product!.title} loading="lazy" decoding="async" />
                </div>
                <div className="cart-item__body">
                  <h2>{product!.title}</h2>
                  <p>{product!.benefit}</p>
                  <div className="cart-item__meta">
                    <span>{product!.price}</span>
                    <span>Quantité : {item.quantity}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={(event) => {
                    event.stopPropagation()
                    removeFromCart(item.productId)
                  }}
                >
                  Retirer
                </button>
                {product?.checkoutEnabled === false ? (
                  <p className="boutique-checkout-error">Ce produit n'est pas encore pret a la vente.</p>
                ) : null}
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <div className="cart-summary__card">
              <h2>Récapitulatif</h2>
              <div className="cart-summary__row">
                <span>Total</span>
                <strong>{formatCents(totalCents)}</strong>
              </div>
              <button
                type="button"
                className="boutique-button boutique-button--primary"
                onClick={handleCheckout}
                disabled={isCheckoutLoading || unavailableItems.length > 0}
              >
                {isCheckoutLoading ? "Redirection..." : "Passer au paiement"}
              </button>
              {unavailableItems.length > 0 ? (
                <p className="boutique-checkout-error">Retire les produits non configurés avant de payer.</p>
              ) : checkoutError ? (
                <p className="boutique-checkout-error">{checkoutError}</p>
              ) : null}
              <button type="button" className="boutique-button boutique-button--ghost" onClick={() => clearCart()}>
                Vider le panier
              </button>
            </div>
          </aside>
        </section>
      )}
    </div>
  )
}

export default CartPage

