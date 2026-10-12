import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useBlogPublishing } from "../context/BlogPublishingContext"

const BlogAdminActions = () => {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { articles, error } = useBlogPublishing()

  if (!isAdmin) return null

  const publishedCount = articles.filter((article) => article.status === "published").length

  return (
    <aside className="blog-admin-overview" aria-label="Gestion du blog">
      <div>
        <span>Espace administrateur</span>
        <strong>{articles.length} article{articles.length > 1 ? "s" : ""} · {publishedCount} publié{publishedCount > 1 ? "s" : ""}</strong>
        <p>Les articles portant la mention « Brouillon » sont visibles uniquement sur ton compte.</p>
        {error ? <p className="blog-admin-overview__error">La synchronisation est indisponible : {error}</p> : null}
      </div>
      <button type="button" className="blog-admin-button" onClick={() => navigate("/blog/nouvel-article")}>Créer un article</button>
    </aside>
  )
}

export default BlogAdminActions
