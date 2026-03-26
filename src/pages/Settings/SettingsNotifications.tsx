const notificationOptions = [
  {
    label: "Notifications par e-mail",
    description: "Reçois un résumé de tes activités ou des rappels de tâches directement dans ta boîte de réception.",
  },
]

const SettingsNotifications = () => {
  return (
    <div className="settings-section">
      <h2>Notifications</h2>
      <p className="settings-section__intro">Choisis tes préférences par type de notification.</p>
      <div className="settings-options">
        {notificationOptions.map((option) => (
          <button type="button" className="settings-option" key={option.label}>
            <span className="settings-option__label">{option.label}</span>
            <span className="settings-option__description">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SettingsNotifications
