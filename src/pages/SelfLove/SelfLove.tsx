import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import stampLove from '../../assets/Timbre-1.png'
import stampKey from '../../assets/Timbre-2.png'
import heroImage from '../../assets/Self-love-image.jpeg'
import PageHeading from '../../components/PageHeading'
import usePersistentState from '../../hooks/usePersistentState'
import './SelfLove.css'
type SelfLovePhotoSlot = {
  id: string
  dataUrl: string | null
}
type SelfLoveQuality = {
  id: string
  text: string
}
type SelfLoveThought = {
  id: string
  text: string
}
type SelfLoveJournalEntry = {
  id: string
  text: string
  createdAt: string
}
type SelfLoveInnerChildSnapshot = {
  message: string
  reassurance: string
  neededWords: string
}
type SelfLoveBestFriendSnapshot = {
  advice: string
  selfTalk: string
}
type SelfLoveSavedLetter = {
  id: string
  template: 'classic' | 'kitty'
  to?: string
  from?: string
  body: string
  createdAt: string
  innerChild?: SelfLoveInnerChildSnapshot
  bestFriend?: SelfLoveBestFriendSnapshot
  entryType: 'letter' | 'innerChild' | 'bestFriend'
}
type SelfLoveState = {
  certificatePhoto: string | null
  photos: SelfLovePhotoSlot[]
  qualities: SelfLoveQuality[]
  thoughts: SelfLoveThought[]
  journal: SelfLoveJournalEntry[]
  letterTo: string
  letterFrom: string
  letterBody: string
  kittyLetterBody: string
  innerChildMessage: string
  innerChildReassurance: string
  innerChildNeededWords: string
  bestFriendAdvice: string
  bestFriendSelfTalk: string
  customAffirmations: string[]
  savedLetters: SelfLoveSavedLetter[]
}
const PHOTO_SLOT_COUNT = 6
const DEFAULT_CUSTOM_AFFIRMATIONS = [
  "J'apprends à me traiter avec douceur.",
  "Je mérite l'attention que je me donne.",
  'Je prends soin de moi un peu plus chaque jour.',
]
const createDefaultState = (): SelfLoveState => ({
  certificatePhoto: null,
  photos: Array.from({ length: PHOTO_SLOT_COUNT }, (_, index) => ({
    id: `photo-${index}`,
    dataUrl: null,
  })),
  qualities: [
    { id: 'quality-1', text: 'Mon sourire illumine les gens.' },
    { id: 'quality-2', text: "J'ai une force tranquille." },
    { id: 'quality-3', text: 'Je sais écouter avec le cœur.' },
  ],
  thoughts: [
    { id: 'thought-1', text: 'Je ne suis pas assez.' },
    { id: 'thought-2', text: 'Je dois tout contrôler.' },
    { id: 'thought-3', text: "Je ne mérite pas ce que j'ai." },
  ],
  journal: [],
  letterTo: 'Moi du futur',
  letterFrom: 'Moi du présent',
  letterBody: 'Cher moi, merci de continuer à te choisir chaque jour...',
  kittyLetterBody:
    "Je suis si fière de toi. Merci de te relever, de rire, de pleurer et de croire en toi-même quand c'est compliqué. Tu es doux, douce, courageux, courageuse et tellement lumineux, lumineuse.",
  innerChildMessage: '',
  innerChildReassurance: '',
  innerChildNeededWords: '',
  bestFriendAdvice: '',
  bestFriendSelfTalk: '',
  customAffirmations: [...DEFAULT_CUSTOM_AFFIRMATIONS],
  savedLetters: [],
})
const affirmations = [
  "Je m'offre la même douceur que je donne aux autres.",
  'Je suis déjà assez et je le reste à chaque souffle.',
  'Ma présence est un cadeau pour ce monde.',
  "Je choisis de me regarder avec de l'amour aujourd'hui.",
  'Je laisse ma lumière briller sans me cacher.',
  'Je suis digne de tendresse, de joie et de paix.',
]
const inspiringQuotes = [
  '"S’aimer soi-même est le début d’une histoire d’amour qui dure toute la vie." - Oscar Wilde',
  '"Tu es ton propre refuge. Tu es ton propre soleil."',
  '"Tu es le résultat de l’amour de toutes les femmes qui t’ont précédée."',
  '"N’oublie pas de t’émerveiller de ta force douce."',
  '"Tu es une œuvre en mouvement, magnifique à chaque étape."',
]
const KittyIllustration = () => (
  <svg viewBox="0 0 220 200" role="img" className="self-love-kitty-letter__cat">
    <defs>
      <linearGradient id="kittyBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fce7f3" />
        <stop offset="100%" stopColor="#f9a8d4" />
      </linearGradient>
      <linearGradient id="kittyCheek" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f472b6" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#fb7185" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path
      d="M38 60c0-20 12-34 24-46l10 24 28-18 28 18 10-24c12 12 24 26 24 46s-4 48-6 70-26 48-56 48-54-26-56-48-6-50-6-70z"
      fill="url(#kittyBody)"
      stroke="#f472b6"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <ellipse cx="78" cy="96" rx="10" ry="14" fill="#fff" opacity="0.45" />
    <ellipse cx="142" cy="96" rx="10" ry="14" fill="#fff" opacity="0.45" />
    <circle cx="92" cy="110" r="9" fill="url(#kittyCheek)" />
    <circle cx="128" cy="110" r="9" fill="url(#kittyCheek)" />
    <rect x="96" y="128" width="28" height="4" rx="2" fill="#fb7185" />
    <path d="M86 144c8 8 40 8 48 0" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M70 118c-10 2-18 6-20 10m18 8c-8 4-16 6-24 4" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
    <path d="M150 118c10 2 18 6 20 10m-18 8c8 4 16 6 24 4" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
    <path
      d="M62 164c-2 10 26 30 46 30s48-20 46-30"
      stroke="#f472b6"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)
const STORAGE_KEY = 'planner.selfLove'
const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
const normalizeState = (value: unknown): SelfLoveState => {
  const base = createDefaultState()
  if (!value || typeof value !== 'object') {
    return base
  }
  const source = value as Partial<SelfLoveState>
  const photos = Array.isArray(source.photos)
    ? source.photos.slice(0, PHOTO_SLOT_COUNT).map((photo, index) => ({
        id: typeof photo?.id === 'string' ? photo.id : `photo-${index}`,
        dataUrl: typeof photo?.dataUrl === 'string' ? photo.dataUrl : null,
      }))
    : base.photos
  const qualities = Array.isArray(source.qualities)
    ? source.qualities
        .filter((item): item is SelfLoveQuality => !!item && typeof item.id === 'string' && typeof item.text === 'string')
        .map((item) => ({ id: item.id, text: item.text }))
    : base.qualities
  const thoughts = Array.isArray(source.thoughts)
    ? source.thoughts
        .filter((item): item is SelfLoveThought => !!item && typeof item.id === 'string' && typeof item.text === 'string')
        .map((item) => ({ id: item.id, text: item.text }))
    : base.thoughts
  const journal = Array.isArray(source.journal)
    ? source.journal
        .filter(
          (item): item is SelfLoveJournalEntry =>
            !!item && typeof item.id === 'string' && typeof item.text === 'string' && typeof item.createdAt === 'string',
        )
        .map((item) => ({ id: item.id, text: item.text, createdAt: item.createdAt }))
    : base.journal
  const normalizedAffirmations = Array.isArray(source.customAffirmations)
    ? source.customAffirmations.map((value) => (typeof value === 'string' ? value : '')).slice(0, 3)
    : base.customAffirmations
  while (normalizedAffirmations.length < base.customAffirmations.length) {
    normalizedAffirmations.push(base.customAffirmations[normalizedAffirmations.length])
  }
  let letterTo = typeof source.letterTo === 'string' ? source.letterTo : base.letterTo
  let letterFrom = typeof source.letterFrom === 'string' ? source.letterFrom : base.letterFrom
  if (letterTo === 'Moi du futur' && letterFrom === 'Moi du present') {
    letterTo = 'Moi du présent'
    letterFrom = 'Moi du futur'
  }
  const savedLetters = Array.isArray(source.savedLetters)
    ? source.savedLetters
        .filter(
          (item): item is SelfLoveSavedLetter =>
            !!item &&
            (item.template === 'classic' || item.template === 'kitty') &&
            typeof item.id === 'string' &&
            typeof item.body === 'string' &&
            typeof item.createdAt === 'string',
        )
        .map((item) => ({
          id: item.id,
          template: item.template,
          to: typeof item.to === 'string' ? item.to : undefined,
          from: typeof item.from === 'string' ? item.from : undefined,
          body: item.body,
          createdAt: item.createdAt,
          innerChild:
            item.innerChild &&
            typeof item.innerChild === 'object' &&
            typeof item.innerChild.message === 'string' &&
            typeof item.innerChild.reassurance === 'string' &&
            typeof item.innerChild.neededWords === 'string'
              ? {
                  message: item.innerChild.message,
                  reassurance: item.innerChild.reassurance,
                  neededWords: item.innerChild.neededWords,
                }
              : undefined,
          bestFriend:
            item.bestFriend &&
            typeof item.bestFriend === 'object' &&
            typeof item.bestFriend.advice === 'string' &&
            typeof item.bestFriend.selfTalk === 'string'
              ? {
                  advice: item.bestFriend.advice,
                  selfTalk: item.bestFriend.selfTalk,
                }
              : undefined,
          entryType: item.entryType === 'innerChild' || item.entryType === 'bestFriend' ? item.entryType : 'letter',
        }))
    : base.savedLetters
  return {
    certificatePhoto: typeof source.certificatePhoto === 'string' ? source.certificatePhoto : base.certificatePhoto,
    photos,
    qualities,
    thoughts,
    journal,
    letterTo,
    letterFrom,
    letterBody: typeof source.letterBody === 'string' ? source.letterBody : base.letterBody,
    kittyLetterBody: typeof source.kittyLetterBody === 'string' ? source.kittyLetterBody : base.kittyLetterBody,
    innerChildMessage: typeof source.innerChildMessage === 'string' ? source.innerChildMessage : base.innerChildMessage,
    innerChildReassurance:
      typeof source.innerChildReassurance === 'string' ? source.innerChildReassurance : base.innerChildReassurance,
    innerChildNeededWords:
      typeof source.innerChildNeededWords === 'string' ? source.innerChildNeededWords : base.innerChildNeededWords,
    bestFriendAdvice: typeof source.bestFriendAdvice === 'string' ? source.bestFriendAdvice : base.bestFriendAdvice,
    bestFriendSelfTalk:
      typeof source.bestFriendSelfTalk === 'string' ? source.bestFriendSelfTalk : base.bestFriendSelfTalk,
    customAffirmations: normalizedAffirmations,
    savedLetters,
  }
}
const SelfLovePage = () => {
  const [state, setState] = usePersistentState<SelfLoveState>(STORAGE_KEY, createDefaultState)
  const [qualityDraft, setQualityDraft] = useState('')
  const [thoughtDraft, setThoughtDraft] = useState('')
  const [journalDraft, setJournalDraft] = useState('')
  const [releasingThoughtIds, setReleasingThoughtIds] = useState<Set<string>>(new Set())
  const [letterTemplate, setLetterTemplate] = useState<'classic' | 'kitty'>('classic')
  const [letterArchiveOpen, setLetterArchiveOpen] = useState(false)
  const [selectedLetterYear, setSelectedLetterYear] = useState<string | null>(null)
  const [selectedLetterDay, setSelectedLetterDay] = useState<string | null>(null)
  const [letterSaveConfirmationVisible, setLetterSaveConfirmationVisible] = useState(false)
  const letterSaveConfirmationTimeout = useRef<number | null>(null)
  const [exerciseSaveConfirmationVisible, setExerciseSaveConfirmationVisible] = useState(false)
  const exerciseSaveConfirmationTimeout = useRef<number | null>(null)
  const safeState = useMemo(() => normalizeState(state), [state])
  useEffect(() => {
    document.body.classList.add('self-love-page--gradient')
    return () => {
      document.body.classList.remove('self-love-page--gradient')
      if (letterSaveConfirmationTimeout.current !== null) {
        window.clearTimeout(letterSaveConfirmationTimeout.current)
      }
      if (exerciseSaveConfirmationTimeout.current !== null) {
        window.clearTimeout(exerciseSaveConfirmationTimeout.current)
      }
    }
  }, [])
  const certificateImage = useMemo(() => {
    if (safeState.certificatePhoto) {
      return safeState.certificatePhoto
    }
    return safeState.photos.find((photo) => photo.dataUrl)?.dataUrl ?? null
  }, [safeState.certificatePhoto, safeState.photos])
  const affirmationOfDay = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10)
    const hash = todayKey.split('').reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0)
    return affirmations[hash % affirmations.length]
  }, [])
  const quoteOfDay = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10)
    const hash = todayKey
      .split('')
      .reverse()
      .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0)
    return inspiringQuotes[hash % inspiringQuotes.length]
  }, [])
  const lettersByDate = useMemo(() => {
    const map = new Map<string, SelfLoveSavedLetter[]>()
    safeState.savedLetters.forEach((letter) => {
      const dateKey = new Date(letter.createdAt).toISOString().slice(0, 10)
      const current = map.get(dateKey) ?? []
      current.push(letter)
      map.set(dateKey, current)
    })
    return Array.from(map.entries())
      .map(([date, letters]) => ({
        date,
        displayDate: formatDate(date),
        letters: [...letters].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
      }))
      .sort((a, b) => (a.date > b.date ? -1 : 1))
  }, [safeState.savedLetters])
  const lettersByYear = useMemo(() => {
    const map = new Map<
      string,
      { date: string; displayDate: string; letters: SelfLoveSavedLetter[] }[]
    >()
    lettersByDate.forEach((group) => {
      const year = group.date.slice(0, 4)
      const collection = map.get(year) ?? []
      collection.push(group)
      map.set(year, collection)
    })
    return Array.from(map.entries())
      .map(([year, groups]) => ({
        year,
        totalLetters: groups.reduce((sum, group) => sum + group.letters.length, 0),
        dates: groups,
      }))
      .sort((a, b) => (a.year > b.year ? -1 : 1))
  }, [lettersByDate])
  const selectedLetterYearGroup = useMemo(
    () => lettersByYear.find((group) => group.year === selectedLetterYear) ?? null,
    [lettersByYear, selectedLetterYear],
  )
  const activeLetterDayGroup = useMemo(() => {
    if (!selectedLetterYearGroup || !selectedLetterDay) {
      return null
    }
    return selectedLetterYearGroup.dates.find((group) => group.date === selectedLetterDay) ?? null
  }, [selectedLetterYearGroup, selectedLetterDay])
  useEffect(() => {
    if (!letterArchiveOpen) {
      setSelectedLetterYear(null)
      setSelectedLetterDay(null)
    }
  }, [letterArchiveOpen])
  useEffect(() => {
    if (selectedLetterYear && !lettersByYear.some((group) => group.year === selectedLetterYear)) {
      setSelectedLetterYear(null)
      setSelectedLetterDay(null)
    }
  }, [lettersByYear, selectedLetterYear])
  useEffect(() => {
    if (
      selectedLetterDay &&
      (!selectedLetterYearGroup || !selectedLetterYearGroup.dates.some((group) => group.date === selectedLetterDay))
    ) {
      setSelectedLetterDay(null)
    }
  }, [selectedLetterYearGroup, selectedLetterDay])
  const handlePhotoChange = (slotId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      setState((previous) => {
        const current = normalizeState(previous)
        return {
          ...current,
          photos: current.photos.map((photo) => (photo.id === slotId ? { ...photo, dataUrl: result } : photo)),
        }
      })
    }
    reader.readAsDataURL(file)
  }
  const handleClearPhoto = (slotId: string) => {
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        photos: current.photos.map((photo) => (photo.id === slotId ? { ...photo, dataUrl: null } : photo)),
      }
    })
  }
  const handleAddQuality = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = qualityDraft.trim()
    if (trimmed.length === 0) {
      return
    }
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        qualities: [{ id: `quality-${Date.now()}`, text: trimmed }, ...current.qualities],
      }
    })
    setQualityDraft('')
  }
  const handleRemoveQuality = (qualityId: string) => {
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        qualities: current.qualities.filter((quality) => quality.id !== qualityId),
      }
    })
  }
  const handleAddThought = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = thoughtDraft.trim()
    if (trimmed.length === 0) {
      return
    }
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        thoughts: [...current.thoughts, { id: `thought-${Date.now()}`, text: trimmed }],
      }
    })
    setThoughtDraft('')
  }
  const handleReleaseThought = (thoughtId: string) => {
    setReleasingThoughtIds((previous) => new Set(previous).add(thoughtId))
    window.setTimeout(() => {
      setState((previous) => {
        const current = normalizeState(previous)
        return {
          ...current,
          thoughts: current.thoughts.filter((thought) => thought.id !== thoughtId),
        }
      })
      setReleasingThoughtIds((previous) => {
        const next = new Set(previous)
        next.delete(thoughtId)
        return next
      })
    }, 620)
  }
  const handleAddJournalEntry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = journalDraft.trim()
    if (trimmed.length === 0) {
      return
    }
    const entry: SelfLoveJournalEntry = {
      id: `entry-${Date.now()}`,
      text: trimmed,
      createdAt: new Date().toISOString(),
    }
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        journal: [entry, ...current.journal].slice(0, 12),
      }
    })
    setJournalDraft('')
  }
  const handleCertificatePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      setState((previous) => ({ ...normalizeState(previous), certificatePhoto: result }))
    }
    reader.readAsDataURL(file)
  }
  const handleClearCertificatePhoto = () => {
    setState((previous) => ({ ...normalizeState(previous), certificatePhoto: null }))
  }
  const handleShareCertificate = async () => {
    const qualities = safeState.qualities.map((quality) => `- ${quality.text}`).join('\n')
    const shareText = [
      'Certificat de pure beauté',
      '',
      'Je célèbre la personne que je suis :',
      qualities.length > 0 ? qualities : "- Je m'aime pour qui je suis.",
      '',
      affirmationOfDay,
    ]
      .filter(Boolean)
      .join('\n')
    try {
      await navigator.clipboard.writeText(shareText)
      window.alert('Ton certificat a été copié. Partage-le avec amour !')
    } catch (error) {
      console.error('Clipboard share failed', error)
      window.prompt('Copie ton certificat :', shareText)
    }
  }

  const handleLetterChange = (field: 'letterTo' | 'letterFrom' | 'letterBody' | 'kittyLetterBody', value: string) => {
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        [field]: value,
      }
    })
  }
  const handleInnerChildChange = (
    field: 'innerChildMessage' | 'innerChildReassurance' | 'innerChildNeededWords',
    value: string,
  ) => {
    setState((previous) => {
      const current = normalizeState(previous)
      return { ...current, [field]: value }
    })
  }
  const handleBestFriendChange = (field: 'bestFriendAdvice' | 'bestFriendSelfTalk', value: string) => {
    setState((previous) => {
      const current = normalizeState(previous)
      return { ...current, [field]: value }
    })
  }
  const handleCustomAffirmationChange = (index: number, value: string) => {
    setState((previous) => {
      const current = normalizeState(previous)
      const next = [...current.customAffirmations]
      next[index] = value
      return { ...current, customAffirmations: next }
    })
  }
  const handleSaveInnerChildExercise = () => {
    const snapshot: SelfLoveInnerChildSnapshot = {
      message: safeState.innerChildMessage.trim(),
      reassurance: safeState.innerChildReassurance.trim(),
      neededWords: safeState.innerChildNeededWords.trim(),
    }
    if (!Object.values(snapshot).some((value) => value.length > 0)) {
      window.alert("Commence par écrire quelques phrases avant d'ajouter cet exercice.")
      return
    }
    const entry: SelfLoveSavedLetter = {
      id: `exercise-inner-child-${Date.now()}`,
      template: 'classic',
      body: [snapshot.message, snapshot.reassurance, snapshot.neededWords].filter((value) => value.length > 0).join('\n\n'),
      createdAt: new Date().toISOString(),
      innerChild: snapshot,
      entryType: 'innerChild',
    }
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        savedLetters: [entry, ...current.savedLetters].slice(0, 30),
      }
    })
    setExerciseSaveConfirmationVisible(true)
    if (exerciseSaveConfirmationTimeout.current !== null) {
      window.clearTimeout(exerciseSaveConfirmationTimeout.current)
    }
    exerciseSaveConfirmationTimeout.current = window.setTimeout(() => {
      setExerciseSaveConfirmationVisible(false)
      exerciseSaveConfirmationTimeout.current = null
    }, 2000)
  }
  const handleSaveBestFriendExercise = () => {
    const snapshot: SelfLoveBestFriendSnapshot = {
      advice: safeState.bestFriendAdvice.trim(),
      selfTalk: safeState.bestFriendSelfTalk.trim(),
    }
    if (!Object.values(snapshot).some((value) => value.length > 0)) {
      window.alert("Commence par écrire quelques phrases avant d'ajouter cet exercice.")
      return
    }
    const entry: SelfLoveSavedLetter = {
      id: `exercise-best-friend-${Date.now()}`,
      template: 'kitty',
      body: [snapshot.advice, snapshot.selfTalk].filter((value) => value.length > 0).join('\n\n'),
      createdAt: new Date().toISOString(),
      bestFriend: snapshot,
      entryType: 'bestFriend',
    }
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        savedLetters: [entry, ...current.savedLetters].slice(0, 30),
      }
    })
    setExerciseSaveConfirmationVisible(true)
    if (exerciseSaveConfirmationTimeout.current !== null) {
      window.clearTimeout(exerciseSaveConfirmationTimeout.current)
    }
    exerciseSaveConfirmationTimeout.current = window.setTimeout(() => {
      setExerciseSaveConfirmationVisible(false)
      exerciseSaveConfirmationTimeout.current = null
    }, 2000)
  }
  const handleSaveLetter = (template: 'classic' | 'kitty') => {
    const body = template === 'classic' ? safeState.letterBody : safeState.kittyLetterBody
    const trimmed = body.trim()
    if (trimmed.length === 0) {
      window.alert("Commence par écrire ta lettre avant de l'enregistrer.")
      return
    }
    const innerChildSnapshot: SelfLoveInnerChildSnapshot = {
      message: safeState.innerChildMessage.trim(),
      reassurance: safeState.innerChildReassurance.trim(),
      neededWords: safeState.innerChildNeededWords.trim(),
    }
    const hasInnerChild = Object.values(innerChildSnapshot).some((value) => value.length > 0)
    const bestFriendSnapshot: SelfLoveBestFriendSnapshot = {
      advice: safeState.bestFriendAdvice.trim(),
      selfTalk: safeState.bestFriendSelfTalk.trim(),
    }
    const hasBestFriend = Object.values(bestFriendSnapshot).some((value) => value.length > 0)
    const entry: SelfLoveSavedLetter = {
      id: `saved-letter-${Date.now()}`,
      template,
      to: template === 'classic' ? safeState.letterTo : undefined,
      from: template === 'classic' ? safeState.letterFrom : undefined,
      body: trimmed,
      createdAt: new Date().toISOString(),
      innerChild: hasInnerChild ? innerChildSnapshot : undefined,
      bestFriend: hasBestFriend ? bestFriendSnapshot : undefined,
      entryType: 'letter',
    }
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        savedLetters: [entry, ...current.savedLetters].slice(0, 30),
      }
    })
    setLetterSaveConfirmationVisible(true)
    if (letterSaveConfirmationTimeout.current !== null) {
      window.clearTimeout(letterSaveConfirmationTimeout.current)
    }
    letterSaveConfirmationTimeout.current = window.setTimeout(() => {
      setLetterSaveConfirmationVisible(false)
      letterSaveConfirmationTimeout.current = null
    }, 2000)
  }
  const handleDeleteSavedLetter = (letterId: string) => {
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        savedLetters: current.savedLetters.filter((letter) => letter.id !== letterId),
      }
    })
  }

  const getArchiveBadge = (letter: SelfLoveSavedLetter) => {
    if (letter.entryType === 'innerChild') {
      return {
        label: "L'enfant intérieur",
        className: 'self-love-saved-letters__badge',
      }
    }
    if (letter.entryType === 'bestFriend') {
      return {
        label: 'Jeu des rôles',
        className: 'self-love-saved-letters__badge self-love-saved-letters__badge--kitty',
      }
    }
    return {
      label: letter.template === 'classic' ? 'Lettre romantique' : 'Lettre petit chat',
      className:
        letter.template === 'classic'
          ? 'self-love-saved-letters__badge'
          : 'self-love-saved-letters__badge self-love-saved-letters__badge--kitty',
    }
  }

  const today = useMemo(() => {
    const date = new Date()
    return {
      short: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      full: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    }
  }, [])
  return (
    <div className="self-love-page">
      <header className="self-love-hero">
        <img className="self-love-hero__photo-only" src={heroImage} alt="" />
      </header>
      <div className="self-love-accent-bar" aria-hidden="true" />
      <PageHeading eyebrow='Self love' title="S'aimer soi-même" />
      
      <section className="self-love-section self-love-section--photos">
        <div className="self-love-section__header">
          <h2>Aime-toi !</h2>
          <p>Regarde-toi avec bienveillance et choisis 6 photos où tu rayonnes.</p>
        </div>
        <div className="self-love-photos-frame">
          <div className="self-love-photos">
            {safeState.photos.map((photo, index) => (
              <div key={photo.id} className="self-love-photo-card">
                <label className="self-love-photo-card__drop">
                  {photo.dataUrl ? (
                    <img src={photo.dataUrl} alt={`Souvenir ${index + 1}`} />
                  ) : (
                    <span className="self-love-photo-card__placeholder">
                      <span role="img" aria-label="mirror"></span>
                      Photo {index + 1}
                    </span>
                  )}
                  <input type="file" accept="image/*" onChange={(event) => handlePhotoChange(photo.id, event)} />
                </label>
                {photo.dataUrl ? (
                  <button type="button" onClick={() => handleClearPhoto(photo.id)}>
                    Changer la photo
                  </button>
                ) : (
                  <span className="self-love-photo-card__hint">Ajoute une photo</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="self-love-sections-row">
      <section className="self-love-section self-love-section--qualities">
        <form className="self-love-form-row" onSubmit={handleAddQuality}>
          <input
            type="text"
            placeholder="Ajoute une qualité qui te rend fière"
            value={qualityDraft}
            onChange={(event) => setQualityDraft(event.target.value)}
          />
          <button type="submit">+ Ajouter une qualité</button>
        </form>
        <div className="self-love-list-pad">
          <div className="self-love-list-pad__bow">
            <span aria-hidden="true" />
            <div>
              <strong>Ce que j'aime chez moi</strong>
            </div>
          </div>
          <ul className="self-love-list">
            {safeState.qualities.map((quality) => (
              <li key={quality.id}>
                <span className="self-love-list__heart" aria-hidden="true">*</span>
                <span className="self-love-list__text">{quality.text}</span>
                <button type="button" onClick={() => handleRemoveQuality(quality.id)}>
                  Retirer
                </button>
              </li>
            ))}
            {safeState.qualities.length === 0 ? (
              <li className="self-love-list__empty">
                <span className="self-love-list__heart" aria-hidden="true">*</span>
                <span className="self-love-list__text">
                  Commence par noter une seule phrase douce. Le reste suivra.
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </section>
      <section className="self-love-section self-love-section--thoughts">
        <div className="self-love-section__header">
          <h2>Pensées négatives à laisser derrière toi</h2>
          <p>Clique sur une pensée pour la laisser s'envoler.</p>
        </div>
        <form className="self-love-form-row" onSubmit={handleAddThought}>
          <input
            type="text"
            placeholder="Ex. Je dois être parfait(e)."
            value={thoughtDraft}
            onChange={(event) => setThoughtDraft(event.target.value)}
          />
          <button type="submit">Ajouter</button>
        </form>
        <div className="self-love-thoughts">
          {safeState.thoughts.map((thought) => {
            const releasing = releasingThoughtIds.has(thought.id)
            return (
              <button
                type="button"
                key={thought.id}
                className={releasing ? 'self-love-thought self-love-thought--releasing' : 'self-love-thought'}
                onClick={() => handleReleaseThought(thought.id)}
              >
                <span>{thought.text}</span>
                <em>Clique pour la dissoudre</em>
              </button>
            )
          })}
          {safeState.thoughts.length === 0 ? (
            <div className="self-love-thought self-love-thought--empty">
              <span>Plus aucune pensée limitante ici. Bravo !</span>
            </div>
          ) : null}
        </div>
      </section>
      </div>
      <section className="self-love-section self-love-exercises">
        <div className="self-love-section__header">
          <h2>Exercices guidés pour t'aimer davantage</h2>
          <p>Prends quelques instants pour écrire et laisser ton cœur s'exprimer.</p>
        </div>
        <div className="self-love-exercise__grid">
          <article className="self-love-exercise__card">
            <div className="self-love-exercise__eyebrow">L'enfant intérieur</div>
            <h3>Dialogue doux avec ton passé</h3>
            <p>Imagine une situation difficile d'enfance et offre-toi aujourd'hui les mots qui avaient manqué.</p>
            <label className="self-love-exercise__prompt">
              <span>Que souhaiterais-tu lui dire maintenant ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={safeState.innerChildMessage}
                onChange={(event) => handleInnerChildChange('innerChildMessage', event.target.value)}
                placeholder="Je te dirais..."
              />
            </label>
            <label className="self-love-exercise__prompt">
              <span>Comment pourrais-tu le rassurer ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={safeState.innerChildReassurance}
                onChange={(event) => handleInnerChildChange('innerChildReassurance', event.target.value)}
                placeholder="Je te rassure en..."
              />
            </label>
            <label className="self-love-exercise__prompt">
              <span>Qu'aurait-il eu besoin d'entendre ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={safeState.innerChildNeededWords}
                onChange={(event) => handleInnerChildChange('innerChildNeededWords', event.target.value)}
                placeholder="Tu avais besoin d'entendre..."
              />
            </label>
            <button type="button" className="self-love-exercise__save" onClick={handleSaveInnerChildExercise}>
              Ajouter aux archives
            </button>
          </article>
          <article className="self-love-exercise__card">
            <div className="self-love-exercise__eyebrow">Jeu des rôles</div>
            <h3>Le meilleur ami comme boussole</h3>
            <p>Imagine qu’un ami cher vive exactement la même situation que toi. Quelles paroles lui offrirais-tu ?</p>
            <label className="self-love-exercise__prompt">
              <span>Que lui dirais-tu ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={safeState.bestFriendAdvice}
                onChange={(event) => handleBestFriendChange('bestFriendAdvice', event.target.value)}
                placeholder="Je lui dirais..."
              />
            </label>
            <label className="self-love-exercise__prompt">
              <span>Quelle est la différence avec ce que tu te dis à toi-même ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={safeState.bestFriendSelfTalk}
                onChange={(event) => handleBestFriendChange('bestFriendSelfTalk', event.target.value)}
                placeholder="Je remarque que..."
              />
            </label>
            <p className="self-love-exercise__hint">Cet exercice casse l'auto-critique et rappelle que tu mérites la même douceur.</p>
            <button type="button" className="self-love-exercise__save" onClick={handleSaveBestFriendExercise}>
              Ajouter aux archives
            </button>
          </article>
        </div>
        <div
          className={`journaling-save__confirmation self-love-letter__confirmation${exerciseSaveConfirmationVisible ? ' is-visible' : ''}`}
          aria-live="polite"
        >
       <span aria-hidden="true">✨</span>
          <strong>Page ajoutée !</strong>
        </div>
      </section>
      <section className="self-love-section self-love-letter">
        <div className="self-love-section__header">
          <h2>Une lettre pour te guérir</h2>
          <p>
            Exemple de 6 lettres d'amour à écrire à toi-même pour guérir : <br/> Une lettre de pardon à ton passé, Une lettre
            pour ton toi actuel, une lettre d'encouragement pour tes rêves, <br/> une lettre pour ton corps, une lettre pour
            ton enfant intérieur, Une lettre pour ton futur.
          </p>
        </div>
        <div className="self-love-letter__tabs">
          <button
            type="button"
            className={letterTemplate === 'classic' ? 'is-active' : ''}
            onClick={() => setLetterTemplate('classic')}
          >
            Lettre romantique
          </button>
        </div>
        <div className="self-love-letter__cards">
          <div
            className={`self-love-letter__frame self-love-letter__card self-love-letter__card--classic${
              letterTemplate === 'classic' ? ' is-active' : ''
            }`}
            aria-hidden={letterTemplate !== 'classic'}
            style={letterTemplate === 'classic' ? undefined : { display: 'none' }}
          >
            <p className="self-love-letter__title">Lettre d&apos;amour vers moi-même</p>
            <div className="self-love-letter__addresses">
              <div className="self-love-letter__fields">
                <label>
                  <span>De :</span>
                  <input
                    type="text"
                    value={safeState.letterTo}
                    onChange={(event) => handleLetterChange('letterTo', event.target.value)}
                    placeholder="Ton moi futur "
                  />
                </label>
                <label>
                  <span>Pour :</span>
                  <input
                    type="text"
                    value={safeState.letterFrom}
                    onChange={(event) => handleLetterChange('letterFrom', event.target.value)}
                    placeholder="Ta version présente"
                  />
                </label>
              </div>
              <div className="self-love-letter__stamps" aria-hidden="true">
                <div className="self-love-letter__stamp self-love-letter__stamp--love">
                  <img src={stampLove} alt="Timbre d'amour" />
                </div>
                <div className="self-love-letter__stamp self-love-letter__stamp--key">
                  <img src={stampKey} alt="Timbre secret" />
                </div>
              </div>
            </div>
            <div className="self-love-letter__body">
              <p className="self-love-letter__salutation">Cher moi,</p>
              <textarea
                value={safeState.letterBody}
                onChange={(event) => handleLetterChange('letterBody', event.target.value)}
                placeholder="Écris-toi avec douceur..."
              />
            </div>
            <div className="self-love-letter__footer">
              <div>
                <span className="self-love-letter__date">{today.short}</span>
              </div>
              <div className="self-love-letter__stampmark">
                <span>Self Love Club</span>
              </div>
              <button
                type="button"
                className="self-love-letter__save"
                onClick={() => handleSaveLetter('classic')}
              >
                Enregistrer cette lettre
              </button>
            </div>
          </div>
        </div>
        <div
          className={`journaling-save__confirmation self-love-letter__confirmation${letterSaveConfirmationVisible ? ' is-visible' : ''}`}
          aria-live="polite"
        >
         <span aria-hidden="true">✨</span>
          <strong>Page ajoutée !</strong>
        </div>
      </section>
      <section className="self-love-section self-love-saved-letters journaling-history">
        <div className="self-love-section__header self-love-section__header--archive journaling-history__header">
          <div>
            <h2>Archives</h2>
            <p>Retrouve les mots que tu veux garder près de toi.</p>
          </div>
          {safeState.savedLetters.length > 0 ? (
            <button
              type="button"
              className="self-love-archive__toggle journaling-history__toggle"
              onClick={() => setLetterArchiveOpen((value) => !value)}
              aria-expanded={letterArchiveOpen}
            >
              {letterArchiveOpen ? 'Réduire les archives' : 'Ouvrir les archives'}
            </button>
          ) : null}
        </div>
        {safeState.savedLetters.length === 0 ? (
          <p className="self-love-archive__empty">Tu n&apos;as pas encore sauvegardé de lettre.</p>
        ) : letterArchiveOpen ? (
          lettersByYear.length > 0 ? (
            <div className="self-love-archive__years">
              {lettersByYear.map((group) => (
                <button
                  key={group.year}
                  type="button"
                  className="self-love-archive__year-card"
                  onClick={() => {
                    setSelectedLetterYear(group.year)
                    setSelectedLetterDay(null)
                  }}
                >
                  <span className="self-love-archive__year">{group.year}</span>
                  <span className="self-love-archive__count">{group.totalLetters} lettre(s)</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="self-love-archive__empty">Aucune archive pour le moment.</p>
          )
        ) : null}
      </section>
      {selectedLetterYearGroup ? (
        <div className="self-love-archive-modal" role="dialog" aria-modal="true">
          <div className="self-love-archive-modal__backdrop" onClick={() => setSelectedLetterYear(null)} />
          <div className="self-love-archive-modal__content">
            <header className="self-love-archive-modal__header">
              <div>
                <p>Année</p>
                <h3>{selectedLetterYearGroup.year}</h3>
                <span>{selectedLetterYearGroup.totalLetters} lettre(s)</span>
              </div>
              <button type="button" onClick={() => setSelectedLetterYear(null)}>
                Fermer
              </button>
            </header>
            <div className="self-love-archive-modal__body">
              <div className="self-love-archive-modal__dates">
                {selectedLetterYearGroup.dates.map((group) => (
                  <button
                    key={group.date}
                    type="button"
                    className={`self-love-archive__day-card${selectedLetterDay === group.date ? ' is-active' : ''}`}
                    onClick={() =>
                      setSelectedLetterDay((previous) => (previous === group.date ? null : group.date))
                    }
                  >
                    <span>{group.displayDate}</span>
                    <strong>{group.letters.length} lettre(s)</strong>
                  </button>
                ))}
              </div>
              {activeLetterDayGroup ? (
                <ul className="self-love-archive__list">
                  {activeLetterDayGroup.letters.map((letter) => (
                    <li key={letter.id} className="self-love-archive__letter">
                      <div className="self-love-archive__letter-head">
                        {(() => {
                          const badge = getArchiveBadge(letter)
                          return <span className={badge.className}>{badge.label}</span>
                        })()}
                        <time>{formatDate(letter.createdAt)}</time>
                      </div>
                      {letter.to ? (
                        <p className="self-love-archive__letter-addresses">
                          {letter.to} &rarr; {letter.from}
                        </p>
                      ) : null}
                      <p className="self-love-saved-letters__preview">{letter.body}</p>
                      {letter.innerChild ? (
                        <div className="self-love-archive__section">
                          <h4>L&apos;enfant intérieur ✨ — Dialogue doux avec ton passé</h4>
                          <dl>
                            {letter.innerChild.message.length > 0 ? (
                              <div className="self-love-archive__pair">
                                <dt>Que souhaiterais-tu lui dire maintenant ?</dt>
                                <dd>{letter.innerChild.message}</dd>
                              </div>
                            ) : null}
                            {letter.innerChild.reassurance.length > 0 ? (
                              <div className="self-love-archive__pair">
                                <dt>Comment pourrais-tu le rassurer ?</dt>
                                <dd>{letter.innerChild.reassurance}</dd>
                              </div>
                            ) : null}
                            {letter.innerChild.neededWords.length > 0 ? (
                              <div className="self-love-archive__pair">
                                <dt>Qu&apos;aurait-il eu besoin d&apos;entendre ?</dt>
                                <dd>{letter.innerChild.neededWords}</dd>
                              </div>
                            ) : null}
                          </dl>
                        </div>
                      ) : null}
                      {letter.bestFriend ? (
                        <div className="self-love-archive__section">
                          <h4>Jeu des rôles ✨ — Le meilleur ami comme boussole</h4>
                          <dl>
                            {letter.bestFriend.advice.length > 0 ? (
                              <div className="self-love-archive__pair">
                                <dt>Que lui dirais-tu ?</dt>
                                <dd>{letter.bestFriend.advice}</dd>
                              </div>
                            ) : null}
                            {letter.bestFriend.selfTalk.length > 0 ? (
                              <div className="self-love-archive__pair">
                                <dt>Quelle différence avec ce que tu te dis à toi-même ?</dt>
                                <dd>{letter.bestFriend.selfTalk}</dd>
                              </div>
                            ) : null}
                          </dl>
                        </div>
                      ) : null}
                      <div className="self-love-archive__letter-actions">
                        <button type="button" onClick={() => handleDeleteSavedLetter(letter.id)}>
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="self-love-archive-modal__empty">Sélectionne un jour pour lire tes lettres.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <div className="self-love-footer-bar" aria-hidden="true" />
    </div>
  )
}
export default SelfLovePage
