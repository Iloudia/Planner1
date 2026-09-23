import { useRef } from "react"
import MediaImage from "./MediaImage"
import "./ImageUploadPanel.css"

type ImageUploadPanelProps = {
  previewSrc?: string
  previewAlt?: string
  addText?: string
  replaceText?: string
  removeText?: string
  disabled?: boolean
  onFileSelect: (file: File | null) => void
  onRemove?: () => void
}

const ImageUploadPanel = ({
  previewSrc = "",
  previewAlt = "Aperçu de l’image",
  addText = "Ajouter une image",
  replaceText = "Modifier l’image",
  removeText = "Retirer l’image",
  disabled = false,
  onFileSelect,
  onRemove,
}: ImageUploadPanelProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className={`image-upload-panel${previewSrc ? " image-upload-panel--has-image" : ""}`}>
      <input
        ref={inputRef}
        className="image-upload-panel__input"
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={(event) => {
          onFileSelect(event.target.files?.[0] ?? null)
          event.target.value = ""
        }}
      />
      {previewSrc ? (
        <MediaImage
          className="image-upload-panel__preview"
          src={previewSrc}
          alt={previewAlt}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className="image-upload-panel__actions">
        <button type="button" disabled={disabled} onClick={() => inputRef.current?.click()}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <circle cx="9" cy="10" r="1.5" />
            <path d="m4 18 5-5 3 3 3-3 5 5" />
          </svg>
          <span>{previewSrc ? replaceText : addText}</span>
        </button>
        {previewSrc && onRemove ? (
          <button type="button" disabled={disabled} onClick={onRemove}>
            {removeText}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default ImageUploadPanel
