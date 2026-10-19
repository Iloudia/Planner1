import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { createPremiumCheckoutSession, type PremiumPlanId } from "../services/premium/api"
import ModalCloseButton from "./ModalCloseButton"
import "./PremiumCalendarModal.css"
import { useTranslation } from "react-i18next"

type PremiumCalendarModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const PremiumFeatureCrown = () => {
  const { t } = useTranslation()
  return <span className="premium-feature-crown" aria-label={t("premium.feature")}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 7l4.4 4L12 4l4.6 7L21 7l-2.1 10H5.1L3 7Zm2.6 12h12.8v2H5.6v-2Z" />
    </svg>
  </span>
}

const plans: Array<{
  id: PremiumPlanId
  labelKey: string
  priceKey: string
  detailKey: string
  badgeKey?: string
}> = [
  {
    id: "yearly",
    labelKey: "premium.yearly",
    priceKey: "premium.yearlyPrice",
    detailKey: "premium.yearlyDetail",
    badgeKey: "premium.bestPrice",
  },
  {
    id: "monthly",
    labelKey: "premium.monthly",
    priceKey: "premium.monthlyPrice",
    detailKey: "premium.monthlyDetail",
  },
]

const PremiumCalendarModal = ({ isOpen, onClose }: PremiumCalendarModalProps) => {
  const { t } = useTranslation()
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
      setError(checkoutError instanceof Error ? checkoutError.message : t("premium.checkoutError"))
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
        aria-label={t("premium.closePresentation")}
      />
      <div className="premium-calendar-modal__panel" ref={panelRef} tabIndex={-1}>
        <ModalCloseButton onClick={onClose} ariaLabel={t("common.close")} />

        <div className="premium-calendar-modal__intro">
          <span className="premium-calendar-modal__eyebrow">Me&amp;rituals Premium</span>
          <span className="premium-calendar-modal__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 7.5h14v11H5zM8 7.5V5.8A4 4 0 0 1 12 2a4 4 0 0 1 4 3.8v1.7M8.5 12h7M12 9.5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 id="premium-calendar-title">{t("premium.title")}</h2>
          <p>{t("premium.intro")}</p>
        </div>

        <ul className="premium-calendar-modal__benefits">
          {(t("premium.benefits", { returnObjects: true }) as string[]).map((benefit) => (
            <li key={benefit}><span aria-hidden="true">✓</span> {benefit}</li>
          ))}
        </ul>

        <fieldset className="premium-calendar-modal__plans">
          <legend>{t("premium.choosePlan")}</legend>
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
                  <strong>{t(plan.labelKey)}</strong>
                  {plan.badgeKey ? <span className="premium-calendar-plan__badge">{t(plan.badgeKey)}</span> : null}
                </span>
                <span className="premium-calendar-plan__detail">{t(plan.detailKey)}</span>
              </span>
              <strong className="premium-calendar-plan__price">{t(plan.priceKey)}</strong>
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
          {isSubmitting
            ? t("premium.redirecting")
            : t("premium.choose", {
              plan: t(selectedPlanConfig.labelKey).toLocaleLowerCase(),
              price: t(selectedPlanConfig.priceKey),
            })}
        </button>
        <button type="button" className="premium-calendar-modal__continue" onClick={onClose} disabled={isSubmitting}>
          {t("premium.continueFree")}
        </button>
        <p className="premium-calendar-modal__legal">
          {t("premium.legal")}
        </p>
      </div>
    </div>,
    document.body,
  )
}

export default PremiumCalendarModal
