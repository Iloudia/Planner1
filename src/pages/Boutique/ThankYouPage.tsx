import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import "./Boutique.css"
import { buildApiUrl } from "../../utils/apiUrl"
import { clearCart } from "./cartStorage"

type CheckoutStatus = {
  paid: boolean
  downloads?: Array<{ downloadUrl: string; productName: string; fileName?: string; label?: string }>
  customerEmail?: string | null
  error?: string
}

const parseCheckoutError = async (response: Response) => {
  try {
    const payload = (await response.json()) as { error?: string }
    if (payload?.error) {
      return payload.error
    }
  } catch {
    // ignore malformed JSON payloads
  }

  return "Impossible de verifier le paiement."
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
        const response = await fetch(buildApiUrl(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`))
        if (!response.ok) {
          throw new Error(await parseCheckoutError(response))
        }
        const data = (await response.json()) as CheckoutStatus
        setStatus(data)
      } catch (error) {
        console.error(error)
        setStatus({ paid: false, error: error instanceof Error ? error.message : "Impossible de verifier le paiement." })
      }
    }

    void fetchStatus()
  }, [sessionId])

  useEffect(() => {
    if (status?.paid) {
      clearCart()
    }
  }, [status?.paid])

  const isPaid = status?.paid
  const title = isPaid ? "Merci pour ton achat" : "Paiement en attente"
  const message = isPaid
    ? "Ton paiement est confirme. Tu peux telecharger ton produit ci-dessous."
    : status?.error || "Nous n'avons pas encore recu la confirmation du paiement."

  return (
    <div className="boutique-page boutique-thankyou">
      <section className="boutique-thankyou__card">
        <span className="boutique-eyebrow">Boutique</span>
        <h1>{title}</h1>
        <p>{message}</p>

        {isPaid && status?.downloads?.length ? (
          <div className="boutique-thankyou__actions">
            {status.downloads.map((item) => (
              <a key={item.downloadUrl} href={item.downloadUrl} className="boutique-button boutique-button--primary">
                Telecharger {item.label || item.productName}
              </a>
            ))}
            <Link to="/boutique" className="boutique-button boutique-button--ghost">
              Retour boutique
            </Link>
          </div>
        ) : (
          <div className="boutique-thankyou__actions">
            <Link to="/boutique" className="boutique-button boutique-button--primary">
              Revenir a la boutique
            </Link>
            {sessionId ? (
              <p className="boutique-thankyou__help">
                Si tu ne recois pas d'email d'ici quelques minutes, contacte-moi via la page Contact.
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  )
}

export default ThankYouPage

