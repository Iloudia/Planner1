import { useEffect, useState } from "react"
import PageHeading from "../../components/PageHeading"
import "./ContactPage.css"

const ContactPage = () => {
  const [isContactLoading, setIsContactLoading] = useState(true)

  useEffect(() => {
    document.body.classList.add("legal-page--lux")
    return () => {
      document.body.classList.remove("legal-page--lux")
    }
  }, [])

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsContactLoading(false)
    })
    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  if (isContactLoading) {
    return (
      <div className="legal-page contact-page contact-page--loading" aria-busy="true" aria-live="polite">
        <span className="contact-loading-a11y" role="status">
          Chargement
        </span>
      </div>
    )
  }

  return (
    <>
      <PageHeading eyebrow="Contact" title="Contacte-moi" className="contact-page__header" />
      <div className="legal-page contact-page">
        <p className="legal-page__intro">
          Une idée, une question ou envie de collaborer ? Laisse-moi un message et je te répondrai avec grand plaisir.
        </p>

        <section className="legal-section contact-form">
          <form
            className="contact-form__body"
            onSubmit={(event) => {
              event.preventDefault()
              window.alert("Merci pour ton message ! Je te répondrai très vite.")
            }}
          >
            <label>
              <span>Prénom</span>
              <input type="text" name="firstName" placeholder="Ex. Sofia" required />
            </label>
            <label>
              <span>Nom</span>
              <input type="text" name="lastName" placeholder="Ex. Martin" required />
            </label>
            <label className="contact-form__field--full">
              <span>Email</span>
              <input type="email" name="email" placeholder="toi@exemple.com" required />
            </label>
            <label className="contact-form__field--full">
              <span>Sujet</span>
              <input type="text" name="subject" placeholder="De quoi souhaites-tu parler ?" required />
            </label>
            <label className="contact-form__field--full">
              <span>Message</span>
              <textarea name="message" placeholder="Écris ton message ici..." rows={5} required />
            </label>
            <button type="submit" className="contact-form__submit">
              Envoyer
            </button>
          </form>
        </section>
      </div>
    </>
  )
}

export default ContactPage
