import { useEffect, useMemo, useState } from "react"
import PageHeading from "../../components/PageHeading"
import usePersistentState from "../../hooks/usePersistentState"
import "./Archives.css"

type JournalingEntry = {
  id: string
  date: string
  keyword?: string
  question?: string
  questionAnswer?: string
  content?: string
  positiveAnchor?: string
  createdAt?: number
}

type SelfLoveSavedLetter = {
  id: string
  template: "classic" | "kitty"
  to?: string
  from?: string
  body: string
  createdAt: string
  innerChild?: { message: string; reassurance: string; neededWords: string }
  bestFriend?: { advice: string; selfTalk: string }
  entryType: "letter" | "innerChild" | "bestFriend"
}

type SelfLoveState = {
  savedLetters?: SelfLoveSavedLetter[]
}

type ArchiveEntry = {
  id: string
  dateKey: string
  createdAt: number
  title: string
  excerpt: string
  details: Array<{ label: string; value: string }>
  section: "journaling" | "self-love"
  sectionLabel: string
  tags: string[]
}

const JOURNAL_KEY = "planner.journal.entries"
const SELF_LOVE_KEY = "planner.selfLove"

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

const getTimestampFromDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number)
  if (!year || !month || !day) {
    return Date.now()
  }
  return new Date(year, month - 1, day).getTime()
}

const formatMonthLabel = (value: string) => {
  const [year, month] = value.split("-").map(Number)
  if (!year || !month) {
    return value
  }
  const formatted = new Date(year, month - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const formatArchiveDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) {
    return value
  }
  const formatted = new Date(year, month - 1, day).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const buildMonthGrid = (year: number, monthIndex: number) => {
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7
  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startOffset + 1
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return { key: `${year}-${monthIndex}-${index}`, day: null, dateKey: null }
    }
    const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`
    return { key: dateKey, day: dayNumber, dateKey }
  })
}

const getSelfLoveTitle = (letter: SelfLoveSavedLetter) => {
  if (letter.entryType === "innerChild") {
    return "Exercice — L'enfant intérieur"
  }
  if (letter.entryType === "bestFriend") {
    return "Exercice — Jeu des rôles"
  }
  return letter.template === "classic" ? "Lettre romantique" : "Lettre petit chat"
}

const getSelfLoveExcerpt = (letter: SelfLoveSavedLetter) => {
  if (letter.entryType === "innerChild") {
    return (
      letter.innerChild?.message ||
      letter.innerChild?.reassurance ||
      letter.innerChild?.neededWords ||
      letter.body
    )
  }
  if (letter.entryType === "bestFriend") {
    return letter.bestFriend?.advice || letter.bestFriend?.selfTalk || letter.body
  }
  return letter.body
}

const ArchivesPage = () => {
  const [journalEntries] = usePersistentState<JournalingEntry[]>(JOURNAL_KEY, () => [])
  const [selfLoveState] = usePersistentState<SelfLoveState>(SELF_LOVE_KEY, () => ({ savedLetters: [] }))
  const [sectionFilter, setSectionFilter] = useState<"all" | "journaling" | "self-love">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null)

  const journalingArchiveEntries = useMemo<ArchiveEntry[]>(() => {
    return journalEntries
      .filter((entry) => entry.date)
      .map((entry) => {
        const title = entry.keyword
          ? `Mot-clé : ${entry.keyword}`
          : entry.question
            ? "Question guidée"
            : "Journal"
        const excerpt = entry.content || entry.questionAnswer || entry.positiveAnchor || ""
        const createdAt = entry.createdAt ?? getTimestampFromDateKey(entry.date)
        const tags = ["Journaling"]
        if (entry.keyword) {
          tags.push(entry.keyword)
        }
        const details: Array<{ label: string; value: string }> = []
        if (entry.keyword) {
          details.push({ label: "Mot-cle", value: entry.keyword })
        }
        if (entry.question) {
          details.push({ label: "Question du jour", value: entry.question })
        }
        if (entry.questionAnswer) {
          details.push({ label: "Réponse", value: entry.questionAnswer })
        }
        if (entry.content) {
          details.push({ label: "Journal", value: entry.content })
        }
        if (entry.positiveAnchor) {
          details.push({ label: "Ancrage", value: entry.positiveAnchor })
        }
        return {
          id: entry.id,
          dateKey: entry.date,
          createdAt,
          title,
          excerpt,
          details,
          section: "journaling",
          sectionLabel: "Journaling",
          tags,
        }
      })
  }, [journalEntries])

  const selfLoveArchiveEntries = useMemo<ArchiveEntry[]>(() => {
    const letters = selfLoveState.savedLetters ?? []
    return letters.map((letter) => {
      const dateKey = letter.createdAt.slice(0, 10)
      const createdAt = new Date(letter.createdAt).getTime()
      const title = getSelfLoveTitle(letter)
      const excerpt = getSelfLoveExcerpt(letter)
      const tags = ["Self Love", title]
      const details: Array<{ label: string; value: string }> = []
      if (letter.to) {
        details.push({ label: "Pour", value: letter.to })
      }
      if (letter.from) {
        details.push({ label: "De", value: letter.from })
      }
      if (letter.body) {
        details.push({ label: "Lettre", value: letter.body })
      }
      if (letter.innerChild?.message) {
        details.push({ label: "Enfant interieur - Message", value: letter.innerChild.message })
      }
      if (letter.innerChild?.reassurance) {
        details.push({ label: "Enfant interieur - Reassurance", value: letter.innerChild.reassurance })
      }
      if (letter.innerChild?.neededWords) {
        details.push({ label: "Enfant interieur - Mots utiles", value: letter.innerChild.neededWords })
      }
      if (letter.bestFriend?.advice) {
        details.push({ label: "Jeu des roles - Conseil", value: letter.bestFriend.advice })
      }
      if (letter.bestFriend?.selfTalk) {
        details.push({ label: "Jeu des roles - Auto-discours", value: letter.bestFriend.selfTalk })
      }
      return {
        id: letter.id,
        dateKey,
        createdAt,
        title,
        excerpt,
        details,
        section: "self-love",
        sectionLabel: "Self Love",
        tags,
      }
    })
  }, [selfLoveState.savedLetters])

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const base =
      sectionFilter === "all"
        ? [...journalingArchiveEntries, ...selfLoveArchiveEntries]
        : sectionFilter === "journaling"
          ? journalingArchiveEntries
          : selfLoveArchiveEntries
    if (!query) {
      return base
    }
    return base.filter((entry) => {
      const haystack = [entry.title, entry.excerpt, entry.sectionLabel, entry.tags.join(" ")]
        .join(" ")
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [journalingArchiveEntries, selfLoveArchiveEntries, sectionFilter, searchQuery])

  const entriesByDate = useMemo(() => {
    const map = new Map<string, ArchiveEntry[]>()
    filteredEntries.forEach((entry) => {
      if (!entry.dateKey) {
        return
      }
      const list = map.get(entry.dateKey) ?? []
      list.push(entry)
      map.set(entry.dateKey, list)
    })
    return map
  }, [filteredEntries])

  const archiveYears = useMemo(() => {
    const counts = new Map<string, number>()
    entriesByDate.forEach((entries, dateKey) => {
      const year = dateKey.slice(0, 4)
      counts.set(year, (counts.get(year) ?? 0) + entries.length)
    })
    return Array.from(counts.entries())
      .map(([year, total]) => ({ year, total }))
      .sort((a, b) => (a.year > b.year ? -1 : 1))
  }, [entriesByDate])

  const monthCountsByYear = useMemo(() => {
    const map = new Map<string, Map<string, number>>()
    entriesByDate.forEach((entries, dateKey) => {
      const year = dateKey.slice(0, 4)
      const monthKey = dateKey.slice(0, 7)
      const months = map.get(year) ?? new Map<string, number>()
      months.set(monthKey, (months.get(monthKey) ?? 0) + entries.length)
      map.set(year, months)
    })
    return map
  }, [entriesByDate])

  const selectedYearMonths = useMemo(() => {
    if (!selectedYear) {
      return []
    }
    const monthCounts = monthCountsByYear.get(selectedYear) ?? new Map<string, number>()
    return Array.from({ length: 12 }, (_, index) => {
      const monthIndex = index + 1
      const monthKey = `${selectedYear}-${String(monthIndex).padStart(2, "0")}`
      return {
        monthKey,
        label: formatMonthLabel(monthKey),
        total: monthCounts.get(monthKey) ?? 0,
      }
    })
  }, [selectedYear, monthCountsByYear])

  const calendarCells = useMemo(() => {
    if (!selectedMonth) {
      return []
    }
    const [yearValue, monthValue] = selectedMonth.split("-").map(Number)
    if (!yearValue || !monthValue) {
      return []
    }
    const todayKey = new Date().toISOString().slice(0, 10)
    return buildMonthGrid(yearValue, monthValue - 1).map((cell) => {
      if (!cell.dateKey) {
        return { ...cell, count: 0, isToday: false }
      }
      const count = entriesByDate.get(cell.dateKey)?.length ?? 0
      return { ...cell, count, isToday: cell.dateKey === todayKey }
    })
  }, [selectedMonth, entriesByDate])

  const selectedMonthDays = useMemo(() => {
    if (!selectedMonth) {
      return []
    }
    const days: Array<{ dateKey: string; label: string; total: number }> = []
    entriesByDate.forEach((entries, dateKey) => {
      if (dateKey.startsWith(selectedMonth)) {
        days.push({ dateKey, label: formatArchiveDate(dateKey), total: entries.length })
      }
    })
    return days.sort((a, b) => (a.dateKey > b.dateKey ? -1 : 1))
  }, [entriesByDate, selectedMonth])

  const activeDayEntries = useMemo(() => {
    if (!selectedDay) {
      return []
    }
    const entries = entriesByDate.get(selectedDay) ?? []
    return [...entries].sort((a, b) =>
      sortOrder === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
    )
  }, [entriesByDate, selectedDay, sortOrder])

  useEffect(() => {
    if (selectedYear && !archiveYears.some((group) => group.year === selectedYear)) {
      setSelectedYear(null)
      setSelectedMonth(null)
      setSelectedDay(null)
    }
  }, [archiveYears, selectedYear])

  useEffect(() => {
    if (selectedMonth && (!selectedYear || !selectedYearMonths.some((month) => month.monthKey === selectedMonth))) {
      setSelectedMonth(null)
      setSelectedDay(null)
    }
  }, [selectedMonth, selectedYear, selectedYearMonths])

  useEffect(() => {
    if (selectedDay && !entriesByDate.has(selectedDay)) {
      setSelectedDay(null)
    }
  }, [entriesByDate, selectedDay])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedEntry(null)
      }
    }
    if (selectedEntry) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedEntry])

  return (
    <div className="archives-page aesthetic-page">
      <PageHeading eyebrow="Archives" title="Archives" />

      <header className="archives-header">
        <div className="archives-intro">
          <p>Retrouvez vos écrits par date.</p>
        </div>
        <div className="archives-controls">
          <label className="archives-control">
            <span>Rechercher</span>
            <input
              type="search"
              placeholder="Rechercher dans les archives"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
          <label className="archives-control">
            <span>Section</span>
            <select
              value={sectionFilter}
              onChange={(event) => setSectionFilter(event.target.value as "all" | "journaling" | "self-love")}
            >
              <option value="all">Toutes les sections</option>
              <option value="journaling">Journaling</option>
              <option value="self-love">Self Love</option>
            </select>
          </label>
        </div>
      </header>

      {archiveYears.length === 0 ? (
        <p className="archives-empty">Aucun écrit pour le moment.</p>
      ) : (
        <div className="archives-layout">
          <div className="archives-nav">
            <div className="archives-years">
              {archiveYears.map((group) => (
                <button
                  key={group.year}
                  type="button"
                  className={`archives-year-card${selectedYear === group.year ? " is-active" : ""}`}
                  onClick={() => {
                    setSelectedYear(group.year)
                    setSelectedMonth(null)
                    setSelectedDay(null)
                  }}
                >
                  <span className="archives-year">{group.year}</span>
                  <span className="archives-count">{group.total} écrits</span>
                </button>
              ))}
            </div>

            {selectedYear ? (
              <div className="archives-months">
                {selectedYearMonths.map((month) => (
                  <button
                    key={month.monthKey}
                    type="button"
                    className={`archives-month-card${selectedMonth === month.monthKey ? " is-active" : ""}${month.total === 0 ? " is-empty" : ""
                      }`}
                    onClick={() => {
                      setSelectedMonth(month.monthKey)
                      setSelectedDay(null)
                    }}
                  >
                    <span className="archives-month">{month.label}</span>
                    <span className="archives-count">{month.total}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="archives-hint">Choisis une année pour voir les mois.</p>
            )}

            {selectedMonth ? (
              <div className="archives-calendar">
                <div className="archives-calendar-header">
                  <h3>{formatMonthLabel(selectedMonth)}</h3>
                  <span>{selectedYear}</span>
                </div>
                <div className="archives-calendar-grid" role="grid">
                  {weekDays.map((label) => (
                    <div key={label} className="archives-weekday" role="columnheader">
                      {label}
                    </div>
                  ))}
                  {calendarCells.map((cell) => {
                    if (!cell.dateKey || cell.day === null) {
                      return <div key={cell.key} className="archives-day archives-day--outside" />
                    }
                    if (cell.count === 0) {
                      return (
                        <div key={cell.key} className="archives-day archives-day--empty">
                          <span>{cell.day}</span>
                        </div>
                      )
                    }
                    const dayEntries = entriesByDate.get(cell.dateKey) ?? []
                    const preview = dayEntries
                      .slice(0, 2)
                      .map((entry) => entry.title)
                      .join(" · ")
                    const tooltip = `${cell.count} écrit(s)${preview ? ` — ${preview}` : ""}`
                    return (
                      <button
                        key={cell.key}
                        type="button"
                        className={`archives-day archives-day-button${selectedDay === cell.dateKey ? " is-active" : ""}${cell.isToday ? " is-today" : ""
                          }`}
                        onClick={() => setSelectedDay(cell.dateKey)}
                        title={tooltip}
                        aria-label={`Voir les écrits du ${formatArchiveDate(cell.dateKey)} (${cell.count})`}
                      >
                        <span className="archives-day-number">{cell.day}</span>
                        <span className="archives-day-badge">• {cell.count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {selectedMonth ? (
              <div className="archives-days-list">
                {selectedMonthDays.length > 0 ? (
                  selectedMonthDays.map((day) => (
                    <button
                      key={day.dateKey}
                      type="button"
                      className={`archives-day-list-item${selectedDay === day.dateKey ? " is-active" : ""}`}
                      onClick={() => setSelectedDay(day.dateKey)}
                    >
                      <span>{day.label}</span>
                      <span className="archives-day-badge">• {day.total}</span>
                    </button>
                  ))
                ) : (
                  <p className="archives-empty">Aucun écrit sur ce mois.</p>
                )}
              </div>
            ) : null}
          </div>

          <aside className="archives-detail">
            {selectedDay ? (
              <>
                <div className="archives-detail-header">
                  <div>
                    <span className="archives-detail-eyebrow">Détails du jour</span>
                    <h3>{formatArchiveDate(selectedDay)}</h3>
                  </div>
                  <label className="archives-control">
                    <span>Tri</span>
                    <select
                      value={sortOrder}
                      onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
                    >
                      <option value="newest">Plus récent</option>
                      <option value="oldest">Plus ancien</option>
                    </select>
                  </label>
                </div>
                {activeDayEntries.length > 0 ? (
                  <ul className="archives-entries">
                    {activeDayEntries.map((entry) => (
                      <li key={entry.id} className="archives-entry">
                        <button type="button" className="archives-entry-button" onClick={() => setSelectedEntry(entry)}>
                          <div className="archives-entry-head">
                            <span className="archives-entry-title">{entry.title}</span>
                            <div className="archives-tags">
                              <span className="archives-tag">{entry.sectionLabel}</span>
                              {entry.tags.slice(1, 3).map((tag) => (
                                <span key={tag} className="archives-tag archives-tag--muted">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="archives-entry-excerpt">{entry.excerpt || "Aucun texte disponible."}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="archives-empty">Aucun écrit pour ce jour.</p>
                )}
              </>
            ) : (
              <div className="archives-empty">Choisis un jour pour voir tes écrits.</div>
            )}
          </aside>
        </div>
      )}
      {selectedEntry ? (
        <div className="archives-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="archives-modal__backdrop"
            onClick={() => setSelectedEntry(null)}
            aria-label="Fermer"
          />
          <div className="archives-modal__content">
            <header className="archives-modal__header">
              <div>
                <p>{selectedEntry.sectionLabel}</p>
                <h3>{formatArchiveDate(selectedEntry.dateKey)}</h3>
              </div>
              <button type="button" className="archives-modal__close" onClick={() => setSelectedEntry(null)}>
                Fermer
              </button>
            </header>
            <div className="archives-modal__body">
              <h4>{selectedEntry.title}</h4>
              {selectedEntry.details.length > 0 ? (
                <div className="archives-modal__details">
                  {selectedEntry.details.map((detail) => (
                    <div key={`${selectedEntry.id}-${detail.label}`} className="archives-modal__detail">
                      <span>{detail.label}</span>
                      <p>{detail.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun detail disponible.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ArchivesPage
