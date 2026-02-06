type PageHeadingProps = {
  eyebrow: string
  title: string
  className?: string
}

const PageHeading = ({ eyebrow, title, className }: PageHeadingProps) => {
  return (
    <header className={`sport-header${className ? ` ${className}` : ''}`}>
      <div>
        <span className="sport-header__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
    </header>
  )
}

export default PageHeading
