import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import PremiumCalendarModal from "../../components/PremiumCalendarModal"
import { useAuth } from "../../context/AuthContext"
import aimerImage from "../../assets/Aimer.webp"
import journalingImage from "../../assets/Journaling.webp"
import projetsImage from "../../assets/Projets.webp"
import "./ArchivesHome.css"

const categories = [
  { title: "Mindset", path: "/archives/mindset", image: aimerImage },
  { title: "Journaling", path: "/archives/journaling", image: journalingImage },
  { title: "Projets", path: "/archives/projets", image: projetsImage },
]

const ArchivesHome = () => {
  const { isPremium } = useAuth()
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false)

  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => document.body.classList.remove("boutique-page--tone")
  }, [])

  return (
  <div className={`archives-home aesthetic-page boutique-page${isPremium ? "" : " is-premium-locked"}`}>
    <div className="archives-home__preview" aria-hidden={!isPremium}>
      <PageHeading eyebrow="Archives" title="Que souhaitez-vous consulter ?" />
      <div className="archives-home__grid">
        <h2 className="archives-home__heading">Tes archives</h2>
        <p className="archives-home__intro">Explore tes archives par catégorie et retrouve tout ce qui compte pour toi.</p>
        {categories.map((category) => (
          <Link key={category.path} to={category.path} className="archives-home__card" tabIndex={isPremium ? undefined : -1}>
            <span className="archives-home__image" style={{ backgroundImage: `url(${category.image})` }} aria-hidden="true" />
            <span className="archives-home__overlay" aria-hidden="true" />
            <span className="archives-home__content">
              <span className="archives-home__title">{category.title}</span>
              <span className="archives-home__line" aria-hidden="true" />
              <span className="archives-home__arrow" aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
    {!isPremium ? (
      <section className="archives-home__premium-gate" aria-labelledby="archives-premium-title">
        <span className="archives-home__premium-lock" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="5" y="10" width="14" height="10" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            <path d="M12 14v2" />
          </svg>
        </span>
        <p className="archives-home__premium-eyebrow">Me&amp;rituals Premium</p>
        <h2 id="archives-premium-title">Retrouve toutes tes archives</h2>
        <p>Accède à l’historique de ton mindset, de ton journaling et de tes projets</p>
        <button type="button" onClick={() => setIsPremiumModalOpen(true)}>Débloquer mes archives</button>
      </section>
    ) : null}
    <PremiumCalendarModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
  </div>
  )
}

export default ArchivesHome
