import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import "./Boutique.css"

type CheckoutStatus = {
  paid: boolean
  downloadUrl?: string
  productName?: string
  customerEmail?: string | null
  error?: string
}

const ThankYouPage = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<CheckoutStatus | null>(null)

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    if (!sessionId) {
      setStatus({ paid: false, error: "Session de paiement manquante." })
      return
    }

    const fetchStatus = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE || ""
        const response = await fetch(`${apiBase}/api/checkout-session?session_id=${sessionId}`)
        if (!response.ok) {
          throw new Error("Impossible de vÃ©rifier le paiement.")
        }
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        console.error(error)
        setStatus({ paid: false, error: "Impossible de vÃ©rifier le paiement." })
      }
    }

    fetchStatus()
  }, [sessionId])

  const isPaid = status?.paid
  const title = isPaid ? "Merci pour ton achat" : "Paiement en attente"
  const message = isPaid
    ? "Ton paiement est confirmÃ©. Tu peux tÃ©lÃ©charger ton produit ci-dessous."
    : status?.error || "Nous n'avons pas encore reÃ§u la confirmation du paiement."

  return (
    <div className="boutique-page boutique-thankyou">
      <section className="boutique-thankyou__card">
        <span className="boutique-eyebrow">Boutique digitale</span>
        <h1>{title}</h1>
        <p>{message}</p>

        {isPaid && status?.downloadUrl ? (
          <div className="boutique-thankyou__actions">
            <a href={status.downloadUrl} className="boutique-button boutique-button--primary">
              TÃ©lÃ©charger maintenant
            </a>
            <Link to="/boutique" className="boutique-button boutique-button--ghost">
              Retour boutique
            </Link>
          </div>
        ) : (
          <div className="boutique-thankyou__actions">
            <Link to="/boutique" className="boutique-button boutique-button--primary">
              Revenir Ã  la boutique
            </Link>
            {sessionId ? (
              <p className="boutique-thankyou__help">
                Si tu ne reÃ§ois pas d'email d'ici quelques minutes, contacte-moi via la page Contact.
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  )
}

export default ThankYouPage
