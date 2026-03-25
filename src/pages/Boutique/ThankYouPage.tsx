import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import "./Boutique.css"
import { clearCart } from "./cartStorage"
import { useAuth } from "../../context/AuthContext"
import { fetchCheckoutSessionStatus, type CheckoutStatus } from "../../services/boutique/checkout"

const ThankYouPage = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { isAuthReady, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState<CheckoutStatus | null>(null)

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => {
      document.body.classList.remove("boutique-page--tone")
    }
  }, [])

  useEffect(() => {
    if (!isAuthReady) {
      return
    }

    if (!sessionId) {
      setStatus({ paid: false, error: "Session de paiement manquante." })
      return
    }

    if (!isAuthenticated) {
      setStatus({ paid: false, error: "Reconnecte-toi pour retrouver tes téléchargements." })
      return
    }

    const fetchStatus = async () => {
      try {
        const data = await fetchCheckoutSessionStatus(sessionId)
        setStatus(data)
      } catch (error) {
        console.error(error)
        setStatus({ paid: false, error: error instanceof Error ? error.message : "Impossible de verifier le paiement." })
      }
    }

    void fetchStatus()
  }, [isAuthReady, isAuthenticated, sessionId])

  useEffect(() => {
    if (status?.paid) {
      clearCart()
    }
  }, [status?.paid])

  const handleLoginRedirect = () => {
    navigate("/login", {
      state: {
        from: {
          pathname: location.pathname,
          search: location.search,
        },
      },
    })
  }

  if (!isAuthReady) {
    return (
      <div className="boutique-page boutique-page--loading" aria-busy="true" aria-live="polite">
        <span className="boutique-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  const isPaid = status?.paid
  const title = isPaid ? "Merci pour ton achat" : "Paiement en attente"
  const message = isPaid
    ? "Ton paiement est confirme. Tu peux telecharger ton produit ci-dessous ou le retrouver dans ta bibliothèque." 
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
            <Link to="/mes-achats" className="boutique-button boutique-button--ghost">
              Voir mes achats
            </Link>
            <Link to="/boutique" className="boutique-button boutique-button--ghost">
              Retour boutique
            </Link>
          </div>
        ) : !isAuthenticated && sessionId ? (
          <div className="boutique-thankyou__actions">
            <button type="button" className="boutique-button boutique-button--primary" onClick={handleLoginRedirect}>
              Me reconnecter
            </button>
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
                Si le paiement est validé mais que rien n'apparait, ouvre la page Mes achats ou reconnecte-toi avec le compte utilise pour payer.
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  )
}

export default ThankYouPage
