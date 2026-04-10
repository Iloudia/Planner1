import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react"
import { createPortal } from "react-dom"
import MediaImage from "../../components/MediaImage"
import PageHeading from "../../components/PageHeading"
import { useAuth } from "../../context/AuthContext"
import useUserWishlist from "../../hooks/useUserWishlist"
import { deleteMedia, uploadImage } from "../../services/media/api"
import type { WishlistCategoryRecord, WishlistItemRecord } from "../../types/personalization"
import wishlistHair from "../../assets/ruby--dupe.webp"
import wishlistOutfit from "../../assets/emma-masur-dupe.webp"
import wishlistMakeup from "../../assets/makeup.webp"
import wishlistElectronics from "../../assets/ebony-forsyth-dupe.webp"
import wishlistSkincare from "../../assets/margaux-martinez-dupe.webp"
import wishlistBooks from "../../assets/madeline- edwards-dupe.webp"
import wishlistRoom from "../../assets/rowena-regterschot-dupe.webp"
import wishlistTravel from "../../assets/voyage.webp"
import wishlistJewelry from "../../assets/lauren-lista-dupe.webp"
import wishlistBag from "../../assets/frances-leynes-dupe.webp"
import "./Wishlist.css"

type WishlistCategoryId = string

type CategoryDefinition = {
  id: WishlistCategoryId
  label: string
  accent: string
  cover: string
  blurb: string
}

type CategoryCard = WishlistCategoryRecord & {
  cover: string
  items: WishlistItemRecord[]
}

type CategoryDraft = {
  title: string
  blurb: string
  accent: string
  note: string
}

type NewCategoryDraft = {
  title: string
  accent: string
}

type ItemDraft = {
  categoryId: string
  title: string
  subtitle: string
  link: string
  subcategory: string
}

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { id: "hair", label: "Cheveux", accent: "#f497c0", cover: wishlistHair, blurb: "Brushes, soins et petits accessoires pour une routine cheveux complète." },
  { id: "outfits", label: "Vêtements", accent: "#fcd67d", cover: wishlistOutfit, blurb: "Idées tenues et pièces coup de cœur pour tes looks préférés." },
  { id: "makeup", label: "Makeup", accent: "#fbcada", cover: wishlistMakeup, blurb: "Palettes, gloss ou nouveaux blushs à tester absolument." },
  { id: "electronics", label: "Électronique", accent: "#c9d9ff", cover: wishlistElectronics, blurb: "Gadgets tech, accessoires photo ou outils de productivité." },
  { id: "skincare", label: "Skincare", accent: "#c1e7db", cover: wishlistSkincare, blurb: "Soins cocooning, masques favoris et indispensables glow." },
  { id: "books", label: "Livres", accent: "#b4cfff", cover: wishlistBooks, blurb: "Romans, développement perso et lectures inspirées." },
  { id: "room", label: "Chambre", accent: "#d9c5ff", cover: wishlistRoom, blurb: "Déco, ambiance et petits objets cozy pour ta chambre." },
  { id: "travel", label: "Voyages", accent: "#f6b094", cover: wishlistTravel, blurb: "Destinations ou expériences à ajouter à ta bucket list." },
  { id: "jewelry", label: "Bijoux", accent: "#ffd4a8", cover: wishlistJewelry, blurb: "Bagues, colliers et accessoires brillants à collectionner." },
  { id: "bag", label: "Sac", accent: "#f3b4c5", cover: wishlistBag, blurb: "Sacs tendance et intemporels pour toutes les occasions." },
]

const CUSTOM_ACCENTS = ["#e3d7ca", "#c3d9ff", "#ffe3a7", "#c6eed7", "#e3d7ca", "#d9c5ff"] as const
const CUSTOM_COVER_POOL = [
  wishlistHair,
  wishlistOutfit,
  wishlistMakeup,
  wishlistElectronics,
  wishlistSkincare,
  wishlistBooks,
  wishlistRoom,
  wishlistTravel,
  wishlistJewelry,
  wishlistBag,
] as const

const emptyNewCategoryDraft = (): NewCategoryDraft => ({
  title: "",
  accent: CUSTOM_ACCENTS[0] ?? "#e3d7ca",
})

const emptyItemDraft = (categoryId = ""): ItemDraft => ({
  categoryId,
  title: "",
  subtitle: "",
  link: "",
  subcategory: "",
})

const normalizeLink = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ""
  try {
    return new URL(trimmed).href
  } catch {
    try {
      return new URL(`https://${trimmed}`).href
    } catch {
      return ""
    }
  }
}

const hashString = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

const fallbackCoverForId = (id: string) => CUSTOM_COVER_POOL[hashString(`${id}-cover`) % CUSTOM_COVER_POOL.length] ?? CUSTOM_COVER_POOL[0]

const fallbackAccentForId = (id: string) => CUSTOM_ACCENTS[hashString(id) % CUSTOM_ACCENTS.length] ?? CUSTOM_ACCENTS[0]

const getCategoryDefinition = (id: string) => CATEGORY_DEFINITIONS.find((category) => category.id === id)

const buildCategoryDraft = (category: CategoryCard): CategoryDraft => ({
  title: category.title,
  blurb: category.blurb,
  accent: category.accent,
  note: category.note ?? "",
})

const groupItems = (items: WishlistItemRecord[]) => {
  const groups = new Map<string, WishlistItemRecord[]>()
  items.forEach((item) => {
    const key = item.subcategory?.trim() || "__uncategorized"
    const current = groups.get(key)
    if (current) {
      current.push(item)
    } else {
      groups.set(key, [item])
    }
  })
  return Array.from(groups.entries()).map(([key, grouped]) => ({
    key,
    label: key === "__uncategorized" ? "Sans catégorie" : key,
    items: grouped,
  }))
}

const WishlistPage = () => {
  const { isAuthReady, userId } = useAuth()
  const {
    categories,
    items,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    activateCategory,
    saveCategoryNote,
    toggleCategoryFavorite,
    createItem,
    updateItem,
    deleteItem,
    toggleItemDone,
    moveItem,
  } = useUserWishlist()
  const canEdit = Boolean(userId)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newCategoryDraft, setNewCategoryDraft] = useState<NewCategoryDraft>(emptyNewCategoryDraft())
  const [newCategoryCoverPreview, setNewCategoryCoverPreview] = useState("")
  const [newCategoryCoverFile, setNewCategoryCoverFile] = useState<File | null>(null)
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft | null>(null)
  const [categoryCoverPreview, setCategoryCoverPreview] = useState("")
  const [categoryCoverFile, setCategoryCoverFile] = useState<File | null>(null)
  const [useDefaultCover, setUseDefaultCover] = useState(false)
  const [itemDraft, setItemDraft] = useState<ItemDraft>(emptyItemDraft())
  const [itemPreview, setItemPreview] = useState("")
  const [itemImageFile, setItemImageFile] = useState<File | null>(null)
  const [removeItemImage, setRemoveItemImage] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isItemComposerOpen, setIsItemComposerOpen] = useState(false)
  const [isMemoComposerOpen, setIsMemoComposerOpen] = useState(false)
  const [isCategorySuggestionsOpen, setIsCategorySuggestionsOpen] = useState(false)
  const [openWishlistGroups, setOpenWishlistGroups] = useState<string[]>([])
  const [activeItemMenuId, setActiveItemMenuId] = useState<string | null>(null)
  const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null)
  const [activeCardMenuPopoverStyle, setActiveCardMenuPopoverStyle] = useState<CSSProperties>({})
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [moveItemDraft, setMoveItemDraft] = useState<{ itemId: string; targetCategoryId: string; targetSubcategory: string } | null>(null)
  const newCategoryCoverRef = useRef<HTMLInputElement | null>(null)
  const categoryCoverRef = useRef<HTMLInputElement | null>(null)
  const itemImageRef = useRef<HTMLInputElement | null>(null)
  const categoryFieldRef = useRef<HTMLDivElement | null>(null)
  const itemMenuRef = useRef<HTMLDivElement | null>(null)
  const activeCardMenuPopoverRef = useRef<HTMLDivElement | null>(null)
  const cardMenuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    document.body.classList.add("wishlist-page--lux")
    return () => {
      document.body.classList.remove("wishlist-page--lux")
    }
  }, [])

  const categoryCards = useMemo<CategoryCard[]>(() => {
    const categoryMap = new Map(categories.map((category) => [category.id, category]))
    const cards = categories.map((category) => {
      const definition = getCategoryDefinition(category.id)
      return {
        ...category,
        cover: category.customCoverUrl || definition?.cover || fallbackCoverForId(category.id),
        items: items
          .filter((item) => item.categoryId === category.id)
          .sort((left, right) => (right.sortOrder ?? 0) - (left.sortOrder ?? 0)),
      }
    })

    CATEGORY_DEFINITIONS.forEach((definition, index) => {
      if (categoryMap.has(definition.id)) return
      cards.push({
        id: definition.id,
        title: definition.label,
        blurb: definition.blurb,
        accent: definition.accent,
        note: "",
        isFavorite: false,
        isBase: true,
        coverMode: "default",
        order: index,
        usageCount: 0,
        lastUsedAt: 0,
        definitionVersion: 6,
        cover: definition.cover,
        items: [],
      })
    })

    return cards.sort((left, right) => {
      const usageLeft = (left.usageCount ?? 0) >= 3 ? left.usageCount ?? 0 : 0
      const usageRight = (right.usageCount ?? 0) >= 3 ? right.usageCount ?? 0 : 0
      if (usageRight !== usageLeft) {
        return usageRight - usageLeft
      }
      return (left.order ?? 0) - (right.order ?? 0)
    })
  }, [categories, items])

  const selectedCategory = useMemo(
    () => categoryCards.find((category) => category.id === selectedCategoryId) ?? null,
    [categoryCards, selectedCategoryId],
  )

  const groupedItems = useMemo(() => groupItems(selectedCategory?.items ?? []), [selectedCategory?.items])
  const categorySuggestions = useMemo(
    () =>
      Array.from(
        new Set(
          (selectedCategory?.items ?? [])
            .map((item) => item.subcategory?.trim() ?? "")
            .filter(Boolean),
        ),
      ),
    [selectedCategory?.items],
  )
  const visibleCategorySuggestions = useMemo(() => {
    const query = itemDraft.subcategory.trim().toLowerCase()
    if (!query) return categorySuggestions
    return categorySuggestions.filter((suggestion) => suggestion.toLowerCase().includes(query))
  }, [categorySuggestions, itemDraft.subcategory])

  useEffect(() => {
    if (!selectedCategoryId || categoryCards.some((category) => category.id === selectedCategoryId)) {
      return
    }
    setSelectedCategoryId(null)
  }, [categoryCards, selectedCategoryId])

  useEffect(() => {
    if (!selectedCategory) {
      setCategoryDraft(null)
      setCategoryCoverPreview("")
      setCategoryCoverFile(null)
      setUseDefaultCover(false)
      setItemDraft(emptyItemDraft())
      setItemPreview("")
      setItemImageFile(null)
      setRemoveItemImage(false)
      setEditingItemId(null)
      setIsCategorySuggestionsOpen(false)
      setOpenWishlistGroups([])
      setActiveItemMenuId(null)
      setMoveItemDraft(null)
      return
    }
    setCategoryDraft(buildCategoryDraft(selectedCategory))
    setCategoryCoverPreview(selectedCategory.cover)
    setCategoryCoverFile(null)
    setUseDefaultCover(false)
    setItemDraft(emptyItemDraft(selectedCategory.id))
    setItemPreview("")
    setItemImageFile(null)
    setRemoveItemImage(false)
    setEditingItemId(null)
    setIsItemComposerOpen(false)
    setIsMemoComposerOpen(false)
    setIsCategorySuggestionsOpen(false)
    setOpenWishlistGroups([])
    setActiveItemMenuId(null)
    setMoveItemDraft(null)
  }, [selectedCategory])

  useEffect(() => {
    if (!isCategorySuggestionsOpen && !activeItemMenuId && !activeCardMenuId) return
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!categoryFieldRef.current?.contains(target)) {
        setIsCategorySuggestionsOpen(false)
      }
      if (!target.closest(".wishlist-item__menu")) {
        setActiveItemMenuId(null)
      }
      if (!target.closest(".wishlist-card__menu-wrap") && !target.closest(".wishlist-card__menu-popover")) {
        setActiveCardMenuId(null)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
    }
  }, [activeCardMenuId, activeItemMenuId, isCategorySuggestionsOpen])

  useEffect(() => {
    if (!activeCardMenuId) {
      setActiveCardMenuPopoverStyle({})
      return
    }

    const updateActiveCardMenuPopoverPosition = () => {
      const trigger = cardMenuButtonRefs.current[activeCardMenuId]
      const popover = activeCardMenuPopoverRef.current
      if (!trigger || !popover) return

      const triggerRect = trigger.getBoundingClientRect()
      const popoverRect = popover.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const viewportMargin = 12
      const gap = 8

      let left = triggerRect.right - popoverRect.width
      left = Math.min(Math.max(left, viewportMargin), viewportWidth - popoverRect.width - viewportMargin)

      let top = triggerRect.bottom + gap
      if (top + popoverRect.height > viewportHeight - viewportMargin) {
        top = Math.max(viewportMargin, triggerRect.top - popoverRect.height - gap)
      }

      setActiveCardMenuPopoverStyle({
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
      })
    }

    const frame = window.requestAnimationFrame(updateActiveCardMenuPopoverPosition)
    window.addEventListener("resize", updateActiveCardMenuPopoverPosition)
    window.addEventListener("scroll", updateActiveCardMenuPopoverPosition, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("resize", updateActiveCardMenuPopoverPosition)
      window.removeEventListener("scroll", updateActiveCardMenuPopoverPosition, true)
    }
  }, [activeCardMenuId])

  const handlePreviewFile = (file: File | null, onPreview: (value: string) => void, onFile: (value: File | null) => void) => {
    onFile(file)
    if (!file) {
      onPreview("")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      onPreview(typeof reader.result === "string" ? reader.result : "")
    }
    reader.readAsDataURL(file)
  }

  const handleOpenCategory = async (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    if (canEdit) {
      await activateCategory(categoryId)
    }
  }

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canEdit) return
    const title = newCategoryDraft.title.trim()
    if (!title) return
    const editingCategory = editingCategoryId ? categoryCards.find((category) => category.id === editingCategoryId) ?? null : null

    if (editingCategory) {
      let customCoverUrl = editingCategory.customCoverUrl
      let customCoverPath = editingCategory.customCoverPath
      if (newCategoryCoverFile) {
        const uploaded = await uploadImage(newCategoryCoverFile, "wishlist-category-cover", editingCategory.id)
        customCoverUrl = uploaded.url
        customCoverPath = uploaded.path
        if (editingCategory.customCoverPath && editingCategory.customCoverPath !== uploaded.path) {
          void deleteMedia(editingCategory.customCoverPath).catch(() => undefined)
        }
      }
      await updateCategory(editingCategory.id, {
        title,
        accent: newCategoryDraft.accent.trim() || editingCategory.accent,
        coverMode: customCoverUrl ? "custom" : "default",
        customCoverUrl,
        customCoverPath,
      })
      setShowCreateCategory(false)
      setEditingCategoryId(null)
      setNewCategoryDraft(emptyNewCategoryDraft())
      setNewCategoryCoverPreview("")
      setNewCategoryCoverFile(null)
      if (newCategoryCoverRef.current) {
        newCategoryCoverRef.current.value = ""
      }
      return
    }

    let customCoverUrl: string | undefined
    let customCoverPath: string | undefined
    if (newCategoryCoverFile) {
      const uploaded = await uploadImage(newCategoryCoverFile, "wishlist-category-cover", title)
      customCoverUrl = uploaded.url
      customCoverPath = uploaded.path
    }
    const categoryId = await createCategory({
      title,
      blurb: "Ta catégorie personnalisée.",
      accent: newCategoryDraft.accent.trim() || fallbackAccentForId(title),
      customCoverUrl,
      customCoverPath,
    })
    setShowCreateCategory(false)
    setEditingCategoryId(null)
    setNewCategoryDraft(emptyNewCategoryDraft())
    setNewCategoryCoverPreview("")
    setNewCategoryCoverFile(null)
    if (newCategoryCoverRef.current) {
      newCategoryCoverRef.current.value = ""
    }
    if (categoryId) {
      setSelectedCategoryId(categoryId)
    }
  }

  const handleSaveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCategory || !categoryDraft || !canEdit) return
    let customCoverUrl = selectedCategory.customCoverUrl
    let customCoverPath = selectedCategory.customCoverPath
    if (categoryCoverFile) {
      const uploaded = await uploadImage(categoryCoverFile, "wishlist-category-cover", selectedCategory.id)
      customCoverUrl = uploaded.url
      customCoverPath = uploaded.path
      if (selectedCategory.customCoverPath && selectedCategory.customCoverPath !== uploaded.path) {
        void deleteMedia(selectedCategory.customCoverPath).catch(() => undefined)
      }
    } else if (useDefaultCover) {
      customCoverUrl = undefined
      customCoverPath = undefined
      if (selectedCategory.customCoverPath) {
        void deleteMedia(selectedCategory.customCoverPath).catch(() => undefined)
      }
    }

    await updateCategory(selectedCategory.id, {
      title: categoryDraft.title.trim() || selectedCategory.title,
      blurb: categoryDraft.blurb.trim() || selectedCategory.blurb,
      accent: categoryDraft.accent.trim() || selectedCategory.accent,
      coverMode: customCoverUrl ? "custom" : "default",
      customCoverUrl,
      customCoverPath,
    })
    await saveCategoryNote(selectedCategory.id, categoryDraft.note)
    setCategoryCoverFile(null)
    setUseDefaultCover(false)
  }

  const handleStartEditItem = (item: WishlistItemRecord) => {
    setEditingItemId(item.id)
    setIsItemComposerOpen(true)
    setItemDraft({
      categoryId: item.categoryId,
      title: item.title,
      subtitle: item.subtitle ?? "",
      link: item.link ?? "",
      subcategory: item.subcategory ?? "",
    })
    setItemPreview(item.imageUrl ?? "")
    setItemImageFile(null)
    setRemoveItemImage(false)
    setIsCategorySuggestionsOpen(false)
    setActiveItemMenuId(null)
  }

  const handleStartEditCategory = (category: CategoryCard) => {
    setEditingCategoryId(category.id)
    setNewCategoryDraft({
      title: category.title,
      accent: category.accent,
    })
    setNewCategoryCoverPreview(category.cover)
    setNewCategoryCoverFile(null)
    if (newCategoryCoverRef.current) {
      newCategoryCoverRef.current.value = ""
    }
    setShowCreateCategory(true)
    setActiveCardMenuId(null)
  }

  const handleDeleteCategoryCard = async (category: CategoryCard) => {
    if (!canEdit) return
    if (category.customCoverPath) {
      void deleteMedia(category.customCoverPath).catch(() => undefined)
    }
    await deleteCategory(category.id)
    setActiveCardMenuId(null)
    if (selectedCategoryId === category.id) {
      setSelectedCategoryId(category.isBase ? category.id : null)
    }
  }

  const handleSubmitItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCategory || !canEdit) return
    const title = itemDraft.title.trim()
    if (!title) return
    const normalizedLink = itemDraft.link.trim() ? normalizeLink(itemDraft.link) : ""
    if (itemDraft.link.trim() && !normalizedLink) {
      window.alert("Ajoute un lien valide avant d'enregistrer cet élément.")
      return
    }

    const currentItem = editingItemId ? items.find((item) => item.id === editingItemId) : undefined
    let imageUrl: string | undefined
    let imagePath: string | undefined

    if (itemImageFile) {
      const uploaded = await uploadImage(itemImageFile, "wishlist-item-image", editingItemId || title)
      imageUrl = uploaded.url
      imagePath = uploaded.path
      if (currentItem?.imagePath && currentItem.imagePath !== uploaded.path) {
        void deleteMedia(currentItem.imagePath).catch(() => undefined)
      }
    } else if (editingItemId && !removeItemImage) {
      imageUrl = currentItem?.imageUrl
      imagePath = currentItem?.imagePath
    } else if (editingItemId && removeItemImage && currentItem?.imagePath) {
      void deleteMedia(currentItem.imagePath).catch(() => undefined)
    }

    const payload = {
      categoryId: selectedCategory.id,
      title,
      subtitle: itemDraft.subtitle.trim() || undefined,
      imageUrl,
      imagePath,
      imageName: itemImageFile?.name,
      link: normalizedLink || undefined,
      subcategory: itemDraft.subcategory.trim() || undefined,
    }

    if (editingItemId) {
      await updateItem(editingItemId, payload)
      if (payload.categoryId !== selectedCategory.id) {
        setSelectedCategoryId(payload.categoryId)
      }
    } else {
      await createItem(payload)
    }

    setEditingItemId(null)
    setIsItemComposerOpen(false)
    setItemDraft(emptyItemDraft(selectedCategory.id))
    setItemPreview("")
    setItemImageFile(null)
    setRemoveItemImage(false)
    setIsCategorySuggestionsOpen(false)
    setActiveItemMenuId(null)
    if (itemImageRef.current) {
      itemImageRef.current.value = ""
    }
  }

  const handleSaveMemo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCategory || !categoryDraft || !canEdit) return
    await saveCategoryNote(selectedCategory.id, categoryDraft.note)
    setIsMemoComposerOpen(false)
  }

  const handleDeleteSelectedCategory = async () => {
    if (!selectedCategory || !canEdit) return
    if (selectedCategory.customCoverPath) {
      void deleteMedia(selectedCategory.customCoverPath).catch(() => undefined)
    }
    await deleteCategory(selectedCategory.id)
    setSelectedCategoryId(selectedCategory.isBase ? selectedCategory.id : null)
  }

  const handleDeleteItem = async (item: WishlistItemRecord) => {
    if (!canEdit) return
    if (item.imagePath) {
      void deleteMedia(item.imagePath).catch(() => undefined)
    }
    await deleteItem(item.id)
    setActiveItemMenuId(null)
    if (moveItemDraft?.itemId === item.id) {
      setMoveItemDraft(null)
    }
  }

  const toggleWishlistGroup = (groupKey: string) => {
    setOpenWishlistGroups((previous) => (previous.includes(groupKey) ? previous.filter((key) => key !== groupKey) : [...previous, groupKey]))
  }

  const handleStartMoveItem = (item: WishlistItemRecord) => {
    const targetCategory = categoryCards.find((category) => category.id !== item.categoryId) ?? null
    if (!targetCategory) return
    setMoveItemDraft({
      itemId: item.id,
      targetCategoryId: targetCategory.id,
      targetSubcategory: "",
    })
    setActiveItemMenuId(null)
  }

  const handleConfirmMoveItem = async () => {
    if (!moveItemDraft) return
    await moveItem(moveItemDraft.itemId, moveItemDraft.targetCategoryId, moveItemDraft.targetSubcategory)
    setMoveItemDraft(null)
  }

  const isWishlistLoading = !isAuthReady || isLoading

  if (isWishlistLoading) {
    return (
      <div className="wishlist-page wishlist-page--loading" aria-busy="true" aria-live="polite">
        <span className="wishlist-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <PageHeading eyebrow="Envie" title="Wishlist" />
      {!canEdit ? <p className="routine-note__composer-hint">Connecte-toi pour enregistrer ta wishlist.</p> : null}
      {error ? <p className="routine-note__composer-hint">{error}</p> : null}

      <div className="wishlist-heading-row">
        <button
          type="button"
          className="wishlist-heading-row__button"
          onClick={() => {
            setEditingCategoryId(null)
            setNewCategoryDraft(emptyNewCategoryDraft())
            setNewCategoryCoverPreview("")
            setNewCategoryCoverFile(null)
            setShowCreateCategory((previous) => !previous)
          }}
          disabled={!canEdit}
        >
          Nouvelle catégorie
        </button>
      </div>

      {showCreateCategory ? (
        <>
          <div className="wishlist-create__backdrop" onClick={() => setShowCreateCategory(false)} />
          <div className="wishlist-create__dialog" onClick={() => setShowCreateCategory(false)}>
            <form
              className="wishlist-create"
              onSubmit={handleCreateCategory}
              onClick={(event) => event.stopPropagation()}
            >
              <h2>{editingCategoryId ? "Modifier la catégorie" : "Créer une catégorie"}</h2>
              <label className="wishlist-create__title-field">
                <p>Titre</p>
                <input
                  type="text"
                  className="wishlist-create__title-input"
                  value={newCategoryDraft.title}
                  onChange={(event) => setNewCategoryDraft((previous) => ({ ...previous, title: event.target.value }))}
                  disabled={!canEdit}
                />
              </label>
              <div className="wishlist-create__cover-field">
                <p className="wishlist-create__cover-label">Image de couverture</p>
                <div className={`wishlist-create__cover-preview-panel${newCategoryCoverPreview ? " wishlist-create__cover-preview-panel--has-image" : ""}`}>
                  {newCategoryCoverPreview ? (
                    <MediaImage
                      className="wishlist-create__cover-preview"
                      src={newCategoryCoverPreview}
                      alt="Aperçu de la photo sélectionnée"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div className="wishlist-create__cover-actions">
                    {!newCategoryCoverPreview ? (
                      <label>
                        <input
                          className="wishlist-create__cover-input"
                          ref={newCategoryCoverRef}
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            handlePreviewFile(event.target.files?.[0] ?? null, setNewCategoryCoverPreview, setNewCategoryCoverFile)
                            event.target.value = ""
                          }}
                          disabled={!canEdit}
                        />
                        Choisir une photo
                      </label>
                    ) : null}
                    {newCategoryCoverPreview ? (
                      <button
                        type="button"
                        onClick={() => {
                          setNewCategoryCoverPreview("")
                          setNewCategoryCoverFile(null)
                        }}
                        disabled={!canEdit}
                      >
                        Retirer
                      </button>
                    ) : null}
                  </div>
                  <span className="wishlist-create__cover-hint">Formats d'image acceptés (JPG, PNG, GIF).</span>
                </div>
              </div>
              <div className="wishlist-create__actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateCategory(false)
                    setEditingCategoryId(null)
                  }}
                >
                  Annuler
                </button>
                <button type="submit" disabled={!canEdit}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </>
      ) : null}

      <section className="wishlist-grid">
        {categoryCards.map((category) => (
          <button
            key={category.id}
            type="button"
            className="wishlist-card"
            onClick={() => void handleOpenCategory(category.id)}
          >
            {canEdit ? (
              <div className="wishlist-card__menu-wrap">
                <button
                  type="button"
                  className="profile-menu wishlist-card__menu"
                  ref={(node) => {
                    cardMenuButtonRefs.current[category.id] = node
                  }}
                  aria-label="Ouvrir le menu de la catégorie"
                  onClick={(event) => {
                    event.stopPropagation()
                    setActiveCardMenuId((previous) => (previous === category.id ? null : category.id))
                  }}
                >
                  <span aria-hidden="true">...</span>
                </button>
                {activeCardMenuId === category.id ? (
                  createPortal(
                    <div
                      ref={activeCardMenuPopoverRef}
                      className="wishlist-card__menu-popover wishlist-card__menu-popover--floating"
                      style={activeCardMenuPopoverStyle}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleStartEditCategory(category)
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          void handleDeleteCategoryCard(category)
                        }}
                      >
                        Supprimer
                      </button>
                    </div>,
                    document.body,
                  )
                ) : null}
              </div>
            ) : null}
            <MediaImage className="wishlist-card__cover" src={category.cover} alt={category.title} loading="lazy" decoding="async" />
            <div className="wishlist-card__content">
              <strong>{category.title}</strong>
              <span>{category.items.length} élément(s)</span>
            </div>
          </button>
        ))}
      </section>

      {selectedCategory ? (
        <>
          <div className="wishlist-modal__backdrop" onClick={() => setSelectedCategoryId(null)} />
          <section className="wishlist-modal" role="dialog" aria-label={selectedCategory.title}>
            <div className="wishlist-modal__cover">
              <button type="button" className="modal__close wishlist-modal__close" onClick={() => setSelectedCategoryId(null)} aria-label="Fermer">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6L18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <MediaImage src={categoryCoverPreview || selectedCategory.cover} alt={selectedCategory.title} loading="lazy" decoding="async" />
            </div>
            <div className="wishlist-modal__body">
              <header className="wishlist-modal__header">
                <div>
                  <h2>{selectedCategory.title}</h2>
                </div>
                <span className="wishlist-modal__badge">{selectedCategory.items.length} élément(s)</span>
              </header>

              {!moveItemDraft && isMemoComposerOpen && categoryDraft ? (
                <form className="wishlist-modal__note" onSubmit={handleSaveMemo}>
                  <div className="wishlist-note__header">
                    <span className="wishlist-memo-label">
                      <svg className="wishlist-memo-label__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M7 18.5H6.75C5.50736 18.5 4.5 17.4926 4.5 16.25V7.75C4.5 6.50736 5.50736 5.5 6.75 5.5H17.25C18.4926 5.5 19.5 6.50736 19.5 7.75V16.25C19.5 17.4926 18.4926 18.5 17.25 18.5H11.5L8.25 21V18.5H7Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Mémo
                    </span>
                  </div>
                  <label>
                    Ajoute une note
                    <textarea
                      rows={4}
                      value={categoryDraft.note}
                      onChange={(event) => setCategoryDraft((previous) => (previous ? { ...previous, note: event.target.value } : previous))}
                      disabled={!canEdit}
                    />
                  </label>
                  <div className="wishlist-modal__note-actions">
                    <button type="button" onClick={() => setIsMemoComposerOpen(false)}>
                      Annuler
                    </button>
                    <button type="submit" disabled={!canEdit}>
                      Enregistrer
                    </button>
                  </div>
                </form>
              ) : !moveItemDraft && categoryDraft?.note ? (
                <div className="wishlist-modal__note-display">
                  <strong>Mémo</strong>
                  <p>{categoryDraft.note}</p>
                </div>
              ) : null}

              {!moveItemDraft && (isItemComposerOpen || Boolean(editingItemId)) ? (
              <form className="wishlist-modal__form" onSubmit={handleSubmitItem}>
                <h3>{editingItemId ? "Modifier un élément" : "Ajouter un élément"}</h3>
                <div className="wishlist-modal__form-top">
                  <div className="wishlist-modal__form-photo">
                    <label className={`wishlist-modal__photo-slot${itemPreview ? " wishlist-modal__photo-slot--filled" : ""}`}>
                      <input
                        ref={itemImageRef}
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          setRemoveItemImage(false)
                          handlePreviewFile(event.target.files?.[0] ?? null, setItemPreview, setItemImageFile)
                        }}
                        disabled={!canEdit}
                      />
                      {itemPreview ? (
                        <MediaImage className="wishlist-modal__photo-preview" src={itemPreview} alt="Aperçu élément" />
                      ) : (
                        <span>Ajouter une photo</span>
                      )}
                    </label>
                    {itemPreview ? (
                      <button
                        type="button"
                        className="wishlist-modal__photo-remove"
                        onClick={() => {
                          setItemPreview("")
                          setItemImageFile(null)
                          setRemoveItemImage(true)
                          if (itemImageRef.current) {
                            itemImageRef.current.value = ""
                          }
                        }}
                        disabled={!canEdit}
                      >
                        Retirer l'image
                      </button>
                    ) : null}
                  </div>
                  <div className="wishlist-modal__form-main">
                    <label className="wishlist-modal__title-field">
                      Titre
                      <input
                        type="text"
                        className="wishlist-modal__title-input"
                        placeholder="Ex : Brosse pour les cheveux"
                        value={itemDraft.title}
                        onChange={(event) => setItemDraft((previous) => ({ ...previous, title: event.target.value }))}
                        disabled={!canEdit}
                      />
                    </label>
                    <label className="wishlist-modal__subtitle-field">
                      Sous-titre
                      <input
                        type="text"
                        className="wishlist-modal__subtitle-input"
                        placeholder="Ex : Prix, couleur "
                        value={itemDraft.subtitle}
                        onChange={(event) => setItemDraft((previous) => ({ ...previous, subtitle: event.target.value }))}
                        disabled={!canEdit}
                      />
                    </label>
                  </div>
                </div>
                <label>
                  Lien
                  <input
                    type="text"
                    placeholder="Ex : https://www.sephora.fr/produit/..."
                    value={itemDraft.link}
                    onChange={(event) => setItemDraft((previous) => ({ ...previous, link: event.target.value }))}
                    disabled={!canEdit}
                  />
                </label>
                <label ref={categoryFieldRef} className="wishlist-modal__category-group">
                  Catégorie
                  <input
                    type="text"
                    className="wishlist-modal__category-input wishlist-modal__category-field"
                    placeholder="Ex : Cheveux, Makeup, Skincare, Bijoux"
                    value={itemDraft.subcategory}
                    onFocus={() => setIsCategorySuggestionsOpen(true)}
                    onClick={() => setIsCategorySuggestionsOpen(true)}
                    onChange={(event) => {
                      setItemDraft((previous) => ({ ...previous, subcategory: event.target.value }))
                      setIsCategorySuggestionsOpen(true)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setIsCategorySuggestionsOpen(false)
                      }
                    }}
                    disabled={!canEdit}
                  />
                  {isCategorySuggestionsOpen && visibleCategorySuggestions.length > 0 ? (
                    <div className="wishlist-modal__category-popover">
                      {visibleCategorySuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          className="wishlist-modal__category-option"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            setItemDraft((previous) => ({ ...previous, subcategory: suggestion }))
                            setIsCategorySuggestionsOpen(false)
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </label>
                <div className="wishlist-modal__form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItemId(null)
                      setIsItemComposerOpen(false)
                      setItemDraft(emptyItemDraft(selectedCategory.id))
                      setItemPreview("")
                      setItemImageFile(null)
                      setRemoveItemImage(false)
                      setIsCategorySuggestionsOpen(false)
                      if (itemImageRef.current) {
                        itemImageRef.current.value = ""
                      }
                    }}
                  >
                    Annuler
                  </button>
                  <button type="submit" disabled={!canEdit}>
                    Enregistrer
                  </button>
                </div>
              </form>
              ) : null}

              {!moveItemDraft && !(isItemComposerOpen || Boolean(editingItemId)) ? (
                <div className="wishlist-modal__list">
                  {groupedItems.length > 0 ? (
                    groupedItems.map((group) => {
                      const isOpen = openWishlistGroups.includes(group.key)
                      const previewItems = group.items.length > 0 ? [group.items[group.items.length - 1]].filter(Boolean) : []
                      const visibleItems = isOpen ? group.items : previewItems
                      return (
                        <div key={group.key} className={`wishlist-modal__group${isOpen ? " is-open" : ""}`}>
                          <button type="button" className="wishlist-modal__group-toggle" onClick={() => toggleWishlistGroup(group.key)}>
                            <h3>{group.label}</h3>
                            <span className="wishlist-modal__group-chevron" aria-hidden="true">
                              v
                            </span>
                          </button>
                          {visibleItems.length > 0 ? (
                            <ul>
                              {visibleItems.map((item) => (
                                <li key={item.id}>
                                  <div className={`wishlist-item${item.isDone ? " wishlist-item--done" : ""}`}>
                                    <div className="wishlist-item__header">
                                      <div className="wishlist-item__media">
                                        {item.imageUrl ? (
                                          <MediaImage src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" />
                                        ) : (
                                          <div className="wishlist-item__placeholder">Sans image</div>
                                        )}
                                      </div>
                                    <div className="wishlist-item__text">
                                      <strong>{item.title}</strong>
                                      {item.subtitle ? <span>{item.subtitle}</span> : null}
                                      {item.link ? (
                                          <a className="wishlist-item__link-chip" href={item.link} target="_blank" rel="noreferrer">
                                            Ouvrir le lien
                                        </a>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div ref={activeItemMenuId === item.id ? itemMenuRef : null} className="wishlist-item__menu">
                                    <button
                                      type="button"
                                      className="profile-menu wishlist-item__menu-toggle"
                                      onClick={() => setActiveItemMenuId((previous) => (previous === item.id ? null : item.id))}
                                      aria-label="Options de l'élément"
                                    >
                                      <span>...</span>
                                    </button>
                                    {activeItemMenuId === item.id ? (
                                      <div className="wishlist-item__menu-popover">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleStartEditItem(item)
                                            setActiveItemMenuId(null)
                                          }}
                                          disabled={!canEdit}
                                        >
                                          Modifier
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            void toggleItemDone(item.id)
                                            setActiveItemMenuId(null)
                                          }}
                                          disabled={!canEdit}
                                        >
                                          {item.isDone ? "À refaire" : "Marquer comme fait"}
                                        </button>
                                        <button type="button" onClick={() => handleStartMoveItem(item)} disabled={!canEdit || categoryCards.length < 2}>
                                          Déplacer vers une autre carte
                                        </button>
                                        <button type="button" className="wishlist-item__menu-danger" onClick={() => void handleDeleteItem(item)} disabled={!canEdit}>
                                          Supprimer
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </li>
                            ))}
                            </ul>
                          ) : null}
                        </div>
                      )
                    })
                  ) : (
                    <p className="wishlist-modal__empty">Clique sur + pour ajouter un produit que tu aimerais acheter plus tard.</p>
                  )}
                </div>
              ) : null}

              {moveItemDraft ? (
                <div className="wishlist-move">
                  <h2>Déplacer vers une autre carte</h2>
                  <div className="wishlist-move__grid">
                    {categoryCards
                      .filter((category) => category.id !== items.find((item) => item.id === moveItemDraft.itemId)?.categoryId)
                      .map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          className={`wishlist-move__card${moveItemDraft.targetCategoryId === category.id ? " wishlist-move__card--selected" : ""}`}
                          onClick={() =>
                            setMoveItemDraft((previous) =>
                              previous
                                ? {
                                    ...previous,
                                    targetCategoryId: category.id,
                                    targetSubcategory: "",
                                  }
                                : previous,
                            )
                          }
                        >
                          <MediaImage src={category.cover} alt={category.title} loading="lazy" decoding="async" />
                          <span>{category.title}</span>
                        </button>
                      ))}
                  </div>
                  <div className="wishlist-move__category">
                    <span>Sous-catégorie cible</span>
                    <div className="wishlist-move__choices">
                      {(categoryCards.find((category) => category.id === moveItemDraft.targetCategoryId)?.items ?? [])
                        .map((item) => item.subcategory?.trim() ?? "")
                        .filter((value, index, array) => value && array.indexOf(value) === index)
                        .map((subcategory) => (
                          <button
                            key={subcategory}
                            type="button"
                            onClick={() =>
                              setMoveItemDraft((previous) => (previous ? { ...previous, targetSubcategory: subcategory } : previous))
                            }
                          >
                            {subcategory}
                          </button>
                        ))}
                    </div>
                    <input
                      type="text"
                      className="wishlist-modal__category-input"
                      placeholder="Nouvelle catégorie"
                      value={moveItemDraft.targetSubcategory}
                      onChange={(event) =>
                        setMoveItemDraft((previous) => (previous ? { ...previous, targetSubcategory: event.target.value } : previous))
                      }
                    />
                  </div>
                  <div className="wishlist-move__actions">
                    <button type="button" onClick={() => setMoveItemDraft(null)}>
                      Annuler
                    </button>
                    <button type="button" data-primary="true" onClick={() => void handleConfirmMoveItem()}>
                      Déplacer
                    </button>
                  </div>
                </div>
              ) : null}

            </div>
            <div className="wishlist-modal__actions">
              <button
                type="button"
                onClick={() => {
                  setIsItemComposerOpen(false)
                  setIsMemoComposerOpen((previous) => !previous)
                }}
                aria-label="Ajouter un mémo"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7 18.5H6.75C5.50736 18.5 4.5 17.4926 4.5 16.25V7.75C4.5 6.50736 5.50736 5.5 6.75 5.5H17.25C18.4926 5.5 19.5 6.50736 19.5 7.75V16.25C19.5 17.4926 18.4926 18.5 17.25 18.5H11.5L8.25 21V18.5H7Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingItemId(null)
                  setIsMemoComposerOpen(false)
                  setIsItemComposerOpen(true)
                  setItemDraft(emptyItemDraft(selectedCategory.id))
                  setItemPreview("")
                  setItemImageFile(null)
                  setRemoveItemImage(false)
                  setIsCategorySuggestionsOpen(false)
                  if (itemImageRef.current) {
                    itemImageRef.current.value = ""
                  }
                }}
                aria-label="Ajouter un élément"
              >
                +
              </button>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}

export default WishlistPage
