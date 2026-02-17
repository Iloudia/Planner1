import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import "./Boutique.css"

import { categories, products } from "./boutiqueData"

const BoutiqueCategoryPage = () => {
  const { categoryId } = useParams()
  const category = useMemo(() => categories.find((item) => item.id === categoryId), [categoryId])
  const product = useMemo(() => {
    if (category) {
      const match = products.find((item) => item.mockup === category.productType)
      return match ?? products[0]
    }
    return products[0]
  }, [category])

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

  if (!category || !product) {
    return (
      <div className="boutique-page boutique-detail">
        <section className="boutique-detail__header">
          <Link to="/boutique" className="boutique-link-button">
            Retour boutique
          </Link>
          <h1>Catégorie introuvable</h1>
          <p>La catégorie demandée n'existe pas encore.</p>
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
        <div>
          <span className="boutique-eyebrow">Catégorie {category.title}</span>
          <h1>{product.title}</h1>
          <p>{product.benefit}</p>
        </div>
      </section>

      <section className="boutique-detail__layout">
        <div className="boutique-detail__gallery">
          <div className="boutique-detail__main">
            <img src={activeImage} alt={product.title} />
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
                <img src={thumb} alt="" />
              </button>
            ))}
          </div>
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
          <button type="button" className="boutique-button boutique-button--primary">
            Acheter maintenant
          </button>
          <div className="boutique-detail__features">
            <h2>Ce que tu reçois</h2>
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
