import { useEffect } from "react"
import { Link } from "react-router-dom"
import mindsetImage from "../../assets/Aimer.webp"
import manifestationImage from "../../assets/MoodBoard.webp"
import blogImage from "../../assets/Journaling.webp"
import morningResetImage from "../../assets/Routine.webp"
import softConfidenceImage from "../../assets/Aimer.webp"
import slowEveningImage from "../../assets/l-b-dupe.webp"
import EditorialQuote from "../../components/EditorialQuote"
import "../Sport/Sport.css"
import "./SelfLove.css"
import "./SelfLoveHome.css"

const selfLoveCards = [
  { label: "Mindset", route: "/mindset", image: mindsetImage },
  { label: "Manifestation", route: "/manifestation", image: manifestationImage },
]

const ritualCards = [
  { title: "Morning reset", description: "Des petits gestes pour bien commencer la journée.", image: morningResetImage },
  { title: "Soft confidence", description: "Nourrir une estime de soi douce et durable.", image: softConfidenceImage },
  { title: "Slow evening", description: "Ralentir, se recentrer et se reconnecter à soi.", image: slowEveningImage },
]

const SelfLoveHome = () => {
  useEffect(() => {
    document.body.classList.add("self-love-page--lux")
    return () => document.body.classList.remove("self-love-page--lux")
  }, [])

  return (
    <div className="self-love-page sport-page">
      <header className="self-love-page__heading">
        <div>
          <span className="self-love-page__heading-eyebrow">Mon</span>
          <h1>Self Love</h1>
        </div>
        <p>Un espace pour cultiver l’amour de soi, nourrir tes intentions et avancer avec confiance.</p>
      </header>

      <section className="sport-quick-panel">
        <div className="sport-quick-panel__header">
          <h2 className="sport-quick-panel__title">My Life</h2>
        </div>
        <div className="sport-quick-panel__cards">
          {selfLoveCards.map((card) => (
            <Link key={card.route} className="self-love-life-card" to={card.route} aria-label={`Ouvrir ${card.label}`}>
              <div className="self-love-life-card__media">
                <img src={card.image} alt={card.label} loading="lazy" decoding="async" />
              </div>
              <h3>{card.label}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="self-love-editorial-section">
        <section className="self-love-blog-banner" aria-labelledby="self-love-blog-title">
          <div className="self-love-blog-banner__media">
            <img src={blogImage} alt="Carnet ouvert dans une ambiance calme" loading="lazy" decoding="async" />
          </div>
          <div className="self-love-blog-banner__content">
            <span className="self-love-blog-banner__eyebrow">Aller plus loin</span>
            <h2 id="self-love-blog-title">Le blog</h2>
            <p>
              Découvre des articles sur la manifestation, le mindset et le self love pour t’inspirer et avancer chaque jour
              un peu plus vers la vie que tu aimes.
            </p>
            <Link className="self-love-blog-banner__button" to="/blog">Voir le blog</Link>
          </div>
        </section>

        <section className="self-love-rituals" aria-labelledby="self-love-rituals-title">
          <header className="self-love-rituals__header">
            <div>
              <h2 id="self-love-rituals-title">Mes rituels de self love</h2>
              <h4>Approfondis chaque rituel avec les articles du blog.</h4>
            </div>
          </header>
          <div className="self-love-rituals__grid">
            {ritualCards.map((ritual) => (
              <article className="self-love-ritual-card" key={ritual.title}>
                <div className="self-love-ritual-card__media">
                  <img src={ritual.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="self-love-ritual-card__content">
                  <h3>{ritual.title}</h3>
                  <p>{ritual.description}</p>
                  <span className="self-love-ritual-card__action">Découvrir</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <EditorialQuote
        className="self-love-quote"
        ariaLabel="Citation inspirante"
        quote={'"Une vie que j’aime commence par une relation douce avec moi-même."'}
      />
    </div>
  )
}

export default SelfLoveHome
