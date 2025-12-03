const helpOptions = [
  {
    label: "Consulter la documentation",
    description: "Retrouve des articles detailles pour chaque fonctionnalite.",
  },
  {
    label: "Contacter le support",
    description: "Ecris-nous pour obtenir une aide personnalisee.",
  },
]

const SettingsHelp = () => {
  return (
    <div className="settings-section">
      <h2>Centre d aides</h2>
      <p className="settings-section__intro">Nous sommes la pour repondre a tes questions et t accompagner.</p>
      <div className="settings-options">
        {helpOptions.map((option) => (
          <button type="button" className="settings-option" key={option.label}>
            <span className="settings-option__label">{option.label}</span>
            <span className="settings-option__description">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SettingsHelp
