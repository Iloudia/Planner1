import {
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"
import type { RoutineRecord } from "../../types/personalization"
import { routineItemDocRef, routineItemsCollectionRef } from "./userPaths"
import { toMillis } from "./shared"

type RoutineDoc = Omit<RoutineRecord, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
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
