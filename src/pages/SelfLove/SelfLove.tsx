import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import stampLove from '../../assets/Timbre-1.png'
import stampKey from '../../assets/Timbre-2.png'
import heroImage from '../../assets/planner-05.jpg'
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
type SelfLoveSavedLetter = {
  id: string
  template: 'classic' | 'kitty'
  to?: string
  from?: string
  body: string
  createdAt: string
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
  'Je mérite l’attention que je me donne.',
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
  letterFrom: 'Moi du present',
  letterBody: 'Cher moi, merci de continuer a te choisir chaque jour...',
  kittyLetterBody:
    'Je suis si fiere de toi. Merci de te relever, de rire, de pleurer et de croire en toi meme quand c est complique. Tu es doux douce, courageux courageuse et tellement lumineux lumineuse.',
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
  '"S’aimer soi-même est le début d’une histoire d’amour qui dure toute la vie." — Oscar Wilde',
  '"Tu es ton propre refuge. Tu es ton propre soleil."',
  '"Tu es le résultat de l’amour de toutes les femmes qui t’ont précédée."',
  '"N’oublie pas de t’émerveiller de ta force douce."',
  '"Tu es une œuvre en mouvement, magnifique à chaque étape."',
]
const KittyIllustration = () => (
  <svg viewBox="0 0 220 200" role="img" aria-label="Petit chat rose" className="self-love-kitty-letter__cat">
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
        }))
    : base.savedLetters
  return {
    certificatePhoto: typeof source.certificatePhoto === 'string' ? source.certificatePhoto : base.certificatePhoto,
    photos,
    qualities,
    thoughts,
    journal,
    letterTo: typeof source.letterTo === 'string' ? source.letterTo : base.letterTo,
    letterFrom: typeof source.letterFrom === 'string' ? source.letterFrom : base.letterFrom,
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
  const safeState = useMemo(() => normalizeState(state), [state])
  useEffect(() => {
    document.body.classList.add('self-love-page--gradient')
    return () => document.body.classList.remove('self-love-page--gradient')
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
      '✨ Certificat de pure beauté ✨',
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
  const handleSaveLetter = (template: 'classic' | 'kitty') => {
    const body = template === 'classic' ? safeState.letterBody : safeState.kittyLetterBody
    const trimmed = body.trim()
    if (trimmed.length === 0) {
      window.alert('Commence par écrire ta lettre avant de l’enregistrer.')
      return
    }
    const entry: SelfLoveSavedLetter = {
      id: `saved-letter-${Date.now()}`,
      template,
      to: template === 'classic' ? safeState.letterTo : undefined,
      from: template === 'classic' ? safeState.letterFrom : undefined,
      body: trimmed,
      createdAt: new Date().toISOString(),
    }
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        savedLetters: [entry, ...current.savedLetters].slice(0, 30),
      }
    })
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
      <PageHeading eyebrow='Self love' title='Prendre soin de soi' />
      
      <section className="self-love-section self-love-section--photos">
        <div className="self-love-section__header">
          <h2>Aime-toi !</h2>
          <p>Aime-toi ! Regarde-toi avec bienveillance et choisis 6 photos où tu rayonnes.</p>
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
                      <span role="img" aria-label="mirror">
                        🪞
                      </span>
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
                <span className="self-love-list__heart" aria-hidden="true">
                  ♥
                </span>
                <span className="self-love-list__text">{quality.text}</span>
                <button type="button" onClick={() => handleRemoveQuality(quality.id)}>
                  Retirer
                </button>
              </li>
            ))}
            {safeState.qualities.length === 0 ? (
              <li className="self-love-list__empty">
                <span className="self-love-list__heart" aria-hidden="true">
                  ♥
                </span>
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
          <h2>Pensées négatives à oublier</h2>
          <p>Clique sur une pensée pour la laisser s'envoler.</p>
        </div>
        <form className="self-love-form-row" onSubmit={handleAddThought}>
          <input
            type="text"
            placeholder="Ex. Je dois être parfait·e."
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
          <p>Prends quelques instants pour écrire et laisser ton cœur s’exprimer</p>
        </div>
        <div className="self-love-exercise__grid">
          <article className="self-love-exercise__card">
            <div className="self-love-exercise__eyebrow">L&apos;enfant intérieur</div>
            <h3>Dialogue doux avec ton passé</h3>
            <p>Imagine une situation difficile d&apos;enfance et offre-toi aujourd&apos;hui les mots qui avaient manqué.</p>
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
              <span>Qu&apos;aurait-il eu besoin d&apos;entendre ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={safeState.innerChildNeededWords}
                onChange={(event) => handleInnerChildChange('innerChildNeededWords', event.target.value)}
                placeholder="Tu avais besoin d'entendre..."
              />
            </label>
          </article>
          <article className="self-love-exercise__card">
            <div className="self-love-exercise__eyebrow">Jeu des rôles</div>
            <h3>Le meilleur ami comme boussole</h3>
            <p>Imagine qu&apos;un ami cher vive exactement la même situation que toi. Quelles paroles lui offrirais-tu ?</p>
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
              <span>Quelle différence avec ce que tu te dis à toi-même ?</span>
              <textarea
                className="self-love-exercise__textarea"
                value={safeState.bestFriendSelfTalk}
                onChange={(event) => handleBestFriendChange('bestFriendSelfTalk', event.target.value)}
                placeholder="Je remarque que..."
              />
            </label>
            <p className="self-love-exercise__hint">Cet exercice casse l&apos;auto-critique et rappelle que tu mérites la même douceur.</p>
          </article>
        </div>
      </section>
      <section className="self-love-section self-love-letter">
        <div className="self-love-letter__tabs">
          <button
            type="button"
            className={letterTemplate === 'classic' ? 'is-active' : ''}
            onClick={() => setLetterTemplate('classic')}
          >
            Lettre romantique
          </button>
          <button
            type="button"
            className={letterTemplate === 'kitty' ? 'is-active' : ''}
            onClick={() => setLetterTemplate('kitty')}
          >
            Lettre petit chat
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
            <p className="self-love-letter__title">Lettre d&apos;amour vers moi-meme</p>
            <div className="self-love-letter__addresses">
              <div className="self-love-letter__fields">
                <label>
                  <span>A :</span>
                  <input
                    type="text"
                    value={safeState.letterTo}
                    onChange={(event) => handleLetterChange('letterTo', event.target.value)}
                    placeholder="Ton moi futur"
                  />
                </label>
                <label>
                  <span>Pour :</span>
                  <input
                    type="text"
                    value={safeState.letterFrom}
                    onChange={(event) => handleLetterChange('letterFrom', event.target.value)}
                    placeholder="Ta version presente"
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
                placeholder="Ecris-toi avec douceur..."
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
          <div
            className={`self-love-letter__card self-love-letter__card--kitty${
              letterTemplate === 'kitty' ? ' is-active' : ''
            }`}
            aria-hidden={letterTemplate !== 'kitty'}
            style={letterTemplate === 'kitty' ? undefined : { display: 'none' }}
          >
            <div className="self-love-kitty-letter">
              <div className="self-love-kitty-letter__card">
                <div className="self-love-kitty-letter__art">
                  <KittyIllustration />
                  <div className="self-love-kitty-letter__floating-hearts" aria-hidden="true">
                    <span>♥</span>
                    <span>♥</span>
                    <span>♥</span>
                    <span>♥</span>
                    <span>♥</span>
                  </div>
                </div>
                <p className="self-love-kitty-letter__subtitle">
                  Laisse ce petit chat te rappeler combien tu es doux(se).
                </p>
                <textarea
                  className="self-love-kitty-letter__textarea"
                  value={safeState.kittyLetterBody}
                  onChange={(event) => handleLetterChange('kittyLetterBody', event.target.value)}
                  placeholder="Ecris-toi une declaration tendre..."
                />
                <div className="self-love-kitty-letter__footer">
                  <span>Juste toi & moi</span>
                  <span className="self-love-kitty-letter__sparkles">* * *</span>
                </div>
                <button
                  type="button"
                  className="self-love-letter__save"
                  onClick={() => handleSaveLetter('kitty')}
                >
                  Enregistrer cette lettre
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {safeState.savedLetters.length > 0 ? (
        <section className="self-love-section self-love-saved-letters">
          <div className="self-love-section__header">
            <h2>Mes lettres sauvegard&eacute;es</h2>
            <p>Retrouve les mots que tu veux garder pr&egrave;s de toi.</p>
          </div>
          <ul className="self-love-saved-letters__list">
            {safeState.savedLetters.map((letter) => (
              <li key={letter.id}>
                <div>
                  <div className="self-love-saved-letters__meta">
                    <span
                      className={
                        letter.template === 'classic'
                          ? 'self-love-saved-letters__badge'
                          : 'self-love-saved-letters__badge self-love-saved-letters__badge--kitty'
                      }
                    >
                      {letter.template === 'classic' ? 'Lettre romantique' : 'Lettre petit chat'}
                    </span>
                    <time>{formatDate(letter.createdAt)}</time>
                  </div>
                  {letter.to ? (
                    <p className="self-love-saved-letters__addresses">
                      {letter.to} &rarr; {letter.from}
                    </p>
                  ) : null}
                  <p className="self-love-saved-letters__preview">{letter.body}</p>
                </div>
                <button type="button" onClick={() => handleDeleteSavedLetter(letter.id)}>
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="self-love-footer-bar" aria-hidden="true" />
    </div>
  )
}
export default SelfLovePage
