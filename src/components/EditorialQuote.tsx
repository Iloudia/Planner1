import "./EditorialQuote.css"

type EditorialQuoteProps = {
  quote: string
  eyebrow?: string
  ariaLabel?: string
  className?: string
}

const EditorialQuote = ({
  quote,
  eyebrow = "À garder près de soi",
  ariaLabel = "Pensée inspirante",
  className = "",
}: EditorialQuoteProps) => (
  <aside className={["editorial-quote", className].filter(Boolean).join(" ")} aria-label={ariaLabel}>
    <span className="editorial-quote__eyebrow">{eyebrow}</span>
    <blockquote>{quote}</blockquote>
  </aside>
)

export default EditorialQuote
