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
import PageLoader from '../../components/PageLoader'
import { useAuth } from '../../context/AuthContext'
import useUserFinanceData from '../../hooks/useUserFinanceData'
import financeMood01 from '../../assets/katie-huber-rhoades-dupe (2).webp'
import financeMood02 from '../../assets/jade-rideout-dupe.webp'
import financeMood03 from '../../assets/MoodBoard.webp'
import type { ExpenseCategory, FinanceEntry, FinanceEntryInput, FlowDirection, MonthlySnapshot } from '../../types/personalization'
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

type FinanceDraft = {
  label: string
  amount: string
  category: ExpenseCategory
  date: string
  direction: FlowDirection
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
  health: { label: 'Taxes et impôts', color: '#BFDBFE' },
  friends: { label: 'Amis', color: '#FCA5A5' },
}

const expenseChartColors: Record<ExpenseCategory, string> = {
  food: '#5c9b5b',
  housing: '#d5a24a',
  transport: '#4f78a3',
  clothing: '#7462a9',
  beauty: '#d66048',
  leisure: '#8c5b4b',
  health: '#788087',
  friends: '#aa6c95',
}

const financeMoodboard = [
  { src: financeMood01, alt: 'Moodboard budget' },
  { src: financeMood02, alt: "Carnet d'épargne inspirant" },
  { src: financeMood03, alt: 'Planification créative' },
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

const transactionDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
})

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

const formatTransactionDate = (isoDate: string) => {
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) {
    return isoDate
  }
  return transactionDateFormatter.format(parsed)
}

const formatMonthRange = (monthKey: string) => {
  const monthStart = parseMonthKeyToDate(monthKey)
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0)
  const monthLabel = monthStart.toLocaleDateString('fr-FR', { month: 'long' })
  return `Du 1er ${monthLabel} au ${monthEnd.getDate()} ${monthLabel} ${monthEnd.getFullYear()}`
}

const addMonthsToMonthKey = (monthKey: string, offset: number) => {
  const baseDate = parseMonthKeyToDate(monthKey)
  const nextDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1)
  return getMonthKeyFromDate(nextDate)
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

const getPercentageChange = (currentValue: number, previousValue: number) => {
  if (previousValue === 0) {
    return 0
  }
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100
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

const FinancePage = () => {
  const { isAuthReady } = useAuth()
  const {
    entries,
    monthlySnapshots,
    isLoading,
    error,
    addEntry,
    deleteEntry,
    saveMonthlySnapshot,
    deleteMonthlySnapshot,
  } = useUserFinanceData()

  const [draft, setDraft] = useState<FinanceDraft>(() => ({
    label: '',
    amount: '',
    category: 'food',
    date: getTodayISO(),
    direction: 'out',
  }))
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false)
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false)
  const [isPeriodMenuOpen, setPeriodMenuOpen] = useState(false)
  const [isAllBudgetsOpen, setAllBudgetsOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add('finance-page--lux')
    return () => {
      document.body.classList.remove('finance-page--lux')
    }
  }, [])

  const currentDate = useMemo(() => new Date(), [])
  const currentMonthKey = useMemo(() => getMonthKeyFromDate(currentDate), [currentDate])

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
    const availableMonths = Array.from(keySet)
      .filter((monthKey) => monthKey !== currentMonthKey)
      .sort((a, b) => b.localeCompare(a))
    return [currentMonthKey, ...availableMonths]
  }, [entries, monthlySnapshots, currentMonthKey])

  const [selectedMonthKey, setSelectedMonthKey] = useState(() => currentMonthKey)
  useEffect(() => {
    if (monthOptions.length === 0) {
      return
    }
    if (!selectedMonthKey) {
      setSelectedMonthKey(monthOptions[0] ?? currentMonthKey)
    }
  }, [monthOptions, selectedMonthKey, currentMonthKey])

  const selectedMonthLabel = useMemo(() => formatMonthKey(selectedMonthKey), [selectedMonthKey])

  const handleFinanceMonthNav = (direction: 'prev' | 'next') => {
    const offset = direction === 'prev' ? -1 : 1
    setSelectedMonthKey(addMonthsToMonthKey(selectedMonthKey, offset))
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
      { id: 'income', label: 'Entrées', value: euroFormatter.format(totalIncome) },
      { id: 'expenses', label: 'Sorties', value: euroFormatter.format(totalSpent) },
      { id: 'balance', label: 'Solde du mois', value: euroFormatter.format(netCashflow) },
    ],
    [netCashflow, totalIncome, totalSpent],
  )

  const topCategories = useMemo(() => {
    return Object.entries(totals)
      .filter(([, amount]) => amount > 0)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .slice(0, 3)
  }, [totals])

  const savingsIdea = useMemo(() => {
    if (topCategories.length === 0) {
      return null
    }
    const [categoryKey, amount] = topCategories[0]
    const definition = categoryDefinitions[categoryKey as ExpenseCategory]
    const target = amount * 0.9
    return {
      label: definition.label,
      current: amount,
      target,
    }
  }, [topCategories])

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

  const financeOverviewStats = useMemo(() => {
    const previousIncome = roundCurrency(
      previousMonthEntries
        .filter((entry) => entry.direction === 'in')
        .reduce((sum, entry) => sum + entry.amount, 0),
    )
    const previousSpent = roundCurrency(
      previousMonthEntries
        .filter((entry) => entry.direction === 'out')
        .reduce((sum, entry) => sum + entry.amount, 0),
    )
    const previousSavings = roundCurrency(previousIncome - previousSpent)
    const previousBalance = roundCurrency(previousStartingAmount + previousSavings)

    return [
      {
        id: 'balance',
        label: 'Solde total',
        value: euroFormatter.format(endingAmount),
        trend: getPercentageChange(endingAmount, previousBalance),
        icon: '▣',
        tone: 'neutral',
      },
      {
        id: 'income',
        label: 'Revenus',
        value: euroFormatter.format(totalIncome),
        trend: getPercentageChange(totalIncome, previousIncome),
        icon: '↑',
        tone: 'income',
      },
      {
        id: 'expenses',
        label: 'Dépenses',
        value: euroFormatter.format(totalSpent),
        trend: getPercentageChange(previousSpent, totalSpent),
        icon: '↓',
        tone: 'expense',
      },
      {
        id: 'savings',
        label: 'Épargne',
        value: euroFormatter.format(savedAmount),
        trend: getPercentageChange(savedAmount, previousSavings),
        icon: '✦',
        tone: 'savings',
      },
    ]
  }, [
    endingAmount,
    previousMonthEntries,
    previousStartingAmount,
    savedAmount,
    totalIncome,
    totalSpent,
  ])

  const pieSegments = useMemo<PieSegment[]>(
    () =>
      (Object.entries(totals) as Array<[ExpenseCategory, number]>)
        .filter(([, value]) => value > 0)
        .map(([category, value]) => ({
          label: categoryDefinitions[category].label,
          value,
          color: expenseChartColors[category],
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

  const recentTransactions = useMemo(() => selectedMonthEntries.slice(0, 5), [selectedMonthEntries])
  const groupedHistoryFull = useMemo(() => groupHistoryByMonth(selectedMonthEntries), [selectedMonthEntries])
  const budgetRows = useMemo(
    () =>
      (Object.entries(totals) as Array<[ExpenseCategory, number]>)
        .filter(([, amount]) => amount > 0)
        .sort(([, amountA], [, amountB]) => amountB - amountA)
        .map(([category, amount]) => ({
          category,
          label: categoryDefinitions[category].label,
          amount,
          share: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
          color: expenseChartColors[category],
        })),
    [totalSpent, totals],
  )
  const visibleBudgetRows = useMemo(
    () => (isAllBudgetsOpen ? budgetRows : budgetRows.slice(0, 5)),
    [budgetRows, isAllBudgetsOpen],
  )
  const isFinanceLoading = !isAuthReady || isLoading

  const handleDraftChange = <Field extends keyof FinanceDraft>(field: Field, value: FinanceDraft[Field]) => {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const amountValue = parseFloat(draft.amount.replace(',', '.'))
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      return
    }

    const trimmedLabel = draft.label.trim()
    const nextEntry: FinanceEntryInput = {
      label: trimmedLabel.length > 0 ? trimmedLabel : draft.direction === 'in' ? 'Revenus' : 'Dépense',
      amount: roundCurrency(amountValue),
      date: draft.date,
      direction: draft.direction,
      ...(draft.direction === 'out' ? { category: draft.category } : {}),
    }

    try {
      await addEntry(nextEntry)
      setDraft((previous) => ({
        ...previous,
        label: '',
        amount: '',
      }))
      setTransactionModalOpen(false)
    } catch {
      // Error is surfaced by the hook state.
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteEntry(entryId)
    } catch {
      // Error is surfaced by the hook state.
    }
  }

  const handleStartingAmountSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedValue = startingAmountDraft.replace(',', '.').trim()
    if (normalizedValue.length === 0) {
      try {
        await deleteMonthlySnapshot(selectedMonthKey)
      } catch {
        // Error is surfaced by the hook state.
      }
      return
    }
    const parsed = parseFloat(normalizedValue)
    if (!Number.isFinite(parsed) || parsed < 0) {
      return
    }
    const rounded = roundCurrency(parsed)
    try {
      await saveMonthlySnapshot(selectedMonthKey, rounded)
    } catch {
      // Error is surfaced by the hook state.
    }
  }

  if (isFinanceLoading) {
    return (
      <PageLoader />
    )
  }

  return (
    <div className="finance-page aesthetic-page">
      <header className="finance-page__heading">
        <div>
          <span className="finance-page__heading-eyebrow">Mes</span>
          <h1>Finances</h1>
        </div>
        <p>Un espace pour suivre ton budget, faire grandir tes projets et avancer vers tes objectifs financiers.</p>
      </header>
      <header className="finance-page-header finance-page-header--actions">
        <div className="finance-page-header__actions">
          <div className="finance-page-header__period">
            <span aria-hidden="true">▣</span>
            <button type="button" onClick={() => handleFinanceMonthNav('prev')} aria-label="Mois précédent">‹</button>
            <strong>{selectedMonthLabel}</strong>
            <button type="button" onClick={() => handleFinanceMonthNav('next')} aria-label="Mois suivant">›</button>
          </div>
          <button type="button" className="finance-page-header__add" onClick={() => setTransactionModalOpen(true)}>
            <span aria-hidden="true">＋</span> Ajouter une transaction
          </button>
        </div>
      </header>
      {error ? <p className="finance-history__empty">{error}</p> : null}

      <section className="finance-overview" aria-label="Résumé financier du mois">
        {financeOverviewStats.map((stat) => {
          const trendIsPositive = stat.trend >= 0
          return (
            <article className="finance-overview__item" key={stat.id}>
              <span className={`finance-overview__icon finance-overview__icon--${stat.tone}`} aria-hidden="true">
                {stat.icon}
              </span>
              <div className="finance-overview__content">
                <span className="finance-overview__label">{stat.label}</span>
                <strong className="finance-overview__value">{stat.value}</strong>
                <span className={`finance-overview__trend ${trendIsPositive ? 'is-positive' : 'is-negative'}`}>
                  {trendIsPositive ? '↗' : '↘'} {formatSignedPercentage(stat.trend)} depuis le mois dernier
                </span>
              </div>
            </article>
          )
        })}
      </section>

      <section className="finance-insights">
        {trendSeries ? (
          <section className="finance-balance-evolution" aria-label="Évolution du solde">
            <FinanceTrendChart
              series={trendSeries}
              currentBalance={endingAmount}
              periodRange={formatMonthRange(selectedMonthKey)}
              periodChange={savingsPercentage}
              monthOptions={monthOptions}
              selectedMonthKey={selectedMonthKey}
              isPeriodMenuOpen={isPeriodMenuOpen}
              onPeriodMenuToggle={() => setPeriodMenuOpen((previous) => !previous)}
              onPreviousMonth={() => handleFinanceMonthNav('prev')}
              onNextMonth={() => handleFinanceMonthNav('next')}
              onMonthSelect={(monthKey) => {
                setSelectedMonthKey(monthKey)
                setPeriodMenuOpen(false)
              }}
            />
          </section>
        ) : null}

        <section className="finance-expense-distribution" aria-labelledby="finance-expense-distribution-title">
          <h2 id="finance-expense-distribution-title">Répartition des dépenses</h2>
          {hasPieData ? (
            <div className="finance-expense-distribution__body">
              <div className="finance-expense-distribution__figure" style={{ backgroundImage: pieBackground }}>
                <div>
                  <strong>{euroFormatter.format(totalSpent)}</strong>
                  <span>Total</span>
                </div>
              </div>
              <ul className="finance-expense-distribution__legend">
                {pieSegments.map((segment) => (
                  <li key={segment.label}>
                    <span className="finance-expense-distribution__dot" style={{ backgroundColor: segment.color }} />
                    <span className="finance-expense-distribution__label">{segment.label}</span>
                    <span className="finance-expense-distribution__percent">
                      {percentFormatter.format((segment.value / totalSpent) * 100)} %
                    </span>
                    <strong>{euroFormatter.format(segment.value)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="finance-expense-distribution__empty">Ajoute une dépense pour visualiser la répartition.</p>
          )}
        </section>
      </section>

      <section className="finance-activity-grid">
        <section className="finance-budget-card" aria-labelledby="finance-budget-title">
          <header className="finance-activity-card__header">
            <h2 id="finance-budget-title">Budgets</h2>
            {budgetRows.length > 5 ? (
              <button type="button" onClick={() => setAllBudgetsOpen((previous) => !previous)}>
                {isAllBudgetsOpen ? 'Réduire les budgets' : 'Voir tous les budgets'} <span aria-hidden="true">→</span>
              </button>
            ) : null}
          </header>
          {budgetRows.length > 0 ? (
            <ul className="finance-budget-card__list">
              {visibleBudgetRows.map((budget) => (
                <li key={budget.category}>
                  <div className="finance-budget-card__row">
                    <span className="finance-budget-card__icon" style={{ color: budget.color }} aria-hidden="true">
                      {budget.category === 'housing' ? '⌂' : budget.category === 'food' ? '⌑' : budget.category === 'transport' ? '⌘' : '✦'}
                    </span>
                    <div className="finance-budget-card__details">
                      <div>
                        <strong>{budget.label}</strong>
                        <span>{euroFormatter.format(budget.amount)} dépensés</span>
                        <b>{percentFormatter.format(budget.share)} %</b>
                      </div>
                      <div className="finance-budget-card__progress" aria-label={`${percentFormatter.format(budget.share)} % des dépenses`}>
                        <span style={{ width: `${budget.share}%`, backgroundColor: budget.color }} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="finance-budget-card__empty">Ajoute une dépense pour voir la répartition de ton budget.</p>
          )}
        </section>

        <section className="finance-recent-transactions" aria-labelledby="finance-recent-transactions-title">
          <header className="finance-activity-card__header">
            <h2 id="finance-recent-transactions-title">Transactions récentes</h2>
            <button type="button" onClick={() => setHistoryModalOpen(true)}>
              Voir toutes les transactions <span aria-hidden="true">→</span>
            </button>
          </header>
          {recentTransactions.length > 0 ? (
            <ul className="finance-recent-transactions__list">
              {recentTransactions.map((entry) => {
                const definition = entry.category ? categoryDefinitions[entry.category] : undefined
                const amountValue = entry.direction === 'out' ? -entry.amount : entry.amount
                const categoryLabel = entry.direction === 'in' ? 'Revenus' : definition?.label ?? 'Dépense'
                return (
                  <li key={entry.id}>
                    <span className={`finance-recent-transactions__icon ${entry.direction === 'in' ? 'is-income' : ''}`} aria-hidden="true">
                      {entry.direction === 'in' ? '↓' : '•'}
                    </span>
                    <div className="finance-recent-transactions__details">
                      <strong>{entry.label}</strong>
                      <span>{categoryLabel}</span>
                    </div>
                    <time dateTime={entry.date}>{formatTransactionDate(entry.date)}</time>
                    <b className={entry.direction === 'in' ? 'is-income' : 'is-expense'}>{formatSignedCurrency(amountValue)}</b>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="finance-recent-transactions__empty">Aucune transaction pour ce mois.</p>
          )}
        </section>
      </section>

      {isTransactionModalOpen ? (
        <div className="finance-transaction-modal" role="dialog" aria-modal="true" aria-labelledby="finance-transaction-modal-title">
          <div className="finance-transaction-modal__backdrop" onClick={() => setTransactionModalOpen(false)} />
          <section className="finance-transaction-modal__panel">
            <header className="finance-transaction-modal__header">
              <h2 id="finance-transaction-modal-title">Ajouter une transaction</h2>
              <button type="button" onClick={() => setTransactionModalOpen(false)} aria-label="Fermer">
                ×
              </button>
            </header>
            <form onSubmit={handleSubmit} className="finance-transaction-form">
              <div className="finance-transaction-form__field finance-transaction-form__field--type">
                <span>1. Type de transaction</span>
                <div className="finance-transaction-form__types">
                  <button
                    type="button"
                    className={draft.direction === 'out' ? 'is-selected is-expense' : undefined}
                    onClick={() => handleDraftChange('direction', 'out')}
                  >
                    <i aria-hidden="true">↓</i>
                    Dépense
                  </button>
                  <button
                    type="button"
                    className={draft.direction === 'in' ? 'is-selected is-income' : undefined}
                    onClick={() => handleDraftChange('direction', 'in')}
                  >
                    <i aria-hidden="true">↑</i>
                    Revenu
                  </button>
                </div>
              </div>

              <label className="finance-transaction-form__field finance-transaction-form__field--amount">
                <span>2. Montant</span>
                <div className="finance-transaction-form__amount-input">
                  <input
                    type="text"
                    value={draft.amount}
                    onChange={(event) => handleDraftChange('amount', event.target.value)}
                    placeholder="120,00"
                    required
                  />
                  <b>€</b>
                </div>
              </label>

              {draft.direction === 'out' ? (
                <label className="finance-transaction-form__field finance-transaction-form__field--category">
                  <span>3. Catégorie</span>
                  <select value={draft.category} onChange={(event) => handleDraftChange('category', event.target.value as ExpenseCategory)}>
                    {Object.entries(categoryDefinitions).map(([value, definition]) => (
                      <option key={value} value={value}>{definition.label}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className="finance-transaction-form__field finance-transaction-form__field--category">
                  <span>3. Catégorie</span>
                  <div className="finance-transaction-form__income-category">Revenus</div>
                </div>
              )}

              <label className="finance-transaction-form__field finance-transaction-form__field--date">
                <span>4. Date</span>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => handleDraftChange('date', event.target.value)}
                  required
                />
              </label>

              <label className="finance-transaction-form__field finance-transaction-form__field--label">
                <span>5. Bénéficiaire / Libellé</span>
                <input
                  type="text"
                  value={draft.label}
                  onChange={(event) => handleDraftChange('label', event.target.value)}
                  placeholder="Ex : Carrefour Market"
                />
              </label>

              <footer className="finance-transaction-form__footer">
                <button type="button" className="finance-transaction-form__cancel" onClick={() => setTransactionModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="finance-transaction-form__submit">
                  Enregistrer la transaction
                </button>
              </footer>
            </form>
          </section>
        </div>
      ) : null}

      {isHistoryModalOpen ? (
        <div className="finance-history-modal" role="dialog" aria-modal="true">
          <div className="finance-history-modal__backdrop" onClick={() => setHistoryModalOpen(false)} />
          <div className="finance-history-modal__panel">
            <header className="finance-history-modal__header">
              <div>
                <h3>{selectedMonthLabel}</h3>
              </div>
              <button
                type="button"
                className="modal__close"
                onClick={() => setHistoryModalOpen(false)}
                aria-label="Fermer l'historique"
              >
                
              </button>
            </header>
            <div className="finance-history-modal__content">
              {selectedMonthEntries.length === 0 ? (
                <p className="finance-history__empty">
                  {`Aucun mouvement enregistré pour ${selectedMonthLabel}.`}
                </p>
              ) : (
                groupedHistoryFull.map((group) => (
                  <div key={group.monthKey} className="finance-history__group">
                    <div className="finance-history__month-chip">{group.monthLabel}</div>
                    <ul className="finance-history__list">
                      {group.entries.map((entry) => {
                        const definition = entry.category ? categoryDefinitions[entry.category] : undefined
                        const amountValue = entry.direction === 'out' ? -entry.amount : entry.amount
                        const chipColor = entry.direction === 'in' ? '#725c3f' : definition?.color ?? '#1e1b4b'
                        const categoryLabel = entry.direction === 'in' ? 'Revenus' : definition?.label ?? 'Dépense'
                        const formattedDate = formatHistoryDate(entry.date)
                        const directionLabel = entry.direction === 'in' ? 'Entrée' : 'Sortie'

                        return (
                          <li key={entry.id} className="finance-history__item">
                            <div className="finance-history__details">
                              <div className="finance-history__row">
                                <div className="finance-history__headline">
                                  <span className="finance-history__label">{entry.label}</span>
                                </div>
                                <span className="finance-history__amount">
                                  {formatSignedCurrency(amountValue)}
                                </span>
                                <button
                                  type="button"
                                  className="finance-history__delete"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  aria-label={`Supprimer ${entry.label}`}
                                >
                                  <span aria-hidden="true">×</span>
                                </button>
                              </div>
                              <div className="finance-history__meta">
                                <span className="finance-history__category-chip" style={{ color: chipColor }}>
                                  {categoryLabel}
                                </span>
                                <span className="finance-history__date">{`${directionLabel} le ${formattedDate}`}</span>
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
</div>
  )
}

export default FinancePage

type FinanceTrendChartProps = {
  series: FinanceTrendSeries | null
  currentBalance: number
  periodRange: string
  periodChange: number
  monthOptions: string[]
  selectedMonthKey: string
  isPeriodMenuOpen: boolean
  onPeriodMenuToggle: () => void
  onPreviousMonth: () => void
  onNextMonth: () => void
  onMonthSelect: (monthKey: string) => void
}

const FinanceTrendChart = ({
  series,
  currentBalance,
  periodRange,
  periodChange,
  monthOptions,
  selectedMonthKey,
  isPeriodMenuOpen,
  onPeriodMenuToggle,
  onPreviousMonth,
  onNextMonth,
  onMonthSelect,
}: FinanceTrendChartProps) => {
  const periodControlRef = useRef<HTMLDivElement>(null)
  const hasSeries = series && series.current.length > 1

  useEffect(() => {
    if (!isPeriodMenuOpen) {
      return
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!periodControlRef.current?.contains(event.target as Node)) {
        onPeriodMenuToggle()
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown)
  }, [isPeriodMenuOpen, onPeriodMenuToggle])

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
        spacing: [12, 4, 10, 0],
        height: 235,
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
            color: '#657174',
            fontSize: '0.66rem',
          },
        },
      },
      yAxis: {
        title: {
          text: undefined,
        },
        gridLineColor: '#edf0ee',
        gridLineDashStyle: 'ShortDash',
        labels: {
          style: {
            color: '#657174',
            fontSize: '0.67rem',
          },
          formatter(this: AxisLabelsFormatterContextObject) {
            const value = typeof this.value === 'number' ? this.value : Number(this.value)
            return `${percentFormatter.format(value / 1000)} k €`
          },
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        borderColor: 'rgba(114, 92, 63, 0.24)',
        backgroundColor: '#725c3f',
        borderRadius: 6,
        style: {
          color: '#fff',
          fontSize: '0.72rem',
        },
        formatter(this: TooltipFormatterContextObject) {
          if (!this.points) {
            return ''
          }
          const value = euroFormatter.format(this.points[0]?.y ?? 0)
          return `<strong>${value}</strong>`
        },
      },
      plotOptions: {
        series: {
          marker: {
            enabled: true,
            radius: 3,
            lineWidth: 0,
          },
          enableMouseTracking: false,
          states: {
            hover: {
              enabled: false,
            },
          },
          lineWidth: 2.5,
          animation: {
            duration: 600,
          },
        },
        areaspline: {
          fillOpacity: 0.26,
        },
      },
      series: [
        {
          type: 'areaspline',
          name: 'Solde',
          data: series.current,
          color: '#725c3f',
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, 'rgba(114, 92, 63, 0.26)'],
              [1, 'rgba(114, 92, 63, 0.02)'],
            ],
          },
        },
      ],
    }
  }, [series])

  if (!hasSeries) {
    return <p className="finance-history__empty">Ajoute quelques mouvements pour visualiser la tendance.</p>
  }

  return (
    <div className="finance-balance-evolution__content">
      <header className="finance-balance-evolution__header">
        <div>
          <h2>Évolution du solde</h2>
          <strong>{euroFormatter.format(currentBalance)}</strong>
          <p>{periodRange}</p>
        </div>
        <div className="finance-balance-evolution__period-control" ref={periodControlRef}>
          <button
            type="button"
            className="finance-balance-evolution__period-arrow"
            aria-label="Mois précédent"
            onClick={onPreviousMonth}
          >
            ‹
          </button>
          <button
            type="button"
            className="finance-balance-evolution__period"
            aria-haspopup="listbox"
            aria-expanded={isPeriodMenuOpen}
            onClick={onPeriodMenuToggle}
          >
            Mensuel
          </button>
          <button
            type="button"
            className="finance-balance-evolution__period-arrow"
            aria-label="Mois suivant"
            onClick={onNextMonth}
          >
            ›
          </button>
          {isPeriodMenuOpen ? (
            <div className="finance-balance-evolution__period-menu" role="listbox" aria-label="Choisir un mois">
              {monthOptions.map((monthKey) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={monthKey === selectedMonthKey}
                  className={monthKey === selectedMonthKey ? 'is-selected' : undefined}
                  key={monthKey}
                  onClick={() => onMonthSelect(monthKey)}
                >
                  {formatMonthKey(monthKey)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </header>
      <div className="finance-balance-evolution__chart">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <p className={`finance-balance-evolution__note ${periodChange >= 0 ? 'is-positive' : 'is-negative'}`}>
        <span aria-hidden="true">✧</span>
        Ton solde est {periodChange >= 0 ? 'en hausse' : 'en baisse'} de {percentFormatter.format(Math.abs(periodChange))} % sur la période sélectionnée.
      </p>
    </div>
  )
}



