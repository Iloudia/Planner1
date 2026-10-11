import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import type { TouchEvent } from "react"
import { useAuth } from "../../context/AuthContext"
import ModalCloseButton from "../../components/ModalCloseButton"
import PageLoader from "../../components/PageLoader"
import useUserDietData from "../../hooks/useUserDietData"
import { getWeekKey } from "../../utils/weekKey"
import { builtinDietRecipes } from "../Diet/DietPage"
import photo1 from "../../assets/food.webp"
import photo2 from "../../assets/food2.webp"
import photo3 from "../../assets/bowl-mediteraneen.webp"
import photo4 from "../../assets/bowl-poulet.webp"
import photo5 from "../../assets/wrap-poulet.webp"
import photo6 from "../../assets/salade-de-fruit.webp"
import "./Alimentation.css"

const stripImages = [photo1, photo2, photo3, photo4, photo5, photo6]
const SWIPE_THRESHOLD = 42
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

const getNextMondayMidnight = (reference: Date) => {
  const next = new Date(reference)
  next.setHours(0, 0, 0, 0)
  const day = next.getDay()
  const daysUntilNextMonday = day === 0 ? 1 : 8 - day
  next.setDate(next.getDate() + daysUntilNextMonday)
  return next
}

const normalizeMealTitle = (value: string) => value.trim().toLowerCase()

const getPreviousWeekKey = (currentWeekKey: string) => {
  const currentMonday = new Date(`${currentWeekKey}T12:00:00`)
  currentMonday.setDate(currentMonday.getDate() - 7)
  return getWeekKey(currentMonday)
}

const formatWeekPeriod = (startDate: string) => {
  const monday = new Date(`${startDate}T12:00:00`)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const format = (date: Date) => date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
  return `${format(monday)} au ${format(sunday)}`
}

function DietPage() {
  const navigate = useNavigate()
  const { isAuthReady, userId } = useAuth()
  const [weekKey, setWeekKey] = useState(() => getWeekKey())
  const [isMobileWeekCarousel, setIsMobileWeekCarousel] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches,
  )
  const [activeWeekCardIndex, setActiveWeekCardIndex] = useState(0)
  const {
    weekPlan,
    customRecipes,
    isLoading,
    error,
    updateMeal,
    saveShoppingNotes,
    duplicateWeekPlan,
  } = useUserDietData(weekKey)
  const weekCarouselTouchStartXRef = useRef<number | null>(null)
  const weekCarouselTouchDeltaXRef = useRef(0)
  const canEdit = Boolean(userId)
  const isAlimentationLoading = !isAuthReady || isLoading
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [isDuplicatingWeek, setIsDuplicatingWeek] = useState(false)
  const [duplicateFeedback, setDuplicateFeedback] = useState<{
    tone: "success" | "warning" | "error"
    message: string
  } | null>(null)
  useEffect(() => {
    document.body.classList.add("alimentation-page--lux")
    return () => {
      document.body.classList.remove("alimentation-page--lux")
    }
  }, [])

  useEffect(() => {
    if (!isDuplicateDialogOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDuplicatingWeek) {
        setIsDuplicateDialogOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isDuplicateDialogOpen, isDuplicatingWeek])

  useEffect(() => {
    if (!duplicateFeedback) return
    const timeoutId = window.setTimeout(() => setDuplicateFeedback(null), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [duplicateFeedback])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    let timeoutId: number | null = null

    const scheduleWeeklyRollover = () => {
      const now = new Date()
      const nextMondayMidnight = getNextMondayMidnight(now)
      const delay = Math.max(1000, nextMondayMidnight.getTime() - now.getTime())

      timeoutId = window.setTimeout(() => {
        setWeekKey(getWeekKey())
        scheduleWeeklyRollover()
      }, delay)
    }

    scheduleWeeklyRollover()

    const syncOnVisibilityChange = () => {
      setWeekKey(getWeekKey())
    }

    window.addEventListener("visibilitychange", syncOnVisibilityChange)
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      window.removeEventListener("visibilitychange", syncOnVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(max-width: 768px)")
    const syncViewport = () => {
      setIsMobileWeekCarousel(mediaQuery.matches)
    }

    syncViewport()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport)
      return () => mediaQuery.removeEventListener("change", syncViewport)
    }

    mediaQuery.addListener(syncViewport)
    return () => mediaQuery.removeListener(syncViewport)
  }, [])

  const weeklyPlan = weekPlan.meals as WeeklyPlan
  const shoppingNotes = weekPlan.shoppingNotes
  const hasMultipleWeekCards = weekDays.length > 1
  const previousWeekKey = useMemo(() => getPreviousWeekKey(weekKey), [weekKey])
  const previousWeekPeriod = useMemo(() => formatWeekPeriod(previousWeekKey), [previousWeekKey])
  const hasCurrentMeals = useMemo(
    () => weekDays.some((day) => mealSlots.some((slot) => weeklyPlan[day][slot.id].trim())),
    [weeklyPlan],
  )

  const recipeLookup = useMemo(() => {
    const map = new Map<string, RecipeSnapshot>()
    builtinDietRecipes.forEach((recipe) => {
      map.set(`builtin:${recipe.id}`, {
        id: recipe.id,
        title: recipe.title,
        flavor: recipe.flavor,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        image: recipe.image,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        toppings: recipe.toppings,
        tips: recipe.tips,
      })
    })
    customRecipes.forEach((recipe) => {
      map.set(`custom:${recipe.id}`, {
        id: recipe.id,
        title: recipe.title,
        flavor: recipe.flavor,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        image: recipe.imageUrl || photo5,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        toppings: recipe.toppings,
        tips: recipe.tips,
      })
    })
    return map
  }, [customRecipes])

  const recipeLookupByTitle = useMemo(() => {
    const map = new Map<string, RecipeSnapshot>()
    const duplicateTitles = new Set<string>()

    recipeLookup.forEach((recipe) => {
      const normalizedTitle = normalizeMealTitle(recipe.title)
      if (!normalizedTitle) {
        return
      }
      if (map.has(normalizedTitle)) {
        duplicateTitles.add(normalizedTitle)
        return
      }
      map.set(normalizedTitle, recipe)
    })

    duplicateTitles.forEach((title) => {
      map.delete(title)
    })

    return map
  }, [recipeLookup])

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

  const handleMealChange = async (day: typeof weekDays[number], slot: MealSlotId, value: string) => {
    if (!canEdit) return
    await updateMeal(day, slot, value)
  }

  const handleDuplicatePreviousWeek = async () => {
    if (!canEdit || isDuplicatingWeek) return
    setIsDuplicatingWeek(true)
    setDuplicateFeedback(null)
    try {
      const result = await duplicateWeekPlan(previousWeekKey)
      setIsDuplicateDialogOpen(false)
      if (result === "empty") {
        setDuplicateFeedback({
          tone: "warning",
          message: "Aucun repas enregistré dans le planning de la semaine précédente.",
        })
        return
      }
      setDuplicateFeedback({
        tone: "success",
        message: "Le planning de la semaine précédente a bien été dupliqué.",
      })
    } catch {
      setDuplicateFeedback({
        tone: "error",
        message: "La duplication n’a pas pu être effectuée. Réessaie dans quelques instants.",
      })
    } finally {
      setIsDuplicatingWeek(false)
    }
  }

  const getRecipeForSlot = (day: typeof weekDays[number], slot: MealSlotId) => {
    const ref = weekPlan.recipeRefs[day]?.[slot]
    if (ref) {
      const recipeFromRef = recipeLookup.get(`${ref.source}:${ref.recipeId}`)
      if (recipeFromRef) {
        return recipeFromRef
      }
    }

    const mealName = weeklyPlan[day]?.[slot] ?? ""
    if (!mealName.trim()) {
      return null
    }

    return recipeLookupByTitle.get(normalizeMealTitle(mealName)) ?? null
  }

  const setWeekCardSlide = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + weekDays.length) % weekDays.length
    setActiveWeekCardIndex(normalizedIndex)
  }

  const showPreviousWeekCard = () => {
    setWeekCardSlide(activeWeekCardIndex - 1)
  }

  const showNextWeekCard = () => {
    setWeekCardSlide(activeWeekCardIndex + 1)
  }

  const handleWeekCarouselTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleWeekCards) return
    weekCarouselTouchStartXRef.current = event.touches[0]?.clientX ?? null
    weekCarouselTouchDeltaXRef.current = 0
  }

  const handleWeekCarouselTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (weekCarouselTouchStartXRef.current === null) return
    weekCarouselTouchDeltaXRef.current = (event.touches[0]?.clientX ?? 0) - weekCarouselTouchStartXRef.current
  }

  const handleWeekCarouselTouchEnd = () => {
    if (weekCarouselTouchStartXRef.current === null) return
    if (weekCarouselTouchDeltaXRef.current <= -SWIPE_THRESHOLD) {
      showNextWeekCard()
    } else if (weekCarouselTouchDeltaXRef.current >= SWIPE_THRESHOLD) {
      showPreviousWeekCard()
    }
    weekCarouselTouchStartXRef.current = null
    weekCarouselTouchDeltaXRef.current = 0
  }

  const renderWeekCard = (day: typeof weekDays[number]) => (
    <article key={day} className="diet-week__card">
      <div className="diet-week__card-head">
        <span className="diet-week__day">{day}</span>
      </div>
      {mealSlots.map((slot) => {
        const slotRecipe = getRecipeForSlot(day, slot.id)
        return (
          <div
            key={slot.id}
            className={`diet-week__slot${slotRecipe ? " has-recipe" : ""}`}
          >
            <span>
              {slot.label}
              {slotRecipe ? (
                <button
                  type="button"
                  className="diet-week__recipe-badge"
                  onClick={() =>
                    navigate("/diet", {
                      state: {
                        openRecipeId: slotRecipe.id,
                        openRecipeSource: slotRecipe.source,
                        planDay: day,
                        planSlot: slot.id,
                      },
                    })
                  }
                >
                  Voir la recette
                </button>
              ) : null}
            </span>
            <input
              type="text"
              value={weeklyPlan[day][slot.id]}
              placeholder={`Ton plat du ${slot.label.toLowerCase()}`}
              onChange={(event) => void handleMealChange(day, slot.id, event.target.value)}
              disabled={!canEdit}
            />
          </div>
        )
      })}
    </article>
  )

  const menuHeading = (
    <header className="diet-page__heading">
      <div>
        <span className="diet-page__heading-eyebrow">Mon</span>
        <h1>Menu de la semaine</h1>
      </div>
      <p>Un espace pour planifier tes repas, nourrir ton énergie et simplifier ton quotidien.</p>
    </header>
  )

  if (isAlimentationLoading) {
    return (
      <>
        {menuHeading}
        <PageLoader />
      </>
    )
  }

  return (
    <>
      {menuHeading}
      {!canEdit ? <p className="routine-note__composer-hint">Connecte-toi pour enregistrer ton espace alimentation.</p> : null}
      {error ? <p className="routine-note__composer-hint">{error}</p> : null}
        <section className="page-section diet-crosslink">
          <div>
            <h2 className="diet-crosslink__label">Besoin d'idées ?</h2>
            <h4 className="diet-crosslink__text">
              Va sur la page Diet pour découvrir des recettes et les utiliser dans ton planning.
            </h4>
          </div>
          <Link to="/diet" className="pill pill--diet">
            Voir les recettes
          </Link>
        </section>
        <section className="page-section diet-week">
          <header className="diet-week__header">
            <div>
              <h2>Planning des repas de la semaine</h2>
              
            </div>
            <div className="diet-week__header-actions">
              <p className="diet-week__range">{weekRangeLabel}</p>
              <button
                type="button"
                className="diet-week__duplicate-button"
                onClick={() => setIsDuplicateDialogOpen(true)}
                disabled={!canEdit || isDuplicatingWeek}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="8" y="8" width="11" height="11" rx="1" />
                  <path d="M16 8V5H5v11h3" />
                </svg>
                Dupliquer la semaine précédente
              </button>
            </div>
          </header>
          {duplicateFeedback ? (
            <p
              className={`diet-week__duplicate-feedback is-${duplicateFeedback.tone}`}
              role="status"
              aria-live="polite"
            >
              {duplicateFeedback.message}
            </p>
          ) : null}
          {isMobileWeekCarousel ? (
            <>
              <div className="diet-week__carousel">
                <button
                  type="button"
                  className="diet-week__nav diet-week__nav--prev"
                  onClick={showPreviousWeekCard}
                  aria-label="Voir le jour precedent"
                  disabled={!hasMultipleWeekCards}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14 6 8 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div
                  className="diet-week__carousel-grid"
                  onTouchStart={handleWeekCarouselTouchStart}
                  onTouchMove={handleWeekCarouselTouchMove}
                  onTouchEnd={handleWeekCarouselTouchEnd}
                  onTouchCancel={handleWeekCarouselTouchEnd}
                >
                  <div
                    className="diet-week__carousel-track"
                    style={{ transform: `translateX(-${activeWeekCardIndex * 100}%)` }}
                  >
                    {weekDays.map((day, index) => (
                      <div key={day} className="diet-week__carousel-slide" aria-hidden={index !== activeWeekCardIndex}>
                        {renderWeekCard(day)}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="diet-week__nav diet-week__nav--next"
                  onClick={showNextWeekCard}
                  aria-label="Voir le jour suivant"
                  disabled={!hasMultipleWeekCards}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="diet-week__dots" aria-label="Position dans le carousel des repas">
                {weekDays.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    className={`diet-week__dot${index === activeWeekCardIndex ? " is-active" : ""}`}
                    aria-label={`Afficher ${day}`}
                    aria-pressed={index === activeWeekCardIndex}
                    onClick={() => setWeekCardSlide(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="diet-week__grid">
              {weekDays.map((day) => renderWeekCard(day))}
            </div>
          )}
        </section>

        <section className="page-section diet-shopping">
          <div className="diet-shopping__panel">
            <h2>Liste de courses</h2>
            <textarea
              className="diet-shopping__textarea"
              value={shoppingNotes}
              onChange={(event) => void saveShoppingNotes(event.target.value)}
              disabled={!canEdit}
              placeholder="Ex : Carottes rapées..."
            />
          </div>

          <div className="diet-ideas">
            <h2 className="diet-section__intro">Idées à garder sous la main</h2>
            <div className="diet-ideas__tips">
              <article>
                <h3>Batch cooking</h3>
                <p>Sélectionne deux bases (quinoa, riz) et deux sources de protéines afin de les combiner facilement tout au long de la semaine.</p>
              </article>
              <article>
                <h3>Réutilise les restes</h3>
                <p>les légumes rôtis ou les sauces maison peuvent être utilisés sur plusieurs repas.</p>
              </article>
            </div>
          </div>
        </section>

        {isDuplicateDialogOpen ? (
          <div className="diet-week-duplicate" role="presentation">
            <div
              className="diet-week-duplicate__backdrop"
              onClick={() => {
                if (!isDuplicatingWeek) setIsDuplicateDialogOpen(false)
              }}
            />
            <section
              className="diet-week-duplicate__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="diet-week-duplicate-title"
            >
              <ModalCloseButton
                onClick={() => {
                  if (!isDuplicatingWeek) setIsDuplicateDialogOpen(false)
                }}
                ariaLabel="Fermer la confirmation"
              />
              <span className="diet-week-duplicate__eyebrow">Planning hebdomadaire</span>
              <h2 id="diet-week-duplicate-title">Dupliquer la semaine précédente&nbsp;?</h2>
              <p>
                Les repas du <strong>{previousWeekPeriod}</strong> seront copiés dans le planning de cette semaine.
                {hasCurrentMeals ? " Les repas déjà saisis seront remplacés." : ""} La liste de courses restera inchangée.
              </p>
              <div className="diet-week-duplicate__actions">
                <button
                  type="button"
                  className="diet-week-duplicate__cancel"
                  onClick={() => setIsDuplicateDialogOpen(false)}
                  disabled={isDuplicatingWeek}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="diet-week-duplicate__confirm"
                  onClick={() => void handleDuplicatePreviousWeek()}
                  disabled={isDuplicatingWeek}
                >
                  {isDuplicatingWeek ? "Duplication…" : "Dupliquer"}
                </button>
              </div>
            </section>
          </div>
        ) : null}
    </>
  )
}

export default DietPage




