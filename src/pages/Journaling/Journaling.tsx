import { useEffect, useMemo, useState } from 'react'
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

const getTodayISO = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, '0')
  const day = `${today.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const initialEntries: JournalEntry[] = []

const moods = ['Sereine', 'Energisee', 'Equilibree', 'Fatiguee', 'Fiere']
const feelings: Array<{ value: JournalFeeling; label: string; emoji: string }> = [
  { value: 'joy', label: 'Joyeuse', emoji: '😊' },
  { value: 'sad', label: 'Triste', emoji: '😢' },
  { value: 'angry', label: 'En colere', emoji: '😡' },
  { value: 'excited', label: 'Excitee', emoji: '🤩' },
  { value: 'surprised', label: 'Surprise', emoji: '😲' },
  { value: 'scared', label: 'Effrayee', emoji: '😱' },
  { value: 'shy', label: 'Timide', emoji: '😳' },
  { value: 'confused', label: 'Confuse', emoji: '😕' },
  { value: 'embarrassed', label: 'Embarrassee', emoji: '😅' },
  { value: 'calm', label: 'Calme', emoji: '😌' },
  { value: 'depressed', label: 'Deprimee', emoji: '😞' },
]
const DATE_PROMPT_FIELD_ID = 'prompt-date'

const journalingMoodboard = [
  { src: journalingIllustration, alt: 'Carnet pastel accompagne de fleurs sechees' },
  { src: journalingMoodSecondary, alt: 'Pause ecriture et tasse de the' },
  { src: journalingMoodTertiary, alt: 'Planche inspirante pour journaling' },
] as const

const journalingPromptSections: JournalingPromptSection[] = [
  {
    id: 'daily-state',
    icon: '#1',
    title: '1. Etat du jour',
    accent: '#ffe9f1',
    description: 'Concentre-toi sur ce que tu ressens ici et maintenant.',
    fields: [
      {
        id: DATE_PROMPT_FIELD_ID,
        type: 'textarea',
        label: 'Quelle est la date d\'aujourdhui ?',
        placeholder: 'Laisse ton coeur parler ici...',
      },
      {
        id: 'prompt-mood-now',
        type: 'textarea',
        label: 'Comment je me suis sentie ?',
        placeholder: 'Sensations, emotions, mots qui montent.',
      },
      {
        id: 'prompt-mood-influence',
        type: 'textarea',
        label: 'Qu est-ce qui a influence mon humeur aujourd hui ? (Evenements, pensees, personnes, energie, meteo...)',
        placeholder: 'Note ce qui a change ton humeur ou ton energie.',
      },
      {
        id: 'prompt-learning',
        type: 'textarea',
        label: 'Qu\'ai-je appris ou compris sur moi-meme aujourdhui ?',
        placeholder: 'Depose tes pensees...',
      },
    ],
  },
  {
    id: 'daily-celebration',
    icon: '#2',
    title: '2. Ma journee',
    accent: '#e0f2fe',
    description: 'Revis les belles choses et celebre ce qui compte.',
    fields: [
      {
        id: 'prompt-highlights',
        type: 'textarea',
        label: 'Qu\'est-ce qui s\'est bien passe aujourd\'hui ?',
        placeholder: 'Liste tes victoires, meme minuscules.',
      },
      {
        id: 'prompt-gratitude',
        type: 'textarea',
        label: 'De quoi suis-je reconnaissant(e) ?',
        placeholder: 'Exprime ce qui remplit ton coeur.',
      },
      {
        id: 'prompt-replay',
        type: 'textarea',
        label: 'Y a-t-il un moment que j\'aimerais revivre ?',
        placeholder: 'Quel souvenir doux veux-tu garder precieusement ?',
      },
      {
        id: 'prompt-magic-wand',
        type: 'textarea',
        label: 'Si j\'avais une baguette magique, qu\'est-ce que je changerais dans cette journee ?',
        placeholder: 'Note ce qui te vient spontanement...',
      },
    ],
  },
  {
    id: 'abundance-affirmations',
    icon: '#3',
    title: '3. Affirmations pour attirer l\'argent et l\'abondance',
    accent: '#f3efff',
    description: 'Invite la prosperite dans ton esprit avec des mots qui vibrent pour toi.',
    helper: 'Choisis-en 3 a 5 ou ecris les tiennes.',
    fields: [
      {
        id: 'prompt-money-affirmations',
        type: 'checkboxes',
        label: 'Ce que je souhaite repeter',
        options: [
          'L\'argent circule vers moi facilement et en abondance.',
          'Je merite la richesse sous toutes ses formes.',
          'Chaque jour, je deviens un aimant a opportunites financieres.',
          'Je suis reconnaissant(e) pour tout l\'argent qui entre dans ma vie.',
          'Mes actions attirent la prosperite naturellement.',
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
    description: 'Renforce ta confiance et ancre-toi dans ta valeur.',
    helper: 'Choisis-en 3 a 5 ou ecris les tiennes.',
    fields: [
      {
        id: 'prompt-confidence-affirmations',
        type: 'checkboxes',
        label: 'Ce que je me repete',
        options: [
          'Je crois en mes capacites et je suis fier(fiere) de moi.',
          'Je suis digne d\'amour, de succes et de respect.',
          'Je suis en securite d\'etre moi-meme.',
          'Chaque jour, je deviens plus sur(e) et plus fort(e).',
          'Ma presence a de la valeur.',
        ],
      },
      {
        id: 'prompt-confidence-custom',
        type: 'textarea',
        label: 'Tes declarations personnelles',
        placeholder: 'Ecris des mots doux qui te ressemblent.',
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
        placeholder: 'Imagine l ambiance emotionnelle que tu souhaites vivre.',
      },
      {
        id: 'prompt-self-version',
        type: 'textarea',
        label: 'Quelle version de moi suis-je en train de devenir ?',
        placeholder: 'Decris la personne que tu nourris pas a pas.',
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

  useEffect(() => {
    document.body.classList.add('planner-page--white')
    return () => {
      document.body.classList.remove('planner-page--white')
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

    const normalizedFeelings = draft.feelings.length > 0 ? [...draft.feelings] : (feelings.length > 0 ? [feelings[0].value] : [])

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

    setEntries((previous) => [newEntry, ...previous])
    setDraft((previous) => ({
      ...previous,
      content: '',
      feelingReason: '',
      feelings: feelings.length > 0 ? [feelings[0].value] : [],
    }))
    setPromptResponses(createInitialPromptResponses())
    setPromptSelections(createInitialPromptSelections())
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
  const referenceFeelings =
    latestEntry && latestEntry.feelings && latestEntry.feelings.length > 0
      ? latestEntry.feelings
      : latestEntry && latestEntry.feeling
        ? [latestEntry.feeling]
        : draft.feelings
  const highlightedFeeling =
    feelings.find((option) => referenceFeelings.includes(option.value)) ?? feelings[0]
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(() => new Set(entries.map((entry) => entry.date)))

  const [archiveOpen, setArchiveOpen] = useState(false)

  const toggleDateSection = (date: string) => {
    setCollapsedDates((previous) => {
      const next = new Set(previous)
      if (next.has(date)) {
        next.delete(date)
      } else {
        next.add(date)
      }
      return next
    })
  }

  useEffect(() => {
    setCollapsedDates((previous) => {
      const next = new Set(previous)
      entriesByDate.forEach(([date]) => {
        if (!next.has(date)) {
          next.add(date)
        }
      })
      return next
    })
  }, [entriesByDate])

  const journalingStats = [
    { id: 'pages', label: 'Pages ecrites', value: totalEntries.toString() },
    { id: 'days', label: 'Jours actifs', value: activeDays.toString() },
    {
      id: 'feeling',
      label: 'Humeur du moment',
      value: latestEntry?.mood ?? draft.mood,
      hint: highlightedFeeling.emoji,
    },
  ]
  const dayStateIds = useMemo(() => new Set(['daily-state', 'daily-celebration']), [])
  const dayStateSections = journalingPromptSections.filter((section) => dayStateIds.has(section.id))
  const manifestationBlocks = [
    {
      id: 'affirmations',
      title: 'Affirmations',
      emoji: '✨',
      placeholder: 'Ecris tes phrases positives, separees par des retours a la ligne.',
      description: 'Rappelle-toi qui tu deviens.',
    },
    {
      id: 'gratitude',
      title: 'Ce dont je suis reconnaissante',
      emoji: '🌷',
      placeholder: 'Liste ce qui remplit ton coeur de douceur.',
      description: 'Accueille l abondance actuelle.',
    },
    {
      id: 'people',
      title: 'Croyances limitantes',
      emoji: '🫶',
      placeholder: 'Note les phrases ou pensees que tu souhaites transformer.',
      description: 'Identifie ce qui te retient pour mieux le libere.',
    },
    {
      id: 'intentions',
      title: 'Visualisations',
      emoji: '🌙',
      placeholder: 'Imagine en details la vie que tu manifests.',
      description: 'Projette-toi vers ta vision ideale.',
    },
  ] as const

  return (
    <div className="journaling-page aesthetic-page">
      
      
      <PageHero
        eyebrow="Rituel du jour"
        title="Mon journal pastel"
        description="Prends un instant pour respirer, ecrire et manifester ta vie de reve."
        stats={journalingStats.map(({ id, label, value }) => ({ id, label, value }))}
        images={journalingMoodboard}
        tone="pink"
      >
        <div className="finance-hero__period">
          <span className="finance-hero__badge">Journee du {draft.date}</span>
        </div>
      </PageHero>
      <div className="journaling-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Reflet" title="Mon journal" />

      <section className="journaling-day-state">
        <header className="journaling-day-state__header">
          <div>
            <p className="journaling-day-state__eyebrow">Bulle du jour</p>
            <h2>Etat du jour</h2>
            <p>Une seule bulle toute en longueur pour repondre aux questions des sections 1 et 2.</p>
          </div>
        </header>
        <div className="journaling-day-state__content">
          {dayStateSections.map((section) => (
            <div key={section.id} className="journaling-day-state__group">
              <div className="journaling-day-state__group-heading">
                <span aria-hidden="true" className="journaling-day-state__icon">
                  {section.icon}
                </span>
                <div>
                  <h3>{section.title}</h3>
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
          ))}
        </div>
      </section>

      <section className="journaling-manifestation">
        <header>
          <div>
            <p className="journaling-studio__eyebrow">Espace manifestation</p>
            <h2>Vibre avec tes mots</h2>
            <p>Note tes affirmations, ta gratitude et les personnes qui t inspirent.</p>
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
          <div className="journaling-history__list">
            {entriesByDate.map(([date, items]) => (
              <article key={date} className="journaling-history__group">
                <header className="journaling-history__group-header">
                  <div>
                    <time>{date}</time>
                    <span>{items.length} page(s)</span>
                  </div>
                  <button
                    type="button"
                    className="journaling-history__toggle"
                    onClick={() => toggleDateSection(date)}
                    aria-expanded={!collapsedDates.has(date)}
                  >
                    {collapsedDates.has(date) ? 'Afficher' : 'Réduire'}
                  </button>
                </header>
                {!collapsedDates.has(date) ? (
                  <ul>
                    {items.map((entry) => {
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
                              {feelingEmojis.length > 0 ? feelingEmojis.join(' ') : '🙂'}
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
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </section>
      <div className="journaling-page__footer-bar" aria-hidden="true" />
    </div>
    
  )
  
}


export default JournalingPage
