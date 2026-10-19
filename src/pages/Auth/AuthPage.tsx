import { useState, useMemo, useEffect, useRef, useCallback, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCookieConsent } from "../../context/CookieConsentContext"
import { fetchApi } from "../../utils/apiUrl"
import { buildUserScopedKey, normalizeUserEmail } from "../../utils/userScopedKey"
import { useMoodboard } from "../../context/MoodboardContext"
import PageLoader from "../../components/PageLoader"
import "./Auth.css"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"

const REMEMBER_PREFERENCE_KEY = "planner.auth.remember"
const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"
const EMAIL_HISTORY_KEY = "planner.auth.email_history.v1"
const GENDER_OPTIONS = [
  { value: "", labelKey: "auth.unspecified" },
  { value: "femme", labelKey: "auth.woman" },
  { value: "homme", labelKey: "auth.man" },
]

type AuthMode = "login" | "register"
type LoginPanelMode = "login" | "forgot"

type AuthFormProps = {
  mode: AuthMode
}

const getLoginErrorMessage = (t: TFunction, errorCode?: string) => {
  switch (errorCode) {
    case "auth/missing-credentials":
      return t("auth.errors.missingCredentials")
    case "auth/invalid-email":
      return t("auth.errors.invalidEmail")
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return t("auth.errors.wrongCredentials")
    case "auth/user-disabled":
      return t("auth.errors.disabled")
    case "auth/too-many-requests":
      return t("auth.errors.tooMany")
    case "auth/network-request-failed":
      return t("auth.errors.network")
    case "auth/operation-not-allowed":
      return t("auth.errors.loginNotAllowed")
    case "app/account-deleted":
      return t("auth.errors.deleted")
    default:
      return t("auth.errors.loginDefault")
  }
}

const getRegisterErrorMessage = (t: TFunction, errorCode?: string) => {
  switch (errorCode) {
    case "auth/missing-credentials":
      return t("auth.errors.missingCredentials")
    case "auth/invalid-email":
      return t("auth.errors.invalidEmail")
    case "auth/email-already-in-use":
      return t("auth.errors.emailUsed")
    case "auth/weak-password":
      return t("auth.errors.weakPassword")
    case "auth/network-request-failed":
      return t("auth.errors.network")
    case "auth/operation-not-allowed":
      return t("auth.errors.registerNotAllowed")
    default:
      return t("auth.errors.registerDefault")
  }
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

const AuthPage = ({ mode }: AuthFormProps) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthReady, isAuthenticated, login, register, userEmail, loginWithGoogle } = useAuth()
  const { preferences: cookiePreferences, openPreferences } = useCookieConsent()
  const { moodboardSrc } = useMoodboard()

  const [email, setEmail] = useState("")
  const [emailHistory, setEmailHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return []
    }
    if (!cookiePreferences.preferences) {
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
    return cookiePreferences.preferences && window.localStorage.getItem(REMEMBER_PREFERENCE_KEY) === "true"
  })
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [birthday, setBirthday] = useState("")
  const [gender, setGender] = useState("")
  const [isGenderMenuOpen, setIsGenderMenuOpen] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [registerStep, setRegisterStep] = useState(0)
  const [loginPanelMode, setLoginPanelMode] = useState<LoginPanelMode>("login")
  const genderMenuRef = useRef<HTMLDivElement | null>(null)
  const skipAutoRedirectRef = useRef(false)

  const destinationPath = useMemo(() => {
    const fromRoute = location.state as
      | { from?: { pathname?: string; search?: string } | string }
      | undefined
    const from = fromRoute?.from

    if (typeof from === "string" && from.trim()) {
      return from
    }

    if (typeof from !== "string" && from?.pathname) {
      return `${from.pathname}${from.search ?? ""}`
    }

    return "/home"
  }, [location.state])
  const genderLabel = useMemo(
    () => t(GENDER_OPTIONS.find((option) => option.value === gender)?.labelKey ?? "auth.unspecified"),
    [gender, i18n.resolvedLanguage, t],
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
    if (!cookiePreferences.preferences) {
      window.localStorage.removeItem(REMEMBER_PREFERENCE_KEY)
      if (remember) {
        setRemember(false)
      }
      return
    }
    window.localStorage.setItem(REMEMBER_PREFERENCE_KEY, remember ? "true" : "false")
  }, [cookiePreferences.preferences, remember])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    if (!cookiePreferences.preferences) {
      window.localStorage.removeItem(EMAIL_HISTORY_KEY)
      if (emailHistory.length > 0) {
        setEmailHistory([])
      }
      return
    }
    try {
      window.localStorage.setItem(EMAIL_HISTORY_KEY, JSON.stringify(emailHistory))
    } catch {
      // ignore
    }
  }, [cookiePreferences.preferences, emailHistory])

  useEffect(() => {
    setRegisterStep(0)
    setError("")
    setInfo("")
    setLoginPanelMode("login")
  }, [mode])

  const profileKeyFor = useCallback(
    (emailValue: string) => buildUserScopedKey(normalizeUserEmail(emailValue), PROFILE_STORAGE_KEY),
    [],
  )

  const rememberEmail = (emailValue: string) => {
    if (!cookiePreferences.preferences) return
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
    setInfo("")
    const normalizedEmail = email.trim()

    if (mode === "register") {
      const hasMinLength = password.trim().length >= 6
      const hasUpper = /[A-Z]/.test(password)
      const hasLower = /[a-z]/.test(password)
      const hasDigit = /\d/.test(password)
      const hasSpecial = /[!@#$%^&*\-_?]/.test(password)

      if (registerStep === 0) {
        if (!normalizedEmail) {
          setError(t("auth.errors.emailRequired"))
          return
        }
        setRegisterStep(1)
        return
      }
      if (registerStep === 1) {
        if (!firstName.trim() || !lastName.trim() || !username.trim()) {
          setError(t("auth.errors.identityRequired"))
          return
        }
        setRegisterStep(2)
        return
      }
      if (!password.trim() || !hasMinLength || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        setError(t("auth.errors.passwordRules"))
        return
      }
      if (!acceptTerms) {
        setError(t("auth.errors.termsRequired"))
        return
      }
    }

    if (mode === "register") {
      skipAutoRedirectRef.current = true
    }
    const attempt =
      mode === "login"
        ? await login({ email: normalizedEmail, password, remember: remember && cookiePreferences.preferences })
        : await register({
          email: normalizedEmail,
          password,
          remember: remember && cookiePreferences.preferences,
          profile: {
            firstName,
            lastName,
            username,
            birthday,
            gender,
            acceptTerms,
          },
        })
    if (!attempt.success) {
      skipAutoRedirectRef.current = false
      setError(
        mode === "register" ? getRegisterErrorMessage(t, attempt.errorCode) : getLoginErrorMessage(t, attempt.errorCode),
      )
      return
    }
    if (mode === "register") {
      persistProfileData(normalizedEmail)
    }
    rememberEmail(normalizedEmail)
    setError("")
    if (mode === "register") {
      navigate("/bienvenue", { replace: true, state: { from: destinationPath } })
      return
    }
    navigate(destinationPath, { replace: true })
  }

  const handleForgot = () => {
    setError("")
    setInfo("")
    setLoginPanelMode("forgot")
  }

  const handleForgotSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setInfo("")
    const normalizedEmail = email.trim()
    if (!normalizedEmail) {
      setError(t("auth.errors.resetEmailRequired"))
      return
    }

    try {
      const response = await fetchApi("/api/email/password-reset/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload?.error || t("auth.errors.resetFailed"))
      }
      rememberEmail(normalizedEmail)
      setInfo(payload?.message || t("auth.resetSent"))
    } catch (error) {
      setError(error instanceof Error ? error.message : t("auth.errors.resetFailed"))
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    const attempt = await loginWithGoogle()
    if (!attempt.success) {
      setError(getLoginErrorMessage(t, attempt.errorCode))
      return
    }
    navigate(destinationPath, { replace: true })
  }

  const heading = mode === "login" ? t("auth.login") : t("auth.register")
  const panelHeading = mode === "login" && loginPanelMode === "forgot" ? t("auth.forgotTitle") : heading
  const switchLabel = mode === "login" ? t("auth.noAccount") : t("auth.hasAccount")
  const switchTo = mode === "login" ? "/register" : "/login"
  const ctaLabel = mode === "login" ? t("header.login") : registerStep < 2 ? t("auth.continue") : t("auth.createMyAccount")
  const isRegister = mode === "register"
  const registerSteps = [t("auth.email"), t("auth.identity"), t("auth.security")]
  
  const isAuthPageLoading = !isAuthReady

  if (isAuthPageLoading) {
    return (
      <PageLoader />
    )
  }
  return (
    <div className={`auth-page auth-page--modern auth-page--${mode}`}>

      <div className="auth-hero">
        <div className="auth-visual">
          <img src={moodboardSrc} alt={t("auth.moodboardAlt")} loading="eager" decoding="async" />
          <div className="auth-visual__caption">
            <span>Planner</span>
            <p>{mode === "login" ? t("auth.loginCaption") : t("auth.registerCaption")}</p>
          </div>
        </div>
        <div className="auth-panel">
          <header className="auth-panel__header">
            {mode === "login" && loginPanelMode === "login" ? <span className="auth-panel__eyebrow">{t("auth.welcomeBack")}</span> : null}
            {mode === "register" ? <span className="auth-panel__eyebrow">{t("auth.designedForYou")}</span> : null}
            <h1 className="auth-title">{panelHeading}</h1>
            {mode === "login" && loginPanelMode === "login" ? (
              <p className="auth-panel__intro">{t("auth.loginIntro")}</p>
            ) : null}
            {mode === "register" ? (
              <p className="auth-panel__intro">{t("auth.registerIntro")}</p>
            ) : null}
            {mode === "login" && loginPanelMode === "forgot" ? (
              <p className="auth-lead">{t("auth.forgotIntro")}</p>
            ) : (
              <div className="auth-switch">
                <span>{switchLabel}</span>
                <Link to={switchTo}>{mode === "login" ? t("auth.createAccount") : t("header.login")}</Link>
              </div>
            )}
          </header>

          {isAuthenticated && mode !== "register" ? (
            <p className="auth-status">
              {t("auth.signedInAs")} <strong>{userEmail}</strong>
            </p>
          ) : null}

          {mode === "login" && loginPanelMode === "forgot" ? (
            <form className="auth-form" onSubmit={handleForgotSubmit}>
              <label>
                {t("auth.email")}
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

              {error ? <p className="auth-error">{error}</p> : null}
              {info ? <p className="auth-info">{info}</p> : null}

              <div className="auth-step-actions auth-step-actions--spread">
                <button
                  type="button"
                  className="auth-secondary"
                  onClick={() => {
                    setLoginPanelMode("login")
                    setError("")
                    setInfo("")
                  }}
                >
                  {t("auth.backToLogin")}
                </button>
                <button type="submit" className="auth-submit">
                  {t("auth.sendLink")}
                </button>
              </div>
            </form>
          ) : (
            <>
              <form className="auth-form" onSubmit={handleSubmit}>
                {isRegister ? (
                  <div className="auth-steps" aria-label={t("auth.createProgress")}>
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
                        {t("auth.email")}
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
                            {t("auth.firstName")}
                            <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder={t("auth.firstName")} required />
                          </label>
                          <label>
                            {t("auth.lastName")}
                            <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder={t("auth.lastName")} required />
                          </label>
                        </div>
                        <label>
                          {t("auth.username")}
                          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={t("auth.usernamePlaceholder")} maxLength={15} required />
                        </label>
                      </>
                    ) : null}

                    {registerStep === 2 ? (
                      <>
                        <label>
                          {t("auth.password")}
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
                              aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                              aria-pressed={showPassword}
                            >
                              <EyeIcon crossed={!showPassword} />
                            </button>
                          </div>
                          <p className="auth-password-hint">
                            {t("auth.passwordHint")}
                          </p>
                        </label>
                        <div className="auth-form__row">
                          <label>
                            {t("auth.birthday")}
                            <input type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} required />
                          </label>
                          <label>
                            {t("auth.gender")}
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
                                      {t(option.labelKey)}
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </label>
                        </div>
                        <label className="auth-terms">
                          <input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} required />
                          {t("auth.acceptTerms")}
                        </label>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <label>
                      {t("auth.email")}
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
                      {t("auth.password")}
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
                          aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                          aria-pressed={showPassword}
                        >
                          <EyeIcon crossed={!showPassword} />
                        </button>
                      </div>
                    </label>
                  </>
                )}

                {error ? <p className="auth-error">{error}</p> : null}
                {info ? <p className="auth-info">{info}</p> : null}

                {mode === "login" ? (
                  <>
                    <label className="auth-remember">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => {
                          if (event.target.checked && !cookiePreferences.preferences) {
                            openPreferences()
                            return
                          }
                          setRemember(event.target.checked)
                        }}
                      />
                      {t("auth.rememberMe")}
                    </label>
                    <button type="submit" className="auth-submit">
                      {ctaLabel}
                    </button>
                    <button type="button" className="auth-forgot" onClick={handleForgot}>
                      {t("auth.forgotPassword")}
                    </button>
                  </>
                ) : (
                  <div className="auth-step-actions">
                    {registerStep > 0 ? (
                      <button type="button" className="auth-secondary" onClick={() => setRegisterStep((prev) => Math.max(prev - 1, 0))}>
                        {t("auth.back")}
                      </button>
                    ) : null}
                    <button type="submit" className="auth-submit">
                      {ctaLabel}
                    </button>
                  </div>
                )}
              </form>

              <div className="auth-google">
                <button type="button" className="auth-secondary auth-google__button" onClick={handleGoogleLogin}>
                  {t("auth.continueGoogle")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
</div>
  )
}

export default AuthPage


