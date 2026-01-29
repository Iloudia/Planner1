import "./SettingsPage.css"

const SettingsCookies = () => {
  return (
    <section className="settings-cookies">
      <button
        type="button"
        className="cookie-actions__outline"
        onClick={() => {
          window.location.href = "/cookies"
        }}
      >
        Gestion des cookies
      </button>
    </section>
  )
}
export default SettingsCookies
