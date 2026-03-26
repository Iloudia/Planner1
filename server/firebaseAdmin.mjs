import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const trimEnv = (value) => String(value || "").trim()

const configuredProjectId = trimEnv(process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID)

const parseServiceAccountJson = (value) => {
  const normalized = trimEnv(value)
  if (!normalized) {
    return null
  }

  try {
    return JSON.parse(normalized)
  } catch {
    return null
  }
}

const parseServiceAccountBase64 = (value) => {
  const normalized = trimEnv(value)
  if (!normalized) {
    return null
  }

  try {
    return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"))
  } catch {
    return null
  }
}

const normalizeServiceAccount = (value) => {
  if (!value || typeof value !== "object") {
    return null
  }

  const projectId = trimEnv(value.project_id || value.projectId || configuredProjectId)
  const clientEmail = trimEnv(value.client_email || value.clientEmail)
  const privateKey = trimEnv(value.private_key || value.privateKey).replace(/\\n/g, "\n")

  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  }
}

const serviceAccountFromEnv =
  normalizeServiceAccount(parseServiceAccountJson(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON)) ||
  normalizeServiceAccount(parseServiceAccountBase64(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64)) ||
  normalizeServiceAccount({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  })

const hasApplicationDefaultCredentials = Boolean(trimEnv(process.env.GOOGLE_APPLICATION_CREDENTIALS))

export const isFirebaseAdminConfigured = Boolean(
  configuredProjectId && (serviceAccountFromEnv || hasApplicationDefaultCredentials),
)

let adminApp = null

const getFirebaseAdminApp = () => {
  if (!isFirebaseAdminConfigured) {
    throw new Error("firebase-admin-not-configured")
  }

  if (adminApp) {
    return adminApp
  }

  const existing = getApps().find((app) => app.name === "planner-admin")
  if (existing) {
    adminApp = existing
    return existing
  }

  const options = {
    projectId: configuredProjectId,
    credential: serviceAccountFromEnv ? cert(serviceAccountFromEnv) : applicationDefault(),
  }

  adminApp = initializeApp(options, "planner-admin")
  return adminApp
}

export const getFirebaseAdminAuth = () => getAuth(getFirebaseAdminApp())
export const getFirebaseAdminDb = () => getFirestore(getFirebaseAdminApp())
