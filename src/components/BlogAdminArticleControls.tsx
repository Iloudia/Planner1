import { useEffect, useState, type ChangeEvent } from "react"
import { useAuth } from "../context/AuthContext"
import { uploadBlogImage } from "../services/firebase/blogImages"
import {
  getCurrentPublicationDate,
  saveBlogArticle,
  type BlogArticleStatus,
  type BlogCmsArticle,
} from "../services/firestore/blogArticles"
import BlogMarkdownContent from "../pages/Blog/BlogMarkdownContent"
import "./BlogAdminArticleControls.css"

type BlogArticleEditorProps = {
  article: BlogCmsArticle
  open: boolean
  onClose: () => void
  onSaved?: (article: BlogCmsArticle) => void
  allowIdentityEdit?: boolean
}

const BlogArticleEditor = ({ article, open, onClose, onSaved, allowIdentityEdit = false }: BlogArticleEditorProps) => {
  const [draft, setDraft] = useState(article)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setDraft(article)
    setImageFile(null)
    setImagePreview("")
    setError("")
  }, [article, open])

  useEffect(() => () => {
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  const update = <Key extends keyof BlogCmsArticle>(key: Key, value: BlogCmsArticle[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview)
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : "")
  }

  const persist = async (status: BlogArticleStatus) => {
    if (!draft.title.trim() || !draft.slug.trim() || !draft.content.trim()) {
      setError("Le titre, l’adresse et le contenu sont obligatoires.")
      return
    }
    if (status === "published" && !imageFile && !draft.imageUrl) {
      setError("Ajoute une image principale avant de publier l’article.")
      return
    }

    setIsSaving(true)
    setError("")
    try {
      const imageUrl = imageFile ? await uploadBlogImage(imageFile, draft.slug) : draft.imageUrl
      const categoryPaths: Record<BlogCmsArticle["category"], string> = {
        "Santé & Beauté": "sante-beaute",
        "Mode": "mode",
        "Mental": "mental",
        "Sport & Nutrition": "sport-nutrition",
        "Lifestyle": "lifestyle",
      }
      const normalizedSlug = draft.slug.trim().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      const href = allowIdentityEdit ? `/blog/${categoryPaths[draft.category]}/${normalizedSlug}` : draft.href
      const savedArticle = {
        ...draft,
        href,
        slug: normalizedSlug,
        imageUrl,
        publicationDate: status === "published" && draft.status !== "published"
          ? getCurrentPublicationDate()
          : draft.publicationDate,
        status,
        usesStaticImage: imageFile ? false : draft.usesStaticImage,
      }
      await saveBlogArticle(savedArticle)
      setDraft(savedArticle)
      setImageFile(null)
      setImagePreview("")
      if (onSaved) {
        onSaved(savedArticle)
      } else {
        onClose()
      }
    } catch (savingError) {
      setError(savingError instanceof Error ? savingError.message : "Impossible d’enregistrer l’article.")
    } finally {
      setIsSaving(false)
    }
  }

  const previewImage = imagePreview || draft.imageUrl

  if (!open) return null

  return (
    <div className="blog-editor" role="dialog" aria-modal="true" aria-labelledby="blog-editor-title">
      <button className="blog-editor__backdrop" type="button" aria-label="Fermer l’éditeur" onClick={onClose} />
      <section className="blog-editor__panel">
        <header className="blog-editor__header">
          <div>
            <span>Édition administrateur</span>
            <h2 id="blog-editor-title">Modifier l’article</h2>
          </div>
          <button type="button" className="blog-editor__close" onClick={onClose} aria-label="Fermer">×</button>
        </header>

        <div className="blog-editor__workspace">
          <form className="blog-editor__form" onSubmit={(event) => event.preventDefault()}>
            <label>
              Titre
              <input value={draft.title} onChange={(event) => update("title", event.target.value)} />
            </label>
            <div className="blog-editor__row">
              <label>
                Catégorie
                <select
                  value={draft.category}
                  disabled={!allowIdentityEdit}
                  onChange={(event) => update("category", event.target.value as BlogCmsArticle["category"])}
                >
                  <option>Santé &amp; Beauté</option>
                  <option>Mode</option>
                  <option>Mental</option>
                  <option>Sport &amp; Nutrition</option>
                  <option>Lifestyle</option>
                </select>
              </label>
              <label>
                Adresse de l’article
                <input value={draft.slug} disabled={!allowIdentityEdit} onChange={(event) => update("slug", event.target.value)} />
              </label>
            </div>
            <label>
              Résumé affiché sur les cartes
              <textarea rows={3} value={draft.description} onChange={(event) => update("description", event.target.value)} />
            </label>
            <div className="blog-editor__row">
              <label>
                Rubrique au-dessus du titre
                <input value={draft.eyebrow} onChange={(event) => update("eyebrow", event.target.value)} />
              </label>
              <label>
                Temps de lecture
                <input value={draft.readingTime} onChange={(event) => update("readingTime", event.target.value)} />
              </label>
            </div>
            <label>
              Date de publication
              <input type="date" value={draft.publicationDate} onChange={(event) => update("publicationDate", event.target.value)} />
            </label>
            <div className="blog-editor__image-field">
              <label>
                Image principale
                <input type="file" accept="image/*" onChange={handleImage} />
              </label>
              {previewImage ? <img src={previewImage} alt="Aperçu de l’image principale" /> : null}
            </div>
            <label>
              Texte alternatif de l’image
              <input value={draft.imageAlt} onChange={(event) => update("imageAlt", event.target.value)} />
            </label>
            <label>
              Contenu de l’article
              <span className="blog-editor__hint">Utilise ## pour un titre, **texte** pour du gras et * pour une liste.</span>
              <textarea className="blog-editor__content-input" value={draft.content} onChange={(event) => update("content", event.target.value)} />
            </label>
          </form>

          <aside className="blog-editor__preview" aria-label="Aperçu de l’article">
            <span className="blog-editor__preview-label">Aperçu en direct</span>
            {previewImage ? <img className="blog-editor__preview-image" src={previewImage} alt={draft.imageAlt} /> : null}
            <p className="blog-editor__preview-eyebrow">{draft.eyebrow || draft.category}</p>
            <h1>{draft.title || "Titre de l’article"}</h1>
            <p className="blog-editor__preview-time">{draft.readingTime}</p>
            <div className="mental-article__content"><BlogMarkdownContent content={draft.content} /></div>
          </aside>
        </div>

        {error ? <p className="blog-editor__error" role="alert">{error}</p> : null}
        <footer className="blog-editor__footer">
          <button type="button" className="blog-admin-button blog-admin-button--secondary" onClick={onClose} disabled={isSaving}>Annuler</button>
          <button type="button" className="blog-admin-button blog-admin-button--secondary" onClick={() => void persist("draft")} disabled={isSaving}>
            {draft.status === "published" ? "Mettre en brouillon" : "Enregistrer le brouillon"}
          </button>
          <button type="button" className="blog-admin-button" onClick={() => void persist("published")} disabled={isSaving}>
            {isSaving ? "Enregistrement…" : draft.status === "published" ? "Enregistrer et maintenir publié" : "Publier l’article"}
          </button>
        </footer>
      </section>
    </div>
  )
}

const BlogAdminArticleControls = ({ article }: { article: BlogCmsArticle }) => {
  const { isAdmin } = useAuth()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(article.status === "published")
  const [publishError, setPublishError] = useState("")

  useEffect(() => {
    setIsPublished(article.status === "published")
  }, [article.status])

  const publishArticle = async () => {
    if (isPublishing || isPublished) return

    setIsPublishing(true)
    setPublishError("")
    try {
      await saveBlogArticle({
        ...article,
        publicationDate: getCurrentPublicationDate(),
        status: "published",
      })
      setIsPublished(true)
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Impossible de publier l’article.")
    } finally {
      setIsPublishing(false)
    }
  }

  if (!isAdmin) return null

  return (
    <div className="blog-admin-toolbar" aria-label="Gestion de l’article" aria-busy={isPublishing}>
      <span className={`blog-admin-toolbar__status blog-admin-toolbar__status--${isPublished ? "published" : "draft"}`}>
        {isPublished ? "Publié" : "Brouillon"}
      </span>
      {!isPublished ? (
        <button
          type="button"
          className="blog-admin-button blog-admin-button--secondary"
          onClick={() => void publishArticle()}
          disabled={isPublishing}
        >
          {isPublishing ? "Publication…" : "Publier"}
        </button>
      ) : null}
      {publishError ? <span className="blog-admin-toolbar__error" role="alert">{publishError}</span> : null}
    </div>
  )
}

export { BlogArticleEditor }
export default BlogAdminArticleControls
