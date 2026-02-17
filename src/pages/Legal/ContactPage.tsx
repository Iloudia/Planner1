import { useEffect } from "react"
import PageHeading from "../../components/PageHeading"
import "./ContactPage.css"

const ContactPage = () => {
  useEffect(() => {
    document.body.classList.add("legal-page--lux")
    return () => {
      document.body.classList.remove("legal-page--lux")
    }
  }, [])

  return (
  <>
    <div className="legal-page contact-page">
      <PageHeading eyebrow="Contact" title="Contacte-moi" />
      <p className="legal-page__intro">
        Une idée, une question ou envie de collaborer ? Laisse-moi un message et je te répondrai avec grand plaisir.
      </p>

      <section className="legal-section contact-form">
        <form
          className="contact-form__body"
          onSubmit={(event) => {
            event.preventDefault()
            window.alert("Merci pour ton message ! Je te repondrai tres vite.")
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
            <textarea name="message" placeholder="Ecris ton message ici..." rows={5} required />
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

