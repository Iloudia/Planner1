import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import usePersistentState from '../../hooks/usePersistentState'
import activitiesMood01 from '../../assets/planner-05.jpg'
import activitiesMood02 from '../../assets/planner-08.jpg'
import activitiesMood03 from '../../assets/planner-06.jpg'
import PageHero from '../../components/PageHero'
import PageHeading from '../../components/PageHeading'
import '../Finances/FinancePage.css'
import './ActivitiesPage.css'

type ActivityStatus = 'a-faire' | 'planifie' | 'fait'

type Activity = {
  id: string
  title: string
  category?: string
  status: ActivityStatus
  idealDate?: string
  photo?: string
}

type ActivityDraft = {
  title: string
  category: string
  status: ActivityStatus
  idealDate: string
  photo?: string
}

const statusOptions: Array<{ value: ActivityStatus; label: string }> = [
  { value: 'planifie', label: 'Planifiée' },
  { value: 'fait', label: 'Réalisée' },
]

const categoryPalette = ['#C7D2FE', '#FBCFE8', '#FDE68A', '#E9D5FF', '#BFDBFE']

const defaultActivities: Activity[] = [
  { id: 'act-1', title: 'Cours de poterie', category: 'Créativité', status: 'planifie', idealDate: '', photo: undefined },
  { id: 'act-2', title: 'Randonnée au lever du soleil', category: 'Nature', status: 'a-faire', idealDate: '', photo: undefined },
  { id: 'act-3', title: 'Atelier photo', category: 'Créativité', status: 'fait', idealDate: '', photo: undefined },
]

const activitiesHeroImages = [
  { src: activitiesMood01, alt: 'Moment créatif en couleur pastel' },
  { src: activitiesMood02, alt: 'Carnet ouvert sur une table claire' },
  { src: activitiesMood03, alt: 'Palette et couleurs douces' },
]

const formatDate = (value?: string) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(date)
}

const ActivitiesPage = () => {
  const [activities, setActivities] = usePersistentState<Activity[]>('planner.activities', () => defaultActivities)
  const [draft, setDraft] = useState<ActivityDraft>({
    title: '',
    category: '',
    status: 'planifie',
    idealDate: '',
    photo: undefined,
  })

  useEffect(() => {
    document.body.classList.add('planner-page--white')
    return () => {
      document.body.classList.remove('planner-page--white')
    }
  }, [])

  const plannedActivities = useMemo(
    () => activities.filter((activity) => activity.status === 'planifie' || activity.status === 'a-faire'),
    [activities],
  )

  const completedActivities = useMemo(
    () => activities.filter((activity) => activity.status === 'fait'),
    [activities],
  )

  const activitiesStats = useMemo(() => {
    const inspirations = activities.filter((activity) => activity.status === 'a-faire').length
    const scheduled = activities.filter((activity) => activity.status === 'planifie').length
    const completed = activities.filter((activity) => activity.status === 'fait').length
    return [
      { id: 'ideas', label: 'Idées', value: inspirations.toString() },
      { id: 'scheduled', label: 'Dates prévues', value: scheduled.toString() },
      { id: 'done', label: 'Moments vécus', value: completed.toString() },
    ]
  }, [activities])

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.activity-card__menu')) {
        setOpenMenuId(null)
      }
    }
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openMenuId])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (draft.title.trim().length === 0) {
      return
    }

    const nextActivity: Activity = {
      id: `activity-${Date.now()}`,
      title: draft.title.trim(),
      category: draft.category.trim().length > 0 ? draft.category.trim() : undefined,
      status: draft.status,
      idealDate: draft.idealDate,
      photo: draft.photo,
    }

    setActivities((previous) => [nextActivity, ...previous])
    setDraft({ title: '', category: '', status: draft.status, idealDate: '', photo: undefined })
  }

  const handleDraftPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft((previous) => ({ ...previous, photo: reader.result }))
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleClearDraftPhoto = () => {
    setDraft((previous) => ({ ...previous, photo: undefined }))
  }

  const handlePhotoChange = (activityId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const nextPhoto = typeof reader.result === 'string' ? reader.result : undefined
      setActivities((previous) =>
        previous.map((activity) => (activity.id === activityId ? { ...activity, photo: nextPhoto } : activity)),
      )
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleRemovePhoto = (activityId: string) => {
    setActivities((previous) =>
      previous.map((activity) => (activity.id === activityId ? { ...activity, photo: undefined } : activity)),
    )
  }

  const handleDelete = (activityId: string) => {
    setActivities((previous) => previous.filter((activity) => activity.id !== activityId))
    setOpenMenuId(null)
  }

  const handleMarkDone = (activityId: string) => {
    setActivities((previous) =>
      previous.map((activity) => (activity.id === activityId ? { ...activity, status: 'fait' } : activity)),
    )
  }

  const [editingDateId, setEditingDateId] = useState<string | null>(null)

  const handleChangeDate =
    (activityId: string) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const newDate = event.target.value
      setActivities((previous) =>
        previous.map((activity) =>
          activity.id === activityId ? { ...activity, idealDate: newDate.trim() } : activity,
        ),
      )
      setOpenMenuId(null)
      setEditingDateId(null)
    }

  const dateInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const focusDateInput = (activityId: string) => {
    setEditingDateId(activityId)
    const target = dateInputRefs.current[activityId]
    if (target) {
      target.focus()
    }
    setOpenMenuId(null)
  }

  useEffect(() => {
    if (!editingDateId) {
      return
    }
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.activity-card__date-field') && !target.closest('.activity-card__menu-panel')) {
        setEditingDateId(null)
      }
    }
    document.addEventListener('pointerdown', handleClickOutside)
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [editingDateId])

  const renderActivityCard = (activity: Activity, index: number) => {
    return (
      <li
        key={activity.id}
        className="activity-card"
        style={{ borderColor: categoryPalette[index % categoryPalette.length] }}
      >
        <div className="activity-card__media">
          {activity.photo ? (
            <img src={activity.photo} alt={`Visuel pour ${activity.title}`} />
          ) : (
            <div className="activity-card__media-placeholder">Ajoute une photo souvenir</div>
          )}
        </div>
        <div className="activity-card__content">
          <div className="activity-card__header">
            <strong>{activity.title}</strong>
            <div className="activity-card__menu">
              <button
                type="button"
                className="activity-card__menu-trigger"
                onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                aria-expanded={openMenuId === activity.id}
                aria-label="Ouvrir le menu de l'activité"
              >
                ⋮
              </button>
              {openMenuId === activity.id ? (
                <div className="activity-card__menu-panel">
                  <label className="activity-card__menu-item">
                    <input type="file" accept="image/*" onChange={handlePhotoChange(activity.id)} />
                    Modifier la photo
                  </label>
                  <button
                    type="button"
                    className="activity-card__menu-item activity-card__menu-item--light"
                    onClick={() => focusDateInput(activity.id)}
                  >
                    Changer la date
                  </button>
                  <button
                    type="button"
                    className="activity-card__menu-item activity-card__menu-item--danger"
                    onClick={() => handleDelete(activity.id)}
                  >
                    Supprimer l'activité
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <p className="activity-card__meta">
            {activity.category ? <span>{activity.category}</span> : null}
            <label className="activity-card__date-field">
              {editingDateId === activity.id ? (
                <time dateTime={activity.idealDate ?? ''}>
                  <input
                    type="date"
                    className="activity-card__date-input"
                    value={activity.idealDate ?? ''}
                    ref={(node) => {
                      dateInputRefs.current[activity.id] = node
                    }}
                    onChange={handleChangeDate(activity.id)}
                    aria-label="Modifier la date"
                  />
                </time>
              ) : activity.idealDate ? (
                <time
                  dateTime={activity.idealDate}
                  onClick={() => focusDateInput(activity.id)}
                  role="button"
                  tabIndex={0}
                >
                  {formatDate(activity.idealDate)}
                </time>
              ) : (
                <button
                  type="button"
                  className="activity-card__date-button"
                  onClick={() => focusDateInput(activity.id)}
                >
                  Changer la date
                </button>
              )}
            </label>
          </p>
          <div className="activity-card__actions">
            <button
              type="button"
              className="activity-card__primary-action"
              onClick={() => handleMarkDone(activity.id)}
              disabled={activity.status === 'fait'}
            >
              {activity.status === 'fait' ? 'Activité réalisée' : 'Marquer comme faite'}
            </button>
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className="activities-page aesthetic-page">
      <PageHero
        eyebrow="Inspiration"
        title="Activités et sorties"
        description="Un espace pour rassembler les idées d'activités qui te font du bien et nourrissent ton énergie."
        stats={activitiesStats}
        images={activitiesHeroImages}
      />
      <div className="activities-page__accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Activités" title="Planning d'activités" />

      <section className="activities-dashboard">
        <div className="activities-form">
          <div className="activities-form__panel dashboard-panel">
            <header className="activities-section-header">
              <span className="activities-section-header__eyebrow">Nouvelle idée</span>
              <h2>Ajouter une activité</h2>
            </header>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Nom</span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(event) => setDraft((previous) => ({ ...previous, title: event.target.value }))}
                  placeholder="Ex : Week-end spa"
                  required
                />
              </label>
              <label>
                <span>Catégorie</span>
                <input
                  type="text"
                  value={draft.category}
                  onChange={(event) => setDraft((previous) => ({ ...previous, category: event.target.value }))}
                  placeholder="Ex : Bien-être"
                />
              </label>
              <label className="activities-form__select">
                <span>Statut</span>
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft((previous) => ({ ...previous, status: event.target.value as ActivityStatus }))
                  }
                >
                  {statusOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Date idéale</span>
                <input
                  type="date"
                  value={draft.idealDate}
                  onChange={(event) => setDraft((previous) => ({ ...previous, idealDate: event.target.value }))}
                />
              </label>
              <div className="activities-form__photo">
                <div
                  className={`activities-form__photo-preview${draft.photo ? ' activities-form__photo-preview--has-image' : ''}`}
                >
                  {draft.photo ? (
                    <img className="activities-form__photo-img" src={draft.photo} alt="Aperçu de la photo sélectionnée" />
                  ) : (
                    <p>Ajoute une photo souvenir depuis ton ordinateur.</p>
                  )}
                  <div className="activities-form__photo-actions">
                    <label>
                      <input type="file" accept="image/*" onChange={handleDraftPhotoChange} />
                      Choisir une photo
                    </label>
                    {draft.photo ? (
                      <button type="button" onClick={handleClearDraftPhoto}>
                        Retirer
                      </button>
                    ) : null}
                  </div>
                  <span className="activities-form__photo-hint">Formats image acceptés (JPG, PNG, GIF).</span>
                </div>
              </div>
              <button type="submit" className="activities-form__submit">
                Ajouter à la liste
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="activities-split">
        <article className="activities-group dashboard-panel">
          <header>
            <h2>Planifiée</h2>
            <span>{plannedActivities.length} activité(s)</span>
          </header>
          {plannedActivities.length === 0 ? (
            <p className="activities-group__empty">Ajoute une idée ou une sortie pour la préparer ici.</p>
          ) : (
            <ul className="activities-group__list">
              {plannedActivities.map((activity, index) => renderActivityCard(activity, index))}
            </ul>
          )}
        </article>
        <div className="activities-split__divider" aria-hidden="true" />
        <article className="activities-group dashboard-panel">
          <header>
            <div>
              <h2>Réalisée</h2>
            </div>
            <span>{completedActivities.length} activité(s)</span>
          </header>
          {completedActivities.length === 0 ? (
            <p className="activities-group__empty">Capture les souvenirs de tes activités déjà vécues.</p>
          ) : (
            <ul className="activities-group__list">
              {completedActivities.map((activity, index) => renderActivityCard(activity, index))}
            </ul>
          )}
        </article>
      </div>

      <div className="activities-page__footer-bar" aria-hidden="true" />
    </div>
  )
}

export default ActivitiesPage
