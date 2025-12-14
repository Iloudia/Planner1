import PageHeading from "../../components/PageHeading"
import "./SettingsPage.css"

const settingsSections = [
  {
    id: "account",
    title: "Votre compte",
    description: "Gerer les informations personnelles et la securite.",
    items: [
      {
        title: "Informations sur le compte",
        description: "Consultez les informations de votre compte, comme votre numero de telephone et votre adresse e-mail.",
      },
      {
        title: "Changez votre mot de passe",
        description: "Changez votre mot de passe a tout moment.",
      },
      {
        title: "Desactiver ou supprimer le compte",
        description: "Programmer la desactivation pendant 30 jours ou supprimer immediatement.",
      },
    ],
  },
  { id: "notifications", title: "Notifications", description: "Choisir comment recevoir les alertes." },
  { id: "accessibility", title: "Accessibilite", description: "Adapter l experience a tes besoins." },
  { id: "display", title: "Affichage", description: "Modifier la taille de la police et l ambiance visuelle." },
  { id: "languages", title: "Langues", description: "Choisir la langue principale de l interface." },
]

const SettingsPage = () => {
  return (
    <div className="content-page settings-page">
      <div className="page-accent-bar" aria-hidden="true" />
      <PageHeading eyebrow="Parametres" title="Personnalise ton experience" />
      <section className="settings-section">
        <ul>
          {settingsSections.map((section) => (
            <li key={section.id}>
              <h3>{section.title}</h3>
              {section.items ? (
                <ul className="settings-sublist">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{section.description}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

export default SettingsPage
