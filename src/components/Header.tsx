import { Link, useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { buildUserScopedKey, normalizeUserEmail } from "../utils/userScopedKey"
import defaultProfilePhoto from "../assets/katie-huber-rhoades-dupe (1).jpeg"

const PROFILE_STORAGE_KEY = "planner.profile.preferences.v1"

const readProfileUsername = (key: string) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return ""
    const parsed = JSON.parse(raw) as { identityInfo?: { username?: string } }
    return parsed?.identityInfo?.username ?? ""
  } catch {
    return ""
  }
}

function Header() {
  const { isAuthenticated, isAdmin, logout, userEmail } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false)
  const [profileSrc, setProfileSrc] = useState(() => localStorage.getItem("profile-photo") ?? defaultProfilePhoto)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const profileDataKey = useMemo(() => buildUserScopedKey(normalizeUserEmail(userEmail), PROFILE_STORAGE_KEY), [userEmail])
  const profileUsername = useMemo(() => readProfileUsername(profileDataKey), [profileDataKey])
  const displayName = profileUsername || (userEmail ? userEmail.split("@")[0] : "Utilisateur")
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
        <Link to={isAuthenticated ? "/home" : "/"} className="brand">
          Me&rituals
        </Link>

        <div className="nav-search nav-search--center" ref={searchRef}>
          <button className="nav-search__button" aria-label="Valider la recherche" onClick={handleSearchSubmit}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </button>
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
            <div className="header-menu" ref={menuRef}>
              <button
                type="button"
                className={menuOpen ? "header-menu__profile is-open" : "header-menu__profile"}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((previous) => !previous)}
              >
                <span className="header-menu__avatar">
                  <img src={profileSrc} alt="Profil" />
                </span>
                <span className="header-menu__name">{displayName}</span>
                <span className="header-menu__caret" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
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
                      <button type="button" className="header-menu__item" onClick={() => handleNavigate("/archives")}>
                        Archives
                      </button>
                    </li>
                    <li>
                      <button type="button" className="header-menu__item" onClick={() => handleNavigate("/parametres")}>
                        Paramètres
                      </button>
                    </li>
                    <li>
                      <button type="button" className="header-menu__item header-menu__item--danger" onClick={handleLogout}>
                        Déconnexion
                      </button>
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
