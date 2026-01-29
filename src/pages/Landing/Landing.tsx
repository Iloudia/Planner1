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
  { title: "Journaling", text: "Ã‰cris, clarifie et te recentre.", image: cardMallika },
  { title: "S'aimer soi-mÃªme", text: "Instants self-love au quotidien.", image: cardSelflove },
  { title: "Wishlist", text: "Garde tes envies au mÃªme endroit.", image: cardMedhanshi },
  { title: "Calendrier mensuel", text: "Une vue claire sur le mois.", image: cardKatieHuber },
  { title: "Finances", text: "Budget et dÃ©penses sans stress.", image: cardEbony },
  { title: "Routine", text: "Rituels matin et soir qui te ressemblent.", image: cardLB },
  { title: "Cuisine", text: "IdÃ©es repas pour libÃ©rer ta charge mentale.", image: cardKatieMansfield },
]

const differentiatorHighlights = [
  "AllÃ©ger ta charge mentale",
  "Tâ€™aider Ã  te sentir plus sereinÂ·e",
  "Reprendre le contrÃ´le de ton temps",
  "CrÃ©er une vie qui te ressemble",
  "Te reconnecter Ã  toi-mÃªme",
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
            Lâ€™espace qui transforme ton quotidien en une vie plus fluide, plus douce et plus alignÃ©e.
          </h1>
          <p className="landing-hero__accent">
            Parce que tu mÃ©rites une vie structurÃ©e sans pression, productive sans stress, et inspirante au quotidien.
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
              ConnectÃ© en tant que <strong>{userEmail}</strong>
              <button type="button" onClick={logout}>
                Se dÃ©connecter
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
          <h2 id="landing-daily-hub-title">Sur ce site tu as accÃ¨s Ã  : </h2>
          <p>
            Fini les carnets Ã©parpillÃ©s, les notes sur ton tÃ©lÃ©phone et les applis dans tous les sens. Ici, tout est centralisÃ© pour
            simplifier ton quotidien et te libÃ©rer de la charge mentale.
          </p>
        </div>
        <div className="landing-carousel">
          <button type="button" className="landing-carousel__arrow landing-carousel__arrow--left" aria-label="Cartes prÃ©cÃ©dentes" onClick={handleCarouselPrev}>
            <span aria-hidden="true">â€¹</span>
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
            <span aria-hidden="true">â€º</span>
          </button>
        </div>
      </section>

      <section className="landing-differentiator" aria-labelledby="landing-differentiator-title">
        <div className="landing-section-heading">
          <h2 id="landing-differentiator-title">Bien plus qu'un outil d'organisation</h2>
          <p>
            Ce site nâ€™est pas seulement un planner digital. Câ€™est un vÃ©ritable cocon positif, conÃ§u pour te rappeler que tu peux avancer Ã  ton rythme, avec bienveillance envers toi-mÃªme.
          </p>
          <p>Tout est pensÃ© pour que tu te sentes bien, inspirÃ©Â·e et en accord avec toi.</p>
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
          Tu nâ€™as pas besoin dâ€™en faire davantage. Tu as besoin dâ€™un espace qui te laisse respirer, te guide et soutienne ton Ã©panouissement.
        </p>
        <button type="button" className="landing-cta-button" onClick={() => navigate("/register")}>
          Je commence mon organisation positive dÃ¨s maintenant
        </button>
      </section>

      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default LandingPage
