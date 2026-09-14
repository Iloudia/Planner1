import { formatPublicationDate, getBlogArticleByHref } from "./blogArticles"

type BlogPublicationDateProps = {
  href: string
  className?: string
}

const BlogPublicationDate = ({ href, className }: BlogPublicationDateProps) => {
  const article = getBlogArticleByHref(href)

  if (!article) return null

  return (
    <p className={className}>
      Publié le <time dateTime={article.publicationDate}>{formatPublicationDate(article.publicationDate)}</time>.
    </p>
  )
}

export default BlogPublicationDate
