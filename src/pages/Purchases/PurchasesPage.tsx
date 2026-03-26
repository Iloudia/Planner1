import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../Boutique/Boutique.css"
import "./PurchasesPage.css"
import { fetchOwnedDigitalProducts, type OwnedDigitalProduct } from "../../services/boutique/checkout"

const formatPurchasedAt = (value: string) => {
  if (!value) return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

const PurchasesPage = () => {
  const [items, setItems] = useState<OwnedDigitalProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadPurchases = async () => {
      try {
        const nextItems = await fetchOwnedDigitalProducts()
        if (!active) {
          return
        }
        setItems(nextItems)
        setError(null)
      } catch (loadError) {
        if (!active) {
          return
        }
        console.error(loadError)
        setError(loadError instanceof Error ? loadError.message : "Impossible de charger tes achats.")
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadPurchases()

    return () => {
      active = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="boutique-page boutique-page--loading" aria-busy="true" aria-live="polite">
        <span className="boutique-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="boutique-page purchases-page">
      <section className="purchases-hero">
        <div>
          <span className="boutique-eyebrow">Bibliothèque</span>
          <h1>Mes achats</h1>
          <p>Retrouve ici tous les produits que tu as acheté.</p>
        </div>
        <Link to="/boutique" className="boutique-button boutique-button--ghost">
          Continuer mes achats
        </Link>
      </section>

      {error ? (
        <section className="purchases-empty">
          <p className="boutique-checkout-error">{error}</p>
          <Link to="/boutique" className="boutique-button boutique-button--primary">
            Revenir à la boutique
          </Link>
        </section>
      ) : items.length === 0 ? (
        <section className="purchases-empty">
          <p>Tu n'as pas encore de produit digital débloqué.</p>
          <Link to="/boutique" className="boutique-button boutique-button--primary">
            Voir la boutique
          </Link>
        </section>
      ) : (
        <section className="purchases-list">
          {items.map((item) => (
            <article key={item.productId} className="purchases-card">
              <div className="purchases-card__media">
                {item.image ? <img src={item.image} alt={item.title} loading="lazy" decoding="async" /> : <div aria-hidden="true" />}
              </div>
              <div className="purchases-card__body">
                <div className="purchases-card__header">
                  <div>
                    <h2>{item.title}</h2>
                    <p>Acheté le {formatPurchasedAt(item.purchasedAt)}</p>
                  </div>
                  <div className="purchases-card__meta">
                    <span>{item.price}</span>
                    <span>{item.formatLabel}</span>
                  </div>
                </div>
                <div className="purchases-card__downloads">
                  {item.downloads.map((download) => (
                    <a key={download.downloadUrl} href={download.downloadUrl} className="boutique-button boutique-button--primary">
                      Télécharger
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

export default PurchasesPage
