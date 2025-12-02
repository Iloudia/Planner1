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
  { id: "morning", label: "Matin", hint: "Petit-déjeuner" },
  { id: "midday", label: "Midi", hint: "Déjeuner" },
  { id: "evening", label: "Soir", hint: "Dîner" },
]

const mealOptions: Record<MealSlotId, string[]> = {
  morning: [
    "Smoothie bowl energy",
    "Overnight oats fruits rouges",
    "Avocado toast + œufs",
    "Pancakes banane & yaourt",
    "Porridge coco & mangue",
    "Granola maison + lait végétal",
    "Chia pudding pistache",
  ],
  midday: [
    "Buddha bowl quinoa",
    "Poulet rôti + légumes verts",
    "Wrap veggie houmous",
    "Salade tahini saumon",
    "Pâtes complètes pesto",
    "Riz basmati tofu croustillant",
    "Soupe miso + gyozas",
  ],
  evening: [
    "Curry coco pois chiches",
    "Poisson blanc + patate douce",
    "Galettes de lentilles",
    "Wok légumes croquants",
    "Frittata méditerranéenne",
    "Tacos de laitue",
    "Risotto champignons",
  ],
}

type WeeklyPlan = Record<typeof weekDays[number], Record<MealSlotId, string>>

type ShoppingItem = {
  id: string
  text: string
  done: boolean
}

const buildDefaultWeeklyPlan = (): WeeklyPlan => {
  const plan = {} as WeeklyPlan
  weekDays.forEach((day, index) => {
    plan[day] = {
      morning: mealOptions.morning[index % mealOptions.morning.length],
      midday: mealOptions.midday[index % mealOptions.midday.length],
      evening: mealOptions.evening[index % mealOptions.evening.length],
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
      picks.add(weeklyPlan[day].morning)
      picks.add(weeklyPlan[day].midday)
      picks.add(weeklyPlan[day].evening)
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

      <main className="content-page diet-page">
        <div className="page-accent-bar" aria-hidden="true" />

        <section className="page-section diet-week">
          <header>
            <h3>Planning des repas de la semaine</h3>
            <p>
              Ajuste chaque créneau matin, midi et soir au fil des jours. Ton choix est enregistré automatiquement pour que tu
              retrouves tes idées à chaque visite.
            </p>
          </header>
          <div className="diet-week__grid">
            {weekDays.map((day) => (
              <article key={day} className="diet-week__card">
                <div className="diet-week__card-head">
                  <span className="diet-week__day">{day}</span>
                  <span className="diet-week__tag">Équilibré</span>
                </div>
                {mealSlots.map((slot) => (
                  <label key={slot.id} className="diet-week__slot">
                    <span>
                      {slot.label} <small>{slot.hint}</small>
                    </span>
                    <select value={weeklyPlan[day][slot.id]} onChange={(event) => handleMealChange(day, slot.id, event.target.value)}>
                      {mealOptions[slot.id].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className="page-section diet-shopping">
          <div className="diet-shopping__panel">
            <h3>Liste de courses intelligente</h3>
            <p>
              Note les ingrédients à acheter pendant que tu réfléchis à ton menu. Coche ce qui est déjà dans ton panier ou supprime
              les éléments terminés.
            </p>
            <div className="diet-shopping__input">
              <input
                type="text"
                value={shoppingInput}
                placeholder="Ajouter un ingrédient ou un produit"
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
                    <button type="button" onClick={() => removeShoppingItem(item.id)} aria-label="Supprimer l'élément">
                      ×
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="diet-ideas">
            <p className="diet-section__intro">Idées à garder sous la main</p>
            <ul className="diet-ideas__chips">
              {highlightedIngredients.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
            <div className="diet-ideas__tips">
              <article>
                <h4>Batch cooking</h4>
                <p>Choisis 2 bases (quinoa, riz) et 2 sources de protéines pour mixer toute la semaine.</p>
              </article>
              <article>
                <h4>Réutilise</h4>
                <p>Les légumes rôtis ou les sauces maison peuvent servir sur plusieurs repas.</p>
              </article>
            </div>
          </div>
        </section>

        <div className="page-footer-bar" aria-hidden="true" />
      </main>
    </>
  )
}

export default DietPage
