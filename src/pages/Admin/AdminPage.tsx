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

const pieColors = ["#fbcfe8", "#bfdbfe", "#bbf7d0", "#fde68a", "#ddd6fe", "#fed7aa", "#fecaca", "#bae6fd"]

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
  const { userEmail, adminListUsers, adminUpdateStatus, adminDeleteUser } = useAuth()
  const [users, setUsers] = useState<AdminUserRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [alert, setAlert] = useState<AlertState>(null)
  const [showAllUsers, setShowAllUsers] = useState(false)

  useEffect(() => {
    try {
      const nextUsers = adminListUsers()
      setUsers(Array.isArray(nextUsers) ? nextUsers : [])
    } catch (error) {
      console.error("Admin users load failed", error)
      setUsers([])
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

  const refreshUsers = () => {
    try {
      const nextUsers = adminListUsers()
      setUsers(Array.isArray(nextUsers) ? nextUsers : [])
    } catch (error) {
      console.error("Admin users refresh failed", error)
      setUsers([])
    }
  }

  const handleStatusToggle = (user: AdminUserRecord) => {
    const nextStatus = user.status === "actif" ? "desactive" : "actif"
    const result = adminUpdateStatus(user.email, nextStatus)
    if (!result.success) {
      setAlert({ type: "error", message: result.error ?? "Action impossible pour ce compte." })
      return
    }
    setAlert({
      type: nextStatus === "desactive" ? "info" : "success",
      message: nextStatus === "desactive" ? "Compte desactive et sessions coupees." : "Compte reactive.",
    })
    refreshUsers()
  }

  const handleDelete = (email: string) => {
    const confirmed = window.confirm(
      `Supprimer le compte ${email} ? Cette action supprime les donnees locales associees et coupe toutes les sessions.`,
    )
    if (!confirmed) return
    const result = adminDeleteUser(email)
    if (!result.success) {
      setAlert({ type: "error", message: result.error ?? "Impossible de supprimer ce compte." })
      return
    }
    setAlert({ type: "success", message: "Compte supprimé et données nettoyées." })
    refreshUsers()
  }

  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>, email: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setSelectedEmail(email)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__accent" aria-hidden="true" />
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Back-office</p>
          <h1>Administration des comptes</h1>
          <p>Connectez-vous en tant qu’admin@planner.local.</p>
          <p>Accès réservé aux administrateurs vérifiés.</p>
        </div>
        <div className="admin-hero">
          <article>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </article>
          <article>
            <span>Actifs</span>
            <strong>{stats.active}</strong>
          </article>
          <article>
            <span>Désactivés</span>
            <strong>{stats.disabled}</strong>
          </article>
        </div>
      </header>

      <div className="admin-grid">
        <section className="admin-panel">
          <header className="admin-panel__header">
            <div>
              <p className="admin-eyebrow">Utilisateurs</p>
              <h2>Comptes inscrits</h2>
            </div>
            <div className="admin-panel__controls">
              <input
                type="search"
                placeholder="Rechercher par e-mail"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <button type="button" className="admin-action" onClick={() => setShowAllUsers(true)}>
                Voir tous
              </button>
            </div>
          </header>
          <div className="admin-table" role="table" aria-label="Utilisateurs inscrits">
            <div className="admin-table__row admin-table__row--head" role="row">
              <div role="columnheader">E-mail</div>
              <div role="columnheader">Inscription</div>
              <div role="columnheader">Statut</div>
              <div role="columnheader">Actions</div>
            </div>
            <div className="admin-table__body admin-table__body--scroll">
              {filteredUsers.length === 0 ? (
                <p className="admin-table__empty">Aucun compte ne correspond a cette adresse e-mail.</p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.email}
                    className={user.email === selectedEmail ? "admin-table__row is-selected" : "admin-table__row"}
                    role="row"
                    tabIndex={0}
                    onClick={() => setSelectedEmail(user.email)}
                    onKeyDown={(event) => handleRowKeyDown(event, user.email)}
                  >
                    <div className="admin-table__cell">
                      <strong>{user.email}</strong>
                    </div>
                    <div className="admin-table__cell">{formatDate(user.createdAt)}</div>
                    <div className="admin-table__cell">
                      <span className={`badge badge--${user.status}`}>
                        {user.status === "actif" ? "Actif" : "Desactive"}
                      </span>
                    </div>
                    <div className="admin-table__cell admin-table__cell--actions">
                      <button type="button" className="admin-action" onClick={() => handleStatusToggle(user)}>
                        {user.status === "actif" ? "Desactiver" : "Re-activer"}
                      </button>
                      <button type="button" className="admin-delete" onClick={() => handleDelete(user.email)}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="admin-panel admin-panel--form">
          <header className="admin-panel__header">
            <div>
              <p className="admin-eyebrow">Details</p>
              <h2>Profil sélectionné</h2>
            </div>
            <p className="admin-helper">Recherche, sélection, désactivation ou suppression en un clic.</p>
          </header>

          {alert ? <div className={`admin-alert admin-alert--${alert.type}`}>{alert.message}</div> : null}

          {selectedUser ? (
            <div className="admin-detail">
              <dl className="admin-detail__grid">
                <div>
                  <dt>E-mail</dt>
                  <dd>{selectedUser.email}</dd>
                </div>
                <div>
                  <dt>Date d inscription</dt>
                  <dd>{formatDate(selectedUser.createdAt)}</dd>
                </div>
                <div>
                  <dt>Statut</dt>
                  <dd>
                    <span className={`badge badge--${selectedUser.status}`}>
                      {selectedUser.status === "actif" ? "Actif" : "Desactive"}
                    </span>
                  </dd>
                </div>
                {selectedUser.deletionPlannedAt ? (
                  <div>
                    <dt>Suppression programmee</dt>
                    <dd>{formatDate(selectedUser.deletionPlannedAt)}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="admin-form__actions">
                <button type="button" onClick={() => handleStatusToggle(selectedUser)}>
                  {selectedUser.status === "actif" ? "Désactiver le compte" : "Re-activer le compte"}
                </button>
                <button type="button" className="admin-delete admin-delete--wide" onClick={() => handleDelete(selectedUser.email)}>
                  Supprimer définitivement
                </button>
              </div>
            </div>
          ) : (
            <p className="admin-empty-state">Aucun utilisateur a afficher pour le moment.</p>
          )}
        </section>
      </div>

      <section className="admin-panel admin-panel--stats">
        <header className="admin-panel__header">
          <div>
            <p className="admin-eyebrow">Statistiques</p>
            <h2>Questions d inscription</h2>
          </div>
          <p className="admin-helper">Synthese des reponses collectees lors de l inscription.</p>
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
      <section className="admin-safe">
        <h2>Conformité et sécurité</h2>
        <ul>
          <li>Accès limité aux administrateurs authentifiés via une route protégée.</li>
          <li>Les désactivations coupent les sessions actives et empêchent les nouvelles connexions.</li>
          <li>Les suppressions nettoient les données locales (identifiants, métadonnées) afin de respecter le droit à l’effacement.</li>
        </ul>
      </section>
      {showAllUsers ? (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal__card">
            <header className="admin-modal__header">
              <h3>Tous les e-mails</h3>
              <button type="button" className="admin-delete" onClick={() => setShowAllUsers(false)}>
                Fermer
              </button>
            </header>
            <div className="admin-modal__body">
              {users.length === 0 ? (
                <p className="admin-table__empty">Aucun compte a afficher.</p>
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
      <div className="home-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default AdminPage
