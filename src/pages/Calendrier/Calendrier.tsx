import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, KeyboardEvent } from 'react'
import { getDateKey } from '../../data/sampleData'
import type { ScheduledTask } from '../../data/sampleData'
import { useTasks } from '../../context/TasksContext'
import PageHeading from '../../components/PageHeading'
import './CalendarPage.css'
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const hours = Array.from({ length: 18 }, (_, index) => index + 6)
const hourHeight = 56
const newTaskColors = ['#A5B4FC', '#7DD3FC', '#FBCFE8', '#BBF7D0', '#FDE68A']
const dayStartMinutes = 6 * 60
const dayEndMinutes = 23 * 60
const legendColors = {
  Travail: '#f8c4cf',
  Sport: '#f971b3',
  Perso: '#fff6d6',
  'Rendez-vous': '#cdebbd',
  Repos: '#425e40',
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const formatMinutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

type NewTaskFormState = {
  title: string
  start: string
  end: string
  color: string
  repeatStart: string
  repeatEnd: string
  category: 'Travail' | 'Sport' | 'Perso' | 'Rendez-vous' | 'Repos'
}

const createNewTaskForm = (dateKey: string): NewTaskFormState => {
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes() + 1
  const startMinutes = clamp(nowMinutes, dayStartMinutes, dayEndMinutes)
  const endMinutes = clamp(startMinutes + 60, dayStartMinutes, dayEndMinutes)
  return {
    title: '',
    start: formatMinutesToTime(startMinutes),
    end: formatMinutesToTime(endMinutes),
    color: legendColors.Perso,
    repeatStart: dateKey,
    repeatEnd: dateKey,
    category: 'Perso',
  }
}

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

const formatWeekRange = (start: Date) => {
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  const formatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' })
  return `${formatter.format(start)} - ${formatter.format(end)}`
}

const getWeekStart = (reference: Date) => {
  const date = new Date(reference)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
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

const parseTimeToMinutes = (value: string) => {
  const [hoursValue, minutesValue] = value.split(':').map(Number)
  return (hoursValue ?? 0) * 60 + (minutesValue ?? 0)
}

const CalendrierPage = () => {
  const { tasks, addTask, updateTask, removeTask } = useTasks()
  useEffect(() => {
    document.body.classList.add('calendar-page--lux')
    return () => {
      document.body.classList.remove('calendar-page--lux')
    }
  }, [])
  const today = new Date()
  const [now, setNow] = useState(() => new Date())
  const todayKey = getDateKey(today)
  const nowKey = getDateKey(now)
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const base = new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })
  const [calendarView, setCalendarView] = useState<'weekly' | 'monthly'>('weekly')
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 1024)
  const [mobileSelectedDateKey, setMobileSelectedDateKey] = useState(() => getDateKey(new Date()))
  const [weekAnchorDate, setWeekAnchorDate] = useState(() => new Date())
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [duplicateTask, setDuplicateTask] = useState<ScheduledTask | null>(null)
  const [duplicateDays, setDuplicateDays] = useState('3')
  const [duplicateError, setDuplicateError] = useState<string | null>(null)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const categoryMenuRef = useRef<HTMLDivElement | null>(null)
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

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!isCompact) return
    setMobileSelectedDateKey(todayKey)
  }, [isCompact, todayKey])

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isCategoryMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!categoryMenuRef.current) return
      if (categoryMenuRef.current.contains(event.target as Node)) return
      setIsCategoryMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCategoryMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCategoryMenuOpen])

  const nextTask = useMemo(() => {
    const upcoming = tasks
      .map((task) => {
        const startDateTime = getTaskDateTime(task)
        const [endHours, endMinutes] = task.end.split(':').map(Number)
        const endDateTime = new Date(startDateTime)
        endDateTime.setHours(endHours ?? 0, endMinutes ?? 0, 0, 0)
        return { task, startDateTime, endDateTime }
      })
      .filter((entry) => entry.startDateTime.getTime() > now.getTime())
      .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
    return upcoming[0]?.task ?? null
  }, [tasks, now])

  const nextTaskLabel = useMemo(() => formatDateLabel(nextTask?.date ?? null), [nextTask])

  const weekStartDate = getWeekStart(weekAnchorDate)
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStartDate)
    date.setDate(weekStartDate.getDate() + index)
    return date
  })
  const weekRangeLabel = formatWeekRange(weekStartDate)

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
  }, [tasks, now])

  const activeDateTasks = activeDateKey ? tasksByDate.get(activeDateKey) ?? [] : []
  const mobileSelectedTasks = tasksByDate.get(mobileSelectedDateKey) ?? []
  const mobileSelectedLabel = useMemo(() => formatDateLabel(mobileSelectedDateKey), [mobileSelectedDateKey])

  const activeDateLabel = useMemo(() => formatDateLabel(activeDateKey), [activeDateKey])
  const newTaskRangeLabel = useMemo(() => {
    const startLabel = formatDateLabel(newTaskForm.repeatStart || null)
    const endLabel = formatDateLabel(newTaskForm.repeatEnd || null)
    if (!startLabel || !endLabel) {
      return ''
    }
    return startLabel === endLabel ? startLabel : `${startLabel} -> ${endLabel}`
  }, [newTaskForm.repeatStart, newTaskForm.repeatEnd])

  const handleWeekChange = (delta: number) => {
    setWeekAnchorDate((previous) => {
      const next = new Date(previous)
      next.setDate(previous.getDate() + delta * 7)
      return next
    })
  }

  const handleDayChange = (delta: number) => {
    const base = parseDateKey(mobileSelectedDateKey)
    base.setDate(base.getDate() + delta)
    const nextKey = getDateKey(base)
    setMobileSelectedDateKey(nextKey)
    setWeekAnchorDate(base)
  }

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
    const editStartMinutes = parseTimeToMinutes(editDraft.start)
    const editEndMinutes = parseTimeToMinutes(editDraft.end)
    if (
      editStartMinutes < dayStartMinutes ||
      editStartMinutes > dayEndMinutes ||
      editEndMinutes < dayStartMinutes ||
      editEndMinutes > dayEndMinutes
    ) {
      window.alert('Les horaires autorisés sont de 06:00 à 23:00.')
      return
    }
    updateTask(taskId, {
      start: editDraft.start,
      end: editDraft.end,
      color: editDraft.color,
    })
    setEditingTaskId(null)
  }

  const handleDeleteTask = (taskId: string) => {
    const confirmation = window.confirm('Supprimer cette tâche ?')
    if (!confirmation) {
      return
    }
    removeTask(taskId)
    setEditingTaskId((previous) => (previous === taskId ? null : previous))
  }

  const handleDuplicateTask = (task: ScheduledTask) => {
    setDuplicateTask(task)
    setDuplicateDays('3')
    setDuplicateError(null)
  }

  const handleConfirmDuplicate = () => {
    if (!duplicateTask) {
      return
    }
    const days = Number.parseInt(duplicateDays, 10)
    if (!Number.isFinite(days) || days <= 0) {
      setDuplicateError('Nombre de jours invalide.')
      return
    }
    const [yearValue, monthValue, dayValue] = duplicateTask.date.split('-').map(Number)
    const baseDate = new Date(yearValue, (monthValue ?? 1) - 1, dayValue ?? 1)
    for (let offset = 1; offset <= days; offset += 1) {
      const nextDate = new Date(baseDate)
      nextDate.setDate(baseDate.getDate() + offset)
      const dateKey = getDateKey(nextDate)
      addTask({
        id: `task-${dateKey}-${Math.random().toString(36).slice(2, 8)}`,
        title: duplicateTask.title,
        start: duplicateTask.start,
        end: duplicateTask.end,
        date: dateKey,
        color: duplicateTask.color,
        tag: duplicateTask.tag,
      })
    }
    setDuplicateTask(null)
    setDuplicateDays('3')
    setDuplicateError(null)
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
    setDuplicateTask(null)
    setDuplicateError(null)
  }

  const handleCloseDuplicate = () => {
    setDuplicateTask(null)
    setDuplicateError(null)
  }

  const handleNewTaskFieldChange = (field: keyof NewTaskFormState, value: string) => {
    setNewTaskForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleNewTaskCategoryChange = (category: NewTaskFormState['category']) => {
    setNewTaskForm((previous) => ({
      ...previous,
      category,
      color: legendColors[category] ?? previous.color,
    }))
  }

  const handleResetDay = () => {
    if (!activeDateKey) {
      return
    }
    const confirmation = window.confirm('Supprimer tous les événements de cette journée ?')
    if (!confirmation) {
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
      setNewTaskError('Ajoute un titre à ton bloc.')
      return
    }
    if (!newTaskForm.repeatStart || !newTaskForm.repeatEnd) {
      setNewTaskError('Sélectionne une période valide.')
      return
    }
    const startDate = parseDateKey(newTaskForm.repeatStart)
    const endDate = parseDateKey(newTaskForm.repeatEnd)
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setNewTaskError('Impossible de comprendre ces dates.')
      return
    }
    if (startDate.getTime() > endDate.getTime()) {
      setNewTaskError('La date de fin doit être postérieure à la date de début.')
      return
    }

    const todayStart = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    if (startDate.getTime() < todayStart.getTime()) {
      setNewTaskError('Impossible de programmer un événement dans le passé.')
      return
    }

    const startTime = newTaskForm.start.trim().length > 0 ? newTaskForm.start : '09:00'
    const startMinutes = parseTimeToMinutes(startTime)
    const endMinutes = parseTimeToMinutes(newTaskForm.end.trim().length > 0 ? newTaskForm.end : '10:00')
    if (
      startMinutes < dayStartMinutes ||
      startMinutes > dayEndMinutes ||
      endMinutes < dayStartMinutes ||
      endMinutes > dayEndMinutes
    ) {
      setNewTaskError('Les horaires autorisés sont de 06:00 à 23:00.')
      return
    }
    if (startDate.toDateString() === todayStart.toDateString()) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes()
      if (startMinutes <= nowMinutes) {
        setNewTaskError("Choisis une heure de début future.")
        return
      }
    }

 const dateKeys: string[] = []
for (let cursor = new Date(startDate); cursor.getTime() <= endDate.getTime(); cursor.setDate(cursor.getDate() + 1)) {
  dateKeys.push(getDateKey(cursor))
}

const endTime = newTaskForm.end.trim().length > 0 ? newTaskForm.end : "10:00"
const color = legendColors[newTaskForm.category] ?? (newTaskForm.color || newTaskColors[0])

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
  title: "",
}))
setNewTaskError(null)
}

const handleDayKeyDown = (event: KeyboardEvent<HTMLDivElement>, dateKey: string) => {
  if (event.key === "Enter" || event.key === " ") {
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

const viewToggle = (
  <div className="calendar-view-toggle" role="tablist" aria-label="Vue calendrier">
    <button
      type="button"
      role="tab"
      aria-selected={calendarView === 'weekly'}
      className={`calendar-view-toggle__button${calendarView === 'weekly' ? ' is-active' : ''}`}
      onClick={() => setCalendarView('weekly')}
    >
      Hebdomadaire
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={calendarView === 'monthly'}
      className={`calendar-view-toggle__button${calendarView === 'monthly' ? ' is-active' : ''}`}
      onClick={() => setCalendarView('monthly')}
    >
      Mensuel
    </button>
  </div>
)

return (
  <div className="calendar-page">
    {calendarView === 'weekly' ? (
    <section className="calendar-weekly">
      {isCompact ? (
        <div className="calendar-weekly__mobile calendar-mobile" role="region" aria-label="Calendrier mobile">
          <div className="calendar-mobile__panel">
            <span className="calendar-mobile__month">{formatMonthTitle(weekStartDate)}</span>
            <div className="calendar-mobile__week" role="list">
              {weekDates.map((date, index) => {
                const dateKey = getDateKey(date)
                const isToday = date.toDateString() === today.toDateString()
                return (
                  <button
                    key={dateKey}
                    type="button"
                    className={`calendar-mobile__day-card${isToday ? " is-today" : ""}`}
                    onClick={() => {
                      setMobileSelectedDateKey(dateKey)
                      handleDaySelect(dateKey)
                    }}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`Voir la journee du ${dateKey}`}
                  >
                    <span className="calendar-mobile__day-name">{weekDays[index].toLowerCase()}</span>
                    <span className="calendar-mobile__day-number">{date.getDate()}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="calendar-mobile__today-row">
            <span>{mobileSelectedLabel}</span>
            <div className="calendar-mobile__toggle">{viewToggle}</div>
          </div>

          <div className="calendar-mobile__nav calendar-month-nav" aria-label="Navigation semaine">
            <button type="button" onClick={() => handleDayChange(-1)} aria-label="Jour précédent">
              &lt;
            </button>
            <button type="button" onClick={() => handleDayChange(1)} aria-label="Jour suivant">
              &gt;
            </button>
          </div>

          <div className="calendar-mobile__agenda" role="list">
            {mobileSelectedTasks.length === 0 ? (
              <p className="calendar-mobile__empty">Aucun evenement pour cette journee.</p>
            ) : (
              mobileSelectedTasks.map((task) => (
                <div key={task.id} className="calendar-mobile__event">
                  <span className="calendar-mobile__event-time">{task.start}</span>
                  <div
                    className="calendar-mobile__event-card"
                    style={{
                      background: `linear-gradient(135deg, ${withAlpha(task.color, 0.12)} 0%, ${withAlpha(
                        task.color,
                        0.28,
                      )} 100%)`,
                      borderColor: withAlpha(task.color, 0.4),
                    }}
                  >
                    <span className="calendar-mobile__event-title">{task.title}</span>
                    <span className="calendar-mobile__event-hours">
                      {task.start} - {task.end}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <>
          <header className="calendar-weekly__header">
        <PageHeading eyebrow="calendrier hebdomadaire" title={`Semaine du ${weekRangeLabel}`} />
        {viewToggle}
      </header>
      <div className="calendar-weekly__layout">
        <div className="calendar-weekly__toolbar">
          <button
            type="button"
            className="calendar-weekly__create"
            onClick={() => handlePlanForDate(getDateKey(today))}
          >
            <span className="calendar-weekly__create-plus">+</span>
            Créer un événement
          </button>
          <div className="calendar-month-nav">
            <button type="button" onClick={() => handleWeekChange(-1)} aria-label="Semaine précédente">
              &lt;
            </button>
            <button type="button" onClick={() => handleWeekChange(1)} aria-label="Semaine suivante">
              &gt;
            </button>
          </div>
        </div>
        <div
          className="calendar-weekly__grid"
          style={{
            "--hour-height": `${hourHeight}px`,
            "--hour-count": hours.length,
          } as CSSProperties}
        >
          <div className="calendar-weekly__corner" aria-hidden="true" />
          {weekDates.map((date, index) => {
            const dateKey = getDateKey(date)
            const isToday = date.toDateString() === today.toDateString()
            return (
              <button
                key={dateKey}
                type="button"
                className={`calendar-weekly__day-header${isToday ? " is-today" : ""}`}
                onClick={() => handleDaySelect(dateKey)}
              >
                <span className="calendar-weekly__day-name">{weekDays[index]}</span>
                <span className="calendar-weekly__day-date">{date.getDate()}</span>
              </button>
            )
          })}
          <div className="calendar-weekly__time-column">
            {hours.map((hour) => (
              <div key={hour} className="calendar-weekly__time">
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>
          {weekDates.map((date) => {
            const dateKey = getDateKey(date)
            const dayTasks = tasksByDate.get(dateKey) ?? []
            return (
              <div
                key={dateKey}
                className="calendar-weekly__day-column"
                role="button"
                tabIndex={0}
                onClick={() => handleDaySelect(dateKey)}
                onKeyDown={(event) => handleDayKeyDown(event, dateKey)}
                aria-label={`Voir la journée du ${dateKey}`}
              >
                <div className="calendar-weekly__day-grid">
                  {hours.map((hour) => (
                    <div key={`${dateKey}-${hour}`} className="calendar-weekly__hour-cell" />
                  ))}
                  {dayTasks.map((task) => {
                    const startMinutes = parseTimeToMinutes(task.start)
                    const endMinutes = parseTimeToMinutes(task.end)
                    const nowMinutes = now.getHours() * 60 + now.getMinutes()
                    const isOngoing = task.date === nowKey && nowMinutes >= startMinutes && nowMinutes < endMinutes
                    const durationMinutes = Math.max(30, endMinutes - startMinutes || 30)
                    const minutesFromStart = Math.max(0, startMinutes - 6 * 60)
                    const top = (minutesFromStart / 60) * hourHeight
                    const height = (durationMinutes / 60) * hourHeight
                    return (
                      <button
                        key={task.id}
                        type="button"
                        className="calendar-weekly__task"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData('text/plain', task.id)
                          event.dataTransfer.effectAllowed = 'move'
                        }}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          background: task.color,
                        }}
                        onClick={(event) => {
                          event.stopPropagation()
                          handleDaySelect(dateKey)
                        }}
                      >
                        <span className="calendar-weekly__task-title">{task.title}</span>
                        <span className="calendar-weekly__task-time">
                          {task.start} - {task.end}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
        </>
      )}
    </section>
    ) : null}

    {calendarView === 'monthly' ? (
    <section className="calendar-monthly-preview">
      <header className="calendar-header calendar-header--compact">
        <PageHeading eyebrow="aperçu mensuel" title={formatMonthTitle(currentMonthDate)} />
        <div className="calendar-monthly__controls">
          {viewToggle}
          <div className="calendar-month-nav">
            <button type="button" onClick={() => handleMonthChange(-1)} aria-label="Mois précédent">
              &lt;
            </button>
            <button type="button" onClick={() => handleMonthChange(1)} aria-label="Mois suivant">
              &gt;
            </button>
          </div>
        </div>
      </header>
<div className="calendar-grid calendar-grid--preview">
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
              className={`calendar-day${cell.isToday ? " calendar-day--today" : ""}`}
              onClick={() => handleDaySelect(cell.dateKey!)}
              onKeyDown={(event) => handleDayKeyDown(event, cell.dateKey!)}
              role="button"
              tabIndex={0}
              aria-label={`Voir la journée du ${cell.dateKey}`}
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
                  aria-label={`Ajouter une tâche le ${cell.dateKey}`}
                >
                  +
                </button>
              </div>
              {cell.tasks.length > 0 ? (
                <span
                  className="calendar-day__indicator"
                  aria-label={`${cell.tasks.length} événement${cell.tasks.length > 1 ? "s" : ""}`}
                >
                  {cell.tasks.length}
                </span>
              ) : null}
              {cell.tasks[0] ? (
                      <><div
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
    </section>
    ) : null}
    {isDayModalOpen && activeDateKey ? (
      <div className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-modal-title">
        <div className="calendar-modal__backdrop" onClick={handleCloseModal} aria-hidden="true" />
        <div className="calendar-modal__panel">
          <header className="calendar-modal__header">
            <div>
              <h2 id="calendar-modal-title">{activeDateLabel}</h2>
              <p>
                {activeDateTasks.length > 0
                  ? activeDateTasks.length === 1
                    ? "1 créneau."
                    : `${activeDateTasks.length} créneaux.`
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
                  onChange={(event) => handleNewTaskFieldChange("title", event.target.value)}
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
                    onChange={(event) => handleNewTaskFieldChange("start", event.target.value)}
                    required
                  />
                </label>
                <label className="calendar-task__field">
                  <span>Fin</span>
                  <input
                    type="time"
                    value={newTaskForm.end}
                    onChange={(event) => handleNewTaskFieldChange("end", event.target.value)}
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
                    onChange={(event) => handleNewTaskFieldChange("repeatStart", event.target.value)}
                  />
                </label>
                <label className="calendar-task__field">
                  <span>Au</span>
                  <input
                    type="date"
                    value={newTaskForm.repeatEnd}
                    min={newTaskForm.repeatStart}
                    onChange={(event) => handleNewTaskFieldChange("repeatEnd", event.target.value)}
                  />
                </label>
              </div>
              <div className="calendar-task__form-row calendar-task__form-row--split">
                <label className="calendar-task__field">
                  <span>Type</span>
                  <div className="calendar-select" ref={categoryMenuRef}>
                    <button
                      type="button"
                      className="calendar-select__trigger"
                      aria-haspopup="listbox"
                      aria-expanded={isCategoryMenuOpen}
                      onClick={() => setIsCategoryMenuOpen((previous) => !previous)}
                    >
                      <span>{newTaskForm.category}</span>
                      <svg className="calendar-select__chevron" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isCategoryMenuOpen ? (
                      <div className="calendar-select__menu" role="listbox">
                        {Object.keys(legendColors).map((category) => (
                          <button
                            key={category}
                            type="button"
                            role="option"
                            aria-selected={newTaskForm.category === category}
                            className={newTaskForm.category === category ? 'is-selected' : undefined}
                            onMouseDown={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                            }}
                            onClick={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              handleNewTaskCategoryChange(category as NewTaskFormState['category'])
                              setIsCategoryMenuOpen(false)
                            }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </label>
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

          <section className="calendar-modal__section calendar-modal__section--agenda">
            <div className="calendar-modal__section-header">
              <h3>Agenda du jour</h3>
            </div>
            <div className="calendar-modal__list">
              {activeDateTasks.length === 0 ? (
                <p className="calendar-modal__empty">Programme ton premier événement de la journée.</p>
              ) : (
                activeDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`calendar-task${editingTaskId === task.id ? " calendar-task--editing" : ""}`}
                    style={{ background: task.color }}
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
                              onChange={(event) => handleDraftChange("start", event.target.value)}
                              required
                            />
                          </label>
                          <label className="calendar-task__field">
                            <span>Fin</span>
                            <input
                              type="time"
                              value={editDraft.end}
                              onChange={(event) => handleDraftChange("end", event.target.value)}
                              required
                            />
                          </label>
                        </div>
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
                            <div className="calendar-task__header-actions">
                              <button
                                type="button"
                                className="calendar-task__edit"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleDuplicateTask(task)
                                }}
                                aria-label={`Dupliquer ${task.title}`}
                              >
                                <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                                  <path
                                    d="M6 6h9v9H6z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M4 4h9v9"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
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
      {duplicateTask ? (
        <div className="calendar-duplicate" role="dialog" aria-modal="true" aria-labelledby="calendar-duplicate-title">
          <div className="calendar-duplicate__backdrop" onClick={handleCloseDuplicate} aria-hidden="true" />
          <div className="calendar-duplicate__panel">
            <header className="calendar-duplicate__header">
              <h2 id="calendar-duplicate-title">Dupliquer</h2>
              <button type="button" className="modal__close" onClick={handleCloseDuplicate} aria-label="Fermer">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </header>
            <p className="calendar-duplicate__subtitle">Dupliquer "{duplicateTask.title}"</p>
            <label className="calendar-duplicate__field">
              <span>Nombre de jours</span>
              <input
                className="calendar-duplicate__input"
                type="number"
                min={1}
                value={duplicateDays}
                onChange={(event) => setDuplicateDays(event.target.value)}
              />
            </label>
            {duplicateError ? <p className="calendar-duplicate__error">{duplicateError}</p> : null}
            <div className="calendar-duplicate__actions">
              <button type="button" className="calendar-task__button calendar-task__button--ghost" onClick={handleCloseDuplicate}>
                Annuler
              </button>
              <button type="button" className="calendar-task__button calendar-task__button--primary" onClick={handleConfirmDuplicate}>
                Dupliquer
              </button>
            </div>
          </div>
        </div>
      ) : null}
</div>
  )
}

export default CalendrierPage











































































