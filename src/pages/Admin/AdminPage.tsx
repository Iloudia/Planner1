import { useEffect, useMemo, useState, type KeyboardEvent } from "react"
import { useAuth, type AdminUserRecord } from "../../context/AuthContext"
import "./Admin.css"

type AlertState = { type: "success" | "error" | "info"; message: string } | null

const formatDate = (value: string | null) => {
  if (!value) return "Date inconnue"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
}

const cleanString = (value: unknown) => {
  if (typeof value === "string") return value.trim()
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

const toStringList = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value.map((item) => cleanString(item)).filter(Boolean)
}

const bumpCount = (bucket: Record<string, number>, label: unknown) => {
  const key = cleanString(label) || "Non renseigné"
  bucket[key] = (bucket[key] ?? 0) + 1
}

const normalizeGender = (value: unknown) => {
  const lower = cleanString(value).toLowerCase()
  if (lower === "homme" || lower === "h") return "Homme"
  if (lower === "femme" || lower === "f") return "Femme"
  if (lower === "non precise" || lower === "non specifie") return "Non précisé"
  return "Non précisé"
}

const isEmailLike = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanString(value))

const toSortedEntries = (bucket: Record<string, number>) =>
  Object.entries(bucket).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

const joinLabelList = (value: unknown) => {
  const entries = toStringList(value)
  return entries.length > 0 ? entries.join(", ") : "Non renseigné"
}

const getDisplayName = (user: AdminUserRecord) => {
  const fullName = [cleanString(user.personalInfo?.firstName), cleanString(user.personalInfo?.lastName)]
    .filter(Boolean)
    .join(" ")

  return fullName || cleanString(user.identityInfo?.username) || user.email
}

const getIdentityMeta = (user: AdminUserRecord) => {
  const values = [cleanString(user.identityInfo?.username), cleanString(user.identityInfo?.gender)].filter(Boolean)
  return values.length > 0 ? values.join(" • ") : ""
}

const formatSource = (user: AdminUserRecord) => {
  const source = cleanString(user.onboarding?.source)
  const sourceOther = cleanString(user.onboarding?.sourceOther)
  if (!source && !sourceOther) return "Non renseigné"
  if (!sourceOther) return source
  if (!source || source === "Autre") return sourceOther
  return `${source} (${sourceOther})`
}

const pieColors = ["#afcbe3", "#c9ddb8", "#f6d6ad", "#d8c8e8", "#f3bbc2", "#bde0d4", "#f5e6a8", "#c7d0ee"]

const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => ({
  x: cx + radius * Math.cos(angle - Math.PI / 2),
  y: cy + radius * Math.sin(angle - Math.PI / 2),
})

const describeArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArc = endAngle - startAngle <= Math.PI ? "0" : "1"
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

const PieChart = ({ entries }: { entries: [string, number][] }) => {
  const total = entries.reduce((sum, [, count]) => sum + count, 0)
  if (total <= 0) {
    return <p className="admin-stat-empty">Aucune donnee.</p>
  }

  if (entries.length === 1) {
    const [label, count] = entries[0]
    return (
      <div className="admin-stat-chart">
        <div className="admin-stat-figure">
          <svg viewBox="0 0 120 120" role="img" aria-label="Statistiques">
            <circle cx="60" cy="60" r="50" fill={pieColors[0]} />
            <title>{`${label}: ${count}`}</title>
          </svg>
          <span className="admin-stat-total">{total}</span>
        </div>
        <ul className="admin-stat-legend">
          <li>
            <span className="admin-stat-dot" style={{ background: pieColors[0] }} />
            <span>{label}</span>
            <strong>{count}</strong>
          </li>
        </ul>
      </div>
    )
  }

  let startAngle = 0
  const slices = entries.map(([label, count], index) => {
    const value = count / total
    const endAngle = startAngle + value * Math.PI * 2
    const path = describeArc(60, 60, 50, startAngle, endAngle)
    const color = pieColors[index % pieColors.length]
    startAngle = endAngle
    return { label, count, path, color }
  })

  return (
    <div className="admin-stat-chart">
      <div className="admin-stat-figure">
        <svg viewBox="0 0 120 120" role="img" aria-label="Statistiques">
          {slices.map((slice) => (
            <path key={slice.label} d={slice.path} fill={slice.color}>
              <title>{`${slice.label}: ${slice.count}`}</title>
            </path>
          ))}
        </svg>
        <span className="admin-stat-total">{total}</span>
      </div>
      <ul className="admin-stat-legend">
        {slices.map((slice) => (
          <li key={slice.label}>
            <span className="admin-stat-dot" style={{ background: slice.color }} />
            <span>{slice.label}</span>
            <strong>{slice.count}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

const AdminPage = () => {
  const { userEmail, adminListUsers, adminUpdateStatus, adminDeleteUser, adminResendWelcomeEmail } = useAuth()
  const [users, setUsers] = useState<AdminUserRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [alert, setAlert] = useState<AlertState>(null)
  const [showAllUsers, setShowAllUsers] = useState(false)
  const [sendingWelcomeEmailTo, setSendingWelcomeEmailTo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const [trendView, setTrendView] = useState<"bars" | "line">("bars")

  useEffect(() => {
    document.body.classList.add("admin-page--tone")
    return () => {
      document.body.classList.remove("admin-page--tone")
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadUsers = async () => {
      setIsLoading(true)
      setLoadError("")
      try {
        const nextUsers = await adminListUsers()
        if (isMounted) {
          setUsers(Array.isArray(nextUsers) ? nextUsers : [])
          setLastUpdatedAt(new Date())
        }
      } catch (error) {
        console.error("Admin users load failed", error)
        if (isMounted) {
          setUsers([])
          setLoadError("Impossible de charger les données analytics pour le moment.")
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadUsers()
    return () => {
      isMounted = false
    }
  }, [adminListUsers])

  useEffect(() => {
    if (users.length === 0) {
      setSelectedEmail(null)
      return
    }
    if (!selectedEmail || !users.some((user) => user.email === selectedEmail)) {
      setSelectedEmail(users[0].email)
    }
  }, [users, selectedEmail])

  const filteredUsers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized) return users
    return users.filter((user) => {
      const searchableValues = [
        user.email,
        getDisplayName(user),
        user.identityInfo?.username,
        user.identityInfo?.gender,
        formatSource(user),
      ]
      return searchableValues.some((value) => cleanString(value).toLowerCase().includes(normalized))
    })
  }, [users, searchTerm])

  const missingEmailCandidate = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized || !isEmailLike(normalized)) {
      return null
    }
    return users.some((user) => user.email.toLowerCase() === normalized) ? null : normalized
  }, [searchTerm, users])

  const stats = useMemo(() => {
    const now = Date.now()
    const lastThirtyDays = now - 30 * 24 * 60 * 60 * 1000
    const active = users.filter((user) => user.status === "actif").length
    const disabled = users.filter((user) => user.status === "desactive").length
    const onboardingCompleted = users.filter((user) => Boolean(user.onboarding?.completedAt)).length
    const newLastThirtyDays = users.filter((user) => {
      const timestamp = Date.parse(user.createdAt ?? "")
      return Number.isFinite(timestamp) && timestamp >= lastThirtyDays
    }).length

    return {
      total: users.length,
      active,
      disabled,
      newLastThirtyDays,
      activeRate: users.length > 0 ? Math.round((active / users.length) * 100) : 0,
      onboardingCompleted,
      onboardingRate: users.length > 0 ? Math.round((onboardingCompleted / users.length) * 100) : 0,
    }
  }, [users])

  const surveyStats = useMemo(() => {
    const genderCounts: Record<string, number> = {}
    const sourceCounts: Record<string, number> = {}
    const reasonsCounts: Record<string, number> = {}
    const categoryCounts: Record<string, number> = {}
    const priorityCounts: Record<string, number> = {}

    users.forEach((user) => {
      const gender = normalizeGender(user.identityInfo?.gender ?? "")
      bumpCount(genderCounts, gender)

      const onboarding = user.onboarding

      const source = cleanString(onboarding?.source) || "Non renseigné"
      bumpCount(sourceCounts, source)

      const reasons = toStringList(onboarding?.reasons)
      if (reasons.length === 0) bumpCount(reasonsCounts, "non renseigné")
      else reasons.forEach((reason) => bumpCount(reasonsCounts, reason))

      const categories = toStringList(onboarding?.categories)
      if (categories.length === 0) bumpCount(categoryCounts, "non renseigné")
      else categories.forEach((category) => bumpCount(categoryCounts, category))

      const priority = toStringList(onboarding?.priority)
      if (priority.length === 0) bumpCount(priorityCounts, "non renseigné")
      else priority.forEach((item) => bumpCount(priorityCounts, item))
    })

    return {
      gender: toSortedEntries(genderCounts),
      source: toSortedEntries(sourceCounts),
      reasons: toSortedEntries(reasonsCounts),
      categories: toSortedEntries(categoryCounts),
      priority: toSortedEntries(priorityCounts),
    }
  }, [users])

  const registrationTrend = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("fr-FR", { month: "short" })
    const now = new Date()
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      return {
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: formatter.format(date).replace(".", ""),
        count: 0,
      }
    })

    users.forEach((user) => {
      const date = new Date(user.createdAt ?? "")
      if (Number.isNaN(date.getTime())) return
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const month = months.find((entry) => entry.key === key)
      if (month) month.count += 1
    })

    return months
  }, [users])

  const dataQuality = useMemo(() => {
    const withIdentity = users.filter((user) => cleanString(user.identityInfo?.username) || cleanString(user.personalInfo?.firstName)).length
    const withSource = users.filter((user) => cleanString(user.onboarding?.source) || cleanString(user.onboarding?.sourceOther)).length
    return {
      identityRate: users.length > 0 ? Math.round((withIdentity / users.length) * 100) : 0,
      sourceRate: users.length > 0 ? Math.round((withSource / users.length) * 100) : 0,
    }
  }, [users])

  const trendMax = Math.max(1, ...registrationTrend.map((entry) => entry.count))
  const topSource = surveyStats.source.find(([label]) => label !== "Non renseigné") ?? surveyStats.source[0]

  const selectedUser = selectedEmail ? users.find((user) => user.email === selectedEmail) ?? null : null

  const refreshUsers = async () => {
    setIsLoading(true)
    setLoadError("")
    try {
      const nextUsers = await adminListUsers()
      setUsers(Array.isArray(nextUsers) ? nextUsers : [])
      setLastUpdatedAt(new Date())
    } catch (error) {
      console.error("Admin users refresh failed", error)
      setLoadError("La mise à jour des données a échoué.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusToggle = async (user: AdminUserRecord) => {
    const nextStatus = user.status === "actif" ? "desactive" : "actif"
    const result = await adminUpdateStatus(user.email, nextStatus)
    if (!result.success) {
      setAlert({ type: "error", message: result.error ?? "Action impossible pour ce compte." })
      return
    }
    setAlert({
      type: nextStatus === "desactive" ? "info" : "success",
      message: nextStatus === "desactive" ? "Compte desactive et sessions coupees." : "Compte reactive.",
    })
    await refreshUsers()
  }

  const handleDelete = async (email: string) => {
    const confirmed = window.confirm(
      `Supprimer le compte ${email} ? Cette action supprime le compte, ses donnees Firestore et ses medias utilisateur.`,
    )
    if (!confirmed) return
    const result = await adminDeleteUser(email)
    if (!result.success) {
      setAlert({ type: "error", message: result.error ?? "Impossible de supprimer ce compte." })
      return
    }
    setAlert({ type: "success", message: "Compte supprime completement." })
    await refreshUsers()
  }

  const handleResendWelcomeEmail = async (user: AdminUserRecord) => {
    console.log("Admin UI resend welcome clicked", { email: user.email })
    setSendingWelcomeEmailTo(user.email)
    const result = await adminResendWelcomeEmail({ email: user.email })
    if (!result.success) {
      console.error("Admin UI resend welcome failed", { email: user.email, error: result.error ?? null })
      setAlert({ type: "error", message: result.error ?? "Impossible de renvoyer l'e-mail de bienvenue." })
      setSendingWelcomeEmailTo(null)
      return
    }

    console.log("Admin UI resend welcome success", { email: user.email })
    setAlert({
      type: "success",
      message: `${result.message ?? "E-mail de bienvenue renvoye."} Destinataire: ${user.email}.`,
    })
    setSendingWelcomeEmailTo(null)
  }

  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>, email: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setSelectedEmail(email)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-hero">
          <div className="admin-hero__content">
            <p className="admin-eyebrow">Centre de pilotage</p>
            <h1>Analytics &amp; utilisateurs</h1>
            <p className="admin-hero__lead">
              Suis la croissance de Me&amp;rituals, comprends les attentes de la communauté et administre les comptes depuis un espace unique.
            </p>
            <div className="admin-hero__meta">
              <span>Session administrateur</span>
              <strong>{userEmail ?? "Administrateur"}</strong>
            </div>
          </div>

          <div className="admin-hero__aside">
            <div className="admin-live-status">
              <span className={isLoading ? "admin-live-status__dot is-loading" : "admin-live-status__dot"} />
              <div>
                <strong>{isLoading ? "Actualisation en cours" : "Données synchronisées"}</strong>
                <span>{lastUpdatedAt ? `Mises à jour à ${lastUpdatedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : "En attente de données"}</span>
              </div>
            </div>
            <button type="button" className="admin-button admin-button--refresh" onClick={() => void refreshUsers()} disabled={isLoading}>
              {isLoading ? "Actualisation…" : "Actualiser les données"}
            </button>
          </div>
        </header>

        {loadError ? <p className="admin-alert admin-alert--error" role="alert">{loadError}</p> : null}
        {alert ? <p className={`admin-alert admin-alert--${alert.type}`} role="status">{alert.message}</p> : null}

        <section className="admin-metrics" aria-label="Indicateurs clés">
          <article className="admin-metric-card">
            <span className="admin-metric-card__label">Comptes</span>
            <strong>{stats.total}</strong>
            <p>utilisateurs enregistrés</p>
          </article>
          <article className="admin-metric-card">
            <span className="admin-metric-card__label">Comptes actifs</span>
            <strong>{stats.activeRate}%</strong>
            <p>{stats.active} actifs · {stats.disabled} désactivés</p>
          </article>
          <article className="admin-metric-card">
            <span className="admin-metric-card__label">30 derniers jours</span>
            <strong>+{stats.newLastThirtyDays}</strong>
            <p>nouvelles inscriptions</p>
          </article>
          <article className="admin-metric-card">
            <span className="admin-metric-card__label">Onboarding</span>
            <strong>{stats.onboardingRate}%</strong>
            <p>{stats.onboardingCompleted} parcours complétés</p>
          </article>
        </section>

        <section className="admin-overview-grid" aria-label="Vue d’ensemble analytics">
          <article className="admin-panel admin-trend-panel">
            <header className="admin-panel__header admin-panel__header--compact">
              <div>
                <p className="admin-eyebrow">Croissance</p>
                <h2>Inscriptions sur 6 mois</h2>
              </div>
              <div className="admin-panel__header-actions">
                <span className="admin-panel__value">{registrationTrend.reduce((sum, entry) => sum + entry.count, 0)} comptes</span>
                <div className="admin-chart-toggle" role="group" aria-label="Type de graphique">
                  <button
                    type="button"
                    className={trendView === "bars" ? "is-active" : ""}
                    aria-pressed={trendView === "bars"}
                    onClick={() => setTrendView("bars")}
                  >
                    Diagramme
                  </button>
                  <button
                    type="button"
                    className={trendView === "line" ? "is-active" : ""}
                    aria-pressed={trendView === "line"}
                    onClick={() => setTrendView("line")}
                  >
                    Courbe
                  </button>
                </div>
              </div>
            </header>
            <div
              className={`admin-trend-chart admin-trend-chart--${trendView}`}
              role="img"
              aria-label={`${trendView === "bars" ? "Diagramme" : "Courbe"} du nombre d’inscriptions par mois sur les six derniers mois`}
            >
              <svg className="admin-trend-chart__curve" viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true">
                <polyline
                  points={registrationTrend
                    .map((entry, index) => `${50 + index * 100},${165 - (entry.count / trendMax) * 145}`)
                    .join(" ")}
                />
                {registrationTrend.map((entry, index) => (
                  <circle
                    key={entry.key}
                    cx={50 + index * 100}
                    cy={165 - (entry.count / trendMax) * 145}
                    r="5"
                  />
                ))}
              </svg>
              {registrationTrend.map((entry) => (
                <div className="admin-trend-chart__item" key={entry.key}>
                  <span className="admin-trend-chart__value">{entry.count}</span>
                  <div className="admin-trend-chart__track">
                    <span style={{ height: `${Math.max(entry.count > 0 ? 10 : 0, (entry.count / trendMax) * 100)}%` }} />
                  </div>
                  <span className="admin-trend-chart__label">{entry.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-panel admin-quality-panel">
            <header className="admin-panel__header admin-panel__header--compact">
              <div>
                <p className="admin-eyebrow">Qualité des données</p>
                <h2>Complétude des profils</h2>
              </div>
            </header>
            <div className="admin-quality-list">
              <div>
                <span><strong>Onboarding complété</strong><em>{stats.onboardingRate}%</em></span>
                <progress max="100" value={stats.onboardingRate}>{stats.onboardingRate}%</progress>
              </div>
              <div>
                <span><strong>Identité renseignée</strong><em>{dataQuality.identityRate}%</em></span>
                <progress max="100" value={dataQuality.identityRate}>{dataQuality.identityRate}%</progress>
              </div>
              <div>
                <span><strong>Source d’acquisition</strong><em>{dataQuality.sourceRate}%</em></span>
                <progress max="100" value={dataQuality.sourceRate}>{dataQuality.sourceRate}%</progress>
              </div>
            </div>
            <div className="admin-quality-highlight">
              <span>Première source d’acquisition</span>
              <strong>{topSource ? topSource[0] : "Aucune donnée"}</strong>
              {topSource ? <small>{topSource[1]} réponse{topSource[1] > 1 ? "s" : ""}</small> : null}
            </div>
          </article>
        </section>

        <section className="admin-panel admin-panel--stats">
          <header className="admin-panel__header">
            <div>
              <p className="admin-eyebrow">Audience</p>
              <h2>Profil de la communauté</h2>
            </div>
            <p className="admin-helper">Répartition des réponses collectées pendant l’inscription. Les choix multiples sont comptabilisés individuellement.</p>
          </header>

          <div className="admin-stats-grid">
            <article className="admin-stat-card">
              <h3>Genre</h3>
              <PieChart entries={surveyStats.gender} />
            </article>
            <article className="admin-stat-card">
              <h3>Source</h3>
              <PieChart entries={surveyStats.source} />
            </article>
            <article className="admin-stat-card">
              <h3>Raisons</h3>
              <PieChart entries={surveyStats.reasons} />
            </article>
            <article className="admin-stat-card">
              <h3>Catégories</h3>
              <PieChart entries={surveyStats.categories} />
            </article>
            <article className="admin-stat-card">
              <h3>Priorité</h3>
              <PieChart entries={surveyStats.priority} />
            </article>
          </div>
        </section>

        <section className="admin-workspace">
          <article className="admin-panel admin-users-panel">
            <header className="admin-panel__header admin-panel__header--stack">
              <div>
                <p className="admin-eyebrow">Utilisateurs</p>
                <h2>Comptes de la plateforme</h2>
              </div>
              <div className="admin-panel__controls">
                <label className="admin-search">
                  <span className="admin-search__label">Rechercher un e-mail</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Nom, e-mail, source…"
                  />
                </label>
                <button type="button" className="admin-button admin-button--ghost" onClick={() => setShowAllUsers(true)}>
                  Voir tous les e-mails
                </button>
              </div>
            </header>

            <div className="admin-users-summary">
              <span><strong>{filteredUsers.length}</strong> résultat{filteredUsers.length > 1 ? "s" : ""}</span>
              <span>{stats.active} actifs · {stats.disabled} désactivés</span>
            </div>

            {missingEmailCandidate ? (
              <p className="admin-empty-state">Aucun compte ne correspond à l’adresse <strong>{missingEmailCandidate}</strong>.</p>
            ) : null}

            <div className="admin-user-list">
              <div className="admin-user-list__head" aria-hidden="true">
                <span>Utilisateur</span>
                <span>Inscription</span>
                <span>Statut</span>
                <span>Actions</span>
              </div>
              <div className="admin-user-list__body">
                {filteredUsers.length === 0 && !isLoading ? (
                  <p className="admin-empty-state">Aucun utilisateur à afficher.</p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.email}
                      className={selectedEmail === user.email ? "admin-user-row is-selected" : "admin-user-row"}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedEmail(user.email)}
                      onKeyDown={(event) => handleRowKeyDown(event, user.email)}
                    >
                      <div className="admin-user-row__identity">
                        <strong>{getDisplayName(user)}</strong>
                        <span>{user.email}</span>
                      </div>
                      <span className="admin-user-row__date">{formatDate(user.createdAt)}</span>
                      <span className={`admin-badge admin-badge--${user.status}`}>{user.status}</span>
                      <div className="admin-user-row__actions">
                        <button
                          type="button"
                          className="admin-button admin-button--ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                            void handleStatusToggle(user)
                          }}
                        >
                          {user.status === "actif" ? "Désactiver" : "Réactiver"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>

          <aside className="admin-sidebar">
            <section className="admin-panel admin-detail-panel">
              <header className="admin-panel__header admin-panel__header--compact">
                <div>
                  <p className="admin-eyebrow">Fiche utilisateur</p>
                  <h2>Détails du compte</h2>
                </div>
              </header>

              {selectedUser ? (
                <div className="admin-detail-card">
                  <div className="admin-detail-card__hero">
                    <span className={`admin-badge admin-badge--${selectedUser.status}`}>{selectedUser.status}</span>
                    <h3>{getDisplayName(selectedUser)}</h3>
                    <p>{selectedUser.email}</p>
                    {getIdentityMeta(selectedUser) ? <small>{getIdentityMeta(selectedUser)}</small> : null}
                  </div>
                  <dl className="admin-detail-list">
                    <div><dt>Inscription</dt><dd>{formatDate(selectedUser.createdAt)}</dd></div>
                    <div><dt>Onboarding</dt><dd>{selectedUser.onboarding?.completedAt ? `Complété le ${formatDate(selectedUser.onboarding.completedAt)}` : "Non complété"}</dd></div>
                    <div><dt>Source</dt><dd>{formatSource(selectedUser)}</dd></div>
                    <div><dt>Raisons</dt><dd>{joinLabelList(selectedUser.onboarding?.reasons)}</dd></div>
                    <div><dt>Catégories</dt><dd>{joinLabelList(selectedUser.onboarding?.categories)}</dd></div>
                    <div><dt>Priorités</dt><dd>{joinLabelList(selectedUser.onboarding?.priority)}</dd></div>
                    {selectedUser.deletionPlannedAt ? <div><dt>Suppression prévue</dt><dd>{formatDate(selectedUser.deletionPlannedAt)}</dd></div> : null}
                  </dl>
                  <div className="admin-detail-card__actions">
                    <button
                      type="button"
                      className="admin-button admin-button--wide"
                      onClick={() => void handleResendWelcomeEmail(selectedUser)}
                      disabled={sendingWelcomeEmailTo === selectedUser.email}
                    >
                      {sendingWelcomeEmailTo === selectedUser.email ? "Envoi…" : "Renvoyer l’e-mail de bienvenue"}
                    </button>
                    <button type="button" className="admin-button admin-button--ghost admin-button--wide" onClick={() => void handleStatusToggle(selectedUser)}>
                      {selectedUser.status === "actif" ? "Désactiver le compte" : "Réactiver le compte"}
                    </button>
                    <button type="button" className="admin-button admin-button--danger admin-button--wide" onClick={() => void handleDelete(selectedUser.email)}>
                      Supprimer définitivement
                    </button>
                  </div>
                </div>
              ) : (
                <p className="admin-empty-state">Sélectionne un utilisateur pour consulter son profil.</p>
              )}
            </section>
          </aside>
        </section>
      </div>

      {showAllUsers ? (
        <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Tous les e-mails">
          <div className="admin-modal__card">
            <header className="admin-modal__header">
              <div>
                <p className="admin-eyebrow">Annuaire</p>
                <h3>Tous les e-mails ({users.length})</h3>
              </div>
              <button type="button" className="admin-button admin-button--ghost" onClick={() => setShowAllUsers(false)}>
                Fermer
              </button>
            </header>
            <div className="admin-modal__body">
              {users.length === 0 ? (
                <p className="admin-empty-state">Aucun compte a afficher.</p>
              ) : (
                <ul className="admin-modal__list">
                  {users.map((user) => (
                    <li key={user.email}>{user.email}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminPage
