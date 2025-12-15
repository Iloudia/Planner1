import type { FormEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import usePersistentState from "../../hooks/usePersistentState"
import wishlistHair from "../../assets/ruby--dupe.jpeg"
import wishlistOutfit from "../../assets/planner-05.jpg"
import wishlistMakeup from "../../assets/planner-01.jpg"
import wishlistElectronics from "../../assets/planner-10.jpg"
import wishlistSkincare from "../../assets/planner-02.jpg"
import wishlistBooks from "../../assets/planner-07.jpg"
import wishlistRoom from "../../assets/planner-06.jpg"
import wishlistTravel from "../../assets/planner-09.jpg"
import wishlistJewelry from "../../assets/planner-04.jpg"
import wishlistBag from "../../assets/planner-08.jpg"
import PageHeading from "../../components/PageHeading"
import "./Wishlist.css"

type WishlistCategoryId = string

type WishlistItem = {
  id: string
  categoryId: WishlistCategoryId
  title: string
  subtitle?: string
  imageUrl?: string
  imageName?: string
  link?: string
  subcategory?: string
  isDone?: boolean
}

type WishlistStorageEntry = {
  title: string
  items: WishlistItem[]
  note?: string
  isFavorite?: boolean
  accent?: string
  cover?: string
  blurb?: string
  createdAt?: number
  order?: number
  definitionVersion?: number
}

type WishlistState = Record<WishlistCategoryId, WishlistStorageEntry>

type CategoryDefinition = {
  id: WishlistCategoryId
  label: string
  accent: string
  cover: string
  blurb: string
}

type WishlistCategoryCard = {
  id: WishlistCategoryId
  title: string
  accent: string
  cover: string
  blurb: string
  items: WishlistItem[]
  note?: string
  isFavorite: boolean
  entry: WishlistStorageEntry
  isBase: boolean
  order: number
  label: string
}

const WISHLIST_DEFINITION_VERSION = 2

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { id: "hair", label: "Hair essentials", accent: "#f497c0", cover: wishlistHair, blurb: "Brushes, soins et petits accessoires pour une routine cheveux complete." },
  { id: "outfits", label: "Outfits", accent: "#fcd67d", cover: wishlistOutfit, blurb: "Idees tenues et pieces coups de coeur pour tes looks preferes." },
  { id: "makeup", label: "Makeup wishlist", accent: "#fbcada", cover: wishlistMakeup, blurb: "Palette, gloss ou nouveaux blushs a tester absolument." },
  { id: "electronics", label: "Electronic appareil", accent: "#c9d9ff", cover: wishlistElectronics, blurb: "Gadgets tech, accessoires photo ou outils productivite." },
  { id: "skincare", label: "Skincare", accent: "#c1e7db", cover: wishlistSkincare, blurb: "Soins cocooning, masques favoris et indispensables glow." },
  { id: "books", label: "Livres", accent: "#b4cfff", cover: wishlistBooks, blurb: "Romans, developpement perso et lectures inspirees." },
  { id: "room", label: "Chambre", accent: "#d9c5ff", cover: wishlistRoom, blurb: "Deco, ambiance et petits objets cozy pour ta chambre." },
  { id: "travel", label: "Voyages", accent: "#f6b094", cover: wishlistTravel, blurb: "Destinations ou experiences a ajouter a ta bucket list." },
  { id: "jewelry", label: "Bijoux", accent: "#ffd4a8", cover: wishlistJewelry, blurb: "Bagues, colliers et accessoires brillants a collectionner." },
  { id: "bag", label: "Sac", accent: "#f3b4c5", cover: wishlistBag, blurb: "Bags iconiques, tote bags pratiques et petites pochettes." },
]

const CUSTOM_ACCENTS = ["#f6a6c1", "#c3d9ff", "#ffe3a7", "#c6eed7", "#fbcfe8", "#d9c5ff"] as const

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

const CUSTOM_BLURB = "Ta categorie personnalisee."

const BASE_CATEGORY_IDS = new Set(CATEGORY_DEFINITIONS.map((category) => category.id))

const isBaseCategory = (id: WishlistCategoryId) => BASE_CATEGORY_IDS.has(id)

const hashString = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    const char = value.charCodeAt(index)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

const getAccentForId = (id: WishlistCategoryId) =>
  CUSTOM_ACCENTS[hashString(id) % CUSTOM_ACCENTS.length] ?? CUSTOM_ACCENTS[0]

const getCoverForId = (id: WishlistCategoryId) =>
  CUSTOM_COVER_POOL[hashString(`${id}-cover`) % CUSTOM_COVER_POOL.length] ?? CUSTOM_COVER_POOL[0]

const getCategoryDefinition = (id: WishlistCategoryId) =>
  CATEGORY_DEFINITIONS.find((category) => category.id === id)

const createEntryFromDefinition = (definition: CategoryDefinition): WishlistStorageEntry => ({
  title: definition.label,
  items: [],
  note: "",
  isFavorite: false,
  accent: definition.accent,
  cover: definition.cover,
  blurb: definition.blurb,
  createdAt: Date.now(),
  definitionVersion: WISHLIST_DEFINITION_VERSION,
})

const createFallbackEntry = (id: WishlistCategoryId, title: string): WishlistStorageEntry => {
  const accent = getAccentForId(id)
  const cover = getCoverForId(id)
  return {
    title,
    items: [],
    note: "",
    isFavorite: false,
    accent,
    cover,
    blurb: CUSTOM_BLURB,
    createdAt: Date.now(),
    definitionVersion: WISHLIST_DEFINITION_VERSION,
  }
}

const buildDefaultEntry = (id: WishlistCategoryId, title?: string): WishlistStorageEntry => {
  const definition = getCategoryDefinition(id)
  if (definition) {
    const base = createEntryFromDefinition(definition)
    return title ? { ...base, title } : base
  }
  return createFallbackEntry(id, title ?? "Nouvelle categorie")
}

const buildDefaultWishlist = (): WishlistState =>
  CATEGORY_DEFINITIONS.reduce<WishlistState>((accumulator, category) => {
    accumulator[category.id] = createEntryFromDefinition(category)
    return accumulator
  }, {} as WishlistState)

type WishlistItemDraft = {
  title: string
  subtitle: string
  imageUrl: string
  imageName: string
  link: string
  subcategory: string
}

const createEmptyItemDraft = (): WishlistItemDraft => ({
  title: "",
  subtitle: "",
  imageUrl: "",
  imageName: "",
  link: "",
  subcategory: "",
})

const formatLinkHost = (value: string) => {
  try {
    const url = new URL(value)
    return url.host.replace(/^www\./, "")
  } catch {
    return value
  }
}

type NewCategoryDraft = {
  title: string
  blurb: string
  accent: string
  coverData: string
  coverName: string
}

const createNewCategoryDraft = (): NewCategoryDraft => ({
  title: "",
  blurb: "",
  accent: CUSTOM_ACCENTS[0] ?? "#f6a6c1",
  coverData: "",
  coverName: "",
})

const WishlistPage = () => {
  const [wishlist, setWishlist] = usePersistentState<WishlistState>("planner.wishlist", buildDefaultWishlist)
  const [openMenuFor, setOpenMenuFor] = useState<WishlistCategoryId | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<WishlistCategoryId | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [renamingCategoryId, setRenamingCategoryId] = useState<WishlistCategoryId | null>(null)
  const [renameDraft, setRenameDraft] = useState("")
  const [noteDraft, setNoteDraft] = useState("")
  const [itemDraft, setItemDraft] = useState<WishlistItemDraft>(() => createEmptyItemDraft())
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [categoryDraft, setCategoryDraft] = useState<NewCategoryDraft>(() => createNewCategoryDraft())
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [itemMenuOpenFor, setItemMenuOpenFor] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [isNoteMenuOpen, setIsNoteMenuOpen] = useState(false)
  const [isNotePanelOpen, setIsNotePanelOpen] = useState(false)
  const [movingItem, setMovingItem] = useState<WishlistItem | null>(null)
  const [moveTargetCategoryId, setMoveTargetCategoryId] = useState<WishlistCategoryId | null>(null)
  const [moveSubcategory, setMoveSubcategory] = useState("")
  const itemImageInputRef = useRef<HTMLInputElement | null>(null)
  const categoryCoverInputRef = useRef<HTMLInputElement | null>(null)
  const resetItemDraft = useCallback(() => {
    setItemDraft(createEmptyItemDraft())
    if (itemImageInputRef.current) {
      itemImageInputRef.current.value = ""
    }
  }, [])

  useEffect(() => {
    setWishlist((previous) => {
      let changed = false
      const next: WishlistState = { ...previous }

      CATEGORY_DEFINITIONS.forEach((definition, index) => {
        const existing = next[definition.id]
        if (!existing) {
          next[definition.id] = createEntryFromDefinition(definition)
          changed = true
          return
        }

        let updated = existing
        const needsDefinitionSync = (existing.definitionVersion ?? 0) < WISHLIST_DEFINITION_VERSION

        if (needsDefinitionSync) {
          updated = updated === existing ? { ...updated } : updated
          updated.accent = definition.accent
          updated.cover = definition.cover
          updated.blurb = definition.blurb
          updated.definitionVersion = WISHLIST_DEFINITION_VERSION
          changed = true
        }

        if (!existing.title || existing.title.trim().length === 0) {
          updated = updated === existing ? { ...updated } : updated
          updated.title = definition.label
          changed = true
        }

        if (!existing.accent) {
          updated = updated === existing ? { ...updated } : updated
          updated.accent = definition.accent
          changed = true
        }

        if (!existing.cover) {
          updated = updated === existing ? { ...updated } : updated
          updated.cover = definition.cover
          changed = true
        }

        if (!existing.blurb) {
          updated = updated === existing ? { ...updated } : updated
          updated.blurb = definition.blurb
          changed = true
        }

        if (!existing.createdAt) {
          updated = updated === existing ? { ...updated } : updated
          updated.createdAt = Date.now() + index
          changed = true
        }

        if (typeof existing.order !== "number") {
          updated = updated === existing ? { ...updated } : updated
          updated.order = index
          changed = true
        }

        if (updated !== existing) {
          next[definition.id] = updated
        }
      })

      Object.entries(next).forEach(([id, entry], index) => {
        let updated = entry

        if (!entry.accent) {
          updated = updated === entry ? { ...updated } : updated
          updated.accent = getAccentForId(id)
          changed = true
        }

        if (!entry.cover) {
          updated = updated === entry ? { ...updated } : updated
          updated.cover = getCoverForId(id)
          changed = true
        }

        if (!entry.blurb) {
          updated = updated === entry ? { ...updated } : updated
          updated.blurb = CUSTOM_BLURB
          changed = true
        }

        if (!entry.createdAt) {
          updated = updated === entry ? { ...updated } : updated
          updated.createdAt = Date.now() + index
          changed = true
        }

        if (typeof entry.order !== "number") {
          updated = updated === entry ? { ...updated } : updated
          updated.order = (entry.createdAt ?? Date.now()) + index
          changed = true
        }

        if (updated !== entry) {
          next[id] = updated
        }
      })

      return changed ? next : previous
    })
  }, [setWishlist])

  const categoryCards = useMemo<WishlistCategoryCard[]>(() => {
    const baseCards = CATEGORY_DEFINITIONS.map((definition, index) => {
      const entry = wishlist[definition.id] ?? createEntryFromDefinition(definition)
      return {
        id: definition.id,
        title: entry.title ?? definition.label,
        label: definition.label,
        accent: entry.accent ?? definition.accent,
        cover: entry.cover ?? definition.cover,
        blurb: entry.blurb ?? definition.blurb,
        items: entry.items ?? [],
        note: entry.note,
        isFavorite: entry.isFavorite ?? false,
        entry,
        isBase: true,
        order: entry.order ?? index,
      }
    })

    const extras = Object.entries(wishlist)
      .filter(([id]) => !isBaseCategory(id))
      .map(([id, entry]) => ({
        id,
        title: entry.title ?? "Nouvelle categorie",
        label: "Collection perso",
        accent: entry.accent ?? getAccentForId(id),
        cover: entry.cover ?? getCoverForId(id),
        blurb: entry.blurb ?? CUSTOM_BLURB,
        items: entry.items ?? [],
        note: entry.note,
        isFavorite: entry.isFavorite ?? false,
        entry,
        isBase: false,
        order: entry.order ?? entry.createdAt ?? Number.MAX_SAFE_INTEGER,
      }))
      .sort((a, b) => a.order - b.order)

    return [...baseCards, ...extras]
  }, [wishlist])

  useEffect(() => {
    document.body.classList.add("planner-page--white")
    return () => {
      document.body.classList.remove("planner-page--white")
    }
  }, [])

  useEffect(() => {
    resetItemDraft()
    setEditingItemId(null)
    setExpandedItems({})
    setItemMenuOpenFor(null)
    setIsCategoryPickerOpen(false)
    setIsNoteMenuOpen(false)
    if (!selectedCategoryId) {
      setNoteDraft("")
      setIsEditingNote(false)
      setIsNotePanelOpen(false)
      return
    }
    const currentNote = wishlist[selectedCategoryId]?.note ?? ""
    setNoteDraft(currentNote)
    setIsEditingNote(false)
    setIsNotePanelOpen(false)
  }, [resetItemDraft, selectedCategoryId, wishlist])

  useEffect(() => {
    if (!renamingCategoryId) {
      return
    }
    const card = categoryCards.find((item) => item.id === renamingCategoryId)
    const fallback = getCategoryDefinition(renamingCategoryId)?.label ?? ""
    const title = card?.entry.title ?? card?.title ?? fallback
    setRenameDraft(title)
  }, [renamingCategoryId, categoryCards])

  useEffect(() => {
    if (!feedback) {
      return
    }
    const timeout = window.setTimeout(() => setFeedback(null), 2800)
    return () => window.clearTimeout(timeout)
  }, [feedback])

  useEffect(() => {
    const handleGlobalPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target?.closest(".wishlist-card__menu") ||
        target?.closest(".wishlist-card__menu-popover") ||
        target?.closest(".wishlist-note__menu") ||
        target?.closest(".wishlist-note__menu-popover")
      ) {
        return
      }
      if (target?.closest(".wishlist-item__menu")) {
        return
      }
      setOpenMenuFor(null)
      setItemMenuOpenFor(null)
      if (!target?.closest(".wishlist-note__menu") && !target?.closest(".wishlist-note__menu-popover")) {
        setIsNoteMenuOpen(false)
      }
    }
    window.addEventListener("pointerdown", handleGlobalPointerDown)
    return () => window.removeEventListener("pointerdown", handleGlobalPointerDown)
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return
      }
      if (renamingCategoryId) {
        setRenamingCategoryId(null)
        return
      }
      if (selectedCategoryId) {
        setSelectedCategoryId(null)
        setIsAddingItem(false)
        setIsEditingNote(false)
        setIsCategoryPickerOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [renamingCategoryId, selectedCategoryId])

  useEffect(() => {
    if (!isAddingItem) {
      setIsCategoryPickerOpen(false)
    }
  }, [isAddingItem])

  const selectedCategoryCard = useMemo(() => {
    if (!selectedCategoryId) {
      return null
    }
    return categoryCards.find((item) => item.id === selectedCategoryId) ?? null
  }, [categoryCards, selectedCategoryId])

  const selectedCategoryState = selectedCategoryCard?.entry ?? null
  useEffect(() => {
    if (!selectedCategoryState) {
      setExpandedItems({})
      setItemMenuOpenFor(null)
      return
    }
    setExpandedItems((previous) => {
      const next: Record<string, boolean> = {}
      selectedCategoryState.items.forEach((item) => {
        if (previous[item.id]) {
          next[item.id] = true
        }
      })
      return next
    })
    if (itemMenuOpenFor && !selectedCategoryState.items.some((item) => item.id === itemMenuOpenFor)) {
      setItemMenuOpenFor(null)
    }
  }, [itemMenuOpenFor, selectedCategoryState])
  const groupedSelectedItems = useMemo(() => {
    if (!selectedCategoryState) {
      return []
    }
    const groups = new Map<string, WishlistItem[]>()
    selectedCategoryState.items.forEach((item) => {
      const key = item.subcategory && item.subcategory.trim().length > 0 ? item.subcategory.trim() : "__uncategorized"
      const current = groups.get(key)
      if (current) {
        current.push(item)
      } else {
        groups.set(key, [item])
      }
    })
    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      label: key === "__uncategorized" ? "Sans sous-categorie" : key,
      items,
    }))
  }, [selectedCategoryState])

  const getCategorySubcategories = useCallback(
    (categoryId: WishlistCategoryId | null | undefined) => {
      if (!categoryId) {
        return []
      }
      const entry = wishlist[categoryId]
      if (!entry) {
        return []
      }
      const unique = new Set<string>()
      entry.items.forEach((item) => {
        if (item.subcategory && item.subcategory.trim().length > 0) {
          unique.add(item.subcategory.trim())
        }
      })
      return Array.from(unique).sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }))
    },
    [wishlist],
  )

  const subcategoryOptions = useMemo(() => getCategorySubcategories(selectedCategoryId), [getCategorySubcategories, selectedCategoryId])

  const currentMemoValue = selectedCategoryState?.note?.trim() ?? ""
  const hasMemo = currentMemoValue.length > 0

  const movableCategories = useMemo(
    () => categoryCards.filter((card) => card.id !== selectedCategoryId),
    [categoryCards, selectedCategoryId],
  )

  const moveTargetCategories = useMemo(
    () => (movingItem ? categoryCards.filter((card) => card.id !== movingItem.categoryId) : []),
    [categoryCards, movingItem],
  )

  useEffect(() => {
    if (!movingItem) {
      setMoveTargetCategoryId(null)
      setMoveSubcategory("")
      return
    }
    setMoveTargetCategoryId(null)
    setMoveSubcategory(movingItem.subcategory ?? "")
  }, [movingItem])

  useEffect(() => {
    if (!moveTargetCategoryId) {
      return
    }
    const options = getCategorySubcategories(moveTargetCategoryId)
    if (options.length > 0 && !options.includes(moveSubcategory)) {
      setMoveSubcategory(options[0])
    }
  }, [getCategorySubcategories, moveTargetCategoryId, moveSubcategory])

  const handleToggleMenu = (event: MouseEvent<HTMLButtonElement>, categoryId: WishlistCategoryId) => {
    event.stopPropagation()
    event.preventDefault()
    setOpenMenuFor((current) => (current === categoryId ? null : categoryId))
  }

  const handleCardActivate = (categoryId: WishlistCategoryId) => {
    setSelectedCategoryId(categoryId)
    setOpenMenuFor(null)
    setIsAddingItem(false)
    setIsCategoryPickerOpen(false)
  }

  const handleCardKeyDown = (event: ReactKeyboardEvent<HTMLElement>, categoryId: WishlistCategoryId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleCardActivate(categoryId)
    }
  }

  const handleToggleItemMenu = (event: MouseEvent<HTMLButtonElement>, itemId: string) => {
    event.stopPropagation()
    event.preventDefault()
    setItemMenuOpenFor((current) => (current === itemId ? null : itemId))
  }

  const handleToggleItemDetails = (itemId: string) => {
    setExpandedItems((previous) => ({
      ...previous,
      [itemId]: !previous[itemId],
    }))
  }

  const handleToggleNoteMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setIsNoteMenuOpen((previous) => !previous)
  }

  const handleStartEditItem = (item: WishlistItem) => {
    setItemDraft({
      title: item.title,
      subtitle: item.subtitle ?? "",
      imageUrl: item.imageUrl ?? "",
      imageName: item.imageName ?? "",
      link: item.link ?? "",
      subcategory: item.subcategory ?? "",
    })
    setEditingItemId(item.id)
    setIsAddingItem(true)
    setIsCategoryPickerOpen(false)
    setItemMenuOpenFor(null)
  }

  const handleCancelItemForm = () => {
    setIsAddingItem(false)
    setEditingItemId(null)
    setIsCategoryPickerOpen(false)
    resetItemDraft()
  }
  const handleItemImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setItemDraft((previous) => ({
        ...previous,
        imageUrl: "",
        imageName: "",
      }))
      if (itemImageInputRef.current) {
        itemImageInputRef.current.value = ""
      }
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setItemDraft((previous) => ({
        ...previous,
        imageUrl: result,
        imageName: file.name,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleClearItemImage = () => {
    setItemDraft((previous) => ({
      ...previous,
      imageUrl: "",
      imageName: "",
    }))
    if (itemImageInputRef.current) {
      itemImageInputRef.current.value = ""
    }
  }

  const handleToggleItemDone = (item: WishlistItem) => {
    setWishlist((previous) => {
      const category = previous[item.categoryId]
      if (!category) {
        return previous
      }
      return {
        ...previous,
        [item.categoryId]: {
          ...category,
          items: category.items.map((entry) => (entry.id === item.id ? { ...entry, isDone: !entry.isDone } : entry)),
        },
      }
    })
    setItemMenuOpenFor(null)
    setFeedback(item.isDone ? "Element remis a faire" : "Element marque comme fait")
  }

  const handleDuplicateItem = (item: WishlistItem) => {
    setWishlist((previous) => {
      const category = previous[item.categoryId]
      if (!category) {
        return previous
      }
      const clone: WishlistItem = {
        ...item,
        id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      }
      return {
        ...previous,
        [item.categoryId]: {
          ...category,
          items: [clone, ...category.items],
        },
      }
    })
    setItemMenuOpenFor(null)
    setFeedback("Element duplique")
  }

  const handleStartEditNote = () => {
    if (selectedCategoryState) {
      setNoteDraft(selectedCategoryState.note ?? "")
    }
    setIsNotePanelOpen(true)
    setIsEditingNote(true)
    setIsNoteMenuOpen(false)
  }

  const handleDeleteItem = (item: WishlistItem) => {
    const categoryId = item.categoryId
    setWishlist((previous) => {
      const category = previous[categoryId]
      if (!category) {
        return previous
      }
      return {
        ...previous,
        [categoryId]: {
          ...category,
          items: category.items.filter((entry) => entry.id !== item.id),
        },
      }
    })
    if (editingItemId === item.id) {
      setEditingItemId(null)
      resetItemDraft()
      setIsAddingItem(false)
    }
    setItemMenuOpenFor(null)
    setFeedback("Element supprime")
  }

  const handleMoveItem = (item: WishlistItem, targetCategoryId: WishlistCategoryId, targetSubcategory?: string) => {
    if (item.categoryId === targetCategoryId) {
      if (typeof targetSubcategory !== "undefined") {
        setWishlist((previous) => {
          const category = previous[item.categoryId]
          if (!category) {
            return previous
          }
          return {
            ...previous,
            [item.categoryId]: {
              ...category,
              items: category.items.map((entry) => (entry.id === item.id ? { ...entry, subcategory: targetSubcategory } : entry)),
            },
          }
        })
        setFeedback("Categorie mise a jour")
      }
      setItemMenuOpenFor(null)
      return
    }
    setWishlist((previous) => {
      const sourceCategory = previous[item.categoryId]
      if (!sourceCategory) {
        return previous
      }
      const nextSourceItems = sourceCategory.items.filter((entry) => entry.id !== item.id)
      const movedItem: WishlistItem = {
        ...item,
        categoryId: targetCategoryId,
        subcategory: targetSubcategory ?? item.subcategory,
      }
      const targetCategory =
        previous[targetCategoryId] ??
        buildDefaultEntry(targetCategoryId, getCategoryDefinition(targetCategoryId)?.label ?? "Wishlist")
      return {
        ...previous,
        [item.categoryId]: {
          ...sourceCategory,
          items: nextSourceItems,
        },
        [targetCategoryId]: {
          ...targetCategory,
          items: [movedItem, ...(targetCategory.items ?? [])],
        },
      }
    })
    if (editingItemId === item.id) {
      setEditingItemId(null)
      resetItemDraft()
      setIsAddingItem(false)
    }
    setItemMenuOpenFor(null)
    setFeedback("Element deplace")
  }

  const handleOpenMoveDialog = (item: WishlistItem) => {
    setMovingItem(item)
    setMoveTargetCategoryId(null)
    setMoveSubcategory(item.subcategory ?? "")
    setItemMenuOpenFor(null)
  }

  const handleCancelMove = () => {
    setMovingItem(null)
    setMoveTargetCategoryId(null)
    setMoveSubcategory("")
  }

  const handleConfirmMove = () => {
    if (!movingItem || !moveTargetCategoryId) {
      return
    }
    handleMoveItem(movingItem, moveTargetCategoryId, moveSubcategory.trim().length > 0 ? moveSubcategory.trim() : undefined)
    handleCancelMove()
  }


  const resetCategoryDraft = () => {
    setCategoryDraft(createNewCategoryDraft())
    if (categoryCoverInputRef.current) {
      categoryCoverInputRef.current.value = ""
    }
  }

  const handleCategoryCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setCategoryDraft((previous) => ({
        ...previous,
        coverData: "",
        coverName: "",
      }))
      if (categoryCoverInputRef.current) {
        categoryCoverInputRef.current.value = ""
      }
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setCategoryDraft((previous) => ({
        ...previous,
        coverData: result,
        coverName: file.name,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleCancelCreateCategory = () => {
    resetCategoryDraft()
    setIsCreatingCategory(false)
  }

  const handleCreateCategorySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedTitle = categoryDraft.title.trim()
    if (trimmedTitle.length === 0) {
      return
    }
    const trimmedBlurb = categoryDraft.blurb.trim()
    const newId = `custom-${Date.now()}`
    const accent =
      categoryDraft.accent.trim().length > 0 ? categoryDraft.accent.trim() : getAccentForId(newId)
    const cover = categoryDraft.coverData || getCoverForId(newId)
    const entry: WishlistStorageEntry = {
      title: trimmedTitle,
      items: [],
      note: "",
      isFavorite: false,
      accent,
      cover,
      blurb: trimmedBlurb.length > 0 ? trimmedBlurb : CUSTOM_BLURB,
      createdAt: Date.now(),
      order: Date.now(),
    }

    setWishlist((previous) => ({
      ...previous,
      [newId]: entry,
    }))
    setIsCreatingCategory(false)
    resetCategoryDraft()
    setSelectedCategoryId(newId)
    setIsAddingItem(true)
    setOpenMenuFor(null)
    setIsEditingNote(false)
    setNoteDraft("")
    setFeedback("Nouvelle carte ajoutee")
  }

  const handleAddItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCategoryId) {
      return
    }
    const trimmedTitle = itemDraft.title.trim()
    if (trimmedTitle.length === 0) {
      return
    }
    const trimmedSubtitle = itemDraft.subtitle.trim()
    const trimmedImage = itemDraft.imageUrl.trim()
    const trimmedLink = itemDraft.link.trim()
    const trimmedSubcategory = itemDraft.subcategory.trim()
    const trimmedImageName = itemDraft.imageName.trim()

    const saveToCategory = (updater: (currentCategory: WishlistStorageEntry) => WishlistStorageEntry) => {
      setWishlist((previous) => {
        const currentCategory = previous[selectedCategoryId] ?? buildDefaultEntry(selectedCategoryId)
        return {
          ...previous,
          [selectedCategoryId]: updater(currentCategory),
        }
      })
    }

    if (editingItemId) {
      saveToCategory((currentCategory) => ({
        ...currentCategory,
        items: currentCategory.items.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                title: trimmedTitle,
                subtitle: trimmedSubtitle.length > 0 ? trimmedSubtitle : undefined,
                imageUrl: trimmedImage.length > 0 ? trimmedImage : undefined,
                imageName: trimmedImageName.length > 0 ? trimmedImageName : undefined,
                link: trimmedLink.length > 0 ? trimmedLink : undefined,
                subcategory: trimmedSubcategory.length > 0 ? trimmedSubcategory : undefined,
              }
            : item,
        ),
      }))
      setFeedback("Element mis a jour")
    } else {
      const nextItem: WishlistItem = {
        id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        categoryId: selectedCategoryId,
        title: trimmedTitle,
        subtitle: trimmedSubtitle.length > 0 ? trimmedSubtitle : undefined,
        imageUrl: trimmedImage.length > 0 ? trimmedImage : undefined,
        imageName: trimmedImageName.length > 0 ? trimmedImageName : undefined,
        link: trimmedLink.length > 0 ? trimmedLink : undefined,
        subcategory: trimmedSubcategory.length > 0 ? trimmedSubcategory : undefined,
        isDone: false,
      }
      saveToCategory((currentCategory) => ({
        ...currentCategory,
        items: [nextItem, ...currentCategory.items],
      }))
      setFeedback("Produit ajoute a ta wishlist")
    }

    setIsAddingItem(false)
    setIsCategoryPickerOpen(false)
    setEditingItemId(null)
    setItemMenuOpenFor(null)
    resetItemDraft()
  }

  const handleRenameSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!renamingCategoryId) {
      return
    }
    const trimmedTitle = renameDraft.trim()
    if (trimmedTitle.length === 0) {
      return
    }
    setWishlist((previous) => ({
      ...previous,
      [renamingCategoryId]: {
        ...(previous[renamingCategoryId] ?? {
          title: trimmedTitle,
          items: [],
          note: "",
          isFavorite: false,
        }),
        title: trimmedTitle,
      },
    }))
    setRenamingCategoryId(null)
    setFeedback("Categorie renommee avec succes")
  }

  const handleResetCategory = (categoryId: WishlistCategoryId) => {
    const isCustom = !isBaseCategory(categoryId)
    setWishlist((previous) => {
      if (isCustom) {
        if (!previous[categoryId]) {
          return previous
        }
        const next = { ...previous }
        delete next[categoryId]
        return next
      }

      const definition = getCategoryDefinition(categoryId)
      const existing = previous[categoryId]
      if (!existing && !definition) {
        return previous
      }

      return {
        ...previous,
        [categoryId]: {
          ...(existing ?? buildDefaultEntry(categoryId)),
          title: existing?.title ?? definition?.label ?? "Categorie",
          items: [],
          note: "",
          isFavorite: existing?.isFavorite ?? false,
          accent: existing?.accent ?? definition?.accent ?? getAccentForId(categoryId),
          cover: existing?.cover ?? definition?.cover ?? getCoverForId(categoryId),
          blurb: existing?.blurb ?? definition?.blurb ?? CUSTOM_BLURB,
        },
      }
    })
    if (selectedCategoryId === categoryId) {
      setIsAddingItem(false)
      setIsEditingNote(false)
      setNoteDraft("")
      if (isCustom) {
        setSelectedCategoryId(null)
      }
    }
    setOpenMenuFor(null)
    setFeedback(isCustom ? "Carte supprimee" : "Categorie nettoyee")
  }

  const handleShareCategory = async (categoryId: WishlistCategoryId) => {
    const categoryState = wishlist[categoryId]
    const card = categoryCards.find((item) => item.id === categoryId)
    const categoryTitle = categoryState?.title ?? card?.title ?? "Wishlist"
    const items = categoryState?.items ?? []
    const summaryLines = [
      `Wishlist - ${categoryTitle}`,
      "",
      ...items.map((item, index) => {
        const labelParts = [`${index + 1}. ${item.title}`]
        if (item.subtitle) {
          labelParts.push(`(${item.subtitle})`)
        }
        if (item.subcategory) {
          labelParts.push(`[${item.subcategory}]`)
        }
        if (item.link) {
          labelParts.push(`-> ${item.link}`)
        }
        return labelParts.join(" ")
      }),
    ]
    if (categoryState?.note && categoryState.note.trim().length > 0) {
      summaryLines.push("", `Note : ${categoryState.note.trim()}`)
    }
    const summary = summaryLines.join("\n")
    const nav = window.navigator as Navigator & {
      share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>
      clipboard?: Clipboard
    }

    try {
      if (typeof nav.share === "function") {
        await nav.share({ title: categoryTitle, text: summary })
        setFeedback("Ta wishlist a ete partagee")
      } else if (nav.clipboard) {
        await nav.clipboard.writeText(summary)
        setFeedback("Wishlist copiee dans le presse-papiers")
      } else {
        window.prompt("Copie ta wishlist :", summary)
      }
    } catch (error) {
      console.error("Share wishlist failed", error)
      setFeedback("Impossible de partager pour le moment")
    }
    setOpenMenuFor(null)
  }

  const handleToggleFavorite = (categoryId: WishlistCategoryId) => {
    setWishlist((previous) => {
      const current = previous[categoryId]
      if (!current) {
        return previous
      }
      return {
        ...previous,
        [categoryId]: {
          ...current,
          isFavorite: !current.isFavorite,
        },
      }
    })
  }

  const handleSaveNote = () => {
    if (!selectedCategoryId) {
      return
    }
    const trimmedNote = noteDraft.trim()
    setWishlist((previous) => {
      const current = previous[selectedCategoryId]
      if (!current) {
        return previous
      }
      return {
        ...previous,
        [selectedCategoryId]: {
          ...current,
          note: trimmedNote,
        },
      }
    })
    setNoteDraft(trimmedNote)
    setIsEditingNote(false)
    setIsNoteMenuOpen(false)
    setFeedback("Note mise a jour")
  }

  const handleDeleteNote = () => {
    if (!selectedCategoryId) {
      return
    }
    setWishlist((previous) => {
      const current = previous[selectedCategoryId]
      if (!current) {
        return previous
      }
      return {
        ...previous,
        [selectedCategoryId]: {
          ...current,
          note: "",
        },
      }
    })
    setNoteDraft("")
    setIsEditingNote(false)
    setIsNoteMenuOpen(false)
    setFeedback("Memo supprime")
  }

  const closeModal = () => {
    setSelectedCategoryId(null)
    setIsAddingItem(false)
    setIsEditingNote(false)
    setIsNotePanelOpen(false)
    setNoteDraft("")
    setIsCategoryPickerOpen(false)
    setEditingItemId(null)
    setItemMenuOpenFor(null)
    setExpandedItems({})
    setIsNoteMenuOpen(false)
    resetItemDraft()
  }
  return (
    <div className="wishlist-page aesthetic-page" onClick={() => setOpenMenuFor(null)}>
      <header className="wishlist-hero dashboard-panel">
        <div className="wishlist-hero__content">
          <span className="wishlist-hero__eyebrow">envies a collectionner</span>
          <h2>Imagine ta wishlist ideale, categorie par categorie.</h2>
          <p>
            Organise tes inspirations shopping, deco ou voyages en un seul espace pastel. Chaque categorie devient une
            mini moodboard pret a etre partage.
          </p>
        </div>
      </header>
      <div className="page-accent-bar" aria-hidden="true" />
      <div className="wishlist-heading-row">
        <PageHeading eyebrow="Envies" title="Wishlist ideal" />
        <button
          type="button"
          className="wishlist-heading-row__button"
          onClick={() => {
            resetCategoryDraft()
            setIsCreatingCategory(true)
          }}
        >
          Ajouter une carte
        </button>
      </div>

      <section className="wishlist-grid">
        {categoryCards.map((category) => {
          const itemCount = category.items.length
          const displayTitle = category.title
          const isFavorite = category.isFavorite

          return (
            <article
              key={category.id}
              className="wishlist-card"
              role="button"
              tabIndex={0}
              onClick={() => handleCardActivate(category.id)}
              onKeyDown={(event) => handleCardKeyDown(event, category.id)}
            >
              <img className="wishlist-card__cover" src={category.cover} alt={`Moodboard ${displayTitle}`} />
              <div
                className="wishlist-card__overlay"
                style={{
                  background: `linear-gradient(160deg, ${category.accent} 0%, rgba(12,11,19,0.8) 100%)`,
                }}
              />
              <button
                type="button"
                className="wishlist-card__menu"
                aria-label={`Options pour ${displayTitle}`}
                onClick={(event) => handleToggleMenu(event, category.id)}
              >
                <span />
                <span />
                <span />
              </button>
              {openMenuFor === category.id ? (
                <div className="wishlist-card__menu-popover" role="menu" onClick={(event) => event.stopPropagation()}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setRenamingCategoryId(category.id)
                      setOpenMenuFor(null)
                    }}
                  >
                    Modifier
                  </button>
                  <button type="button" role="menuitem" onClick={() => handleResetCategory(category.id)}>
                    Supprimer
                  </button>
                  <button type="button" role="menuitem" onClick={() => handleShareCategory(category.id)}>
                    Partager
                  </button>
                </div>
              ) : null}
              <div className="wishlist-card__content">
                <span className="wishlist-card__count">
                  {itemCount} {itemCount > 1 ? "elements" : "element"}
                </span>
                <div className="wishlist-card__title">
                  <h2>{displayTitle}</h2>
                  {isFavorite ? <span aria-label="Categorie favorite" className="wishlist-card__favorite">?</span> : null}
                </div>
                <p>{category.blurb}</p>
              </div>
            </article>
          )
        })}
      </section>

      {selectedCategoryId && selectedCategoryCard && selectedCategoryState ? (
        <div className="wishlist-modal__backdrop" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="wishlist-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="wishlist-modal__close" aria-label="Fermer" onClick={closeModal}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="wishlist-modal__cover">
              <img src={selectedCategoryCard.cover} alt={`Photo ${selectedCategoryState.title}`} />
            </div>
            <div className="wishlist-modal__body">
              <header className="wishlist-modal__header">
                <div>
                  <span className="wishlist-modal__eyebrow">{selectedCategoryCard.label}</span>
                  <h3>{selectedCategoryState.title}</h3>
                </div>
                <span className="wishlist-modal__badge">
                  {selectedCategoryState.items.length} {selectedCategoryState.items.length > 1 ? "elements" : "element"}
                </span>
              </header>

              {isNotePanelOpen && isEditingNote ? (
                <form
                  className="wishlist-modal__note"
                  onSubmit={(event) => {
                    event.preventDefault()
                    handleSaveNote()
                    }}
                  >
                    <label>
                      <span className="wishlist-memo-label">
                        <svg className="wishlist-memo-label__icon" viewBox="0 0 26 26" aria-hidden="true">
                          <path
                            d="M4 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-4 5v-5H7a3 3 0 0 1-3-3Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Memo</span>
                      </span>
                      <textarea
                        rows={3}
                        value={noteDraft}
                        onChange={(event) => setNoteDraft(event.target.value)}
                        placeholder="Ajouter des details ou un moodboard rapide..."
                      />
                    </label>
                    <div className="wishlist-modal__note-actions">
                      <button type="submit">Enregistrer</button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingNote(false)
                          setNoteDraft(selectedCategoryState.note ?? "")
                        }}
                      >
                        Annuler
                    </button>
                  </div>
                </form>
              ) : null}
              {(!isEditingNote && (hasMemo || isNotePanelOpen)) ? (
                <div className="wishlist-modal__note-display">
                  <div className="wishlist-note__header">
                    <strong className="wishlist-memo-label">
                      <svg className="wishlist-memo-label__icon" viewBox="0 0 26 26" aria-hidden="true">
                        <path
                          d="M4 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-4 5v-5H7a3 3 0 0 1-3-3Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Memo</span>
                    </strong>
                    <div className="wishlist-note__menu">
                      <button
                        type="button"
                        className="wishlist-note__menu-toggle"
                        aria-haspopup="true"
                        aria-expanded={isNoteMenuOpen}
                        onClick={handleToggleNoteMenu}
                      >
                        <span />
                        <span />
                        <span />
                      </button>
                      {isNoteMenuOpen ? (
                        <div className="wishlist-note__menu-popover" role="menu">
                          <button type="button" onClick={handleStartEditNote}>
                            Modifier
                          </button>
                          <button type="button" disabled={!hasMemo} onClick={handleDeleteNote} className="wishlist-note__menu-danger">
                            Supprimer
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {hasMemo ? (
                    <p>{selectedCategoryState.note}</p>
                  ) : (
                    <p className="wishlist-modal__note-placeholder">Ajoute un memo pour cette categorie.</p>
                  )}
                  {!hasMemo && isNotePanelOpen ? (
                    <button className="wishlist-note__add" type="button" onClick={handleStartEditNote}>
                      Ajouter un memo
                    </button>
                  ) : null}
                </div>
              ) : null}

              {isAddingItem ? (
                <form className="wishlist-modal__form" onSubmit={handleAddItem}>
                  <h4>{editingItemId ? "Modifier l'element" : "Ajouter un element"}</h4>
                  <div className="wishlist-modal__form-media">
                    <div className="wishlist-upload">
                      <span className="wishlist-upload__label">Photo</span>
                      <label
                        className={
                          itemDraft.imageUrl ? "wishlist-upload__trigger wishlist-upload__trigger--has-image" : "wishlist-upload__trigger"
                        }
                      >
                        <input ref={itemImageInputRef} type="file" accept="image/*" onChange={handleItemImageChange} />
                        {itemDraft.imageUrl ? (
                          <img src={itemDraft.imageUrl} alt={itemDraft.title || "Previsualisation de l'element"} />
                        ) : (
                          <div className="wishlist-upload__placeholder">
                            <span>+</span>
                            <small>Ajouter une photo</small>
                          </div>
                        )}
                      </label>
                      {itemDraft.imageUrl ? (
                        <button type="button" className="wishlist-upload__remove" onClick={handleClearItemImage}>
                          Retirer l'image
                        </button>
                      ) : null}
                    </div>
                    <div className="wishlist-modal__form-text">
                      <label>
                        <span>Titre</span>
                        <input
                          type="text"
                          value={itemDraft.title}
                          onChange={(event) => setItemDraft((previous) => ({ ...previous, title: event.target.value }))}
                          placeholder="Nom du produit"
                          required
                        />
                      </label>
                      <label>
                        <span>Sous-titre (optionnel)</span>
                        <input
                          type="text"
                          value={itemDraft.subtitle}
                          onChange={(event) => setItemDraft((previous) => ({ ...previous, subtitle: event.target.value }))}
                          placeholder="Couleur, edition limitee..."
                        />
                      </label>
                    </div>
                  </div>
                  <label>
                    <span>Lien (optionnel)</span>
                    <input
                      type="url"
                      value={itemDraft.link}
                      onChange={(event) => setItemDraft((previous) => ({ ...previous, link: event.target.value }))}
                      placeholder="Lien boutique ou reference"
                    />
                  </label>
                  <div className="wishlist-category-picker">
                    {itemDraft.subcategory.trim().length > 0 ? (
                      <span className="wishlist-category-picker__current">Categorie actuelle : {itemDraft.subcategory}</span>
                    ) : null}
                    <button
                      type="button"
                      className="wishlist-category-picker__toggle"
                      onClick={() => setIsCategoryPickerOpen((previous) => !previous)}
                      aria-expanded={isCategoryPickerOpen}
                    >
                      <span>+ Ajouter a la categorie</span>
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className={isCategoryPickerOpen ? "wishlist-category-picker__chevron wishlist-category-picker__chevron--open" : "wishlist-category-picker__chevron"}
                      >
                        <path d="M8.5 5.5 15 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isCategoryPickerOpen ? (
                      <div className="wishlist-category-picker__panel">
                        <label>
                          <span>Nom de la categorie</span>
                          <input
                            type="text"
                            value={itemDraft.subcategory}
                            onChange={(event) => setItemDraft((previous) => ({ ...previous, subcategory: event.target.value }))}
                            placeholder="Ex: Accessoires, Noel, Lecture..."
                          />
                        </label>
                        {subcategoryOptions.length > 0 ? (
                          <>
                            <span className="wishlist-category-picker__hint">Suggestions deja utilisees</span>
                            <ul className="wishlist-category-picker__list">
                              {subcategoryOptions.map((option) => (
                                <li key={option}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setItemDraft((previous) => ({ ...previous, subcategory: option }))
                                      setIsCategoryPickerOpen(false)
                                    }}
                                  >
                                    {option}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <p className="wishlist-category-picker__empty">Tu n'as pas encore cree de categorie personnalisee.</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <footer className="wishlist-modal__form-actions">
                    <button type="submit">Enregistrer</button>
                    <button type="button" onClick={handleCancelItemForm}>
                      Annuler
                    </button>
                  </footer>
                </form>
              ) : null}

              <div className="wishlist-modal__list">
                {selectedCategoryState.items.length === 0 ? (
                  <p className="wishlist-modal__empty">
                    Aucun element encore. Clique sur + pour enregistrer tes envies dans cette categorie.
                  </p>
                ) : (
                  groupedSelectedItems.map((group) => (
                    <div key={group.key} className="wishlist-modal__group">
                      {group.key !== "__uncategorized" ? <h4>{group.label}</h4> : null}
                      <ul>
                        {group.items.map((item) => (
                          <li key={item.id} className={item.isDone ? "wishlist-item wishlist-item--done" : "wishlist-item"}>
                            <div className="wishlist-item__header">
                              <div className="wishlist-item__media">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.title} />
                                ) : (
                                  <span className="wishlist-item__placeholder" aria-hidden="true">
                                    {item.title.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="wishlist-item__text">
                                <strong>{item.title}</strong>
                                {item.subtitle ? <span>{item.subtitle}</span> : null}
                                {item.isDone ? <span className="wishlist-item__status">Fait</span> : null}
                                {group.key === "__uncategorized" && item.subcategory ? (
                                  <span className="wishlist-item__subcategory">{item.subcategory}</span>
                                ) : null}
                              </div>
                              <div className="wishlist-item__actions">
                                <button
                                  type="button"
                                  className={
                                    expandedItems[item.id]
                                      ? "wishlist-item__toggle wishlist-item__toggle--open"
                                      : "wishlist-item__toggle"
                                  }
                                  aria-expanded={expandedItems[item.id] ?? false}
                                  onClick={() => handleToggleItemDetails(item.id)}
                                >
                                  <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                                <div className="wishlist-item__menu">
                                  <button
                                    type="button"
                                    className="wishlist-item__menu-toggle"
                                    aria-haspopup="true"
                                    aria-expanded={itemMenuOpenFor === item.id}
                                    onClick={(event) => handleToggleItemMenu(event, item.id)}
                                  >
                                    <span />
                                    <span />
                                    <span />
                                  </button>
                                  {itemMenuOpenFor === item.id ? (
                                    <div className="wishlist-item__menu-popover" role="menu">
                                      <button type="button" onClick={() => handleStartEditItem(item)}>
                                        Modifier
                                      </button>
                                      <button type="button" onClick={() => handleToggleItemDone(item)}>
                                        {item.isDone ? "Marquer comme a faire" : "Marquer comme fait"}
                                      </button>
                                      <button type="button" onClick={() => handleDuplicateItem(item)}>
                                        Dupliquer
                                      </button>
                                      <button type="button" onClick={() => handleOpenMoveDialog(item)}>
                                        Deplacer vers une autre wishlist
                                      </button>
                                      <button
                                        type="button"
                                        className="wishlist-item__menu-danger"
                                        onClick={() => handleDeleteItem(item)}
                                      >
                                        Supprimer
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            {expandedItems[item.id] ? (
                              <div className="wishlist-item__details-panel">
                                {item.link ? (
                                  <a className="wishlist-item__link-chip" href={item.link} target="_blank" rel="noreferrer">
                                    Visiter {formatLinkHost(item.link)}
                                  </a>
                                ) : (
                                  <p className="wishlist-item__details-empty">Ajoute un lien pour retrouver l'article.</p>
                                )}
                                {item.subcategory ? (
                                  <span className="wishlist-item__detail-tag">Categorie : {item.subcategory}</span>
                                ) : null}
                              </div>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>
            <footer className="wishlist-modal__actions">
              <button
                type="button"
                onClick={() => {
                  setRenamingCategoryId(selectedCategoryId)
                  setOpenMenuFor(null)
                }}
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingItem((value) => {
                    const next = !value
                    setEditingItemId(null)
                    resetItemDraft()
                    if (!next) {
                      setIsCategoryPickerOpen(false)
                    }
                    return next
                  })
                  setItemMenuOpenFor(null)
                }}
                aria-pressed={isAddingItem}
              >
                +
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNotePanelOpen((previous) => {
                    const next = !previous
                    setIsEditingNote(false)
                    if (!next) {
                      setIsNoteMenuOpen(false)
                    }
                    return next
                  })
                  setNoteDraft(selectedCategoryState.note ?? "")
                }}
                aria-pressed={isNotePanelOpen}
              >
                <i className="fa-solid fa-message" aria-hidden="true" />
              </button>
              <button
                type="button"
                className={selectedCategoryState.isFavorite ? "wishlist-modal__favorite active" : "wishlist-modal__favorite"}
                aria-pressed={selectedCategoryState.isFavorite}
                onClick={() => handleToggleFavorite(selectedCategoryId)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 18.26-5.67 3a1 1 0 0 1-1.45-1.05l1.09-6.35-4.58-4.46a1 1 0 0 1 .55-1.7l6.33-.92L11.33 1a1 1 0 0 1 1.34 0l2.83 5.72 6.33.92a1 1 0 0 1 .55 1.7l-4.58 4.46 1.09 6.35a1 1 0 0 1-1.45 1.05Z" />
                </svg>
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {isCreatingCategory ? (
        <div className="wishlist-modal__backdrop" role="dialog" aria-modal="true" onClick={() => setIsCreatingCategory(false)}>
          <form className="wishlist-create" onSubmit={handleCreateCategorySubmit} onClick={(event) => event.stopPropagation()}>
            <h3>Nouvelle carte</h3>
            <label>
              <span>Titre</span>
              <input
                type="text"
                value={categoryDraft.title}
                onChange={(event) => setCategoryDraft((previous) => ({ ...previous, title: event.target.value }))}
                placeholder="Nom de la carte"
                required
              />
            </label>
            <label>
              <span>Description (optionnel)</span>
              <textarea
                rows={2}
                value={categoryDraft.blurb}
                onChange={(event) => setCategoryDraft((previous) => ({ ...previous, blurb: event.target.value }))}
                placeholder="Ajoute un petit texte pour la carte"
              />
            </label>
            <label>
              <span>Couleur</span>
              <div className="wishlist-color-picker">
                <input
                  type="color"
                  className="wishlist-color-picker__input"
                  value={categoryDraft.accent}
                  onChange={(event) => setCategoryDraft((previous) => ({ ...previous, accent: event.target.value }))}
                  aria-label="Choisir la couleur de la carte"
                />
              </div>
            </label>
            <label className="wishlist-modal__file-field">
              <span>Image de couverture</span>
              <div className="wishlist-cover-upload">
                <input ref={categoryCoverInputRef} type="file" accept="image/*" onChange={handleCategoryCoverChange} className="wishlist-cover-upload__input" />
                <button
                  type="button"
                  className="wishlist-cover-upload__button"
                  onClick={() => categoryCoverInputRef.current?.click()}
                >
                  <svg className="wishlist-cover-upload__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 7a2 2 0 0 1 2-2h3l1-1.5A2 2 0 0 1 11.6 3h0.8A2 2 0 0 1 14 3.5L15 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M9 12.5 11 15l4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{categoryDraft.coverName ? "Changer l'image" : "Importer une image"}</span>
                </button>
                {categoryDraft.coverName ? <span className="wishlist-cover-upload__name">{categoryDraft.coverName}</span> : null}
                {categoryDraft.coverData ? (
                  <button
                    type="button"
                    className="wishlist-cover-upload__remove"
                    onClick={() =>
                      setCategoryDraft((previous) => ({
                        ...previous,
                        coverData: "",
                        coverName: "",
                      }))
                    }
                  >
                    Retirer
                  </button>
                ) : null}
              </div>
            </label>
            <div className="wishlist-create__actions">
              <button type="submit">Creer</button>
              <button type="button" onClick={handleCancelCreateCategory}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {renamingCategoryId ? (
        <div className="wishlist-modal__backdrop" role="dialog" aria-modal="true" onClick={() => setRenamingCategoryId(null)}>
          <form className="wishlist-rename" onSubmit={handleRenameSubmit} onClick={(event) => event.stopPropagation()}>
            <h3>Renommer la categorie</h3>
            <label>
              <span>Nouveau titre</span>
              <input
                type="text"
                value={renameDraft}
                onChange={(event) => setRenameDraft(event.target.value)}
                placeholder="Nom de la categorie"
                required
              />
            </label>
            <div className="wishlist-rename__actions">
              <button type="submit">Enregistrer</button>
              <button type="button" onClick={() => setRenamingCategoryId(null)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {movingItem ? (
        <div className="wishlist-modal__backdrop" role="dialog" aria-modal="true" onClick={handleCancelMove}>
          <div className="wishlist-move" onClick={(event) => event.stopPropagation()}>
            <h3>Deplacer vers une autre wishlist</h3>
            {moveTargetCategories.length === 0 ? (
              <p>Crée une nouvelle carte pour pouvoir deplacer cet element.</p>
            ) : (
              <>
                <p>Choisis la wishlist de destination puis selectionne la categorie dans laquelle ranger cet element.</p>
                <div className="wishlist-move__grid">
                  {moveTargetCategories.map((card) => (
                    <button
                      type="button"
                      key={card.id}
                      className={moveTargetCategoryId === card.id ? "wishlist-move__card wishlist-move__card--selected" : "wishlist-move__card"}
                      onClick={() => setMoveTargetCategoryId(card.id)}
                    >
                      <img src={card.cover} alt={card.title} />
                      <span>{card.title}</span>
                    </button>
                  ))}
                </div>
                {moveTargetCategoryId ? (
                  <div className="wishlist-move__category">
                    <label>
                      <span>Categorie dans la nouvelle wishlist</span>
                      <input
                        type="text"
                        value={moveSubcategory}
                        onChange={(event) => setMoveSubcategory(event.target.value)}
                        placeholder="Saisis ou choisis une categorie"
                      />
                    </label>
                    {getCategorySubcategories(moveTargetCategoryId).length > 0 ? (
                      <div className="wishlist-move__choices">
                        {getCategorySubcategories(moveTargetCategoryId).map((option) => (
                          <button type="button" key={option} onClick={() => setMoveSubcategory(option)}>
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
            <div className="wishlist-move__actions">
              <button type="button" onClick={handleCancelMove}>
                Annuler
              </button>
              <button type="button" data-primary="true" disabled={!moveTargetCategoryId} onClick={handleConfirmMove}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {feedback ? <div className="wishlist-toast">{feedback}</div> : null}
      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default WishlistPage
