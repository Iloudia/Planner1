import { Link, NavLink, useNavigate } from "react-router-dom"
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import PrimaryActionButton from "./PrimaryActionButton"
import LanguageSwitcher from "./LanguageSwitcher"
import { useTranslation } from "react-i18next"

const normalizeSearchValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")

function Header() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, isAdmin, userEmail, logout } = useAuth()
  const canAccessAdminProducts = (userEmail ?? "").toLowerCase() === "iloudiav@gmail.com"
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileSearchPanel, setIsMobileSearchPanel] = useState(() => window.innerWidth <= 768)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const accountRef = useRef<HTMLDivElement | null>(null)
  const searchTargets = useMemo(
    () => [
      { label: t("search.aboutMe"), path: "/a-propos" },
      { label: t("header.home"), path: "/home" },
      { label: t("header.shop"), path: "/boutique" },
      { label: t("header.purchases"), path: "/mes-achats" },
      { label: t("search.legal"), path: "/mentions-legales" },
      { label: t("search.privacy"), path: "/confidentialite" },
      { label: t("header.contact"), path: "/contact" },
      { label: t("search.finances"), path: "/finances" },
      { label: t("search.projects"), path: "/project" },
      { label: t("search.cooking"), path: "/menu" },
      { label: t("search.calendar"), path: "/calendrier" },
      { label: t("search.wishlist"), path: "/wishlist" },
      { label: t("search.sport"), path: "/sport" },
      { label: t("search.workout"), path: "/sport/workout" },
      { label: t("search.journaling"), path: "/journaling" },
      { label: t("search.diet"), path: "/diet" },
      { label: t("search.goals"), path: "/goals" },
      { label: t("search.routine"), path: "/routine" },
      { label: t("search.selfLove"), path: "/mindset" },
      { label: t("header.archives"), path: "/archives" },
      { label: t("search.faq"), path: "/faq" },
      { label: t("search.cookies"), path: "/cookies" },
      { label: t("search.settings"), path: "/parametres" },
    ],
    [i18n.resolvedLanguage, t],
  )
  const filteredSuggestions = useMemo(() => {
    const query = normalizeSearchValue(searchTerm.trim())
    if (!query) {
      return []
    }
    return searchTargets.filter((target) => normalizeSearchValue(target.label).startsWith(query))
  }, [searchTargets, searchTerm])

  const shouldShowSuggestions = searchSuggestionsOpen && filteredSuggestions.length > 0
  const mobileSearchSuggestions = searchTerm.trim() ? filteredSuggestions : searchTargets.slice(0, 7)

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const handleSearchSubmit = () => {
    const query = normalizeSearchValue(searchTerm.trim())
    if (!query) {
      return
    }
    const match = searchTargets.find((target) => normalizeSearchValue(target.label).startsWith(query))
    if (match) {
      handleSuggestionNavigate(match.path)
    } else {
      window.alert(t("header.noResult", { term: searchTerm }))
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
    if (isMobileSearchPanel) {
      setIsSearchOpen(true)
      return
    }
    if (!isSearchOpen) {
      setIsSearchOpen(true)
      return
    }
    handleSearchSubmit()
  }

  const handleSearchClose = () => {
    setSearchTerm("")
    setSearchSuggestionsOpen(false)
    setIsSearchOpen(false)
  }

  const handleSuggestionNavigate = (path: string) => {
    handleNavigate(path)
    handleSearchClose()
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)")
    const syncSearchViewport = (matches: boolean) => {
      setIsMobileSearchPanel(matches)
    }

    syncSearchViewport(mediaQuery.matches)
    const listener = (event: MediaQueryListEvent) => syncSearchViewport(event.matches)
    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [])

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

  useEffect(() => {
    let previousScrollY = window.scrollY
    let animationFrameId: number | null = null

    const updateHeaderVisibility = () => {
      const currentScrollY = Math.max(window.scrollY, 0)

      if (currentScrollY <= 16 || currentScrollY < previousScrollY) {
        setIsHeaderHidden(false)
      } else if (currentScrollY > previousScrollY) {
        setIsHeaderHidden(true)
      }

      previousScrollY = currentScrollY
      animationFrameId = null
    }

    const handleScroll = () => {
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(updateHeaderVisibility)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <header className={`site-header${isHeaderHidden ? " site-header--hidden" : ""}${isAccountOpen ? " site-header--account-open" : ""}`}>
      <div className="site-header__inner">
        <div className="site-header__top">
          <div className="site-header__left">
            <div className="header-menu" ref={menuRef}>
              <button
                type="button"
                className={`header-menu__toggle${isMenuOpen ? " is-open" : ""}`}
                aria-label={t("header.openMenu")}
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
                        {t("header.home")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/boutique" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        {t("header.shop")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/panier" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        {t("header.cart")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        {t("header.blog")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/a-propos" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        {t("header.about")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        {t("header.contact")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/archives" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                        {t("header.archives")}
                      </Link>
                    </li>
                    {isAuthenticated ? (
                      <li>
                        <Link to="/mes-achats" className="header-menu__item" onClick={() => setIsMenuOpen(false)}>
                          {t("header.purchases")}
                        </Link>
                      </li>
                    ) : null}
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
                            {t("header.account")}
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
                            {t("header.logout")}
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
                          {t("header.login")}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <Link to={isAuthenticated ? "/home" : "/"} className="site-header__brand kapakana-brand" aria-label={t("header.home")}>
            Me&rituals
          </Link>

          <div className="site-header__right">
            <div className={`nav-search${isSearchOpen ? " nav-search--open" : ""}`} ref={searchRef}>
              <button className="nav-search__button" aria-label={t("header.openSearch")} onClick={handleSearchToggle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.65" y1="16.65" x2="21" y2="21" />
                </svg>
              </button>
              {isSearchOpen && !isMobileSearchPanel ? (
                <input
                  ref={searchInputRef}
                  className="nav-search__input"
                  type="search"
                  placeholder={t("header.search")}
                  aria-label={t("header.search")}
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
              {shouldShowSuggestions && !isMobileSearchPanel ? (
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
              {isSearchOpen && isMobileSearchPanel ? (
                <div
                  className="nav-search__mobile-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("header.searchDialog")}
                  onClick={(event) => {
                    if (event.target === event.currentTarget) {
                      handleSearchClose()
                    }
                  }}
                >
                  <div className="nav-search__mobile-sheet">
                    <div className="nav-search__mobile-input-row">
                      <input
                        ref={searchInputRef}
                        className="nav-search__mobile-input"
                        type="search"
                        placeholder={`${t("header.search")}...`}
                        aria-label={t("header.search")}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault()
                            handleSearchSubmit()
                          }
                        }}
                      />
                      <PrimaryActionButton className="nav-search__mobile-cancel" onClick={handleSearchClose}>
                        {t("common.cancel")}
                      </PrimaryActionButton>
                    </div>
                    <div className="nav-search__mobile-content">
                      <p className="nav-search__mobile-title">{t("header.suggestions")}</p>
                      {mobileSearchSuggestions.length > 0 ? (
                        <ul className="nav-search__mobile-suggestions" role="listbox">
                          {mobileSearchSuggestions.map((target) => (
                            <li key={`mobile-${target.path}`}>
                              <button
                                type="button"
                                className="nav-search__mobile-suggestion"
                                role="option"
                                onClick={() => handleSuggestionNavigate(target.path)}
                              >
                                {target.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="nav-search__mobile-empty">{t("header.noSuggestion")}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <LanguageSwitcher className="language-switcher--header" />

            {isAuthenticated && isAdmin ? (
              <PrimaryActionButton className="admin-button" onClick={() => navigate("/admin")}>
                Back-office
              </PrimaryActionButton>
            ) : null}

            {!isAuthenticated ? (
              <PrimaryActionButton className="auth-button auth-button--login" onClick={() => navigate("/login")}>
                {t("header.login")}
              </PrimaryActionButton>
            ) : (
              <div className="account-menu" ref={accountRef}>
                <button
                  type="button"
                  className={`account-menu__toggle${isAccountOpen ? " is-open" : ""}`}
                  aria-label={t("header.openAccount")}
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
                      {t("header.account")}
                    </button>
                    <button
                      type="button"
                      className="account-menu__item"
                      onClick={() => {
                        handleNavigate("/mes-achats")
                        setIsAccountOpen(false)
                      }}
                    >
                      {t("header.purchases")}
                    </button>
                    <button
                      type="button"
                      className="account-menu__item"
                      onClick={() => {
                        handleNavigate("/archives")
                        setIsAccountOpen(false)
                      }}
                    >
                      {t("header.archives")}
                    </button>
                    {isAdmin ? (
                      <button
                        type="button"
                        className="account-menu__item"
                        onClick={() => {
                          handleNavigate("/blog")
                          setIsAccountOpen(false)
                        }}
                      >
                        {t("header.blogManagement")}
                      </button>
                    ) : null}
                    {canAccessAdminProducts ? (
                      <>
                        <button
                          type="button"
                          className="account-menu__item"
                          onClick={() => {
                            handleNavigate("/admin/produits")
                            setIsAccountOpen(false)
                          }}
                        >
                          {t("header.productSheet")}
                        </button>
                        <button
                          type="button"
                          className="account-menu__item"
                          onClick={() => {
                            handleNavigate("/admin/produits/publies")
                            setIsAccountOpen(false)
                          }}
                        >
                          {t("header.publishedProducts")}
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      className="account-menu__item account-menu__item--danger"
                      onClick={async () => {
                        await handleLogout()
                        setIsAccountOpen(false)
                      }}
                    >
                      {t("header.logout")}
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <nav className="site-header__nav" aria-label={t("header.mainNavigation")}>
          <NavLink
            to={isAuthenticated ? "/home" : "/"}
            end
            className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}
          >
            {t("header.home")}
          </NavLink>
          <NavLink to="/boutique" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>
            {t("header.shop")}
          </NavLink>
          <NavLink to="/panier" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>
            {t("header.cart")}
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/mes-achats" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>
              {t("header.purchases")}
            </NavLink>
          ) : null}
          <div className="site-header__nav-dropdown">
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `site-header__nav-link site-header__nav-link--dropdown${isActive ? " is-active" : ""}`
              }
            >
              <span>{t("header.blog")}</span>
              <span className="site-header__nav-arrow" aria-hidden="true">
                ▾
              </span>
            </NavLink>
            <div className="site-header__nav-submenu" aria-label={t("header.blogCategories")}>
              <Link to="/blog/sante-beaute">{t("header.healthBeauty")}</Link>
              <Link to="/blog/mode">{t("header.fashion")}</Link>
              <Link to="/blog/mental">{t("header.mental")}</Link>
              <Link to="/blog/sport-nutrition">{t("header.sportNutrition")}</Link>
              <Link to="/blog/lifestyle">{t("header.lifestyle")}</Link>
            </div>
          </div>
          <NavLink to="/contact" className={({ isActive }) => `site-header__nav-link${isActive ? " is-active" : ""}`}>
            {t("header.contact")}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
