import { formatPublicationDate, getBlogArticleByHref } from "./blogArticles"
import { useBlogPublishing } from "../../context/BlogPublishingContext"

type BlogPublicationDateProps = {
  href: string
  className?: string
}

const BlogPublicationDate = ({ href, className }: BlogPublicationDateProps) => {
  const { getArticle } = useBlogPublishing()
  const article = getArticle(href)
  const staticArticle = getBlogArticleByHref(href)
  const publicationDate = article?.publicationDate || staticArticle?.publicationDate

  if (!publicationDate) return null

  return (
    <p className={className}>
      {article?.status === "draft" ? "Date prévue : " : "Publié le "}
      <time dateTime={publicationDate}>{formatPublicationDate(publicationDate)}</time>.
    </p>
  )
}

export default BlogPublicationDate
