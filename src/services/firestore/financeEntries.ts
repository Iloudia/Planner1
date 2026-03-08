import {
  addDoc,
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
import type { FinanceEntry, FinanceEntryInput, MonthlySnapshot } from "../../types/personalization"
import {
  financeEntriesCollectionRef,
  financeEntryDocRef,
  financeMonthlySnapshotDocRef,
  financeMonthlySnapshotsCollectionRef,
} from "./userPaths"

type FinanceEntryRecord = {
  label: string
  amount: number
  dateKey: string
  monthKey: string
  direction: FinanceEntry["direction"]
  category?: FinanceEntry["category"]
  createdAt?: Timestamp | null
}

type FinanceMonthlySnapshotRecord = MonthlySnapshot

const getMonthKeyFromISO = (value: string) => (value.length >= 7 ? value.slice(0, 7) : "")

const mapFinanceEntry = (id: string, record: FinanceEntryRecord): FinanceEntry => ({
  id,
  label: record.label,
  amount: record.amount,
  date: record.dateKey,
  direction: record.direction,
  category: record.category,
})

export const subscribeToFinanceEntries = (
  userId: string,
  onEntries: (entries: FinanceEntry[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const entriesQuery = query(financeEntriesCollectionRef(userId), orderBy("dateKey", "desc"))
  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      onEntries(snapshot.docs.map((docSnap) => mapFinanceEntry(docSnap.id, docSnap.data() as FinanceEntryRecord)))
    },
    onError,
  )
}

export const subscribeToFinanceMonthlySnapshots = (
  userId: string,
  onSnapshots: (snapshots: Record<string, MonthlySnapshot>) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe =>
  onSnapshot(
    financeMonthlySnapshotsCollectionRef(userId),
    (snapshot) => {
      const snapshots = snapshot.docs.reduce<Record<string, MonthlySnapshot>>((accumulator, docSnap) => {
        accumulator[docSnap.id] = docSnap.data() as FinanceMonthlySnapshotRecord
        return accumulator
      }, {})
      onSnapshots(snapshots)
    },
    onError,
  )

export const createFinanceEntry = async (userId: string, entry: FinanceEntryInput) => {
  await addDoc(financeEntriesCollectionRef(userId), {
    label: entry.label,
    amount: entry.amount,
    dateKey: entry.date,
    monthKey: getMonthKeyFromISO(entry.date),
    direction: entry.direction,
    category: entry.category ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const deleteFinanceEntry = async (userId: string, entryId: string) => {
  await deleteDoc(financeEntryDocRef(userId, entryId))
}

export const saveFinanceMonthlySnapshot = async (userId: string, monthKey: string, startingAmount: number) => {
  await setDoc(
    financeMonthlySnapshotDocRef(userId, monthKey),
    {
      startingAmount,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteFinanceMonthlySnapshot = async (userId: string, monthKey: string) => {
  await deleteDoc(financeMonthlySnapshotDocRef(userId, monthKey))
}
