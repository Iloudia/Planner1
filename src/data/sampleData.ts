export type ScheduledTask = {
  id: string
  title: string
  start: string
  end: string
  date: string
  color: string
  tag: string
}

export const getDateKey = (value: Date) => {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDays = (date: Date, offset: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + offset)
  return next
}

const today = new Date()

export const sampleTasks: ScheduledTask[] = [
  {
    id: 'task-1',
    title: 'Deep work design',
    start: '09:00',
    end: '11:00',
    date: getDateKey(addDays(today, 1)),
    color: '#A5B4FC',
    tag: 'Focus',
  },
  {
    id: 'task-2',
    title: 'Rendez-vous client',
    start: '14:00',
    end: '15:00',
    date: getDateKey(addDays(today, 2)),
    color: '#7DD3FC',
    tag: 'Meeting',
  },
  {
    id: 'task-3',
    title: 'Session self-care',
    start: '18:00',
    end: '19:00',
    date: getDateKey(addDays(today, 3)),
    color: '#FBCFE8',
    tag: 'Perso',
  },
]

export type RoutineItem = {
  id: string
  title: string
  detail?: string
}

export const morningRoutine: RoutineItem[] = [
  { id: 'morning-1', title: "Etirements doux", detail: "5 minutes pour réveiller le corps" },
  { id: 'morning-2', title: "Verre d'eau citronnée", detail: 'Hydratation avant écran' },
  { id: 'morning-3', title: 'Revue rapide de la journée', detail: '3 priorités notées' },
]

export const eveningRoutine: RoutineItem[] = [
  { id: 'evening-1', title: 'Déconnexion digitale', detail: '-1h avant le sommeil' },
  { id: 'evening-2', title: 'Skincare et respiration', detail: '10 respirations profondes' },
  { id: 'evening-3', title: 'Préparer demain', detail: 'Tenue + agenda prêts' },
]
