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
import type { BodyGoalPhotoSlot } from "../../types/personalization"
import { bodyGoalPhotoDocRef, bodyGoalPhotosCollectionRef } from "./userPaths"
import { toMillis } from "./shared"

type BodyGoalPhotoDoc = Omit<BodyGoalPhotoSlot, "id" | "updatedAt"> & {
  updatedAt?: Timestamp | null
}

export const subscribeToBodyGoalPhotos = (
  userId: string,
  onPhotos: (photos: BodyGoalPhotoSlot[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const photosQuery = query(bodyGoalPhotosCollectionRef(userId), orderBy("slotIndex", "asc"))
  return onSnapshot(
    photosQuery,
    (snapshot) => {
      onPhotos(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as BodyGoalPhotoDoc
          return {
            id: docSnap.id,
            slotIndex: data.slotIndex,
            imageUrl: data.imageUrl ?? undefined,
            imagePath: data.imagePath ?? undefined,
            updatedAt: toMillis(data.updatedAt),
          }
        }),
      )
    },
    onError,
  )
}

export const saveBodyGoalPhotoSlot = async (userId: string, slot: BodyGoalPhotoSlot) => {
  await setDoc(
    bodyGoalPhotoDocRef(userId, slot.id),
    {
      slotIndex: slot.slotIndex,
      imageUrl: slot.imageUrl ?? null,
      imagePath: slot.imagePath ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteBodyGoalPhotoSlot = async (userId: string, slotId: string) => {
  await deleteDoc(bodyGoalPhotoDocRef(userId, slotId))
}
