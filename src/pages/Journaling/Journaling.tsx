import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import usePersistentState from '../../hooks/usePersistentState'
import journalingIllustration from '../../assets/planner-09.jpg'
import journalingMoodSecondary from '../../assets/planner-08.jpg'
import journalingMoodTertiary from '../../assets/planner-03.jpg'
import PageHeading from '../../components/PageHeading'
import PageHero from '../../components/PageHero'
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
  { value: 'bright', label: 'Légère', emoji: '😄' },
  { value: 'good', label: 'Stable', emoji: '🙂' },
  { value: 'neutral', label: 'Neutre', emoji: '😐' },
  { value: 'low', label: 'Lourde', emoji: '😔' },
  { value: 'overwhelmed', label: 'Saturée', emoji: '😣' },
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
  { value: 'tiredRelieved', label: 'Fatigué mais soulagé' },
] as const

const anchorOptions = [
  { value: 'gratitude', label: "Une chose pour laquelle je suis reconnaissant aujourd'hui" },
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

const journalingMoodboard = [
  { src: journalingIllustration, alt: 'Carnet pastel accompagné de fleurs séchées' },
  { src: journalingMoodSecondary, alt: "Pause d'écriture et tasse de thé" },
  { src: journalingMoodTertiary, alt: 'Planche inspirante pour le journaling' },
] as const

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

const formatMonthLabel = (dateISO: string) => {
  const parsed = parseEntryDate(dateISO)
  if (!parsed) {
    return dateISO.slice(0, 7).toUpperCase()
  }
  return parsed.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()
}

const formatEntryLineDate = (dateISO: string) => {
  const parsed = parseEntryDate(dateISO)
  if (!parsed) {
    return dateISO
  }
  const formatted = parsed.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })
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

const toneSignals = {
  heavy: ['fatigu', 'stress', 'pression', 'lourd', 'trist', 'peur', 'anx', 'trop', 'vide', 'epuis'],
  light: ['calm', 'apais', 'douce', 'repos', 'leger', 'joie', 'merci', 'serein', 'clair', 'soulag'],
}

const actionSignals = [
  { label: 'le mouvement', words: ['sport', 'marche', 'yoga', 'danse'] },
  { label: 'le repos', words: ['repos', 'pause', 'sieste'] },
  { label: 'les routines simples', words: ['routine', 'rituel', 'simple', 'lent'] },
] as const

const JournalingPage = () => {
  const [entries, setEntries] = usePersistentState<JournalEntry[]>('planner.journal.entries', () => [])
  const [premiumEnabled, setPremiumEnabled] = usePersistentState('planner.journal.premiumEnabled', () => false)
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
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
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

  const entriesSorted = useMemo(
    () => [...entries].sort((a, b) => (a.date > b.date ? -1 : 1)),
    [entries],
  )

  const entriesByMonth = useMemo(() => {
    const map = new Map<string, { key: string; label: string; entries: JournalEntry[] }>()
    entriesSorted.forEach((entry) => {
      if (!entry.date) {
        return
      }
      const parsed = parseEntryDate(entry.date)
      const year = parsed ? parsed.getFullYear() : Number(entry.date.slice(0, 4))
      const month = parsed ? parsed.getMonth() + 1 : Number(entry.date.slice(5, 7))
      const key = `${year}-${String(month).padStart(2, '0')}`
      const group = map.get(key) ?? { key, label: formatMonthLabel(entry.date), entries: [] }
      group.entries.push(entry)
      map.set(key, group)
    })
    return Array.from(map.values()).sort((a, b) => (a.key > b.key ? -1 : 1))
  }, [entriesSorted])

  const activeEntry = useMemo(
    () => entries.find((entry) => entry.id === activeEntryId) ?? null,
    [entries, activeEntryId],
  )

  useEffect(() => {
    document.body.classList.toggle('journaling-modal-open', Boolean(activeEntry))
    return () => {
      document.body.classList.remove('journaling-modal-open')
    }
  }, [activeEntry])

  useEffect(() => {
    if (!archiveOpen) {
      setActiveEntryId(null)
    }
  }, [archiveOpen])

  const lastWeekEntries = useMemo(() => {
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
    return entriesSorted.filter((entry) => {
      if (!entry.date) {
        return false
      }
      const parsed = parseEntryDate(entry.date)
      if (!parsed) {
        return false
      }
      return parsed >= start && parsed <= today
    })
  }, [entriesSorted])

  const weeklyInsights = useMemo(() => {
    if (lastWeekEntries.length === 0) {
      return {
        summary: ['Pas encore assez de pages cette semaine pour dessiner une synthèse.'],
        patterns: ['Les tendances apparaîtront doucement avec le temps.'],
        suggestions: ["Tu peux écrire peu, même quelques mots si c'est juste."],
      }
    }

    const keywordCounts = new Map<string, number>()
    const moodCounts = new Map<string, number>()
    const dayCounts = new Map<number, { heavy: number; total: number }>()
    const actionCounts = new Map<string, number>()
    let energyTotal = 0
    let energyCount = 0
    let toneScore = 0

    const heavyMoods = new Set(['low', 'overwhelmed'])
    const positivePostFeelings = new Set<PostFeeling>(['better', 'clearer', 'tiredRelieved'])

    lastWeekEntries.forEach((entry) => {
      const keyword = entry.keyword?.trim().toLowerCase()
      if (keyword) {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) ?? 0) + 1)
      }

      if (entry.mood) {
        moodCounts.set(entry.mood, (moodCounts.get(entry.mood) ?? 0) + 1)
      }

      if (entry.energy) {
        const score = entry.energy === 'low' ? 1 : entry.energy === 'medium' ? 2 : 3
        energyTotal += score
        energyCount += 1
      }

      if (entry.date) {
        const parsed = parseEntryDate(entry.date)
        if (parsed) {
          const weekday = parsed.getDay()
          const current = dayCounts.get(weekday) ?? { heavy: 0, total: 0 }
          current.total += 1
          if (entry.mood && heavyMoods.has(entry.mood)) {
            current.heavy += 1
          }
          dayCounts.set(weekday, current)
        }
      }

      const textBlob = [entry.keyword, entry.questionAnswer, entry.content, entry.positiveAnchor].join(' ').toLowerCase()
      toneSignals.heavy.forEach((signal) => {
        if (textBlob.includes(signal)) {
          toneScore -= 1
        }
      })
      toneSignals.light.forEach((signal) => {
        if (textBlob.includes(signal)) {
          toneScore += 1
        }
      })

      if (entry.content && entry.postFeeling && positivePostFeelings.has(entry.postFeeling)) {
        const content = entry.content.toLowerCase()
        actionSignals.forEach((action) => {
          if (action.words.some((word) => content.includes(word))) {
            actionCounts.set(action.label, (actionCounts.get(action.label) ?? 0) + 1)
          }
        })
      }
    })

    const topKeyword = [...keywordCounts.entries()].sort((a, b) => b[1] - a[1])[0]
    const topMood = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])[0]
    const energyAverage = energyCount > 0 ? energyTotal / energyCount : null

    const moodLabel = (value?: string) =>
      moodOptions.find((option) => option.value === value)?.label ?? (value ?? 'Neutre')

    const summary: string[] = []
    if (topKeyword && topKeyword[1] > 1) {
      summary.push(`Cette semaine, un mot revient souvent : "${topKeyword[0]}".`)
    }
    if (topMood) {
      summary.push(`L'humeur dominante se situe plutôt sur ${moodLabel(topMood[0]).toLowerCase()}.`)
    }
    if (energyAverage !== null) {
      const energyLabel = energyAverage < 1.6 ? 'plutôt basse' : energyAverage < 2.4 ? 'plutôt moyenne' : 'plutôt haute'
      summary.push(`Ton énergie moyenne semble ${energyLabel}.`)
    }
    if (toneScore !== 0) {
      const toneLabel = toneScore > 0 ? 'plutôt apaisé' : 'plus chargé'
      summary.push(`Le ton général est ${toneLabel}.`)
    }
    if (summary.length === 0) {
      summary.push('Cette semaine se dessine sans tendance marquée, en douceur.')
    }

    const patterns: string[] = []
    if (topKeyword && topKeyword[1] > 1) {
      patterns.push(`Le thème "${topKeyword[0]}" revient plusieurs fois.`)
    }

    const dayLabels = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    const heavyDay = [...dayCounts.entries()]
      .map(([day, data]) => ({ day, ratio: data.total > 0 ? data.heavy / data.total : 0, total: data.total }))
      .sort((a, b) => b.ratio - a.ratio)[0]
    if (heavyDay && heavyDay.total >= 2 && heavyDay.ratio >= 0.6) {
      patterns.push(`Les ${dayLabels[heavyDay.day]}s semblent un peu plus denses.`)
    }

    const topAction = [...actionCounts.entries()].sort((a, b) => b[1] - a[1])[0]
    if (topAction && topAction[1] >= 2) {
      patterns.push(`Après ${topAction[0]}, tes notes sont souvent plus claires.`)
    }

    if (patterns.length === 0) {
      patterns.push("Les schémas restent discrets pour le moment, et c'est ok.")
    }

    const suggestions: string[] = []
    if (toneScore < 0) {
      suggestions.push("Veux-tu essayer un rituel pour apaiser l'esprit ?")
    }
    if (energyAverage !== null && energyAverage < 1.7) {
      suggestions.push("Aujourd'hui pourrait être une journée plus douce.")
    }
    if (lastWeekEntries.length < 3) {
      suggestions.push('Tu peux écrire moins, même un mot suffit parfois.')
    }
    if (suggestions.length === 0) {
      suggestions.push('Garde un geste simple qui te fait du bien.')
    }

    return {
      summary: summary.slice(0, 3),
      patterns: patterns.slice(0, 3),
      suggestions: suggestions.slice(0, 3),
    }
  }, [lastWeekEntries])

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
      <PageHero
        eyebrow="Rituel doux"
        title="Journaling"
        description="Un espace sûr pour déposer ce que tu vis, sans obligation ni comparaison. Tu peux venir quand tu veux, même pour un mot."
        stats={[]}
        images={journalingMoodboard}
      />
      <div className="journaling-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Reflet" title="Journaling" />

      <section className="journaling-section journaling-checkin journaling-section--delay-1">
        <header className="journaling-section__header">
          <div>
            <span className="journaling-tag">Gratuit</span>
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
            <span className="journaling-tag">Gratuit</span>
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
            <span className="journaling-tag">Gratuit</span>
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
            <span className="journaling-tag">Gratuit</span>
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
              placeholder="Facultatif, sans obligation."
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

      <section
        className={`journaling-section journaling-premium journaling-section--delay-5${
          premiumEnabled ? '' : ' is-locked'
        }`}
      >
        <header className="journaling-section__header">
          <div>
            <span className="journaling-tag journaling-tag--premium">Premium</span>
            <h2>Lecture douce de ta semaine</h2>
            <p>Des reflets bienveillants, sans jugement ni diagnostic.</p>
          </div>
          <label className="journaling-premium__toggle">
            <span>Mode premium (demo)</span>
            <input
              type="checkbox"
              checked={premiumEnabled}
              onChange={(event) => setPremiumEnabled(event.target.checked)}
              aria-label="Activer le mode premium"
            />
          </label>
        </header>
        {premiumEnabled ? (
          <div className="journaling-premium__grid">
            <article className="journaling-premium__card">
              <h3>Synthèse hebdomadaire</h3>
              <ul>
                {weeklyInsights.summary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
            <article className="journaling-premium__card">
              <h3>Schémas émotionnels</h3>
              <ul>
                {weeklyInsights.patterns.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
            <article className="journaling-premium__card">
              <h3>Suggestions douces</h3>
              <ul>
                {weeklyInsights.suggestions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          </div>
        ) : (
          <div className="journaling-premium__locked">
            <p>Ces repères deviennent disponibles avec Premium, quand tu veux.</p>
            <div className="journaling-premium__grid">
              <article className="journaling-premium__card is-muted">
                <h3>Synthèse hebdomadaire</h3>
                <p>Un résumé neutre basé sur l'humeur, les mots-clés et le ton.</p>
              </article>
              <article className="journaling-premium__card is-muted">
                <h3>Schémas émotionnels</h3>
                <p>Des patterns simples, jamais culpabilisants.</p>
              </article>
              <article className="journaling-premium__card is-muted">
                <h3>Suggestions douces</h3>
                <p>Des gestes légers pour prendre soin de toi.</p>
              </article>
            </div>
          </div>
        )}
      </section>

      <section className="journaling-section journaling-archive journaling-section--delay-6">
        <header className="journaling-section__header">
          <div>
            <span className="journaling-tag">Gratuit</span>
            <h2>Mes pages</h2>
            <p>Revenir lire, quand tu en as envie. Rien n'est obligatoire.</p>
          </div>
          <button
            type="button"
            className="journaling-archive__toggle"
            onClick={() => setArchiveOpen((previous) => !previous)}
            aria-expanded={archiveOpen}
          >
            {archiveOpen ? 'Masquer' : 'Afficher'}
          </button>
        </header>
        {archiveOpen ? (
          entriesByMonth.length > 0 ? (
            <div className="journaling-archive__list">
              {entriesByMonth.map((group) => (
                <div key={group.key} className="journaling-month">
                  <h3 className="journaling-month__title">{group.label}</h3>
                  <div className="journaling-month__list">
                    {group.entries.map((entry) => {
                      const moodOption = moodOptions.find((option) => option.value === entry.mood)
                      const energyLabel = energyOptions.find((option) => option.value === entry.energy)?.label
                      const metaParts = [
                        moodOption?.label ?? (entry.mood ? String(entry.mood) : 'Humeur'),
                        energyLabel ? `Énergie ${energyLabel.toLowerCase()}` : null,
                        entry.keyword ? `Mot-clé: ${entry.keyword}` : null,
                      ].filter(Boolean)

                      return (
                        <button
                          key={entry.id}
                          type="button"
                          className="journaling-entry"
                          onClick={() => setActiveEntryId(entry.id)}
                        >
                          <span className="journaling-entry__date">{formatEntryLineDate(entry.date)}</span>
                          <span className="journaling-entry__meta">{metaParts.join(' · ')}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="journaling-empty">Tu n'as pas encore écrit ici. Tu peux commencer quand tu veux.</p>
          )
        ) : (
          <p className="journaling-helper">Tes pages restent là, discrètes et prêtes à te retrouver.</p>
        )}
      </section>

      {activeEntry ? (
        <div className="journaling-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="journaling-modal__backdrop"
            onClick={() => setActiveEntryId(null)}
            aria-label="Fermer le récapitulatif"
          />
          <div className="journaling-modal__panel">
            <div className="journaling-modal__body">
              <header className="journaling-modal__header">
              <div>
                <h3>{formatEntryDate(activeEntry.date)}</h3>
                <p>
                  {moodOptions.find((option) => option.value === activeEntry.mood)?.label ?? 'Humeur'} ·{' '}
                  {energyOptions.find((option) => option.value === activeEntry.energy)?.label
                    ? `Énergie ${energyOptions.find((option) => option.value === activeEntry.energy)?.label?.toLowerCase()}`
                    : 'Énergie'}
                </p>
              </div>
              <button type="button" className="journaling-modal__close" onClick={() => setActiveEntryId(null)}>
                Fermer
              </button>
              </header>
              {activeEntry.question ? (
                <div className="journaling-modal__block">
                  <span>Question du jour</span>
                  <p>{activeEntry.question}</p>
                </div>
              ) : null}
              {activeEntry.questionAnswer ? (
                <div className="journaling-modal__block">
                  <span>Réponse</span>
                  <p>{activeEntry.questionAnswer}</p>
                </div>
              ) : null}
              {activeEntry.content ? (
                <div className="journaling-modal__block">
                  <span>Journal</span>
                  {activeEntry.content.split(/\n+/).map((paragraph, index) => (
                    <p key={`${activeEntry.id}-modal-${index}`}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="journaling-modal__empty">Cette page est surtout un check-in.</p>
              )}
              {activeEntry.positiveAnchor ? (
                <div className="journaling-modal__block">
                  <span>{anchorOptions.find((option) => option.value === activeEntry.positiveAnchorType)?.label ?? 'Ancrage'}</span>
                  <p>{activeEntry.positiveAnchor}</p>
                </div>
              ) : null}
            </div>
            {activeEntry.postFeeling ? (
              <div className="journaling-modal__footer">
                Après l'écriture : {postFeelingOptions.find((option) => option.value === activeEntry.postFeeling)?.label ?? ''}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="journaling-page__footer-bar" aria-hidden="true" />
    </div>
  )
}

export default JournalingPage
