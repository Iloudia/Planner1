import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { BlogArticleEditor } from "../../components/BlogAdminArticleControls"
import type { BlogCmsArticle } from "../../services/firestore/blogArticles"

const BlogArticleCreatePage = () => {
  const navigate = useNavigate()
  const initialArticle = useMemo<BlogCmsArticle>(() => ({
    href: "/blog/mental/nouvel-article",
    slug: "nouvel-article",
    category: "Mental",
    title: "Nouvel article",
    description: "",
    imageUrl: "",
    imageAlt: "",
    eyebrow: "Mental",
    readingTime: "5 min de lecture",
    publicationDate: new Date().toISOString().slice(0, 10),
    content: "## Premier sous-titre\n\nCommence à écrire ton article ici.",
    status: "draft",
  }), [])

  return (
    <div className="blog-creation-page">
      <BlogArticleEditor
        article={initialArticle}
        open
        allowIdentityEdit
        onClose={() => navigate("/blog")}
        onSaved={(article) => navigate(article.href)}
      />
    </div>
  )
}

export default BlogArticleCreatePage
