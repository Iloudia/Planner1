import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import usePersistentState from '../../hooks/usePersistentState'
import journalingMoodSecondary from '../../assets/planner-08.jpg'
import journalingMoodTertiary from '../../assets/planner-03.jpg'
import PageHeading from '../../components/PageHeading'
import './Journaling.css'

type MoodValue = 'bright' | 'good' | 'neutral' | 'low' | 'overwhelmed'
type EnergyLevel = 'low' | 'medium' | 'high'
type PostFeeling = 'better' | 'same' | 'clearer' | 'tiredRelieved'
type AnchorType = 'gratitude' | 'victory'

type JournalEntry = {
  id: string
  date: string
  mood?: MoodValue | string
  energy?: EnergyLevel
  keyword?: string
  question?: string
  questionAnswer?: string
  content?: string
  postFeeling?: PostFeeling
  positiveAnchor?: string
  positiveAnchorType?: AnchorType
  createdAt?: number
}

const moodOptions = [
  { value: 'bright', label: 'Légère', emoji: '✨' },
  { value: 'good', label: 'Stable', emoji: '😊' },
  { value: 'neutral', label: 'Neutre', emoji: '😐' },
  { value: 'low', label: 'Lourde', emoji: '🌧️' },
  { value: 'overwhelmed', label: 'Saturée', emoji: '🫠' },
] as const

const energyOptions = [
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
] as const

const postFeelingOptions = [
  { value: 'better', label: 'Un peu mieux' },
  { value: 'same', label: 'Pareil' },
  { value: 'clearer', label: 'Plus clair' },
  { value: 'tiredRelieved', label: 'Fatigué(e) mais soulagé(e)' },
] as const

const anchorOptions = [
  { value: 'gratitude', label: "Une chose pour laquelle je suis reconnaissant(e) aujourd'hui" },
  { value: 'victory', label: 'Une petite victoire du jour' },
] as const

const guidedQuestionsByMood: Record<MoodValue, string[]> = {
  bright: [
    "Qu'est-ce qui t'a fait du bien aujourd'hui, même un peu ?",
    'Quelle petite chose nourrit ta joie en ce moment ?',
    "Qu'est-ce que tu veux garder précieusement de cette journée ?",
    "De quoi as-tu envie de te remercier aujourd'hui ?",
  ],
  good: [
    "Qu'est-ce qui te stabilise en ce moment ?",
    "Quelle partie de ta journée t'a donné un peu d'élan ?",
    "Qu'est-ce que tu aimerais continuer demain ?",
    "Qu'est-ce qui te rassure aujourd'hui ?",
  ],
  neutral: [
    'Que veux-tu déposer ici, sans filtre ?',
    "De quoi aurais-tu besoin là, maintenant ?",
    "Qu'est-ce que tu évites en ce moment ?",
    "Qu'est-ce que tu veux clarifier doucement ?",
  ],
  low: [
    "Qu'est-ce qui te pèse le plus aujourd'hui ?",
    "Quel petit geste pourrait te soulager aujourd'hui ?",
    "Qu'est-ce qui te manque en ce moment ?",
    "Qu'est-ce que tu aimerais qu'on comprenne de toi ?",
  ],
  overwhelmed: [
    "Qu'est-ce qui te prend trop de place aujourd'hui ?",
    "De quoi pourrais-tu te délester, même un peu ?",
    "Quelle limite douce pourrais-tu poser ?",
    "Qu'est-ce que tu veux laisser pour plus tard ?",
  ],
}

const getTodayISO = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, '0')
  const day = `${today.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseEntryDate = (dateISO: string) => {
  const [year, month, day] = dateISO.split('-').map(Number)
  if (!year || !month || !day) {
    return null
  }
  return new Date(year, month - 1, day)
}

const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

const getDailyQuestion = (dateISO: string, mood: MoodValue) => {
  const parsed = parseEntryDate(dateISO)
  const dayIndex = parsed ? getDayOfYear(parsed) : 0
  const questions = guidedQuestionsByMood[mood] ?? guidedQuestionsByMood.neutral
  return questions[dayIndex % questions.length]
}

const formatEntryDate = (dateISO: string) => {
  const parsed = parseEntryDate(dateISO)
  if (!parsed) {
    return dateISO
  }
  const formatted = parsed.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const limitKeywordWords = (value: string) => {
  const cleaned = value.replace(/\s+/g, ' ').trimStart()
  const words = cleaned.trim().split(' ').filter(Boolean)
  if (words.length <= 3) {
    return cleaned
  }
  return words.slice(0, 3).join(' ')
}

const JournalingPage = () => {
  const [, setEntries] = usePersistentState<JournalEntry[]>('planner.journal.entries', () => [])
  useEffect(() => {
    document.body.classList.add('journaling-page--beige')
    return () => {
      document.body.classList.remove('journaling-page--beige')
    }
  }, [])
  const [draft, setDraft] = useState({
    date: getTodayISO(),
    mood: 'neutral' as MoodValue,
    energy: 'medium' as EnergyLevel,
    keyword: '',
    content: '',
    questionAnswer: '',
    postFeeling: '' as PostFeeling | '',
    positiveAnchor: '',
    positiveAnchorType: 'gratitude' as AnchorType,
  })
  const [saveConfirmationVisible, setSaveConfirmationVisible] = useState(false)
  const saveConfirmationTimeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (saveConfirmationTimeout.current !== null) {
        window.clearTimeout(saveConfirmationTimeout.current)
      }
    }
  }, [])

  const dailyQuestion = useMemo(() => getDailyQuestion(draft.date, draft.mood), [draft.date, draft.mood])
  const displayDate = useMemo(() => formatEntryDate(draft.date), [draft.date])

  const handleSubmit = () => {
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: draft.date,
      mood: draft.mood,
      energy: draft.energy,
      keyword: draft.keyword.trim() || undefined,
      question: dailyQuestion,
      questionAnswer: draft.questionAnswer.trim() || undefined,
      content: draft.content.trim() || undefined,
      postFeeling: draft.postFeeling || undefined,
      positiveAnchor: draft.positiveAnchor.trim() || undefined,
      positiveAnchorType: draft.positiveAnchorType,
      createdAt: Date.now(),
    }

    setEntries((previous) => [newEntry, ...previous])
    setDraft((previous) => ({
      ...previous,
      date: getTodayISO(),
      keyword: '',
      content: '',
      questionAnswer: '',
      postFeeling: '' as PostFeeling | '',
      positiveAnchor: '',
      positiveAnchorType: 'gratitude',
    }))

    setSaveConfirmationVisible(true)
    if (saveConfirmationTimeout.current !== null) {
      window.clearTimeout(saveConfirmationTimeout.current)
    }
    saveConfirmationTimeout.current = window.setTimeout(() => {
      setSaveConfirmationVisible(false)
      saveConfirmationTimeout.current = null
    }, 2000)
  }

  return (
    <div className="journaling-page aesthetic-page">
      <PageHeading eyebrow="Reflet" title="Journaling" />

      <section className="journaling-section journaling-checkin journaling-section--delay-1">
        <header className="journaling-section__header">
          <div>
            <h2>Check-in émotionnel</h2>
            <p>Commence par un point rapide. C'est juste pour toi.</p>
          </div>
          <div className="journaling-checkin__date">{displayDate}</div>
        </header>
        <div className="journaling-checkin__grid">
          <div className="journaling-checkin__block">
            <span className="journaling-checkin__label">Humeur du jour</span>
            <div className="journaling-mood__options">
              {moodOptions.map((option) => (
                <label key={option.value} className="journaling-choice">
                  <input
                    type="radio"
                    name="mood"
                    value={option.value}
                    checked={draft.mood === option.value}
                    onChange={() => setDraft((previous) => ({ ...previous, mood: option.value }))}
                  />
                  <span className="journaling-choice__content">
                    <span className="journaling-choice__emoji" aria-hidden="true">
                      {option.emoji}
                    </span>
                    <span>{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="journaling-checkin__block">
            <span className="journaling-checkin__label">Niveau d'énergie</span>
            <div className="journaling-energy__options">
              {energyOptions.map((option) => (
                <label key={option.value} className="journaling-choice journaling-choice--pill">
                  <input
                    type="radio"
                    name="energy"
                    value={option.value}
                    checked={draft.energy === option.value}
                    onChange={() => setDraft((previous) => ({ ...previous, energy: option.value }))}
                  />
                  <span className="journaling-choice__content">
                    <span className="journaling-choice__dot" aria-hidden="true" />
                    <span>{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="journaling-checkin__block">
            <span className="journaling-checkin__label">Mot-clé du jour</span>
            <input
              className="journaling-input"
              type="text"
              value={draft.keyword}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setDraft((previous) => ({
                  ...previous,
                  keyword: limitKeywordWords(event.target.value),
                }))
              }
              placeholder="1 à 3 mots"
            />
            <p className="journaling-helper">Libre, simple, sans pression.</p>
          </div>
        </div>
      </section>

      <section className="journaling-section journaling-question journaling-section--delay-2">
        <header className="journaling-section__header">
          <div>
            <h2>Question guidée du jour</h2>
            <p>Une seule question, pour ouvrir une porte sans t'enfermer.</p>
          </div>
        </header>
        <div className="journaling-question__card">
          <p className="journaling-question__prompt">{dailyQuestion}</p>
          <div className="journaling-question__answer">
            <span>Ta réponse</span>
            <textarea
              value={draft.questionAnswer}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setDraft((previous) => ({ ...previous, questionAnswer: event.target.value }))
              }
              placeholder="Écris ce qui vient, même en quelques mots."
              rows={4}
            />
          </div>
        </div>
      </section>

      <section className="journaling-section journaling-write journaling-section--delay-3">
        <header className="journaling-section__header">
          <div>
            <h2>Zone d'écriture principale</h2>
            <p>Écris librement. Personne ne te lira. Tu peux t'arrêter quand tu veux.</p>
          </div>
        </header>
        <textarea
          value={draft.content}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDraft((previous) => ({ ...previous, content: event.target.value }))
          }
          placeholder="Écris librement. Personne ne te lira. Tu peux t'arrêter quand tu veux."
          rows={10}
        />
      </section>

      <section className="journaling-section journaling-closure journaling-section--delay-4">
        <header className="journaling-section__header">
          <div>
            <h2>Clôture émotionnelle</h2>
            <p>Un petit retour sur ce que l'écriture vient de bouger.</p>
          </div>
        </header>
        <div className="journaling-closure__grid">
          <div className="journaling-closure__block">
            <span className="journaling-checkin__label">Comment te sens-tu maintenant ?</span>
            <div className="journaling-post__options">
              {postFeelingOptions.map((option) => (
                <label key={option.value} className="journaling-choice journaling-choice--wide">
                  <input
                    type="radio"
                    name="postFeeling"
                    value={option.value}
                    checked={draft.postFeeling === option.value}
                    onChange={() => setDraft((previous) => ({ ...previous, postFeeling: option.value }))}
                  />
                  <span className="journaling-choice__content">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="journaling-closure__block">
            <span className="journaling-checkin__label">Ancrage positif optionnel</span>
            <div className="journaling-anchor__options">
              {anchorOptions.map((option) => (
                <label key={option.value} className="journaling-toggle">
                  <input
                    type="radio"
                    name="anchorType"
                    value={option.value}
                    checked={draft.positiveAnchorType === option.value}
                    onChange={() => setDraft((previous) => ({ ...previous, positiveAnchorType: option.value }))}
                  />
                  <span className="journaling-toggle__label">{option.label}</span>
                </label>
              ))}
            </div>
            <textarea
              value={draft.positiveAnchor}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setDraft((previous) => ({ ...previous, positiveAnchor: event.target.value }))
              }
              placeholder="Ex : Je me suis fait(e) un ami."
              rows={4}
            />
          </div>
        </div>
      </section>

      <section className="journaling-save">
        <button type="button" className="journaling-save__button" onClick={handleSubmit}>
          Sauvegarder cette page
        </button>
        <div
          className={`journaling-save__confirmation${saveConfirmationVisible ? ' is-visible' : ''}`}
          aria-live="polite"
        >
          <span aria-hidden="true">✓</span>
          <strong>Page enregistrée</strong>
        </div>
      </section>

      <div className="journaling-page__footer-bar" aria-hidden="true" />
    </div>
  )
}

export default JournalingPage
