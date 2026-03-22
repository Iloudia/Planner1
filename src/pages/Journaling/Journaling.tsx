import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import useUserJournalEntries from '../../hooks/useUserJournalEntries'
import journalingMoodSecondary from '../../assets/livre.webp'
import journalingMoodTertiary from '../../assets/mallika-jain-dupe.webp'
import PageHeading from '../../components/PageHeading'
import type { AnchorType, EnergyLevel, JournalEntryInput, MoodValue, PostFeeling } from '../../types/personalization'
import './Journaling.css'

const moodOptions = [
  { value: 'bright', label: 'Heureuse', emoji: '✨' },
  { value: 'good', label: 'Calme', emoji: '😊' },
  { value: 'low', label: 'Triste', emoji: '🌧️' },
  { value: 'overwhelmed', label: 'Fatiguée', emoji: '🫠' },
  { value: 'neutral', label: 'En colère', emoji: '😐' },
] as const

const energyOptions = [
  { value: 'high', label: 'Haute' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'low', label: 'Faible' },
] as const

const postFeelingOptions = [
  { value: 'better', label: 'Un peu mieux' },
  { value: 'same', label: 'Pareil' },
  { value: 'clearer', label: 'Soulagée' },
  { value: 'tiredRelieved', label: 'Fatiguée' },
] as const

const anchorOptions = [
  { value: 'gratitude', label: "Une chose pour laquelle je suis reconnaissante aujourd'hui" },
  { value: 'victory', label: 'Une petite victoire du jour' },
] as const

const guidedQuestionsByMood: Record<MoodValue, string[]> = {
  bright: [
    "Qu'est-ce qui t'a fait du bien aujourd'hui, même un peu ?",
    'Quelle petite chose nourrit ta joie en ce moment ?',
    "Qu'est-ce qui t'a rendu heureuse aujourd'hui ? un moment, une personne ou une réussite ?",
    "En une phrase, comment cette joie se ressentait dans ta journée ?",
    "Y a-t-il quelqu'un avec qui tu aurais envie de partager ce bonheur ? ",
    'Quelle énergie veux-tu garder pour demain ?',
  ],
  good: [
    "Qu'est-ce qui te stabilise en ce moment ?",
    "Quelle partie de ta journée t'a donné un peu d'élan ?",
    "Qu'est-ce qui a contribué à ce calme aujourd'hui ? Une situation, un choix, ou juste le déroulement naturel de la journée ?",
    "En une phrase, comment ce calme se manifeste en toi en ce moment ?",
    "Qu'est-ce que tu aimerais garder de cette journée pour les jours où tu en auras besoin ?",
    'Quel rythme te ferait du bien pour la suite de la journée ?',
  ],
  neutral: [
    'Que veux-tu déposer ici, sans filtre ?',
    'De quoi aurais-tu besoin là, maintenant ?',
    "Qu'est-ce qui a déclenché cette colère aujourd'hui ? une situation, une personne, une attente non respectée ?",
    'En une phrase, comment tu décrirais ce que tu as ressenti ?',
    "Malgré cette journée difficile, quelle est une petite chose qui t'a quand même fait du bien aujourd'hui ?",
    "De quoi as-tu besoin pour te sentir plus en paix ?",
  ],
  low: [
    "Qu'est-ce qui te pèse le plus aujourd'hui ?",
    "Quel petit geste pourrait te soulager aujourd'hui ?",
    "Qu'est-ce qui t'a rendu triste aujourd'hui ? Un événement, une pensée, ou quelque chose de plus difficile à nommer ?",
    "En une phrase, de quoi as-tu eu le plus besoin aujourd'hui sans l'avoir eu ?",
    "Y a-t-il une personne, un souvenir ou un endroit qui te fait du bien rien qu'en y pensant ?",
    "Quelle petite victoire serait possible aujourd'hui ?",
  ],
  overwhelmed: [
    "Qu'est-ce qui te prend trop de place aujourd'hui ?",
    'De quoi pourrais-tu te délester, même un peu ?',
    "Qu'est-ce qui t'a le plus épuisé aujourd'hui ? une tâche, une interaction, ou juste l'accumulation ?",
    "En une phrase, c'est plutôt une fatigue du corps, de la tête ou du cœur ?",
    "Quelle est la petite chose qui pourrait t'aider à te sentir mieux ce soir, même toute simple ?",
    "Qu'est-ce que tu peux simplifier dès aujourd'hui ?",
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

const getDailyQuestions = (dateISO: string, mood: MoodValue, count = 3) => {
  const parsed = parseEntryDate(dateISO)
  const dayIndex = parsed ? getDayOfYear(parsed) : 0
  const questions = guidedQuestionsByMood[mood] ?? guidedQuestionsByMood.neutral
  if (questions.length === 0) {
    return []
  }

  return Array.from({ length: count }, (_, index) => questions[(dayIndex + index) % questions.length])
}

const getGuidedQuestionPlaceholder = (question: string, index: number) => {
  if (question.includes("rendu heureuse aujourd'hui ? un moment, une personne ou une réussite ?")) {
    return "Ex : J'ai reçu un retour très positif sur un projet que je portais depuis des semaines. Je ne m'y attendais pas vraiment et ça m'a complètement illuminé la journée..."
  }
  if (question.includes("comment cette joie se ressentait dans ta journée ?")) {
    return "Ex : Comme une bulle légère dans la poitrine, j'avais envie de marcher plus vite, de sourire aux inconnus dans la rue..."
  }
  if (question.includes("aurais envie de partager ce bonheur ?")) {
    return "Ex : Ma sœur. Elle a cru en ce projet depuis le début, elle mérite de savoir que ça a payé. Je vais lui envoyer un message ce soir..."
  }
  if (question.includes("contribué à ce calme aujourd'hui ?")) {
    return "Ex : J'ai travaillé depuis chez moi aujourd'hui, sans réunion. J'ai pu avancer à mon rythme, avec de la musique en fond..."
  }
  if (question.includes("comment ce calme se manifeste en toi en ce moment ?")) {
    return "Ex : Comme si tout était à sa place pour une fois. Pas d'urgence, pas de tension..."
  }
  if (question.includes("aimerais garder de cette journée pour les jours où tu en auras besoin ?")) {
    return "Ex : La sensation d'avoir avancé à mon rythme aujourd'hui, sans me battre contre le temps. J'aimerais retrouver ça plus souvent..."
  }
  if (question.includes("rendu triste aujourd'hui")) {
    return "Ex : J'ai entendu une chanson ce matin qui me ramenait à une époque plus simple..."
  }
  if (question.includes("de quoi as-tu eu le plus besoin aujourd'hui sans l'avoir eu ?")) {
    return "Ex : J'aurais eu besoin qu'on me serre dans les bras et qu'on me dise que tout va bien, même juste cinq minutes..."
  }
  if (question.includes("te fait du bien rien qu'en y pensant ?")) {
    return "Ex : Le parc juste à côté de chez moi.. là bas je me sens libre..."
  }
  if (question.includes("déclenché cette colère aujourd'hui")) {
    return "Ex : Mon manager a annulé notre réunion pour la troisième fois sans prévenir..."
  }
  if (question.includes('comment tu décrirais ce que tu as ressenti ?')) {
    return "Ex : Un mélange de frustration et de tristesse, comme si mon travail ne comptait pas vraiment..."
  }
  if (question.includes("petite chose qui t'a quand même fait du bien aujourd'hui")) {
    return "Ex : Une collègue m'a apporté un café en fin de journée, sans raison..."
  }
  if (question.includes("le plus épuisé aujourd'hui")) {
    return "Ex : J'ai eu cinq réunions d'affilée sans pause, et le soir j'avais encore des mails en attente. Je n'ai pas eu un seul moment pour souffler."
  }
  if (question.includes('fatigue du corps, de la tête ou du cœur')) {
    return "Ex : Plutôt une fatigue de la tête. je n'arrive plus à penser clairement, comme si mon cerveau avait tiré le rideau."
  }
  if (question.includes('te sentir mieux ce soir, même toute simple ?')) {
    return "Ex : Me faire un thé chaud et regarder une série..."
  }
  return `Ex : Réponse à la question ${index + 1}...`
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
  const { createEntry, error, isLoading } = useUserJournalEntries()
  useEffect(() => {
    document.body.classList.add('journaling-page--lux')
    return () => {
      document.body.classList.remove('journaling-page--lux')
    }
  }, [])
  const [draft, setDraft] = useState({
    date: getTodayISO(),
    mood: 'neutral' as MoodValue,
    energy: 'medium' as EnergyLevel,
    keyword: '',
    content: '',
    questionAnswers: ['', '', ''] as string[],
    postFeeling: '' as PostFeeling | '',
    positiveAnchor: '',
    positiveAnchorType: 'gratitude' as AnchorType,
  })
  const [saveConfirmationVisible, setSaveConfirmationVisible] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const saveConfirmationTimeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (saveConfirmationTimeout.current !== null) {
        window.clearTimeout(saveConfirmationTimeout.current)
      }
    }
  }, [])

  const dailyQuestions = useMemo(() => getDailyQuestions(draft.date, draft.mood, 3), [draft.date, draft.mood])
  const displayDate = useMemo(() => formatEntryDate(draft.date), [draft.date])

  const handleSubmit = async () => {
    const combinedQuestionAnswer = draft.questionAnswers
      .map((answer, index) => {
        const normalized = answer.trim()
        return normalized ? `Q${index + 1}: ${normalized}` : ''
      })
      .filter(Boolean)
      .join('\n\n')

    const newEntry: JournalEntryInput = {
      date: draft.date,
      mood: draft.mood,
      energy: draft.energy,
      keyword: draft.keyword.trim() || undefined,
      question: dailyQuestions.join(' | '),
      questionAnswer: combinedQuestionAnswer || undefined,
      content: draft.content.trim() || undefined,
      postFeeling: draft.postFeeling || undefined,
      positiveAnchor: draft.positiveAnchor.trim() || undefined,
      positiveAnchorType: draft.positiveAnchorType,
    }

    try {
      setSaveError(null)
      await createEntry(newEntry)
      setDraft((previous) => ({
        ...previous,
        date: getTodayISO(),
        keyword: '',
        content: '',
        questionAnswers: ['', '', ''],
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
    } catch {
      setSaveError("Impossible d'enregistrer cette page pour le moment.")
    }
  }

  if (isLoading) {
    return (
      <div className="journaling-page aesthetic-page journaling-page--loading" aria-busy="true" aria-live="polite">
        <span className="journaling-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="journaling-page aesthetic-page">
      <PageHeading eyebrow="Reflet" title="Journaling" />

      <section className="journaling-section journaling-checkin journaling-section--delay-1">
        <header className="journaling-section__header">
          <div>
            <h2>Check-in émotionnel</h2>
            <p>Comment tu te sens aujourd'hui ? </p>
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
              placeholder="Ex : Libre, incroyable, sans pression..."
            />
          </div>
        </div>
      </section>

      <section className="journaling-section journaling-question journaling-section--delay-2">
        <header className="journaling-section__header">
          <div>
            <h2>Question guidée du jour</h2>
          </div>
        </header>
        {dailyQuestions.map((question, index) => (
          <div key={`guided-question-${index}`} className="journaling-question__card">
            <p className="journaling-question__prompt">{question}</p>
            <div className="journaling-question__answer">
              <textarea
                value={draft.questionAnswers[index] ?? ''}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setDraft((previous) => {
                    const nextAnswers = [...previous.questionAnswers]
                    nextAnswers[index] = event.target.value
                    return { ...previous, questionAnswers: nextAnswers }
                  })
                }
                placeholder={getGuidedQuestionPlaceholder(question, index)}
                rows={4}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="journaling-section journaling-write journaling-section--delay-3">
        <header className="journaling-section__header">
          <div>
            <h2>Zone d'écriture principale</h2>
            <p>Écris sans filtre. Tu es libre de t’arrêter quand tu veux.</p>
          </div>
        </header>
        <textarea
          value={draft.content}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDraft((previous) => ({ ...previous, content: event.target.value }))
          }
          placeholder="Ex : Aujourd'hui j'ai eu du mal à me lever, mais j'ai aimé mon café du matin..."
          rows={10}
        />
      </section>

      <section className="journaling-section journaling-closure journaling-section--delay-4">
        <header className="journaling-section__header">
          <div>
            <h2>Clôture émotionnelle</h2>
            <p>Prends une respiration lente, laisse ton corps se détendre.</p>
          </div>
        </header>
        <div className="journaling-closure__grid">
          <div className="journaling-closure__block">
            <span className="journaling-checkin__label">Ancrage positif</span>
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
              placeholder={
                draft.positiveAnchorType === 'gratitude'
                  ? "Ex : Je suis reconnaissante pour tout ce que j'ai..."
                  : 'Ex : Je me suis faite un ami...'
              }
              rows={4}
            />
          </div>
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
        </div>
      </section>

      <section className="journaling-save">
        <button type="button" className="journaling-save__button" onClick={handleSubmit}>
          Sauvegarder cette page
        </button>
        {saveError || error ? <p>{saveError ?? error}</p> : null}
        {saveConfirmationVisible ? (
          <div className="journaling-save__confirmation-card" role="status" aria-live="polite">
            <h4>Page enregistrée</h4>
            <p>Ton journaling a bien été enregistré.</p>
          </div>
        ) : null}
      </section>
</div>
  )
}

export default JournalingPage






