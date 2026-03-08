import {
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"
import type { WishlistCategoryRecord, WishlistItemRecord } from "../../types/personalization"
import { wishlistCategoriesCollectionRef, wishlistCategoryDocRef, wishlistItemDocRef, wishlistItemsCollectionRef } from "./userPaths"
import { toMillis } from "./shared"

type WishlistCategoryDoc = Omit<WishlistCategoryRecord, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type WishlistItemDoc = Omit<WishlistItemRecord, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

const mapCategory = (id: string, record: WishlistCategoryDoc): WishlistCategoryRecord => ({
  id,
  title: record.title,
  blurb: record.blurb,
  accent: record.accent,
  note: record.note,
  isFavorite: record.isFavorite,
  isBase: record.isBase,
  coverMode: record.coverMode,
  customCoverUrl: record.customCoverUrl,
  customCoverPath: record.customCoverPath,
  order: record.order,
  usageCount: record.usageCount,
  lastUsedAt: record.lastUsedAt,
  definitionVersion: record.definitionVersion,
  createdAt: toMillis(record.createdAt),
  updatedAt: toMillis(record.updatedAt),
})

const mapItem = (id: string, record: WishlistItemDoc): WishlistItemRecord => ({
  id,
  categoryId: record.categoryId,
  title: record.title,
  subtitle: record.subtitle,
  imageUrl: record.imageUrl,
  imagePath: record.imagePath,
  imageName: record.imageName,
  link: record.link,
  subcategory: record.subcategory,
  isDone: record.isDone,
  sortOrder: record.sortOrder,
  createdAt: toMillis(record.createdAt),
  updatedAt: toMillis(record.updatedAt),
})

export const subscribeToWishlistCategories = (
  userId: string,
  onCategories: (categories: WishlistCategoryRecord[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const categoriesQuery = query(wishlistCategoriesCollectionRef(userId), orderBy("order", "asc"))
  return onSnapshot(
    categoriesQuery,
    (snapshot) => {
      onCategories(snapshot.docs.map((docSnap) => mapCategory(docSnap.id, docSnap.data() as WishlistCategoryDoc)))
    },
    onError,
  )
}

export const subscribeToWishlistItems = (
  userId: string,
  onItems: (items: WishlistItemRecord[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const itemsQuery = query(wishlistItemsCollectionRef(userId), orderBy("sortOrder", "desc"))
  return onSnapshot(
    itemsQuery,
    (snapshot) => {
      onItems(snapshot.docs.map((docSnap) => mapItem(docSnap.id, docSnap.data() as WishlistItemDoc)))
    },
    onError,
  )
}

export const saveWishlistCategory = async (userId: string, category: WishlistCategoryRecord) => {
  await setDoc(
    wishlistCategoryDocRef(userId, category.id),
    {
      title: category.title,
      blurb: category.blurb,
      accent: category.accent,
      note: category.note,
      isFavorite: category.isFavorite,
      isBase: category.isBase,
      coverMode: category.coverMode,
      customCoverUrl: category.customCoverUrl ?? null,
      customCoverPath: category.customCoverPath ?? null,
      order: category.order,
      usageCount: category.usageCount,
      lastUsedAt: category.lastUsedAt,
      definitionVersion: category.definitionVersion ?? null,
      createdAt: category.createdAt ? Timestamp.fromMillis(category.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteWishlistCategory = async (userId: string, categoryId: string) => {
  await deleteDoc(wishlistCategoryDocRef(userId, categoryId))
}

export const saveWishlistItem = async (userId: string, item: WishlistItemRecord) => {
  await setDoc(
    wishlistItemDocRef(userId, item.id),
    {
      categoryId: item.categoryId,
      title: item.title,
      subtitle: item.subtitle ?? null,
      imageUrl: item.imageUrl ?? null,
      imagePath: item.imagePath ?? null,
      imageName: item.imageName ?? null,
      link: item.link ?? null,
      subcategory: item.subcategory ?? null,
      isDone: item.isDone,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt ? Timestamp.fromMillis(item.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteWishlistItem = async (userId: string, itemId: string) => {
  await deleteDoc(wishlistItemDocRef(userId, itemId))
}
