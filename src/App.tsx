import { Link, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthPage from "./pages/Auth/AuthPage"
import OnboardingPage from "./pages/Onboarding/Onboarding"
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
import GoalsPage from "./pages/Goals/Goals"
import CulturePage from "./pages/Culture/Culture"
import CuisinePage from "./pages/Alimentation/Alimentation"
import DietClassicPage from "./pages/Diet/DietPage"
import VoyagePage from "./pages/Voyage/Voyage"
import SportWorkoutPage from "./pages/Sport/Workout"
import FAQPage from "./pages/FAQ/FaqPage"
import ConfidentialitePage from "./pages/Legal/ConfidentialitePage"
import ContactPage from "./pages/Legal/ContactPage"
import GestionCookiesPage from "./pages/Legal/GestionCookiesPage"
import MentionsLegalesPage from "./pages/Legal/MentionsLegalesPage"
import CookieBanner from "./components/CookieBanner"
import CookiePreferencesModal from "./components/CookiePreferencesModal"
import AdminPage from "./pages/Admin/AdminPage"
import AdminRoute from "./components/AdminRoute"
import SettingsLayout from "./pages/Settings/SettingsLayout"
import SettingsAccount from "./pages/Settings/SettingsAccount"
import SettingsAccessibility from "./pages/Settings/SettingsAccessibility"
import SettingsDisplay from "./pages/Settings/SettingsDisplay"
import SettingsLanguages from "./pages/Settings/SettingsLanguages"
import SettingsCookies from "./pages/Settings/SettingsCookies"
import AboutPage from "./pages/About/AboutPage"

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
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/confidentialite" element={<ConfidentialitePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cookies" element={<GestionCookiesPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/bienvenue" element={<OnboardingPage />} />
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
            <Route path="/diet" element={<DietClassicPage />} />
            <Route path="/alimentation" element={<CuisinePage />} />
            <Route path="/voyage" element={<VoyagePage />} />
            <Route path="/parametres" element={<SettingsLayout />}>
              <Route index element={<SettingsAccount />} />
              <Route path="accessibilite" element={<SettingsAccessibility />} />
              <Route path="affichage" element={<SettingsDisplay />} />
              <Route path="langues" element={<SettingsLanguages />} />
              <Route path="cookies" element={<SettingsCookies />} />
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
      <CookiePreferencesModal />
    </div>
  )
}

export default App
