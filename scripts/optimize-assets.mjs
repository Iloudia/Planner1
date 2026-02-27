import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const rootDir = process.cwd()
const assetsDir = path.join(rootDir, "src", "assets")
const srcDir = path.join(rootDir, "src")

const imageExtensions = new Set([".jpg", ".jpeg"])

const shouldConvert = (fileName) => imageExtensions.has(path.extname(fileName).toLowerCase())

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
    console.log("No JPG/JPEG assets found to convert.")
    return
  }

  await Promise.all(
    targets.map(async (file) => {
      const output = file.replace(/\.(jpe?g)$/i, ".webp")
      await sharp(file).webp({ quality: 80 }).toFile(output)
    }),
  )

  console.log(`Converted ${targets.length} assets to WebP.`)
}

const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"])
const assetRefRegex = /(assets\/[^"']+?)\.(jpe?g)\b/gi

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

await convertImages()
await updateAssetReferences()
