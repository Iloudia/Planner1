import { useEffect, useMemo, useRef, useState } from "react"
import "./AdminProducts.css"
import "./AdminProductsManage.css"
import "../Boutique/Boutique.css"

import type { BoutiqueProduct } from "../../models/product.model"
import { uploadImage } from "../../services/media/api"
import {
  deleteCustomProduct,
  fetchCustomProducts,
  loadCustomProducts,
  PRODUCTS_UPDATED_EVENT,
  updateCustomProduct,
} from "../Boutique/boutiqueStorage"
import {
  getDiscountedPriceFromPercentage,
  getProductPricing,
  getPromotionPercentageFromPrices,
  normalizePriceInput,
  normalizePromotionPercentage,
} from "../../utils/productPricing"

type EditableProduct = BoutiqueProduct & { createdAt?: string; updatedAt?: string }
type EditableGalleryItem = { url: string; name: string; file?: File }
type EditableCategory = Exclude<BoutiqueProduct["mockup"], "bundle">
type CategoryOption = { label: string; value: EditableCategory }

const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "Ebook", value: "ebook" },
  { label: "Mignature", value: "template" },
  { label: "Carrousels", value: "carousel" },
  { label: "Visionboard", value: "moodboard" },
]

const normalizeEditableCategory = (mockup: BoutiqueProduct["mockup"]): EditableCategory =>
  mockup === "bundle" ? "moodboard" : mockup

const getCategoryLabel = (mockup: BoutiqueProduct["mockup"]) =>
  CATEGORY_OPTIONS.find((option) => option.value === normalizeEditableCategory(mockup))?.label ?? "Ebook"
const MAX_IMAGES = 4
const MAX_IMAGE_SIZE_BYTES = 500 * 1024 * 1024

const formatFileSizeMb = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(0)} Mo`

const AdminProductsManagePage = () => {
  const [products, setProducts] = useState<EditableProduct[]>(() => loadCustomProducts())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<EditableProduct | null>(null)
  const [galleryItems, setGalleryItems] = useState<EditableGalleryItem[]>([])
  const [promotionPercentage, setPromotionPercentage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const pendingImageSlotRef = useRef<number | null>(null)

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

  const imageSlots = useMemo(() => {
    return Array.from({ length: MAX_IMAGES }, (_, index) => galleryItems[index] ?? null)
  }, [galleryItems])

  const startEdit = (product: EditableProduct) => {
    const seededGallery = Array.isArray(product.gallery) && product.gallery.length > 0
      ? product.gallery
      : product.image
        ? [product.image]
        : []

    setEditingId(product.id)
    setDraft({
      ...product,
      mockup: normalizeEditableCategory(product.mockup),
      image: seededGallery[0] ?? product.image,
      gallery: seededGallery,
    })
    setGalleryItems(
      seededGallery.slice(0, MAX_IMAGES).map((url, index) => ({
        url,
        name: `Photo ${index + 1}`,
      })),
    )
    setPromotionPercentage(
      product.promotion?.percentage
        ? String(product.promotion.percentage)
        : product.promotion?.price
          ? String(getPromotionPercentageFromPrices(product.price, product.promotion.price))
          : "",
    )
    setIsSaving(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(null)
    setGalleryItems([])
    setPromotionPercentage("")
    setIsSaving(false)
    pendingImageSlotRef.current = null
  }

  const handleDelete = (productId: string) => {
    const confirmed = window.confirm("Supprimer cette fiche produit ?")
    if (!confirmed) return
    deleteCustomProduct(productId)
    if (editingId === productId) {
      cancelEdit()
    }
  }

  const handleImageBrowse = (slotIndex: number) => {
    pendingImageSlotRef.current = slotIndex
    imageInputRef.current?.click()
  }

  const handleImageChange = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      window.alert("Choisis un fichier image valide.")
      pendingImageSlotRef.current = null
      return
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      window.alert(`"${file.name}" dépasse ${formatFileSizeMb(MAX_IMAGE_SIZE_BYTES)}. Réduis l'image avant l'enregistrement.`)
      pendingImageSlotRef.current = null
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const slotIndex = pendingImageSlotRef.current
      pendingImageSlotRef.current = null
      const nextItem: EditableGalleryItem = {
        url: String(reader.result),
        name: file.name,
        file,
      }

      setGalleryItems((prev) => {
        const next = [...prev]
        const targetIndex = typeof slotIndex === "number" ? slotIndex : next.length
        if (targetIndex >= MAX_IMAGES) {
          return prev
        }
        next[targetIndex] = nextItem
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (index: number) => {
    setGalleryItems((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
  }

  const handleSave = async () => {
    if (!draft) return
    if (!draft.title.trim()) {
      window.alert("Ajoute un titre.")
      return
    }
    if (!draft.price.trim()) {
      window.alert("Ajoute un prix.")
      return
    }
    const computedPromotionPrice = getDiscountedPriceFromPercentage(draft.price, promotionPercentage)
    if (draft.promotion?.enabled && !computedPromotionPrice) {
      window.alert("Ajoute un pourcentage de promo valide.")
      return
    }

    const preparedGallery = galleryItems.filter((item): item is EditableGalleryItem => Boolean(item?.url))
    if (preparedGallery.length === 0) {
      window.alert("Ajoute au moins une photo pour le produit.")
      return
    }

    setIsSaving(true)

    try {
      const uploadedGallery = await Promise.all(
        preparedGallery.map(async (item, index) => {
          if (!item.file) {
            return item.url
          }
          const uploaded = await uploadImage(item.file, "boutique-product-image", `${draft.id}-${index + 1}`)
          return uploaded.url
        }),
      )

      const features = draft.features?.length ? draft.features : ["Ressource digitale", "Accès immédiat", "Usage commercial autorisé"]
      const normalizedGallery = uploadedGallery.filter(Boolean)

      const updated: BoutiqueProduct = {
        ...draft,
        mockup: normalizeEditableCategory(draft.mockup),
        title: draft.title.trim(),
        price: normalizePriceInput(draft.price),
        promotion: draft.promotion?.enabled
          ? {
              enabled: true,
              percentage: normalizePromotionPercentage(promotionPercentage),
              price: computedPromotionPrice,
              label: draft.promotion.label?.trim() || undefined,
              startsAt: draft.promotion.startsAt || undefined,
              endsAt: draft.promotion.endsAt || undefined,
            }
          : undefined,
        benefit: draft.benefit?.trim() || draft.description?.trim()?.slice(0, 90).trim() || "Description à compléter.",
        description: draft.description?.trim() || "Description à compléter.",
        features,
        image: normalizedGallery[0] ?? "",
        gallery: normalizedGallery,
      }

      updateCustomProduct(updated)
      setProducts(loadCustomProducts())
      cancelEdit()
    } catch (error) {
      console.error("Update product error:", error)
      window.alert(error instanceof Error ? error.message : "Impossible d'enregistrer les nouvelles photos pour le moment.")
      setIsSaving(false)
    }
  }

  return (
    <div className="boutique-page admin-products-page admin-products-manage-page">
      <header className="admin-products-hero">
        <div>
          <h1>Produits publiés</h1>
          <p>Modifie ou supprime les fiches produits déjà publiées.</p>
        </div>
      </header>

      {sortedProducts.length === 0 ? (
        <section className="admin-products-panel admin-products-empty">
          <p>Aucune fiche publiée pour le moment.</p>
        </section>
      ) : (
        <section className="admin-products-panel admin-products-list">
          {sortedProducts.map((product) => {
            const pricing = getProductPricing(product)

            return (
              <article key={product.id} className="admin-products-card">
                <div className="admin-products-card__media">
                  <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
                </div>
                <div className="admin-products-card__body">
                  <div className="admin-products-card__meta">
                    <span className="admin-products-card__eyebrow">{getCategoryLabel(product.mockup)}</span>
                    <strong>{pricing.currentPrice}</strong>
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
            )
          })}
        </section>
      )}

      {draft ? (
        <section className="admin-products-panel admin-products-edit">
          <header className="admin-products-panel__header">
            <div>
              <p>Modifier la fiche</p>
            </div>
            <p className="admin-products-helper">Mets à jour les informations du produit.</p>
          </header>

          <div className="admin-products-edit__grid">
            <div className="admin-products-edit__media">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  handleImageChange(event.target.files?.[0])
                  event.target.value = ""
                }}
              />

              <div className="admin-products-previews admin-products-edit__previews" aria-label="Photos du produit">
                {imageSlots.map((item, index) => {
                  if (!item) {
                    return (
                      <button
                        key={`edit-image-empty-${index}`}
                        type="button"
                        className="admin-products-preview admin-products-preview--empty"
                        onClick={() => handleImageBrowse(index)}
                      >
                        <span>+ Photo</span>
                      </button>
                    )
                  }

                  return (
                    <button
                      key={`${item.url}-${index}`}
                      type="button"
                      className="admin-products-preview"
                      onClick={() => handleImageBrowse(index)}
                    >
                      <img src={item.url} alt={item.name || `Photo ${index + 1}`} />
                      {index === 0 ? <span className="admin-products-edit__slot-label">Couverture</span> : null}
                      <button
                        type="button"
                        className="admin-products-preview__delete"
                        aria-label={`Supprimer la photo ${index + 1}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          handleRemoveImage(index)
                        }}
                      >
                        🗑️
                      </button>
                    </button>
                  )
                })}
              </div>

              <p className="admin-products-edit__media-note">
                Clique sur une photo pour la remplacer. La première image reste utilisée comme photo de couverture.
              </p>

              <input
                className="admin-products-edit__media-input"
                value={`${galleryItems.filter(Boolean).length}/${MAX_IMAGES} photo(s) configurée(s)`}
                readOnly
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
                <label className="admin-products-checkbox">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.promotion?.enabled)}
                    onChange={(event) =>
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              promotion: event.target.checked
                                ? {
                                    enabled: true,
                                    price: prev.promotion?.price || "",
                                    percentage: prev.promotion?.percentage,
                                    label: prev.promotion?.label,
                                    startsAt: prev.promotion?.startsAt,
                                    endsAt: prev.promotion?.endsAt,
                                  }
                                : undefined,
                            }
                          : prev,
                      )
                    }
                  />
                  <span>Promotion active</span>
                </label>
              </div>
              {draft.promotion?.enabled ? (
                <>
                  <div className="admin-products-field admin-products-field--inline">
                    <div className="admin-products-field">
                      <label htmlFor="edit-promotion-percentage">Promotion (%)</label>
                      <input
                        id="edit-promotion-percentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={promotionPercentage}
                        onChange={(event) => setPromotionPercentage(event.target.value)}
                      />
                    </div>
                    <div className="admin-products-field">
                      <label htmlFor="edit-promotion-label">Libellé promo</label>
                      <input
                        id="edit-promotion-label"
                        type="text"
                        value={draft.promotion.label ?? ""}
                        onChange={(event) =>
                          setDraft((prev) =>
                            prev && prev.promotion
                              ? { ...prev, promotion: { ...prev.promotion, label: event.target.value } }
                              : prev,
                          )
                        }
                      />
                    </div>
                    <div className="admin-products-field">
                      <label htmlFor="edit-promotion-price-preview">Prix après réduction</label>
                      <input
                        id="edit-promotion-price-preview"
                        type="text"
                        value={getDiscountedPriceFromPercentage(draft.price, promotionPercentage) || "Renseigne un prix et un pourcentage"}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="admin-products-field">
                    <label htmlFor="edit-promotion-starts-at">Début promo</label>
                    <input
                      id="edit-promotion-starts-at"
                      type="datetime-local"
                      value={draft.promotion.startsAt ?? ""}
                      onChange={(event) =>
                        setDraft((prev) =>
                          prev && prev.promotion
                            ? { ...prev, promotion: { ...prev.promotion, startsAt: event.target.value } }
                            : prev,
                        )
                      }
                    />
                  </div>
                  <div className="admin-products-field">
                    <label htmlFor="edit-promotion-ends-at">Fin promo</label>
                    <input
                      id="edit-promotion-ends-at"
                      type="datetime-local"
                      value={draft.promotion.endsAt ?? ""}
                      onChange={(event) =>
                        setDraft((prev) =>
                          prev && prev.promotion
                            ? { ...prev, promotion: { ...prev.promotion, endsAt: event.target.value } }
                            : prev,
                        )
                      }
                    />
                  </div>
                </>
              ) : null}
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
                <label htmlFor="edit-category">Catégorie</label>
                <select
                  id="edit-category"
                  value={normalizeEditableCategory(draft.mockup)}
                  onChange={(event) =>
                    setDraft((prev) =>
                      prev ? { ...prev, mockup: event.target.value as EditableCategory } : prev,
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
                <label htmlFor="edit-features">Détails (1 par ligne)</label>
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
            <button
              type="button"
              className="boutique-button boutique-button--primary"
              onClick={() => void handleSave()}
              disabled={isSaving}
            >
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
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
