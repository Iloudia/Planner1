import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import type {
  MediaRef,
  SelfLoveArchiveEntry,
  SelfLoveBestFriendSnapshot,
  SelfLoveDraft,
  SelfLoveInnerChildSnapshot,
  SelfLovePhotoSlot,
  SelfLoveQuality,
  SelfLoveThought,
} from "../types/personalization"
import { createClientId } from "../utils/clientId"
import { importLegacySelfLoveArchivesIfNeeded } from "../services/firestore/plannerMigrations"
import {
  deleteSelfLoveArchiveEntry,
  deleteSelfLovePhotoSlot,
  deleteSelfLoveQuality,
  deleteSelfLoveThought,
  saveSelfLoveArchiveEntry,
  saveSelfLoveDraft,
  saveSelfLovePhotoSlot,
  saveSelfLoveQuality,
  saveSelfLoveThought,
  subscribeToSelfLoveArchiveEntries,
  subscribeToSelfLoveDraft,
  subscribeToSelfLovePhotos,
  subscribeToSelfLoveQualities,
  subscribeToSelfLoveThoughts,
} from "../services/firestore/selfLove"

const SELF_LOVE_LOAD_ERROR = "Impossible de charger votre espace self-love."
const SELF_LOVE_MUTATION_ERROR = "Impossible de mettre à jour votre espace self-love."
const PHOTO_SLOT_COUNT = 6

const getDefaultFutureOpenDate = () => {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  return date.toISOString().slice(0, 10)
}

const defaultDraft = (): SelfLoveDraft => ({
  letterTo: "Moi du futur",
  letterFrom: "Moi du présent",
  letterBody: "Cher moi, merci de continuer à te choisir chaque jour...",
  kittyLetterBody:
    "Je suis fier de toi. Merci de te relever, de rire, de pleurer et de croire encore en toi quand c'est compliqué.",
  futureLetterTo: "Moi du futur",
  futureLetterFrom: "Moi du présent",
  futureLetterBody:
    "Si tu lis ces mots, c'est que tu as tenu bon. J'espère que tu te souviens de nos promesses et de nos petites victoires.",
  futureLetterOpenDate: getDefaultFutureOpenDate(),
  innerChildMessage: "",
  innerChildReassurance: "",
  innerChildNeededWords: "",
  bestFriendAdvice: "",
  bestFriendSelfTalk: "",
  bestFriendSelfKindness: "",
})

const defaultQualities: SelfLoveQuality[] = [
  { id: "quality-1", text: "Mon sourire illumine les gens.", sortOrder: 0, isDefault: true },
  { id: "quality-2", text: "J'ai une force tranquille.", sortOrder: 1, isDefault: true },
  { id: "quality-3", text: "Je sais écouter avec le cœur.", sortOrder: 2, isDefault: true },
]

const defaultThoughts: SelfLoveThought[] = [
  { id: "thought-1", text: "Je ne suis pas assez.", sortOrder: 0, isDefault: true },
  { id: "thought-2", text: "Je dois tout contrôler.", sortOrder: 1, isDefault: true },
  { id: "thought-3", text: "Je ne mérite pas ce que j'ai.", sortOrder: 2, isDefault: true },
]

const buildPhotoSlots = (items: SelfLovePhotoSlot[]) => {
  const byId = new Map(items.map((item) => [item.id, item]))
  return Array.from({ length: PHOTO_SLOT_COUNT }, (_, index) => {
    const id = `photo-${index}`
    return (
      byId.get(id) ?? {
        id,
        slotIndex: index,
      }
    )
  })
}

const useUserSelfLove = () => {
  const { isAuthReady, userId, userEmail } = useAuth()
  const [draft, setDraft] = useState<SelfLoveDraft>(defaultDraft())
  const [photos, setPhotos] = useState<SelfLovePhotoSlot[]>(buildPhotoSlots([]))
  const [qualities, setQualities] = useState<SelfLoveQuality[]>([])
  const [thoughts, setThoughts] = useState<SelfLoveThought[]>([])
  const [archiveEntries, setArchiveEntries] = useState<SelfLoveArchiveEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const seedAttemptRef = useRef(false)
  const migrationAttemptRef = useRef(false)
  const [migrationResolved, setMigrationResolved] = useState(false)

  useEffect(() => {
    if (!isAuthReady) {
      setIsLoading(true)
      return
    }

    if (!userId) {
      setDraft(defaultDraft())
      setPhotos(buildPhotoSlots([]))
      setQualities([])
      setThoughts([])
      setArchiveEntries([])
      setError(null)
      setIsLoading(false)
      seedAttemptRef.current = false
      migrationAttemptRef.current = false
      setMigrationResolved(false)
      return
    }

    let draftLoaded = false
    let photosLoaded = false
    let qualitiesLoaded = false
    let thoughtsLoaded = false
    let archiveLoaded = false
    const syncLoadingState = () => setIsLoading(!(draftLoaded && photosLoaded && qualitiesLoaded && thoughtsLoaded && archiveLoaded))

    setDraft(defaultDraft())
    setPhotos(buildPhotoSlots([]))
    setQualities([])
    setThoughts([])
    setArchiveEntries([])
    setError(null)
    setIsLoading(true)
    seedAttemptRef.current = false
    migrationAttemptRef.current = false
    setMigrationResolved(false)

    const unsubscribeDraft = subscribeToSelfLoveDraft(
      userId,
      (nextDraft) => {
        draftLoaded = true
        setDraft(nextDraft ?? defaultDraft())
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Self-love draft load failed", loadError)
        draftLoaded = true
        setDraft(defaultDraft())
        setError(SELF_LOVE_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribePhotos = subscribeToSelfLovePhotos(
      userId,
      (nextPhotos) => {
        photosLoaded = true
        setPhotos(buildPhotoSlots(nextPhotos))
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Self-love photos load failed", loadError)
        photosLoaded = true
        setPhotos(buildPhotoSlots([]))
        setError(SELF_LOVE_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeQualities = subscribeToSelfLoveQualities(
      userId,
      (nextQualities) => {
        qualitiesLoaded = true
        setQualities(nextQualities)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Self-love qualities load failed", loadError)
        qualitiesLoaded = true
        setQualities([])
        setError(SELF_LOVE_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeThoughts = subscribeToSelfLoveThoughts(
      userId,
      (nextThoughts) => {
        thoughtsLoaded = true
        setThoughts(nextThoughts)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Self-love thoughts load failed", loadError)
        thoughtsLoaded = true
        setThoughts([])
        setError(SELF_LOVE_LOAD_ERROR)
        syncLoadingState()
      },
    )

    const unsubscribeArchive = subscribeToSelfLoveArchiveEntries(
      userId,
      (nextEntries) => {
        archiveLoaded = true
        setArchiveEntries(nextEntries)
        setError(null)
        syncLoadingState()
      },
      (loadError) => {
        console.error("Self-love archive load failed", loadError)
        archiveLoaded = true
        setArchiveEntries([])
        setError(SELF_LOVE_LOAD_ERROR)
        syncLoadingState()
      },
    )

    return () => {
      unsubscribeDraft()
      unsubscribePhotos()
      unsubscribeQualities()
      unsubscribeThoughts()
      unsubscribeArchive()
    }
  }, [isAuthReady, userId])

  useEffect(() => {
    if (!userId || !userEmail || isLoading || migrationAttemptRef.current) {
      return
    }
    migrationAttemptRef.current = true
    void importLegacySelfLoveArchivesIfNeeded(userId, userEmail, archiveEntries.length > 0)
      .catch((migrationError) => {
        console.error("Self-love archive migration failed", migrationError)
        setError(SELF_LOVE_MUTATION_ERROR)
      })
      .finally(() => {
        setMigrationResolved(true)
      })
  }, [archiveEntries.length, isLoading, userEmail, userId])

  useEffect(() => {
    if (!userId || isLoading || seedAttemptRef.current || !migrationResolved) {
      return
    }

    const hasUserData =
      archiveEntries.length > 0 ||
      photos.some((slot) => slot.imageUrl || slot.imagePath) ||
      qualities.length > 0 ||
      thoughts.length > 0

    if (hasUserData) {
      return
    }

    seedAttemptRef.current = true
    void (async () => {
      try {
        await Promise.all([
          ...defaultQualities.map((quality) => saveSelfLoveQuality(userId, quality)),
          ...defaultThoughts.map((thought) => saveSelfLoveThought(userId, thought)),
        ])
      } catch (seedError) {
        console.error("Self-love seed failed", seedError)
        setError(SELF_LOVE_MUTATION_ERROR)
      }
    })()
  }, [archiveEntries.length, isLoading, migrationResolved, photos, qualities.length, thoughts.length, userId])

  const mutate = useCallback(
    async (operation: () => Promise<void>) => {
      try {
        setError(null)
        await operation()
      } catch (mutationError) {
        console.error("Self-love mutation failed", mutationError)
        setError(SELF_LOVE_MUTATION_ERROR)
        throw mutationError
      }
    },
    [],
  )

  const updateDraft = useCallback(
    async (updates: Partial<SelfLoveDraft>) => {
      if (!userId) return
      await mutate(() => saveSelfLoveDraft(userId, { ...draft, ...updates }))
    },
    [draft, mutate, userId],
  )

  const replacePhoto = useCallback(
    async (slotId: string, media: MediaRef) => {
      if (!userId) return
      const slotIndex = Number(slotId.replace("photo-", ""))
      await mutate(() =>
        saveSelfLovePhotoSlot(userId, {
          id: slotId,
          slotIndex: Number.isFinite(slotIndex) ? slotIndex : 0,
          imageUrl: media.url,
          imagePath: media.path,
        }),
      )
    },
    [mutate, userId],
  )

  const clearPhoto = useCallback(
    async (slotId: string) => {
      if (!userId) return
      await mutate(() => deleteSelfLovePhotoSlot(userId, slotId))
    },
    [mutate, userId],
  )

  const addQuality = useCallback(
    async (text: string) => {
      if (!userId) return null
      const trimmed = text.trim()
      if (!trimmed) return null
      const quality: SelfLoveQuality = {
        id: createClientId("quality"),
        text: trimmed,
        sortOrder: Date.now(),
        isDefault: false,
        createdAt: Date.now(),
      }
      await mutate(() => saveSelfLoveQuality(userId, quality))
      return quality.id
    },
    [mutate, userId],
  )

  const removeQuality = useCallback(
    async (qualityId: string) => {
      if (!userId) return
      await mutate(() => deleteSelfLoveQuality(userId, qualityId))
    },
    [mutate, userId],
  )

  const addThought = useCallback(
    async (text: string) => {
      if (!userId) return null
      const trimmed = text.trim()
      if (!trimmed) return null
      const thought: SelfLoveThought = {
        id: createClientId("thought"),
        text: trimmed,
        sortOrder: Date.now(),
        isDefault: false,
        createdAt: Date.now(),
      }
      await mutate(() => saveSelfLoveThought(userId, thought))
      return thought.id
    },
    [mutate, userId],
  )

  const removeThought = useCallback(
    async (thoughtId: string) => {
      if (!userId) return
      await mutate(() => deleteSelfLoveThought(userId, thoughtId))
    },
    [mutate, userId],
  )

  const saveArchiveEntry = useCallback(
    async (entry: SelfLoveArchiveEntry) => {
      if (!userId) return
      await mutate(() => saveSelfLoveArchiveEntry(userId, entry))
    },
    [mutate, userId],
  )

  const saveInnerChildArchive = useCallback(
    async (snapshot: SelfLoveInnerChildSnapshot) => {
      const entry: SelfLoveArchiveEntry = {
        id: createClientId("self-love"),
        entryType: "innerChild",
        template: "classic",
        body: [snapshot.message, snapshot.reassurance, snapshot.neededWords].filter(Boolean).join("\n\n"),
        innerChild: snapshot,
        createdAt: Date.now(),
      }
      await saveArchiveEntry(entry)
      return entry.id
    },
    [saveArchiveEntry],
  )

  const saveBestFriendArchive = useCallback(
    async (snapshot: SelfLoveBestFriendSnapshot) => {
      const entry: SelfLoveArchiveEntry = {
        id: createClientId("self-love"),
        entryType: "bestFriend",
        template: "kitty",
        body: [snapshot.advice, snapshot.selfTalk, snapshot.selfKindness].filter(Boolean).join("\n\n"),
        bestFriend: snapshot,
        createdAt: Date.now(),
      }
      await saveArchiveEntry(entry)
      return entry.id
    },
    [saveArchiveEntry],
  )

  const saveLetterArchive = useCallback(
    async (input: { template: "classic" | "kitty"; to?: string; from?: string; body: string }) => {
      const entry: SelfLoveArchiveEntry = {
        id: createClientId("self-love"),
        entryType: "letter",
        template: input.template,
        to: input.to,
        from: input.from,
        body: input.body,
        createdAt: Date.now(),
      }
      await saveArchiveEntry(entry)
      return entry.id
    },
    [saveArchiveEntry],
  )

  const saveFutureLetterArchive = useCallback(
    async (input: { to?: string; from?: string; body: string; openDate?: string }) => {
      const entry: SelfLoveArchiveEntry = {
        id: createClientId("self-love"),
        entryType: "letter",
        template: "classic",
        to: input.to,
        from: input.from,
        body: input.body,
        openDate: input.openDate,
        createdAt: Date.now(),
      }
      await saveArchiveEntry(entry)
      return entry.id
    },
    [saveArchiveEntry],
  )

  const sealFutureLetter = useCallback(
    async (input: { to?: string; from?: string; body: string; openDate: string }) => {
      const entry: SelfLoveArchiveEntry = {
        id: createClientId("self-love"),
        entryType: "letter",
        template: "classic",
        to: input.to,
        from: input.from,
        body: input.body,
        openDate: input.openDate,
        sealedAt: new Date().toISOString(),
        createdAt: Date.now(),
      }
      await saveArchiveEntry(entry)
      await updateDraft({
        futureLetterBody: "",
        futureLetterOpenDate: getDefaultFutureOpenDate(),
      })
      return entry.id
    },
    [saveArchiveEntry, updateDraft],
  )

  const deleteArchive = useCallback(
    async (entryId: string) => {
      if (!userId) return
      await mutate(() => deleteSelfLoveArchiveEntry(userId, entryId))
    },
    [mutate, userId],
  )

  return useMemo(
    () => ({
      draft,
      photos,
      qualities,
      thoughts,
      archiveEntries,
      isLoading,
      error,
      updateDraft,
      replacePhoto,
      clearPhoto,
      addQuality,
      removeQuality,
      addThought,
      removeThought,
      saveInnerChildArchive,
      saveBestFriendArchive,
      saveLetterArchive,
      saveFutureLetterArchive,
      sealFutureLetter,
      deleteArchiveEntry: deleteArchive,
    }),
    [
      addQuality,
      addThought,
      archiveEntries,
      clearPhoto,
      deleteArchive,
      draft,
      error,
      isLoading,
      photos,
      qualities,
      removeQuality,
      removeThought,
      replacePhoto,
      saveBestFriendArchive,
      saveFutureLetterArchive,
      saveInnerChildArchive,
      saveLetterArchive,
      sealFutureLetter,
      thoughts,
      updateDraft,
    ],
  )
}

export default useUserSelfLove
