import { Suspense, lazy, useEffect } from "react"
import { Link, Route, Routes, useLocation } from "react-router-dom"
import { useCookieConsent } from "./context/CookieConsentContext"
import { initAnalytics } from "./utils/firebase"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import CookieBanner from "./components/CookieBanner"
import CookiePreferencesModal from "./components/CookiePreferencesModal"
import AppUpdateBanner from "./components/AppUpdateBanner"
import AdminRoute from "./components/AdminRoute"
import AdminProductsRoute from "./components/AdminProductsRoute"

const AuthPage = lazy(() => import("./pages/Auth/AuthPage"))
const OnboardingPage = lazy(() => import("./pages/Onboarding/Onboarding"))
const LandingPage = lazy(() => import("./pages/Landing/Landing"))
const HomePage = lazy(() => import("./pages/Home/Home"))
const SportPage = lazy(() => import("./pages/Sport/Sport"))
const JournalingPage = lazy(() => import("./pages/Journaling/Journaling"))
const SelfLovePage = lazy(() => import("./pages/SelfLove/SelfLove"))
const WishlistPage = lazy(() => import("./pages/Wishlist/Wishlist"))
const CalendrierPage = lazy(() => import("./pages/Calendrier/Calendrier"))
const FinancesPage = lazy(() => import("./pages/Finances/Finances"))
const RoutinePage = lazy(() => import("./pages/Routine/Routine"))
const GoalsPage = lazy(() => import("./pages/Goals/Goals"))
const CuisinePage = lazy(() => import("./pages/Alimentation/Alimentation"))
const DietClassicPage = lazy(() => import("./pages/Diet/DietPage"))
const SportWorkoutPage = lazy(() => import("./pages/Sport/Workout"))
const FAQPage = lazy(() => import("./pages/FAQ/FaqPage"))
const ConfidentialitePage = lazy(() => import("./pages/Legal/ConfidentialitePage"))
const ContactPage = lazy(() => import("./pages/Legal/ContactPage"))
const GestionCookiesPage = lazy(() => import("./pages/Legal/GestionCookiesPage"))
const MentionsLegalesPage = lazy(() => import("./pages/Legal/MentionsLegalesPage"))
const AdminPage = lazy(() => import("./pages/Admin/AdminPage"))
const AdminProductsPage = lazy(() => import("./pages/AdminProducts/AdminProductsPage"))
const AdminProductsManagePage = lazy(() => import("./pages/AdminProducts/AdminProductsManagePage"))
const SettingsLayout = lazy(() => import("./pages/Settings/SettingsLayout"))
const SettingsAccount = lazy(() => import("./pages/Settings/SettingsAccount"))
const SettingsDisplay = lazy(() => import("./pages/Settings/SettingsDisplay"))
const SettingsLanguages = lazy(() => import("./pages/Settings/SettingsLanguages"))
const SettingsCookies = lazy(() => import("./pages/Settings/SettingsCookies"))
const AboutPage = lazy(() => import("./pages/About/AboutPage"))
const ProfilePage = lazy(() => import("./pages/Profile/Profile"))
const ArchivesPage = lazy(() => import("./pages/Archives/Archives"))
const BoutiquePage = lazy(() => import("./pages/Boutique/Boutique"))
const BoutiqueCategoryPage = lazy(() => import("./pages/Boutique/BoutiqueCategory"))
const BoutiqueProductPage = lazy(() => import("./pages/Boutique/BoutiqueProduct"))
const ThankYouPage = lazy(() => import("./pages/Boutique/ThankYouPage"))
const CartPage = lazy(() => import("./pages/Cart/CartPage"))
const PurchasesPage = lazy(() => import("./pages/Purchases/PurchasesPage"))

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
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  return null
}

function RouteFallback() {
  return (
    <div className="content-page" aria-busy="true" aria-live="polite">
      <p className="muted">Chargement...</p>
    </div>
  )
}

function App() {
  const { preferences } = useCookieConsent()

  useEffect(() => {
    if (!preferences.preferences) {
      return
    }
    void initAnalytics()
  }, [preferences.preferences])

  useEffect(() => {
    const scriptId = "google-translate-script"
    const containerId = "google_translate_element"

    if (!preferences.preferences) {
      const existingScript = document.getElementById(scriptId)
      if (existingScript) {
        existingScript.remove()
      }
      const existingContainer = document.getElementById(containerId)
      if (existingContainer) {
        existingContainer.remove()
      }
      return
    }

    if (document.getElementById(scriptId)) {
      return
    }
    ;(window as any).googleTranslateElementInit = () => {
      if (!document.getElementById(containerId)) {
        const container = document.createElement("div")
        container.id = containerId
        container.className = "google-translate-element"
        document.body.appendChild(container)
      }
      const google = (window as any).google
      if (google?.translate?.TranslateElement) {
        new google.translate.TranslateElement({ pageLanguage: "fr", autoDisplay: false }, containerId)
      }
    }
    const script = document.createElement("script")
    script.id = scriptId
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    document.body.appendChild(script)
  }, [preferences.preferences])
  return (
    <div className="app-shell">
      <ScrollToTop />
      {preferences.preferences ? (
        <div id="google_translate_element" className="google-translate-element" aria-hidden="true" />
      ) : null}
      <Header />
      <main className="main-area">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/boutique" element={<BoutiquePage />} />
            <Route path="/boutique/:categoryId" element={<BoutiqueCategoryPage />} />
            <Route path="/boutique/produit/:productId" element={<BoutiqueProductPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/merci" element={<ThankYouPage />} />
            <Route path="/confidentialite" element={<ConfidentialitePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cookies" element={<GestionCookiesPage />} />
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/bienvenue" element={<OnboardingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/sport" element={<SportPage />} />
              <Route path="/sport/workout/*" element={<SportWorkoutPage />} />
              <Route path="/journaling" element={<JournalingPage />} />
              <Route path="/self-love" element={<SelfLovePage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/calendrier" element={<CalendrierPage />} />
              <Route path="/finances" element={<FinancesPage />} />
              <Route path="/routine" element={<RoutinePage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/diet" element={<DietClassicPage />} />
              <Route path="/alimentation" element={<CuisinePage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/archives" element={<ArchivesPage />} />
              <Route path="/mes-achats" element={<PurchasesPage />} />
              <Route path="/parametres" element={<SettingsLayout />}>
                <Route index element={<SettingsAccount />} />
                <Route path="affichage" element={<SettingsDisplay />} />
                <Route path="langues" element={<SettingsLanguages />} />
                <Route path="cookies" element={<SettingsCookies />} />
              </Route>
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            <Route element={<AdminProductsRoute />}>
              <Route path="/admin/produits" element={<AdminProductsPage />} />
              <Route path="/admin/produits/publies" element={<AdminProductsManagePage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <AppUpdateBanner />
      <CookieBanner />
      <CookiePreferencesModal />
    </div>
  )
}

export default App

