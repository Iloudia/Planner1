import { onSnapshot, setDoc } from "firebase/firestore"
import type { FirebaseUserDocument } from "../../models/firebase"
import { userDocRef } from "./userPaths"

const nowIso = () => new Date().toISOString()

const normalizeCardOrder = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  const seen = new Set<string>()
  const normalized: string[] = []

  value.forEach((entry) => {
    if (typeof entry !== "string") {
      return
    }
    const path = entry.trim()
    if (!path || seen.has(path)) {
      return
    }
    seen.add(path)
    normalized.push(path)
  })

  return normalized
}

const normalizeCardClickProgress = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return {}
  }

  const normalized: Record<string, number> = {}
  Object.entries(value).forEach(([path, count]) => {
    if (typeof path !== "string" || typeof count !== "number" || !Number.isFinite(count)) {
      return
    }
    const rounded = Math.max(0, Math.min(2, Math.floor(count)))
    if (rounded > 0) {
      normalized[path] = rounded
    }
  })

  return normalized
}

export type HomeCardsState = {
  order: string[]
  clickProgress: Record<string, number>
}

export type HomeCardsSnapshot = {
  state: HomeCardsState
  hasStoredOrder: boolean
  hasStoredClickProgress: boolean
}

export const subscribeToHomeCardsState = (
  userId: string,
  onState: (snapshot: HomeCardsSnapshot) => void,
  onError?: (error: Error) => void,
) =>
  onSnapshot(
    userDocRef(userId),
    (snapshot) => {
      const data = snapshot.data() as FirebaseUserDocument | undefined
      onState({
        state: {
          order: normalizeCardOrder(data?.homeCardOrder),
          clickProgress: normalizeCardClickProgress(data?.homeCardClickProgress),
        },
        hasStoredOrder: Object.prototype.hasOwnProperty.call(data ?? {}, "homeCardOrder"),
        hasStoredClickProgress: Object.prototype.hasOwnProperty.call(data ?? {}, "homeCardClickProgress"),
      })
    },
    (error) => {
      onError?.(error)
    },
  )

export const saveHomeCardsState = async (userId: string, state: HomeCardsState) => {
  await setDoc(
    userDocRef(userId),
    {
      homeCardOrder: normalizeCardOrder(state.order),
      homeCardClickProgress: normalizeCardClickProgress(state.clickProgress),
      updatedAt: nowIso(),
    },
    { merge: true },
  )
}
