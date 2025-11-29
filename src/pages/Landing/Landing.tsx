import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import heroIllustration from "../../assets/MoodBoard.png"
import plannerPreview from "../../assets/planner-02.jpg"
import mindfulPreview from "../../assets/planner-04.jpg"
import journalPreview from "../../assets/planner-09.jpg"
import "./Landing.css"

type LandingAuthProps = {
  onOpenAuth?: (mode: "login" | "register") => void
}

const LandingPage = ({ onOpenAuth }: LandingAuthProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, userEmail, logout } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const destinationPath = useMemo(() => {
    const fromRoute = location.state as { from?: { pathname: string } } | undefined
    return fromRoute?.from?.pathname ?? "/home"
  }, [location.state])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destinationPath, { replace: true })
    }
  }, [destinationPath, isAuthenticated, navigate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const didLogin = login({ email, password, remember: true })
    if (!didLogin) {
      setError("Merci de renseigner un email et un mot de passe valides.")
      return
    }
    setError("")
    setIsModalOpen(false)
    setEmail("")
    setPassword("")
    navigate(destinationPath, { replace: true })
  }

  return (
    <div className="landing-page">
      <div className="page-accent-bar" aria-hidden="true" />
      <section className="landing-hero">
        <div className="landing-hero__content">
          <span className="landing-hero__tagline">Un espace pour planifier en douceur</span>
          <h1>
            Planner t'accompagne pour une vie organisée, alignée sur tes envies et pleine de douceur.
          </h1>
          <p>
            Retrouve en un coup d'oeil tes routines, ton journal, tes finances et tout ce qui nourrit ton équilibre. Tu
            peux t'inscrire ou te connecter en quelques secondes pour accéder à ton espace personnalisé.
          </p>
          <div className="landing-hero__actions">
            <button type="button" className="landing-cta-button" onClick={() => setIsModalOpen(true)}>
              Connexion ou inscription
            </button>
            {isAuthenticated ? (
              <button type="button" className="landing-secondary-button" onClick={() => navigate("/home")}>
                Reprendre ma planification
              </button>
            ) : null}
          </div>
          {isAuthenticated ? (
            <div className="landing-hero__status">
              Connecté en tant que <strong>{userEmail}</strong>
              <button type="button" onClick={logout}>
                Se déconnecter
              </button>
            </div>
          ) : null}
        </div>
        <div className="landing-hero__visual">
          <img src={heroIllustration} alt="Moodboard Planner" />
        </div>
      </section>

      <section className="landing-features" aria-labelledby="landing-features-title">
        <h2 id="landing-features-title">Tout ce que tu peux retrouver dans Planner</h2>
        <div className="landing-feature-grid">
          <article className="landing-feature-card">
            <img src={plannerPreview} alt="Aperçu du calendrier Planner" />
            <h3>Un agenda pastel qui te ressemble</h3>
            <p>
              Visualise ton mois, organise tes journées et ajoute des routines bien-être pour garder le cap sans stress.
            </p>
          </article>
          <article className="landing-feature-card">
            <img src={mindfulPreview} alt="Prévisualisation de l'espace self-love" />
            <h3>Prends soin de toi</h3>
            <p>
              Des espaces dédiés à la gratitude, à tes activités préférées et à la thérapie pour nourrir ton équilibre mental.
            </p>
          </article>
          <article className="landing-feature-card">
            <img src={journalPreview} alt="Capture d'écran du journal" />
            <h3>Un journal intime et guidé</h3>
            <p>Capture tes pensées, tes leçons du jour et tes intentions pour demain. Ton carnet reste à portée de main.</p>
          </article>
        </div>
      </section>

      <section className="landing-onboarding" aria-labelledby="landing-onboarding-title">
        <h2 id="landing-onboarding-title">Comment ça marche ?</h2>
        <ol className="landing-steps">
          <li>
            <strong>Inscris-toi ou connecte-toi.</strong> Tu as juste besoin d'un email et d'un mot de passe.
          </li>
          <li>
            <strong>Découvre ton tableau de bord.</strong> Accède aux pages Planner, activités, journal et davantage.
          </li>
          <li>
            <strong>Personnalise ton expérience.</strong> Ajoute tes cartes favorites, planifie et suis tes progrès.
          </li>
        </ol>
      </section>

      {isModalOpen ? (
        <div className="landing-auth-modal" role="dialog" aria-modal="true" aria-labelledby="landing-auth-title">
          <div className="landing-auth-modal__backdrop" onClick={() => setIsModalOpen(false)} />
          <div className="landing-auth-modal__content">
            <header>
              <h2 id="landing-auth-title">Connexion ou inscription</h2>
              <p>Entre ton email et un mot de passe pour rejoindre Planner.</p>
            </header>
            <form onSubmit={handleSubmit} className="landing-auth-form">
              <label htmlFor="landing-auth-email">
                Adresse email
                <input
                  id="landing-auth-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="toi@exemple.com"
                  required
                />
              </label>
              <label htmlFor="landing-auth-password">
                Mot de passe
                <input
                  id="landing-auth-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Crée ton mot de passe"
                  minLength={6}
                  required
                />
              </label>
              {error ? <p className="landing-auth-form__error">{error}</p> : null}
              <div className="landing-auth-form__actions">
                <button type="submit">Accéder à Planner</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default LandingPage
