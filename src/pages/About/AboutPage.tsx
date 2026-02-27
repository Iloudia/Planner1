import { useEffect } from "react"
import PageHeading from "../../components/PageHeading"
import portrait from "../../assets/Fleurs-blanches.webp"
import valuePhotoTwo from "../../assets/Ballons-coeur.webp"
import valuePhotoThree from "../../assets/Perseverance.webp"
import planteVerte from "../../assets/Plante-verte.webp"
import "./AboutPage.css"

const firstStoryPart = [
  "Au bout d'un moment, j'ai voulu mieux organiser mes journées. J'ai donc installé plusieurs applications, et je me suis vite rendu compte qu'il fallait payer pour des choses assez simples, comme programmer des événements sur plusieurs jours ou encore changer la couleur des événements.",
  "J'ai alors décidé de coder mon propre planner. À la base, cela ne devait me prendre que deux jours, tout au plus. Puis je me suis dit que je pourrais ajouter une page, puis une autre, et ainsi de suite. En cours de route, j'ai réalisé que je pourrais en faire profiter tout le monde.",
  "C'est pour cette raison que j'ai décidé de créer un véritable site web, et pas seulement quelque chose que je garderais pour moi. C'est ainsi que Me&rituals est né.",
]

const secondStoryPart = [
  "Ce site est né d'une envie d'aider les autres à mieux organiser leurs journées, à penser un peu plus positivement et à essayer de se réconcilier avec soi-même grâce à quelques exercices simples.",
  "Aimez-vous tel que vous êtes, prenez du temps pour sculpter votre corps, prenez du temps pour faire du journaling et poser toutes vos pensées, négatives comme positives, et vous pourrez observer un grand changement dans votre vie.",
  "Dans ma vie, je me suis longtemps cherchée. Mais s'il y a une chose que je sais avec certitude aujourd'hui, c'est que j'aime aider les gens, et j'espère que ce site en sera la preuve.",
]

const siteValues = [
  {
    title: "Bien-être",
    image: planteVerte,
    imageAlt: "Plante verte inspiration bien-être",
    description: [
      "Créer un espace où l'on peut ralentir, respirer et retrouver un équilibre intérieur.",
      "Un lieu pour apaiser le mental, alléger la charge émotionnelle et cultiver un mieux-être durable.",
    ],
  },
  {
    title: "Bienveillance",
    image: valuePhotoTwo,
    imageAlt: "Portrait inspiration bienveillance",
    description: [
      "Apprendre à se parler avec douceur, sans jugement ni auto-critique.",
      "Avancer en se respectant, en s'accueillant pleinement, même dans les moments de doute.",
    ],
  },
  {
    title: "Persévérance",
    image: valuePhotoThree,
    imageAlt: "Portrait inspiration persévérance",
    description: [
      "Rappeler que chaque petit pas compte.",
      "Continuer d'avancer, même lentement, avec confiance et constance, un jour à la fois.",
    ],
  },
]

const AboutPage = () => {
  useEffect(() => {
    document.body.classList.add("about-page--lux")
    return () => {
      document.body.classList.remove("about-page--lux")
    }
  }, [])

  return (
    <>
      <div className="about-page">
        <div className="about-shell">
          <PageHeading eyebrow="À propos" title="À propos de moi" />
          <article className="about-article" aria-label="À propos">
            <div className="about-feature">
              <div className="about-feature__copy">
                <span className="about-feature__eyebrow">Pourquoi j'ai créé ce site ? </span>
                <h2 className="about-feature__title">
                  J'ai voulu créer un espace simple, doux et organisé pour avancer en paix.
                </h2>
                <div className="about-feature__text">
                  {firstStoryPart.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                  <p className="about-feature__pull">
                    {secondStoryPart[0]}
                  </p>
                  {secondStoryPart.slice(1).map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </div>
              <figure className="about-feature__media">
                <img src={portrait} alt="Portrait de la créatrice du site" loading="lazy" decoding="async" />
              </figure>
            </div>
          </article>
        </div>
        <section className="about-values" aria-label="Valeurs du site">
          <p className="values-intro">Les valeurs du site sont :</p>
          <div className="values-stack">
            {siteValues.map((value) => (
              <article className="value-block" key={value.title}>
                <img src={value.image} alt={value.imageAlt} loading="lazy" decoding="async" />
                <h3>{value.title}</h3>
                {value.description.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage
