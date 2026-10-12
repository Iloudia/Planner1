import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { blogArticles, type BlogArticleMetadata } from "../pages/Blog/blogArticles"
import {
  subscribeToAllBlogArticles,
  subscribeToPublishedBlogArticles,
  type BlogCmsArticle,
} from "../services/firestore/blogArticles"

type BlogPublishingContextValue = {
  articles: BlogCmsArticle[]
  isLoading: boolean
  error: string
  getArticle: (href: string) => BlogCmsArticle | undefined
  isPublished: (href: string) => boolean
}

const BlogPublishingContext = createContext<BlogPublishingContextValue | undefined>(undefined)

const defaultEyebrow = (article: BlogArticleMetadata) => article.category

const staticToCmsArticle = (article: BlogArticleMetadata): BlogCmsArticle => {
  return {
    href: article.href,
    slug: article.href.split("/").filter(Boolean).at(-1) ?? "article",
    category: article.category,
    title: article.title,
    description: article.description,
    imageUrl: article.image,
    imageAlt: article.imageAlt,
    eyebrow: defaultEyebrow(article),
    readingTime: article.readingTime,
    publicationDate: article.publicationDate,
    content: "",
    status: "draft",
    isPersisted: false,
    usesStaticImage: true,
  }
}

export const BlogPublishingProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin, isAuthReady } = useAuth()
  const [remoteArticles, setRemoteArticles] = useState<BlogCmsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthReady) return

    setIsLoading(true)
    setError("")
    const subscribeToArticles = isAdmin ? subscribeToAllBlogArticles : subscribeToPublishedBlogArticles
    return subscribeToArticles(
      (nextArticles) => {
        setRemoteArticles(nextArticles)
        setIsLoading(false)
      },
      (subscriptionError) => {
        setRemoteArticles([])
        setError(subscriptionError.message)
        setIsLoading(false)
      },
    )
  }, [isAdmin, isAuthReady])

  const articles = useMemo(() => {
    if (!isAdmin) {
      const staticByHref = new Map(blogArticles.map((article) => [article.href, staticToCmsArticle(article)]))
      return remoteArticles.map((remote) => {
        const fallback = staticByHref.get(remote.href)
        return fallback
          ? { ...fallback, ...remote, imageUrl: remote.imageUrl || fallback.imageUrl }
          : remote
      }).sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
    }

    const remoteByHref = new Map(remoteArticles.map((article) => [article.href, article]))
    const staticArticles = blogArticles.map((article) => {
      const fallback = staticToCmsArticle(article)
      const remote = remoteByHref.get(article.href)
      if (!remote) return fallback
      remoteByHref.delete(article.href)
      return {
        ...fallback,
        ...remote,
        imageUrl: remote.imageUrl || fallback.imageUrl,
        imageAlt: remote.imageAlt || fallback.imageAlt,
        content: remote.content || fallback.content,
      }
    })

    return [...staticArticles, ...remoteByHref.values()]
      .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate))
  }, [isAdmin, remoteArticles])

  const articlesByHref = useMemo(() => new Map(articles.map((article) => [article.href, article])), [articles])

  const value = useMemo<BlogPublishingContextValue>(() => ({
    articles,
    isLoading: !isAuthReady || isLoading,
    error,
    getArticle: (href) => articlesByHref.get(href.replace(/\/+$/, "")),
    isPublished: (href) => articlesByHref.get(href.replace(/\/+$/, ""))?.status === "published",
  }), [articles, articlesByHref, error, isAuthReady, isLoading])

  return <BlogPublishingContext.Provider value={value}>{children}</BlogPublishingContext.Provider>
}

export const useBlogPublishing = () => {
  const context = useContext(BlogPublishingContext)
  if (!context) {
    throw new Error("useBlogPublishing doit être utilisé dans BlogPublishingProvider")
  }
  return context
}
