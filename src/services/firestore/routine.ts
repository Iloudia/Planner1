import {
  deleteDoc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  writeBatch,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"
import type { RoutineDailyProgress, RoutineRecord, RoutineSettings } from "../../types/personalization"
import {
  routineDailyProgressCollectionRef,
  routineDailyProgressDocRef,
  routineItemDocRef,
  routineItemsCollectionRef,
  userDocRef,
} from "./userPaths"
import { db } from "../../utils/firebaseFirestore"
import { toMillis } from "./shared"

type RoutineDoc = Omit<RoutineRecord, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type RoutineSettingsDoc = {
  routineDefaultsInitializedAt?: Timestamp | null
}

type RoutineDailyProgressDoc = Omit<RoutineDailyProgress, "updatedAt"> & {
  updatedAt?: Timestamp | null
}

export const subscribeToRoutineItems = (
  userId: string,
  onItems: (items: RoutineRecord[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const routineQuery = query(routineItemsCollectionRef(userId), orderBy("sortOrder", "asc"))
  return onSnapshot(
    routineQuery,
    (snapshot) => {
      onItems(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as RoutineDoc
          return {
            id: docSnap.id,
            period: data.period,
            title: data.title,
            detail: data.detail,
            isCompleted: data.isCompleted,
            isDefault: data.isDefault,
            sortOrder: data.sortOrder,
            createdAt: toMillis(data.createdAt),
            updatedAt: toMillis(data.updatedAt),
          }
        }),
      )
    },
    onError,
  )
}

export const saveRoutineItem = async (userId: string, item: RoutineRecord) => {
  await setDoc(
    routineItemDocRef(userId, item.id),
    {
      period: item.period,
      title: item.title,
      detail: item.detail ?? null,
      isCompleted: item.isCompleted,
      isDefault: item.isDefault,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt ? Timestamp.fromMillis(item.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteRoutineItem = async (userId: string, itemId: string) => {
  await deleteDoc(routineItemDocRef(userId, itemId))
}

export const saveRoutineItemOrder = async (userId: string, items: RoutineRecord[]) => {
  const batch = writeBatch(db)
  items.forEach((item) => {
    batch.set(
      routineItemDocRef(userId, item.id),
      {
        sortOrder: item.sortOrder,
      },
      { merge: true },
    )
  })
  await batch.commit()
}

export const subscribeToRoutineDailyProgress = (
  userId: string,
  onProgress: (progress: RoutineDailyProgress[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const progressQuery = query(routineDailyProgressCollectionRef(userId), orderBy("dateKey", "asc"))
  return onSnapshot(
    progressQuery,
    (snapshot) => {
      onProgress(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as RoutineDailyProgressDoc
          return {
            dateKey: data.dateKey || docSnap.id,
            completedItemIds: Array.isArray(data.completedItemIds) ? data.completedItemIds : [],
            plannedItemIds: Array.isArray(data.plannedItemIds) ? data.plannedItemIds : [],
            isComplete: Boolean(data.isComplete),
            updatedAt: toMillis(data.updatedAt),
          }
        }),
      )
    },
    onError,
  )
}

export const saveRoutineDailyProgress = async (userId: string, progress: RoutineDailyProgress) => {
  await setDoc(
    routineDailyProgressDocRef(userId, progress.dateKey),
    {
      dateKey: progress.dateKey,
      completedItemIds: progress.completedItemIds,
      plannedItemIds: progress.plannedItemIds,
      isComplete: progress.isComplete,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const getRoutineSettings = async (userId: string): Promise<RoutineSettings | null> => {
  const snapshot = await getDoc(userDocRef(userId))
  if (!snapshot.exists()) {
    return null
  }

  const data = snapshot.data() as RoutineSettingsDoc
  const seededAt = toMillis(data.routineDefaultsInitializedAt)
  if (!seededAt) {
    return null
  }

  return { seededAt }
}

export const saveRoutineSettings = async (userId: string, settings: RoutineSettings) => {
  await setDoc(
    userDocRef(userId),
    {
      routineDefaultsInitializedAt: Timestamp.fromMillis(settings.seededAt),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
