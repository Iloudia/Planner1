import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../../utils/firebaseStorage"

const MAX_BLOG_IMAGE_SIZE = 8 * 1024 * 1024

const sanitizeFileName = (name: string) =>
  name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-")

export const uploadBlogImage = async (file: File, slug: string) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier sélectionné doit être une image.")
  }
  if (file.size > MAX_BLOG_IMAGE_SIZE) {
    throw new Error("L’image ne doit pas dépasser 8 Mo.")
  }

  const safeSlug = slug.replace(/[^a-zA-Z0-9-]+/g, "-") || "article"
  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`
  const imageRef = ref(storage, `blog-images/${safeSlug}/${fileName}`)
  await uploadBytes(imageRef, file, { contentType: file.type })
  return getDownloadURL(imageRef)
}
