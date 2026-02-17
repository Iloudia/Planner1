import { useEffect, useState } from "react"
import PageHeading from "../../components/PageHeading"
import faqPortrait from "../../assets/maria-bolinder-dupe.jpeg"
import "./FaqPage.css"

type FaqItem = {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: "Est-ce que Me&rituals est gratuit ?",
    answer:
      "Oui, le projet est disponible librement pour tâ€™accompagner au quotidien. De nouvelles fonctionnalitÃ©s arrivent rÃ©guliÃ¨rement pour enrichir ton expÃ©rience.",
  },
  {
    question: "Comment sauvegarder mes donnÃ©es ?",
    answer:
      "Tes notes restent enregistrÃ©es localement sur ton appareil. Pour plus de sÃ©curitÃ©, exporte les informations clÃ©s afin dâ€™en garder une copie personnelle.",
  },
  {
    question: "Puis-je suggÃ©rer des idÃ©es ?",
    answer:
      "Bien sÃ»r ! Jâ€™adore recevoir vos retours. Ã‰cris-moi via la page contact pour partager tes envies et inspirer les prochaines Ã©volutions du Planner.",
  },
  {
    question: "Planner fonctionne-t-il hors connexion ?",
    answer:
      "Oui. Les pages restent accessibles mÃªme sans connexion car les donnÃ©es sont gardÃ©es dans ton navigateur. Reviens en ligne rÃ©guliÃ¨rement pour profiter des mises Ã  jour.",
  },
]

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    document.body.classList.add("faq-page--lux")
    return () => {
      document.body.classList.remove("faq-page--lux")
    }
  }, [])

  return (
    <>
      <PageHeading eyebrow="FAQ" title="FAQ" className="faq-header" />
      <div className="faq-wrapper">
        <div className="legal-page faq-page">
          <p className="legal-page__intro">Toutes les rÃ©ponses essentielles pour tirer le meilleur du Planner.</p>

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
                      {isOpen ? "-" : "+"}
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
    </>
  )
}

export default FAQPage
