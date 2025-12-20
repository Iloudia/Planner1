import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useMoodboard } from "../../context/MoodboardContext"
import "./Landing.css"

import cardActivities from "../../assets/activities.jpeg"
import cardEbony from "../../assets/ebony-forsyth-dupe.jpeg"
import cardMedhanshi from "../../assets/medhanshi-mandawewala-dupe.jpeg"
import cardSelflove from "../../assets/selflove.jpeg"
import cardMadeline from "../../assets/madeline- edwards-dupe.jpeg"
import cardLB from "../../assets/l-b-dupe.jpeg"
import cardKatieMansfield from "../../assets/katie-mansfield-dupe.jpeg"
import cardMallika from "../../assets/mallika-jain-dupe.jpeg"
import cardKatieHuber from "../../assets/katie-huber-rhoades-dupe (1).jpeg"

const carouselItems = [
  { title: "Sport", text: "Bouge avec douceur et plaisir.", image: cardActivities },
  { title: "Activites", text: "Planifie tes sorties et projets.", image: cardEbony },
  { title: "Journaling", text: "Ecris, clarifie et te recentre.", image: cardMedhanshi },
  { title: "S'aimer soi-meme", text: "Instants self-love au quotidien.", image: cardSelflove },
  { title: "Wishlist", text: "Garde tes envies au meme endroit.", image: cardMadeline },
  { title: "Calendrier mensuel", text: "Une vue claire sur le mois.", image: cardLB },
  { title: "Finances", text: "Budget et depenses sans stress.", image: cardKatieMansfield },
  { title: "Routine", text: "Rituels matin et soir qui te ressemblent.", image: cardMallika },
  { title: "Cuisine", text: "Idees repas pour libérer ta charge mentale.", image: cardKatieHuber },
]

const differentiatorHighlights = [
  "Alléger ta charge mentale",
  "T’aider à te sentir plus serein·e",
  "Reprendre le contrôle de ton temps",
  "Créer une vie qui te ressemble",
  "Te reconnecter à toi-même",
]

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, userEmail, logout } = useAuth()
  const { moodboardSrc } = useMoodboard()
  const [carouselIndex, setCarouselIndex] = useState(0)

  const visibleCards = useMemo(
    () =>
      Array.from({ length: 4 }, (_, offset) => {
        const total = carouselItems.length
        return carouselItems[(carouselIndex + offset + total) % total]
      }),
    [carouselIndex],
  )

  const handleCarouselPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  const handleCarouselNext = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const destinationPath = useMemo(() => {
    const fromRoute = location.state as { from?: { pathname: string } } | undefined
    return fromRoute?.from?.pathname ?? "/home"
  }, [location.state])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destinationPath, { replace: true })
    }
  }, [destinationPath, isAuthenticated, navigate])

  return (
    <div className="landing-page">
      <div className="page-accent-bar" aria-hidden="true" />
      <section className="landing-hero">
        <div className="landing-hero__content">
          <h1>
            L’espace qui transforme ton quotidien en une vie plus fluide, plus douce et plus alignée.
          </h1>
          <p className="landing-hero__accent">
            Parce que tu merites une vie structuree sans pression, productive sans stress, et inspirante au quotidien.
          </p>
          <div className="landing-hero__actions">
            <button type="button" className="landing-cta-button" onClick={() => navigate("/login")}>
              Commencer mon organisation positive
            </button>
            {isAuthenticated ? (
              <button type="button" className="landing-secondary-button" onClick={() => navigate("/home")}>
                Reprendre ma planification
              </button>
            ) : null}
          </div>
          {isAuthenticated ? (
            <div className="landing-hero__status">
              Connecte en tant que <strong>{userEmail}</strong>
              <button type="button" onClick={logout}>
                Se deconnecter
              </button>
            </div>
          ) : null}
        </div>
        <div className="landing-hero__visual">
          <img src={moodboardSrc} alt="Moodboard Planner" />
        </div>
      </section>

      <section className="landing-daily-hub" aria-labelledby="landing-daily-hub-title">
        <div className="landing-section-heading">
          <h2 id="landing-daily-hub-title">Un espace unique pour organiser ta vie... et te sentir bien</h2>
          <p>
            Fini les carnets eparpilles, les notes sur ton telephone et les applis dans tous les sens. Ici, tout est centralise pour
            simplifier ton quotidien et te liberer de la charge mentale.
          </p>
        </div>
        <div className="landing-carousel">
          <button type="button" className="landing-carousel__arrow landing-carousel__arrow--left" aria-label="Cartes precedentes" onClick={handleCarouselPrev}>
            <span aria-hidden="true">‹</span>
          </button>
          <div className="landing-carousel__grid">
            {visibleCards.map((card) => (
              <article key={card.title} className="landing-carousel__card">
                <div className="landing-carousel__image">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="landing-carousel__body">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
          <button type="button" className="landing-carousel__arrow landing-carousel__arrow--right" aria-label="Cartes suivantes" onClick={handleCarouselNext}>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </section>

      <section className="landing-differentiator" aria-labelledby="landing-differentiator-title">
        <div className="landing-section-heading">
          <h2 id="landing-differentiator-title">Bien plus qu'un outil d'organisation</h2>
          <p>
            Ce site n’est pas seulement un planner digital. C’est un véritable cocon positif, conçu pour te rappeler que tu peux avancer à ton rythme, avec bienveillance envers toi-même.
          </p>
          <p>Tout est pensé pour que tu te sentes bien, inspiré·e et en accord avec toi.</p>
        </div>
        <ul className="landing-differentiator__list">
          {differentiatorHighlights.map((highlight) => (
            <li key={highlight}>
              <span aria-hidden="true">{"\u2728"}</span>
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-final-cta" aria-labelledby="landing-final-cta-title">
        <h2 id="landing-final-cta-title">Et si tu t'offrais enfin une organisation qui te fait du bien ?</h2>
        <p>
          Tu n’as pas besoin d’en faire davantage. Tu as besoin d’un espace qui te laisse respirer, te guide et soutienne ton épanouissement.
        </p>
        <button type="button" className="landing-cta-button" onClick={() => navigate("/login")}>
          Je commence mon organisation positive des maintenant
        </button>
      </section>

      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default LandingPage
