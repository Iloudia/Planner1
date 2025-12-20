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

const AdminPage = () => {
  const { userEmail, adminListUsers, adminUpdateStatus, adminDeleteUser } = useAuth()
  const [users, setUsers] = useState<AdminUserRecord[]>(() => adminListUsers())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmail, setSelectedEmail] = useState<string | null>(users[0]?.email ?? null)
  const [alert, setAlert] = useState<AlertState>(null)

  useEffect(() => {
    setUsers(adminListUsers())
  }, [])

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

  const selectedUser = selectedEmail ? users.find((user) => user.email === selectedEmail) ?? null : null

  const refreshUsers = () => {
    setUsers(adminListUsers())
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
    setAlert({ type: "success", message: "Compte supprime et donnees nettoyees." })
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
          <p>Connecte en tant que {userEmail ?? "admin"}. Acces reserve aux administrateurs verifies.</p>
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
            <span>Desactives</span>
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
            <input
              type="search"
              placeholder="Rechercher par e-mail"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </header>
          <div className="admin-table" role="table" aria-label="Utilisateurs inscrits">
            <div className="admin-table__row admin-table__row--head" role="row">
              <div role="columnheader">E-mail</div>
              <div role="columnheader">Inscription</div>
              <div role="columnheader">Statut</div>
              <div role="columnheader">Actions</div>
            </div>
            <div className="admin-table__body">
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
              <h2>Profil selectionne</h2>
            </div>
            <p className="admin-helper">Recherche, selection, desactivation ou suppression en un clic.</p>
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
                  {selectedUser.status === "actif" ? "Desactiver le compte" : "Re-activer le compte"}
                </button>
                <button type="button" className="admin-delete admin-delete--wide" onClick={() => handleDelete(selectedUser.email)}>
                  Supprimer definitivement
                </button>
              </div>
            </div>
          ) : (
            <p className="admin-empty-state">Aucun utilisateur a afficher pour le moment.</p>
          )}
        </section>
      </div>

      <section className="admin-safe">
        <h2>Conformite et securite</h2>
        <ul>
          <li>Acces limite aux administrateurs authentifies via une route protege.</li>
          <li>Les desactivations coupent les sessions actives et empechent les nouvelles connexions.</li>
          <li>Les suppressions nettoient les donnees locales (identifiants, metadonnees) afin de respecter le droit a l effacement.</li>
        </ul>
      </section>
    </div>
  )
}

export default AdminPage
