import { NavLink, Link } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
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
        <button className="nav-search" aria-label="Rechercher">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        </button>
      </nav>

      <div className="header-cta">
        <button className="profile-circle" aria-label="Ouvrir le profil">
          <span className="profile-initials">P</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
