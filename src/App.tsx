import { Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/Home/Home";
import SportPage from "./pages/Sport/Sport";
import ActivitiesPage from "./pages/Activities/Activities";
import JournalingPage from "./pages/Journaling/Journaling";
import SelfLovePage from "./pages/SelfLove/SelfLove";
import WishlistPage from "./pages/Wishlist/Wishlist";
import CalendrierPage from "./pages/Calendrier/Calendrier";
import FinancesPage from "./pages/Finances/Finances";
import RoutinePage from "./pages/Routine/Routine";
import ProjetsPage from "./pages/Projets/Projets";
import CulturePage from "./pages/Culture/Culture";
import AlimentationPage from "./pages/Alimentation/Alimentation";
import VoyagePage from "./pages/Voyage/Voyage";
import SportWorkoutPage from "./pages/Sport/Workout";

function NotFound() {
  return (
    <div className="content-page notfound-page">
      <div className="page-hero">
        <div className="hero-chip">Oups</div>
        <h1>Page introuvable</h1>
        <p className="muted">Le lien est cassé ou la page a été déplacée.</p>
        <div className="hero-actions">
          <Link to="/" className="pill">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-area">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sport" element={<SportPage />} />
          <Route path="/sport/workout/*" element={<SportWorkoutPage />} />
          <Route path="/activites" element={<ActivitiesPage />} />
          <Route path="/journaling" element={<JournalingPage />} />
          <Route path="/self-love" element={<SelfLovePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/calendrier" element={<CalendrierPage />} />
          <Route path="/finances" element={<FinancesPage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/projets" element={<ProjetsPage />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/alimentation" element={<AlimentationPage />} />
          <Route path="/voyage" element={<VoyagePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
