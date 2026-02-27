const accessibilityOptions = [
  {
    label: "Navigation au clavier",
    description: "Activez les options pour faciliter l’utilisation du clavier dans les menus.",
  },
]

const SettingsAccessibility = () => {
  return (
    <div className="settings-section">
      <h2>Accessibilité</h2>
      <p className="settings-section__intro">Adapter l’expérience aux besoins de chacun pour rendre l’interface confortable.</p>
      <div className="settings-options">
        {accessibilityOptions.map((option) => (
          <button type="button" className="settings-option" key={option.label}>
            <span className="settings-option__label">{option.label}</span>
            <span className="settings-option__description">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SettingsAccessibility