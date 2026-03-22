import { useAppUpdate } from "../hooks/useAppUpdate"

const AppUpdateBanner = () => {
  const { isUpdateAvailable, applyUpdate, dismissUpdate } = useAppUpdate()

  if (!isUpdateAvailable) {
    return null
  }

  return (
    <>
      <div className="app-update-banner__backdrop" aria-hidden="true" />
      <section className="app-update-banner" role="dialog" aria-modal="false" aria-label="Mise à jour disponible">
        <p className="app-update-banner__eyebrow">Mise à jour détectée</p>
        <h2>Une nouvelle version est disponible</h2>
        <p>Clique sur "Mettre à jour" pour charger la dernière version du site.</p>
        <div className="app-update-banner__actions">
          <button type="button" className="app-update-banner__button app-update-banner__button--ghost" onClick={dismissUpdate}>
            Plus tard
          </button>
          <button
            type="button"
            className="app-update-banner__button app-update-banner__button--primary"
            onClick={applyUpdate}
          >
            Mettre à jour
          </button>
        </div>
      </section>
    </>
  )
}

export default AppUpdateBanner

