import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useTranslation } from "react-i18next"
import "./Landing.css"

import heroBackdrop from "../../assets/frances-leynes-dupe.webp"
import heroBackdropMobile from "../../assets/frances-leynes-dupe-mobile.webp"
import finalCtaBackdrop from "../../assets/camille-coss-dupe.webp"
import cardEbony from "../../assets/ebony-forsyth-dupe.webp"
import cardEbonySmall from "../../assets/ebony-forsyth-dupe-512.webp"
import cardEbonyCompact from "../../assets/ebony-forsyth-dupe-640.webp"
import cardEbonyMobile from "../../assets/ebony-forsyth-dupe-mobile.webp"
import cardMedhanshi from "../../assets/medhanshi-mandawewala-dupe.webp"
import cardMedhanshiSmall from "../../assets/medhanshi-mandawewala-dupe-512.webp"
import cardMedhanshiCompact from "../../assets/medhanshi-mandawewala-dupe-640.webp"
import cardMedhanshiMobile from "../../assets/medhanshi-mandawewala-dupe-mobile.webp"
import cardSelflove from "../../assets/selflove.webp"
import cardSelfloveSmall from "../../assets/selflove-512.webp"
import cardSelfloveCompact from "../../assets/selflove-640.webp"
import cardSelfloveMobile from "../../assets/selflove-mobile.webp"
import cardLB from "../../assets/l-b-dupe.webp"
import cardLBSmall from "../../assets/l-b-dupe-512.webp"
import cardLBCompact from "../../assets/l-b-dupe-640.webp"
import cardLBMobile from "../../assets/l-b-dupe-mobile.webp"
import cardKatieMansfield from "../../assets/katie-mansfield-dupe.webp"
import cardKatieMansfieldSmall from "../../assets/katie-mansfield-dupe-512.webp"
import cardKatieMansfieldCompact from "../../assets/katie-mansfield-dupe-640.webp"
import cardKatieMansfieldMobile from "../../assets/katie-mansfield-dupe-mobile.webp"
import cardMallika from "../../assets/mallika-jain-dupe.webp"
import cardMallikaSmall from "../../assets/mallika-jain-dupe-512.webp"
import cardMallikaCompact from "../../assets/mallika-jain-dupe-640.webp"
import cardMallikaMobile from "../../assets/mallika-jain-dupe-mobile.webp"
import cardKatieHuber from "../../assets/katie-huber-rhoades-dupe (1).webp"
import cardKatieHuberSmall from "../../assets/katie-huber-rhoades-dupe (1)-512.webp"
import cardKatieHuberCompact from "../../assets/katie-huber-rhoades-dupe (1)-640.webp"
import cardKatieHuberMobile from "../../assets/katie-huber-rhoades-dupe (1)-mobile.webp"
import cardSport from "../../assets/sport.webp"
import cardSportSmall from "../../assets/sport-512.webp"
import cardSportCompact from "../../assets/sport-640.webp"
import cardSportMobile from "../../assets/sport-mobile.webp"

const carouselItems = [
  { id: "sport", image: cardSport, smallImage: cardSportSmall, compactImage: cardSportCompact, mobileImage: cardSportMobile, width: 1650 },
  { id: "journaling", image: cardMallika, smallImage: cardMallikaSmall, compactImage: cardMallikaCompact, mobileImage: cardMallikaMobile, width: 1650 },
  { id: "mindset", image: cardSelflove, smallImage: cardSelfloveSmall, compactImage: cardSelfloveCompact, mobileImage: cardSelfloveMobile, width: 1467 },
  { id: "wishlist", image: cardMedhanshi, smallImage: cardMedhanshiSmall, compactImage: cardMedhanshiCompact, mobileImage: cardMedhanshiMobile, width: 1549 },
  { id: "calendar", image: cardKatieHuber, smallImage: cardKatieHuberSmall, compactImage: cardKatieHuberCompact, mobileImage: cardKatieHuberMobile, width: 1650 },
  { id: "finances", image: cardEbony, smallImage: cardEbonySmall, compactImage: cardEbonyCompact, mobileImage: cardEbonyMobile, width: 1650 },
  { id: "routine", image: cardLB, smallImage: cardLBSmall, compactImage: cardLBCompact, mobileImage: cardLBMobile, width: 1440 },
  { id: "menu", image: cardKatieMansfield, smallImage: cardKatieMansfieldSmall, compactImage: cardKatieMansfieldCompact, mobileImage: cardKatieMansfieldMobile, width: 1650 },
]

const LandingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, userEmail, logout } = useAuth()
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(1)

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth
      if (width >= 1180) {
        setCardsPerView(4)
      } else if (width >= 900) {
        setCardsPerView(3)
      } else if (width >= 560) {
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

  const carouselDotIndexes = useMemo(() => carouselItems.map((_, index) => index), [])
  const differentiatorHighlights = t("landing.benefits", { returnObjects: true }) as string[]

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
        <picture className="landing-hero__media" aria-hidden="true">
          <img
            src={heroBackdrop}
            srcSet={`${heroBackdropMobile} 800w, ${heroBackdrop} 1572w`}
            sizes="100vw"
            alt=""
            width="1572"
            height="2200"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="landing-hero__content">
          <span className="landing-hero__eyebrow">{t("landing.eyebrow")}</span>
          <h1>{t("landing.heroTitle")}</h1>
          <p className="landing-hero__accent">{t("landing.heroAccent")}</p>
          <div className="landing-hero__actions">
            <button type="button" className="landing-cta-button" onClick={() => navigate("/login")}>
              {t("landing.start")}
            </button>
            {isAuthenticated ? (
              <button type="button" className="landing-secondary-button" onClick={() => navigate("/home")}>
                {t("landing.resume")}
              </button>
            ) : null}
          </div>
          {isAuthenticated ? (
            <div className="landing-hero__status">
              {t("landing.signedInAs")} <strong>{userEmail}</strong>
              <button type="button" onClick={logout}>
                {t("landing.logout")}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="landing-daily-hub" aria-labelledby="landing-daily-hub-title">
        <div className="landing-section-heading landing-daily-hub__heading">
          <h2 id="landing-daily-hub-title">{t("landing.hubTitle")}</h2>
          <p>{t("landing.hubText")}</p>
        </div>
        <div className="landing-carousel">
          <button type="button" className="landing-carousel__arrow landing-carousel__arrow--left" aria-label={t("landing.previousCards")} onClick={handleCarouselPrev}>
            <svg className="workout-form__select-chevron landing-carousel__chevron landing-carousel__chevron--left" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="landing-carousel__grid" aria-live="polite" style={{ gridTemplateColumns: `repeat(${cardsPerView}, minmax(0, 1fr))` }}>
            {visibleCards.map((card) => (
              <article key={card.id} className="landing-carousel__card">
                <div className="landing-carousel__image">
                  <img
                    src={card.image}
                    srcSet={`${card.smallImage} 512w, ${card.compactImage} 640w, ${card.mobileImage} 800w, ${card.image} ${card.width}w`}
                    sizes="(max-width: 559px) calc(100vw - 4rem), (max-width: 899px) 45vw, (max-width: 1179px) 30vw, 280px"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="landing-carousel__body">
                  <h3>{t(`landing.cards.${card.id}.title`)}</h3>
                  <p>{t(`landing.cards.${card.id}.text`)}</p>
                </div>
              </article>
            ))}
          </div>
          <button type="button" className="landing-carousel__arrow landing-carousel__arrow--right" aria-label={t("landing.nextCards")} onClick={handleCarouselNext}>
            <svg className="workout-form__select-chevron landing-carousel__chevron landing-carousel__chevron--right" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="landing-carousel__dots" aria-label={t("landing.carouselPosition")}>
          {carouselDotIndexes.map((index) => (
            <button
              key={index}
              type="button"
              className={`landing-carousel__dot${index === carouselIndex ? " is-active" : ""}`}
              aria-label={t("landing.showCards", { number: index + 1 })}
              aria-pressed={index === carouselIndex}
              onClick={() => setCarouselIndex(index)}
            />
          ))}
        </div>
      </section>

      <section className="landing-differentiator" aria-labelledby="landing-differentiator-title">
        <div className="landing-section-heading landing-differentiator__heading">
          <span className="landing-differentiator__eyebrow">{t("landing.gentleEyebrow")}</span>
          <h2 id="landing-differentiator-title">{t("landing.differentiatorTitle")}</h2>
          <p>{t("landing.differentiatorText")}</p>
        </div>
        <ul className="landing-differentiator__list">
          {differentiatorHighlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </section>

      <section
        className="landing-final-cta"
        aria-labelledby="landing-final-cta-title"
        style={{ backgroundImage: `url(${finalCtaBackdrop})` }}
      >
        <div className="landing-final-cta__content">
          <span className="landing-final-cta__eyebrow">{t("landing.finalEyebrow")}</span>
          <h2 id="landing-final-cta-title">{t("landing.finalTitle")}</h2>
          <p>{t("landing.finalText")}</p>
          <button type="button" className="landing-cta-button" onClick={() => navigate("/register")}>
            {t("landing.createSpace")}
          </button>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
