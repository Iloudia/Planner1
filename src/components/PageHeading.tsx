import type { ReactNode } from 'react'

type PageHeadingProps = {
  eyebrow: string
  title: string
  className?: string
  children?: ReactNode
}

const PageHeading = ({ eyebrow, title, className, children }: PageHeadingProps) => {
  return (
    <header className={`sport-header${className ? ` ${className}` : ''}`}>
      <div>
        <span className="sport-header__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {children}
    </header>
  )
}

export default PageHeading
