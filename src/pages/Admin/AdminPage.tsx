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

const isEmailLike = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanString(value))

const toSortedEntries = (bucket: Record<string, number>) =>
  Object.entries(bucket).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

const joinLabelList = (value: unknown) => {
  const entries = toStringList(value)
  return entries.length > 0 ? entries.join(", ") : "Non renseigne"
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
  if (!source && !sourceOther) return "Non renseigne"
  if (!sourceOther) return source
  if (!source || source === "Autre") return sourceOther
  return `${source} (${sourceOther})`
}

const pieColors = ["#ff6b6b", "#4dabf7", "#ffd43b", "#51cf66", "#f76707", "#845ef7", "#12b886", "#e64980"]

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

  const missingEmailCandidate = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (!normalized || !isEmailLike(normalized)) {
      return null
    }
    return users.some((user) => user.email.toLowerCase() === normalized) ? null : normalized
  }, [searchTerm, users])

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
      const gender = normalizeGender(user.identityInfo?.gender ?? "")
      bumpCount(genderCounts, gender)

      const onboarding = user.onboarding

      const source = cleanString(onboarding?.source) || "non renseigne"
      bumpCount(sourceCounts, source)

      const reasons = toStringList(onboarding?.reasons)
      bumpCount(reasonsCounts, reasons.length === 0 ? "non renseigne" : reasons.join(", "))

      const categories = toStringList(onboarding?.categories)
      bumpCount(categoryCounts, categories.length === 0 ? "non renseigne" : categories.join(", "))

      const priority = toStringList(onboarding?.priority)
      bumpCount(priorityCounts, priority.length === 0 ? "non renseigne" : priority.join(", "))
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
