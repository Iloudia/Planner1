import { useMemo, useState } from "react"
import usePersistentState from "../../hooks/usePersistentState"
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
  const [shoppingItems, setShoppingItems] = usePersistentState<ShoppingItem[]>("planner.diet.groceries", [])
  const [shoppingInput, setShoppingInput] = useState("")

  const highlightedIngredients = useMemo(() => {
    const picks = new Set<string>()
    weekDays.forEach((day) => {
      const morning = weeklyPlan[day].morning.trim()
      const midday = weeklyPlan[day].midday.trim()
      const evening = weeklyPlan[day].evening.trim()
      if (morning) picks.add(morning)
      if (midday) picks.add(midday)
      if (evening) picks.add(evening)
    })
    return Array.from(picks).slice(0, 6)
  }, [weeklyPlan])

  const handleMealChange = (day: typeof weekDays[number], slot: MealSlotId, value: string) => {
    setWeeklyPlan((previous) => ({
      ...previous,
      [day]: { ...previous[day], [slot]: value },
    }))
  }

  const addShoppingItem = () => {
    const text = shoppingInput.trim()
    if (!text) return
    setShoppingItems((previous) => [{ id: `item-${Date.now()}`, text, done: false }, ...previous])
    setShoppingInput("")
  }

  const toggleShoppingItem = (id: string) => {
    setShoppingItems((previous) => previous.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  const removeShoppingItem = (id: string) => {
    setShoppingItems((previous) => previous.filter((item) => item.id !== id))
  }

  return (
    <>
      <div className="page-photo-strip" aria-hidden="true">
        {stripImages.map((src, index) => (
          <div key={index} className="page-photo-strip__item">
            <img src={src} alt={`Inspiration ${index + 1}`} />
          </div>
        ))}
      </div>
<div className="page-accent-bar" aria-hidden="true" />
      <main className="content-page diet-page">
        

        <section className="page-section diet-week">
          <header>
            <h3>Planning des repas de la semaine</h3>
            <p>
              Ajuste chaque creneau matin, midi et soir au fil des jours. Ton choix est enregistre automatiquement pour que tu retrouves
              tes idees a chaque visite.
            </p>
          </header>
          <div className="diet-week__grid">
            {weekDays.map((day) => (
              <article key={day} className="diet-week__card">
                <div className="diet-week__card-head">
                  <span className="diet-week__day">{day}</span>
                  <span className="diet-week__tag">Equilibre</span>
                </div>
                {mealSlots.map((slot) => (
                  <label key={slot.id} className="diet-week__slot">
                    <span>
                      {slot.label} <small>{slot.hint}</small>
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
        </section>

        <section className="page-section diet-shopping">
          <div className="diet-shopping__panel">
            <h3>Liste de courses</h3>
            <p>
              Note les ingredients a acheter pendant que tu reflechis a ton menu. Coche ce qui est deja dans ton panier ou supprime les
              elements termines.
            </p>
            <div className="diet-shopping__input">
              <input
                type="text"
                value={shoppingInput}
                placeholder="Ajouter un ingredient ou un produit"
                onChange={(event) => setShoppingInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    addShoppingItem()
                  }
                }}
              />
              <button type="button" onClick={addShoppingItem}>
                +
              </button>
            </div>
            <ul className="diet-shopping__list">
              {shoppingItems.length === 0 ? (
                <li className="diet-shopping__empty">Ta liste est vide. Ajoute ton premier produit ?</li>
              ) : (
                shoppingItems.map((item) => (
                  <li key={item.id} className={item.done ? "diet-shopping__item is-done" : "diet-shopping__item"}>
                    <label>
                      <input type="checkbox" checked={item.done} onChange={() => toggleShoppingItem(item.id)} />
                      <span>{item.text}</span>
                    </label>
                    <button type="button" onClick={() => removeShoppingItem(item.id)} aria-label="Supprimer l'element">
                      -
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="diet-ideas">
            <p className="diet-section__intro">Idees a garder sous la main</p>
            <ul className="diet-ideas__chips">
              {highlightedIngredients.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
            <div className="diet-ideas__tips">
              <article>
                <h4>Batch cooking</h4>
                <p>Choisis 2 bases (quinoa, riz) et 2 sources de proteines pour mixer toute la semaine.</p>
              </article>
              <article>
                <h4>Reutilise</h4>
                <p>Les legumes rotis ou les sauces maison peuvent servir sur plusieurs repas.</p>
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
