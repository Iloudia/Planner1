import { useEffect, useMemo, useState, type KeyboardEvent } from "react"
import { useAuth, type AdminUserRecord } from "../../context/AuthContext"
import { buildUserScopedKey } from "../../utils/userScopedKey"
import "./Admin.css"

type AlertState = { type: "success" | "error" | "info"; message: string } | null

const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"
const ONBOARDING_STORAGE_KEY = "planner.onboarding.answers.v1"

type ProfileData = {
  identityInfo?: {
    gender?: string
  }
}

type OnboardingAnswers = {
  source?: string
  reasons?: string[]
  categories?: string[]
  priority?: string[]
}

const formatDate = (value: string | null) => {
  if (!value) return "Date inconnue"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
}

const safeReadJson = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
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
  const key = cleanString(label) || "non renseigne"
  bucket[key] = (bucket[key] ?? 0) + 1
}

const normalizeGender = (value: unknown) => {
  const lower = cleanString(value).toLowerCase()
  if (lower === "homme" || lower === "h") return "homme"
  if (lower === "femme" || lower === "f") return "femme"
  if (lower === "non precise" || lower === "non specifie") return "non precise"
  return "non precise"
}

const toSortedEntries = (bucket: Record<string, number>) =>
  Object.entries(bucket).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

const pieColors = ["#e3d7ca", "#efe6dc", "#d8d7b2", "#f3ddd4", "#eadfd6", "#f4e7cf", "#e8d9d1", "#dfe7dc"]

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
        </div>
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
      </div>
      <ul className="admin-stat-legend">
        {slices.map((slice) => (
          <li key={slice.label}>
            <span className="admin-stat-dot" style={{ background: slice.color }} />
            <span>{slice.label}</span>
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

  useEffect(() => {
    document.body.classList.add("admin-page--tone")
    return () => {
      document.body.classList.remove("admin-page--tone")
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadUsers = async () => {
      try {
        const nextUsers = await adminListUsers()
        if (isMounted) {
          setUsers(Array.isArray(nextUsers) ? nextUsers : [])
        }
      } catch (error) {
        console.error("Admin users load failed", error)
        if (isMounted) {
          setUsers([])
        }
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
    return users.filter((user) => user.email.toLowerCase().includes(normalized))
  }, [users, searchTerm])

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === "actif").length,
      disabled: users.filter((user) => user.status === "desactive").length,
    }),
    [users],
  )

  const surveyStats = useMemo(() => {
    const genderCounts: Record<string, number> = {}
    const sourceCounts: Record<string, number> = {}
    const reasonsCounts: Record<string, number> = {}
    const categoryCounts: Record<string, number> = {}
    const priorityCounts: Record<string, number> = {}

    users.forEach((user) => {
      const profileKey = buildUserScopedKey(user.email, PROFILE_STORAGE_KEY)
      const profile = safeReadJson<ProfileData>(profileKey)
      const gender = normalizeGender(profile?.identityInfo?.gender ?? "")
      bumpCount(genderCounts, gender)

      const onboardingKey = buildUserScopedKey(user.email, ONBOARDING_STORAGE_KEY)
      const onboarding = safeReadJson<OnboardingAnswers>(onboardingKey)

      const source = cleanString(onboarding?.source) || "non renseigne"
      bumpCount(sourceCounts, source)

      const reasons = toStringList(onboarding?.reasons)
      if (reasons.length === 0) {
        bumpCount(reasonsCounts, "non renseigne")
      } else {
        reasons.forEach((reason) => bumpCount(reasonsCounts, reason))
      }

      const categories = toStringList(onboarding?.categories)
      if (categories.length === 0) {
        bumpCount(categoryCounts, "non renseigne")
      } else {
        categories.forEach((category) => bumpCount(categoryCounts, category))
      }

      const priority = toStringList(onboarding?.priority)
      if (priority.length === 0) {
        bumpCount(priorityCounts, "non renseigne")
      } else {
        priority.forEach((item) => bumpCount(priorityCounts, item))
      }
    })

    return {
      gender: toSortedEntries(genderCounts),
      source: toSortedEntries(sourceCounts),
      reasons: toSortedEntries(reasonsCounts),
      categories: toSortedEntries(categoryCounts),
      priority: toSortedEntries(priorityCounts),
    }
  }, [users])

  const selectedUser = selectedEmail ? users.find((user) => user.email === selectedEmail) ?? null : null

  const refreshUsers = async () => {
    try {
      const nextUsers = await adminListUsers()
      setUsers(Array.isArray(nextUsers) ? nextUsers : [])
    } catch (error) {
      console.error("Admin users refresh failed", error)
      setUsers([])
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
      `Supprimer le compte ${email} ? Cette action supprime les donnees locales associees et coupe toutes les sessions.`,
    )
    if (!confirmed) return
    const result = await adminDeleteUser(email)
    if (!result.success) {
      setAlert({ type: "error", message: result.error ?? "Impossible de supprimer ce compte." })
      return
    }
    setAlert({ type: "success", message: "Compte supprime et donnees nettoyees." })
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
        <section className="admin-hero">
          <div className="admin-hero__content">
            <p className="admin-eyebrow">Back office</p>
            <h1>Pilote ton espace admin avec une interface plus claire</h1>
            <p className="admin-hero__lead">
              Supervision des comptes, moderation rapide et lecture des statistiques dans une mise en page plus
              propre, plus lisible et mieux espacee.
            </p>
            <div className="admin-hero__meta">
              <span>Session admin</span>
              <strong>{userEmail ?? "admin@planner.local"}</strong>
            </div>
          </div>

          <div className="admin-hero__stats" aria-label="Resume des comptes">
            <article className="admin-metric-card">
              <span className="admin-metric-card__label">Comptes total</span>
              <strong>{stats.total}</strong>
              <p>Vue globale de la base utilisateurs.</p>
            </article>
            <article className="admin-metric-card">
              <span className="admin-metric-card__label">Actifs</span>
              <strong>{stats.active}</strong>
              <p>Comptes pouvant encore se connecter.</p>
            </article>
            <article className="admin-metric-card">
              <span className="admin-metric-card__label">Desactives</span>
              <strong>{stats.disabled}</strong>
              <p>Acces bloques et sessions coupees.</p>
            </article>
          </div>
        </section>

        <section className="admin-workspace">
          <div className="admin-panel admin-panel--users">
            <header className="admin-panel__header">
              <div>
                <p className="admin-eyebrow">Utilisateurs</p>
                <h2>Comptes inscrits</h2>
                <p className="admin-helper">
                  Recherche instantanee, selection rapide et actions accessibles sans surcharge visuelle.
                </p>
              </div>
              <div className="admin-panel__controls">
                <label className="admin-search">
                  <span className="admin-search__label">Recherche</span>
                  <input
                    type="search"
                    placeholder="Rechercher par e-mail"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </label>
                <button type="button" className="admin-button admin-button--ghost" onClick={() => setShowAllUsers(true)}>
                  Voir tous les e-mails
                </button>
              </div>
            </header>

            <div className="admin-users-summary">
              <span>{filteredUsers.length} resultat(s)</span>
              <span>{selectedUser ? `Selection: ${selectedUser.email}` : "Aucune selection"}</span>
            </div>

            <div className="admin-user-list" role="table" aria-label="Utilisateurs inscrits">
              <div className="admin-user-list__head" role="row">
                <div role="columnheader">Compte</div>
                <div role="columnheader">Inscription</div>
                <div role="columnheader">Statut</div>
                <div role="columnheader">Actions</div>
              </div>

              <div className="admin-user-list__body">
                {filteredUsers.length === 0 ? (
                  <p className="admin-empty-state">Aucun compte ne correspond a cette recherche.</p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.email}
                      className={user.email === selectedEmail ? "admin-user-row is-selected" : "admin-user-row"}
                      role="row"
                      tabIndex={0}
                      onClick={() => setSelectedEmail(user.email)}
                      onKeyDown={(event) => handleRowKeyDown(event, user.email)}
                    >
                      <div className="admin-user-row__identity">
                        <strong>{user.email}</strong>
                        <span>{user.email === selectedEmail ? "Profil ouvert" : "Cliquer pour afficher le detail"}</span>
                      </div>
                      <div className="admin-user-row__date">{formatDate(user.createdAt)}</div>
                      <div>
                        <span className={`admin-badge admin-badge--${user.status}`}>
                          {user.status === "actif" ? "Actif" : "Desactive"}
                        </span>
                      </div>
                      <div className="admin-user-row__actions">
                        <button type="button" className="admin-button" onClick={() => handleStatusToggle(user)}>
                          {user.status === "actif" ? "Desactiver" : "Re-activer"}
                        </button>
                        <button
                          type="button"
                          className="admin-button admin-button--ghost"
                          disabled={sendingWelcomeEmailTo === user.email}
                          onClick={(event) => {
                            event.stopPropagation()
                            void handleResendWelcomeEmail(user)
                          }}
                        >
                          {sendingWelcomeEmailTo === user.email ? "Envoi..." : "Renvoyer bienvenue"}
                        </button>
                        <button type="button" className="admin-button admin-button--danger" onClick={() => handleDelete(user.email)}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="admin-sidebar">
            <section className="admin-panel admin-panel--detail">
              <header className="admin-panel__header admin-panel__header--stack">
                <div>
                  <p className="admin-eyebrow">Fiche compte</p>
                  <h2>Profil selectionne</h2>
                </div>
                <p className="admin-helper">Toutes les actions sensibles sont centralisees dans ce panneau.</p>
              </header>

              {alert ? <div className={`admin-alert admin-alert--${alert.type}`}>{alert.message}</div> : null}

              {selectedUser ? (
                <div className="admin-detail-card">
                  <div className="admin-detail-card__hero">
                    <span className={`admin-badge admin-badge--${selectedUser.status}`}>
                      {selectedUser.status === "actif" ? "Actif" : "Desactive"}
                    </span>
                    <h3>{selectedUser.email}</h3>
                    <p>Compte suivi depuis le tableau admin, avec acces direct aux actions de moderation.</p>
                  </div>

                  <dl className="admin-detail-list">
                    <div>
                      <dt>Adresse e-mail</dt>
                      <dd>{selectedUser.email}</dd>
                    </div>
                    <div>
                      <dt>Date d inscription</dt>
                      <dd>{formatDate(selectedUser.createdAt)}</dd>
                    </div>
                    <div>
                      <dt>Etat du compte</dt>
                      <dd>{selectedUser.status === "actif" ? "Compte actif" : "Compte desactive"}</dd>
                    </div>
                    {selectedUser.deletionPlannedAt ? (
                      <div>
                        <dt>Suppression programmee</dt>
                        <dd>{formatDate(selectedUser.deletionPlannedAt)}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="admin-detail-card__actions">
                    <button type="button" className="admin-button" onClick={() => handleStatusToggle(selectedUser)}>
                      {selectedUser.status === "actif" ? "Desactiver le compte" : "Re-activer le compte"}
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button--danger admin-button--wide"
                      onClick={() => handleDelete(selectedUser.email)}
                    >
                      Supprimer definitivement
                    </button>
                  </div>
                </div>
              ) : (
                <p className="admin-empty-state">Aucun utilisateur a afficher pour le moment.</p>
              )}
            </section>

            <section className="admin-panel admin-panel--safety">
              <p className="admin-eyebrow">Conformite</p>
              <h2>Cadre de securite</h2>
              <ul className="admin-safety-list">
                <li>Acces limite aux administrateurs verifies via une route protegee.</li>
                <li>Les desactivations coupent les sessions actives et bloquent les nouvelles connexions.</li>
                <li>Les suppressions nettoient les donnees locales rattachees au compte.</li>
              </ul>
            </section>
          </aside>
        </section>

        <section className="admin-panel admin-panel--stats">
          <header className="admin-panel__header">
            <div>
              <p className="admin-eyebrow">Statistiques</p>
              <h2>Questions d inscription</h2>
            </div>
            <p className="admin-helper">Synthese des reponses collectees pour mieux lire le profil des nouveaux inscrits.</p>
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
              <h3>Categories</h3>
              <PieChart entries={surveyStats.categories} />
            </article>
            <article className="admin-stat-card">
              <h3>Priorite</h3>
              <PieChart entries={surveyStats.priority} />
            </article>
          </div>
        </section>
      </div>

      {showAllUsers ? (
        <div className="admin-modal" role="dialog" aria-modal="true" aria-label="Tous les e-mails">
          <div className="admin-modal__card">
            <header className="admin-modal__header">
              <div>
                <p className="admin-eyebrow">Annuaire</p>
                <h3>Tous les e-mails</h3>
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
