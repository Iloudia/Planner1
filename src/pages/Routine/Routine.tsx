import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import type { RoutineItem } from "../../data/sampleData"
import { useAuth } from "../../context/AuthContext"
import useUserRoutine from "../../hooks/useUserRoutine"
import PageHeading from "../../components/PageHeading"
import "./RoutinePage.css"

type RoutineId = string
type RoutinePeriod = "morning" | "evening"
type RoutineDraft = {
  title: string
  detail: string
}

const ROUTINE_TITLE_MAX_LENGTH = 50
const ROUTINE_DETAIL_MAX_LENGTH = 35

const truncateText = (value: string, max = ROUTINE_TITLE_MAX_LENGTH) =>
  value.length > max ? `${value.slice(0, max - 3).trimEnd()}...` : value

type RoutineChecklistProps = {
  items: RoutineItem[]
  completedSet: Set<RoutineId>
  toggleRoutine: (id: RoutineId) => void
  onRemoveItem?: (id: RoutineId) => void
  disabled?: boolean
}

const RoutineChecklist = ({ items, completedSet, toggleRoutine, onRemoveItem, disabled = false }: RoutineChecklistProps) => (
  <ul className="routine-note__list">
    {items.map((item, index) => (
      <li className="routine-note__item" key={item.id}>
        <div className="routine-note__row">
          <label className={`routine-note__label${item.detail ? "" : " routine-note__label--title-only"}`}>
            <span className="routine-note__index">{String(index + 1).padStart(2, "0")}</span>
            <input
              className="routine-note__checkbox"
              type="checkbox"
              checked={completedSet.has(item.id)}
              onChange={() => toggleRoutine(item.id)}
              disabled={disabled}
            />
            <span className={`routine-note__text${item.detail ? "" : " routine-note__text--title-only"}`}>
              <span className="routine-note__item-title routine-note__item-title--desktop">{truncateText(item.title)}</span>
              <span className="routine-note__item-title routine-note__item-title--mobile">{item.title}</span>
              {item.detail ? <span className="routine-note__item-detail">{item.detail}</span> : null}
            </span>
          </label>
          {onRemoveItem ? (
            <div className="routine-note__actions">
              <button
                type="button"
                className="routine-note__remove"
                onClick={() => onRemoveItem(item.id)}
                aria-label={`Supprimer ${item.title}`}
                disabled={disabled}
              >
                x
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
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  buttonLabel: string
  placeholderTitle: string
  placeholderDetail: string
  disabled?: boolean
}

const RoutineComposer = ({
  draft,
  onDraftChange,
  onSubmit,
  buttonLabel,
  placeholderTitle,
  placeholderDetail,
  disabled = false,
}: RoutineComposerProps) => (
  <form className="routine-note__composer" onSubmit={onSubmit}>
    <label>
      <span>Nouvelle action</span>
      <input
        type="text"
        value={draft.title}
        onChange={(event) => onDraftChange("title", event.target.value.slice(0, ROUTINE_TITLE_MAX_LENGTH))}
        placeholder={placeholderTitle}
        required
        maxLength={ROUTINE_TITLE_MAX_LENGTH}
        disabled={disabled}
      />
      {draft.title.length >= ROUTINE_TITLE_MAX_LENGTH ? (
        <span className="routine-note__composer-hint">Limite de 50 caractères atteinte.</span>
      ) : null}
    </label>
    <label>
      <span>Détail (optionnel)</span>
      <textarea
        value={draft.detail}
        onChange={(event) => onDraftChange("detail", event.target.value.slice(0, ROUTINE_DETAIL_MAX_LENGTH))}
        placeholder={placeholderDetail}
        rows={2}
        maxLength={ROUTINE_DETAIL_MAX_LENGTH}
        disabled={disabled}
      />
      {draft.detail.length >= ROUTINE_DETAIL_MAX_LENGTH ? (
        <span className="routine-note__composer-hint">Limite de 35 caractères atteinte.</span>
      ) : null}
    </label>
    <button type="submit" className="routine-note__composer-submit" disabled={disabled}>
      {disabled ? "Connecte-toi pour modifier" : buttonLabel}
    </button>
  </form>
)

const RoutinePage = () => {
  const { isAuthReady, userId } = useAuth()
  const { items, completedSet, isLoading, error, addItem, removeItem, toggleItem } = useUserRoutine()
  const canEdit = Boolean(userId)
  const isRoutineLoading = !isAuthReady || isLoading
  const [activeRoutinePeriod, setActiveRoutinePeriod] = useState<RoutinePeriod>("morning")
  const [isMobileRoutineView, setIsMobileRoutineView] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 1160 : false,
  )
  const [routineDrafts, setRoutineDrafts] = useState<Record<RoutinePeriod, RoutineDraft>>({
    morning: { title: "", detail: "" },
    evening: { title: "", detail: "" },
  })

  const morningRoutines = useMemo<RoutineItem[]>(
    () =>
      items
        .filter((item) => item.period === "morning")
        .map((item) => ({ id: item.id, title: item.title, detail: item.detail })),
    [items],
  )
  const eveningRoutines = useMemo<RoutineItem[]>(
    () =>
      items
        .filter((item) => item.period === "evening")
        .map((item) => ({ id: item.id, title: item.title, detail: item.detail })),
    [items],
  )

  useEffect(() => {
    document.body.classList.add("routine-page--lux")
    return () => {
      document.body.classList.remove("routine-page--lux")
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const mediaQuery = window.matchMedia("(max-width: 1160px)")
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileRoutineView(event.matches)
    }
    setIsMobileRoutineView(mediaQuery.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
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

  const handleRoutineSubmit = (period: RoutinePeriod) => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canEdit) {
      return
    }
    const draft = routineDrafts[period]
    const trimmedTitle = draft.title.trim()
    if (!trimmedTitle) {
      return
    }

    try {
      await addItem({
        period,
        title: trimmedTitle,
        detail: draft.detail.trim() || undefined,
      })
      setRoutineDrafts((previous) => ({
        ...previous,
        [period]: { title: "", detail: "" },
      }))
    } catch {
      return
    }
  }

  const handleRoutineRemoval = async (id: RoutineId) => {
    if (!canEdit) {
      return
    }
    try {
      await removeItem(id)
    } catch {
      return
    }
  }

  const handleRoutineToggle = async (id: RoutineId) => {
    if (!canEdit) {
      return
    }
    try {
      await toggleItem(id)
    } catch {
      return
    }
  }

  if (isRoutineLoading) {
    return (
      <div className="routine-page aesthetic-page routine-page--loading" aria-busy="true" aria-live="polite">
        <span className="routine-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  const routinePeriodToggle = (
    <div className="calendar-view-toggle" role="tablist" aria-label="Période de routine">
      <button
        type="button"
        role="tab"
        aria-selected={activeRoutinePeriod === "morning"}
        className={`calendar-view-toggle__button${activeRoutinePeriod === "morning" ? " is-active" : ""}`}
        onClick={() => setActiveRoutinePeriod("morning")}
      >
        Matin
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeRoutinePeriod === "evening"}
        className={`calendar-view-toggle__button${activeRoutinePeriod === "evening" ? " is-active" : ""}`}
        onClick={() => setActiveRoutinePeriod("evening")}
      >
        Soir
      </button>
    </div>
  )

  return (
    <div className="routine-page aesthetic-page">
      <PageHeading eyebrow="Routine" title="Mes Routines" />
      {!canEdit ? <p className="routine-note__composer-hint">Connecte-toi pour enregistrer tes routines.</p> : null}
      {error ? <p className="routine-note__composer-hint">{error}</p> : null}

      <div className="routine-notes">
        {!isMobileRoutineView || activeRoutinePeriod === "morning" ? (
        <section className="routine-note routine-note--morning">
          <div className="routine-note__top">
            {isMobileRoutineView ? routinePeriodToggle : null}
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
              toggleRoutine={handleRoutineToggle}
              onRemoveItem={handleRoutineRemoval}
              disabled={!canEdit}
            />
            <RoutineComposer
              draft={routineDrafts.morning}
              onDraftChange={(field, value) => handleRoutineDraftChange("morning", field, value)}
              onSubmit={handleRoutineSubmit("morning")}
              buttonLabel="Ajouter à ma routine du matin"
              placeholderTitle="Ex : Boire un verre d'eau tiède citronnée"
              placeholderDetail="Ex : Durée, intention..."
              disabled={!canEdit}
            />
          </div>
        </section>
        ) : null}

        {!isMobileRoutineView || activeRoutinePeriod === "evening" ? (
        <section className="routine-note routine-note--evening">
          <div className="routine-note__top">
            {isMobileRoutineView ? routinePeriodToggle : null}
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
              toggleRoutine={handleRoutineToggle}
              onRemoveItem={handleRoutineRemoval}
              disabled={!canEdit}
            />
            <RoutineComposer
              draft={routineDrafts.evening}
              onDraftChange={(field, value) => handleRoutineDraftChange("evening", field, value)}
              onSubmit={handleRoutineSubmit("evening")}
              buttonLabel="Ajouter à ma routine du soir"
              placeholderTitle="Ex : Préparer mes vêtements pour demain"
              placeholderDetail="Ex : Durée, intention..."
              disabled={!canEdit}
            />
          </div>
        </section>
        ) : null}
      </div>
    </div>
  )
}

export default RoutinePage
