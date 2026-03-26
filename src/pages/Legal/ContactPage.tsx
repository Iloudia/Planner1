import { type FormEvent, useEffect, useState } from "react"
import PageHeading from "../../components/PageHeading"
import { fetchApi, getApiTargetLabel } from "../../utils/apiUrl"
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
      </div>
    </>
  )
}

export default ContactPage
