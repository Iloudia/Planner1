import { useAppUpdate } from "../hooks/useAppUpdate"
import { useTranslation } from "react-i18next"

const AppUpdateBanner = () => {
  const { t } = useTranslation()
  const { isUpdateAvailable, applyUpdate, dismissUpdate } = useAppUpdate()

  if (!isUpdateAvailable) {
    return null
  }

  return (
    <>
      <div className="app-update-banner__backdrop" aria-hidden="true" />
      <section className="app-update-banner" role="dialog" aria-modal="false" aria-label={t("update.available")}>
        <p className="app-update-banner__eyebrow">{t("update.detected")}</p>
        <h2>{t("update.title")}</h2>
        <p>{t("update.text")}</p>
        <div className="app-update-banner__actions">
          <button type="button" className="app-update-banner__button app-update-banner__button--ghost" onClick={dismissUpdate}>
            {t("update.later")}
          </button>
          <button
            type="button"
            className="app-update-banner__button app-update-banner__button--primary"
            onClick={applyUpdate}
          >
            {t("update.action")}
          </button>
        </div>
      </section>
    </>
  )
}

export default AppUpdateBanner

