import { Link, useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import logo from "../assets/Logo.png"

function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const accountRef = useRef<HTMLDivElement | null>(null)
  const searchTargets = useMemo(
    () => [
      { label: "A propos de moi", path: "/a-propos" },
      { label: "Accueil", path: "/home" },
      { label: "Mentions legales", path: "/mentions-legales" },
      { label: "Politique de confidentialite", path: "/confidentialite" },
      { label: "Contact", path: "/contact" },
      { label: "Finances", path: "/finances" },
      { label: "Cuisine", path: "/alimentation" },
      { label: "Calendrier mensuel", path: "/calendrier" },
      { label: "Wishlist", path: "/wishlist" },
      { label: "Sport", path: "/sport" },
      { label: "Workout", path: "/sport/workout" },
      { label: "Diet", path: "/diet" },
      { label: "Goals", path: "/goals" },
      { label: "S'aimer soi-meme", path: "/self-love" },
      { label: "Archives", path: "/archives" },
      { label: "FAQ", path: "/faq" },
      { label: "Cookies", path: "/cookies" },
      { label: "Paramètres", path: "/parametres" },
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

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
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

  const handleSearchToggle = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true)
      return
    }
    handleSearchSubmit()
  }

  const handleSuggestionNavigate = (path: string) => {
    handleNavigate(path)
    setSearchTerm("")
    setSearchSuggestionsOpen(false)
    setIsSearchOpen(false)
  }

  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchSuggestionsOpen(false)
        setIsSearchOpen(false)
      }
    }

    if (searchSuggestionsOpen || isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutsideSearch)
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch)
  }, [searchSuggestionsOpen, isSearchOpen])

  useEffect(() => {
    const handleClickOutsideMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutsideMenu)
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideMenu)
  }, [isMenuOpen])

  useEffect(() => {
    const handleClickOutsideAccount = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false)
      }
    }

    if (isAccountOpen) {
      document.addEventListener("mousedown", handleClickOutsideAccount)
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideAccount)
  }, [isAccountOpen])

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus()
    }
  }, [isSearchOpen])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__top">
          <div className="site-header__left">
            <div className="header-menu" ref={menuRef}>
              <button
                type="button"
                className={`header-menu__toggle${isMenuOpen ? " is-open" : ""}`}
                aria-label="Ouvrir le menu"
                aria-expanded={isMenuOpen}
                aria-controls="header-burger-menu"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <span />
                <span />
                <span />
              </button>
              {isMenuOpen ? (
                <div className="header-menu__panel" id="header-burger-menu" role="menu">
                  <ul className="header-menu__list">
                    <li>
                      <Link
                        to={isAuthenticated ? "/home" : "/"}
                        className="header-menu__item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Accueil
                      </Link>
                    </li>
                    <li>
                      <Link to="/boutique" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        Boutique
                      </Link>
                    </li>
                    <li>
                      <Link to="/a-propos" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        À propos
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        Contact
                      </Link>
                    </li>
                    {isAuthenticated ? (
                      <>
                        <li>
                          <button
                            type="button"
                            className="header-menu__item"
                            onClick={() => {
                              handleNavigate("/profil")
                              setIsMenuOpen(false)
                            }}
                          >
                            Profil
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="header-menu__item header-menu__item--danger"
                            onClick={async () => {
                              await handleLogout()
                              setIsMenuOpen(false)
                            }}
                          >
                            Déconnexion
                          </button>
                        </li>
                      </>
                    ) : (
                      <li>
                        <button
                          type="button"
                          className="header-menu__item"
                          onClick={() => {
                            navigate("/login")
                            setIsMenuOpen(false)
                          }}
                        >
                          Se connecter
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <Link to={isAuthenticated ? "/home" : "/"} className="brand site-header__brand" aria-label="Accueil">
            <img src={logo} alt="Logo" className="site-header__logo" />
          </Link>

          <div className="site-header__right">
            <div className={`nav-search${isSearchOpen ? " nav-search--open" : ""}`} ref={searchRef}>
              <button className="nav-search__button" aria-label="Ouvrir la recherche" onClick={handleSearchToggle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.65" y1="16.65" x2="21" y2="21" />
                </svg>
              </button>
              {isSearchOpen ? (
                <input
                  ref={searchInputRef}
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
              ) : null}
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

            {isAuthenticated && isAdmin ? (
              <button className="admin-button" onClick={() => navigate("/admin")}>
                Back-office
              </button>
            ) : null}

            {!isAuthenticated ? (
              <button className="auth-button auth-button--login" onClick={() => navigate("/login")}>
                Se connecter
              </button>
            ) : (
              <div className="account-menu" ref={accountRef}>
                <button
                  type="button"
                  className={`account-menu__toggle${isAccountOpen ? " is-open" : ""}`}
                  aria-label="Ouvrir le menu du compte"
                  aria-expanded={isAccountOpen}
                  aria-controls="account-menu-panel"
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                >
                  <span className="account-menu__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c2.4-4 5.8-6 8-6s5.6 2 8 6" />
                    </svg>
                  </span>
                  <span className="account-menu__caret" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
                    </svg>
                  </span>
                </button>
                {isAccountOpen ? (
                  <div className="account-menu__panel" id="account-menu-panel" role="menu">
                    <button
                      type="button"
                      className="account-menu__item"
                      onClick={() => {
                        handleNavigate("/profil")
                        setIsAccountOpen(false)
                      }}
                    >
                      Gérer le compte
                    </button>
                    <button
                      type="button"
                      className="account-menu__item account-menu__item--danger"
                      onClick={async () => {
                        await handleLogout()
                        setIsAccountOpen(false)
                      }}
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <nav className="site-header__nav" aria-label="Navigation principale">
          <Link to={isAuthenticated ? "/home" : "/"} className="site-header__nav-link">
            Accueil
          </Link>
          <Link to="/boutique" className="site-header__nav-link">
            Boutique
          </Link>
          <Link to="/a-propos" className="site-header__nav-link">
            À propos
          </Link>
          <Link to="/contact" className="site-header__nav-link">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
