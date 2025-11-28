import type { ReactNode } from 'react'

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  stats: Array<{ id: string; label: string; value: string }>
  images: Array<{ src: string; alt: string }>
  tone?: 'blue' | 'pink'
  children?: ReactNode
}

const PageHero = ({ eyebrow, title, description, stats, images, children }: PageHeroProps) => {
  return (
    <section className="finance-hero dashboard-panel">
      <div className="finance-hero__content">
        <span className="finance-hero__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="finance-hero__stats">
          {stats.map((stat) => (
            <article key={stat.id}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>
        {children}
      </div>
      <div className="finance-hero__gallery" aria-hidden="true">
        {images.slice(0, 3).map((image, index) => (
          <div key={image.src} className={`finance-hero__photo finance-hero__photo--${index + 1}`}>
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default PageHero
