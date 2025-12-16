import { useState } from "react"
import PageHeading from "../../components/PageHeading"
import faqPortrait from "../../assets/maria-bolinder-dupe.jpeg"
import "./FaqPage.css"

const faqItems = [
  {
    question: "Est-ce que Planner est gratuit ?",
    answer:
      "Oui, le projet est disponible librement pour t accompagner au quotidien. Les nouvelles fonctionnalites sont ajoutees progressivement pour enrichir ton experience.",
  },
  {
    question: "Comment sauvegarder mes donnees ?",
    answer:
      "Tes donnees sont stockees localement sur ton appareil. Pour plus de securite, exporte tes notes importantes afin de conserver une copie personnelle.",
  },
  {
    question: "Puis-je suggerer des idees ?",
    answer:
      "Bien sur ! J adore recevoir vos retours. Ecris-moi via la page contact pour partager tes envies et inspirer les evolutions du Planner.",
  },
  {
    question: "Planner fonctionne-t-il hors connexion ?",
    answer:
      "Oui. Les pages restent accessibles meme sans connexion car les donnees sont gardées dans ton navigateur. Reviens en ligne regulierement pour profiter des mises a jour.",
  },
]

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <div className="page-accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="FAQ" title="FAQ" />
      <div className="faq-wrapper">
        <div className="legal-page faq-page">
          <p className="legal-page__intro">Toutes les reponses essentielles pour tirer le meilleur du Planner.</p>

          <div className="faq-accordion">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index
              return (
                <article key={item.question} className={isOpen ? "faq-item is-open" : "faq-item"}>
                  <button
                    type="button"
                    className="faq-item__header"
                    onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <span>{item.question}</span>
                    <span className="faq-item__icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${index}`}
                    className="faq-item__body"
                    style={{ maxHeight: isOpen ? "280px" : "0px" }}
                  >
                    <p>{item.answer}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
        <figure className="faq-floating-figure" aria-hidden="true">
          <img src={faqPortrait} alt="" loading="lazy" />
        </figure>
      </div>
      <div className="page-footer-bar" aria-hidden="true" />
    </>
  )
}

export default FAQPage
