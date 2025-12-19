import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { RoutineItem } from '../../data/sampleData'
import { eveningRoutine as defaultEveningRoutine, morningRoutine as defaultMorningRoutine } from '../../data/sampleData'
import usePersistentState from '../../hooks/usePersistentState'
import PageHeading from '../../components/PageHeading'
import morningIllustration from '../../assets/morning-note.svg'
import eveningIllustration from '../../assets/evening-note.svg'
import routineHeroImage from '../../assets/kalen-mcdonald-dupe.jpeg'
import './RoutinePage.css'

type RoutineId = string
type RoutinePeriod = 'morning' | 'evening'
type RoutineDraft = {
  title: string
  detail: string
}

const ROUTINE_FIELD_MAX_LENGTH = 67
const COMPLETED_STORAGE_KEY = 'planner.routines.completed'
const MORNING_ROUTINE_STORAGE_KEY = 'planner.routines.morning'
const EVENING_ROUTINE_STORAGE_KEY = 'planner.routines.evening'

const truncateText = (value: string, max = ROUTINE_FIELD_MAX_LENGTH) =>
  value.length > max ? `${value.slice(0, max - 3).trimEnd()}...` : value

type RoutineChecklistProps = {
  items: RoutineItem[]
  completedSet: Set<RoutineId>
  toggleRoutine: (id: RoutineId) => void
  onRemoveItem?: (id: RoutineId) => void
}

const RoutineChecklist = ({
  items,
  completedSet,
  toggleRoutine,
  onRemoveItem,
}: RoutineChecklistProps) => (
  <ul className="routine-note__list">
    {items.map((item, index) => (
      <li className="routine-note__item" key={item.id}>
        <div className="routine-note__row">
          <label className="routine-note__label">
            <span className="routine-note__index">{String(index + 1).padStart(2, '0')}</span>
            <input
              className="routine-note__checkbox"
              type="checkbox"
              checked={completedSet.has(item.id)}
              onChange={() => toggleRoutine(item.id)}
            />
            <span className="routine-note__text">
              <span className="routine-note__item-title">{truncateText(item.title)}</span>
              {item.detail && <span className="routine-note__item-detail">{item.detail}</span>}
            </span>
          </label>
          {onRemoveItem ? (
            <div className="routine-note__actions">
              <button
                type="button"
                className="routine-note__remove"
                onClick={() => onRemoveItem(item.id)}
                aria-label={`Supprimer ${item.title}`}
              >
                ×
              </button>
            </div>
          ) : null}
        </div>
      </li>
    ))}
  </ul>
)

type RoutineComposerProps = {
  draft: RoutineDraft
  onDraftChange: (field: keyof RoutineDraft, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  buttonLabel: string
  placeholderTitle: string
  placeholderDetail: string
}

const RoutineComposer = ({
  draft,
  onDraftChange,
  onSubmit,
  buttonLabel,
  placeholderTitle,
  placeholderDetail,
}: RoutineComposerProps) => (
  <form className="routine-note__composer" onSubmit={onSubmit}>
    <label>
      <span>Nouvelle action</span>
      <input
        type="text"
        value={draft.title}
        onChange={(event) => onDraftChange('title', event.target.value.slice(0, ROUTINE_FIELD_MAX_LENGTH))}
        placeholder={placeholderTitle}
        required
        maxLength={ROUTINE_FIELD_MAX_LENGTH}
      />
      {draft.title.length >= ROUTINE_FIELD_MAX_LENGTH ? (
        <span className="routine-note__composer-hint">Limite de 67 caractères atteinte.</span>
      ) : null}
    </label>
    <label>
      <span>Détail (optionnel)</span>
      <textarea
        value={draft.detail}
        onChange={(event) => onDraftChange('detail', event.target.value.slice(0, ROUTINE_FIELD_MAX_LENGTH))}
        placeholder={placeholderDetail}
        rows={2}
        maxLength={ROUTINE_FIELD_MAX_LENGTH}
      />
      {draft.detail.length >= ROUTINE_FIELD_MAX_LENGTH ? (
        <span className="routine-note__composer-hint">Limite de 67 caractères atteinte.</span>
      ) : null}
    </label>
    <button type="submit" className="routine-note__composer-submit">
      {buttonLabel}
    </button>
  </form>
)

const RoutinePage = () => {
  const [completedIds, setCompletedIds] = usePersistentState<RoutineId[]>(COMPLETED_STORAGE_KEY, () => [])
  const [morningRoutines, setMorningRoutines] = usePersistentState<RoutineItem[]>(
    MORNING_ROUTINE_STORAGE_KEY,
    () => defaultMorningRoutine,
  )
  const [eveningRoutines, setEveningRoutines] = usePersistentState<RoutineItem[]>(
    EVENING_ROUTINE_STORAGE_KEY,
    () => defaultEveningRoutine,
  )
  const [routineDrafts, setRoutineDrafts] = useState<Record<RoutinePeriod, RoutineDraft>>({
    morning: { title: '', detail: '' },
    evening: { title: '', detail: '' },
  })
  const completedSet = useMemo(() => new Set<RoutineId>(completedIds), [completedIds])

  useEffect(() => {
    document.body.classList.add('planner-page--white')
    return () => {
      document.body.classList.remove('planner-page--white')
    }
  }, [])

  const handleRoutineDraftChange = (period: RoutinePeriod, field: keyof RoutineDraft, value: string) => {
    setRoutineDrafts((previous) => ({
      ...previous,
      [period]: {
        ...previous[period],
        [field]: value,
      },
    }))
  }

  const handleRoutineSubmit = (period: RoutinePeriod) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft = routineDrafts[period]
    const trimmedTitle = draft.title.trim()
    if (trimmedTitle.length === 0) {
      return
    }
    const trimmedDetail = draft.detail.trim()
    const newItem: RoutineItem = {
      id: `${period}-${Date.now()}`,
      title: trimmedTitle,
      ...(trimmedDetail.length > 0 ? { detail: trimmedDetail } : {}),
    }
    if (period === 'morning') {
      setMorningRoutines((previous) => [...previous, newItem])
    } else {
      setEveningRoutines((previous) => [...previous, newItem])
    }
    setRoutineDrafts((previous) => ({
      ...previous,
      [period]: { title: '', detail: '' },
    }))
  }

  const handleRoutineRemoval = (period: RoutinePeriod, id: RoutineId) => {
    if (period === 'morning') {
      setMorningRoutines((previous) => previous.filter((item) => item.id !== id))
    } else {
      setEveningRoutines((previous) => previous.filter((item) => item.id !== id))
    }
    setCompletedIds((previous) => previous.filter((value) => value !== id))
  }

  const toggleRoutine = (id: RoutineId) => {
    setCompletedIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((value) => value !== id)
      }
      return [...previous, id]
    })
  }

  return (
    <div className="routine-page aesthetic-page">

      <section className="routine-hero-image">
        <img src={routineHeroImage} alt="Ambiance douce pour ritualiser ses routines quotidiennes" />
      </section>
      <div className="routine-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Routine" title="Rituels quotidiens" />
      

      <div className="routine-notes">
        <section className="routine-note routine-note--morning">
          <div className="routine-note__top">
            <div className="routine-note__title-band">
              <h2>Routine du matin</h2>
            </div>
          </div>
          <div className="routine-note__body">
            <div className="routine-note__pins">
              <span className="routine-note__pin routine-note__pin--left" />
              <span className="routine-note__pin routine-note__pin--right" />
            </div>
            <RoutineChecklist
              items={morningRoutines}
              completedSet={completedSet}
              toggleRoutine={toggleRoutine}
              onRemoveItem={(id) => handleRoutineRemoval('morning', id)}
            />
            <RoutineComposer
              draft={routineDrafts.morning}
              onDraftChange={(field, value) => handleRoutineDraftChange('morning', field, value)}
              onSubmit={handleRoutineSubmit('morning')}
              buttonLabel="Ajouter à ma routine du matin"
              placeholderTitle="Ex : Boire un verre d’eau tiède citronné"
              placeholderDetail="Détaille si besoin (durée, intention...)"
            />
          </div>
        </section>

        <section className="routine-note routine-note--evening">
          <div className="routine-note__top">
            <div className="routine-note__title-band">
              <h2>Routine du soir</h2>
            </div>
          </div>
          <div className="routine-note__body">
            <div className="routine-note__pins">
              <span className="routine-note__pin routine-note__pin--left" />
              <span className="routine-note__pin routine-note__pin--right" />
            </div>
            <RoutineChecklist
              items={eveningRoutines}
              completedSet={completedSet}
              toggleRoutine={toggleRoutine}
              onRemoveItem={(id) => handleRoutineRemoval('evening', id)}
            />
            <RoutineComposer
              draft={routineDrafts.evening}
              onDraftChange={(field, value) => handleRoutineDraftChange('evening', field, value)}
              onSubmit={handleRoutineSubmit('evening')}
              buttonLabel="Ajouter à ma routine du soir"
              placeholderTitle="Ex : Préparer mes vêtements pour demain"
              placeholderDetail="Détaille si besoin (durée, intention...)"
            />
          </div>
        </section>
      </div>

      <div className="routine-page__footer-bar" aria-hidden="true" />
    </div>
  )
}

export default RoutinePage
