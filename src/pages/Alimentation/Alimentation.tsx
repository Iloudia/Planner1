import { useMemo } from "react"
import usePersistentState from "../../hooks/usePersistentState"
import PageHeading from "../../components/PageHeading"
import photo1 from "../../assets/planner-01.jpg"
import photo2 from "../../assets/planner-02.jpg"
import photo3 from "../../assets/planner-03.jpg"
import photo4 from "../../assets/planner-04.jpg"
import photo5 from "../../assets/planner-05.jpg"
import photo6 from "../../assets/planner-06.jpg"
import "./Alimentation.css"

const stripImages = [photo1, photo2, photo3, photo4, photo5, photo6]

const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const

type MealSlotId = "morning" | "midday" | "evening"

const mealSlots: { id: MealSlotId; label: string; hint: string }[] = [
  { id: "morning", label: "Matin", hint: "Petit dejeuner" },
  { id: "midday", label: "Midi", hint: "Dejeuner" },
  { id: "evening", label: "Soir", hint: "Diner" },
]

type WeeklyPlan = Record<typeof weekDays[number], Record<MealSlotId, string>>

type ShoppingItem = {
  id: string
  text: string
  done: boolean
}

const buildDefaultWeeklyPlan = (): WeeklyPlan => {
  const plan = {} as WeeklyPlan
  weekDays.forEach((day) => {
    plan[day] = {
      morning: "",
      midday: "",
      evening: "",
    }
  })
  return plan
}

function DietPage() {
  const [weeklyPlan, setWeeklyPlan] = usePersistentState<WeeklyPlan>("planner.diet.weeklyPlan", buildDefaultWeeklyPlan)
  const [shoppingNotes, setShoppingNotes] = usePersistentState<string>("planner.diet.groceriesNotes", "")

  const weekRangeLabel = useMemo(() => {
    const today = new Date()
    const dayIndex = today.getDay()
    const diffToMonday = (dayIndex + 6) % 7
    const monday = new Date(today)
    monday.setDate(today.getDate() - diffToMonday)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const format = (date: Date) =>
      date
        .toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
        .replace(".", "")
        .trim()
    return `Semaine du ${format(monday)} - ${format(sunday)}`
  }, [])

  const handleMealChange = (day: typeof weekDays[number], slot: MealSlotId, value: string) => {
    setWeeklyPlan((previous) => ({
      ...previous,
      [day]: { ...previous[day], [slot]: value },
    }))
  }

  return (
    <>
      <div className="diet-hero-photo" aria-hidden="true">
        <img src={stripImages[0]} alt="" />
      </div>
      <div className="page-accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Alimentation" title="Planifier ses repas avec douceur" />
      <main className="content-page diet-page">
        <section className="page-section diet-week">
          <header className="diet-week__header">
            <div>
              <h3>Planning des repas de la semaine</h3>
              <p>
                Ce planning a pour objectif d’organiser les repas de la semaine de manière simple et équilibrée. 
                <br />Il permet de gagner du temps, de mieux gérer les courses et de varier les menus tout en respectant les envies et les besoins de chacun.
              </p>
            </div>
            <p className="diet-week__range">{weekRangeLabel}</p>
          </header>
          <div className="diet-week__group">
            <div className="diet-week__grid">
              {weekDays.map((day) => (
                <article key={day} className="diet-week__card">
                  <div className="diet-week__card-head">
                    <span className="diet-week__day">{day}</span>
                  </div>
                  {mealSlots.map((slot) => (
                  <label key={slot.id} className="diet-week__slot">
                    <span>
                      {slot.label}
                    </span>
                    <input
                        type="text"
                        value={weeklyPlan[day][slot.id]}
                        placeholder={`Ton plat du ${slot.label.toLowerCase()}`}
                        onChange={(event) => handleMealChange(day, slot.id, event.target.value)}
                      />
                    </label>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section diet-shopping">
          <div className="diet-shopping__panel">
            <h3>Liste de courses</h3>
            <textarea
              className="diet-shopping__textarea"
              value={shoppingNotes}
              onChange={(event) => setShoppingNotes(event.target.value)}
              placeholder="Écris ta liste comme dans un carnet..."
            />
          </div>

          <div className="diet-ideas">
            <p className="diet-section__intro">Idées à garder sous la main</p>
            <div className="diet-ideas__tips">
              <article>
                <h4>Batch cooking</h4>
                <p>Sélectionne deux bases (quinoa, riz) et deux sources de protéines afin de les combiner facilement tout au long de la semaine.</p>
              </article>
              <article>
                <h4>Réutilise les restes</h4>
                <p>les légumes rôtis ou les sauces maison peuvent être utilisés sur plusieurs repas.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
       <div className="page-footer-bar" aria-hidden="true" />
    </>
  )
}

export default DietPage

