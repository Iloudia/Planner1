import {
  deleteDoc,
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
import type { WorkoutExercise, WorkoutSeriesItem, WorkoutSettings, WorkoutVideo } from "../../types/personalization"
import {
  workoutExerciseDocRef,
  workoutExercisesCollectionRef,
  workoutSeriesCollectionRef,
  workoutSeriesDocRef,
  workoutSettingsDocRef,
  workoutVideoDocRef,
  workoutVideosCollectionRef,
} from "./userPaths"
import { db } from "../../utils/firebase"
import { toMillis } from "./shared"

type WorkoutExerciseDoc = Omit<WorkoutExercise, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type WorkoutVideoDoc = Omit<WorkoutVideo, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type WorkoutSeriesDoc = Omit<WorkoutSeriesItem, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

type WorkoutSettingsDoc = WorkoutSettings & {
  updatedAt?: Timestamp | null
}

const mapExercise = (id: string, record: WorkoutExerciseDoc): WorkoutExercise => ({
  id,
  title: record.title,
  muscle: record.muscle,
  category: record.category,
  note: record.note,
  imageMode: record.imageMode,
  imageUrl: record.imageUrl,
  imagePath: record.imagePath,
  isDefault: record.isDefault,
  defaultKey: record.defaultKey,
  sortOrder: record.sortOrder,
  createdAt: toMillis(record.createdAt),
  updatedAt: toMillis(record.updatedAt),
})

const mapVideo = (id: string, record: WorkoutVideoDoc): WorkoutVideo => ({
  id,
  title: record.title,
  url: record.url,
  thumbnailMode: record.thumbnailMode,
  thumbnailUrl: record.thumbnailUrl,
  thumbnailPath: record.thumbnailPath,
  duration: record.duration,
  isDefault: record.isDefault,
  sortOrder: record.sortOrder,
  createdAt: toMillis(record.createdAt),
  updatedAt: toMillis(record.updatedAt),
})

const mapSeries = (id: string, record: WorkoutSeriesDoc): WorkoutSeriesItem => ({
  id,
  exerciseId: record.exerciseId,
  label: record.label,
  completed: record.completed,
  weight: record.weight,
  sortOrder: record.sortOrder,
  createdAt: toMillis(record.createdAt),
  updatedAt: toMillis(record.updatedAt),
})

export const subscribeToWorkoutExercises = (
  userId: string,
  onExercises: (exercises: WorkoutExercise[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const exercisesQuery = query(workoutExercisesCollectionRef(userId), orderBy("sortOrder", "asc"))
  return onSnapshot(
    exercisesQuery,
    (snapshot) => {
      onExercises(snapshot.docs.map((docSnap) => mapExercise(docSnap.id, docSnap.data() as WorkoutExerciseDoc)))
    },
    onError,
  )
}

export const subscribeToWorkoutVideos = (
  userId: string,
  onVideos: (videos: WorkoutVideo[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const videosQuery = query(workoutVideosCollectionRef(userId), orderBy("sortOrder", "asc"))
  return onSnapshot(
    videosQuery,
    (snapshot) => {
      onVideos(snapshot.docs.map((docSnap) => mapVideo(docSnap.id, docSnap.data() as WorkoutVideoDoc)))
    },
    onError,
  )
}

export const subscribeToWorkoutSeries = (
  userId: string,
  onSeries: (series: WorkoutSeriesItem[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe => {
  const seriesQuery = query(workoutSeriesCollectionRef(userId), orderBy("sortOrder", "asc"))
  return onSnapshot(
    seriesQuery,
    (snapshot) => {
      onSeries(snapshot.docs.map((docSnap) => mapSeries(docSnap.id, docSnap.data() as WorkoutSeriesDoc)))
    },
    onError,
  )
}

export const subscribeToWorkoutSettings = (
  userId: string,
  onSettings: (settings: WorkoutSettings | null) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe =>
  onSnapshot(
    workoutSettingsDocRef(userId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onSettings(null)
        return
      }
      const data = snapshot.data() as WorkoutSettingsDoc
      onSettings({ lastResetDate: data.lastResetDate })
    },
    onError,
  )

export const saveWorkoutExercise = async (userId: string, exercise: WorkoutExercise) => {
  await setDoc(
    workoutExerciseDocRef(userId, exercise.id),
    {
      title: exercise.title,
      muscle: exercise.muscle,
      category: exercise.category,
      note: exercise.note,
      imageMode: exercise.imageMode,
      imageUrl: exercise.imageUrl ?? null,
      imagePath: exercise.imagePath ?? null,
      isDefault: exercise.isDefault,
      defaultKey: exercise.defaultKey ?? null,
      sortOrder: exercise.sortOrder,
      createdAt: exercise.createdAt ? Timestamp.fromMillis(exercise.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const saveWorkoutVideo = async (userId: string, video: WorkoutVideo) => {
  await setDoc(
    workoutVideoDocRef(userId, video.id),
    {
      title: video.title,
      url: video.url,
      thumbnailMode: video.thumbnailMode,
      thumbnailUrl: video.thumbnailUrl,
      thumbnailPath: video.thumbnailPath ?? null,
      duration: video.duration ?? null,
      isDefault: video.isDefault,
      sortOrder: video.sortOrder,
      createdAt: video.createdAt ? Timestamp.fromMillis(video.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const saveWorkoutSeriesItem = async (userId: string, series: WorkoutSeriesItem) => {
  await setDoc(
    workoutSeriesDocRef(userId, series.id),
    {
      exerciseId: series.exerciseId,
      label: series.label,
      completed: series.completed,
      weight: series.weight ?? null,
      sortOrder: series.sortOrder,
      createdAt: series.createdAt ? Timestamp.fromMillis(series.createdAt) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const deleteWorkoutExercise = async (userId: string, exerciseId: string) => {
  await deleteDoc(workoutExerciseDocRef(userId, exerciseId))
}

export const deleteWorkoutVideo = async (userId: string, videoId: string) => {
  await deleteDoc(workoutVideoDocRef(userId, videoId))
}

export const deleteWorkoutSeriesItem = async (userId: string, seriesId: string) => {
  await deleteDoc(workoutSeriesDocRef(userId, seriesId))
}

export const saveWorkoutSettings = async (userId: string, settings: WorkoutSettings) => {
  await setDoc(
    workoutSettingsDocRef(userId),
    {
      lastResetDate: settings.lastResetDate,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const resetWorkoutSeriesCompletion = async (userId: string, items: WorkoutSeriesItem[]) => {
  const batch = writeBatch(db)
  items.forEach((item) => {
    batch.set(
      workoutSeriesDocRef(userId, item.id),
      {
        completed: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  })
  await batch.commit()
}
