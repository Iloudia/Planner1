import { NavLink, Link } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand">
          Planner
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            end
          >
            Home
          </NavLink>
        </nav>

        <div className="header-cta">
          <div className="nav-search">
            <input className="nav-search__input" type="search" placeholder="Rechercher" aria-label="Rechercher" />
            <button className="nav-search__button" aria-label="Valider la recherche">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.65" y1="16.65" x2="21" y2="21" />
              </svg>
            </button>
          </div>

          <button className="profile-circle" aria-label="Ouvrir le profil">
            <span className="profile-initials">P</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
