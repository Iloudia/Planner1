import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
  type Query,
  type Unsubscribe,
} from "firebase/firestore"
import type { BlogCategory } from "../../pages/Blog/blogArticles"
import { db } from "../../utils/firebaseFirestore"

export type BlogArticleStatus = "draft" | "published"

export type BlogCmsArticle = {
  href: string
  slug: string
  category: BlogCategory
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  eyebrow: string
  readingTime: string
  publicationDate: string
  content: string
  status: BlogArticleStatus
  createdAt?: unknown
  updatedAt?: unknown
  publishedAt?: unknown
  isPersisted?: boolean
  usesStaticImage?: boolean
}

const blogArticlesCollection = collection(db, "blogArticles")

const toParisDateKey = (date: Date) => {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export const getCurrentPublicationDate = () => toParisDateKey(new Date())

const getPublishedDate = (data: DocumentData) => {
  if (data.status !== "published") {
    return String(data.publicationDate ?? "")
  }

  try {
    const publishedAt = data.publishedAt?.toDate?.()
    if (publishedAt instanceof Date && Number.isFinite(publishedAt.getTime())) {
      return toParisDateKey(publishedAt)
    }
  } catch {
    // Fall back to the stored date for older documents without a valid timestamp.
  }

  return String(data.publicationDate ?? "")
}

export const normalizeBlogHref = (href: string) => {
  const normalized = href.trim().replace(/\/+$/, "")
  return normalized.startsWith("/") ? normalized : `/${normalized}`
}

export const getBlogArticleDocumentId = (href: string) =>
  normalizeBlogHref(href).slice(1).replace(/\//g, "__")

const mapDocument = (data: DocumentData): BlogCmsArticle => ({
  href: normalizeBlogHref(String(data.href ?? "")),
  slug: String(data.slug ?? ""),
  category: data.category as BlogCategory,
  title: String(data.title ?? ""),
  description: String(data.description ?? ""),
  imageUrl: String(data.imageUrl ?? ""),
  imageAlt: String(data.imageAlt ?? ""),
  eyebrow: String(data.eyebrow ?? ""),
  readingTime: String(data.readingTime ?? ""),
  publicationDate: getPublishedDate(data),
  content: String(data.content ?? ""),
  status: data.status === "published" ? "published" : "draft",
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  publishedAt: data.publishedAt,
  isPersisted: true,
  usesStaticImage: !data.imageUrl,
})

const subscribe = (
  source: Query<DocumentData, DocumentData>,
  onData: (articles: BlogCmsArticle[]) => void,
  onError: (error: Error) => void,
): Unsubscribe => onSnapshot(
  source,
  (snapshot) => onData(snapshot.docs.map((item) => mapDocument(item.data()))),
  (error) => onError(error),
)

export const subscribeToPublishedBlogArticles = (
  onData: (articles: BlogCmsArticle[]) => void,
  onError: (error: Error) => void,
) => subscribe(query(blogArticlesCollection, where("status", "==", "published")), onData, onError)

export const subscribeToAllBlogArticles = (
  onData: (articles: BlogCmsArticle[]) => void,
  onError: (error: Error) => void,
) => subscribe(query(blogArticlesCollection), onData, onError)

export const saveBlogArticle = async (article: BlogCmsArticle) => {
  const href = normalizeBlogHref(article.href)
  const reference = doc(blogArticlesCollection, getBlogArticleDocumentId(href))
  const { isPersisted: _isPersisted, usesStaticImage, ...articleData } = article
  const payload = {
    ...articleData,
    imageUrl: usesStaticImage ? "" : articleData.imageUrl,
    href,
    updatedAt: serverTimestamp(),
    ...(article.createdAt ? {} : { createdAt: serverTimestamp() }),
    ...(article.status === "published" ? { publishedAt: serverTimestamp() } : {}),
  }
  await setDoc(reference, payload, { merge: true })
}

export const deleteBlogArticle = async (href: string) => {
  await deleteDoc(doc(blogArticlesCollection, getBlogArticleDocumentId(href)))
}
