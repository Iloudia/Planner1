import { useEffect } from "react"
import "./ContactPage.css"

const ContactPage = () => {
  useEffect(() => {
    document.body.classList.add("calendar-page--beige")
    return () => {
      document.body.classList.remove("calendar-page--beige")
    }
  }, [])

  return (
  <>
    <div className="legal-page contact-page">
      <span className="sport-header__eyebrow">Contact</span>
      <h1>Contacte-moi</h1>
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
            <span>Prenom</span>
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
    <div className="page-footer-bar" aria-hidden="true" />
  </>
  )
}

export default ContactPage
