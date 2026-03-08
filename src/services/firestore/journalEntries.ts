import {
  addDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"
import type { JournalEntry, JournalEntryInput } from "../../types/personalization"
import { journalEntriesCollectionRef, journalEntryDocRef } from "./userPaths"

type JournalEntryRecord = {
  dateKey: string
  mood?: JournalEntry["mood"]
  energy?: JournalEntry["energy"]
  keyword?: string
  question?: string
  questionAnswer?: string
  content?: string
  postFeeling?: JournalEntry["postFeeling"]
  positiveAnchor?: string
  positiveAnchorType?: JournalEntry["positiveAnchorType"]
  createdAt?: Timestamp | null
}

const mapJournalEntry = (id: string, record: JournalEntryRecord): JournalEntry => ({
  id,
  date: record.dateKey,
  mood: record.mood,
  energy: record.energy,
  keyword: record.keyword,
  question: record.question,
  questionAnswer: record.questionAnswer,
  content: record.content,
  postFeeling: record.postFeeling,
  positiveAnchor: record.positiveAnchor,
  positiveAnchorType: record.positiveAnchorType,
  createdAt: record.createdAt instanceof Timestamp ? record.createdAt.toMillis() : undefined,
})

export const subscribeToJournalEntries = (
  userId: string,
  onEntries: (entries: JournalEntry[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const entriesQuery = query(journalEntriesCollectionRef(userId), orderBy("dateKey", "desc"))
  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      onEntries(snapshot.docs.map((docSnap) => mapJournalEntry(docSnap.id, docSnap.data() as JournalEntryRecord)))
    },
    onError,
  )
}

export const createJournalEntry = async (userId: string, entry: JournalEntryInput) => {
  await addDoc(journalEntriesCollectionRef(userId), {
    dateKey: entry.date,
    mood: entry.mood ?? null,
    energy: entry.energy ?? null,
    keyword: entry.keyword ?? null,
    question: entry.question ?? null,
    questionAnswer: entry.questionAnswer ?? null,
    content: entry.content ?? null,
    postFeeling: entry.postFeeling ?? null,
    positiveAnchor: entry.positiveAnchor ?? null,
    positiveAnchorType: entry.positiveAnchorType ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const deleteJournalEntry = async (userId: string, entryId: string) => {
  await deleteDoc(journalEntryDocRef(userId, entryId))
}
