import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useMoodboard } from "../../context/MoodboardContext"
import "./Landing.css"

import cardEbony from "../../assets/ebony-forsyth-dupe.jpeg"
import cardMedhanshi from "../../assets/medhanshi-mandawewala-dupe.jpeg"
import cardSelflove from "../../assets/selflove.jpeg"
import cardLB from "../../assets/l-b-dupe.jpeg"
import cardKatieMansfield from "../../assets/katie-mansfield-dupe.jpeg"
import cardMallika from "../../assets/mallika-jain-dupe.jpeg"
import cardKatieHuber from "../../assets/katie-huber-rhoades-dupe (1).jpeg"
import cardSport from "../../assets/sport.jpeg"

const carouselItems = [
  { title: "Sport", text: "Bouge avec douceur et plaisir.", image: cardSport },
  { title: "Journaling", text: "Écris, clarifie et te recentre.", image: cardMallika },
  { title: "S'aimer soi-même", text: "Instants self-love au quotidien.", image: cardSelflove },
  { title: "Wishlist", text: "Garde tes envies au même endroit.", image: cardMedhanshi },
  { title: "Calendrier mensuel", text: "Une vue claire sur le mois.", image: cardKatieHuber },
  { title: "Finances", text: "Budget et dépenses sans stress.", image: cardEbony },
  { title: "Routine", text: "Rituels matin et soir qui te ressemblent.", image: cardLB },
  { title: "Cuisine", text: "Idées repas pour libérer ta charge mentale.", image: cardKatieMansfield },
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

  const [cardsPerView, setCardsPerView] = useState(1)

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth
      if (width >= 1200) {
        setCardsPerView(4)
      } else if (width >= 980) {
        setCardsPerView(3)
      } else if (width >= 700) {
        setCardsPerView(2)
      } else {
        setCardsPerView(1)
      }
    }

    updateCardsPerView()
    window.addEventListener("resize", updateCardsPerView)
    return () => window.removeEventListener("resize", updateCardsPerView)
  }, [])

  const visibleCards = useMemo(
    () =>
      Array.from({ length: cardsPerView }, (_, offset) => {
        const total = carouselItems.length
        return carouselItems[(carouselIndex + offset + total) % total]
      }),
    [carouselIndex, cardsPerView],
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

      <section className="landing-hero">
        <div className="landing-hero__content">
          <h1>
            L’espace qui transforme ton quotidien en une vie plus fluide, plus douce et plus alignée.
          </h1>
          <p className="landing-hero__accent">
            Parce que tu mérites une vie structurée sans pression, productive sans stress, et inspirante au quotidien.
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
              Connecté en tant que <strong>{userEmail}</strong>
              <button type="button" onClick={logout}>
                Se déconnecter
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
          <h2 id="landing-daily-hub-title">Sur ce site tu as accès à :</h2>
        </div>
        <div className="landing-carousel">
          <button type="button" className="landing-carousel__arrow landing-carousel__arrow--left" aria-label="Cartes précédentes" onClick={handleCarouselPrev}>
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
            Fini les carnets éparpillés, les notes sur ton téléphone et les applis dans tous les sens. Ici, tout est centralisé pour
            simplifier ton quotidien et te libérer de la charge mentale.
          </p>
        </div>
        <ul className="landing-differentiator__list">
          {differentiatorHighlights.map((highlight) => (
            <li key={highlight}>
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
        <button type="button" className="landing-cta-button" onClick={() => navigate("/register")}>
          Je commence mon organisation positive dès maintenant
        </button>
      </section>

      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default LandingPage
