import { FormEvent, useEffect, useMemo, useState } from "react"
import usePersistentState from "../../hooks/usePersistentState"
import { useAuth } from "../../context/AuthContext"
import "./Admin.css"

type AdminUser = {
  id: string
  fullName: string
  email: string
  role: "Utilisateur" | "Premium" | "Coach"
  status: "actif" | "en-attente" | "suspendu"
  lastLogin: string
  joinedAt: string
  note?: string
}

const STORAGE_KEY = "planner.admin.users"

const defaultUsers: AdminUser[] = [
  {
    id: "usr-001",
    fullName: "Lila Moreau",
    email: "lila@planner.fr",
    role: "Premium",
    status: "actif",
    lastLogin: "03/12/2025 · 10:04",
    joinedAt: "2024-08-01",
    note: "Ambassadrice planner club",
  },
  {
    id: "usr-002",
    fullName: "Nora Jeannin",
    email: "nora@planner.fr",
    role: "Utilisateur",
    status: "en-attente",
    lastLogin: "02/12/2025 · 17:54",
    joinedAt: "2024-09-12",
    note: "Invite de la beta finance",
  },
  {
    id: "usr-003",
    fullName: "Alexis Bernard",
    email: "alexis@planner.fr",
    role: "Coach",
    status: "actif",
    lastLogin: "01/12/2025 · 08:12",
    joinedAt: "2024-05-22",
  },
  {
    id: "usr-004",
    fullName: "Juliette Perez",
    email: "juliette@planner.fr",
    role: "Utilisateur",
    status: "suspendu",
    lastLogin: "29/11/2025 · 21:02",
    joinedAt: "2023-11-18",
    note: "Tentatives de connexion suspectes",
  },
]

const AdminPage = () => {
  const { userEmail } = useAuth()
  const [users, setUsers] = usePersistentState<AdminUser[]>(STORAGE_KEY, () => defaultUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(users[0]?.id ?? null)
  const [alert, setAlert] = useState<{ type: "success" | "info"; message: string } | null>(null)

  const selectedUser = users.find((user) => user.id === selectedId) ?? null
  const [draft, setDraft] = useState<AdminUser | null>(selectedUser)

  useEffect(() => {
    setDraft(selectedUser ?? null)
  }, [selectedUser])

  const filteredUsers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase()
    if (normalized.length === 0) return users
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized) ||
        user.role.toLowerCase().includes(normalized),
    )
  }, [users, searchTerm])

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((user) => user.status === "actif").length,
      pending: users.filter((user) => user.status === "en-attente").length,
    }
  }, [users])

  const handleSelectUser = (userId: string) => {
    setSelectedId(userId)
    setAlert(null)
  }

  const handleDraftChange = (field: keyof AdminUser, value: string) => {
    if (!draft) return
    setDraft({ ...draft, [field]: value })
  }

  const handleSave = (event: FormEvent) => {
    event.preventDefault()
    if (!draft) return
    setUsers((current) => current.map((user) => (user.id === draft.id ? draft : user)))
    setAlert({ type: "success", message: "Profil utilisateur mis à jour." })
  }

  const handleDelete = (userId: string) => {
    const target = users.find((user) => user.id === userId)
    if (!target) return
    const confirmed = window.confirm(
      `Supprimer ${target.fullName} ? Cette action est definitive et deconnecte l'utilisateur.`,
    )
    if (!confirmed) return
    setUsers((current) => {
      const next = current.filter((user) => user.id !== userId)
      if (selectedId === userId) {
        setSelectedId(next[0]?.id ?? null)
      }
      return next
    })
    setAlert({ type: "info", message: `Le compte ${target.fullName} a été supprimé.` })
  }

  return (
    <div className="admin-page">
      <div className="admin-page__accent" aria-hidden="true" />
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Console admin</p>
          <h1>Gestion des utilisateurs</h1>
          <p>Connecté en tant que {userEmail ?? "admin"}. Les actions sont journalisées.</p>
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
            <span>En attente</span>
            <strong>{stats.pending}</strong>
          </article>
        </div>
      </header>

      <div className="admin-grid">
        <section className="admin-panel">
          <header className="admin-panel__header">
            <div>
              <p className="admin-eyebrow">Utilisateurs</p>
              <h2>Liste sécurisée</h2>
            </div>
            <input
              type="search"
              placeholder="Rechercher (nom, email, rôle)"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </header>
          <div className="admin-table" role="table" aria-label="Table des utilisateurs">
            <div className="admin-table__row admin-table__row--head" role="row">
              <div role="columnheader">Utilisateur</div>
              <div role="columnheader">Rôle</div>
              <div role="columnheader">Statut</div>
              <div role="columnheader">Dernière connexion</div>
              <div role="columnheader" />
            </div>
            <div className="admin-table__body">
              {filteredUsers.length === 0 ? (
                <p className="admin-table__empty">Aucun résultat ne correspond à la recherche.</p>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    type="button"
                    key={user.id}
                    className={user.id === selectedId ? "admin-table__row is-selected" : "admin-table__row"}
                    role="row"
                    onClick={() => handleSelectUser(user.id)}
                  >
                    <div className="admin-table__cell">
                      <strong>{user.fullName}</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="admin-table__cell">{user.role}</div>
                    <div className="admin-table__cell">
                      <span className={`badge badge--${user.status}`}>{user.status.replace("-", " ")}</span>
                    </div>
                    <div className="admin-table__cell">{user.lastLogin}</div>
                    <div className="admin-table__cell admin-table__cell--actions">
                      <button
                        type="button"
                        className="admin-delete"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleDelete(user.id)
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="admin-panel admin-panel--form">
          <header className="admin-panel__header">
            <div>
              <p className="admin-eyebrow">Modification</p>
              <h2>Détails utilisateur</h2>
            </div>
            <p className="admin-helper">Seuls les administrateurs connectés peuvent modifier ces données.</p>
          </header>

          {alert ? <div className={`admin-alert admin-alert--${alert.type}`}>{alert.message}</div> : null}

          {draft ? (
            <form className="admin-form" onSubmit={handleSave}>
              <label>
                <span>Nom complet</span>
                <input value={draft.fullName} onChange={(event) => handleDraftChange("fullName", event.target.value)} />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => handleDraftChange("email", event.target.value)}
                />
              </label>

              <label>
                <span>Rôle</span>
                <select value={draft.role} onChange={(event) => handleDraftChange("role", event.target.value)}>
                  <option value="Utilisateur">Utilisateur</option>
                  <option value="Premium">Premium</option>
                  <option value="Coach">Coach</option>
                </select>
              </label>

              <label>
                <span>Statut</span>
                <select value={draft.status} onChange={(event) => handleDraftChange("status", event.target.value)}>
                  <option value="actif">Actif</option>
                  <option value="en-attente">En attente</option>
                  <option value="suspendu">Suspendu</option>
                </select>
              </label>

              <label>
                <span>Dernière connexion</span>
                <input value={draft.lastLogin} onChange={(event) => handleDraftChange("lastLogin", event.target.value)} />
              </label>

              <label>
                <span>Note interne</span>
                <textarea
                  rows={3}
                  value={draft.note ?? ""}
                  onChange={(event) => handleDraftChange("note", event.target.value)}
                />
              </label>

              <div className="admin-form__actions">
                <button type="submit">Enregistrer</button>
              </div>
            </form>
          ) : (
            <p className="admin-empty-state">Sélectionne un utilisateur dans la liste pour afficher ses informations.</p>
          )}
        </section>
      </div>

      <section className="admin-safe">
        <h2>Protection des accès</h2>
        <ul>
          <li>Cette console n est rendue visible que si vous êtes connecté en tant qu administrateur.</li>
          <li>Les tentatives d ouverture directe via l URL sont automatiquement redirigées.</li>
          <li>Chaque suppression nécessite une confirmation et les actions sont consignées dans le navigateur.</li>
        </ul>
      </section>
    </div>
  )
}

export default AdminPage
