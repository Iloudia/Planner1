import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react"
import "./Profile.css"

const STORAGE_KEY = "planner.profile.preferences.v1"

const themeOptions = [
  { id: "clair", label: "Clair", description: "Palette lumineuse et aérienne" },
  { id: "sombre", label: "Sombre", description: "Pour les soirées focus" },
  { id: "pastel", label: "Pastel", description: "Couleurs signature Planner" },
]

const interestCatalog = ["Organisation", "Bien-être", "Sport", "Cuisine", "Voyage", "Culture", "Finances", "Self-love"]

const loginHistoryEntries = [
  { id: "c1", place: "Paris, France", device: "Chrome · MacBook", ip: "89.102.54.11", date: "03 déc. 2025 · 10:12" },
  { id: "c2", place: "Lyon, France", device: "Safari · iPhone", ip: "81.34.11.05", date: "02 déc. 2025 · 22:04" },
  { id: "c3", place: "Nantes, France", device: "Chrome · PC", ip: "62.109.14.210", date: "28 nov. 2025 · 07:32" },
]

const initialSessions = [
  { id: "s1", device: "MacBook Pro", location: "Paris", lastActive: "Actif maintenant", current: true },
  { id: "s2", device: "iPhone 15", location: "Lyon", lastActive: "Il y a 2 h", current: false },
  { id: "s3", device: "iPad Air", location: "Bordeaux", lastActive: "Hier", current: false },
]

const messageHistory = [
  { id: "m1", title: "Newsletter Sérénité", channel: "Email", date: "30 nov. 2025" },
  { id: "m2", title: "Alerte sécurité", channel: "Push", date: "26 nov. 2025" },
  { id: "m3", title: "Promo Planner", channel: "SMS", date: "20 nov. 2025" },
]

const plannerInsights = [
  { id: "insight-1", label: "Objectifs atteints", value: "12", detail: "+3 ce mois-ci" },
  { id: "insight-2", label: "Habitudes suivies", value: "18", detail: "92% de constance" },
  { id: "insight-3", label: "Moments journal", value: "42", detail: "Dernier hier" },
]

const objectives = [
  { id: "obj-1", title: "Routine miracle matin", progress: 72, due: "15 déc." },
  { id: "obj-2", title: "Budget cadeaux", progress: 54, due: "22 déc." },
  { id: "obj-3", title: "Défi wellness", progress: 38, due: "31 déc." },
]

const activityHistory = [
  { id: "act-1", title: "Séance sport douceur", date: "02 déc.", status: "Terminé" },
  { id: "act-2", title: "Session journaling lune", date: "01 déc.", status: "Enregistré" },
  { id: "act-3", title: "Planification repas", date: "30 nov.", status: "Planifié" },
]

const retentionOptions = ["3 mois", "6 mois", "12 mois", "24 mois"]

const twoFactorOptions = [
  { id: "sms", label: "SMS sécurisé" },
  { id: "mail", label: "Email" },
  { id: "app", label: "App d'authentification" },
]

type PersonalInfo = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type IdentityInfo = {
  username: string
  bio: string
  birthday: string
  gender: string
  city: string
  country: string
  language: string
}

type NotificationSettings = {
  email: boolean
  push: boolean
  sms: boolean
}

type PrivacySettings = {
  accountVisibility: "public" | "prive"
  profileVisibility: "tout" | "membres"
  messages: "tous" | "contacts" | "amis"
  autoDelete: string
}

type NewsletterPrefs = {
  updates: boolean
  marketing: boolean
  security: boolean
}

const defaultPersonal: PersonalInfo = {
  firstName: "Lila",
  lastName: "Moreau",
  email: "lila@planner.fr",
  phone: "+33 6 87 45 23 18",
}

const defaultIdentity: IdentityInfo = {
  username: "lila.m",
  bio: "Je mixe productivité douce et self-love au quotidien.",
  birthday: "1996-05-12",
  gender: "femme",
  city: "Paris",
  country: "France",
  language: "fr-FR",
}

const defaultNotifications: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
}

const defaultPrivacy: PrivacySettings = {
  accountVisibility: "public",
  profileVisibility: "membres",
  messages: "contacts",
  autoDelete: "6 mois",
}

const defaultNewsletters: NewsletterPrefs = {
  updates: true,
  marketing: false,
  security: true,
}

function ProfilePage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonal)
  const [identityInfo, setIdentityInfo] = useState<IdentityInfo>(defaultIdentity)
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications)
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacy)
  const [theme, setTheme] = useState("pastel")
  const [newsletters, setNewsletters] = useState<NewsletterPrefs>(defaultNewsletters)
  const [twoFactor, setTwoFactor] = useState<string>("app")
  const [retention, setRetention] = useState<string>("12 mois")
  const [interests, setInterests] = useState<string[]>(["Organisation", "Bien-être", "Voyage"])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [sessions, setSessions] = useState(initialSessions)
  const [emailVerified, setEmailVerified] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      if (parsed.personalInfo) setPersonalInfo((prev) => ({ ...prev, ...parsed.personalInfo }))
      if (parsed.identityInfo) setIdentityInfo((prev) => ({ ...prev, ...parsed.identityInfo }))
      if (parsed.notifications) setNotifications((prev) => ({ ...prev, ...parsed.notifications }))
      if (parsed.privacy) setPrivacy((prev) => ({ ...prev, ...parsed.privacy }))
      if (parsed.theme) setTheme(parsed.theme)
      if (parsed.newsletters) setNewsletters((prev) => ({ ...prev, ...parsed.newsletters }))
      if (parsed.twoFactor) setTwoFactor(parsed.twoFactor)
      if (parsed.retention) setRetention(parsed.retention)
      if (parsed.interests) setInterests(Array.isArray(parsed.interests) ? parsed.interests : [])
      if (parsed.avatarPreview) setAvatarPreview(parsed.avatarPreview)
      if (typeof parsed.emailVerified === "boolean") setEmailVerified(parsed.emailVerified)
    } catch {
      // ignore invalid payload
    }
  }, [])

  useEffect(() => {
    const payload = {
      personalInfo,
      identityInfo,
      notifications,
      privacy,
      theme,
      newsletters,
      twoFactor,
      retention,
      interests,
      avatarPreview,
      emailVerified,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [personalInfo, identityInfo, notifications, privacy, theme, newsletters, twoFactor, retention, interests, avatarPreview, emailVerified])

  const initials = useMemo(() => {
    const first = personalInfo.firstName?.[0] ?? "P"
    const last = personalInfo.lastName?.[0] ?? "P"
    return `${first}${last}`.toUpperCase()
  }, [personalInfo.firstName, personalInfo.lastName])

  const profileCompletion = useMemo(() => {
    const filled = [
      personalInfo.firstName,
      personalInfo.lastName,
      personalInfo.email,
      identityInfo.username,
      identityInfo.bio,
      identityInfo.birthday,
      identityInfo.language,
      privacy.autoDelete,
    ].filter((value) => Boolean(value && value.length > 0)).length
    return Math.min(100, Math.round((filled / 8) * 100 + interests.length * 2))
  }, [interests.length, identityInfo.bio, identityInfo.birthday, identityInfo.language, identityInfo.username, personalInfo.email, personalInfo.firstName, personalInfo.lastName, privacy.autoDelete])

  const handlePersonalSubmit = (event: FormEvent) => event.preventDefault()
  const handleIdentitySubmit = (event: FormEvent) => event.preventDefault()

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null
      if (!result) return
      setAvatarPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleNewsletter = (key: keyof NewsletterPrefs) => {
    setNewsletters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleInterest = (interest: string) => {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]))
  }

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id))
  }

  const handleEmailVerification = () => setEmailVerified(true)

  return (
    <div className="profile-page content-page">
      <div className="profile-accent-bar" aria-hidden="true" />
      <section className="profile-hero">
        <div className="profile-hero__identity">
          <label className="profile-avatar" aria-label="Photo de profil">
            {avatarPreview ? <img src={avatarPreview} alt="Avatar" /> : <span>{initials}</span>}
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </label>
          <div>
            <p className="eyebrow">Espace membre</p>
            <h1>Profil de {personalInfo.firstName}</h1>
            <p>Garde le contrôle sur ton identité digitale, tes préférences et toute ta sécurité Planner.</p>
            <div className="profile-hero__badges">
              <span className="profile-badge">{profileCompletion}% complet</span>
              <span className="profile-badge profile-badge--soft">{emailVerified ? "Email vérifié" : "Email à vérifier"}</span>
            </div>
          </div>
        </div>
        <div className="profile-hero__stats">
          {plannerInsights.map((insight) => (
            <article key={insight.id} className="profile-stat">
              <span className="profile-stat__label">{insight.label}</span>
              <strong>{insight.value}</strong>
              <p>{insight.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-section">
        <header className="profile-section__header">
          <span className="profile-section__eyebrow">Les incontournables</span>
          <h2>Informations personnelles</h2>
          <p>Prenom, email modifiable et coordonnés pour rester joignable.</p>
        </header>
        <div className="profile-grid profile-grid--wide">
          <form className="profile-panel" onSubmit={handlePersonalSubmit}>
            <div className="profile-panel__header">
              <div>
                <h3>Données principales</h3>
                <p>Mets à jour tes infos pour garder ton espace à jour.</p>
              </div>
              <button type="submit">Enregistrer</button>
            </div>
            <div className="profile-form">
              <label>
                <span>Prénom</span>
                <input value={personalInfo.firstName} onChange={(event) => setPersonalInfo((prev) => ({ ...prev, firstName: event.target.value }))} />
              </label>
              <label>
                <span>Nom</span>
                <input value={personalInfo.lastName} onChange={(event) => setPersonalInfo((prev) => ({ ...prev, lastName: event.target.value }))} />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={personalInfo.email} onChange={(event) => setPersonalInfo((prev) => ({ ...prev, email: event.target.value }))} />
              </label>
              <label>
                <span>Téléphone</span>
                <input value={personalInfo.phone} onChange={(event) => setPersonalInfo((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Optionnel" />
              </label>
            </div>
          </form>

          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Sécurité du compte</h3>
                <p>Active le 2FA et vérifie tes sessions actives.</p>
              </div>
              <button type="button">Changer le mot de passe</button>
            </div>
            <div className="profile-security">
              <div className="profile-security__group">
                <p className="profile-label">Vérification email</p>
                <div className="profile-chip-row">
                  <span className={emailVerified ? "profile-chip is-success" : "profile-chip"}>{emailVerified ? "Confirmé" : "En attente"}</span>
                  {!emailVerified ? (
                    <button type="button" className="profile-link-button" onClick={handleEmailVerification}>
                      Renvoyer le lien
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="profile-security__group">
                <p className="profile-label">Double authentification</p>
                <div className="profile-radio-row">
                  {twoFactorOptions.map((option) => (
                    <label key={option.id} className={twoFactor === option.id ? "profile-radio is-active" : "profile-radio"}>
                      <input type="radio" name="twoFactor" value={option.id} checked={twoFactor === option.id} onChange={() => setTwoFactor(option.id)} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="profile-security__group">
                <p className="profile-label">Sessions ouvertes</p>
                <ul className="profile-session-list">
                  {sessions.map((session) => (
                    <li key={session.id}>
                      <div>
                        <strong>{session.device}</strong>
                        <p>
                          {session.location} · {session.lastActive}
                        </p>
                      </div>
                      {session.current ? (
                        <span className="profile-chip is-success">Appareil actuel</span>
                      ) : (
                        <button type="button" onClick={() => revokeSession(session.id)}>
                          Déconnecter
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="profile-security__group">
                <p className="profile-label">Historique des connexions</p>
                <ul className="profile-history">
                  {loginHistoryEntries.map((entry) => (
                    <li key={entry.id}>
                      <div>
                        <strong>{entry.device}</strong>
                        <span>{entry.place}</span>
                      </div>
                      <div className="profile-history__meta">
                        <span>{entry.date}</span>
                        <code>{entry.ip}</code>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <header className="profile-section__header">
          <span className="profile-section__eyebrow">Identité</span>
          <h2>Infos publiques et biographie</h2>
          <p>Choisis ce que tu partages avec la communauté.</p>
        </header>
        <form className="profile-panel" onSubmit={handleIdentitySubmit}>
          <div className="profile-panel__header">
            <div>
              <h3>Profil visible</h3>
              <p>Pseudo, biographie, date de naissance, genre, ville et langue.</p>
            </div>
            <button type="submit">Mettre à jour</button>
          </div>
          <div className="profile-form profile-form--grid">
            <label>
              <span>Nom d'utilisateur</span>
              <input value={identityInfo.username} onChange={(event) => setIdentityInfo((prev) => ({ ...prev, username: event.target.value }))} />
            </label>
            <label>
              <span>Date de naissance</span>
              <input type="date" value={identityInfo.birthday} onChange={(event) => setIdentityInfo((prev) => ({ ...prev, birthday: event.target.value }))} />
            </label>
            <label>
              <span>Genre (optionnel)</span>
              <select value={identityInfo.gender} onChange={(event) => setIdentityInfo((prev) => ({ ...prev, gender: event.target.value }))}>
                <option value="">Ne pas afficher</option>
                <option value="femme">Femme</option>
                <option value="homme">Homme</option>
                <option value="non-binaire">Non-binaire</option>
                <option value="autre">Autre</option>
              </select>
            </label>
            <label>
              <span>Pays / ville</span>
              <input value={`${identityInfo.city}, ${identityInfo.country}`} onChange={(event) => {
                const [city = "", country = ""] = event.target.value.split(",")
                setIdentityInfo((prev) => ({ ...prev, city: city.trim(), country: country.trim() }))
              }} />
            </label>
            <label>
              <span>Langue préférée</span>
              <select value={identityInfo.language} onChange={(event) => setIdentityInfo((prev) => ({ ...prev, language: event.target.value }))}>
                <option value="fr-FR">Français</option>
                <option value="en-US">Anglais</option>
                <option value="es-ES">Espagnol</option>
              </select>
            </label>
            <label className="profile-form__full">
              <span>Biographie</span>
              <textarea value={identityInfo.bio} onChange={(event) => setIdentityInfo((prev) => ({ ...prev, bio: event.target.value }))} rows={4} />
            </label>
          </div>
        </form>
      </section>

      <section className="profile-section">
        <header className="profile-section__header">
          <span className="profile-section__eyebrow">Personnalisation</span>
          <h2>Préférences visuelles et notifications</h2>
          <p>Adapte l'expérience Planner à tes envies.</p>
        </header>
        <div className="profile-grid">
          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Thème du site</h3>
                <p>Choisis l'ambiance qui t'inspire.</p>
              </div>
            </div>
            <div className="profile-theme">
              {themeOptions.map((option) => (
                <label key={option.id} className={theme === option.id ? "profile-theme__option is-active" : "profile-theme__option"}>
                  <input type="radio" name="theme" value={option.id} checked={theme === option.id} onChange={() => setTheme(option.id)} />
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Préférences de notification</h3>
                <p>Email, push et SMS.</p>
              </div>
            </div>
            <div className="profile-toggle-group">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className={value ? "profile-toggle is-active" : "profile-toggle"}>
                  <input type="checkbox" checked={value} onChange={() => toggleNotification(key as keyof NotificationSettings)} />
                  <span>{key.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="profile-panel profile-panel--full">
            <div className="profile-panel__header">
              <div>
                <h3>Centres d'intérêt</h3>
                <p>Affiche les rubriques qui te parlent.</p>
              </div>
            </div>
            <div className="profile-chips">
              {interestCatalog.map((interest) => (
                <button key={interest} type="button" className={interests.includes(interest) ? "profile-chip is-active" : "profile-chip"} onClick={() => toggleInterest(interest)}>
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <header className="profile-section__header">
          <span className="profile-section__eyebrow">Vie privée & RGPD</span>
          <h2>Contrôle de tes données</h2>
          <p>Décide qui voit quoi et comment nous conservons tes données.</p>
        </header>
        <div className="profile-grid profile-grid--wide">
          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Vie privée</h3>
                <p>Paramètre la visibilité de ton compte.</p>
              </div>
            </div>
            <div className="profile-privacy">
              <label>
                <span>Compte</span>
                <select value={privacy.accountVisibility} onChange={(event) => setPrivacy((prev) => ({ ...prev, accountVisibility: event.target.value as PrivacySettings["accountVisibility"] }))}>
                  <option value="public">Public</option>
                  <option value="prive">Privé</option>
                </select>
              </label>
              <label>
                <span>Qui peut voir ton profil ?</span>
                <select value={privacy.profileVisibility} onChange={(event) => setPrivacy((prev) => ({ ...prev, profileVisibility: event.target.value as PrivacySettings["profileVisibility"] }))}>
                  <option value="tout">Tout le monde</option>
                  <option value="membres">Uniquement les membres</option>
                </select>
              </label>
              <label>
                <span>Qui peut t'envoyer des messages ?</span>
                <select value={privacy.messages} onChange={(event) => setPrivacy((prev) => ({ ...prev, messages: event.target.value as PrivacySettings["messages"] }))}>
                  <option value="tous">Tout le monde</option>
                  <option value="contacts">Mes contacts</option>
                  <option value="amis">Amis approuvés</option>
                </select>
              </label>
              <label>
                <span>Suppression auto des données</span>
                <select value={privacy.autoDelete} onChange={(event) => setPrivacy((prev) => ({ ...prev, autoDelete: event.target.value }))}>
                  {retentionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Gestion des données</h3>
                <p>Exporte, supprime ou consulte tes données.</p>
              </div>
            </div>
            <div className="profile-data-actions">
              <button type="button">Télécharger mes données</button>
              <button type="button">Voir les données collectées</button>
              <button type="button" className="is-danger">
                Supprimer mon compte
              </button>
            </div>
            <label>
              <span>Durée de conservation</span>
              <select value={retention} onChange={(event) => setRetention(event.target.value)}>
                {retentionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <header className="profile-section__header">
          <span className="profile-section__eyebrow">Communication</span>
          <h2>Newsletters & alertes</h2>
          <p>Décide quelles informations tu veux recevoir.</p>
        </header>
        <div className="profile-grid">
          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Newsletters</h3>
                <p>Inspiration, marketing et sécurité.</p>
              </div>
            </div>
            <div className="profile-toggle-group">
              <label className={newsletters.updates ? "profile-toggle is-active" : "profile-toggle"}>
                <input type="checkbox" checked={newsletters.updates} onChange={() => toggleNewsletter("updates")} />
                <span>Newsletters bien-être</span>
              </label>
              <label className={newsletters.marketing ? "profile-toggle is-active" : "profile-toggle"}>
                <input type="checkbox" checked={newsletters.marketing} onChange={() => toggleNewsletter("marketing")} />
                <span>Notifications marketing</span>
              </label>
              <label className={newsletters.security ? "profile-toggle is-active" : "profile-toggle"}>
                <input type="checkbox" checked={newsletters.security} onChange={() => toggleNewsletter("security")} />
                <span>Alertes sécurité</span>
              </label>
            </div>
          </div>

          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Historique des messages envoyés</h3>
                <p>Email, push ou SMS.</p>
              </div>
            </div>
            <ul className="profile-history profile-history--messages">
              {messageHistory.map((message) => (
                <li key={message.id}>
                  <div>
                    <strong>{message.title}</strong>
                    <span>{message.channel}</span>
                  </div>
                  <span>{message.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <header className="profile-section__header">
          <span className="profile-section__eyebrow">Planner insights</span>
          <h2>Progression et historique</h2>
          <p>Visualise tes statistiques, objectifs et activités.</p>
        </header>
        <div className="profile-grid profile-grid--wide">
          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Progression / statistiques</h3>
                <p>Ce qui bouge dans ton planner.</p>
              </div>
            </div>
            <div className="profile-stats">
              {plannerInsights.map((insight) => (
                <article key={`stat-${insight.id}`}>
                  <span>{insight.label}</span>
                  <strong>{insight.value}</strong>
                  <p>{insight.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="profile-panel">
            <div className="profile-panel__header">
              <div>
                <h3>Objectifs personnels</h3>
                <p>Suivi détaillé.</p>
              </div>
            </div>
            <ul className="profile-goals">
              {objectives.map((goal) => (
                <li key={goal.id}>
                  <div>
                    <strong>{goal.title}</strong>
                    <span>Échéance {goal.due}</span>
                  </div>
                  <div className="profile-progress">
                    <div style={{ width: `${goal.progress}%` }} />
                  </div>
                  <span className="profile-progress__value">{goal.progress}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="profile-panel profile-panel--full">
            <div className="profile-panel__header">
              <div>
                <h3>Historique d'activités</h3>
                <p>Les derniers mouvements sur ton planner.</p>
              </div>
            </div>
            <ul className="profile-activity">
              {activityHistory.map((activity) => (
                <li key={activity.id}>
                  <div>
                    <strong>{activity.title}</strong>
                    <span>{activity.status}</span>
                  </div>
                  <span>{activity.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
