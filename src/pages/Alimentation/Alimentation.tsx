import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"
import usePersistentState from "../../hooks/usePersistentState"
import PageHeading from "../../components/PageHeading"
import photo1 from "../../assets/food.jpeg"
import photo2 from "../../assets/food2.jpeg"
import photo3 from "../../assets/bowl-mediteraneen.jpg"
import photo4 from "../../assets/bowl-poulet.jpeg"
import photo5 from "../../assets/wrap-poulet.jpg"
import photo6 from "../../assets/salade-de-fruit.jpeg"
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

const DIET_WEEKLY_PLAN_RECIPES_KEY = "planner.diet.weeklyPlanRecipes"

type RecipeSnapshot = {
  id: string
  title: string
  flavor: "sucre" | "sale"
  prepTime: string
  servings: string
  image: string
  ingredients: string[]
  steps: string[]
  toppings?: string[]
  tips?: string[]
}

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
  const { userEmail } = useAuth()
  useEffect(() => {
    document.body.classList.add("alimentation-page--lux")
    return () => {
      document.body.classList.remove("alimentation-page--lux")
    }
  }, [])
  const weeklyRecipesKey = useMemo(() => buildUserScopedKey(userEmail, DIET_WEEKLY_PLAN_RECIPES_KEY), [userEmail])
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeSnapshot | null>(null)
  const [selectedRecipeSlot, setSelectedRecipeSlot] = useState<{ day: typeof weekDays[number]; slot: MealSlotId } | null>(
    null,
  )
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
    setWeeklyPlan((previous) => {
      const previousValue = previous[day]?.[slot] ?? ""
      if (previousValue !== value) {
        try {
          const stored = localStorage.getItem(weeklyRecipesKey)
          if (stored) {
            const parsed = JSON.parse(stored) as Record<string, Record<MealSlotId, RecipeSnapshot>>
            if (parsed?.[day]?.[slot]) {
              const { [slot]: _removed, ...restSlots } = parsed[day]
              const next = { ...parsed, [day]: restSlots }
              localStorage.setItem(weeklyRecipesKey, JSON.stringify(next))
            }
          }
        } catch {
          // ignore
        }
      }
      return {
        ...previous,
        [day]: { ...previous[day], [slot]: value },
      }
    })
  }

  const getRecipeForSlot = (day: typeof weekDays[number], slot: MealSlotId) => {
    try {
      const stored = localStorage.getItem(weeklyRecipesKey)
      if (!stored) return null
      const parsed = JSON.parse(stored) as Record<string, Record<MealSlotId, RecipeSnapshot>>
      return parsed?.[day]?.[slot] ?? null
    } catch {
      return null
    }
  }

  const removeRecipeFromPlan = (day: typeof weekDays[number], slot: MealSlotId) => {
    setWeeklyPlan((previous) => ({
      ...previous,
      [day]: { ...previous[day], [slot]: "" },
    }))
    try {
      const stored = localStorage.getItem(weeklyRecipesKey)
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, Record<MealSlotId, RecipeSnapshot>>
        if (parsed?.[day]?.[slot]) {
          const { [slot]: _removed, ...restSlots } = parsed[day]
          const next = { ...parsed, [day]: restSlots }
          localStorage.setItem(weeklyRecipesKey, JSON.stringify(next))
        }
      }
    } catch {
      // ignore
    }
    setSelectedRecipe(null)
    setSelectedRecipeSlot(null)
  }

  return (
    <>
      <PageHeading eyebrow="Alimentation" title="Cuisine" />
        <section className="page-section diet-crosslink">
          <div>
            <p className="diet-crosslink__label">Besoin d'idées ?</p>
            <p className="diet-crosslink__text">
              Va sur la page Diet pour découvrir des recettes et les utiliser dans ton planning.
            </p>
          </div>
          <Link to="/diet" className="pill pill--diet">
            Voir les recettes
          </Link>
        </section>
        <section className="page-section diet-week">
          <header className="diet-week__header">
            <div>
              <h3>Planning des repas de la semaine</h3>
              
            </div>
            <p className="diet-week__range">{weekRangeLabel}</p>
          </header>
          <div className="diet-week__grid">
            {weekDays.map((day) => (
              <article key={day} className="diet-week__card">
                <div className="diet-week__card-head">
                  <span className="diet-week__day">{day}</span>
                </div>
                {mealSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`diet-week__slot${getRecipeForSlot(day, slot.id) ? " has-recipe" : ""}`}
                >
                  <span>
                    {slot.label}
                    {getRecipeForSlot(day, slot.id) ? (
                      <button
                        type="button"
                        className="diet-week__recipe-badge"
                        onClick={() => {
                          setSelectedRecipe(getRecipeForSlot(day, slot.id))
                          setSelectedRecipeSlot({ day, slot: slot.id })
                        }}
                      >
                        Voir recette
                      </button>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    value={weeklyPlan[day][slot.id]}
                    placeholder={`Ton plat du ${slot.label.toLowerCase()}`}
                    onChange={(event) => handleMealChange(day, slot.id, event.target.value)}
                  />
                </div>
                ))}
              </article>
            ))}
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
        {selectedRecipe ? (
          <div className="diet-plan-modal" role="dialog" aria-label={`Recette ${selectedRecipe.title}`}>
            <div
              className="diet-plan-modal__backdrop"
              onClick={() => {
                setSelectedRecipe(null)
                setSelectedRecipeSlot(null)
              }}
            />
            <div className="diet-plan-modal__panel">
              <div className="diet-plan-modal__cover">
                <img src={selectedRecipe.image} alt={selectedRecipe.title} />
                <button
                  type="button"
                  className="diet-recipe-close-icon diet-recipe-close-icon--cover"
                  onClick={() => {
                    setSelectedRecipe(null)
                    setSelectedRecipeSlot(null)
                  }}
                  aria-label="Fermer"
                >
                  <span aria-hidden="true" />
                </button>
              </div>
              <div className="diet-plan-modal__content">
                <header>
                  <h3>{selectedRecipe.title}</h3>
                  <div className="diet-plan-modal__meta">
                    <span>{selectedRecipe.flavor === "sucre" ? "Sucr�" : "Sal�"}</span>
                    <span>{selectedRecipe.prepTime}</span>
                    <span>{selectedRecipe.servings}</span>
                  </div>
                </header>
                <section>
                  <h4>Ingr�dients</h4>
                  <ul>
                    {selectedRecipe.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h4>�tapes</h4>
                  <ol>
                    {selectedRecipe.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>
                {selectedRecipe.toppings ? (
                  <section>
                    <h4>Id�es de toppings</h4>
                    <ul>
                      {selectedRecipe.toppings.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                {selectedRecipe.tips ? (
                  <section>
                    <h4>Astuce</h4>
                    <ul>
                      {selectedRecipe.tips.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>
              <footer className="diet-recipe-modal__actions">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedRecipeSlot) return
                    removeRecipeFromPlan(selectedRecipeSlot.day, selectedRecipeSlot.slot)
                  }}
                >
                  Supprimer la recette du planning
                </button>
              </footer>
            </div>
          </div>
        ) : null}
    </>
  )
}

export default DietPage




