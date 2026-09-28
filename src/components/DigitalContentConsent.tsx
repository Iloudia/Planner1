import { Link } from "react-router-dom"
import "./DigitalContentConsent.css"

type DigitalContentConsentProps = {
  checked: boolean
  id: string
  onChange: (checked: boolean) => void
}

const DigitalContentConsent = ({ checked, id, onChange }: DigitalContentConsentProps) => (
  <div className="digital-content-consent">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      required
    />
    <label htmlFor={id}>
      Je demande l’accès immédiat au contenu numérique avant la fin du délai de rétractation et reconnais qu’en y
      accédant, je perds mon droit de rétractation. Je reconnais avoir lu les{" "}
      <Link to="/cgv">Conditions Générales de Vente</Link>.
    </label>
  </div>
)

export default DigitalContentConsent
