import "./ContactPage.css"

const ContactPage = () => (
  
  <div className="legal-page contact-page">
    <div className="page-accent-bar" aria-hidden="true" />
    <header className="legal-page__header">
      <p className="legal-page__eyebrow">Contact</p>
      <h1 className="legal-page__title">Ecrire a Planner</h1>
      <p className="legal-page__intro">
        Une idee, une question ou envie de collaborer ? Laisse-moi un message et je te repondrai avec grand plaisir.
      </p>
    </header>

    <section className="legal-section contact-form">
      <h2 className="legal-section__title">Envoyer un message</h2>
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

    <section className="legal-section">
      <h2 className="legal-section__title">Autres moyens</h2>
      <p className="legal-section__text">
        Tu peux egalement m ecrire en message prive sur Instagram @planner.app pour un echange rapide et spontane, ou a{" "}
        <a href="mailto:contact@planner.app">contact@planner.app</a>.
      </p>
    </section>

    <div className="page-footer-bar" aria-hidden="true" />
  </div>
)

export default ContactPage
