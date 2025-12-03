const displayOptions = [
  {
    label: "Affichage",
    description: "Choisissez le theme, la densite et les animations de l interface.",
  },
  {
    label: "Langues",
    description: "Selectionnez la langue principale utilisee dans l application.",
  },
  {
    label: "Raccourcis clavier",
    description: "Consultez ou personnalisez les raccourcis pour gagner du temps.",
  },
]

const SettingsDisplay = () => {
  return (
    <div className="settings-section">
      <h2>Affichage et langues</h2>
      <p className="settings-section__intro">Personnalisez l apparence et la langue de votre espace.</p>
      <div className="settings-options">
        {displayOptions.map((option) => (
          <button type="button" className="settings-option" key={option.label}>
            <span className="settings-option__label">{option.label}</span>
            <span className="settings-option__description">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SettingsDisplay
