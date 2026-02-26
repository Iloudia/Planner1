import { useState, useMemo, useEffect, useRef, useCallback, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"
import { useMoodboard } from "../../context/MoodboardContext"
import "./Auth.css"

const REMEMBER_PREFERENCE_KEY = "planner.auth.remember"
const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"
const EMAIL_HISTORY_KEY = "planner.auth.email_history.v1"
const GENDER_OPTIONS = [
  { value: "", label: "Ne pas préciser" },
  { value: "femme", label: "Femme" },
  { value: "homme", label: "Homme" },
]

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
  const { moodboardSrc } = useMoodboard()

  const [email, setEmail] = useState("")
  const [emailHistory, setEmailHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return []
    }
    try {
      const stored = window.localStorage.getItem(EMAIL_HISTORY_KEY)
      return stored ? (JSON.parse(stored) as string[]) : []
    } catch {
      return []
    }
  })
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
  const [isGenderMenuOpen, setIsGenderMenuOpen] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [registerStep, setRegisterStep] = useState(0)
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
  const genderMenuRef = useRef<HTMLDivElement | null>(null)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const skipAutoRedirectRef = useRef(false)

  const destinationPath = useMemo(() => {
    const fromRoute = location.state as { from?: { pathname: string } } | undefined
    return fromRoute?.from?.pathname ?? "/home"
  }, [location.state])
  const genderLabel = useMemo(
    () => GENDER_OPTIONS.find((option) => option.value === gender)?.label ?? "Ne pas préciser",
    [gender],
  )

  useEffect(() => {
    if (isAuthenticated) {
      if (mode === "register" && skipAutoRedirectRef.current) {
        return
      }
      navigate(destinationPath, { replace: true })
    }
  }, [destinationPath, isAuthenticated, mode, navigate])

  useEffect(() => {
    document.body.classList.add("auth-page--lux")
    return () => {
      document.body.classList.remove("auth-page--lux")
    }
  }, [])

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
      callback: async (response: { credential?: string }) => {
        if (!response?.credential) return
        const success = await loginWithGoogle(response.credential)
        if (success) {
          navigate(destinationPath, { replace: true })
        } else {
          setError("Connexion Google impossible. Merci de réessayer.")
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
    if (!isGenderMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (genderMenuRef.current && !genderMenuRef.current.contains(target)) {
        setIsGenderMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isGenderMenuOpen])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem(REMEMBER_PREFERENCE_KEY, remember ? "true" : "false")
  }, [remember])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    try {
      window.localStorage.setItem(EMAIL_HISTORY_KEY, JSON.stringify(emailHistory))
    } catch {
      // ignore
    }
  }, [emailHistory])

  useEffect(() => {
    setRegisterStep(0)
    setError("")
  }, [mode])

  const profileKeyFor = useCallback(
    (emailValue: string) => buildUserScopedKey(normalizeUserEmail(emailValue), PROFILE_STORAGE_KEY),
    [],
  )

  const rememberEmail = (emailValue: string) => {
    const normalized = emailValue.trim()
    if (!normalized) return
    setEmailHistory((prev) => {
      if (prev[0] === normalized) return prev
      const filtered = prev.filter((value) => value !== normalized)
      return [normalized, ...filtered].slice(0, 5)
    })
  }

  const persistProfileData = (emailValue: string) => {
    try {
      const existing = localStorage.getItem(profileKeyFor(emailValue))
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
      localStorage.setItem(profileKeyFor(emailValue), JSON.stringify(payload))
    } catch {
      // ignore
    }
  }

  const handleEmailBlur = () => {
    rememberEmail(email)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (mode === "register") {
      const hasMinLength = password.trim().length >= 6
      const hasUpper = /[A-Z]/.test(password)
      const hasLower = /[a-z]/.test(password)
      const hasDigit = /\d/.test(password)
      const hasSpecial = /[!@#$%^&*\-_?]/.test(password)

      if (registerStep === 0) {
        if (!email.trim()) {
          setError("Merci de renseigner un email.")
          return
        }
        setRegisterStep(1)
        return
      }
      if (registerStep === 1) {
        if (!firstName.trim() || !lastName.trim() || !username.trim()) {
          setError("Merci de renseigner le prénom, le nom et le pseudo.")
          return
        }
        setRegisterStep(2)
        return
      }
      if (!password.trim() || !hasMinLength || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        setError("Le mot de passe doit avoir au moins 6 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.")
        return
      }
      if (!acceptTerms) {
        setError("Merci d’accepter les conditions générales.")
        return
      }
    }

    if (mode === "register") {
      skipAutoRedirectRef.current = true
    }
    const success =
      mode === "login"
        ? await login({ email, password, remember })
        : await register({
          email,
          password,
          remember,
          profile: {
            firstName,
            lastName,
            username,
            birthday,
            gender,
            acceptTerms,
          },
        })
    if (!success) {
      skipAutoRedirectRef.current = false
      setError(mode === "register" ? "Un compte existe déjà avec cet email." : "Merci de renseigner un email et un mot de passe valides.")
      return
    }
    if (mode === "register") {
      persistProfileData(email)
    }
    rememberEmail(email)
    setError("")
    if (mode === "register") {
      navigate("/bienvenue", { replace: true, state: { from: destinationPath } })
      return
    }
    navigate(destinationPath, { replace: true })
  }

  const handleForgot = () => {
    if (!email.trim()) {
      setError("Renseigne ton email pour recevoir un lien de réinitialisation.")
      return
    }
    setError("")
    window.alert("Un lien de réinitialisation a été envoyé à " + email + ".")
  }

  const heading = mode === "login" ? "Connexion" : "Création de compte"
  const switchLabel = mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"
  const switchTo = mode === "login" ? "/register" : "/login"
  const isRegister = mode === "register"
  const registerSteps = ["Email", "Identité", "Sécurité"]
  const ctaLabel = mode === "login" ? "Se connecter" : registerStep >= registerSteps.length - 1 ? "Créer mon compte" : "Continuer"

  return (
    <div className="auth-page">

      <div className="auth-hero">
        <div className="auth-visual">
          <img src={moodboardSrc} alt="Moodboard Planner" />
        </div>
        <div className="auth-panel">
          <h1 className="auth-title">{heading}</h1>
          <div className="auth-switch">
            <span>{switchLabel}</span>
            <Link to={switchTo}>{mode === "login" ? "Créer un compte" : "Se connecter"}</Link>
          </div>

          {isAuthenticated && mode !== "register" ? (
            <p className="auth-status">
              Connecté en tant que <strong>{userEmail}</strong>
            </p>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister ? (
              <div className="auth-steps" aria-label="Progression de création de compte">
                {registerSteps.map((label, index) => (
                  <div key={label} className={`auth-step${registerStep === index ? " is-active" : registerStep > index ? " is-done" : ""}`}>
                    <span className="auth-step__index">{index + 1}</span>
                    <span className="auth-step__label">{label}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {mode === "register" ? (
              <>
                {registerStep === 0 ? (
                  <label>
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={handleEmailBlur}
                      placeholder="toi@exemple.com"
                      required
                      autoComplete="email"
                      list="auth-email-history"
                    />
                    {emailHistory.length > 0 ? (
                      <datalist id="auth-email-history">
                        {emailHistory.map((savedEmail) => (
                          <option key={savedEmail} value={savedEmail} />
                        ))}
                      </datalist>
                    ) : null}
                  </label>
                ) : null}

                {registerStep === 1 ? (
                  <>
                    <div className="auth-form__row">
                      <label>
                        Prénom
                        <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Prénom" required />
                      </label>
                      <label>
                        Nom
                        <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Nom" required />
                      </label>
                    </div>
                    <label>
                      Pseudo
                      <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Ton pseudo" required />
                    </label>
                  </>
                ) : null}

                {registerStep === 2 ? (
                  <>
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
                      <p className="auth-password-hint">
                        6 caractères minimum, avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.
                      </p>
                    </label>
                    <div className="auth-form__row">
                      <label>
                        Anniversaire
                        <input type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} required />
                      </label>
                      <label>
                        Genre
                        <div className="auth-form__select" ref={genderMenuRef}>
                          <button
                            type="button"
                            className={gender ? "auth-form__select-trigger" : "auth-form__select-trigger is-placeholder"}
                            aria-haspopup="listbox"
                            aria-expanded={isGenderMenuOpen}
                            onClick={() => setIsGenderMenuOpen((prev) => !prev)}
                          >
                            <span>{genderLabel}</span>
                            <svg className="auth-form__select-chevron" viewBox="0 0 20 20" aria-hidden="true">
                              <path
                                d="M5 7.5L10 12.5L15 7.5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          {isGenderMenuOpen ? (
                            <div className="auth-form__select-menu" role="listbox">
                              {GENDER_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  role="option"
                                  aria-selected={gender === option.value}
                                  className={gender === option.value ? "is-selected" : undefined}
                                  onMouseDown={(event) => {
                                    event.preventDefault()
                                    setGender(option.value)
                                    setIsGenderMenuOpen(false)
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </label>
                    </div>
                    <label className="auth-terms">
                      <input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} required />
                      J’accepte les conditions générales.
                    </label>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <label>
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={handleEmailBlur}
                    placeholder="toi@exemple.com"
                    required
                    autoComplete="email"
                    list="auth-email-history"
                  />
                </label>
                {emailHistory.length > 0 ? (
                  <datalist id="auth-email-history">
                    {emailHistory.map((savedEmail) => (
                      <option key={savedEmail} value={savedEmail} />
                    ))}
                  </datalist>
                ) : null}
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
              </>
            )}

            {error ? <p className="auth-error">{error}</p> : null}

            {mode === "login" ? (
              <>
                <label className="auth-remember">
                  <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
                  Se souvenir de moi
                </label>
                <button type="submit" className="auth-submit">
                  {ctaLabel}
                </button>
                <button type="button" className="auth-forgot" onClick={handleForgot}>
                  Mot de passe oublié ?
                </button>
              </>
            ) : (
              <div className="auth-step-actions">
                {registerStep > 0 ? (
                  <button type="button" className="auth-secondary" onClick={() => setRegisterStep((prev) => Math.max(prev - 1, 0))}>
                    Retour
                  </button>
                ) : null}
                <button type="submit" className="auth-submit">
                  {ctaLabel}
                </button>
              </div>
            )}
          </form>

          <div className="auth-google">
            <div ref={googleButtonRef} />
            {!googleClientId ? <p className="auth-google__hint">Ajoute VITE_GOOGLE_CLIENT_ID pour activer Google.</p> : null}
          </div>
        </div>
      </div>
</div>
  )
}

export default AuthPage