import { useEffect } from "react"
import usePersistentState from "../../hooks/usePersistentState"
import "../../components/DailyGoalsTracker.css"
import "./Manifestation.css"

const manifestationFields = [
  { id: "manifestation", label: "Ce que je manifeste" },
  { id: "importance", label: "Pourquoi c’est important pour moi ?" },
  { id: "gratitude", label: "Je suis déjà reconnaissante pour" },
  { id: "affirmation", label: "Affirmation que j’utilise" },
  { id: "visualisation", label: "Visualisation" },
  { id: "action", label: "Action que je vais faire pour m’approcher de ma manifestation" },
] as const

type ManifestationFieldId = (typeof manifestationFields)[number]["id"]
type ManifestationDraft = Record<ManifestationFieldId, string>

const emptyDraft: ManifestationDraft = {
  manifestation: "",
  importance: "",
  gratitude: "",
  affirmation: "",
  visualisation: "",
  action: "",
}

const trackerDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const trackerRows = ["Affirmations", "Visualisation", "Actions", "Gratitude"]
const createEmptyTracker = () => trackerRows.map(() => trackerDays.map(() => false))

const ManifestationPage = () => {
  const [draft, setDraft] = usePersistentState<ManifestationDraft>("planner.manifestation.draft.v1", emptyDraft)
  const [tracker, setTracker] = usePersistentState<boolean[][]>("planner.manifestation.tracker.v1", createEmptyTracker)

  useEffect(() => {
    document.body.classList.add("manifestation-page--lux")
    return () => document.body.classList.remove("manifestation-page--lux")
  }, [])

  const updateField = (field: ManifestationFieldId, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const toggleTrackerCell = (rowIndex: number, dayIndex: number) => {
    setTracker((current) => {
      const next = current.map((row) => [...row])
      const row = next[rowIndex] ?? trackerDays.map(() => false)
      row[dayIndex] = !row[dayIndex]
      next[rowIndex] = row
      return next
    })
  }

  return (
    <div className="manifestation-page">
      <header className="manifestation-page__heading">
        <div>
          <span className="manifestation-page__heading-eyebrow">Ma</span>
          <h1>Manifestation</h1>
        </div>
        <p>Un espace pour clarifier tes intentions, nourrir ta vision et avancer chaque jour vers ce que tu souhaites créer.</p>
      </header>

      <section className="manifestation-tracker" aria-labelledby="manifestation-tracker-title">
        <div className="sport-habits__table-wrapper">
          <div className="sport-habits__header">
            <div className="sport-habits__header-content">
              <h2 id="manifestation-tracker-title">Tracker de manifestation</h2>
              <h4>Coche chaque pratique réalisée au fil de la semaine.</h4>
            </div>
          </div>

          <div className="sport-habits__table" role="table" aria-label="Tracker hebdomadaire de manifestation">
            <div className="sport-habits__row sport-habits__row--head" role="row">
              <div className="sport-habits__cell sport-habits__cell--head" role="columnheader">Pratique</div>
              {trackerDays.map((day) => (
                <div className="sport-habits__cell sport-habits__cell--head" role="columnheader" key={day}>{day}</div>
              ))}
              <div className="sport-habits__cell sport-habits__cell--head" role="columnheader">Total</div>
            </div>

            {trackerRows.map((rowLabel, rowIndex) => (
              <div className="sport-habits__row" role="row" key={rowLabel}>
                <div className="sport-habits__cell sport-habits__cell--label" role="rowheader">{rowLabel}</div>
                {trackerDays.map((day, dayIndex) => (
                  <label
                    className="sport-habits__cell sport-habits__cell--checkbox"
                    role="cell"
                    aria-label={`${rowLabel} ${day}`}
                    key={`${rowLabel}-${day}`}
                  >
                    <input
                      type="checkbox"
                      checked={tracker[rowIndex]?.[dayIndex] ?? false}
                      onChange={() => toggleTrackerCell(rowIndex, dayIndex)}
                    />
                  </label>
                ))}
                <div className="sport-habits__cell sport-habits__cell--total" role="cell">
                  {(tracker[rowIndex] ?? []).filter(Boolean).length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="manifestation-journal" aria-labelledby="manifestation-journal-title">
        <header className="manifestation-section-heading">
          <h2 id="manifestation-journal-title">Mon espace de manifestation</h2>
        </header>
        <div className="manifestation-journal__grid">
          {manifestationFields.map((field) => (
            <label className="manifestation-journal__card" key={field.id}>
              <span>{field.label}</span>
              <textarea
                value={draft[field.id]}
                onChange={(event) => updateField(field.id, event.target.value)}
                aria-label={field.label}
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ManifestationPage
