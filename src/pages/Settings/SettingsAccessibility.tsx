const accessibilityOptions = [
  {
    label: "Contraste et taille du texte",
    description: "Ajustez le contraste et la taille des caracteres pour ameliorer la lecture.",
  },
  {
    label: "Navigation au clavier",
    description: "Activez les options pour faciliter l utilisation du clavier dans les menus.",
  },
]

const SettingsAccessibility = () => {
  return (
    <div className="settings-section">
      <h2>Accessibilite</h2>
      <p className="settings-section__intro">Adapter l experience aux besoins de chacun pour rendre l interface confortable.</p>
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
