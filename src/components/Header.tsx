import { Link, useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import defaultProfilePhoto from "../assets/katie-huber-rhoades-dupe (1).jpeg"

function Header() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [profileSrc, setProfileSrc] = useState(() => localStorage.getItem("profile-photo") ?? defaultProfilePhoto)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
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
    if (isSearchOpen) {
      searchInputRef.current?.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleStorage = () => {
      setProfileSrc(localStorage.getItem("profile-photo") ?? defaultProfilePhoto)
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className={`nav-search nav-search--center${isSearchOpen ? " nav-search--open" : ""}`} ref={searchRef}>
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

        <div className="site-header__center">
          <Link to={isAuthenticated ? "/home" : "/"} className="brand site-header__brand">
            Me&rituals
          </Link>

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

        <div className="site-header__right">
          <div className="header-cta">
            {isAuthenticated && isAdmin ? (
              <button className="admin-button" onClick={() => navigate("/admin")}>
                Back-office
              </button>
            ) : null}

            <div className="header-auth">
              {!isAuthenticated ? (
                <button className="auth-button auth-button--login" onClick={() => navigate("/login")}>
                  Connexion
                </button>
              ) : null}
            </div>

            {isAuthenticated ? (
              <button type="button" className="header-menu__profile" onClick={() => handleNavigate("/profil")}>
                <span className="header-menu__avatar">
                  <img src={profileSrc} alt="Profil" />
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
