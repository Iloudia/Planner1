import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type { WishlistCategoryRecord, WishlistItemRecord } from "../types/personalization"
import { createClientId } from "../utils/clientId"
import { importLegacyWishlistIfNeeded } from "../services/firestore/plannerMigrations"
import {
  deleteWishlistCategory,
  deleteWishlistItem,
  saveWishlistCategory,
  saveWishlistItem,
  subscribeToWishlistCategories,
  subscribeToWishlistItems,
} from "../services/firestore/wishlist"
import { baseWishlistCategoryDefinitions, WISHLIST_DEFINITION_VERSION } from "../services/firestore/wishlistDefinitions"

const WISHLIST_LOAD_ERROR = "Impossible de charger votre wishlist."
const WISHLIST_MUTATION_ERROR = "Impossible de mettre à jour votre wishlist."

const buildBaseCategory = (
  definition: (typeof baseWishlistCategoryDefinitions)[number],
  overrides?: Partial<WishlistCategoryRecord>,
): WishlistCategoryRecord => ({
  id: definition.id,
  title: overrides?.title ?? definition.title,
  blurb: overrides?.blurb ?? definition.blurb,
  accent: overrides?.accent ?? definition.accent,
  note: overrides?.note ?? "",
  isFavorite: overrides?.isFavorite ?? false,
  isBase: true,
  coverMode: overrides?.coverMode ?? "default",
  customCoverUrl: overrides?.customCoverUrl,
  customCoverPath: overrides?.customCoverPath,
  order: overrides?.order ?? baseWishlistCategoryDefinitions.findIndex((item) => item.id === definition.id),
  usageCount: overrides?.usageCount ?? 0,
  lastUsedAt: overrides?.lastUsedAt ?? 0,
  definitionVersion: WISHLIST_DEFINITION_VERSION,
  createdAt: overrides?.createdAt,
  updatedAt: overrides?.updatedAt,
})

const useUserWishlist = () => {
  const { isAuthReady, userId, userEmail } = useAuth()
  const [categories, setCategories] = useState<WishlistCategoryRecord[]>([])
  const [items, setItems] = useState<WishlistItemRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const seedAttemptRef = useRef(false)
  const migrationAttemptRef = useRef(false)
  const [migrationResolved, setMigrationResolved] = useState(false)

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setCategories([])
      setItems([])
      setError(null)
      setIsLoading(false)
      seedAttemptRef.current = false
      migrationAttemptRef.current = false
      setMigrationResolved(false)
      return
    }

    let categoriesLoaded = false
    let itemsLoaded = false
    const syncLoadingState = () => setIsLoading(!(categoriesLoaded && itemsLoaded))

    setCategories([])
    setItems([])
    setError(null)
    setIsLoading(true)
    seedAttemptRef.current = false
    migrationAttemptRef.current = false
    setMigrationResolved(false)

    const unsubscribeCategories = subscribeToWishlistCategories(
      userId,
      (nextCategories) => {
        categoriesLoaded = true
        setCategories(nextCategories)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Wishlist categories load failed", loadError)
        categoriesLoaded = true
        setCategories([])
        setError(WISHLIST_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeItems = subscribeToWishlistItems(
      userId,
      (nextItems) => {
        itemsLoaded = true
        setItems(nextItems)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Wishlist items load failed", loadError)
        itemsLoaded = true
        setItems([])
        setError(WISHLIST_LOAD_ERROR)
        syncLoadingState()
      },
    )

    return () => {
      unsubscribeCategories()
      unsubscribeItems()
    }
  }, [isAuthReady, userId])

  useEffect(() => {
    if (!userId || !userEmail || isLoading || migrationAttemptRef.current) {
      return
    }
    migrationAttemptRef.current = true
    void importLegacyWishlistIfNeeded(userId, userEmail, categories, items)
      .catch((migrationError) => {
        console.error("Wishlist migration failed", migrationError)
        setError(WISHLIST_MUTATION_ERROR)
      })
      .finally(() => {
        setMigrationResolved(true)
      })
  }, [categories, isLoading, items, userEmail, userId])

  useEffect(() => {
    if (!userId || isLoading || seedAttemptRef.current || !migrationResolved) {
      return
    }
    seedAttemptRef.current = true

    const run = async () => {
      const byId = new Map(categories.map((category) => [category.id, category]))
      await Promise.all(
        baseWishlistCategoryDefinitions.map(async (definition, index) => {
          const existing = byId.get(definition.id)
          const next = buildBaseCategory(definition, {
            order: existing?.order ?? index,
            coverMode:
              existing?.coverMode ?? (existing?.customCoverUrl || existing?.customCoverPath ? "custom" : "default"),
            note: existing?.note,
            isFavorite: existing?.isFavorite,
            customCoverUrl: existing?.customCoverUrl,
            customCoverPath: existing?.customCoverPath,
            usageCount: existing?.usageCount,
            lastUsedAt: existing?.lastUsedAt,
            createdAt: existing?.createdAt,
            updatedAt: existing?.updatedAt,
          })
          const needsCreate = !existing
          const needsSync =
            !existing ||
            existing.definitionVersion !== WISHLIST_DEFINITION_VERSION ||
            !existing.title ||
            !existing.blurb ||
            !existing.accent

          if (needsCreate || needsSync) {
            await saveWishlistCategory(userId, next)
          }
        }),
      )
    }

    void run().catch((seedError) => {
      console.error("Wishlist seed failed", seedError)
      setError(WISHLIST_MUTATION_ERROR)
    })
  }, [categories, isLoading, migrationResolved, userId])

  const mutate = useCallback(
    async (operation: () => Promise<void>) => {
      try {
        setError(null)
        await operation()
      } catch (mutationError) {
        console.error("Wishlist mutation failed", mutationError)
        setError(WISHLIST_MUTATION_ERROR)
        throw mutationError
      }
    },
    [],
  )

  const createCategory = useCallback(
    async (input: {
      title: string
      blurb: string
      accent: string
      customCoverUrl?: string
      customCoverPath?: string
    }) => {
      if (!userId) return null
      const id = createClientId("custom")
      const category: WishlistCategoryRecord = {
        id,
        title: input.title.trim(),
        blurb: input.blurb.trim(),
        accent: input.accent.trim(),
        note: "",
        isFavorite: false,
        isBase: false,
        coverMode: input.customCoverUrl || input.customCoverPath ? "custom" : "default",
        customCoverUrl: input.customCoverUrl,
        customCoverPath: input.customCoverPath,
        order: Date.now(),
        usageCount: 0,
        lastUsedAt: 0,
        createdAt: Date.now(),
      }
      await mutate(() => saveWishlistCategory(userId, category))
      return id
    },
    [mutate, userId],
  )

  const updateCategory = useCallback(
    async (categoryId: string, updates: Partial<WishlistCategoryRecord>) => {
      if (!userId) return
      const current = categories.find((category) => category.id === categoryId)
      if (!current) return
      await mutate(() => saveWishlistCategory(userId, { ...current, ...updates }))
    },
    [categories, mutate, userId],
  )

  const deleteCategoryWithItems = useCallback(
    async (categoryId: string) => {
      if (!userId) return
      const current = categories.find((category) => category.id === categoryId)
      if (!current) return
      const categoryItems = items.filter((item) => item.categoryId === categoryId)
      await mutate(async () => {
        await Promise.all(categoryItems.map((item) => deleteWishlistItem(userId, item.id)))
        if (current.isBase) {
          const definition = baseWishlistCategoryDefinitions.find((item) => item.id === categoryId)
          if (!definition) return
          await saveWishlistCategory(userId, buildBaseCategory(definition, { createdAt: current.createdAt }))
          return
        }
        await deleteWishlistCategory(userId, categoryId)
      })
    },
    [categories, items, mutate, userId],
  )

  const activateCategory = useCallback(
    async (categoryId: string) => {
      if (!userId) return
      const current = categories.find((category) => category.id === categoryId)
      if (!current) return
      await mutate(() =>
        saveWishlistCategory(userId, {
          ...current,
          usageCount: (current.usageCount ?? 0) + 1,
          lastUsedAt: Date.now(),
        }),
      )
    },
    [categories, mutate, userId],
  )

  const saveCategoryNote = useCallback(
    async (categoryId: string, note: string) => {
      await updateCategory(categoryId, { note })
    },
    [updateCategory],
  )

  const toggleCategoryFavorite = useCallback(
    async (categoryId: string) => {
      const current = categories.find((category) => category.id === categoryId)
      if (!current) return
      await updateCategory(categoryId, { isFavorite: !current.isFavorite })
    },
    [categories, updateCategory],
  )

  const createItem = useCallback(
    async (input: Omit<WishlistItemRecord, "id" | "sortOrder" | "isDone"> & { isDone?: boolean; sortOrder?: number }) => {
      if (!userId) return null
      const id = createClientId("wishlist-item")
      const item: WishlistItemRecord = {
        id,
        categoryId: input.categoryId,
        title: input.title.trim(),
        subtitle: input.subtitle?.trim() || undefined,
        imageUrl: input.imageUrl,
        imagePath: input.imagePath,
        imageName: input.imageName,
        link: input.link,
        subcategory: input.subcategory?.trim() || undefined,
        isDone: input.isDone ?? false,
        sortOrder: input.sortOrder ?? Date.now(),
        createdAt: Date.now(),
      }
      await mutate(() => saveWishlistItem(userId, item))
      return id
    },
    [mutate, userId],
  )

  const updateItem = useCallback(
    async (itemId: string, updates: Partial<WishlistItemRecord>) => {
      if (!userId) return
      const current = items.find((item) => item.id === itemId)
      if (!current) return
      await mutate(() => saveWishlistItem(userId, { ...current, ...updates }))
    },
    [items, mutate, userId],
  )

  const deleteItem = useCallback(
    async (itemId: string) => {
      if (!userId) return
      await mutate(() => deleteWishlistItem(userId, itemId))
    },
    [mutate, userId],
  )

  const toggleItemDone = useCallback(
    async (itemId: string) => {
      const current = items.find((item) => item.id === itemId)
      if (!current) return
      await updateItem(itemId, { isDone: !current.isDone })
    },
    [items, updateItem],
  )

  const moveItem = useCallback(
    async (itemId: string, targetCategoryId: string, targetSubcategory?: string) => {
      const current = items.find((item) => item.id === itemId)
      if (!current) return
      await updateItem(itemId, {
        categoryId: targetCategoryId,
        subcategory: targetSubcategory?.trim() || undefined,
        sortOrder: Date.now(),
      })
    },
    [items, updateItem],
  )

  return useMemo(
    () => ({
      categories,
      items,
      isLoading,
      error,
      createCategory,
      updateCategory,
      deleteCategory: deleteCategoryWithItems,
      activateCategory,
      saveCategoryNote,
      toggleCategoryFavorite,
      createItem,
      updateItem,
      deleteItem,
      toggleItemDone,
      moveItem,
    }),
    [
      activateCategory,
      categories,
      createCategory,
      createItem,
      deleteCategoryWithItems,
      deleteItem,
      error,
      isLoading,
      items,
      moveItem,
      saveCategoryNote,
      toggleCategoryFavorite,
      toggleItemDone,
      updateCategory,
      updateItem,
    ],
  )
}

export default useUserWishlist
