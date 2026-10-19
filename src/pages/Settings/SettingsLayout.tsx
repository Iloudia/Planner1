import { NavLink, Outlet } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import { useTranslation } from "react-i18next"
import "./SettingsPage.css"

const SettingsLayout = () => {
  const { t } = useTranslation()
  const settingsLinks = [
    { id: "account", label: t("settings.account"), path: "/parametres" },
    { id: "display", label: t("settings.display"), path: "/parametres/affichage" },
    { id: "languages", label: t("settings.languages"), path: "/parametres/langues" },
  ]

  return (
    <>

      <PageHeading eyebrow={t("settings.eyebrow")} title={t("settings.title")} />

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
</>
  )
}

export default SettingsLayout
