import { type FormEvent, useEffect, useState } from "react"
import { fetchApi, getApiTargetLabel } from "../../utils/apiUrl"
import PageLoader from "../../components/PageLoader"
import "./ContactPage.css"

const ContactPage = () => {
  const [isContactLoading, setIsContactLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<{ type: "success" | "error"; message: string } | null>(null)

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitState(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
      website: String(formData.get("website") || ""),
    }

    try {
      const response = await fetchApi("/api/email/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        throw new Error(result?.error || `Serveur email inaccessible (${getApiTargetLabel()}).`)
      }

      form.reset()
      setSubmitState({
        type: "success",
        message: "Merci pour ton message. Il a bien été envoyé.",
      })
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "Impossible d'envoyer le message pour le moment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isContactLoading) {
    return (
      <PageLoader />
    )
  }

  return (
    <>
      <header className="contact-page__heading">
        <div>
          <span className="contact-page__heading-eyebrow">Me</span>
          <h1>contacter</h1>
        </div>
        <p>Une idée, une question ou envie de collaborer ? Laisse-moi un message et je te répondrai avec grand plaisir.</p>
      </header>
      <div className="legal-page contact-page">
        <section className="legal-section contact-form">
          <h2 className="contact-form__title">Envoie-moi un message</h2>
          <form className="contact-form__body" onSubmit={handleSubmit}>
            <label>
              <span>Prénom</span>
              <input type="text" name="firstName" placeholder="Ex. Sofia" required disabled={isSubmitting} />
            </label>
            <label>
              <span>Nom</span>
              <input type="text" name="lastName" placeholder="Ex. Martin" required disabled={isSubmitting} />
            </label>
            <label className="contact-form__field--full">
              <span>Email</span>
              <input type="email" name="email" placeholder="toi@exemple.com" required disabled={isSubmitting} />
            </label>
            <label className="contact-form__field--full">
              <span>Sujet</span>
              <input
                type="text"
                name="subject"
                placeholder="De quoi souhaites-tu parler ?"
                required
                disabled={isSubmitting}
              />
            </label>
            <label className="contact-form__field--full">
              <span>Message</span>
              <textarea
                name="message"
                placeholder="Écris ton message ici..."
                rows={5}
                required
                disabled={isSubmitting}
              />
            </label>
            <label className="contact-form__honeypot" aria-hidden="true" tabIndex={-1}>
              <span>Site web</span>
              <input type="text" name="website" autoComplete="off" tabIndex={-1} />
            </label>
            {submitState ? (
              <p className={`contact-form__status contact-form__status--${submitState.type}`} role="status" aria-live="polite">
                {submitState.message}
              </p>
            ) : null}
            <button type="submit" className="contact-form__submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </section>
        <aside className="contact-info" aria-label="Informations de contact">
          <h2>Informations</h2>
          <section className="contact-info__section">
            <h3>Me contacter</h3>
            <a href="mailto:contact@meandrituals.com">contact@meandrituals.com</a>
          </section>
          <section className="contact-info__section">
            <h3>Collaborations</h3>
            <a href="mailto:contact@meandrituals.com">contact@meandrituals.com</a>
          </section>
          <section className="contact-info__section">
            <h3>Réseaux</h3>
            <a href="https://www.instagram.com/meandrituals?igsh=YmdwbmRmbTB1cW4w&utm_source=qr" target="_blank" rel="noreferrer noopener">
              Instagram
            </a>
          </section>
          <section className="contact-info__section">
            <h3>Temps de réponse</h3>
            <p>Je réponds généralement sous 24 à 48h.</p>
          </section>
        </aside>
      </div>
    </>
  )
}

export default ContactPage
