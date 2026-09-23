import type { MouseEventHandler, ReactNode } from "react"
import { Link } from "react-router-dom"
import "./PrimaryActionButton.css"

type PrimaryActionButtonProps = {
  children: ReactNode
  className?: string
  to?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: "button" | "submit"
}

function PrimaryActionButton({ children, className = "", to, onClick, type = "button" }: PrimaryActionButtonProps) {
  const classes = `primary-action-button${className ? ` ${className}` : ""}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  )
}

export default PrimaryActionButton
