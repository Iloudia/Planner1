import { useState, useMemo, useEffect, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import heroIllustration from "../../assets/MoodBoard.png"
import "./Auth.css"

type AuthMode = "login" | "register"

type AuthFormProps = {
  mode: AuthMode
}

const AuthPage = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, register, userEmail } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
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
    const success = mode === "login" ? login({ email, password, remember }) : register({ email, password, remember })
    if (!success) {
      setError("Merci de renseigner un email et un mot de passe valides.")
      return
    }
    setError("")
    navigate(destinationPath, { replace: true })
  }

  const handleForgot = () => {
    if (!email.trim()) {
      setError("Renseigne ton email pour recevoir un lien de réinitialisation.")
      return
    }
    setError("")
    window.alert(`Un lien de réinitialisation a été envoyé à ${email}.`)
  }

  const heading = mode === "login" ? "Connexion" : "Création de compte"
  const ctaLabel = mode === "login" ? "Se connecter" : "Créer mon compte"
  const switchLabel = mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"
  const switchTo = mode === "login" ? "/register" : "/login"

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-visual">
          <img src={heroIllustration} alt="Moodboard Planner" />
        </div>
        <div className="auth-panel">
          <h1 className="auth-title">{heading}</h1>
          <p className="auth-lead">
            Accède à ton espace Planner : routines, journal, finances et plus encore. Connecte-toi ou crée un compte en
            quelques secondes.
          </p>

          {isAuthenticated ? (
            <p className="auth-status">
              Connecté en tant que <strong>{userEmail}</strong>
            </p>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
                required
              />
            </label>
            <label>
              Mot de passe
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </label>
            {error ? <p className="auth-error">{error}</p> : null}
            <label className="auth-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Se souvenir de moi
            </label>
            <button type="button" className="auth-forgot" onClick={handleForgot}>
              Mot de passe oublié ?
            </button>
            <button type="submit" className="auth-submit">
              {ctaLabel}
            </button>
          </form>

          <div className="auth-switch">
            <span>{switchLabel}</span>
            <Link to={switchTo}>{mode === "login" ? "Créer un compte" : "Se connecter"}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
