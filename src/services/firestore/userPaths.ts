import { collection, doc } from "firebase/firestore"
import { db } from "../../utils/firebase"

export const userDocRef = (userId: string) => doc(db, "users", userId)

export const calendarEventsCollectionRef = (userId: string) => collection(userDocRef(userId), "calendarEvents")
export const calendarEventDocRef = (userId: string, eventId: string) => doc(calendarEventsCollectionRef(userId), eventId)

export const journalEntriesCollectionRef = (userId: string) => collection(userDocRef(userId), "journalEntries")
export const journalEntryDocRef = (userId: string, entryId: string) => doc(journalEntriesCollectionRef(userId), entryId)

export const financeEntriesCollectionRef = (userId: string) => collection(userDocRef(userId), "financeEntries")
export const financeEntryDocRef = (userId: string, entryId: string) => doc(financeEntriesCollectionRef(userId), entryId)

export const financeMonthlySnapshotsCollectionRef = (userId: string) =>
  collection(userDocRef(userId), "financeMonthlySnapshots")
export const financeMonthlySnapshotDocRef = (userId: string, monthKey: string) =>
  doc(financeMonthlySnapshotsCollectionRef(userId), monthKey)

export const wishlistCategoriesCollectionRef = (userId: string) => collection(userDocRef(userId), "wishlistCategories")
export const wishlistCategoryDocRef = (userId: string, categoryId: string) =>
  doc(wishlistCategoriesCollectionRef(userId), categoryId)

export const wishlistItemsCollectionRef = (userId: string) => collection(userDocRef(userId), "wishlistItems")
export const wishlistItemDocRef = (userId: string, itemId: string) => doc(wishlistItemsCollectionRef(userId), itemId)

export const sportDashboardCollectionRef = (userId: string) => collection(userDocRef(userId), "sportDashboard")
export const sportDashboardDocRef = (userId: string) => doc(sportDashboardCollectionRef(userId), "current")

export const sportWeeklyBoardsCollectionRef = (userId: string) => collection(userDocRef(userId), "sportWeeklyBoards")
export const sportWeeklyBoardDocRef = (userId: string, weekKey: string) => doc(sportWeeklyBoardsCollectionRef(userId), weekKey)

export const workoutExercisesCollectionRef = (userId: string) => collection(userDocRef(userId), "workoutExercises")
export const workoutExerciseDocRef = (userId: string, exerciseId: string) =>
  doc(workoutExercisesCollectionRef(userId), exerciseId)

export const workoutSeriesCollectionRef = (userId: string) => collection(userDocRef(userId), "workoutSeries")
export const workoutSeriesDocRef = (userId: string, seriesId: string) => doc(workoutSeriesCollectionRef(userId), seriesId)

export const workoutVideosCollectionRef = (userId: string) => collection(userDocRef(userId), "workoutVideos")
export const workoutVideoDocRef = (userId: string, videoId: string) => doc(workoutVideosCollectionRef(userId), videoId)

export const workoutSettingsCollectionRef = (userId: string) => collection(userDocRef(userId), "workoutSettings")
export const workoutSettingsDocRef = (userId: string) => doc(workoutSettingsCollectionRef(userId), "current")

export const selfLoveDraftCollectionRef = (userId: string) => collection(userDocRef(userId), "selfLoveDraft")
export const selfLoveDraftDocRef = (userId: string) => doc(selfLoveDraftCollectionRef(userId), "current")

export const selfLovePhotosCollectionRef = (userId: string) => collection(userDocRef(userId), "selfLovePhotos")
export const selfLovePhotoDocRef = (userId: string, slotId: string) => doc(selfLovePhotosCollectionRef(userId), slotId)

export const bodyGoalPhotosCollectionRef = (userId: string) => collection(userDocRef(userId), "bodyGoalPhotos")
export const bodyGoalPhotoDocRef = (userId: string, slotId: string) => doc(bodyGoalPhotosCollectionRef(userId), slotId)

export const goalsDailyTrackersCollectionRef = (userId: string) => collection(userDocRef(userId), "goalsDailyTrackers")
export const goalsDailyTrackerDocRef = (userId: string) => doc(goalsDailyTrackersCollectionRef(userId), "current")

export const selfLoveQualitiesCollectionRef = (userId: string) => collection(userDocRef(userId), "selfLoveQualities")
export const selfLoveQualityDocRef = (userId: string, qualityId: string) =>
  doc(selfLoveQualitiesCollectionRef(userId), qualityId)

export const selfLoveThoughtsCollectionRef = (userId: string) => collection(userDocRef(userId), "selfLoveThoughts")
export const selfLoveThoughtDocRef = (userId: string, thoughtId: string) =>
  doc(selfLoveThoughtsCollectionRef(userId), thoughtId)

export const selfLoveArchiveEntriesCollectionRef = (userId: string) =>
  collection(userDocRef(userId), "selfLoveArchiveEntries")
export const selfLoveArchiveEntryDocRef = (userId: string, entryId: string) =>
  doc(selfLoveArchiveEntriesCollectionRef(userId), entryId)

export const routineItemsCollectionRef = (userId: string) => collection(userDocRef(userId), "routineItems")
export const routineItemDocRef = (userId: string, itemId: string) => doc(routineItemsCollectionRef(userId), itemId)

export const dietWeeklyPlansCollectionRef = (userId: string) => collection(userDocRef(userId), "dietWeeklyPlans")
export const dietWeeklyPlanDocRef = (userId: string, weekKey: string) => doc(dietWeeklyPlansCollectionRef(userId), weekKey)

export const dietCustomRecipesCollectionRef = (userId: string) => collection(userDocRef(userId), "dietCustomRecipes")
export const dietCustomRecipeDocRef = (userId: string, recipeId: string) =>
  doc(dietCustomRecipesCollectionRef(userId), recipeId)

export const dietPreferencesCollectionRef = (userId: string) => collection(userDocRef(userId), "dietPreferences")
export const dietPreferencesDocRef = (userId: string) => doc(dietPreferencesCollectionRef(userId), "current")
