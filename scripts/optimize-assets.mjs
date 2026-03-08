import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const rootDir = process.cwd()
const assetsDir = path.join(rootDir, "src", "assets")
const srcDir = path.join(rootDir, "src")
const maxRasterSide = 2200
const webpOptions = {
  quality: 78,
  alphaQuality: 80,
  effort: 6,
}

const rasterExtensions = new Set([".jpg", ".jpeg", ".png"])
const shouldConvert = (fileName) => rasterExtensions.has(path.extname(fileName).toLowerCase())
const toWebpPath = (filePath) => filePath.replace(/\.(png|jpe?g)$/i, ".webp")

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)))
      continue
    }
    files.push(fullPath)
  }
  return files
}

async function convertImages() {
  const files = await walk(assetsDir)
  const targets = files.filter((file) => shouldConvert(file))

  if (targets.length === 0) {
    console.log("No raster assets found to convert.")
    return
  }

  let converted = 0
  let reused = 0

  await Promise.all(
    targets.map(async (file) => {
      const output = toWebpPath(file)
      if (await exists(output)) {
        reused += 1
        return
      }

      await sharp(file)
        .rotate()
        .resize({ width: maxRasterSide, height: maxRasterSide, fit: "inside", withoutEnlargement: true })
        .webp(webpOptions)
        .toFile(output)
      converted += 1
    }),
  )

  console.log(`Converted ${converted} assets to WebP and kept ${reused} existing WebP files.`)
}

const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"])
const assetRefRegex = /(assets\/[^"']+?)\.(png|jpe?g)\b/gi

async function updateAssetReferences() {
  const files = await walk(srcDir)
  const targets = files.filter((file) => textExtensions.has(path.extname(file).toLowerCase()))

  let updated = 0
  for (const file of targets) {
    const raw = await fs.readFile(file, "utf8")
    const next = raw.replace(assetRefRegex, "$1.webp")
    if (next !== raw) {
      await fs.writeFile(file, next, "utf8")
      updated += 1
    }
  }

  console.log(`Updated ${updated} source files to reference WebP assets.`)
}

async function optimizeWebpAssets() {
  const files = await walk(assetsDir)
  const targets = files.filter((file) => path.extname(file).toLowerCase() === ".webp")

  let optimized = 0
  await Promise.all(
    targets.map(async (file) => {
      const buffer = await sharp(file)
        .rotate()
        .resize({ width: maxRasterSide, height: maxRasterSide, fit: "inside", withoutEnlargement: true })
        .webp(webpOptions)
        .toBuffer()

      await fs.writeFile(file, buffer)
      optimized += 1
    }),
  )

  console.log(`Optimized ${optimized} WebP assets.`)
}

async function removeOriginalImages() {
  const files = await walk(assetsDir)
  const targets = files.filter((file) => shouldConvert(file))

  let removed = 0
  await Promise.all(
    targets.map(async (file) => {
      if (!(await exists(toWebpPath(file)))) {
        return
      }

      await fs.unlink(file)
      removed += 1
    }),
  )

  console.log(`Removed ${removed} original raster assets.`)
}

await convertImages()
await updateAssetReferences()
await optimizeWebpAssets()
await removeOriginalImages()
