import {
  deleteDoc,
  onSnapshot,
  orderBy,
  setDoc,
  query,
  Timestamp,
  updateDoc,
  serverTimestamp,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore"
import type { ScheduledTask } from "../../data/sampleData"
import { calendarEventDocRef, calendarEventsCollectionRef } from "./userPaths"

type CalendarEventRecord = {
  title: string
  dateKey: string
  start: string
  end: string
  color: string
  tag: string
  startsAt?: Timestamp | null
  endsAt?: Timestamp | null
}

const parseDateTime = (dateKey: string, time: string) => {
  const [year, month, day] = dateKey.split("-").map(Number)
  const [hours, minutes] = time.split(":").map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0, 0, 0)
}

const toCalendarEventPayload = (task: ScheduledTask) => ({
  title: task.title,
  dateKey: task.date,
  start: task.start,
  end: task.end,
  color: task.color,
  tag: task.tag,
  startsAt: Timestamp.fromDate(parseDateTime(task.date, task.start)),
  endsAt: Timestamp.fromDate(parseDateTime(task.date, task.end)),
  updatedAt: serverTimestamp(),
})

const mapCalendarEvent = (id: string, record: CalendarEventRecord): ScheduledTask => ({
  id,
  title: record.title,
  start: record.start,
  end: record.end,
  date: record.dateKey,
  color: record.color,
  tag: record.tag,
})

export const subscribeToCalendarEvents = (
  userId: string,
  onTasks: (tasks: ScheduledTask[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const eventsQuery = query(calendarEventsCollectionRef(userId), orderBy("startsAt", "asc"))
  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      onTasks(snapshot.docs.map((docSnap) => mapCalendarEvent(docSnap.id, docSnap.data() as CalendarEventRecord)))
    },
    onError,
  )
}

export const createCalendarEvent = async (userId: string, task: ScheduledTask) => {
  await setDoc(calendarEventDocRef(userId, task.id), {
    ...toCalendarEventPayload(task),
    createdAt: serverTimestamp(),
  })
}

export const updateCalendarEvent = async (userId: string, task: ScheduledTask) => {
  await updateDoc(calendarEventDocRef(userId, task.id), toCalendarEventPayload(task))
}

export const deleteCalendarEvent = async (userId: string, eventId: string) => {
  await deleteDoc(calendarEventDocRef(userId, eventId))
}
