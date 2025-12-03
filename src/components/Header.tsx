import { Link, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"

function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const closeMenus = () => {
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
    closeMenus()
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    closeMenus()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenus()
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          Planner
        </Link>

        <div className="header-cta">
          <div className="nav-search nav-search--center">
            <input className="nav-search__input" type="search" placeholder="Rechercher" aria-label="Rechercher" />
            <button className="nav-search__button" aria-label="Valider la recherche">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
            </button>
          </div>

          <div className="header-auth">
            {!isAuthenticated ? (
              <button className="auth-button auth-button--login" onClick={() => navigate("/login")}>
                Connexion
              </button>
            ) : null}
          </div>

          <div className="header-menu" ref={menuRef}>
            <button
              type="button"
              className={menuOpen ? "header-menu__toggle is-open" : "header-menu__toggle"}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((previous) => !previous)}
            >
              <span />
              <span />
              <span />
            </button>
            {menuOpen ? (
              <div className="header-menu__panel" role="menu">
                <ul className="header-menu__list">
                  <li>
                    <button type="button" className="header-menu__item" onClick={() => handleNavigate("/parametres")}>
                      Parametres
                    </button>
                  </li>
                  <li>
                    <button type="button" className="header-menu__item" onClick={() => handleNavigate("/activite")}>
                      Votre activite
                    </button>
                  </li>
                  <li>
                    <button type="button" className="header-menu__item" onClick={() => closeMenus()}>
                      Changer l apparence
                    </button>
                  </li>
                  <li>
                    <button type="button" className="header-menu__item" onClick={() => closeMenus()}>
                      Signaler un probleme
                    </button>
                  </li>
                  <li>
                    <button type="button" className="header-menu__item" onClick={() => handleNavigate("/login")}>
                      Changer de compte
                    </button>
                  </li>
                  <li>
                    <button type="button" className="header-menu__item header-menu__item--danger" onClick={handleLogout}>
                      Deconnexion
                    </button>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
