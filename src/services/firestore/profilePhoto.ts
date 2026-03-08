import { onSnapshot, setDoc } from "firebase/firestore"
import type { FirebaseUserDocument } from "../../models/firebase"
import { userDocRef } from "./userPaths"

export type UserProfilePhotoRecord = {
  url: string
  path?: string
}

const nowIso = () => new Date().toISOString()

export const subscribeToUserProfilePhoto = (
  userId: string,
  onPhoto: (photo: UserProfilePhotoRecord | null) => void,
  onError?: (error: Error) => void,
) =>
  onSnapshot(
    userDocRef(userId),
    (snapshot) => {
      const data = snapshot.data() as FirebaseUserDocument | undefined
      const url = data?.profilePhotoUrl ?? ""
      const path = data?.profilePhotoPath ?? undefined
      onPhoto(url ? { url, path: path || undefined } : null)
    },
    (error) => {
      onError?.(error)
    },
  )

export const saveUserProfilePhoto = async (userId: string, photo: UserProfilePhotoRecord) => {
  await setDoc(
    userDocRef(userId),
    {
      profilePhotoUrl: photo.url,
      profilePhotoPath: photo.path ?? null,
      updatedAt: nowIso(),
    },
    { merge: true },
  )
}

export const clearUserProfilePhoto = async (userId: string) => {
  await setDoc(
    userDocRef(userId),
    {
      profilePhotoUrl: null,
      profilePhotoPath: null,
      updatedAt: nowIso(),
    },
    { merge: true },
  )
}
