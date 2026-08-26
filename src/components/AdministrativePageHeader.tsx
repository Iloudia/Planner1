import "./AdministrativePageHeader.css"

type AdministrativePageHeaderProps = {
  eyebrow: string
  title: string
}

const AdministrativePageHeader = ({ eyebrow, title }: AdministrativePageHeaderProps) => {
  return (
    <header className="administrative-page-header">
      <div>
        <span className="administrative-page-header__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
    </header>
  )
}

export default AdministrativePageHeader
