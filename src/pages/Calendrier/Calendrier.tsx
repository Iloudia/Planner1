import { useMemo, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { getDateKey } from '../../data/sampleData'
import type { ScheduledTask } from '../../data/sampleData'
import { useTasks } from '../../context/TasksContext'
import PageHeading from '../../components/PageHeading'
import './CalendarPage.css'

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const newTaskColors = ['#A5B4FC', '#7DD3FC', '#FBCFE8', '#BBF7D0', '#FDE68A']

type NewTaskFormState = {
  title: string
  start: string
  end: string
  color: string
  repeatStart: string
  repeatEnd: string
  category: 'Perso' | 'Professionnel'
}

const createNewTaskForm = (dateKey: string): NewTaskFormState => ({
  title: '',
  start: '09:00',
  end: '10:00',
  color: newTaskColors[0],
  repeatStart: dateKey,
  repeatEnd: dateKey,
  category: 'Perso',
})

const humanDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const formatDateLabel = (value: string | null) => {
  if (!value) {
    return ''
  }
  const label = humanDateFormatter.format(parseDateKey(value))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const formatMonthTitle = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
  const label = formatter.format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const withAlpha = (hexColor: string, alpha: number) => {
  const parsed = hexColor.replace('#', '')
  const bigint = parseInt(parsed, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const parseDateKey = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

const parseTaskDate = (task: ScheduledTask) => {
  const [taskYear, taskMonth, taskDay] = task.date.split('-').map(Number)
  return new Date(taskYear, (taskMonth ?? 1) - 1, taskDay ?? 1)
}

const getTaskDateTime = (task: ScheduledTask) => {
  const date = parseTaskDate(task)
  const [hours, minutes] = task.start.split(':').map(Number)
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  return date
}

const CalendrierPage = () => {
  const { tasks, addTask, updateTask, removeTask } = useTasks()
  const today = new Date()
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const base = new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [activeDateKey, setActiveDateKey] = useState<string | null>(null)
  const [isDayModalOpen, setDayModalOpen] = useState(false)
  const [editDraft, setEditDraft] = useState({
    start: '',
    end: '',
    color: '#000000',
  })
  const [newTaskForm, setNewTaskForm] = useState<NewTaskFormState>(() => createNewTaskForm(getDateKey(today)))
  const [newTaskError, setNewTaskError] = useState<string | null>(null)

  const year = currentMonthDate.getFullYear()
  const month = currentMonthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (firstDay.getDay() + 6) % 7
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7

  const tasksThisMonth = useMemo(
    () =>
      tasks.filter((task) => {
        const [taskYear, taskMonth] = task.date.split('-').map(Number)
        return taskYear === year && taskMonth === month + 1
      }),
    [tasks, year, month],
  )

  const heroStats: Array<{ id: string; label: string; value: string }> = []

  const nextTask = useMemo(() => {
    const now = new Date()
    const upcoming = tasksThisMonth
      .map((task) => ({ task, dateTime: getTaskDateTime(task) }))
      .filter((entry) => entry.dateTime.getTime() >= now.getTime())
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
    return upcoming[0]?.task ?? null
  }, [tasksThisMonth])

  const nextTaskLabel = useMemo(() => formatDateLabel(nextTask?.date ?? null), [nextTask])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, ScheduledTask[]>()
    tasks.forEach((task) => {
      const list = map.get(task.date) ?? []
      list.push(task)
      map.set(task.date, list)
    })

    map.forEach((list, key) => {
      list.sort((a, b) => a.start.localeCompare(b.start))
      map.set(key, list)
    })

    return map
  }, [tasks])

  const activeDateTasks = activeDateKey ? tasksByDate.get(activeDateKey) ?? [] : []

  const activeDateLabel = useMemo(() => formatDateLabel(activeDateKey), [activeDateKey])
  const newTaskRangeLabel = useMemo(() => {
    const startLabel = formatDateLabel(newTaskForm.repeatStart || null)
    const endLabel = formatDateLabel(newTaskForm.repeatEnd || null)
    if (!startLabel || !endLabel) {
      return ''
    }
    return startLabel === endLabel ? startLabel : `${startLabel} -> ${endLabel}`
  }, [newTaskForm.repeatStart, newTaskForm.repeatEnd])

  const handleMonthChange = (delta: number) => {
    setCurrentMonthDate((previous) => {
      const next = new Date(previous)
      next.setMonth(previous.getMonth() + delta, 1)
      return next
    })
  }

  const handlePlanForDate = (dateKey: string) => {
    handleDaySelect(dateKey, { presetForm: true })
  }

  const handleEditClick = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId)
    if (!task) {
      return
    }

    setEditingTaskId(taskId)
    setEditDraft({
      start: task.start,
      end: task.end,
      color: task.color,
    })
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
  }

  const handleDraftChange = (field: 'start' | 'end' | 'color', value: string) => {
    setEditDraft((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmitEdit = (event: FormEvent<HTMLFormElement>, taskId: string) => {
    event.preventDefault()
    updateTask(taskId, {
      start: editDraft.start,
      end: editDraft.end,
      color: editDraft.color,
    })
    setEditingTaskId(null)
  }

  const handleDeleteTask = (taskId: string) => {
    const confirmation = window.confirm('Supprimer cette tache ?')
    if (!confirmation) {
      return
    }
    removeTask(taskId)
    setEditingTaskId((previous) => (previous === taskId ? null : previous))
  }

  const handlePrepareNewTask = (dateKey: string) => {
    setNewTaskForm((previous) => ({
      ...createNewTaskForm(dateKey),
      color: previous.color,
      category: previous.category,
    }))
    setNewTaskError(null)
  }

  const handleDaySelect = (dateKey: string, options?: { presetForm?: boolean }) => {
    setActiveDateKey(dateKey)
    setDayModalOpen(true)
    setEditingTaskId(null)
    if (options?.presetForm) {
      handlePrepareNewTask(dateKey)
    } else {
      setNewTaskForm((previous) => {
        if (previous.title.trim().length > 0) {
          return previous
        }
        if (previous.repeatStart === dateKey && previous.repeatEnd === dateKey) {
          return previous
        }
        return {
          ...previous,
          repeatStart: dateKey,
          repeatEnd: dateKey,
        }
      })
    }
  }

  const handleCloseModal = () => {
    setDayModalOpen(false)
    setActiveDateKey(null)
    setEditingTaskId(null)
    setNewTaskError(null)
  }

  const handleNewTaskFieldChange = (field: keyof NewTaskFormState, value: string) => {
    setNewTaskForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleNewTaskCategoryChange = (category: 'Perso' | 'Professionnel') => {
    setNewTaskForm((previous) => ({
      ...previous,
      category,
    }))
  }

  const handleResetDay = () => {
    if (!activeDateKey) {
      return
    }
    const tasksForDay = tasksByDate.get(activeDateKey) ?? []
    tasksForDay.forEach((task) => removeTask(task.id))
    setNewTaskForm(createNewTaskForm(activeDateKey))
    setNewTaskError(null)
    setEditingTaskId(null)
    setEditDraft({
      start: '',
      end: '',
      color: '#000000',
    })
  }

  const handleSubmitNewTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNewTaskError(null)
    const title = newTaskForm.title.trim()
    if (!title) {
      setNewTaskError('Ajoute un titre a ton bloc.')
      return
    }
    if (!newTaskForm.repeatStart || !newTaskForm.repeatEnd) {
      setNewTaskError('Selectionne une periode valide.')
      return
    }
    const startDate = parseDateKey(newTaskForm.repeatStart)
    const endDate = parseDateKey(newTaskForm.repeatEnd)
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setNewTaskError('Impossible de comprendre ces dates.')
      return
    }
    if (startDate.getTime() > endDate.getTime()) {
      setNewTaskError('La date de fin doit etre posterieure a la date de debut.')
      return
    }

    const dateKeys: string[] = []
    for (let cursor = new Date(startDate); cursor.getTime() <= endDate.getTime(); cursor.setDate(cursor.getDate() + 1)) {
      dateKeys.push(getDateKey(cursor))
    }

    const startTime = newTaskForm.start.trim().length > 0 ? newTaskForm.start : '09:00'
    const endTime = newTaskForm.end.trim().length > 0 ? newTaskForm.end : '10:00'
    const color = newTaskForm.color || newTaskColors[0]

    dateKeys.forEach((dateKey) => {
      addTask({
        id: `task-${dateKey}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        start: startTime,
        end: endTime,
        date: dateKey,
        color,
        tag: newTaskForm.category,
      })
    })

    setNewTaskForm((previous) => ({
      ...previous,
      title: '',
    }))
    setNewTaskError(null)
  }

  const handleDayKeyDown = (event: KeyboardEvent<HTMLDivElement>, dateKey: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleDaySelect(dateKey)
    }
  }

  const cells = useMemo(() => {
    return Array.from({ length: totalCells }, (_, index) => {
      const dayNumber = index - offset + 1
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        return { key: `empty-${index}`, day: null as number | null, dateKey: null, tasks: [], isToday: false }
      }

      const currentDate = new Date(year, month, dayNumber)
      const dateKey = getDateKey(currentDate)
      return {
        key: dateKey,
        dateKey,
        day: dayNumber,
        tasks: tasksByDate.get(dateKey) ?? [],
        isToday:
          dayNumber === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
      }
    })
  }, [daysInMonth, month, offset, tasksByDate, today, totalCells, year])

  const totalScheduled = tasks.length

  return (
    <div className="calendar-page">
      <section className="calendar-hero">
        <div className="calendar-hero__content">
          <h1>Orchestre ton mois avec intention et douceur.</h1>
          <p>
            Visualise en un coup d’œil tes rendez-vous clés, tes temps de pause et tes moments de création. 
          </p>
          <div className="calendar-hero__actions">
            <button
              type="button"
              className="calendar-hero__cta calendar-hero__cta--primary"
              onClick={() => handlePlanForDate(getDateKey(today))}
            >
              Planifier un évènement aujourd'hui
            </button>
            <button
              type="button"
              className="calendar-hero__cta calendar-hero__cta--ghost"
              onClick={() => {
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                handlePlanForDate(getDateKey(tomorrow))
              }}
            >
              Planifier un évènement demain
            </button>
          </div>
          

          <div className="calendar-hero__stats">
            {heroStats.map((stat) => (
              <article key={stat.id}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>
        </div>
        
        <div className="calendar-hero__panel">
          <div className="calendar-next">
            <span className="calendar-next__label">Prochain rendez-vous</span>
            <strong>{nextTask ? nextTask.title : 'Rien de planifié pour le moment.'}</strong>
            <p>
              {nextTask ? `${nextTaskLabel} - ${nextTask.start} - ${nextTask.end}` : 'Ajoute un créneau.'}
            </p>
            {nextTask?.tag ? <span className="calendar-next__tag">{nextTask.tag}</span> : null}
          </div>
        </div>
      </section>
      <div className="page-accent-bar" aria-hidden="true" />

      <header className="calendar-header">
        <PageHeading eyebrow="calendrier mensuel" title={formatMonthTitle(currentMonthDate)} />
        <div className="calendar-month-nav">
          <button type="button" onClick={() => handleMonthChange(-1)} aria-label="Mois precedent">
            &lt;
          </button>
          <button type="button" onClick={() => handleMonthChange(1)} aria-label="Mois suivant">
            &gt;
          </button>
        </div>
      </header>

      <div className="calendar-grid">
        {weekDays.map((label) => (
          <div key={label} className="calendar-grid__weekday">
            {label}
          </div>
        ))}

        {cells.map((cell) =>
          cell.day === null || cell.dateKey === null ? (
            <div key={cell.key} className="calendar-day calendar-day--empty" />
          ) : (
            <div
              key={cell.key}
              className={`calendar-day${cell.isToday ? ' calendar-day--today' : ''}`}
              onClick={() => handleDaySelect(cell.dateKey!)}
              onKeyDown={(event) => handleDayKeyDown(event, cell.dateKey!)}
              role="button"
              tabIndex={0}
              aria-label={`Voir la journee du ${cell.dateKey}`}
            >
              <div className="calendar-day__header">
                <span className="calendar-day__number">{cell.day}</span>
                <button
                  type="button"
                  className="calendar-day__add"
                  onClick={(event) => {
                    event.stopPropagation()
                    handlePlanForDate(cell.dateKey!)
                  }}
                  aria-label={`Ajouter une tache le ${cell.dateKey}`}
                >
                  +
                </button>
              </div>
              {cell.tasks[0] ? (
                <>
                  <div
                    className="calendar-day__preview"
                    style={{
                      background: `linear-gradient(135deg, ${withAlpha(cell.tasks[0].color, 0.12)} 0%, ${withAlpha(
                        cell.tasks[0].color,
                        0.32,
                      )} 100%)`,
                    }}
                  >
                    <span className="calendar-day__preview-time">
                      {cell.tasks[0].start} - {cell.tasks[0].end}
                    </span>
                    <span className="calendar-day__preview-title">{cell.tasks[0].title}</span>
                  </div>
                  {cell.tasks.length > 1 ? (
                    <span className="calendar-day__more">+ {cell.tasks.length - 1} autres moments</span>
                  ) : null}
                </>
              ) : (
                <span className="calendar-day__empty">Rien de prévu</span>
              )}
            </div>
          ),
        )}
      </div>

      {isDayModalOpen && activeDateKey ? (
        <div className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-modal-title">
          <div className="calendar-modal__backdrop" onClick={handleCloseModal} aria-hidden="true" />
          <div className="calendar-modal__panel">
            <header className="calendar-modal__header">
              <div>
                <span className="calendar-modal__eyebrow">seance du jour</span>
                <h2 id="calendar-modal-title">{activeDateLabel}</h2>
                <p>
                  {activeDateTasks.length > 0
                    ? activeDateTasks.length === 1
                      ? '1 créneau.'
                      : `${activeDateTasks.length} creneaux.`
                    : "Aucun créneau pour l'instant, profite pour en poser un."}
                </p>
              </div>
              <button type="button" className="modal__close" onClick={handleCloseModal} aria-label="Fermer">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="calendar-modal__actions">
              <button
                type="button"
                className="calendar-hero__cta calendar-hero__cta--ghost"
                onClick={handleResetDay}
              >
                Réinitialiser la journée
              </button>
            </div>

            <div className="calendar-modal__columns">
            <section className="calendar-modal__section">
              <div className="calendar-modal__section-header">
                <h3>Programmer un bloc</h3>
              </div>
              <form className="calendar-new-task" onSubmit={handleSubmitNewTask}>
                <label className="calendar-task__field calendar-task__field--full">
                  <span>Titre</span>
                  <input
                    type="text"
                    value={newTaskForm.title}
                    onChange={(event) => handleNewTaskFieldChange('title', event.target.value)}
                    placeholder="Bloc deep work, rendez-vous, self-care..."
                    required
                  />
                </label>
                <div className="calendar-task__form-row">
                  <label className="calendar-task__field">
                    <span>Début</span>
                    <input
                      type="time"
                      value={newTaskForm.start}
                      onChange={(event) => handleNewTaskFieldChange('start', event.target.value)}
                      required
                    />
                  </label>
                  <label className="calendar-task__field">
                    <span>Fin</span>
                    <input
                      type="time"
                      value={newTaskForm.end}
                      onChange={(event) => handleNewTaskFieldChange('end', event.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="calendar-task__form-row">
                  <label className="calendar-task__field">
                    <span>Du</span>
                    <input
                      type="date"
                      value={newTaskForm.repeatStart}
                      onChange={(event) => handleNewTaskFieldChange('repeatStart', event.target.value)}
                    />
                  </label>
                  <label className="calendar-task__field">
                    <span>Au</span>
                    <input
                      type="date"
                      value={newTaskForm.repeatEnd}
                      min={newTaskForm.repeatStart}
                      onChange={(event) => handleNewTaskFieldChange('repeatEnd', event.target.value)}
                    />
                  </label>
                </div>
                <div className="calendar-task__form-row calendar-task__form-row--split">
                  <label className="calendar-task__field calendar-task__field--full calendar-task__field--color">
                    <span>Couleur</span>
                    <input
                      type="color"
                      value={newTaskForm.color}
                      onChange={(event) => handleNewTaskFieldChange('color', event.target.value)}
                      required
                    />
                  </label>
                  <div className="calendar-task__type-toggle">
                    <span>Type</span>
                    <div className="calendar-task__type-buttons">
                      {(['Perso', 'Professionnel'] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={
                            newTaskForm.category === option
                              ? 'calendar-task__type-button is-active'
                              : 'calendar-task__type-button'
                          }
                          onClick={() => handleNewTaskCategoryChange(option)}
                        >
                          {option === 'Perso' ? 'Perso' : 'Professionnel'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {newTaskError ? <p className="calendar-new-task__error">{newTaskError}</p> : null}
                <button
                  type="submit"
                  className="calendar-hero__cta calendar-hero__cta--primary calendar-new-task__submit"
                >
                  Programmer
                </button>
              </form>
            </section>
            <div className="calendar-modal__divider" aria-hidden="true" />

            <section className="calendar-modal__section">
              <div className="calendar-modal__section-header">
                <h3>Agenda du jour</h3>
              </div>
              <div className="calendar-modal__list">
                {activeDateTasks.length === 0 ? (
                  <p className="calendar-modal__empty">Programme ton premier évènement de la journée.</p>
                ) : (
                  activeDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`calendar-task${editingTaskId === task.id ? ' calendar-task--editing' : ''}`}
                      style={{
                        background: `linear-gradient(135deg, ${withAlpha(task.color, 0.12)} 0%, ${withAlpha(
                          task.color,
                          0.32,
                        )} 100%)`,
                      }}
                      onClick={() => {
                        if (editingTaskId === task.id) {
                          return
                        }
                        handleEditClick(task.id)
                      }}
                    >
                      {editingTaskId === task.id ? (
                        <form className="calendar-task__form" onSubmit={(event) => handleSubmitEdit(event, task.id)}>
                          <div className="calendar-task__form-row">
                            <label className="calendar-task__field">
                              <span>Début</span>
                              <input
                                type="time"
                                value={editDraft.start}
                                onChange={(event) => handleDraftChange('start', event.target.value)}
                                required
                              />
                            </label>
                            <label className="calendar-task__field">
                              <span>Fin</span>
                              <input
                                type="time"
                                value={editDraft.end}
                                onChange={(event) => handleDraftChange('end', event.target.value)}
                                required
                              />
                            </label>
                          </div>
                          <label className="calendar-task__field calendar-task__field--full calendar-task__field--color">
                            <span>Couleur</span>
                            <input
                              type="color"
                              value={editDraft.color}
                              onChange={(event) => handleDraftChange('color', event.target.value)}
                              required
                            />
                          </label>
                          <div className="calendar-task__actions">
                            <button
                              type="button"
                              className="calendar-task__button calendar-task__button--ghost"
                              onClick={handleCancelEdit}
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              className="calendar-task__button calendar-task__button--ghost"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              Supprimer
                            </button>
                            <button type="submit" className="calendar-task__button calendar-task__button--primary">
                              Sauvegarder
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="calendar-task__header">
                            <span className="calendar-task__time">
                              {task.start} - {task.end}
                            </span>
                            <button
                              type="button"
                              className="calendar-task__edit"
                              onClick={(event) => {
                                event.stopPropagation()
                                handleEditClick(task.id)
                              }}
                              aria-label={`Modifier ${task.title}`}
                            >
                              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                                <path
                                  d="M4.5 14.75 3.5 17l2.25-1 7.75-7.75-1.5-1.5L4.5 14.75Zm9.2-9.2 1.5 1.5 1.3-1.3a.75.75 0 0 0 0-1.06l-.94-.94a.75.75 0 0 0-1.06 0l-1.3 1.3Z"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="0.3"
                                />
                              </svg>
                            </button>
                          </div>
                          <span className="calendar-task__title">{task.title}</span>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
            </div>
          </div>
        </div>
      ) : null}
      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default CalendrierPage

