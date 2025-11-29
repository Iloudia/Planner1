import { Link, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthPage from "./pages/Auth/AuthPage"
import LandingPage from "./pages/Landing/Landing"
import HomePage from "./pages/Home/Home"
import SportPage from "./pages/Sport/Sport"
import ActivitiesPage from "./pages/Activities/Activities"
import JournalingPage from "./pages/Journaling/Journaling"
import SelfLovePage from "./pages/SelfLove/SelfLove"
import WishlistPage from "./pages/Wishlist/Wishlist"
import CalendrierPage from "./pages/Calendrier/Calendrier"
import FinancesPage from "./pages/Finances/Finances"
import RoutinePage from "./pages/Routine/Routine"
import GoalsPage from "./pages/Projets/Projets"
import CulturePage from "./pages/Culture/Culture"
import DietPage from "./pages/Alimentation/Alimentation"
import VoyagePage from "./pages/Voyage/Voyage"
import SportWorkoutPage from "./pages/Sport/Workout"
import FAQPage from "./pages/FAQ/FaqPage"
import ConfidentialitePage from "./pages/Legal/ConfidentialitePage"
import ContactPage from "./pages/Legal/ContactPage"
import GestionCookiesPage from "./pages/Legal/GestionCookiesPage"
import MentionsLegalesPage from "./pages/Legal/MentionsLegalesPage"

function NotFound() {
  return (
    <div className="content-page notfound-page">
      <div className="page-accent-bar" aria-hidden="true" />
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
      <div className="page-footer-bar" aria-hidden="true" />
    </div>
  )
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-area">
        <Routes>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/" element={<LandingPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/sport" element={<SportPage />} />
            <Route path="/sport/workout/*" element={<SportWorkoutPage />} />
            <Route path="/activites" element={<ActivitiesPage />} />
            <Route path="/journaling" element={<JournalingPage />} />
            <Route path="/self-love" element={<SelfLovePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/calendrier" element={<CalendrierPage />} />
          <Route path="/finances" element={<FinancesPage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/diet" element={<DietPage />} />
          <Route path="/voyage" element={<VoyagePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cookies" element={<GestionCookiesPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
