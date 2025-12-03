import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import stampLove from '../../assets/Timbre-1.png'
import stampKey from '../../assets/Timbre-2.png'
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
type SelfLoveState = {
  certificatePhoto: string | null
  photos: SelfLovePhotoSlot[]
  qualities: SelfLoveQuality[]
  thoughts: SelfLoveThought[]
  journal: SelfLoveJournalEntry[]
  letterTo: string
  letterFrom: string
  letterBody: string
}
const PHOTO_SLOT_COUNT = 6
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
  return {
    certificatePhoto: typeof source.certificatePhoto === 'string' ? source.certificatePhoto : base.certificatePhoto,
    photos,
    qualities,
    thoughts,
    journal,
    letterTo: typeof source.letterTo === 'string' ? source.letterTo : base.letterTo,
    letterFrom: typeof source.letterFrom === 'string' ? source.letterFrom : base.letterFrom,
    letterBody: typeof source.letterBody === 'string' ? source.letterBody : base.letterBody,
  }
}
const SelfLovePage = () => {
  const [state, setState] = usePersistentState<SelfLoveState>(STORAGE_KEY, createDefaultState)
  const [qualityDraft, setQualityDraft] = useState('')
  const [thoughtDraft, setThoughtDraft] = useState('')
  const [journalDraft, setJournalDraft] = useState('')
  const [releasingThoughtIds, setReleasingThoughtIds] = useState<Set<string>>(new Set())
  const [letterTemplate, setLetterTemplate] = useState<'classic' | 'menu'>('classic')
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

  const handleLetterChange = (field: 'letterTo' | 'letterFrom' | 'letterBody', value: string) => {
    setState((previous) => {
      const current = normalizeState(previous)
      return {
        ...current,
        [field]: value,
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
        <div className="self-love-hero__glow" aria-hidden="true" />
      </header>
      <div className="self-love-accent-bar" aria-hidden="true" />
      <PageHeading eyebrow='Self love' title='Prendre soin de soi' />
      
      <section className="self-love-section self-love-section--photos">
        <div className="self-love-section__header">
          <h2>Aime-toi !</h2>
          <p>Aime-toi ! Regarde-toi avec bienveillance et choisis six souvenirs où tu rayonnes.</p>
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
                      Souvenir {index + 1}
                    </span>
                  )}
                  <input type="file" accept="image/*" onChange={(event) => handlePhotoChange(photo.id, event)} />
                </label>
                {photo.dataUrl ? (
                  <button type="button" onClick={() => handleClearPhoto(photo.id)}>
                    Changer la photo
                  </button>
                ) : (
                  <span className="self-love-photo-card__hint">Ajoute un souvenir lumineux</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="self-love-section self-love-section--qualities">
        <div className="self-love-section__header">
          <h2>Ce que j&apos;aime chez moi</h2>
          <p>Note tes qualités, tes victoires, tout ce qui te rend fière.</p>
        </div>
        <form className="self-love-form-row" onSubmit={handleAddQuality}>
          <input
            type="text"
            placeholder="Ajoute une qualité qui te rend fière"
            value={qualityDraft}
            onChange={(event) => setQualityDraft(event.target.value)}
          />
          <button type="submit">+ Ajouter une qualité</button>
        </form>
        <ul className="self-love-list">
          {safeState.qualities.map((quality) => (
            <li key={quality.id}>
              <span>{quality.text}</span>
              <button type="button" onClick={() => handleRemoveQuality(quality.id)}>
                Retirer
              </button>
            </li>
          ))}
          {safeState.qualities.length === 0 ? (
            <li className="self-love-list__empty">Commence par noter une seule phrase douce. Le reste suivra.</li>
          ) : null}
        </ul>
      </section>
      <section className="self-love-section self-love-section--thoughts">
        <div className="self-love-section__header">
          <h2>Pensées négatives à oublier</h2>
          <p>Clique sur une pensée pour la laisser s&apos;envoler.</p>
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
            className={letterTemplate === 'menu' ? 'is-active' : ''}
            onClick={() => setLetterTemplate('menu')}
          >
            Lettre timbre violet
          </button>
        </div>
        <div className="self-love-letter__cards">
          <div className={`self-love-letter__frame self-love-letter__card self-love-letter__card--classic${letterTemplate === 'classic' ? ' is-active' : ''}`}>
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
          </div>
          </div>
          <div className={`self-love-letter__card self-love-letter__card--menu${letterTemplate === 'menu' ? ' is-active' : ''}`}>
            <div className="self-love-letter__clip" aria-hidden="true" />
            <div className="self-love-menu">
              <p className="self-love-menu__script">Cher moi</p>
              <p className="self-love-menu__title">Lettre du jour</p>
              <div className="self-love-menu__body">
                <textarea
                  value={safeState.letterBody}
                  onChange={(event) => handleLetterChange('letterBody', event.target.value)}
                  placeholder="Note-toi ce dont tu as besoin aujourd'hui..."
                />
              </div>
              <div className="self-love-menu__footer">
                <span>{today.short}</span>
                <span>Disponible en toi</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="self-love-footer-bar" aria-hidden="true" />
    </div>
  )
}
export default SelfLovePage
