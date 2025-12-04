import { useState, useMemo, useEffect, useRef, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import heroIllustration from "../../assets/MoodBoard.png"
import "./Auth.css"

const REMEMBER_PREFERENCE_KEY = "planner.auth.remember"
const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"

type AuthMode = "login" | "register"

type AuthFormProps = {
  mode: AuthMode
}

const EyeIcon = ({ crossed }: { crossed?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {crossed ? (
      <>
        <path
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.21 16.058 7 19 11.478 19c1.805 0 3.508-.43 5.02-1.196"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M6.228 6.228A10.45 10.45 0 0111.478 5c4.477 0 8.268 2.943 9.543 7a10.523 10.523 0 01-4.03 5.56"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M15 12a3 3 0 00-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ) : (
      <>
        <path
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    )}
  </svg>
)

declare global {
  interface Window {
    google?: any
  }
}

const AuthPage = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, register, userEmail, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }
    return window.localStorage.getItem(REMEMBER_PREFERENCE_KEY) === "true"
  })
  const [error, setError] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [birthday, setBirthday] = useState("")
  const [gender, setGender] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const destinationPath = useMemo(() => {
    const fromRoute = location.state as { from?: { pathname: string } } | undefined
    return fromRoute?.from?.pathname ?? "/home"
  }, [location.state])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destinationPath, { replace: true })
    }
  }, [destinationPath, isAuthenticated, navigate])

  useEffect(() => {
    const scriptId = "google-client-script"
    if (document.getElementById(scriptId)) {
      setIsGoogleReady(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.id = scriptId
    script.onload = () => setIsGoogleReady(true)
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isGoogleReady || !googleClientId || !googleButtonRef.current) return
    if (!window.google) return

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response: { credential?: string }) => {
        if (!response?.credential) return
        const success = loginWithGoogle(response.credential)
        if (success) {
          navigate(destinationPath, { replace: true })
        } else {
          setError("Connexion Google impossible. Merci de reessayer.")
        }
      },
    })

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: "100%",
      text: "continue_with",
    })
  }, [destinationPath, googleClientId, isGoogleReady, loginWithGoogle, navigate])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem(REMEMBER_PREFERENCE_KEY, remember ? "true" : "false")
  }, [remember])

  const persistProfileData = (emailValue: string) => {
    try {
      const existing = localStorage.getItem(PROFILE_STORAGE_KEY)
      let payload = existing ? JSON.parse(existing) : {}
      payload = {
        ...payload,
        personalInfo: {
          ...payload.personalInfo,
          firstName,
          lastName,
          email: emailValue,
        },
        identityInfo: {
          ...payload.identityInfo,
          username,
          birthday,
          gender,
        },
      }
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mode === "register" && !acceptTerms) {
      setError("Merci d accepter les conditions generales.")
      return
    }
    const success = mode === "login" ? login({ email, password, remember }) : register({ email, password, remember })
    if (!success) {
      setError("Merci de renseigner un email et un mot de passe valides.")
      return
    }
    if (mode === "register") {
      persistProfileData(email)
    }
    setError("")
    navigate(destinationPath, { replace: true })
  }

  const handleForgot = () => {
    if (!email.trim()) {
      setError("Renseigne ton email pour recevoir un lien de reinitialisation.")
      return
    }
    setError("")
    window.alert("Un lien de reinitialisation a ete envoye a " + email + ".")
  }

  const heading = mode === "login" ? "Connexion" : "Creation de compte"
  const ctaLabel = mode === "login" ? "Se connecter" : "Creer mon compte"
  const switchLabel = mode === "login" ? "Pas encore de compte ?" : "Deja un compte ?"
  const switchTo = mode === "login" ? "/register" : "/login"

  return (
    <div className="auth-page">
      <div className="page-accent-bar" aria-hidden="true" />
      <div className="auth-hero">
        <div className="auth-visual">
          <img src={heroIllustration} alt="Moodboard Planner" />
        </div>
        <div className="auth-panel">
          <h1 className="auth-title">{heading}</h1>
          <p className="auth-lead">
            Accede a ton espace Planner : routines, journal, finances et plus encore. Connecte-toi ou cree un compte en quelques secondes.
          </p>

          {isAuthenticated ? (
            <p className="auth-status">
              Connecte en tant que <strong>{userEmail}</strong>
            </p>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="auth-form__row">
                <label>
                  Prenom
                  <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Prenom" required />
                </label>
                <label>
                  Nom
                  <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Nom" required />
                </label>
              </div>
            )}
            {mode === "register" && (
              <label>
                Pseudo
                <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Ton pseudo" required />
              </label>
            )}
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="toi@exemple.com" required />
            </label>
            <label>
              Mot de passe
              <div className="auth-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={showPassword}
                >
                  <EyeIcon crossed={!showPassword} />
                </button>
              </div>
            </label>
            {mode === "register" && (
              <div className="auth-form__row">
                <label>
                  Anniversaire
                  <input type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} required />
                </label>
                <label>
                  Genre
                  <select value={gender} onChange={(event) => setGender(event.target.value)}>
                    <option value="">Ne pas preciser</option>
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                  </select>
                </label>
              </div>
            )}
            {error ? <p className="auth-error">{error}</p> : null}
            {mode === "register" ? (
              <label className="auth-terms">
                <input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} required />
                J accepte les conditions generales
              </label>
            ) : (
              <label className="auth-remember">
                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                Se souvenir de moi
              </label>
            )}
            {mode === "login" ? (
              <button type="button" className="auth-forgot" onClick={handleForgot}>
                Mot de passe oublie ?
              </button>
            ) : null}
            <button type="submit" className="auth-submit">
              {ctaLabel}
            </button>
          </form>

          <div className="auth-switch">
            <span>{switchLabel}</span>
            <Link to={switchTo}>{mode === "login" ? "Creer un compte" : "Se connecter"}</Link>
          </div>

          <div className="auth-google">
            <div ref={googleButtonRef} />
            {!googleClientId ? <p className="auth-google__hint">Ajoute VITE_GOOGLE_CLIENT_ID pour activer Google.</p> : null}
          </div>
        </div>
      </div>
      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default AuthPage
