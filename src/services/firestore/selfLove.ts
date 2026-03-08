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
import type {
  SelfLoveArchiveEntry,
  SelfLoveDraft,
  SelfLovePhotoSlot,
  SelfLoveQuality,
  SelfLoveThought,
} from "../../types/personalization"
import {
  selfLoveArchiveEntriesCollectionRef,
  selfLoveArchiveEntryDocRef,
  selfLoveDraftDocRef,
  selfLovePhotoDocRef,
  selfLovePhotosCollectionRef,
  selfLoveQualitiesCollectionRef,
  selfLoveQualityDocRef,
  selfLoveThoughtDocRef,
  selfLoveThoughtsCollectionRef,
} from "./userPaths"
import { toMillis } from "./shared"

type SelfLoveDraftDoc = SelfLoveDraft & {
  updatedAt?: Timestamp | null
}

type SelfLovePhotoDoc = Omit<SelfLovePhotoSlot, "id" | "updatedAt"> & {
  updatedAt?: Timestamp | null
}

type SelfLoveQualityDoc = Omit<SelfLoveQuality, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type SelfLoveThoughtDoc = Omit<SelfLoveThought, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type SelfLoveArchiveEntryDoc = Omit<SelfLoveArchiveEntry, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export const subscribeToSelfLoveDraft = (
  userId: string,
  onDraft: (draft: SelfLoveDraft | null) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe =>
  onSnapshot(
    selfLoveDraftDocRef(userId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onDraft(null)
        return
      }
      const data = snapshot.data() as SelfLoveDraftDoc
      onDraft({
        letterTo: data.letterTo,
        letterFrom: data.letterFrom,
        letterBody: data.letterBody,
        kittyLetterBody: data.kittyLetterBody,
        futureLetterTo: data.futureLetterTo,
        futureLetterFrom: data.futureLetterFrom,
        futureLetterBody: data.futureLetterBody,
        futureLetterOpenDate: data.futureLetterOpenDate,
        innerChildMessage: data.innerChildMessage,
        innerChildReassurance: data.innerChildReassurance,
        innerChildNeededWords: data.innerChildNeededWords,
        bestFriendAdvice: data.bestFriendAdvice,
        bestFriendSelfTalk: data.bestFriendSelfTalk,
      })
    },
    onError,
  )

export const subscribeToSelfLovePhotos = (
  userId: string,
  onPhotos: (photos: SelfLovePhotoSlot[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const photosQuery = query(selfLovePhotosCollectionRef(userId), orderBy("slotIndex", "asc"))
  return onSnapshot(
    photosQuery,
    (snapshot) => {
      onPhotos(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as SelfLovePhotoDoc
          return {
            id: docSnap.id,
            slotIndex: data.slotIndex,
            imageUrl: data.imageUrl,
            imagePath: data.imagePath,
            updatedAt: toMillis(data.updatedAt),
          }
        }),
      )
    },
    onError,
  )
}

export const subscribeToSelfLoveQualities = (
  userId: string,
  onQualities: (qualities: SelfLoveQuality[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const qualitiesQuery = query(selfLoveQualitiesCollectionRef(userId), orderBy("sortOrder", "asc"))
  return onSnapshot(
    qualitiesQuery,
    (snapshot) => {
      onQualities(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as SelfLoveQualityDoc
          return {
            id: docSnap.id,
            text: data.text,
            sortOrder: data.sortOrder,
            isDefault: data.isDefault,
            createdAt: toMillis(data.createdAt),
            updatedAt: toMillis(data.updatedAt),
          }
        }),
      )
    },
    onError,
  )
}

export const subscribeToSelfLoveThoughts = (
  userId: string,
  onThoughts: (thoughts: SelfLoveThought[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const thoughtsQuery = query(selfLoveThoughtsCollectionRef(userId), orderBy("sortOrder", "asc"))
  return onSnapshot(
    thoughtsQuery,
    (snapshot) => {
      onThoughts(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as SelfLoveThoughtDoc
          return {
            id: docSnap.id,
            text: data.text,
            sortOrder: data.sortOrder,
            isDefault: data.isDefault,
            createdAt: toMillis(data.createdAt),
            updatedAt: toMillis(data.updatedAt),
          }
        }),
      )
    },
    onError,
  )
}

export const subscribeToSelfLoveArchiveEntries = (
  userId: string,
  onEntries: (entries: SelfLoveArchiveEntry[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const entriesQuery = query(selfLoveArchiveEntriesCollectionRef(userId), orderBy("createdAt", "desc"))
  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      onEntries(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as SelfLoveArchiveEntryDoc
          return {
            id: docSnap.id,
            entryType: data.entryType,
            template: data.template,
            to: data.to,
            from: data.from,
            body: data.body,
            openDate: data.openDate,
            sealedAt: data.sealedAt,
            innerChild: data.innerChild,
            bestFriend: data.bestFriend,
            createdAt: toMillis(data.createdAt),
            updatedAt: toMillis(data.updatedAt),
          }
        }),
      )
    },
    onError,
  )
}

export const saveSelfLoveDraft = async (userId: string, draft: SelfLoveDraft) => {
  await setDoc(
    selfLoveDraftDocRef(userId),
    {
      ...draft,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const saveSelfLovePhotoSlot = async (userId: string, slot: SelfLovePhotoSlot) => {
  await setDoc(
    selfLovePhotoDocRef(userId, slot.id),
    {
      slotIndex: slot.slotIndex,
      imageUrl: slot.imageUrl ?? null,
      imagePath: slot.imagePath ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteSelfLovePhotoSlot = async (userId: string, slotId: string) => {
  await deleteDoc(selfLovePhotoDocRef(userId, slotId))
}

export const saveSelfLoveQuality = async (userId: string, quality: SelfLoveQuality) => {
  await setDoc(
    selfLoveQualityDocRef(userId, quality.id),
    {
      text: quality.text,
      sortOrder: quality.sortOrder,
      isDefault: quality.isDefault,
      createdAt: quality.createdAt ? Timestamp.fromMillis(quality.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteSelfLoveQuality = async (userId: string, qualityId: string) => {
  await deleteDoc(selfLoveQualityDocRef(userId, qualityId))
}

export const saveSelfLoveThought = async (userId: string, thought: SelfLoveThought) => {
  await setDoc(
    selfLoveThoughtDocRef(userId, thought.id),
    {
      text: thought.text,
      sortOrder: thought.sortOrder,
      isDefault: thought.isDefault,
      createdAt: thought.createdAt ? Timestamp.fromMillis(thought.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteSelfLoveThought = async (userId: string, thoughtId: string) => {
  await deleteDoc(selfLoveThoughtDocRef(userId, thoughtId))
}

export const saveSelfLoveArchiveEntry = async (userId: string, entry: SelfLoveArchiveEntry) => {
  await setDoc(
    selfLoveArchiveEntryDocRef(userId, entry.id),
    {
      entryType: entry.entryType,
      template: entry.template ?? null,
      to: entry.to ?? null,
      from: entry.from ?? null,
      body: entry.body ?? null,
      openDate: entry.openDate ?? null,
      sealedAt: entry.sealedAt ?? null,
      innerChild: entry.innerChild ?? null,
      bestFriend: entry.bestFriend ?? null,
      createdAt: entry.createdAt ? Timestamp.fromMillis(entry.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteSelfLoveArchiveEntry = async (userId: string, entryId: string) => {
  await deleteDoc(selfLoveArchiveEntryDocRef(userId, entryId))
}
