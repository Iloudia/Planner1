import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const scopeDirectoryMap = {
  "profile-photo": "profile/photos",
  "wishlist-category-cover": "wishlist/categories",
  "wishlist-item-image": "wishlist/items",
  "sport-life-card": "sport/life-cards",
  "workout-exercise-image": "sport/workout/exercises",
  "workout-video-thumbnail": "sport/workout/video-thumbnails",
  "self-love-photo": "self-love/photos",
  "diet-custom-recipe-image": "diet/custom-recipes",
}

const ensureForwardSlashes = (value) => value.replace(/\\/g, "/")

const sanitizeSegment = (value, fallback = "media") => {
  const safe = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return safe || fallback
}

const joinPublicUrl = (baseUrl, relativePath) => {
  const normalizedBase = String(baseUrl || "/media").replace(/\/+$/g, "")
  const normalizedRelative = ensureForwardSlashes(relativePath).replace(/^\/+/g, "")
  return `${normalizedBase}/${normalizedRelative}`
}

export const isAllowedImageScope = (scope) => Object.prototype.hasOwnProperty.call(scopeDirectoryMap, scope)

export const storeImage = async ({
  buffer,
  uid,
  scope,
  entityId,
  mediaRootDir,
  publicBaseUrl,
}) => {
  const scopeDir = scopeDirectoryMap[scope]
  if (!scopeDir) {
    throw new Error("invalid-media-scope")
  }

  const safeEntityId = sanitizeSegment(entityId, "asset")
  const fileName = `${safeEntityId}-${crypto.randomUUID()}.webp`
  const relativePath = ensureForwardSlashes(path.join("users", uid, scopeDir, fileName))
  const absolutePath = path.resolve(mediaRootDir, relativePath)

  await fs.mkdir(path.dirname(absolutePath), { recursive: true })

  const image = sharp(buffer, { failOn: "none" }).rotate()
  const metadata = await image.metadata()
  const transformed = await image.resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toBuffer()

  await fs.writeFile(absolutePath, transformed)

  return {
    url: joinPublicUrl(publicBaseUrl, relativePath),
    path: relativePath,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    mimeType: "image/webp",
    sizeBytes: transformed.byteLength,
  }
}

export const deleteMediaFile = async ({ uid, relativePath, mediaRootDir }) => {
  const normalized = ensureForwardSlashes(String(relativePath || "")).replace(/^\/+/g, "")
  const expectedPrefix = `users/${uid}/`
  if (!normalized.startsWith(expectedPrefix)) {
    throw new Error("media-path-outside-user-scope")
  }

  const absolutePath = path.resolve(mediaRootDir, normalized)
  const mediaRoot = path.resolve(mediaRootDir)
  if (!absolutePath.startsWith(mediaRoot)) {
    throw new Error("media-path-outside-root")
  }

  try {
    await fs.unlink(absolutePath)
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return false
    }
    throw error
  }
  return true
}
