const notificationOptions = [
  {
    label: "Notifications par e-mail",
    description: "Recevez un resume de vos activites ou des rappels de taches directement dans votre boite de reception.",
  },
]

const SettingsNotifications = () => {
  return (
    <div className="settings-section">
      <h2>Notifications</h2>
      <p className="settings-section__intro">Choisissez vos preferences par type de notification.</p>
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
