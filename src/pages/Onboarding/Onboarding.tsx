import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { doc, setDoc } from "firebase/firestore"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"
import { auth, db } from "../../utils/firebase"
import "./Onboarding.css"

const ONBOARDING_STORAGE_KEY = "planner.onboarding.answers.v1"

const SOURCE_OPTIONS = [
  "Instagram",
  "TikTok",
  "Pinterest",
  "Recherche Google",
  "Recommandation d'un proche",
  "Publicité en ligne",
  "Etsy",
  "Autre",
]

const REASON_OPTIONS = [
  "Découvrir du contenu inspirant",
  "Organiser mon quotidien",
  "Améliorer mon bien-être",
  "Mieux gérer mes projets / objectifs",
  "Trouver des outils pratiques",
  "Suivre les nouveautés",
  "Autre raison",
]

const CATEGORY_OPTIONS = [
  { label: "Sport", icon: "🏃" },
  { label: "Journaling", icon: "📓" },
  { label: "Self-love", icon: "💖" },
  { label: "Finances", icon: "💰" },
  { label: "Routine", icon: "⏰" },
  { label: "Wishlist", icon: "⭐" },
  { label: "Calendrier mensuel", icon: "🗓️" },
  { label: "Cuisine", icon: "🍳" },
]

type OnboardingAnswers = {
  source: string
  sourceOther: string
  reasons: string[]
  reasonsOther: string
  categories: string[]
}

const initialAnswers: OnboardingAnswers = {
  source: "",
  sourceOther: "",
  reasons: [],
  reasonsOther: "",
  categories: [],
}

const OnboardingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userEmail } = useAuth()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialAnswers)

  const storageKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(userEmail), ONBOARDING_STORAGE_KEY), [userEmail])

  const nextPath = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } | string } | null
    if (typeof state?.from === "string") {
      return state.from
    }
    if (state?.from?.pathname) {
      return state.from.pathname
    }
    return "/home"
  }, [location.state])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (!stored) return
      const parsed = JSON.parse(stored) as Partial<OnboardingAnswers>
      setAnswers((prev) => ({
        ...prev,
        ...parsed,
        reasons: Array.isArray(parsed.reasons) ? parsed.reasons : prev.reasons,
        categories: Array.isArray(parsed.categories) ? parsed.categories : prev.categories,
      }))
    } catch {
      // ignore
    }
  }, [storageKey])

  const totalSteps = 3
  const progress = Math.round(((step + 1) / totalSteps) * 100)

  const isStepComplete = useMemo(() => {
    if (step === 0) {
      if (!answers.source) return false
      if (answers.source === "Autre") {
        return Boolean(answers.sourceOther.trim())
      }
      return true
    }
    if (step === 1) {
      if (answers.reasons.length === 0) return false
      if (answers.reasons.includes("Autre raison") && !answers.reasonsOther.trim()) {
        return false
      }
      return true
    }
    if (step === 2) {
      return answers.categories.length > 0
    }
    return false
  }, [answers, step])

  const persistAnswers = (payload: OnboardingAnswers) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ ...payload, completedAt: new Date().toISOString() }))
    } catch {
      // ignore
    }
  }

  const saveAnswersToFirestore = async (payload: OnboardingAnswers) => {
    const currentUser = auth.currentUser
    if (!currentUser) return
    try {
      const completedAt = new Date().toISOString()
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          onboarding: {
            source: payload.source,
            sourceOther: payload.sourceOther,
            reasons: payload.reasons,
            reasonsOther: payload.reasonsOther,
            categories: payload.categories,
            completedAt,
          },
          updatedAt: completedAt,
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Onboarding save failed", error)
    }
  }

  const completeOnboarding = async (payload: OnboardingAnswers) => {
    persistAnswers(payload)
    await saveAnswersToFirestore(payload)
    navigate(nextPath, { replace: true })
  }

  const handleNext = async () => {
    if (!isStepComplete) return
    if (step >= totalSteps - 1) {
      await completeOnboarding(answers)
      return
    }
    setStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const toggleMulti = (key: "reasons" | "categories", value: string) => {
    setAnswers((prev) => {
      const current = prev[key]
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
      return {
        ...prev,
        [key]: next,
        reasonsOther: key === "reasons" && value === "Autre raison" && current.includes(value) ? "" : prev.reasonsOther,
      }
    })
  }

  const handleSourceSelect = (value: string) => {
    const next = {
      ...answers,
      source: value,
      sourceOther: value === "Autre" ? answers.sourceOther : "",
    }
    setAnswers(next)
    if (value !== "Autre") {
      setStep(1)
    }
  }

  return (
    <>

      <div className="onboarding-layout">
        <section className="onboarding-panel">
          <div className="onboarding-progress">
            <div className="onboarding-progress__meta">
              <span>Question {step + 1} / {totalSteps}</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {step === 0 ? (
            <>
              <h2 className="onboarding-question">Comment avez-vous connu ce site ?</h2>
              <p className="onboarding-hint">Choix unique</p>
              <div className="onboarding-options">
                {SOURCE_OPTIONS.map((option) => (
                  <label key={option} className={`onboarding-option${answers.source === option ? " is-selected" : ""}`}>
                    <input
                      type="checkbox"
                      name="onboarding-source"
                      value={option}
                      checked={answers.source === option}
                      onChange={() => handleSourceSelect(option)}
                    />
                    <span className="onboarding-option__label">{option === "Autre" ? "Autre (à préciser)" : option}</span>
                    <span className="onboarding-option__control" aria-hidden="true" />
                  </label>
                ))}
              </div>
              {answers.source === "Autre" ? (
                <label className="onboarding-other">
                  Précise ta réponse
                  <input
                    type="text"
                    value={answers.sourceOther}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, sourceOther: event.target.value }))}
                    placeholder="Ex: blog, forum..."
                  />
                </label>
              ) : null}
            </>
          ) : null}

          {step === 1 ? (
            <>
              <h2 className="onboarding-question">Qu'est-ce qui vous a donné envie de créer un compte ?</h2>
              <p className="onboarding-hint">Plusieurs réponses possibles</p>
              <div className="onboarding-options">
                {REASON_OPTIONS.map((option) => (
                  <label key={option} className={`onboarding-option${answers.reasons.includes(option) ? " is-selected" : ""}`}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={answers.reasons.includes(option)}
                      onChange={() => toggleMulti("reasons", option)}
                    />
                    <span className="onboarding-option__label">{option}</span>
                    <span className="onboarding-option__control" aria-hidden="true" />
                  </label>
                ))}
              </div>
              {answers.reasons.includes("Autre raison") ? (
                <label className="onboarding-other">
                  Dis-nous en plus
                  <input
                    type="text"
                    value={answers.reasonsOther}
                    onChange={(event) => setAnswers((prev) => ({ ...prev, reasonsOther: event.target.value }))}
                    placeholder="Autre raison"
                  />
                </label>
              ) : null}
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h2 className="onboarding-question">Quelles catégories vous intéressent le plus ?</h2>
              <p className="onboarding-hint">Plusieurs réponses possibles</p>
              <div className="onboarding-options onboarding-options--grid">
                {CATEGORY_OPTIONS.map((option) => (
                  <label key={option.label} className={`onboarding-option${answers.categories.includes(option.label) ? " is-selected" : ""}`}>
                    <input
                      type="checkbox"
                      value={option.label}
                      checked={answers.categories.includes(option.label)}
                      onChange={() => toggleMulti("categories", option.label)}
                    />
                    <span className="onboarding-option__icon" aria-hidden="true">
                      {option.icon}
                    </span>
                    <span className="onboarding-option__label">{option.label}</span>
                    <span className="onboarding-option__control" aria-hidden="true" />
                  </label>
                ))}
              </div>
            </>
          ) : null}

          
        </section>

        <div className="onboarding-actions">
          {step > 0 ? (
            <button type="button" className="onboarding-button onboarding-button--ghost" onClick={handleBack}>
              Retour
            </button>
          ) : null}
          {step < totalSteps - 1 ? (
            <button type="button" className="onboarding-button" onClick={handleNext} disabled={!isStepComplete}>
              Suivant
            </button>
          ) : (
            <button type="button" className="onboarding-button" onClick={handleNext} disabled={!isStepComplete}>
              Terminer
            </button>
          )}
        </div>
      </div>
</>
  )
}

export default OnboardingPage

