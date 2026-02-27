import PageHeading from "../../components/PageHeading"
import "./SettingsPage.css"

const settingsSections = [
  {
    id: "account",
    title: "Votre compte",
    description: "Gérer les informations personnelles et la sécurité.",
    items: [
      {
        title: "Informations sur le compte",
        description: "Consultez les informations de votre compte, comme votre numéro de téléphone et votre adresse e-mail.",
      },
      {
        title: "Changez votre mot de passe",
        description: "Changez votre mot de passe à tout moment.",
      },
      {
        title: "Désactiver ou supprimer le compte",
        description: "Programmer la désactivation pendant 30 jours ou supprimer immédiatement.",
      },
    ],
  },
  { id: "display", title: "Affichage", description: "Modifier la taille de la police et l’ambiance visuelle." },
  { id: "languages", title: "Langues", description: "Choisir la langue principale de l’interface." },
  {
    description: "Contrôle des traceurs utilisés sur Planner.",
    items: [
      { title: "Essentiels actifs", description: "Garantissent la connexion et la sécurité de l'espace personnel." },
      { title: "Statistiques optionnelles", description: "Mesurent les visites de manière anonyme pour améliorer le site." },
      { title: "Personnalisation", description: "Mémento des catégories favorites et suggestions adaptées." },
    ],
  },
]

const SettingsPage = () => {
  return (
    <>

      <div className="content-page settings-page">
        <PageHeading eyebrow="Paramètres" title="Personnalise ton expérience" />
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
      </div>
</>
  )
}

export default SettingsPage