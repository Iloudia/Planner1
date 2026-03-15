import { useEffect, useState } from "react"
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
  "Prenez du temps pour sculpter votre corps, prenez du temps pour faire du journaling et poser toutes vos pensées, négatives comme positives, et vous pourrez observer un grand changement dans votre vie.",
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
  const [isAboutLoading, setIsAboutLoading] = useState(true)

  useEffect(() => {
    document.body.classList.add("about-page--lux")
    return () => {
      document.body.classList.remove("about-page--lux")
    }
  }, [])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsAboutLoading(false)
    })
    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  if (isAboutLoading) {
    return (
      <div className="about-page about-page--loading" aria-busy="true" aria-live="polite">
        <span className="about-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <>
      <div className="about-page">
        <div className="about-shell">
          <PageHeading eyebrow="À propos" title="À propos de moi" />
          <article className="about-article" aria-label="À propos">
            <div className="about-feature">
              <div className="about-feature__copy">
                <h2 className="about-feature__title">
                  Pourquoi j'ai créé ce site ?
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
          <section className="about-feature__summary" aria-label="Public et proposition">
            <div className="about-feature__summary-block">
              <h3>À qui s'adresse Me&rituals ?</h3>
              <p>
                À celles et ceux qui souhaitent retrouver une organisation plus simple, se recentrer sur l’essentiel et avancer pas à pas vers leurs objectifs personnels.

                Me&rituals s’adresse aux personnes qui veulent mieux structurer leur quotidien, développer de bonnes habitudes et rester motivées dans leurs projets. Grâce à des pages dédiées à l’organisation, au suivi du sport, aux objectifs personnels ou encore aux wishlists, la plateforme aide chacun à clarifier ses priorités et à progresser à son rythme.

                Que ce soit pour améliorer sa productivité, suivre ses routines ou simplement mettre plus d’intention dans son quotidien, Me&rituals accompagne celles et ceux qui veulent construire un mode de vie plus organisé et aligné avec leurs envies.
              </p>
            </div>
            <div className="about-feature__summary-block">
              <h3>Ce que propose le site</h3>
              <p>
                Me&rituals propose des ressources digitales pensées pour t’aider au quotidien : des templates prêts à
                l’emploi pour t’organiser, des supports de journaling pour clarifier tes idées, des guides pratiques pour
                avancer avec méthode, et des produits à télécharger que tu peux utiliser à ton rythme. Tout est conçu
                pour te faire gagner du temps, structurer tes priorités et t’accompagner dans tes projets personnels avec
                simplicité.
              </p>
            </div>
          </section>
        </div>
        <section className="about-values" aria-label="Valeurs du site">
          <h3 className="values-intro">Les valeurs du site sont :</h3>
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
        <section className="about-details" aria-label="À propos en bref">
          <div className="about-details__grid">
            <article className="about-details__card">
              <h3>Me contacter</h3>
              <p>
                Une question ou une idée ? Écris-moi via la page{" "}
                <a className="legal-link" href="/contact">
                  Contact
                </a>
                .
              </p>
            </article>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage
