import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import usePersistentState from '../../hooks/usePersistentState'
import journalingIllustration from '../../assets/planner-09.jpg'
import journalingMoodSecondary from '../../assets/planner-08.jpg'
import journalingMoodTertiary from '../../assets/planner-03.jpg'
import PageHeading from '../../components/PageHeading'
import PageHero from '../../components/PageHero'
import './Journaling.css'

type JournalFeeling =
  | 'joy'
  | 'sad'
  | 'angry'
  | 'excited'
  | 'surprised'
  | 'scared'
  | 'shy'
  | 'confused'
  | 'embarrassed'
  | 'calm'
  | 'depressed'

type PromptAnswer =
  | { label: string; type: 'text'; value: string }
  | { label: string; type: 'list'; items: string[] }

type PromptEntrySection = {
  id: string
  title: string
  answers: PromptAnswer[]
}

type JournalEntry = {
  id: string
  date: string
  mood: string
  content: string
  feelings?: JournalFeeling[]
  feeling?: JournalFeeling
  feelingReason: string
  prompts?: PromptEntrySection[]
  freeWriting?: string
}

type PromptField =
  | {
      id: string
      type: 'textarea'
      label: string
      placeholder?: string
    }
  | {
      id: string
      type: 'checkboxes'
      label: string
      options: string[]
    }

type JournalingPromptSection = {
  id: string
  icon: string
  title: string
  accent: string
  description?: string
  helper?: string
  fields: PromptField[]
}

type CalendarDay = {
  date: Date
  iso: string
  inCurrentMonth: boolean
  hasEntries: boolean
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const formatISODate = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildCalendarDays = (monthDate: Date, entriesMap: Map<string, JournalEntry[]>): CalendarDay[] => {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const firstWeekday = firstDay.getDay()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  const days: CalendarDay[] = []

  for (let cell = 0; cell < totalCells; cell += 1) {
    const dayNumber = cell - firstWeekday + 1
    const cellDate = new Date(year, month, dayNumber)
    const iso = formatISODate(cellDate)
    days.push({
      date: cellDate,
      iso,
      inCurrentMonth: cellDate.getMonth() === month,
      hasEntries: entriesMap.has(iso),
    })
  }

  return days
}

const getTodayISO = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, '0')
  const day = `${today.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const initialEntries: JournalEntry[] = []

const normalizeEntries = (list: JournalEntry[]) => {
  const seenDates = new Set<string>()
  const normalized: JournalEntry[] = []
  let changed = false

  list.forEach((entry) => {
    if (seenDates.has(entry.date)) {
      changed = true
      return
    }
    seenDates.add(entry.date)
    normalized.push(entry)
  })

  return changed ? normalized : list
}

const moods = ['Sereine', 'Energisee', 'Equilibree', 'Fatiguee', 'Fiere']
const feelings: Array<{ value: JournalFeeling; label: string; emoji: string }> = [
  { value: 'joy', label: 'Joyeuse', emoji: '' },
  { value: 'sad', label: 'Triste', emoji: '' },
  { value: 'angry', label: 'En colère', emoji: '' },
  { value: 'excited', label: 'Excitée', emoji: '' },
  { value: 'surprised', label: 'Surprise', emoji: '' },
  { value: 'scared', label: 'Effrayée', emoji: '' },
  { value: 'shy', label: 'Timide', emoji: '' },
  { value: 'confused', label: 'Confuse', emoji: '' },
  { value: 'embarrassed', label: 'Embarrassée', emoji: '' },
  { value: 'calm', label: 'Calme', emoji: '' },
  { value: 'depressed', label: 'Déprimée', emoji: '' },
]
const DATE_PROMPT_FIELD_ID = 'prompt-date'

const journalingMoodboard = [
  { src: journalingIllustration, alt: 'Carnet pastel accompagné de fleurs séchées' },
  { src: journalingMoodSecondary, alt: "Pause d'écriture et tasse de thé" },
  { src: journalingMoodTertiary, alt: 'Planche inspirante pour le journaling' },
] as const

const journalingPromptSections: JournalingPromptSection[] = [
  {
    id: 'daily-state',
    icon: '#1',
    title: '1. État du jour',
    accent: '#ffe9f1',
    description: 'Concentre-toi sur ce que tu ressens ici et maintenant.',
    fields: [
      {
        id: DATE_PROMPT_FIELD_ID,
        type: 'textarea',
        label: "Quelle est la date d'aujourd'hui ?",
        placeholder: 'Laisse ton cœur parler ici...',
      },
      {
        id: 'prompt-mood-now',
        type: 'textarea',
        label: 'Comment je me suis sentie ?',
        placeholder: 'Sensations, émotions...',
      },
      {
        id: 'prompt-mood-influence',
        type: 'textarea',
        label: "Qu'est-ce qui a influencé mon humeur aujourd'hui ? (événements, pensées, personnes, énergie, météo...)",
        placeholder: 'Note ce qui a changé ton humeur ou ton énergie.',
      },
      {
        id: 'prompt-learning',
        type: 'textarea',
        label: "Qu'ai-je appris ou compris sur moi-même aujourd'hui ?",
        placeholder: 'Dépose tes pensées...',
      },
    ],
  },
  {
    id: 'daily-celebration',
    icon: '#2',
    title: '2. Ma journée',
    accent: '#e0f2fe',
    description: 'Revis les belles choses et célèbre ce qui compte.',
    fields: [
      {
        id: 'prompt-highlights',
        type: 'textarea',
        label: "Qu'est-ce qui s'est bien passé aujourd'hui ?",
        placeholder: 'Liste tes victoires, même minuscules.',
      },
      {
        id: 'prompt-gratitude',
        type: 'textarea',
        label: 'De quoi suis-je reconnaissant(e) ?',
        placeholder: 'Exprime ce qui remplit ton cœur.',
      },
      {
        id: 'prompt-replay',
        type: 'textarea',
        label: "Y a-t-il un moment que j'aimerais revivre ?",
        placeholder: 'Quel souvenir doux veux-tu garder précieusement ?',
      },
      {
        id: 'prompt-magic-wand',
        type: 'textarea',
        label: "Si j'avais une baguette magique, qu'est-ce que je changerais dans cette journée ?",
        placeholder: 'Note ce qui te vient spontanément...',
      },
    ],
  },
  {
    id: 'abundance-affirmations',
    icon: '#3',
    title: "3. Affirmations pour attirer l'argent et l'abondance",
    accent: '#f3efff',
    description: "Invite la prospérité dans ton esprit avec des mots qui vibrent pour toi.",
    helper: 'Choisis-en 3 à 5 ou écris les tiennes.',
    fields: [
      {
        id: 'prompt-money-affirmations',
        type: 'checkboxes',
        label: 'Ce que je souhaite répéter',
        options: [
          "L'argent circule vers moi facilement et en abondance.",
          'Je mérite la richesse sous toutes ses formes.',
          "Chaque jour, je deviens un aimant à opportunités financières.",
          "Je suis reconnaissant(e) pour tout l'argent qui entre dans ma vie.",
          'Mes actions attirent la prospérité naturellement.',
        ],
      },
      {
        id: 'prompt-money-custom',
        type: 'textarea',
        label: 'Tes mots magiques',
        placeholder: 'Compose tes propres affirmations lumineuses.',
      },
    ],
  },
  {
    id: 'confidence-affirmations',
    icon: '#4',
    title: '4. Affirmations pour la confiance en soi',
    accent: '#fef3c7',
    description: "Renforce ta confiance et ancre-toi dans ta valeur.",
    helper: 'Choisis-en 3 à 5 ou écris les tiennes.',
    fields: [
      {
        id: 'prompt-confidence-affirmations',
        type: 'checkboxes',
        label: 'Ce que je me répète',
        options: [
          'Je crois en mes capacités et je suis fier/fière de moi.',
          "Je suis digne d'amour, de succès et de respect.",
          "Je suis en sécurité d'être moi-même.",
          'Chaque jour, je deviens plus sûr(e) et plus fort(e).',
          'Ma présence a de la valeur.',
        ],
      },
      {
        id: 'prompt-confidence-custom',
        type: 'textarea',
        label: 'Tes déclarations personnelles',
        placeholder: 'Écris des mots doux qui te ressemblent.',
      },
    ],
  },
  {
    id: 'visualisation',
    icon: '#5',
    title: '5. Visualisation / Intention',
    accent: '#e9f7f3',
    description: 'Projette-toi avec douceur vers demain.',
    fields: [
      {
        id: 'prompt-intention',
        type: 'textarea',
        label: 'Quelle est mon intention pour demain ?',
        placeholder: 'Pose ton intention la plus douce pour la suite.',
      },
      {
        id: 'prompt-feeling',
        type: 'textarea',
        label: 'Comment je veux me sentir demain ?',
        placeholder: "Imagine l'ambiance émotionnelle que tu souhaites vivre.",
      },
      {
        id: 'prompt-self-version',
        type: 'textarea',
        label: 'Quelle version de moi suis-je en train de devenir ?',
        placeholder: 'Décris la personne que tu nourris pas à pas.',
      },
    ],
  },
]

const createInitialPromptResponses = () => {
  const initial: Record<string, string> = {}
  journalingPromptSections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === 'textarea') {
        initial[field.id] = ''
      }
    })
  })
  return initial
}

const createInitialPromptSelections = () => {
  const initial: Record<string, string[]> = {}
  journalingPromptSections.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === 'checkboxes') {
        initial[field.id] = []
      }
    })
  })
  return initial
}

const JournalingPage = () => {
  const [entries, setEntries] = usePersistentState<JournalEntry[]>('planner.journal.entries', () => initialEntries)
  const [draft, setDraft] = useState({
    date: getTodayISO(),
    mood: 'Equilibree',
    content: '',
    feelings: feelings.length > 0 ? [feelings[0].value] : [],
    feelingReason: '',
  })
  const [promptResponses, setPromptResponses] = useState<Record<string, string>>(() => createInitialPromptResponses())
  const [promptSelections, setPromptSelections] = useState<Record<string, string[]>>(() => createInitialPromptSelections())
  const [manifestationBoard, setManifestationBoard] = usePersistentState('planner.journal.manifestation', () => ({
    affirmations: '',
    gratitude: '',
    people: '',
    intentions: '',
  }))
  const [saveConfirmationVisible, setSaveConfirmationVisible] = useState(false)
  const saveConfirmationTimeout = useRef<number | null>(null)

  useEffect(() => {
    document.body.classList.add('planner-page--white')
    return () => {
      document.body.classList.remove('planner-page--white')
    }
  }, [])

  useEffect(() => {
    setEntries((previous) => normalizeEntries(previous))
  }, [setEntries])

  useEffect(() => {
    return () => {
      if (saveConfirmationTimeout.current !== null) {
        window.clearTimeout(saveConfirmationTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    setPromptResponses((previous) => {
      if (previous[DATE_PROMPT_FIELD_ID] === draft.date) {
        return previous
      }
      return {
        ...previous,
        [DATE_PROMPT_FIELD_ID]: draft.date,
      }
    })
  }, [draft.date])

  const handleDraftChange = <Field extends keyof typeof draft>(field: Field, value: typeof draft[Field]) => {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handlePromptResponseChange = (fieldId: string, value: string) => {
    setPromptResponses((previous) => ({
      ...previous,
      [fieldId]: value,
    }))
  }

  const handlePromptSelectionToggle = (fieldId: string, option: string) => {
    setPromptSelections((previous) => {
      const current = previous[fieldId] ?? []
      const exists = current.includes(option)
      const next = exists ? current.filter((item) => item !== option) : [...current, option]
      return {
        ...previous,
        [fieldId]: next,
      }
    })
  }

  const showSaveConfirmation = () => {
    setSaveConfirmationVisible(true)
    if (saveConfirmationTimeout.current !== null) {
      window.clearTimeout(saveConfirmationTimeout.current)
    }
    saveConfirmationTimeout.current = window.setTimeout(() => {
      setSaveConfirmationVisible(false)
      saveConfirmationTimeout.current = null
    }, 2000)
  }

  const handleSubmit = () => {
    const promptSectionsForEntry = journalingPromptSections
      .map<PromptEntrySection | null>((section) => {
        const answers: PromptAnswer[] = []

        section.fields.forEach((field) => {
          if (field.type === 'textarea') {
            const value = (promptResponses[field.id] ?? '').trim()
            if (value.length > 0) {
              answers.push({
                label: field.label,
                type: 'text',
                value,
              })
            }
          } else if (field.type === 'checkboxes') {
            const selected = promptSelections[field.id] ?? []
            if (selected.length > 0) {
              answers.push({
                label: field.label,
                type: 'list',
                items: selected,
              })
            }
          }
        })

        if (answers.length === 0) {
          return null
        }

        return {
          id: section.id,
          title: section.title,
          answers,
        }
      })
      .filter((section): section is PromptEntrySection => section !== null)

    const freeWriting = draft.content.trim()

    if (promptSectionsForEntry.length === 0 && freeWriting.length === 0) {
      return
    }

    const promptSummaryText = promptSectionsForEntry
      .map((section) => {
        const parts = section.answers.map((answer) => {
          if (answer.type === 'list') {
            return `${answer.label}\n${answer.items.map((item) => `- ${item}`).join('\n')}`
          }
          return `${answer.label}\n${answer.value}`
        })
        return `${section.title}\n${parts.join('\n\n')}`
      })
      .join('\n\n')

    const combinedContent = [promptSummaryText, freeWriting].filter((value) => value.length > 0).join('\n\n')

    const normalizedFeelings =
      draft.feelings.length > 0 ? [...draft.feelings] : (feelings.length > 0 ? [feelings[0].value] : [])

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: draft.date,
      mood: draft.mood,
      content: combinedContent,
      feelings: normalizedFeelings,
      feeling: normalizedFeelings[0],
      feelingReason: draft.feelingReason.trim(),
      prompts: promptSectionsForEntry.length > 0 ? promptSectionsForEntry : undefined,
      freeWriting: freeWriting.length > 0 ? freeWriting : undefined,
    }

    setEntries((previous) => [newEntry, ...previous.filter((entry) => entry.date !== newEntry.date)])
    setDraft((previous) => ({
      ...previous,
      content: '',
      feelingReason: '',
      feelings: feelings.length > 0 ? [feelings[0].value] : [],
    }))
    setPromptResponses(createInitialPromptResponses())
    setPromptSelections(createInitialPromptSelections())
    showSaveConfirmation()
  }

  const entriesByDate = useMemo(() => {
    const map = new Map<string, JournalEntry[]>()
    entries.forEach((entry) => {
      const list = map.get(entry.date) ?? []
      list.push(entry)
      map.set(entry.date, list)
    })

    return Array.from(map.entries()).sort((a, b) => (a[0] > b[0] ? -1 : 1))
  }, [entries])

  const totalEntries = entries.length
  const activeDays = entriesByDate.length
  const latestEntry = entries[0]
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const entriesByYear = useMemo(() => {
    const yearMap = new Map<string, { date: string; items: JournalEntry[] }[]>()
    entriesByDate.forEach(([date, items]) => {
      const year = new Date(date).getFullYear().toString()
      const list = yearMap.get(year) ?? []
      list.push({ date, items })
      yearMap.set(year, list)
    })

    return Array.from(yearMap.entries())
      .map(([year, groups]) => ({
        year,
        totalEntries: groups.reduce((sum, group) => sum + group.items.length, 0),
        dates: groups,
      }))
      .sort((a, b) => (a.year > b.year ? -1 : 1))
  }, [entriesByDate])

  const selectedYearGroup = useMemo(
    () => entriesByYear.find((group) => group.year === selectedYear) ?? null,
    [entriesByYear, selectedYear],
  )

  useEffect(() => {
    setSelectedYear(null)
  }, [archiveOpen])

  useEffect(() => {
    if (selectedYear && !entriesByYear.some((group) => group.year === selectedYear)) {
      setSelectedYear(null)
    }
  }, [entriesByYear, selectedYear])

  const activeDayGroup = useMemo(() => {
    if (!selectedYearGroup || !selectedDay) {
      return null
    }

    return selectedYearGroup.dates.find((group) => group.date === selectedDay) ?? null
  }, [selectedYearGroup, selectedDay])

  const journalingStats = [
    { id: 'pages', label: 'Pages écrites', value: totalEntries.toString() },
    { id: 'days', label: 'Jours actifs', value: activeDays.toString() },
  ]
  const dayStateIds = useMemo(() => new Set(['daily-state', 'daily-celebration']), [])
  const dayStateSections = journalingPromptSections.filter((section) => dayStateIds.has(section.id))
  const manifestationBlocks = [
    {
      id: 'affirmations',
      title: 'Affirmations',
      emoji: '',
      placeholder: 'Écris tes phrases positives, séparées par des retours à la ligne.',
      description: 'Rappelle-toi qui tu deviens.',
    },
    {
      id: 'gratitude',
      title: 'Ce dont je suis reconnaissant(e)',
      emoji: '',
      placeholder: 'Liste ce qui remplit ton cœur de douceur.',
      description: "Accueille l'abondance actuelle.",
    },
    {
      id: 'people',
      title: 'Croyances limitantes',
      emoji: '',
      placeholder: 'Note les phrases ou pensées que tu souhaites transformer.',
      description: 'Identifie ce qui te retient pour mieux le libérer.',
    },
    {
      id: 'intentions',
      title: 'Visualisations',
      emoji: '',
      placeholder: 'Imagine en détails la vie que tu manifestes.',
      description: 'Projette-toi vers ta vision idéale.',
    },
  ] as const

  return (
    <div className="journaling-page aesthetic-page">
      
      
      <PageHero
        eyebrow="Rituel du jour"
        title="Journaling"
        description="Prends un instant pour respirer, écrire et manifester ta vie de rêve."
        stats={journalingStats.map(({ id, label, value }) => ({ id, label, value }))}
        images={journalingMoodboard}
        tone="pink"
      />
      <div className="journaling-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Reflet" title="Journaling" />

      <section className="journaling-day-state">
        <header className="journaling-day-state__header">
          <div>
            <h2>Bilan de la journée</h2>
          </div>
        </header>
        <div className="journaling-day-state__content">
          {dayStateSections.map((section, index) => {
            const [rawNumber, ...titleParts] = section.title.split('.')
            const displayNumber = rawNumber?.trim().replace(/\D+/g, '') || `${index + 1}`
            const cleanTitle = titleParts.length > 0 ? titleParts.join('.').trim() : section.title

            return (
              <div key={section.id} className="journaling-day-state__group">
                <div className="journaling-day-state__group-heading">
                  <span aria-hidden="true" className="journaling-day-state__number">
                    {displayNumber}
                  </span>
                  <div>
                    <h3>{cleanTitle}</h3>
                    {section.description && <p>{section.description}</p>}
                  </div>
                </div>
                <div className="journaling-day-state__fields">
                  {section.fields.map((field) => (
                    <label key={field.id}>
                      <span>{field.label}</span>
                      <textarea
                        value={promptResponses[field.id] ?? ''}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                          handlePromptResponseChange(field.id, event.target.value)
                        }
                        placeholder={field.placeholder}
                        rows={field.id === DATE_PROMPT_FIELD_ID ? 2 : 3}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="journaling-manifestation">
        <header>
          <div>
            <h2>Espace manifestation</h2>
            <p>Note tes affirmations, ta gratitude et les personnes qui t'inspirent.</p>
          </div>
        </header>
        <div className="journaling-manifestation__grid">
          {manifestationBlocks.map((block) => (
            <article key={block.id} className="journaling-manifestation__card">
              <div className="journaling-manifestation__card-heading">
                <span aria-hidden="true">{block.emoji}</span>
                <div>
                  <h3>{block.title}</h3>
                  <p>{block.description}</p>
                </div>
              </div>
              <textarea
                value={manifestationBoard[block.id] ?? ''}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setManifestationBoard((previous) => ({ ...previous, [block.id]: event.target.value }))
                }
                placeholder={block.placeholder}
                rows={block.id === 'people' ? 4 : 5}
              />
              {manifestationBoard[block.id]?.trim().length > 0 ? (
                <div className="journaling-manifestation__chips">
                  {manifestationBoard[block.id]
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0)
                    .slice(0, 4)
                    .map((line) => (
                      <span key={`${block.id}-${line}`} className="journaling-manifestation__chip">
                        {line}
                      </span>
                    ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="journaling-save">
        <button type="button" className="journaling-save__button" onClick={handleSubmit}>
          Ajouter cette page
        </button>
        <div
          className={`journaling-save__confirmation${saveConfirmationVisible ? ' is-visible' : ''}`}
          aria-live="polite"
        >
          <span aria-hidden="true">✅</span>
          <strong>Page ajoutée !</strong>
        </div>
      </section>

     <section className="journaling-history">
  <div className="journaling-history__header">
    <h2>Archives</h2>
    <button
      type="button"
      className="journaling-history__toggle"
      onClick={() => setArchiveOpen((v) => !v)}
      aria-expanded={archiveOpen}
    >
      {archiveOpen ? 'Réduire les archives' : 'Afficher les archives'}
    </button>
  </div>
  {archiveOpen ? (
    entriesByYear.length > 0 ? (
      <div className="journaling-history__years">
        {entriesByYear.map((group) => (
          <button
            key={group.year}
            type="button"
            className="journaling-history__year-card"
            onClick={() => {
              setSelectedYear(group.year)
              setSelectedDay(null)
            }}
          >
            <span className="journaling-history__year">{group.year}</span>
            <span className="journaling-history__year-count">{group.totalEntries} page(s)</span>
          </button>
        ))}
      </div>
    ) : (
      <p className="journaling-history__empty">Aucune archive pour le moment.</p>
    )
  ) : null}
</section>
{selectedYearGroup ? (
  <div className="journaling-history-modal" role="dialog" aria-modal="true">
    <div className="journaling-history-modal__backdrop" onClick={() => setSelectedYear(null)} />
    <div className="journaling-history-modal__content">
      <header className="journaling-history-modal__header">
        <div>
          <p>Année</p>
          <h3>{selectedYearGroup.year}</h3>
          <span>{selectedYearGroup.totalEntries} page(s)</span>
        </div>
        <button type="button" onClick={() => setSelectedYear(null)}>
          Fermer
        </button>
      </header>
      <div className="journaling-history-modal__body">
        <div className="journaling-history-modal__dates">
          {selectedYearGroup.dates.map(({ date, items }) => (
            <button
              key={date}
              type="button"
              className={`journaling-history__day-card${selectedDay === date ? ' is-active' : ''}`}
              onClick={() => setSelectedDay((previous) => (previous === date ? null : date))}
            >
              <span>{date}</span>
              <strong>{items.length} page(s)</strong>
            </button>
          ))}
        </div>
        {activeDayGroup ? (
          <article className="journaling-history__group">
            <header className="journaling-history__group-header">
              <div>
                <time>{activeDayGroup.date}</time>
                <span>{activeDayGroup.items.length} page(s)</span>
              </div>
            </header>
            <ul>
              {activeDayGroup.items.map((entry) => {
                const entryFeelings =
                  entry.feelings && entry.feelings.length > 0
                    ? entry.feelings
                    : entry.feeling
                      ? [entry.feeling]
                      : []
                const feelingEmojis = entryFeelings
                  .map((value) => feelings.find((option) => option.value === value)?.emoji)
                  .filter((emoji): emoji is string => Boolean(emoji))
                const freeWritingText =
                  entry.freeWriting ??
                  (entry.prompts && entry.prompts.length > 0 ? '' : entry.content)

                return (
                  <li key={entry.id}>
                    <div className="journaling-history__feeling">
                      <span aria-hidden="true" className="journaling-history__feeling-emoji">
                        {feelingEmojis.length > 0 ? feelingEmojis.join(' ') : ''}
                      </span>
                      <div className="journaling-history__feeling-info">
                        <span className="journaling-history__feeling-label">
                          {entryFeelings.length > 0
                            ? entryFeelings
                                .map((value) => feelings.find((option) => option.value === value)?.label ?? value)
                                .join(', ')
                            : 'Humeur'}
                        </span>
                        <span className="journaling-history__mood">{entry.mood}</span>
                      </div>
                    </div>
                    {entry.feelingReason.length > 0 && (
                      <p className="journaling-history__why">
                        <strong>Pourquoi :</strong> {entry.feelingReason}
                      </p>
                    )}
                    {entry.prompts && entry.prompts.length > 0 && (
                      <div className="journaling-history__prompts">
                        {entry.prompts.map((section) => (
                          <div key={section.id} className="journaling-history__prompt-section">
                            <h4>{section.title}</h4>
                            <ul>
                              {section.answers.map((answer) => {
                                if (answer.type === 'list') {
                                  return (
                                    <li key={`${section.id}-${answer.label}`}>
                                      <strong>{answer.label}</strong>
                                      <ul>
                                        {answer.items.map((item) => (
                                          <li key={item}>{item}</li>
                                        ))}
                                      </ul>
                                    </li>
                                  )
                                }

                                return (
                                  <li key={`${section.id}-${answer.label}`}>
                                    <strong>{answer.label}</strong>
                                    <p>{answer.value}</p>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {freeWritingText.length > 0 && (
                      <div className="journaling-history__freewrite">
                        <h4>Texte libre</h4>
                        {freeWritingText.split(/\n+/).map((paragraph, index) => (
                          <p key={`${entry.id}-paragraph-${index}`}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </article>
        ) : (
          <p className="journaling-history-modal__empty">Sélectionne un jour pour consulter tes pages.</p>
        )}
      </div>
    </div>
  </div>
) : null}
<div className="journaling-page__footer-bar" aria-hidden="true" />
</div>

)
  
}

export default JournalingPage

