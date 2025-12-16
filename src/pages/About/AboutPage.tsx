import PageHeading from "../../components/PageHeading"
import heroImage from "../../assets/natalia-grabarczyk-dupe.jpeg"
import portrait from "../../assets/madison-hart-dupe.jpeg"
import "./AboutPage.css"

const paragraphs = [
  "À un moment de ma vie, je me suis sentie perdue.",
  "Trop de pensées, trop de doutes, trop de rêves mis de côté.",
  "Je savais que je voulais plus, mais je ne savais pas par où commencer.",
  "C’est à ce moment-là que j’ai compris une chose essentielle : le changement commence toujours à l’intérieur.",
  "En mettant des mots sur mes intentions, en écrivant mes objectifs, en apprenant à diriger mes pensées plutôt que de les subir, ma réalité a commencé à changer. Pas du jour au lendemain, mais un pas après l’autre.",
  "C’est de cette transformation qu’est né ce projet.",
  "Ce site n’est pas seulement un planificateur de journées. C’est un espace pensé pour t’aider à faire le tri, à clarifier ce que tu veux vraiment, et à avancer avec plus de conscience et de confiance.",
  "Ici, il ne s’agit pas d’en faire toujours plus, mais de faire mieux. De prendre le temps d’écrire, de réfléchir, et de te recentrer. D’avancer à ton rythme, sans pression, un jour à la fois.",
  "Si toi aussi tu te sens parfois perdue, si ton esprit est rempli de pensées et que tu ressens le besoin de clarté, ce site est là pour t’accompagner. Pour t’aider à reprendre ta vie en main, avec douceur et intention.",
]

const AboutPage = () => (
  <>
    <section className="page-hero-banner" aria-hidden="true">
      <img src={heroImage} alt="" loading="lazy" />
    </section>
    <div className="page-accent-bar" aria-hidden="true" />
    <div className="about-page">
      <PageHeading eyebrow="À propos" title="À propos de moi" />
      <div className="about-shell">
        <article className="about-article" aria-label="À propos">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </article>
        <figure className="about-figure" aria-hidden="true">
          <img src={portrait} alt="" loading="lazy" />
        </figure>
      </div>
    </div>
    <div className="page-footer-bar" aria-hidden="true" />
  </>
)

export default AboutPage
