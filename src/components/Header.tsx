import { Link, useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"

function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLDivElement | null>(null)

  const searchTargets = useMemo(
    () => [
      { label: "Accueil", path: "/home" },
      { label: "Contact", path: "/contact" },
      { label: "Finances", path: "/finances" },
      { label: "Cuisine", path: "/alimentation" },
      { label: "Calendrier mensuel", path: "/calendrier" },
      { label: "Wishlist", path: "/wishlist" },
      { label: "Sport", path: "/sport" },
      { label: "FAQ", path: "/faq" },
      { label: "Cookies", path: "/cookies" },
      { label: "Parametres", path: "/parametres" },
    ],
    [],
  )

  const filteredSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) {
      return []
    }
    return searchTargets.filter((target) => target.label.toLowerCase().startsWith(query))
  }, [searchTargets, searchTerm])

  const shouldShowSuggestions = searchSuggestionsOpen && filteredSuggestions.length > 0

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

  const handleSearchSubmit = () => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) {
      return
    }
    const match = searchTargets.find((target) => target.label.toLowerCase().startsWith(query))
    if (match) {
      handleSuggestionNavigate(match.path)
    } else {
      window.alert(`Aucun resultat pour "${searchTerm}".`)
    }
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    if (value.trim()) {
      setSearchSuggestionsOpen(true)
    } else {
      setSearchSuggestionsOpen(false)
    }
  }

  const handleSuggestionNavigate = (path: string) => {
    handleNavigate(path)
    setSearchTerm("")
    setSearchSuggestionsOpen(false)
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

  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchSuggestionsOpen(false)
      }
    }

    if (searchSuggestionsOpen) {
      document.addEventListener("mousedown", handleClickOutsideSearch)
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch)
  }, [searchSuggestionsOpen])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          Planner
        </Link>

        <div className="header-cta">
          <div className="nav-search nav-search--center" ref={searchRef}>
            <input
              className="nav-search__input"
              type="search"
              placeholder="Rechercher"
              aria-label="Rechercher"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleSearchSubmit()
                }
              }}
              onFocus={() => {
                if (searchTerm.trim()) {
                  setSearchSuggestionsOpen(true)
                }
              }}
            />
            <button className="nav-search__button" aria-label="Valider la recherche" onClick={handleSearchSubmit}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
            </button>
            {shouldShowSuggestions ? (
              <ul className="nav-search__suggestions" role="listbox">
                {filteredSuggestions.map((target) => (
                  <li key={target.path}>
                    <button
                      type="button"
                      className="nav-search__suggestion"
                      role="option"
                      onClick={() => handleSuggestionNavigate(target.path)}
                    >
                      {target.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
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
