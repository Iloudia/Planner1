import { useEffect } from "react"
import PageHeading from "../../components/PageHeading"
import portrait from "../../assets/madison-hart-dupe.jpeg"
import valuePhotoTwo from "../../assets/maria-bolinder-dupe.jpeg"
import valuePhotoThree from "../../assets/monica-r-dupe.jpeg"
import "./AboutPage.css"

const firstStoryPart = [
  "Au bout d'un moment, j'ai voulu mieux organiser mes journees. J'ai donc installe plusieurs applications, et je me suis vite rendu compte qu'il fallait payer pour des choses assez simples, comme programmer des evenements sur plusieurs jours ou encore changer la couleur des evenements.",
  "J'ai alors decide de coder mon propre planner. A la base, cela ne devait me prendre que deux jours, tout au plus. Puis je me suis dit que je pourrais ajouter une page, puis une autre, et ainsi de suite. En cours de route, j'ai realise que je pourrais en faire profiter tout le monde.",
  "C'est pour cette raison que j'ai decide de creer un veritable site web, et pas seulement quelque chose que je garderais pour moi. C'est ainsi que PLANNER est ne.",
]

const secondStoryPart = [
  "Ce site est ne d'une envie d'aider les autres a mieux organiser leurs journees, a penser un peu plus positivement et a essayer de se reconcilier avec soi-meme grace a quelques exercices simples.",
  "Aimez-vous tel que vous etes, prenez du temps pour sculpter votre corps, prenez du temps pour faire du journaling et poser toutes vos pensees, negatives comme positives, et vous pourrez observer un grand changement dans votre vie.",
  "Dans ma vie, je me suis longtemps cherchee. Mais s'il y a une chose que je sais avec certitude aujourd'hui, c'est que j'aime aider les gens, et j'espere que ce site en sera la preuve.",
]

const siteValues = [
  {
    title: "Bien-etre",
    image: portrait,
    imageAlt: "Portrait inspiration bien-etre",
    description: [
      "Creer un espace ou l'on peut ralentir, respirer et retrouver un equilibre interieur.",
      "Un lieu pour apaiser le mental, alleger la charge emotionnelle et cultiver un mieux-etre durable.",
    ],
  },
  {
    title: "Bienveillance",
    image: valuePhotoTwo,
    imageAlt: "Portrait inspiration bienveillance",
    description: [
      "Apprendre a se parler avec douceur, sans jugement ni auto-critique.",
      "Avancer en se respectant, en s'accueillant pleinement, meme dans les moments de doute.",
    ],
  },
  {
    title: "Perseverance",
    image: valuePhotoThree,
    imageAlt: "Portrait inspiration perseverance",
    description: [
      "Rappeler que chaque petit pas compte.",
      "Continuer d'avancer, meme lentement, avec confiance et constance, un jour a la fois.",
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
          <PageHeading eyebrow="A propos" title="A propos de moi" />
          <article className="about-article" aria-label="A propos">
            <section className="about-story-block">
              <div className="about-story-block__media">
                <img src={portrait} alt="Portrait de la creatrice du site" />
              </div>
              <div className="about-story-block__content">
                <h2>Pourquoi j'ai cree ce site ?</h2>
                {firstStoryPart.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </section>

            <section className="about-story-block about-story-block--reverse">
              <div className="about-story-block__content">
                {secondStoryPart.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
              <div className="about-story-block__media">
                <img src={valuePhotoTwo} alt="Photo inspiration bienveillance" />
              </div>
            </section>
          </article>
        </div>
        <section className="about-values" aria-label="Valeurs du site">
          <p className="values-intro">Les valeurs du site sont :</p>
          <div className="values-stack">
            {siteValues.map((value) => (
              <article className="value-block" key={value.title}>
                <img src={value.image} alt={value.imageAlt} />
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
