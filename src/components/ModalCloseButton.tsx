import "./ModalCloseButton.css"

type ModalCloseButtonProps = {
  onClick: () => void
  ariaLabel?: string
}

const ModalCloseButton = ({ onClick, ariaLabel = "Fermer" }: ModalCloseButtonProps) => (
  <button type="button" className="modal-close-button" onClick={onClick} aria-label={ariaLabel}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </button>
)

export default ModalCloseButton
