import PageHeading from "../../components/PageHeading"
import portrait from "../../assets/madison-hart-dupe.jpeg"
import "./AboutPage.css"

const paragraphs = [
  "Au bout d'un moment, j'ai voulu mieux organiser mes journées. J'ai donc installé plusieurs applications, et je me suis vite rendu compte qu'il fallait payer pour des choses assez simples, comme programmer des événements sur plusieurs jours ou encore changer la couleur des événements.",
  "J'ai alors décidé de coder mon propre planner. À la base, cela ne devait me prendre que deux jours, tout au plus. Puis je me suis dit que je pourrais ajouter une page, puis une autre, et ainsi de suite. En cours de route, j'ai réalisé que je pourrais en faire profiter tout le monde.",
  "C'est pour cette raison que j'ai décidé de créer un véritable site web, et pas seulement quelque chose que je garderais pour moi. C'est ainsi que PLANNER est né.",
  "Ce site est né d'une envie d'aider les autres à mieux organiser leurs journées, à penser un peu plus positivement et à essayer de se réconcilier avec soi-même grâce à quelques exercices simples.",
  "Aimez-vous tel que vous êtes, prenez du temps pour sculpter votre corps, prenez du temps pour faire du journaling et poser toutes vos pensées, négatives comme positives, et vous pourrez observer un grand changement dans votre vie.",
  "Dans ma vie, je me suis longtemps cherchée. Mais s'il y a une chose que je sais avec certitude aujourd'hui, c'est que j'aime aider les gens, et j'espère que ce site en sera la preuve.",
]

const siteValues = [
  {
    title: "Bien-être",
    description: [
      "Créer un espace où l'on peut ralentir, respirer et retrouver un équilibre intérieur.",
      "Un lieu pour apaiser le mental, alléger la charge émotionnelle et cultiver un mieux-être durable.",
    ],
  },
  {
    title: "Bienveillance",
    description: [
      "Apprendre à se parler avec douceur, sans jugement ni auto-critique.",
      "Avancer en se respectant, en s'accueillant pleinement, même dans les moments de doute.",
    ],
  },
  {
    title: "Persévérance",
    description: [
      "Rappeler que chaque petit pas compte.",
      "Continuer d'avancer, même lentement, avec confiance et constance, un jour à la fois.",
    ],
  },
]

const AboutPage = () => (
  <>
    <div className="about-page">
      <div className="about-shell">
        <article className="about-article" aria-label="A propos">
          <PageHeading eyebrow="A propos" title="A propos de moi" />
          <h2>Pourquoi j'ai crée ce site ?</h2>
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </article>
      </div>
      <section className="about-values" aria-label="Valeurs du site">
        <p className="values-intro">Les valeurs du site sont :</p>
        <div className="values-stack">
          {siteValues.map((value) => (
            <article className="value-block" key={value.title}>
              <h3>{value.title}</h3>
              {value.description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </div>
    <div className="page-footer-bar" aria-hidden="true" />
  </>
)

export default AboutPage













