import { useEffect } from "react"
import { Link } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import aimerImage from "../../assets/Aimer.webp"
import journalingImage from "../../assets/Journaling.webp"
import projetsImage from "../../assets/Projets.jpeg"
import "./ArchivesHome.css"

const categories = [
  { title: "Mindset", path: "/archives/mindset", image: aimerImage },
  { title: "Journaling", path: "/archives/journaling", image: journalingImage },
  { title: "Projets", path: "/archives/projets", image: projetsImage },
]

const ArchivesHome = () => {
  useEffect(() => {
    document.body.classList.add("boutique-page--tone")
    return () => document.body.classList.remove("boutique-page--tone")
  }, [])

  return (
  <div className="archives-home aesthetic-page boutique-page">
    <PageHeading eyebrow="Archives" title="Que souhaitez-vous consulter ?" />
    <p>Explorez vos archives par catégorie et retrouvez tout ce qui compte.</p>
    <div className="archives-home__grid">
      {categories.map((category) => (
        <Link key={category.path} to={category.path} className="archives-home__card">
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
  )
}

export default ArchivesHome
