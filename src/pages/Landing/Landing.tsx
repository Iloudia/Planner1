import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Landing.css"

import heroBackdrop from "../../assets/frances-leynes-dupe.webp"
import finalCtaBackdrop from "../../assets/camille-coss-dupe.webp"
import cardEbony from "../../assets/ebony-forsyth-dupe.webp"
import cardMedhanshi from "../../assets/medhanshi-mandawewala-dupe.webp"
import cardSelflove from "../../assets/selflove.webp"
import cardLB from "../../assets/l-b-dupe.webp"
import cardKatieMansfield from "../../assets/katie-mansfield-dupe.webp"
import cardMallika from "../../assets/mallika-jain-dupe.webp"
import cardKatieHuber from "../../assets/katie-huber-rhoades-dupe (1).webp"
import cardSport from "../../assets/sport.webp"

const carouselItems = [
  { title: "Sport", text: "Planifie tes séances de sport.", image: cardSport },
  { title: "Journaling", text: "Écris et clarifie tes pensées.", image: cardMallika },
  { title: "Mindset", text: "Apprends à mieux te connaître.", image: cardSelflove },
  { title: "Wishlist", text: "Garde tes envies au même endroit.", image: cardMedhanshi },
  { title: "Calendrier", text: "Organise ton mois.", image: cardKatieHuber },
  { title: "Finances", text: "Suis ton budget et tes dépenses.", image: cardEbony },
  { title: "Routine", text: "Structure tes routines du matin et du soir.", image: cardLB },
  { title: "Menu de la semaine", text: "Planifie tes repas de la semaine.", image: cardKatieMansfield },
]

const differentiatorHighlights = [
  "Alléger ta charge mentale",
  "T’aider à te sentir plus sereine",
  "Reprendre le contrôle de ton temps",
  "Créer une vie qui te ressemble",
  "Te reconnecter à toi-même",
]

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthReady, isAuthenticated, userEmail, logout } = useAuth()
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

  useEffect(() => {
    document.body.classList.add("landing-page--lux")
    return () => {
      document.body.classList.remove("landing-page--lux")
    }
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

  const isLandingLoading = !isAuthReady

  if (isLandingLoading) {
    return (
      <div className="landing-page landing-page--loading" aria-busy="true" aria-live="polite">
        <span className="landing-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <div className="landing-page">

      <section className="landing-hero" style={{ backgroundImage: `url(${heroBackdrop})` }}>
        <div className="landing-hero__content">
          <h1>
            L’espace qui transforme ton quotidien en une vie plus fluide, plus douce et plus alignée.
          </h1>
          <p className="landing-hero__accent">
            Parce que tu mérites une vie sans pression, et où tout est plus simple.
          </p>
          <div className="landing-hero__actions">
            <button type="button" className="landing-cta-button" onClick={() => navigate("/login")}>
              Commencer mon organisation
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
      </section>

      <section className="landing-daily-hub" aria-labelledby="landing-daily-hub-title">
        <div className="landing-section-heading">
          <h2
            id="landing-daily-hub-title"
            style={{
              fontSize: "clamp(0.78rem, 0.72rem + 0.45vw, 1.35rem)",
              lineHeight: 1.18,
              whiteSpace: "nowrap"
            }}
          >
            Sur ce site tu as accès à :
          </h2>
        </div>
        <div className="landing-carousel">
          <button type="button" className="landing-carousel__arrow landing-carousel__arrow--left" aria-label="Cartes précédentes" onClick={handleCarouselPrev}>
            <span aria-hidden="true">‹</span>
          </button>
          <div className="landing-carousel__grid">
            {visibleCards.map((card) => (
              <article key={card.title} className="landing-carousel__card">
                <div className="landing-carousel__image">
                  <img src={card.image} alt={card.title} loading="lazy" decoding="async" />
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

      <section
        className="landing-final-cta"
        aria-labelledby="landing-final-cta-title"
        style={{ backgroundImage: `url(${finalCtaBackdrop})` }}
      >
        <h2 id="landing-final-cta-title">Et si tu t'offrais enfin une organisation qui te fait du bien ?</h2>
        <p>
          <span style={{ color: "#ffffff" }}>Parfois, tout commence par un espace qui offre de l’air, de la clarté et la possibilité de s’épanouir pleinement.</span>
        </p>
        <button type="button" className="landing-cta-button" onClick={() => navigate("/register")}>
          Créer mon espace
        </button>
      </section>
</div>
  )
}

export default LandingPage

