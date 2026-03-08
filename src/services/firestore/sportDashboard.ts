import {
  deleteField,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"
import type { SportDashboardRecord, SportWeekBoardRecord } from "../../types/personalization"
import { sportDashboardDocRef, sportWeeklyBoardDocRef } from "./userPaths"
import { toMillis } from "./shared"

type SportDashboardDoc = {
  quickItems?: SportDashboardRecord["quickItems"]
  lifeCardMedia?: SportDashboardRecord["lifeCardMedia"]
  updatedAt?: Timestamp | null
}

type SportWeekBoardDoc = Omit<SportWeekBoardRecord, never> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

const emptyDashboard: SportDashboardRecord = {
  quickItems: [],
  lifeCardMedia: {},
}

export const subscribeToSportDashboard = (
  userId: string,
  onDashboard: (dashboard: SportDashboardRecord) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe =>
  onSnapshot(
    sportDashboardDocRef(userId),
    (snapshot) => {
      const data = snapshot.data() as SportDashboardDoc | undefined
      onDashboard(
        data
          ? {
              quickItems: Array.isArray(data.quickItems) ? data.quickItems : [],
              lifeCardMedia: data.lifeCardMedia ?? {},
            }
          : emptyDashboard,
      )
    },
    onError,
  )

export const subscribeToSportWeekBoard = (
  userId: string,
  weekKey: string,
  onBoard: (board: SportWeekBoardRecord | null) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe =>
  onSnapshot(
    sportWeeklyBoardDocRef(userId, weekKey),
    (snapshot) => {
      if (!snapshot.exists()) {
        onBoard(null)
        return
      }
      const data = snapshot.data() as SportWeekBoardDoc
      onBoard({
        weekKey: data.weekKey,
        weekStartDate: data.weekStartDate,
        days: Array.isArray(data.days) ? data.days : [],
      })
    },
    onError,
  )

export const saveSportDashboard = async (userId: string, dashboard: SportDashboardRecord) => {
  await setDoc(
    sportDashboardDocRef(userId),
    {
      quickItems: dashboard.quickItems,
      lifeCardMedia: dashboard.lifeCardMedia,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const saveSportWeekBoard = async (userId: string, board: SportWeekBoardRecord) => {
  await setDoc(
    sportWeeklyBoardDocRef(userId, board.weekKey),
    {
      weekKey: board.weekKey,
      weekStartDate: board.weekStartDate,
      days: board.days,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const clearSportLifeCardMedia = async (userId: string, key: keyof SportDashboardRecord["lifeCardMedia"]) => {
  await setDoc(
    sportDashboardDocRef(userId),
    {
      lifeCardMedia: {
        [key]: deleteField(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
