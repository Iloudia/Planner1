import { NavLink, Outlet } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import "./SettingsPage.css"

const settingsLinks = [
  { id: "account", label: "Votre compte", path: "/parametres" },
  { id: "notifications", label: "Notifications", path: "/parametres/notifications" },
  { id: "accessibility", label: "Accessibilite", path: "/parametres/accessibilite" },
  { id: "display", label: "Affichage", path: "/parametres/affichage" },
  { id: "languages", label: "Langues", path: "/parametres/langues" },
  { id: "cookies", label: "Gestion des cookies", path: "/parametres/cookies" },
]

const SettingsLayout = () => {
  return (
    <>
    <div className="page-accent-bar" aria-hidden="true" />
    <PageHeading eyebrow="Parametres" title="Personnalise ton experience" />
      
      <div className="content-page settings-page">
        
        <div className="settings-layout">
          <nav className="settings-nav">
            <ul>
              {settingsLinks.map((link) => (
                <li key={link.id}>
                  <NavLink to={link.path} end className={({ isActive }) => (isActive ? "is-active" : "")}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <section className="settings-panel">
            <Outlet />
          </section>
        </div>
      </div>
      <div className="page-footer-bar" aria-hidden="true" />
    </>
  )
}

export default SettingsLayout
