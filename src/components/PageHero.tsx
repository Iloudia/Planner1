import type { ReactNode } from 'react'

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  stats: Array<{ id: string; label: string; value: string }>
  images: Array<{ src: string; alt: string }>
  tone?: 'blue' | 'pink'
  heroClassName?: string
  heroImage?: { src: string; alt: string }
  imageOnly?: boolean
  children?: ReactNode
}

const PageHero = ({
  eyebrow,
  title,
  description,
  stats,
  images,
  heroClassName,
  heroImage,
  imageOnly,
  children,
}: PageHeroProps) => {
  const sectionClassName = heroClassName ?? ''

  return (
    <section className={sectionClassName}>
      {heroImage ? <img src={heroImage.src} alt={heroImage.alt} loading="eager" decoding="async" /> : null}
      {!imageOnly ? (
        <>
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
        </>
      ) : null}
    </section>
  )
}

export default PageHero
