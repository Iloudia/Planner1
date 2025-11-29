import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            {isAuthenticated ? (
              <>
                <button className="auth-button auth-button--logout" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <button className="auth-button auth-button--login" onClick={() => navigate("/login")}>
                Connexion
              </button>
            )}
          </div>

          <button className="profile-circle" aria-label="Ouvrir le profil" onClick={() => navigate("/home")}>
            <span className="profile-initials">P</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

