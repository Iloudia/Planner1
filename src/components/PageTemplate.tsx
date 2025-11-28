import { Link } from "react-router-dom";
import PageHeading from "./PageHeading";

type PageSection = {
  title: string;
  items: string[];
};

type CTA = {
  label: string;
  to: string;
  variant?: "ghost" | "solid";
};

type PageTemplateProps = {
  className: string;
  kicker: string;
  title: string;
  summary: string;
  sections: PageSection[];
  primaryCta?: CTA;
  secondaryCta?: CTA;
};

function PageTemplate({
  className,
  kicker,
  title,
  summary,
  sections,
  primaryCta = { label: "Retour à l'accueil", to: "/" },
  secondaryCta
}: PageTemplateProps) {
  return (
    <div className={`content-page ${className}`}>
      <PageHeading eyebrow={kicker} title={title} />

      <div className="page-hero">
        <div className="hero-chip">{kicker}</div>
        <h2>{title}</h2>
        <p className="muted">{summary}</p>
        <div className="hero-actions">
          <Link to={primaryCta.to} className="pill">
            {primaryCta.label}
          </Link>
          {secondaryCta ? (
            <Link
              to={secondaryCta.to}
              className={secondaryCta.variant === "ghost" ? "pill pill-ghost" : "pill"}
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="page-sections">
        {sections.map((section) => (
          <article key={section.title} className="section-card">
            <h3>{section.title}</h3>
            <ul className="bullet-list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PageTemplate;
