import { useEffect, useMemo, useRef, useState } from "react"
import "./AdminProducts.css"
import "../Boutique/Boutique.css"
import placeholderProduct from "../../assets/kalina-wolf-dupe.webp"
import { publishCustomProduct } from "../Boutique/boutiqueStorage"
import type { BoutiqueProduct } from "../Boutique/boutiqueData"
import { uploadImage } from "../../services/media/api"
import { uploadDigitalProductFiles } from "../../services/boutique/api"
type MediaFile = { name: string; url: string; type: "image" | "video"; file?: File }

const mockCategories = ["Ebook", "Templates", "Carrousels", "Bundles"]
const CATEGORY_PLACEHOLDER = "Choisir une catégorie"
const MAX_IMAGES = 6

const AdminProductsPage = () => {
  const [images, setImages] = useState<MediaFile[]>([])
  const [video, setVideo] = useState<MediaFile | null>(null)
  const [category, setCategory] = useState("")
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [delivery, setDelivery] = useState("")
  const [processing, setProcessing] = useState("")
  const [returnsText, setReturnsText] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [digitalFiles, setDigitalFiles] = useState<File[]>([])
  const digitalFilesInputRef = useRef<HTMLInputElement | null>(null)
  const mediaInputRef = useRef<HTMLInputElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const pendingImageSlotRef = useRef<number | null>(null)
  const categoryMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file.url))
      if (video) URL.revokeObjectURL(video.url)
    }
  }, [images, video])

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!categoryMenuRef.current || !target) return
      if (!categoryMenuRef.current.contains(target)) {
        setIsCategoryMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])
  const addImages = (selected: FileList | File[] | null) => {
    if (!selected) return

    const nextFiles = Array.from(selected).filter((file) => file.type.startsWith("image/"))
    if (nextFiles.length === 0) return

    const enriched = nextFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: "image" as const,
      file,
    }))

    setImages((prev) => {
      const next = [...prev]
      const pending = pendingImageSlotRef.current
      if (pending !== null) {
        const file = enriched[0]
        const old = next[pending]
        if (old) URL.revokeObjectURL(old.url)
        next[pending] = file
        pendingImageSlotRef.current = null
        return next
      }

      for (const file of enriched) {
        if (next.length >= MAX_IMAGES) break
        next.push(file)
      }
      return next
    })
  }

  const setVideoFile = (selected: FileList | File[] | null) => {
    if (!selected || selected.length === 0) return
    const file = Array.from(selected).find((item) => item.type.startsWith("video/"))
    if (!file) return

    setVideo((prev) => {
      if (prev) URL.revokeObjectURL(prev.url)
      return { name: file.name, url: URL.createObjectURL(file), type: "video" }
    })
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addImages(event.target.files)
    event.target.value = ""
  }

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoFile(event.target.files)
    event.target.value = ""
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    addImages(files)
    setVideoFile(files)
    event.target.value = ""
  }

  const handleImageBrowse = (slotIndex?: number) => {
    pendingImageSlotRef.current = typeof slotIndex === "number" ? slotIndex : null
    imageInputRef.current?.click()
  }

  const handleMediaBrowse = (slotIndex?: number) => {
    pendingImageSlotRef.current = typeof slotIndex === "number" ? slotIndex : null
    mediaInputRef.current?.click()
  }

  const handleVideoBrowse = () => {
    videoInputRef.current?.click()
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev]
      const removed = next[index]
      if (removed) {
        URL.revokeObjectURL(removed.url)
        next.splice(index, 1)
      }
      return next
    })
  }

  const handleRemoveVideo = () => {
    if (video) {
      URL.revokeObjectURL(video.url)
    }
    setVideo(null)
  }

  const handleDigitalFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        /\.(pdf|zip)$/i.test(file.name),
    )
    setDigitalFiles(files)
    event.target.value = ""
  }

  const fileSummary = useMemo(() => {
    const imagesCount = images.length
    const videosCount = video ? 1 : 0
    if (imagesCount === 0 && videosCount === 0) return "Aucun fichier ajouté pour l'instant."
    return `${imagesCount} image(s) • ${videosCount} vidéo(s)`
  }, [images.length, video])

  const imageSlots = useMemo(() => {
    const slots: Array<MediaFile | null> = []
    for (let i = 0; i < MAX_IMAGES; i += 1) {
      slots.push(images[i] ?? null)
    }
    return slots
  }, [images])

  const digitalFilesSummary = useMemo(() => {
    if (digitalFiles.length === 0) {
      return "Aucun fichier choisi."
    }

    return digitalFiles.map((file) => file.name).join(" • ")
  }, [digitalFiles])

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

  const getMockupForCategory = (value: string): BoutiqueProduct["mockup"] => {
    if (value === "Templates") return "template"
    if (value === "Carrousels") return "carousel"
    if (value === "Bundles") return "bundle"
    return "ebook"
  }

  const getFormatForMockup = (mockup: BoutiqueProduct["mockup"]) => {
    switch (mockup) {
      case "template":
        return { format: "Canva - fichier éditable", formatLabel: "Canva" }
      case "carousel":
        return { format: "Canva - carrousel", formatLabel: "Canva" }
      case "bundle":
        return { format: "PDF + Canva", formatLabel: "Bundle" }
      default:
        return { format: "PDF - contenu digital", formatLabel: "PDF" }
    }
  }

  const normalizePrice = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return ""
    const numeric = trimmed.replace(",", ".")
    return /\d/.test(numeric) ? `${numeric}€` : trimmed
  }

  const resetForm = () => {
    images.forEach((file) => URL.revokeObjectURL(file.url))
    if (video) {
      URL.revokeObjectURL(video.url)
    }
    setImages([])
    setVideo(null)
    setCategory("")
    setTitle("")
    setDescription("")
    setPrice("")
    setStock("")
    setDelivery("")
    setProcessing("")
    setReturnsText("")
    setDigitalFiles([])
    if (digitalFilesInputRef.current) {
      digitalFilesInputRef.current.value = ""
    }
  }

  const handleSaveProduct = async () => {
    if (!title.trim()) {
      window.alert("Ajoute un titre pour enregistrer la fiche produit.")
      return
    }
    if (!price.trim()) {
      window.alert("Ajoute un prix pour enregistrer la fiche produit.")
      return
    }
    if (!category) {
      window.alert("Choisis une catégorie pour enregistrer la fiche produit.")
      return
    }
    if (digitalFiles.length === 0) {
      window.alert("Ajoute au moins un fichier numerique a livrer apres l'achat.")
      return
    }

    setSaveStatus("saving")
    const mockup = getMockupForCategory(category)
    const { format, formatLabel } = getFormatForMockup(mockup)
    const benefitBase = description.trim().split("\n").find(Boolean) ?? ""
    const benefit = benefitBase.length > 0 ? benefitBase.slice(0, 90) : "Nouvelle ressource à découvrir."
    const features = [delivery.trim(), processing.trim(), returnsText.trim()].filter(Boolean)
    const idBase = slugify(title) || "produit"
    const id = `${idBase}-${Date.now()}`

    try {
      let safeGallery: string[]
      if (images.length > 0) {
        const uploaded = await Promise.all(
          images.map((image, index) => {
            if (!image.file) {
              throw new Error("Image source introuvable. Rechoisis tes photos.")
            }
            return uploadImage(image.file, "boutique-product-image", `${id}-${index + 1}`)
          }),
        )
        safeGallery = uploaded.map((item) => item.url)
      } else {
        safeGallery = [placeholderProduct]
      }

      const uploadedDigitalFiles = await uploadDigitalProductFiles(digitalFiles, id)

      const product: BoutiqueProduct = {
        id,
        title: title.trim(),
        benefit,
        price: normalizePrice(price),
        format,
        formatLabel,
        badge: "",
        mockup,
        bestSeller: false,
        image: safeGallery[0],
        gallery: safeGallery,
        description: description.trim() || "Description à compléter.",
        features: features.length > 0 ? features : ["Ressource digitale", "Accès immédiat", "Usage commercial autorisé"],
        digitalFiles: uploadedDigitalFiles,
      }

      await publishCustomProduct(product)
      resetForm()
      setSaveStatus("saved")
      window.setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Save product error:", error)
      setSaveStatus("idle")
      window.alert(error instanceof Error ? error.message : "Impossible d'enregistrer la fiche produit pour le moment. Réessaie dans quelques instants.")
    }
  }

  const shouldShowDropzone = images.length === 0 && !video

  return (
    <div className="boutique-page admin-products-page">
      <header className="admin-products-hero">
        <div>
          <h1>Fiche produit</h1>
          <p>Créez une fiche complète pour l'afficher dans la boutique.</p>
        </div>
      </header>

      <div className="admin-products-grid">
        <section className="admin-products-panel">
          <header className="admin-products-panel__header">
            <div>
              <p>Photo et vidéo</p>
            </div>
            <p className="admin-products-helper">Ajoutez jusqu'à 6 photos et 1 vidéo.</p>
          </header>

          <input
            ref={mediaInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
            style={{ display: "none" }}
          />

          <div className="admin-products-previews" aria-label="Aperçu des médias">
            {imageSlots.map((file, index) => {
              if (!file) {
                return (
                  <button
                    key={`image-empty-${index}`}
                    type="button"
                    className="admin-products-preview admin-products-preview--empty"
                    onClick={() => handleMediaBrowse(index)}
                  >
                    <span>+ Photo</span>
                  </button>
                )
              }

              return (
                <button
                  key={file.url}
                  type="button"
                  className="admin-products-preview"
                  onClick={() => handleMediaBrowse(index)}
                >
                  <img src={file.url} alt={file.name} />
                  <button
                    type="button"
                    className="admin-products-preview__delete"
                    aria-label="Supprimer la photo"
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

            {video ? (
              <button type="button" className="admin-products-preview" onClick={() => handleMediaBrowse()}>
                <video src={video.url} muted playsInline />
                <span className="admin-products-preview__label">Vidéo</span>
                <button
                  type="button"
                  className="admin-products-preview__delete"
                  aria-label="Supprimer la vidéo"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleRemoveVideo()
                  }}
                >
                  🗑️
                </button>
              </button>
            ) : (
              <button
                type="button"
                className="admin-products-preview admin-products-preview--empty admin-products-preview--video"
                onClick={() => handleMediaBrowse()}
              >
                <span>+ Vidéo</span>
              </button>
            )}
          </div>

          {shouldShowDropzone ? (
            <label className="admin-products-dropzone">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} />
              <div className="admin-products-dropzone__content">
                <p>Cliquez-déposez les fichiers ou</p>
                <div className="admin-products-dropzone__actions">
                  <button type="button" className="boutique-button boutique-button--primary" onClick={() => handleImageBrowse()}>
                    Chargez les photos
                  </button>
                  <button type="button" className="boutique-button boutique-button--ghost" onClick={handleVideoBrowse}>
                    Chargez la vidéo
                  </button>
                </div>
                <span className="admin-products-dropzone__summary">{fileSummary}</span>
              </div>
            </label>
          ) : (
            <div className="admin-products-dropzone admin-products-dropzone--hidden" aria-hidden="true" />
          )}
        </section>

        <section className="admin-products-panel">
          <header className="admin-products-panel__header">
            <div>
              <p>Catégorie</p>
            </div>
            <p className="admin-products-helper">Choisissez la catégorie principale pour faciliter la recherche.</p>
          </header>

          <div className="admin-products-field">
            <label htmlFor="product-category">Catégorie</label>
            <div className="product-form__select" ref={categoryMenuRef}>
              <button
                type="button"
                id="product-category"
                className={category ? "product-form__select-trigger" : "product-form__select-trigger is-placeholder"}
                aria-haspopup="listbox"
                aria-expanded={isCategoryMenuOpen}
                onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
              >
                <span>{category || CATEGORY_PLACEHOLDER}</span>
                <svg className="product-form__select-chevron" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {isCategoryMenuOpen ? (
                <div className="product-form__select-menu" role="listbox">
                  {mockCategories.map((categoryItem) => (
                    <button
                      key={categoryItem}
                      type="button"
                      role="option"
                      aria-selected={category === categoryItem}
                      className={category === categoryItem ? "is-selected" : undefined}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        setCategory(categoryItem)
                        setIsCategoryMenuOpen(false)
                      }}
                    >
                      {categoryItem}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="admin-products-panel">
          <header className="admin-products-panel__header">
            <div>
              <p>Détails de l'article</p>
            </div>
            <p className="admin-products-helper">Expliquez clairement ce que l'acheteur va recevoir.</p>
          </header>

          <div className="admin-products-field">
            <label htmlFor="product-title">Titre</label>
            <input
              id="product-title"
              type="text"
              placeholder="Ex : Planner digital 2026"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="admin-products-field">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              rows={6}
              placeholder="Description détaillée du produit"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </section>

        <section className="admin-products-panel">
          <header className="admin-products-panel__header">
            <div>
              <p>Fichiers numériques</p>
            </div>
            <p className="admin-products-helper">Ajoutez les fichiers PDF ou ZIP qui seront livrés après l'achat.</p>
          </header>

          <div className="admin-products-field">
            <label htmlFor="product-digital-files">Ajouter un fichier</label>
            <label className="admin-products-digital-dropzone" htmlFor="product-digital-files">
              <input
                ref={digitalFilesInputRef}
                id="product-digital-files"
                type="file"
                accept=".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed"
                multiple
                onChange={handleDigitalFilesChange}
              />
              <span className="admin-products-digital-dropzone__text">
                Ajouter un fichier
              </span>
              <span className="admin-products-digital-dropzone__subtext">{digitalFilesSummary}</span>
            </label>
            {digitalFiles.length > 0 ? (
              <p className="admin-products-helper">{digitalFiles.length} fichier(s) sélectionné(s).</p>
            ) : null}
          </div>
        </section>

        <section className="admin-products-panel">
          <header className="admin-products-panel__header">
            <div>
              <p>Prix et stock</p>
            </div>
            <p className="admin-products-helper">Définissez le prix et la disponibilité.</p>
          </header>

          <div className="admin-products-field admin-products-field--inline">
            <div>
              <label htmlFor="product-price">Prix</label>
              <input
                id="product-price"
                type="number"
                placeholder="19.90"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="product-stock">Stock</label>
              <input
                id="product-stock"
                type="number"
                placeholder="999"
                min="0"
                step="1"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="admin-products-panel">
          <header className="admin-products-panel__header">
            <div>
              <p>Livraison, traitement et retours</p>
            </div>
            <p className="admin-products-helper">Précisez les délais et la politique de retour.</p>
          </header>

          <div className="admin-products-field">
            <label htmlFor="product-delivery">Livraison</label>
            <input
              id="product-delivery"
              type="text"
              placeholder="Téléchargement immédiat après achat"
              value={delivery}
              onChange={(event) => setDelivery(event.target.value)}
            />
          </div>
          <div className="admin-products-field">
            <label htmlFor="product-processing">Traitement</label>
            <input
              id="product-processing"
              type="text"
              placeholder="Aucun délai de préparation"
              value={processing}
              onChange={(event) => setProcessing(event.target.value)}
            />
          </div>
          <div className="admin-products-field">
            <label htmlFor="product-returns">Retours</label>
            <input
              id="product-returns"
              type="text"
              placeholder="Pas de retours pour les produits digitaux"
              value={returnsText}
              onChange={(event) => setReturnsText(event.target.value)}
            />
          </div>
        </section>

        <section className="admin-products-panel admin-products-panel--actions">
          <button type="button" className="boutique-button boutique-button--ghost">
            Prévisualiser
          </button>
          <button
            type="button"
            className="boutique-button boutique-button--primary"
            onClick={() => void handleSaveProduct()}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving" ? "Enregistrement..." : saveStatus === "saved" ? "Publié" : "Publier"}
          </button>
          <button type="button" className="boutique-button boutique-button--ghost">
            Brouillon
          </button>
        </section>
      </div>
    </div>
  )
}

export default AdminProductsPage
