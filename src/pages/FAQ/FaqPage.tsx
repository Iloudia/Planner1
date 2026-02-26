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
      "Oui, le projet est disponible librement pour t’accompagner au quotidien. De nouvelles fonctionnalités arrivent régulièrement pour enrichir ton expérience.",
  },
  {
    question: "Comment sauvegarder mes données ?",
    answer:
      "Tes notes restent enregistrées localement sur ton appareil. Pour plus de sécurité, exporte les informations clés afin d’en garder une copie personnelle.",
  },
  {
    question: "Puis-je suggérer des idées ?",
    answer:
      "Bien sûr ! J’adore recevoir vos retours. Écris-moi via la page contact pour partager tes envies et inspirer les prochaines évolutions du Planner.",
  },
  {
    question: "Planner fonctionne-t-il hors connexion ?",
    answer:
      "Oui. Les pages restent accessibles même sans connexion, car les données sont gardées dans ton navigateur. Reviens en ligne régulièrement pour profiter des mises à jour.",
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
          <p className="legal-page__intro">Toutes les réponses essentielles pour tirer le meilleur du site.</p>

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