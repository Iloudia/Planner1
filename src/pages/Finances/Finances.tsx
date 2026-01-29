import type { FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { AxisLabelsFormatterContextObject, Options, TooltipFormatterContextObject } from 'highcharts'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsData from 'highcharts/modules/data'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsExportData from 'highcharts/modules/export-data'
import HighchartsAccessibility from 'highcharts/modules/accessibility'
import HighchartsAdaptiveTheme from 'highcharts/themes/adaptive'
import PageHero from '../../components/PageHero'
import PageHeading from '../../components/PageHeading'
import usePersistentState from '../../hooks/usePersistentState'
import financeMood01 from '../../assets/planner-04.jpg'
import financeMood02 from '../../assets/planner-07.jpg'
import financeMood03 from '../../assets/planner-02.jpg'
import './FinancePage.css'

type HighchartsModuleLoader = ((chart: typeof Highcharts) => typeof Highcharts) & {
  default?: (chart: typeof Highcharts) => typeof Highcharts
}

const applyHighchartsModule = (moduleLoader?: HighchartsModuleLoader | null) => {
  if (!moduleLoader) {
    return
  }
  if (typeof moduleLoader === 'function') {
    moduleLoader(Highcharts)
  } else if (typeof moduleLoader.default === 'function') {
    moduleLoader.default(Highcharts)
  }
}

let highchartsModulesApplied = false
const ensureHighchartsModules = () => {
  if (highchartsModulesApplied || typeof window === 'undefined') {
    return
  }
  applyHighchartsModule(HighchartsData as unknown as HighchartsModuleLoader)
  applyHighchartsModule(HighchartsExporting as unknown as HighchartsModuleLoader)
  applyHighchartsModule(HighchartsExportData as unknown as HighchartsModuleLoader)
  applyHighchartsModule(HighchartsAccessibility as unknown as HighchartsModuleLoader)
  applyHighchartsModule(HighchartsAdaptiveTheme as unknown as HighchartsModuleLoader)
  highchartsModulesApplied = true
}

ensureHighchartsModules()

type ExpenseCategory =
  | 'food'
  | 'housing'
  | 'transport'
  | 'clothing'
  | 'beauty'
  | 'leisure'
  | 'health'
  | 'friends'

type FlowDirection = 'in' | 'out'

type StoredFinanceEntry = {
  id: string
  label: string
  amount: number
  date: string
  category?: ExpenseCategory
  direction?: FlowDirection
}

type FinanceEntry = {
  id: string
  label: string
  amount: number
  date: string
  direction: FlowDirection
  category?: ExpenseCategory
}

type FinanceDraft = {
  label: string
  amount: string
  category: ExpenseCategory
  date: string
  direction: FlowDirection
}

type MonthlySnapshot = {
  startingAmount: number
}

type PieSegment = {
  label: string
  value: number
  color: string
}

type TrendPreview = {
  labels: string[]
  values: number[]
}

type FinanceTrendSeries = {
  labels: string[]
  current: number[]
  previous: number[] | null
}

const categoryDefinitions: Record<ExpenseCategory, { label: string; color: string }> = {
  food: { label: 'Courses et alimentation', color: '#FECACA' },
  housing: { label: 'Logement et charges', color: '#FBCFE8' },
  transport: { label: 'Abonnements', color: '#C7D2FE' },
  clothing: { label: 'Shopping', color: '#FDE68A' },
  beauty: { label: 'Restaurants et bars', color: '#FBCFE8' },
  leisure: { label: 'Loisirs', color: '#BBF7D0' },
  health: { label: 'Taxes et impÃƒÆ’Ã‚Â´ts', color: '#BFDBFE' },
  friends: { label: 'Amis', color: '#FCA5A5' },
}

const financeMoodboard = [
  { src: financeMood01, alt: "Moodboard budget" },
  { src: financeMood02, alt: "Carnet d'ÃƒÆ’Ã‚Â©pargne inspirÃƒÆ’Ã‚Â©" },
  { src: financeMood03, alt: "Planification creative" },
] as const

const financeInspirationImage = financeMoodboard[1]

const euroFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

const percentFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 1,
})

const monthFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric',
})

const historyDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const FUTURE_MONTHS_TO_INCLUDE = 14
const PAST_MONTHS_TO_INCLUDE = 12

const formatDateToISO = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getTodayISO = () => formatDateToISO(new Date())

const getMonthKeyFromDate = (date: Date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`

const getMonthKeyFromISO = (value: string) => (value.length >= 7 ? value.slice(0, 7) : '')

const capitalize = (value: string) => (value.length === 0 ? value : value[0].toUpperCase() + value.slice(1))

const parseMonthKeyToDate = (monthKey: string) => {
  const [yearString, monthString] = monthKey.split('-')
  const year = Number(yearString)
  const month = Number(monthString)
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return new Date()
  }
  return new Date(year, month - 1, 1)
}

const formatMonthKey = (monthKey: string) => capitalize(monthFormatter.format(parseMonthKeyToDate(monthKey)))

const formatHistoryDate = (isoDate: string) => {
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) {
    return isoDate
  }
  return capitalize(historyDateFormatter.format(parsed))
}

const addMonthsToMonthKey = (monthKey: string, offset: number) => {
  const baseDate = parseMonthKeyToDate(monthKey)
  const nextDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1)
  return getMonthKeyFromDate(nextDate)
}

const generateFutureMonths = (monthKey: string, monthsAhead: number) => {
  const keys: string[] = []
  for (let index = 1; index <= monthsAhead; index += 1) {
    keys.push(addMonthsToMonthKey(monthKey, index))
  }
  return keys
}

const generatePastMonths = (monthKey: string, monthsBack: number) => {
  const keys: string[] = []
  for (let index = 1; index <= monthsBack; index += 1) {
    keys.push(addMonthsToMonthKey(monthKey, -index))
  }
  return keys
}

const groupHistoryByMonth = (entries: FinanceEntry[]) => {
  const groups: Array<{ monthKey: string; monthLabel: string; entries: FinanceEntry[] }> = []
  entries.forEach((entry) => {
    const monthKey = getMonthKeyFromISO(entry.date)
    if (!monthKey) {
      return
    }
    let group = groups.find((existing) => existing.monthKey === monthKey)
    if (!group) {
      group = {
        monthKey,
        monthLabel: formatMonthKey(monthKey),
        entries: [],
      }
      groups.push(group)
    }
    group.entries.push(entry)
  })
  return groups
}

const buildTrendPreview = (
  monthKey: string,
  monthEntries: FinanceEntry[],
  startingAmount: number,
  sampleCount?: number,
): TrendPreview | null => {
  if (!monthKey) {
    return null
  }
  const monthStart = parseMonthKeyToDate(monthKey)
  if (Number.isNaN(monthStart.getTime())) {
    return null
  }
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
  const dailyChanges = new Map<string, number>()

  monthEntries.forEach((entry) => {
    const delta = entry.direction === 'in' ? entry.amount : -entry.amount
    const existing = dailyChanges.get(entry.date) ?? 0
    dailyChanges.set(entry.date, roundCurrency(existing + delta))
  })

  const dayLabels: string[] = []
  const dayValues: number[] = []
  let running = startingAmount

  for (let day = new Date(monthStart); day <= monthEnd; day.setDate(day.getDate() + 1)) {
    const key = formatDateToISO(day)
    const change = dailyChanges.get(key) ?? 0
    running = roundCurrency(running + change)
    dayLabels.push(
      day.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      }),
    )
    dayValues.push(running)
  }

  if (dayValues.length === 0) {
    return null
  }

  if (!sampleCount || sampleCount <= 0 || dayValues.length <= sampleCount) {
    return {
      labels: dayLabels,
      values: dayValues,
    }
  }

  const sampledLabels: string[] = []
  const sampledValues: number[] = []

  for (let index = 0; index < sampleCount; index += 1) {
    const ratio = index / (sampleCount - 1)
    const sampleIndex = Math.min(dayValues.length - 1, Math.round(ratio * (dayValues.length - 1)))
    sampledLabels.push(dayLabels[sampleIndex])
    sampledValues.push(dayValues[sampleIndex])
  }

  return {
    labels: sampledLabels,
    values: sampledValues,
  }
}

const getDefaultDateForMonth = (monthKey: string) => {
  const today = new Date()
  if (getMonthKeyFromDate(today) === monthKey) {
    return getTodayISO()
  }
  return `${monthKey}-01`
}

const roundCurrency = (value: number) => Math.round(value * 100) / 100

const formatSignedCurrency = (value: number) => {
  if (value === 0) {
    return euroFormatter.format(0)
  }
  const formatted = euroFormatter.format(Math.abs(value))
  return value > 0 ? `+${formatted}` : `-${formatted}`
}

const formatSignedPercentage = (value: number) => {
  if (!Number.isFinite(value) || value === 0) {
    return '0 %'
  }
  const formatted = percentFormatter.format(Math.abs(value))
  return value > 0 ? `+${formatted} %` : `-${formatted} %`
}

const buildPieGradient = (segments: PieSegment[]) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  if (total <= 0) {
    return 'conic-gradient(#e2e8f0 0deg, #e2e8f0 360deg)'
  }
  let startAngle = 0
  const stops = segments.map((segment) => {
    const angle = (segment.value / total) * 360
    const endAngle = startAngle + angle
    const stop = `${segment.color} ${startAngle.toFixed(2)}deg ${endAngle.toFixed(2)}deg`
    startAngle = endAngle
    return stop
  })
  return `conic-gradient(${stops.join(', ')})`
}

const createEmptyCategoryTotals = (): Record<ExpenseCategory, number> => ({
  food: 0,
  housing: 0,
  transport: 0,
  clothing: 0,
  beauty: 0,
  leisure: 0,
  health: 0,
  friends: 0,
})

const EXPENSES_STORAGE_KEY = 'planner.finance.expenses'
const MONTHLY_SNAPSHOT_STORAGE_KEY = 'planner.finance.monthlySnapshots'

const FinancePage = () => {
  const [storedEntries, setStoredEntries] = usePersistentState<StoredFinanceEntry[]>(EXPENSES_STORAGE_KEY, () => [])
  const [monthlySnapshots, setMonthlySnapshots] = usePersistentState<Record<string, MonthlySnapshot>>(
    MONTHLY_SNAPSHOT_STORAGE_KEY,
    () => ({}),
  )

  const [draft, setDraft] = useState<FinanceDraft>(() => ({
    label: '',
    amount: '',
    category: 'food',
    date: getTodayISO(),
    direction: 'out',
  }))
  const [isDirectionMenuOpen, setIsDirectionMenuOpen] = useState(false)
  const directionMenuRef = useRef<HTMLDivElement | null>(null)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const categoryMenuRef = useRef<HTMLDivElement | null>(null)
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('planner-page--white')
    return () => {
      document.body.classList.remove('planner-page--white')
    }
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

  useEffect(() => {
    if (!isDirectionMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!directionMenuRef.current) return
      if (directionMenuRef.current.contains(event.target as Node)) return
      setIsDirectionMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDirectionMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDirectionMenuOpen])

  useEffect(() => {
    if (draft.direction !== 'out') {
      setIsCategoryMenuOpen(false)
    }
  }, [draft.direction])

  const entries = useMemo<FinanceEntry[]>(
    () =>
      storedEntries.map((entry) => ({
        ...entry,
        direction: entry.direction ?? 'out',
      })),
    [storedEntries],
  )

  const currentDate = useMemo(() => new Date(), [])
  const currentMonthKey = useMemo(() => getMonthKeyFromDate(currentDate), [currentDate])
  const selectedDirectionLabel = useMemo(() => {
    return draft.direction === 'in' ? 'Revenus' : 'DÃƒÆ’Ã‚Â©pense'
  }, [draft.direction])
  const selectedCategoryLabel = useMemo(() => {
    if (draft.direction !== 'out') {
      return 'CatÃƒÆ’Ã‚Â©gorie'
    }
    const definition = draft.category ? categoryDefinitions[draft.category] : undefined
    return definition?.label ?? 'CatÃƒÆ’Ã‚Â©gorie'
  }, [draft.category, draft.direction])

  const monthOptions = useMemo(() => {
    const keySet = new Set<string>()
    entries.forEach((entry) => {
      const key = getMonthKeyFromISO(entry.date)
      if (key) {
        keySet.add(key)
      }
    })
    Object.keys(monthlySnapshots).forEach((key) => {
      if (key) {
        keySet.add(key)
      }
    })
    keySet.add(currentMonthKey)
    generatePastMonths(currentMonthKey, PAST_MONTHS_TO_INCLUDE).forEach((pastKey) => {
      keySet.add(pastKey)
    })
    generateFutureMonths(currentMonthKey, FUTURE_MONTHS_TO_INCLUDE).forEach((futureKey) => {
      keySet.add(futureKey)
    })
    return Array.from(keySet).sort((a, b) => b.localeCompare(a))
  }, [entries, monthlySnapshots, currentMonthKey])

  const [selectedMonthKey, setSelectedMonthKey] = useState(() => currentMonthKey)
  useEffect(() => {
    if (monthOptions.length === 0) {
      return
    }
    if (!monthOptions.includes(selectedMonthKey)) {
      setSelectedMonthKey(monthOptions[0] ?? currentMonthKey)
    }
  }, [monthOptions, selectedMonthKey, currentMonthKey])

  const selectedMonthLabel = useMemo(() => formatMonthKey(selectedMonthKey), [selectedMonthKey])

  const selectedMonthIndex = monthOptions.findIndex((monthKey) => monthKey === selectedMonthKey)
  const hasOlderFinanceMonth = selectedMonthIndex >= 0 && selectedMonthIndex < monthOptions.length - 1
  const hasNewerFinanceMonth = selectedMonthIndex > 0

  const handleFinanceMonthNav = (direction: 'prev' | 'next') => {
    if (monthOptions.length === 0) {
      return
    }
    const currentIndex = monthOptions.findIndex((monthKey) => monthKey === selectedMonthKey)
    if (currentIndex === -1) {
      setSelectedMonthKey(monthOptions[0])
      return
    }
    const offset = direction === 'prev' ? 1 : -1
    const targetMonth = monthOptions[currentIndex + offset]
    if (targetMonth) {
      setSelectedMonthKey(targetMonth)
    }
  }

  useEffect(() => {
    setDraft((previous) => {
      const previousMonthKey = getMonthKeyFromISO(previous.date)
      if (previousMonthKey === selectedMonthKey && previous.date) {
        return previous
      }
      return {
        ...previous,
        date: getDefaultDateForMonth(selectedMonthKey),
      }
    })
  }, [selectedMonthKey])

  const selectedMonthEntries = useMemo(() => {
    const filtered = entries.filter((entry) => getMonthKeyFromISO(entry.date) === selectedMonthKey)
    return filtered.sort((a, b) => {
      if (a.date === b.date) {
        return b.id.localeCompare(a.id)
      }
      return b.date.localeCompare(a.date)
    })
  }, [entries, selectedMonthKey])

  const previousMonthKey = useMemo(() => addMonthsToMonthKey(selectedMonthKey, -1), [selectedMonthKey])
  const previousMonthEntries = useMemo(
    () => entries.filter((entry) => getMonthKeyFromISO(entry.date) === previousMonthKey),
    [entries, previousMonthKey],
  )

  const monthlyOutflows = useMemo(
    () => selectedMonthEntries.filter((entry) => entry.direction === 'out'),
    [selectedMonthEntries],
  )

  const monthlyInflows = useMemo(
    () => selectedMonthEntries.filter((entry) => entry.direction === 'in'),
    [selectedMonthEntries],
  )

  const totals = useMemo(() => {
    return monthlyOutflows.reduce<Record<ExpenseCategory, number>>((accumulator, entry) => {
      if (!entry.category) {
        return accumulator
      }
      accumulator[entry.category] = (accumulator[entry.category] ?? 0) + entry.amount
      return accumulator
    }, createEmptyCategoryTotals())
  }, [monthlyOutflows])

  const totalSpent = useMemo(
    () => roundCurrency(monthlyOutflows.reduce((sum, entry) => sum + entry.amount, 0)),
    [monthlyOutflows],
  )

  const totalIncome = useMemo(
    () => roundCurrency(monthlyInflows.reduce((sum, entry) => sum + entry.amount, 0)),
    [monthlyInflows],
  )

  const netCashflow = useMemo(
    () => roundCurrency(totalIncome - totalSpent),
    [totalIncome, totalSpent],
  )

  const financeHeroStats = useMemo(
    () => [
      { id: 'income', label: 'EntrÃƒÆ’Ã‚Â©es', value: euroFormatter.format(totalIncome) },
      { id: 'expenses', label: 'Sorties', value: euroFormatter.format(totalSpent) },
      { id: 'balance', label: 'Solde du mois', value: euroFormatter.format(netCashflow) },
    ],
    [netCashflow, totalIncome, totalSpent],
  )

  const topCatégories = useMemo(() => {
    return Object.entries(totals)
      .filter(([, amount]) => amount > 0)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .slice(0, 3)
  }, [totals])

  const savingsIdea = useMemo(() => {
    if (topCatégories.length === 0) {
      return null
    }
    const [categoryKey, amount] = topCatégories[0]
    const definition = categoryDefinitions[categoryKey as ExpenseCategory]
    const target = amount * 0.9
    return {
      label: definition.label,
      current: amount,
      target,
    }
  }, [topCatégories])

  const selectedSnapshot = monthlySnapshots[selectedMonthKey]
  const startingAmountValue = selectedSnapshot?.startingAmount ?? 0
  const previousStartingAmount = monthlySnapshots[previousMonthKey]?.startingAmount ?? 0

  const endingAmount = useMemo(
    () => roundCurrency(startingAmountValue + netCashflow),
    [startingAmountValue, netCashflow],
  )

  const savedAmount = useMemo(
    () => roundCurrency(endingAmount - startingAmountValue),
    [endingAmount, startingAmountValue],
  )

  const savingsPercentage = useMemo(() => {
    if (startingAmountValue <= 0) {
      return 0
    }
    return (savedAmount / startingAmountValue) * 100
  }, [savedAmount, startingAmountValue])

  const pieSegments = useMemo<PieSegment[]>(
    () =>
      (Object.entries(totals) as Array<[ExpenseCategory, number]>)
        .filter(([, value]) => value > 0)
        .map(([category, value]) => ({
          label: categoryDefinitions[category].label,
          value,
          color: categoryDefinitions[category].color,
        })),
    [totals],
  )

  const pieBackground = useMemo(() => buildPieGradient(pieSegments), [pieSegments])
  const hasPieData = pieSegments.length > 0

  const trendSeries = useMemo(() => {
    const current = buildTrendPreview(selectedMonthKey, selectedMonthEntries, startingAmountValue)
    if (!current) {
      return null
    }
    const previous = buildTrendPreview(
      previousMonthKey,
      previousMonthEntries,
      previousStartingAmount,
      current.values.length,
    )
    return {
      labels: current.labels,
      current: current.values,
      previous: previous?.values ?? null,
    }
  }, [
    selectedMonthKey,
    selectedMonthEntries,
    startingAmountValue,
    previousMonthKey,
    previousMonthEntries,
    previousStartingAmount,
  ])

  const [startingAmountDraft, setStartingAmountDraft] = useState(() =>
    selectedSnapshot?.startingAmount !== undefined ? selectedSnapshot.startingAmount.toString() : '',
  )

  useEffect(() => {
    if (selectedSnapshot?.startingAmount !== undefined) {
      setStartingAmountDraft(selectedSnapshot.startingAmount.toString())
    } else {
      setStartingAmountDraft('')
    }
  }, [selectedSnapshot, selectedMonthKey])

  const previewHistory = useMemo(() => selectedMonthEntries.slice(0, 2), [selectedMonthEntries])
  const groupedHistoryPreview = useMemo(() => groupHistoryByMonth(previewHistory), [previewHistory])
  const groupedHistoryFull = useMemo(() => groupHistoryByMonth(selectedMonthEntries), [selectedMonthEntries])
  const hasAdditionalHistory = selectedMonthEntries.length > previewHistory.length

  const handleDraftChange = <Field extends keyof FinanceDraft>(field: Field, value: FinanceDraft[Field]) => {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const amountValue = parseFloat(draft.amount.replace(',', '.'))
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      return
    }

    const trimmedLabel = draft.label.trim()
    const nextEntry: StoredFinanceEntry = {
      id: `finance-${Date.now()}`,
      label: trimmedLabel.length > 0 ? trimmedLabel : draft.direction === 'in' ? 'Revenus' : 'DÃƒÆ’Ã‚Â©pense',
      amount: roundCurrency(amountValue),
      date: draft.date,
      direction: draft.direction,
      ...(draft.direction === 'out' ? { category: draft.category } : {}),
    }

    setStoredEntries((previous) => {
      const nextEntries = [nextEntry, ...previous]
      return nextEntries.sort((a, b) => {
        if (a.date === b.date) {
          return b.id.localeCompare(a.id)
        }
        return b.date.localeCompare(a.date)
      })
    })
    setDraft((previous) => ({
      ...previous,
      label: '',
      amount: '',
    }))
  }

  const handleDeleteEntry = (entryId: string) => {
    setStoredEntries((previous) => previous.filter((entry) => entry.id !== entryId))
  }

  const handleStartingAmountSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedValue = startingAmountDraft.replace(',', '.').trim()
    if (normalizedValue.length === 0) {
      setMonthlySnapshots((previous) => {
        const next = { ...previous }
        delete next[selectedMonthKey]
        return next
      })
      return
    }
    const parsed = parseFloat(normalizedValue)
    if (!Number.isFinite(parsed) || parsed < 0) {
      return
    }
    const rounded = roundCurrency(parsed)
    setMonthlySnapshots((previous) => ({
      ...previous,
      [selectedMonthKey]: {
        startingAmount: rounded,
      },
    }))
  }

  return (
    <div className="finance-page aesthetic-page">

      <PageHero
        eyebrow="ÃƒÆ’Ã¢â‚¬Â°quilibre pastel"
        title="Mes Finances"
        description="Visualise tes entrÃƒÆ’Ã‚Â©es et tes sorties pour mieux organiser ton mois."
        stats={financeHeroStats}
        images={financeMoodboard}
        tone="blue"
        heroClassName="finance-hero dashboard-panel"
      />
      <div className="finance-page__accent-bar" aria-hidden="true" />
      <div className="finance-heading-row">
        <PageHeading eyebrow="Finances" title="Mes Finances" />
        <div className="calendar-month-nav finance-hero__month-nav">
          <button
            type="button"
            onClick={() => handleFinanceMonthNav('prev')}
            disabled={!hasOlderFinanceMonth}
            aria-label="Mois prÃƒÆ’Ã‚Â©cÃƒÆ’Ã‚Â©dent"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => handleFinanceMonthNav('next')}
            disabled={!hasNewerFinanceMonth}
            aria-label="Mois suivant"
          >
            &gt;
          </button>
        </div>
      </div>


      <section className="finance-dashboard">
        <div className="finance-dashboard__main">
          <section className="finance-summary dashboard-panel">
            <div className="finance-section-chip">
              <span className="finance-section-chip__title">RÃƒÆ’Ã‚Â©partition par catÃƒÆ’Ã‚Â©gorie</span>
              <div className="finance-section-chip__divider" aria-hidden="true" />
            </div>
            <header className="finance-section-header">
              <span className="finance-section-header__eyebrow">Vue dÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ensemble</span>
              <p>RepÃƒÆ’Ã‚Â¨re rapidement les catÃƒÆ’Ã‚Â©gories qui te coÃƒÆ’Ã‚Â»tent le plus</p>
            </header>
            <div className="finance-summary__grid">
              {Object.entries(totals).map(([categoryKey, amount]) => {
                const definition = categoryDefinitions[categoryKey as ExpenseCategory]
                return (
                  <article
                    key={categoryKey}
                    className="finance-summary__card"
                    style={{ borderColor: definition.color, boxShadow: `0 32px 60px ${definition.color}33` }}
                  >
                    <span className="finance-summary__label">{definition.label}</span>
                    <strong className="finance-summary__value">{euroFormatter.format(amount)}</strong>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="finance-form dashboard-panel">
            <div className="finance-section-chip">
              <span className="finance-section-chip__title">Ajouter une dÃƒÆ’Ã‚Â©pense</span>
              <div className="finance-section-chip__divider" aria-hidden="true" />
            </div>
            <header className="finance-section-header">
              <span className="finance-section-header__eyebrow">ajoute ton mouvement</span>
              <p>Enregistre en un instant les dÃƒÆ’Ã‚Â©penses et les revenus du mois.</p>
            </header>
            <form onSubmit={handleSubmit} className="finance-form__grid">
              <label className="finance-form__field">
                <span>IntitulÃƒÆ’Ã‚Â©</span>
                <input
                  type="text"
                  value={draft.label}
                  onChange={(event) => handleDraftChange('label', event.target.value)}
                  placeholder="Ex: Courses semaine"
                />
              </label>
              <label className="finance-form__field">
                <span>Montant</span>
                <input
                  type="text"
                  value={draft.amount}
                  onChange={(event) => handleDraftChange('amount', event.target.value)}
                  placeholder="Ex: 45.90"
                  required
                />
              </label>
              <label className="finance-form__field">
                <span>Type</span>
                <div className="finance-form__select-field" ref={directionMenuRef}>
                  <button
                    type="button"
                    className="finance-form__select-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isDirectionMenuOpen}
                    onClick={() => setIsDirectionMenuOpen((previous) => !previous)}
                  >
                    <span>{selectedDirectionLabel}</span>
                    <svg className="finance-form__select-chevron" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {isDirectionMenuOpen ? (
                    <div className="finance-form__select-menu" role="listbox">
                      <button
                        type="button"
                        role="option"
                        aria-selected={draft.direction === 'out'}
                        className={draft.direction === 'out' ? 'is-selected' : undefined}
                        onClick={() => {
                          handleDraftChange('direction', 'out')
                          setIsDirectionMenuOpen(false)
                        }}
                      >
                        DÃƒÆ’Ã‚Â©pense
                      </button>
                      <button
                        type="button"
                        role="option"
                        aria-selected={draft.direction === 'in'}
                        className={draft.direction === 'in' ? 'is-selected' : undefined}
                        onClick={() => {
                          handleDraftChange('direction', 'in')
                          setIsDirectionMenuOpen(false)
                        }}
                      >
                        Revenus
                      </button>
                    </div>
                  ) : null}
                </div>
              </label>
              {draft.direction === 'out' && (
                <label className="finance-form__field">
                  <span>CatÃƒÆ’Ã‚Â©gorie</span>
                  <div className="finance-form__select-field" ref={categoryMenuRef}>
                    <button
                      type="button"
                      className="finance-form__select-trigger"
                      aria-haspopup="listbox"
                      aria-expanded={isCategoryMenuOpen}
                      onClick={() => setIsCategoryMenuOpen((previous) => !previous)}
                    >
                      <span>{selectedCategoryLabel}</span>
                      <svg className="finance-form__select-chevron" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {isCategoryMenuOpen ? (
                      <div className="finance-form__select-menu" role="listbox">
                        {Object.entries(categoryDefinitions).map(([value, definition]) => (
                          <button
                            key={value}
                            type="button"
                            role="option"
                            aria-selected={draft.category === value}
                            className={draft.category === value ? 'is-selected' : undefined}
                            onClick={() => {
                              handleDraftChange('category', value as ExpenseCategory)
                              setIsCategoryMenuOpen(false)
                            }}
                          >
                            {definition.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </label>
              )}
              <label className="finance-form__field">
                <span>Date</span>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => handleDraftChange('date', event.target.value)}
                  required
                />
              </label>
              <button type="submit" className="finance-form__submit">
                Ajouter
              </button>
            </form>
          </section>

          <section className="finance-history dashboard-panel">
            <header className="finance-section-header">
              <div className="finance-history__header">
                <div className="finance-history__title">
                  <span className="finance-section-header__eyebrow">mÃƒÆ’Ã‚Â©moire du mois</span>
                  <h2>Historique du mois</h2>
                </div>
                {hasAdditionalHistory ? (
                  <button
                    type="button"
                    className="finance-history__collapse"
                    onClick={() => setHistoryModalOpen(true)}
                  >
                    Tout afficher
                  </button>
                ) : null}
              </div>
            </header>
            {selectedMonthEntries.length === 0 ? (
              <p className="finance-history__empty">Aucun mouvement enregistrÃƒÆ’Ã‚Â© pour {selectedMonthLabel}.</p>
            ) : (
              <div className="finance-history__groups">
                {groupedHistoryPreview.map((group) => (
                  <div key={group.monthKey} className="finance-history__group">
                    <div className="finance-history__month-chip">{group.monthLabel}</div>
                    <ul className="finance-history__list">
                      {group.entries.map((entry) => {
                        const definition = entry.category ? categoryDefinitions[entry.category] : undefined
                        const amountValue = entry.direction === 'out' ? -entry.amount : entry.amount
                        const amountColor = entry.direction === 'in' ? '#db2777' : definition?.color ?? '#1e1b4b'
                        const categoryLabel = entry.direction === 'in' ? 'Revenus' : definition?.label ?? 'DÃƒÆ’Ã‚Â©pense'
                        const formattedDate = formatHistoryDate(entry.date)
                        const directionLabel = entry.direction === 'in' ? 'EntrÃƒÆ’Ã‚Â©e' : 'Sortie'

                        return (
                          <li key={entry.id} className="finance-history__item">
                            <div className="finance-history__indicator" style={{ backgroundColor: amountColor }}>
                              <span aria-hidden="true">{entry.direction === 'in' ? '+' : '-'}</span>
                            </div>
                            <div className="finance-history__details">
                              <div className="finance-history__row">
                                <span className="finance-history__label">{entry.label}</span>
                                <span className="finance-history__amount" style={{ color: amountColor }}>
                                  {formatSignedCurrency(amountValue)}
                                </span>
                                <button
                                  type="button"
                                  className="finance-history__delete"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  aria-label={`Supprimer ${entry.label}`}
                                >
                                  ÃƒÆ’Ã¢â‚¬â€
                                </button>
                              </div>
                              <div className="finance-history__meta">
                                <span className="finance-history__category-chip" style={{ color: amountColor }}>
                                  {categoryLabel}
                                </span>
                                <span className="finance-history__direction">{directionLabel}</span>
                                <span className="finance-history__date">{formattedDate}</span>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        <aside className="finance-dashboard__aside">
          <section className="finance-balance dashboard-panel">
            <div className="finance-section-chip">
              <span className="finance-section-chip__title">Balance du mois</span>
              <div className="finance-section-chip__divider" aria-hidden="true" />
            </div>
            <header className="finance-section-header finance-section-header--vertical">
              <span className="finance-section-header__eyebrow">suivi du mois</span>
              <p>DÃƒÆ’Ã‚Â©finis ton solde de dÃƒÆ’Ã‚Â©part pour un suivi prÃƒÆ’Ã‚Â©cis</p>
            </header>
            <form className="finance-balance__form" onSubmit={handleStartingAmountSubmit}>
              <label className="finance-balance__field">
                <span>Argent au dÃƒÆ’Ã‚Â©but du mois</span>
                <input
                  type="text"
                  value={startingAmountDraft}
                  onChange={(event) => setStartingAmountDraft(event.target.value)}
                  placeholder="Ex: 1200"
                />
              </label>
              <button type="submit" className="finance-balance__action">
                Enregistrer
              </button>
            </form>
            <div className="finance-balance__stats">
              <article className="finance-balance__stat">
                <span>Argent au dÃƒÆ’Ã‚Â©but</span>
                <strong>{euroFormatter.format(startingAmountValue)}</strong>
              </article>
              <article className="finance-balance__stat">
                <span>Revenus</span>
                <strong>{formatSignedCurrency(totalIncome)}</strong>
              </article>
              <article className="finance-balance__stat">
                <span>DÃƒÆ’Ã‚Â©penses</span>
                <strong>{formatSignedCurrency(-totalSpent)}</strong>
              </article>
              <article className="finance-balance__stat">
                <span>Argent ÃƒÆ’Ã‚Â  la fin</span>
                <strong>{euroFormatter.format(endingAmount)}</strong>
              </article>
            </div>
            <div className="finance-balance__chart-card">
              <h3>Diagramme en fromage</h3>
              {hasPieData ? (
                <div className="finance-pie">
                  <div className="finance-pie__figure" style={{ backgroundImage: pieBackground }} />
                  <ul className="finance-pie__legend">
                    {pieSegments.map((segment) => (
                      <li key={segment.label}>
                        <span className="finance-pie__swatch" style={{ backgroundColor: segment.color }} />
                        <span className="finance-pie__label">{segment.label}</span>
                        <span className="finance-pie__value">{euroFormatter.format(segment.value)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="finance-balance__empty">Ajoute une dÃƒÆ’Ã‚Â©pense pour visualiser la rÃƒÆ’Ã‚Â©partition.</p>
              )}
            </div>
          </section>

        </aside>
      </section>

      {trendSeries ? (
        <section className="finance-trend dashboard-panel">
          <header className="finance-section-header">
            <div className="finance-history__title">
              <span className="finance-section-header__eyebrow">perspective</span>
              <h2>Evolution du solde</h2>
            </div>
            <div className="finance-trend__legend">
              <span>
                <span className="finance-trend__dot finance-trend__dot--current" />
                Mois en cours
              </span>
              {trendSeries.previous ? (
                <span>
                  <span className="finance-trend__dot finance-trend__dot--previous" />
                  Mois prÃƒÆ’Ã‚Â©cÃƒÆ’Ã‚Â©dent
                </span>
              ) : null}
            </div>
          </header>
          <FinanceTrendChart series={trendSeries} />
        </section>
      ) : null}

      {isHistoryModalOpen ? (
        <div className="finance-history-modal" role="dialog" aria-modal="true">
          <div className="finance-history-modal__backdrop" onClick={() => setHistoryModalOpen(false)} />
          <div className="finance-history-modal__panel">
            <header className="finance-history-modal__header">
              <div>
                <span className="finance-section-header__eyebrow">mÃƒÆ’Ã‚Â©moire complÃƒÆ’Ã‚Â¨te</span>
                <h3>{selectedMonthLabel}</h3>
              </div>
              <button
                type="button"
                className="modal__close"
                onClick={() => setHistoryModalOpen(false)}
                aria-label="Fermer l'historique"
              >
                ÃƒÆ’Ã¢â‚¬â€
              </button>
            </header>
            <div className="finance-history-modal__content">
              {selectedMonthEntries.length === 0 ? (
                <p className="finance-history__empty">Aucun mouvement enregistrÃƒÆ’Ã‚Â© pour {selectedMonthLabel}.</p>
              ) : (
                groupedHistoryFull.map((group) => (
                  <div key={group.monthKey} className="finance-history__group">
                    <div className="finance-history__month-chip">{group.monthLabel}</div>
                    <ul className="finance-history__list">
                      {group.entries.map((entry) => {
                        const definition = entry.category ? categoryDefinitions[entry.category] : undefined
                        const amountValue = entry.direction === 'out' ? -entry.amount : entry.amount
                        const amountColor = entry.direction === 'in' ? '#db2777' : definition?.color ?? '#1e1b4b'
                        const categoryLabel = entry.direction === 'in' ? 'Revenus' : definition?.label ?? 'DÃƒÆ’Ã‚Â©pense'
                        const formattedDate = formatHistoryDate(entry.date)
                        const directionLabel = entry.direction === 'in' ? 'EntrÃƒÆ’Ã‚Â©e' : 'Sortie'

                        return (
                          <li key={entry.id} className="finance-history__item">
                            <div className="finance-history__indicator" style={{ backgroundColor: amountColor }}>
                              <span aria-hidden="true">{entry.direction === 'in' ? '+' : '-'}</span>
                            </div>
                            <div className="finance-history__details">
                              <div className="finance-history__row">
                                <span className="finance-history__label">{entry.label}</span>
                                <span className="finance-history__amount" style={{ color: amountColor }}>
                                  {formatSignedCurrency(amountValue)}
                                </span>
                                <button
                                  type="button"
                                  className="finance-history__delete"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  aria-label={`Supprimer ${entry.label}`}
                                >
                                  ÃƒÆ’Ã¢â‚¬â€
                                </button>
                              </div>
                              <div className="finance-history__meta">
                                <span className="finance-history__category-chip" style={{ color: amountColor }}>
                                  {categoryLabel}
                                </span>
                                <span className="finance-history__direction">{directionLabel}</span>
                                <span className="finance-history__date">{formattedDate}</span>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="finance-page__footer-bar" aria-hidden="true" />
    </div>
  )
}

export default FinancePage

type FinanceTrendChartProps = {
  series: FinanceTrendSeries | null
}

const FinanceTrendChart = ({ series }: FinanceTrendChartProps) => {
  const hasSeries = series && series.current.length > 1

  const chartOptions = useMemo<Options>(() => {
    if (!series || series.current.length === 0) {
      return {}
    }
    const totalPoints = series.labels.length
    const approxTicks = 6
    const labelStep = Math.max(1, Math.round(totalPoints / approxTicks))
    const tickPositions: number[] = []
    for (let index = 0; index < totalPoints; index += labelStep) {
      tickPositions.push(index)
    }
    if (tickPositions[tickPositions.length - 1] !== totalPoints - 1) {
      tickPositions.push(totalPoints - 1)
    }
    return {
      chart: {
        type: 'areaspline',
        backgroundColor: 'transparent',
        spacing: [12, 12, 18, 12],
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      accessibility: {
        enabled: false,
      },
      xAxis: {
        categories: series.labels,
        tickmarkPlacement: 'on',
        lineColor: 'rgba(15, 23, 42, 0.08)',
        tickPositions,
        labels: {
          style: {
            color: 'rgba(15, 23, 42, 0.65)',
            fontSize: '0.8rem',
          },
        },
      },
      yAxis: {
        title: {
          text: undefined,
        },
        gridLineColor: 'rgba(15, 23, 42, 0.08)',
        labels: {
          style: {
            color: 'rgba(15, 23, 42, 0.6)',
            fontSize: '0.78rem',
          },
          formatter(this: AxisLabelsFormatterContextObject) {
            const value = typeof this.value === 'number' ? this.value : Number(this.value)
            return euroFormatter.format(value)
          },
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        borderColor: 'rgba(15, 23, 42, 0.12)',
        backgroundColor: '#fff',
        borderRadius: 16,
        formatter(this: TooltipFormatterContextObject) {
          if (!this.points) {
            return ''
          }
          const title = `<strong style="display:block;margin-bottom:0.25rem;">${this.x}</strong>`
          const rows = this.points
            .map((point) => {
              const seriesName = point.series.name
              const value = euroFormatter.format(point.y ?? 0)
              return `<span style="color:${point.color};font-weight:600;">${seriesName}</span>: ${value}`
            })
            .join('<br/>')
          return `${title}${rows}`
        },
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false,
          },
          enableMouseTracking: false,
          states: {
            hover: {
              enabled: false,
            },
          },
          lineWidth: 2,
          animation: {
            duration: 600,
          },
        },
        areaspline: {
          fillOpacity: 0.2,
        },
      },
      series: [
        {
          type: 'areaspline',
          name: 'Mois en cours',
          data: series.current,
          color: '#f472b6',
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(244, 114, 182, 0.32)'],
              [1, 'rgba(244, 114, 182, 0.02)'],
            ],
          },
        },
        ...(series.previous
          ? [
            {
              type: 'spline',
              name: 'Mois prÃƒÆ’Ã‚Â©cÃƒÆ’Ã‚Â©dent',
              data: series.previous,
              color: 'rgba(248, 196, 220, 0.85)',
              dashStyle: 'ShortDash',
              lineWidth: 1.8,
            } as const,
          ]
          : []),
      ],
    }
  }, [series])

  if (!hasSeries) {
    return <p className="finance-history__empty">Ajoute quelques mouvements pour visualiser la tendance.</p>
  }

  return (
    <div className="finance-trend-chart finance-trend-chart--highcharts">
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  )
}

