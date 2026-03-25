import { useEffect, useMemo, useRef, useState } from "react"
import "./AdminProducts.css"
import "./AdminProductsManage.css"
import "../Boutique/Boutique.css"

import type { BoutiqueProduct } from "../../models/product.model"
import {
  deleteCustomProduct,
  fetchCustomProducts,
  loadCustomProducts,
  PRODUCTS_UPDATED_EVENT,
  updateCustomProduct,
} from "../Boutique/boutiqueStorage"

type EditableProduct = BoutiqueProduct & { createdAt?: string; updatedAt?: string }

type CategoryOption = { label: string; value: BoutiqueProduct["mockup"] }

const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "Ebook", value: "ebook" },
  { label: "Templates", value: "template" },
  { label: "Carrousels", value: "carousel" },
  { label: "Moodboard", value: "moodboard" },
  { label: "Bundles", value: "bundle" },
]

const AdminProductsManagePage = () => {
  const [products, setProducts] = useState<EditableProduct[]>(() => loadCustomProducts())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<EditableProduct | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    let active = true
    fetchCustomProducts().then((items) => {
      if (active) setProducts(items)
    })
    const handleUpdate = () => setProducts(loadCustomProducts())
    window.addEventListener("storage", handleUpdate)
    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleUpdate as EventListener)
    return () => {
      active = false
      window.removeEventListener("storage", handleUpdate)
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleUpdate as EventListener)
    }
  }, [])

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""))
  }, [products])

  const startEdit = (product: EditableProduct) => {
    setEditingId(product.id)
    setDraft({ ...product })
    setImagePreview(product.image)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(null)
    setImagePreview("")
  }

  const handleDelete = (productId: string) => {
    const confirmed = window.confirm("Supprimer cette fiche produit ?")
    if (!confirmed) return
    deleteCustomProduct(productId)
    if (editingId === productId) {
      cancelEdit()
    }
  }

  const handleImageChange = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      setImagePreview(result)
      setDraft((prev) => (prev ? { ...prev, image: result } : prev))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!draft) return
    if (!draft.title.trim()) {
      window.alert("Ajoute un titre.")
      return
    }
    if (!draft.price.trim()) {
      window.alert("Ajoute un prix.")
      return
    }

    const features = draft.features?.length ? draft.features : ["Ressource digitale", "Acces immediat", "Usage commercial autorise"]
    const gallery = draft.gallery?.length ? [...draft.gallery] : []
    const normalizedGallery = draft.image
      ? [draft.image, ...gallery.filter((img) => img !== draft.image)]
      : gallery

    const updated: BoutiqueProduct = {
      ...draft,
      title: draft.title.trim(),
      price: draft.price.trim(),
      benefit: draft.benefit?.trim() || draft.description?.trim().slice(0, 90) || "Nouvelle ressource a decouvrir.",
      description: draft.description?.trim() || "Description a completer.",
      features,
      gallery: normalizedGallery.length > 0 ? normalizedGallery : draft.gallery,
    }

    updateCustomProduct(updated)
    setProducts(loadCustomProducts())
    cancelEdit()
  }

  return (
    <div className="boutique-page admin-products-page admin-products-manage-page">
      <header className="admin-products-hero">
        <div>
          <h1>Produits publies</h1>
          <p>Modifie ou supprime les fiches produits deja publiees.</p>
        </div>
      </header>

      {sortedProducts.length === 0 ? (
        <section className="admin-products-panel admin-products-empty">
          <p>Aucune fiche publiee pour le moment.</p>
        </section>
      ) : (
        <section className="admin-products-panel admin-products-list">
          {sortedProducts.map((product) => (
            <article key={product.id} className="admin-products-card">
              <div className="admin-products-card__media">
                <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
              </div>
              <div className="admin-products-card__body">
                <div className="admin-products-card__meta">
                  <span className="admin-products-card__eyebrow">{product.mockup}</span>
                  <strong>{product.price}</strong>
                </div>
                <h2>{product.title}</h2>
                <p>{product.benefit}</p>
              </div>
              <div className="admin-products-card__actions">
                <button type="button" className="boutique-button boutique-button--primary" onClick={() => startEdit(product)}>
                  Modifier
                </button>
                <button type="button" className="boutique-button boutique-button--ghost" onClick={() => handleDelete(product.id)}>
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {draft ? (
        <section className="admin-products-panel admin-products-edit">
          <header className="admin-products-panel__header">
            <div>
              <p>Modifier la fiche</p>
            </div>
            <p className="admin-products-helper">Mets a jour les informations du produit.</p>
          </header>

          <div className="admin-products-edit__grid">
            <div className="admin-products-edit__media">
              <div className="admin-products-edit__preview">
                {imagePreview ? <img src={imagePreview} alt="Apercu" /> : <span>Aucune image</span>}
              </div>
              <button type="button" className="boutique-button boutique-button--ghost" onClick={() => fileInputRef.current?.click()}>
                Changer la photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  handleImageChange(event.target.files?.[0])
                  event.target.value = ""
                }}
              />
            </div>

            <div className="admin-products-edit__fields">
              <div className="admin-products-field">
                <label htmlFor="edit-title">Titre</label>
                <input
                  id="edit-title"
                  type="text"
                  value={draft.title}
                  onChange={(event) => setDraft((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                />
              </div>
              <div className="admin-products-field">
                <label htmlFor="edit-price">Prix</label>
                <input
                  id="edit-price"
                  type="text"
                  value={draft.price}
                  onChange={(event) => setDraft((prev) => (prev ? { ...prev, price: event.target.value } : prev))}
                />
              </div>
              <div className="admin-products-field">
                <label htmlFor="edit-benefit">Accroche</label>
                <input
                  id="edit-benefit"
                  type="text"
                  value={draft.benefit}
                  onChange={(event) => setDraft((prev) => (prev ? { ...prev, benefit: event.target.value } : prev))}
                />
              </div>
              <div className="admin-products-field">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  rows={4}
                  value={draft.description}
                  onChange={(event) => setDraft((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
                />
              </div>
              <div className="admin-products-field">
                <label htmlFor="edit-category">Categorie</label>
                <select
                  id="edit-category"
                  value={draft.mockup}
                  onChange={(event) =>
                    setDraft((prev) =>
                      prev ? { ...prev, mockup: event.target.value as BoutiqueProduct["mockup"] } : prev,
                    )
                  }
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-products-field">
                <label htmlFor="edit-format">Format</label>
                <input
                  id="edit-format"
                  type="text"
                  value={draft.format}
                  onChange={(event) => setDraft((prev) => (prev ? { ...prev, format: event.target.value } : prev))}
                />
              </div>
              <div className="admin-products-field">
                <label htmlFor="edit-format-label">Label format</label>
                <input
                  id="edit-format-label"
                  type="text"
                  value={draft.formatLabel}
                  onChange={(event) => setDraft((prev) => (prev ? { ...prev, formatLabel: event.target.value } : prev))}
                />
              </div>
              <div className="admin-products-field">
                <label htmlFor="edit-features">Details (1 par ligne)</label>
                <textarea
                  id="edit-features"
                  rows={4}
                  value={draft.features?.join("\n") ?? ""}
                  onChange={(event) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            features: event.target.value
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean),
                          }
                        : prev,
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="admin-products-panel--actions admin-products-edit__actions">
            <button type="button" className="boutique-button boutique-button--primary" onClick={handleSave}>
              Enregistrer les modifications
            </button>
            <button type="button" className="boutique-button boutique-button--ghost" onClick={cancelEdit}>
              Annuler
            </button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default AdminProductsManagePage
