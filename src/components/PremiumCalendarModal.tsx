import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { createPremiumCheckoutSession, type PremiumPlanId } from "../services/premium/api"
import ModalCloseButton from "./ModalCloseButton"
import "./PremiumCalendarModal.css"

type PremiumCalendarModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const PremiumFeatureCrown = () => (
  <span className="premium-feature-crown" aria-label="Fonctionnalité Premium">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 7l4.4 4L12 4l4.6 7L21 7l-2.1 10H5.1L3 7Zm2.6 12h12.8v2H5.6v-2Z" />
    </svg>
  </span>
)

const plans: Array<{
  id: PremiumPlanId
  label: string
  price: string
  detail: string
  badge?: string
}> = [
  {
    id: "yearly",
    label: "Annuel",
    price: "49,99 € / an",
    detail: "Soit 4,17 € / mois · économie de 30 %",
    badge: "Meilleur tarif",
  },
  {
    id: "monthly",
    label: "Mensuel",
    price: "5,99 € / mois",
    detail: "Facturé chaque mois",
  },
]

const PremiumCalendarModal = ({ isOpen, onClose }: PremiumCalendarModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlanId>("yearly")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.requestAnimationFrame(() => panelRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
      previousActiveElement?.focus()
    }
  }, [isOpen, isSubmitting, onClose])

  useEffect(() => {
    if (isOpen) {
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubscribe = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const checkoutUrl = await createPremiumCheckoutSession(selectedPlan)
      window.location.assign(checkoutUrl)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Impossible de lancer le paiement.")
      setIsSubmitting(false)
    }
  }

  const selectedPlanConfig = plans.find((plan) => plan.id === selectedPlan) ?? plans[0]

  return createPortal(
    <div className="premium-calendar-modal" role="dialog" aria-modal="true" aria-labelledby="premium-calendar-title">
      <button
        type="button"
        className="premium-calendar-modal__backdrop"
        onClick={isSubmitting ? undefined : onClose}
        aria-label="Fermer la présentation Premium"
      />
      <div className="premium-calendar-modal__panel" ref={panelRef} tabIndex={-1}>
        <ModalCloseButton onClick={onClose} ariaLabel="Fermer" />

        <div className="premium-calendar-modal__intro">
          <span className="premium-calendar-modal__eyebrow">Me&amp;rituals Premium</span>
          <span className="premium-calendar-modal__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 7.5h14v11H5zM8 7.5V5.8A4 4 0 0 1 12 2a4 4 0 0 1 4 3.8v1.7M8.5 12h7M12 9.5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 id="premium-calendar-title">Organise tout ton quotidien avec Premium.</h2>
          <p>Débloque les outils avancés du calendrier, des repas, de tes routines, de tes entraînements, de ta Wishlist et de tes archives.</p>
        </div>

        <ul className="premium-calendar-modal__benefits">
          <li><span aria-hidden="true">✓</span> Duplique tes événements et crée des récurrences dans le calendrier</li>
          <li><span aria-hidden="true">✓</span> Reprends ton planning de repas de la semaine précédente en un clic</li>
          <li><span aria-hidden="true">✓</span> Crée et conserve tes propres recettes</li>
          <li><span aria-hidden="true">✓</span> Ajoute directement une recette à ton planning de repas</li>
          <li><span aria-hidden="true">✓</span> Programme tes exercices dans ta semaine sportive</li>
          <li><span aria-hidden="true">✓</span> Enregistre et organise tes vidéos d’entraînement</li>
          <li><span aria-hidden="true">✓</span> Crée autant de catégories et d’éléments que tu veux dans ta Wishlist</li>
          <li><span aria-hidden="true">✓</span> Ajoute autant d’actions que tu veux à tes routines du matin et du soir</li>
          <li><span aria-hidden="true">✓</span> Retrouve l’historique de ton mindset, de ton journaling et de tes projets</li>
          <li><span aria-hidden="true">✓</span> Gère autant de projets actifs que tu veux</li>
        </ul>

        <fieldset className="premium-calendar-modal__plans">
          <legend>Choisis ta formule</legend>
          {plans.map((plan) => (
            <label key={plan.id} className={`premium-calendar-plan${selectedPlan === plan.id ? " is-selected" : ""}`}>
              <input
                type="radio"
                name="premium-calendar-plan"
                value={plan.id}
                checked={selectedPlan === plan.id}
                onChange={() => setSelectedPlan(plan.id)}
              />
              <span className="premium-calendar-plan__control" aria-hidden="true" />
              <span className="premium-calendar-plan__copy">
                <span className="premium-calendar-plan__heading">
                  <strong>{plan.label}</strong>
                  {plan.badge ? <span className="premium-calendar-plan__badge">{plan.badge}</span> : null}
                </span>
                <span className="premium-calendar-plan__detail">{plan.detail}</span>
              </span>
              <strong className="premium-calendar-plan__price">{plan.price}</strong>
            </label>
          ))}
        </fieldset>

        {error ? <p className="premium-calendar-modal__error" role="alert">{error}</p> : null}

        <button
          type="button"
          className="premium-calendar-modal__subscribe"
          onClick={handleSubscribe}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Redirection sécurisée…" : `Choisir ${selectedPlanConfig.label.toLowerCase()} · ${selectedPlanConfig.price}`}
        </button>
        <button type="button" className="premium-calendar-modal__continue" onClick={onClose} disabled={isSubmitting}>
          Continuer gratuitement
        </button>
        <p className="premium-calendar-modal__legal">
          Prix TTC. Renouvellement automatique à chaque période. Résiliation possible à tout moment.
        </p>
      </div>
    </div>,
    document.body,
  )
}

export default PremiumCalendarModal
