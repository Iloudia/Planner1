import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"
import usePersistentState from "../../hooks/usePersistentState"
import PageHeading from "../../components/PageHeading"
import photo1 from "../../assets/food.webp"
import photo2 from "../../assets/food2.webp"
import photo3 from "../../assets/bowl-mediteraneen.webp"
import photo4 from "../../assets/bowl-poulet.webp"
import photo5 from "../../assets/wrap-poulet.webp"
import photo6 from "../../assets/salade-de-fruit.webp"
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

type CuisineGoalId =
  | "equilibre"
  | "perte"
  | "masse"
  | "vegetarien"
  | "rapide"
  | "budget"
  | "familial"
  | "batch"

type CuisineGoal = {
  id: CuisineGoalId
  label: string
  description: string
}

const CUISINE_GOALS: CuisineGoal[] = [
  { id: "equilibre", label: "Équilibré", description: "Assiettes complètes et variées" },
  { id: "perte", label: "Léger", description: "Repas plus légers et rassasiants" },
  { id: "masse", label: "Riche en protéines", description: "Boost muscle et énergie" },
  { id: "vegetarien", label: "Végétarien", description: "Sans viande, riche en végétal" },
  { id: "rapide", label: "Rapide", description: "Prêt en 20 minutes" },
  { id: "budget", label: "Petit budget", description: "Ingrédients simples" },
  { id: "familial", label: "Familial", description: "Plats qui plaisent à tous" },
  { id: "batch", label: "Batch cooking", description: "Se prépare en avance" },
]

type MealIdea = {
  id: string
  name: string
  slot: MealSlotId
  goals: CuisineGoalId[]
}

const MEAL_IDEAS: MealIdea[] = [
  {
    id: "overnight-oats",
    name: "Overnight oats aux fruits rouges",
    slot: "morning",
    goals: ["equilibre", "rapide", "budget", "batch"],
  },
  {
    id: "eggs-toast",
    name: "Oeufs brouillés + toast complet",
    slot: "morning",
    goals: ["equilibre", "rapide", "masse"],
  },
  {
    id: "skyr-granola",
    name: "Skyr, granola maison, fruits",
    slot: "morning",
    goals: ["equilibre", "rapide", "masse"],
  },
  {
    id: "porridge-banane",
    name: "Porridge cannelle-banane",
    slot: "morning",
    goals: ["equilibre", "budget", "batch"],
  },
  {
    id: "smoothie-vert",
    name: "Smoothie bowl vert",
    slot: "morning",
    goals: ["equilibre", "perte", "vegetarien"],
  },
  {
    id: "tartines-avocat",
    name: "Tartines avocat citron",
    slot: "morning",
    goals: ["equilibre", "rapide", "vegetarien"],
  },
  {
    id: "fromage-blanc-fruits",
    name: "Fromage blanc + fruits frais",
    slot: "morning",
    goals: ["perte", "budget", "rapide"],
  },
  {
    id: "pancakes-proteines",
    name: "Pancakes protéinés",
    slot: "morning",
    goals: ["masse", "batch"],
  },
  {
    id: "chia-pudding",
    name: "Chia pudding mangue",
    slot: "morning",
    goals: ["equilibre", "vegetarien", "rapide", "batch"],
  },
  {
    id: "muffins-omelette",
    name: "Muffins d'omelette",
    slot: "morning",
    goals: ["rapide", "batch", "masse"],
  },
  {
    id: "salade-quinoa",
    name: "Salade quinoa, pois chiches, feta",
    slot: "midday",
    goals: ["equilibre", "vegetarien", "batch"],
  },
  {
    id: "bowl-poulet-legumes",
    name: "Bowl poulet + légumes rôtis",
    slot: "midday",
    goals: ["equilibre", "masse", "batch"],
  },
  {
    id: "wrap-thon",
    name: "Wrap thon, crudités, sauce yaourt",
    slot: "midday",
    goals: ["rapide", "budget", "equilibre"],
  },
  {
    id: "pates-legumes",
    name: "Pâtes complètes, pesto, légumes",
    slot: "midday",
    goals: ["budget", "familial", "vegetarien"],
  },
  {
    id: "soupe-lentilles",
    name: "Soupe de lentilles + pain complet",
    slot: "midday",
    goals: ["budget", "vegetarien", "perte"],
  },
  {
    id: "bowl-saumon",
    name: "Bowl saumon, riz, avocat",
    slot: "midday",
    goals: ["equilibre", "rapide"],
  },
  {
    id: "tofu-brocoli",
    name: "Poêlée tofu, brocoli, sésame",
    slot: "midday",
    goals: ["vegetarien", "equilibre", "rapide"],
  },
  {
    id: "sandwich-dinde",
    name: "Sandwich dinde + crudités",
    slot: "midday",
    goals: ["rapide", "budget"],
  },
  {
    id: "riz-cantonais",
    name: "Riz cantonais léger",
    slot: "midday",
    goals: ["familial", "budget", "batch"],
  },
  {
    id: "salade-grecque",
    name: "Salade grecque + pita",
    slot: "midday",
    goals: ["equilibre", "vegetarien", "rapide"],
  },
  {
    id: "chili-sin-carne",
    name: "Chili sin carne",
    slot: "evening",
    goals: ["vegetarien", "batch", "budget", "familial"],
  },
  {
    id: "saumon-four",
    name: "Saumon au four + légumes",
    slot: "evening",
    goals: ["equilibre", "perte"],
  },
  {
    id: "curry-pois-chiches",
    name: "Curry de pois chiches",
    slot: "evening",
    goals: ["vegetarien", "batch", "budget"],
  },
  {
    id: "wok-poulet",
    name: "Wok poulet, légumes croquants",
    slot: "evening",
    goals: ["masse", "rapide", "equilibre"],
  },
  {
    id: "gratin-legumes",
    name: "Gratin de légumes + quinoa",
    slot: "evening",
    goals: ["vegetarien", "familial", "equilibre"],
  },
  {
    id: "omelette-salade",
    name: "Omelette aux herbes + salade",
    slot: "evening",
    goals: ["rapide", "budget", "perte"],
  },
  {
    id: "buddha-bowl",
    name: "Buddha bowl tofu",
    slot: "evening",
    goals: ["vegetarien", "equilibre"],
  },
  {
    id: "tacos-maison",
    name: "Tacos maison au four",
    slot: "evening",
    goals: ["familial", "budget"],
  },
  {
    id: "soupe-miso",
    name: "Soupe miso + nouilles",
    slot: "evening",
    goals: ["rapide", "vegetarien", "perte"],
  },
  {
    id: "steak-patate-douce",
    name: "Steak haché + patate douce",
    slot: "evening",
    goals: ["masse", "familial", "budget"],
  },
]

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

const shuffle = <T,>(items: T[]) => {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
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
  const [cuisineGoals, setCuisineGoals] = usePersistentState<CuisineGoalId[]>("planner.diet.cuisineGoals", ["equilibre"])
  const [fillOnlyEmpty, setFillOnlyEmpty] = usePersistentState<boolean>("planner.diet.generator.fillOnlyEmpty", true)
  const [generatorStatus, setGeneratorStatus] = useState<string | null>(null)

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

  const pruneRecipeMappings = (changes: { day: typeof weekDays[number]; slot: MealSlotId }[]) => {
    if (changes.length === 0) return
    try {
      const stored = localStorage.getItem(weeklyRecipesKey)
      if (!stored) return
      const parsed = JSON.parse(stored) as Record<string, Record<MealSlotId, RecipeSnapshot>>
      const next = { ...parsed }
      let updated = false
      changes.forEach(({ day, slot }) => {
        if (next?.[day]?.[slot]) {
          const { [slot]: _removed, ...restSlots } = next[day]
          next[day] = restSlots
          updated = true
        }
      })
      if (updated) {
        localStorage.setItem(weeklyRecipesKey, JSON.stringify(next))
      }
    } catch {
      // ignore
    }
  }

  const toggleCuisineGoal = (goalId: CuisineGoalId) => {
    setCuisineGoals((previous) =>
      previous.includes(goalId) ? previous.filter((goal) => goal !== goalId) : [...previous, goalId],
    )
  }

  const previewIdeas = useMemo(() => {
    const selectedGoals = new Set(cuisineGoals)
    const filtered = MEAL_IDEAS.filter(
      (idea) => selectedGoals.size === 0 || idea.goals.some((goal) => selectedGoals.has(goal)),
    )
    const unique = Array.from(new Map(filtered.map((idea) => [idea.name, idea])).values())
    return shuffle(unique).slice(0, 5)
  }, [cuisineGoals])

  const generatePlan = () => {
    const selectedGoals = new Set(cuisineGoals)
    const getPoolForSlot = (slot: MealSlotId) => {
      const base = MEAL_IDEAS.filter((idea) => idea.slot === slot)
      if (selectedGoals.size === 0) return base
      const filtered = base.filter((idea) => idea.goals.some((goal) => selectedGoals.has(goal)))
      return filtered.length > 0 ? filtered : base
    }
    const slotQueues: Record<MealSlotId, MealIdea[]> = {
      morning: shuffle(getPoolForSlot("morning")),
      midday: shuffle(getPoolForSlot("midday")),
      evening: shuffle(getPoolForSlot("evening")),
    }
    const nextPlan: WeeklyPlan = { ...weeklyPlan }
    const changes: { day: typeof weekDays[number]; slot: MealSlotId }[] = []

    const takeIdea = (slot: MealSlotId) => {
      if (slotQueues[slot].length === 0) {
        slotQueues[slot] = shuffle(getPoolForSlot(slot))
      }
      return slotQueues[slot].shift()?.name ?? ""
    }

    weekDays.forEach((day) => {
      const dayPlan = { ...nextPlan[day] }
      mealSlots.forEach((slot) => {
        const currentValue = dayPlan[slot.id] ?? ""
        if (fillOnlyEmpty && currentValue.trim()) return
        const suggestion = takeIdea(slot.id)
        if (!suggestion) return
        if (currentValue !== suggestion) {
          changes.push({ day, slot: slot.id })
        }
        dayPlan[slot.id] = suggestion
      })
      nextPlan[day] = dayPlan
    })

    setWeeklyPlan(nextPlan)
    pruneRecipeMappings(changes)

    const goalLabels =
      cuisineGoals.length === 0
        ? "Plan libre"
        : cuisineGoals.map((goalId) => CUISINE_GOALS.find((goal) => goal.id === goalId)?.label ?? goalId).join(", ")
    setGeneratorStatus(`Plan généré · ${goalLabels}`)
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
        <section className="page-section diet-generator">
          <header className="diet-generator__header">
            <div>
              <h3>Générateur de plan repas</h3>
              <p>Choisis tes objectifs cuisine et génère une semaine équilibrée selon tes préférences.</p>
            </div>
            <div className="diet-generator__actions">
              <button type="button" className="diet-generator__primary" onClick={generatePlan}>
                Générer mon plan
              </button>
              {generatorStatus ? <span className="diet-generator__status">{generatorStatus}</span> : null}
            </div>
          </header>
          <div className="diet-generator__grid">
            <div className="diet-generator__panel">
              <p className="diet-generator__label">Objectifs cuisine</p>
              <div className="diet-generator__chips">
                {CUISINE_GOALS.map((goal) => {
                  const isActive = cuisineGoals.includes(goal.id)
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      className={`diet-goal-chip${isActive ? " is-active" : ""}`}
                      onClick={() => toggleCuisineGoal(goal.id)}
                      aria-pressed={isActive}
                    >
                      <span>{goal.label}</span>
                      <small>{goal.description}</small>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="diet-generator__panel">
              <p className="diet-generator__label">Paramètres</p>
              <label className="diet-generator__toggle">
                <input
                  type="checkbox"
                  checked={fillOnlyEmpty}
                  onChange={(event) => setFillOnlyEmpty(event.target.checked)}
                />
                Remplir uniquement les cases vides
              </label>
              <div className="diet-generator__preview">
                <p className="diet-generator__label">Exemples d'idées</p>
                <div className="diet-generator__ideas">
                  {previewIdeas.map((idea) => (
                    <span key={idea.id}>{idea.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
                <img src={selectedRecipe.image} alt={selectedRecipe.title} loading="lazy" decoding="async" />
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
                    <span>{selectedRecipe.flavor === "sucre" ? "Sucré" : "Salé"}</span>
                    <span>{selectedRecipe.prepTime}</span>
                    <span>{selectedRecipe.servings}</span>
                  </div>
                </header>
                <section>
                  <h4>Ingrédients</h4>
                  <ul>
                    {selectedRecipe.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h4>Étapes</h4>
                  <ol>
                    {selectedRecipe.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>
                {selectedRecipe.toppings ? (
                  <section>
                    <h4>Idées de toppings</h4>
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




