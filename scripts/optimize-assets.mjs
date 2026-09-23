import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const rootDir = process.cwd()
const assetsDir = path.join(rootDir, "src", "assets")
const publicDir = path.join(rootDir, "public")
const srcDir = path.join(rootDir, "src")
const maxRasterSide = 2200
const conversionConcurrency = 4
const webpOptions = {
  quality: 78,
  alphaQuality: 80,
  effort: 6,
}

const rasterExtensions = new Set([".jpg", ".jpeg", ".png"])
const shouldConvert = (fileName) => rasterExtensions.has(path.extname(fileName).toLowerCase())

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

async function runWithConcurrency(items, worker) {
  let nextIndex = 0
  const workers = Array.from({ length: Math.min(conversionConcurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex]
      nextIndex += 1
      await worker(item)
    }
  })
  await Promise.all(workers)
}

async function buildConversionPlan() {
  const files = await walk(assetsDir)
  const targets = files.filter(shouldConvert)
  const reservedOutputs = new Set(
    files
      .filter((file) => path.extname(file).toLowerCase() === ".webp")
      .map((file) => file.toLowerCase()),
  )
  const baseOutputCounts = new Map()

  for (const file of targets) {
    const baseOutput = file.replace(/\.(png|jpe?g)$/i, ".webp").toLowerCase()
    baseOutputCounts.set(baseOutput, (baseOutputCounts.get(baseOutput) ?? 0) + 1)
  }

  return targets.map((source) => {
    const baseOutput = source.replace(/\.(png|jpe?g)$/i, ".webp")
    const hasCollision = (baseOutputCounts.get(baseOutput.toLowerCase()) ?? 0) > 1 || reservedOutputs.has(baseOutput.toLowerCase())
    const sourceExtension = path.extname(source).slice(1).toLowerCase()
    const output = hasCollision
      ? source.replace(/\.(png|jpe?g)$/i, `-${sourceExtension}.webp`)
      : baseOutput

    return { source, output }
  })
}

async function convertImages(plan) {
  if (plan.length === 0) {
    console.log("No JPG or PNG assets found to convert.")
    return
  }

  await runWithConcurrency(plan, async ({ source, output }) => {
    await sharp(source)
      .rotate()
      .resize({ width: maxRasterSide, height: maxRasterSide, fit: "inside", withoutEnlargement: true })
      .webp(webpOptions)
      .toFile(output)
  })

  console.log(`Converted ${plan.length} site assets to WebP.`)
}

async function updateAssetReferences(plan) {
  if (plan.length === 0) {
    return
  }

  const files = await walk(srcDir)
  const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css"])
  const targets = files.filter((file) => textExtensions.has(path.extname(file).toLowerCase()))
  const replacements = plan.map(({ source, output }) => ({
    previous: path.relative(srcDir, source).split(path.sep).join("/"),
    next: path.relative(srcDir, output).split(path.sep).join("/"),
  }))

  let updated = 0
  for (const file of targets) {
    const raw = await fs.readFile(file, "utf8")
    let next = raw
    for (const replacement of replacements) {
      next = next.split(replacement.previous).join(replacement.next)
    }
    if (next !== raw) {
      await fs.writeFile(file, next, "utf8")
      updated += 1
    }
  }

  console.log(`Updated ${updated} source files to reference WebP assets.`)
}

async function removeOriginalImages(plan) {
  await Promise.all(plan.map(({ source }) => fs.unlink(source)))
  console.log(`Removed ${plan.length} replaced JPG and PNG assets.`)
}

async function optimizePublicPngs() {
  if (!(await exists(publicDir))) {
    return
  }

  const files = await walk(publicDir)
  const targets = files.filter((file) => path.extname(file).toLowerCase() === ".png")
  let optimized = 0

  for (const file of targets) {
    const original = await fs.readFile(file)
    const compressed = await sharp(original).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
    if (compressed.length < original.length) {
      await fs.writeFile(file, compressed)
      optimized += 1
    }
  }

  console.log(`Losslessly optimized ${optimized} public PNG files.`)
}

const conversionPlan = await buildConversionPlan()
await convertImages(conversionPlan)
await updateAssetReferences(conversionPlan)
await removeOriginalImages(conversionPlan)
await optimizePublicPngs()
