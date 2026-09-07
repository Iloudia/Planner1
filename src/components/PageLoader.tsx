import "./PageLoader.css"

type PageLoaderProps = {
  label?: string
}

const PageLoader = ({ label = "Votre espace se prépare" }: PageLoaderProps) => (
  <div className="page-loader" role="status" aria-live="polite" aria-busy="true">
    <div className="page-loader__mark" aria-hidden="true">
      <span className="page-loader__ring page-loader__ring--outer" />
      <span className="page-loader__ring page-loader__ring--inner" />
      <span className="page-loader__ampersand">&amp;</span>
    </div>

    <div className="page-loader__brand" aria-hidden="true">
      Me<span>&amp;</span>rituals
    </div>

    <span className="page-loader__label">{label}</span>
    <span className="page-loader__progress" aria-hidden="true">
      <span />
    </span>
  </div>
)

export default PageLoader
