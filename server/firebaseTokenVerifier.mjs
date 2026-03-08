import { decodeProtectedHeader, importX509, jwtVerify } from "jose"

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_ADMIN_PROJECT_ID || "meandrituals-72041"
const issuer = `https://securetoken.google.com/${projectId}`
const certsUrl = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"

let certCache = {
  expiresAt: 0,
  certs: {},
  importedKeys: new Map(),
}

const parseMaxAge = (cacheControl) => {
  const match = String(cacheControl || "").match(/max-age=(\d+)/i)
  return match ? Number(match[1]) : 3600
}

const loadCerts = async (forceRefresh = false) => {
  const now = Date.now()
  if (!forceRefresh && certCache.expiresAt > now && Object.keys(certCache.certs).length > 0) {
    return certCache.certs
  }

  const response = await fetch(certsUrl)
  if (!response.ok) {
    throw new Error("firebase-public-certs-fetch-failed")
  }

  const certs = (await response.json()) ?? {}
  certCache = {
    expiresAt: now + parseMaxAge(response.headers.get("cache-control")) * 1000,
    certs,
    importedKeys: new Map(),
  }
  return certs
}

const getKeyForToken = async (token) => {
  const { alg, kid } = decodeProtectedHeader(token)
  if (alg !== "RS256" || !kid) {
    throw new Error("firebase-token-header-invalid")
  }

  const certs = await loadCerts()
  let pem = certs[kid]

  if (!pem) {
    const refreshedCerts = await loadCerts(true)
    pem = refreshedCerts[kid]
  }

  if (!pem) {
    throw new Error("firebase-token-kid-not-found")
  }

  if (!certCache.importedKeys.has(kid)) {
    certCache.importedKeys.set(kid, await importX509(pem, "RS256"))
  }

  return certCache.importedKeys.get(kid)
}

export const isFirebaseTokenVerificationConfigured = Boolean(projectId)

export const verifyFirebaseIdToken = async (token) => {
  if (!projectId) {
    throw new Error("firebase-project-id-not-configured")
  }

  const key = await getKeyForToken(token)
  const { payload } = await jwtVerify(token, key, {
    issuer,
    audience: projectId,
  })

  if (typeof payload.sub !== "string" || payload.sub.length === 0 || payload.sub.length > 128) {
    throw new Error("firebase-token-sub-invalid")
  }

  return {
    ...payload,
    uid: payload.sub,
  }
}
