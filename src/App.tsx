import { Suspense, lazy, useEffect, useLayoutEffect, useState } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useCookieConsent } from "./context/CookieConsentContext"
import { useAuth } from "./context/AuthContext"
import { applyPageBackground, DEFAULT_PAGE_BACKGROUND } from "./utils/pageBackground"
import { getPageBackgroundPreset } from "./data/pageBackgroundPresets"
import { applyColorMode, DEFAULT_COLOR_MODE } from "./utils/colorMode"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import CookieBanner from "./components/CookieBanner"
import AppUpdateBanner from "./components/AppUpdateBanner"
import AdminRoute from "./components/AdminRoute"
import AdminProductsRoute from "./components/AdminProductsRoute"
import BlogArticlePublicationGate from "./components/BlogArticlePublicationGate"
import PremiumArchivesRoute from "./components/PremiumArchivesRoute"
import PageLoader from "./components/PageLoader"
import PrimaryActionButton from "./components/PrimaryActionButton"
import MediaImage from "./components/MediaImage"
import landingHero from "./assets/frances-leynes-dupe.webp"
import landingHeroMobile from "./assets/frances-leynes-dupe-mobile.webp"
import { useTranslation } from "react-i18next"
import type { TFunction } from "i18next"

let analyticsModulePromise: Promise<typeof import("./utils/firebaseAnalytics")> | null = null

const updateAnalyticsConsent = (enabled: boolean) => {
  if (!enabled && !analyticsModulePromise) {
    return Promise.resolve()
  }

  analyticsModulePromise ??= import("./utils/firebaseAnalytics")
  return analyticsModulePromise.then(({ setAnalyticsConsent }) => setAnalyticsConsent(enabled)).then(() => undefined)
}

const AuthPage = lazy(() => import("./pages/Auth/AuthPage"))
const CookiePreferencesModal = lazy(() => import("./components/CookiePreferencesModal"))
const OnboardingPage = lazy(() => import("./pages/Onboarding/Onboarding"))
const LandingPage = lazy(() => import("./pages/Landing/Landing"))
const HomePage = lazy(() => import("./pages/Home/Home"))
const SportPage = lazy(() => import("./pages/Sport/Sport"))
const JournalingPage = lazy(() => import("./pages/Journaling/Journaling"))
const SelfLovePage = lazy(() => import("./pages/SelfLove/SelfLove"))
const SelfLoveHome = lazy(() => import("./pages/SelfLove/SelfLoveHome"))
const ManifestationPage = lazy(() => import("./pages/Manifestation/Manifestation"))
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
const CgvPage = lazy(() => import("./pages/Legal/CgvPage"))
const AdminPage = lazy(() => import("./pages/Admin/AdminPage"))
const AdminProductsPage = lazy(() => import("./pages/AdminProducts/AdminProductsPage"))
const AdminProductsManagePage = lazy(() => import("./pages/AdminProducts/AdminProductsManagePage"))
const SettingsLayout = lazy(() => import("./pages/Settings/SettingsLayout"))
const SettingsAccount = lazy(() => import("./pages/Settings/SettingsAccount"))
const SettingsDisplay = lazy(() => import("./pages/Settings/SettingsDisplay"))
const SettingsLanguages = lazy(() => import("./pages/Settings/SettingsLanguages"))
const SettingsCookies = lazy(() => import("./pages/Settings/SettingsCookies"))
const AboutPage = lazy(() => import("./pages/About/AboutPage"))
const BlogPage = lazy(() => import("./pages/Blog/BlogPage"))
const BlogHealthBeautyPage = lazy(() => import("./pages/Blog/categories/BlogHealthBeautyPage"))
const BlogHealthBeautyArticlePage = lazy(() => import("./pages/Blog/articles/BlogHealthBeautyArticlePage"))
const BlogFashionPage = lazy(() => import("./pages/Blog/categories/BlogFashionPage"))
const BlogFashionArticlePage = lazy(() => import("./pages/Blog/articles/BlogFashionArticlePage"))
const BlogMentalPage = lazy(() => import("./pages/Blog/categories/BlogMentalPage"))
const BlogMentalArticlePage = lazy(() => import("./pages/Blog/articles/BlogMentalArticlePage"))
const BlogSportNutritionPage = lazy(() => import("./pages/Blog/categories/BlogSportNutritionPage"))
const BlogSportNutritionArticlePage = lazy(() => import("./pages/Blog/articles/BlogSportNutritionArticlePage"))
const BlogLifestylePage = lazy(() => import("./pages/Blog/categories/BlogLifestylePage"))
const BlogLifestyleArticlePage = lazy(() => import("./pages/Blog/articles/BlogLifestyleArticlePage"))
const BlogArticleCreatePage = lazy(() => import("./pages/Blog/BlogArticleCreatePage"))
const ProfilePage = lazy(() => import("./pages/Profile/Profile"))
const ArchivesHome = lazy(() => import("./pages/Archives/ArchivesHome"))
const ArchivesPage = lazy(() => import("./pages/Archives/Archives"))
const ProjectArchives = lazy(() => import("./pages/Archives/ProjectArchives"))
const BoutiquePage = lazy(() => import("./pages/Boutique/Boutique"))
const BoutiqueCategoryPage = lazy(() => import("./pages/Boutique/BoutiqueCategory"))
const BoutiqueProductPage = lazy(() => import("./pages/Boutique/BoutiqueProduct"))
const ThankYouPage = lazy(() => import("./pages/Boutique/ThankYouPage"))
const CartPage = lazy(() => import("./pages/Cart/CartPage"))
const PurchasesPage = lazy(() => import("./pages/Purchases/PurchasesPage"))
const ProjectPage = lazy(() => import("./pages/Project/ProjectPage"))

const PERSONALIZED_ROUTE_PREFIXES = [
  "/bienvenue",
  "/home",
  "/sport",
  "/journaling",
  "/mindset",
  "/self-love",
  "/manifestation",
  "/wishlist",
  "/calendrier",
  "/finances",
  "/routine",
  "/goals",
  "/diet",
  "/menu",
  "/alimentation",
  "/profil",
  "/archives",
  "/mes-achats",
  "/project",
  "/parametres",
  "/admin",
] as const

const isPersonalizedRoute = (pathname: string) => {
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, "") || "/"
  if (normalizedPath === "/blog/nouvel-article") return true

  return PERSONALIZED_ROUTE_PREFIXES.some(
    (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
  )
}

const pageTitleKeys: Record<string, string> = {
  "/login": "titles.login",
  "/register": "titles.register",
  "/faq": "Faq",
  "/a-propos": "titles.about",
  "/blog": "Blog",
  "/blog/sante-beaute": "titles.healthBeauty",
  "/blog/mode": "titles.fashion",
  "/blog/mental": "Mental",
  "/blog/sport-nutrition": "titles.sportNutrition",
  "/blog/lifestyle": "Lifestyle",
  "/boutique": "Boutique",
  "/panier": "titles.cart",
  "/merci": "titles.thankYou",
  "/confidentialite": "titles.privacy",
  "/contact": "Contact",
  "/cookies": "Cookies",
  "/mentions-legales": "titles.legal",
  "/cgv": "titles.terms",
  "/bienvenue": "titles.welcome",
  "/home": "header.home",
  "/sport": "Sport",
  "/journaling": "Journaling",
  "/mindset": "Mindset",
  "/self-love": "Self love",
  "/manifestation": "Manifestation",
  "/wishlist": "Wishlist",
  "/calendrier": "titles.calendar",
  "/finances": "Finances",
  "/routine": "titles.routines",
  "/goals": "Goals",
  "/diet": "Diet",
  "/menu": "Menu",
  "/profil": "titles.settings",
  "/archives": "Archives",
  "/archives/mindset": "titles.mindsetArchives",
  "/archives/journaling": "titles.journalingArchives",
  "/archives/projets": "titles.projectArchives",
  "/mes-achats": "titles.purchases",
  "/project": "titles.projects",
  "/parametres": "titles.settings",
  "/parametres/affichage": "titles.display",
  "/parametres/langues": "titles.languages",
  "/parametres/cookies": "titles.cookieSettings",
  "/admin": "titles.admin",
  "/admin/produits": "titles.products",
  "/admin/produits/publies": "titles.publishedProducts",
  "/blog/nouvel-article": "titles.newArticle",
}

const getPageTitle = (pathname: string, t: TFunction) => {
  const normalizedPath = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname

  if (normalizedPath === "/") {
    return t("titles.landing")
  }

  const titleKey = pageTitleKeys[normalizedPath]
  const pageName = (titleKey ? t(titleKey) : undefined)
    ?? (normalizedPath.startsWith("/sport/workout") ? t("titles.exercises") : undefined)
    ?? (normalizedPath.startsWith("/blog/") ? t("titles.article") : undefined)
    ?? (normalizedPath.startsWith("/boutique/produit/") ? t("titles.product") : undefined)
    ?? (normalizedPath.startsWith("/boutique/") ? "Boutique" : undefined)
    ?? t("titles.missing")

  return `${pageName} | Me&rituals`
}

function NotFound() {
  const { t } = useTranslation()
  useEffect(() => {
    document.body.classList.add("notfound-page--active")
    return () => document.body.classList.remove("notfound-page--active")
  }, [])

  return (
    <div className="notfound-page">
      <section className="notfound-page__panel" aria-labelledby="notfound-title">
        <p className="notfound-page__eyebrow">{t("notFound.eyebrow")}</p>
        <div className="notfound-page__visual" aria-hidden="true">404</div>
        <div className="notfound-page__content">
          <h1 id="notfound-title">{t("notFound.title")}</h1>
          <p className="notfound-page__description">
            {t("notFound.description")}
          </p>
          <PrimaryActionButton to="/home" className="notfound-page__link">
            {t("notFound.action")}
            <span aria-hidden="true">→</span>
          </PrimaryActionButton>
        </div>
      </section>
    </div>
  )
}

function ScrollToTop() {
  const { key, pathname } = useLocation()

  useEffect(() => {
    const entryId = `${key}:${pathname}`
    const storageKey = "planner:last-scroll-reset-entry"

    try {
      if (window.sessionStorage.getItem(storageKey) === entryId) {
        return
      }
      window.sessionStorage.setItem(storageKey, entryId)
    } catch {
      // Keep the navigation behavior working when session storage is unavailable.
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  return null
}

const blogArticlePathPattern = /^\/blog\/(?:sante-beaute|mode|mental|sport-nutrition|lifestyle)\/[^/]+\/?$/

function BlogArticleScrollGuard() {
  const { key, pathname } = useLocation()

  useEffect(() => {
    if (!blogArticlePathPattern.test(pathname)) {
      return
    }

    const storageKey = `planner:blog-scroll:${key}`
    const readSavedPosition = () => {
      try {
        return Number(window.sessionStorage.getItem(storageKey)) || 0
      } catch {
        return 0
      }
    }
    const savePosition = (position: number) => {
      try {
        window.sessionStorage.setItem(storageKey, String(Math.max(0, Math.round(position))))
      } catch {
        // The in-memory position below still protects the current page session.
      }
    }

    let stablePosition = Math.max(window.scrollY, readSavedPosition())
    let pendingScrollPosition: number | null = null
    let scrollCommitTimer: number | undefined
    let resizeFrame: number | undefined
    let resizeSettleTimer: number | undefined
    let isResizing = false

    const restorePosition = (position: number) => {
      if (position <= 0) return
      window.scrollTo({ top: position, left: 0, behavior: "auto" })
    }

    const handleScroll = () => {
      if (isResizing) return

      const nextPosition = window.scrollY
      const isSuddenJumpToTop = stablePosition > window.innerHeight && nextPosition < stablePosition - window.innerHeight

      if (!isSuddenJumpToTop) {
        stablePosition = nextPosition
        savePosition(stablePosition)
        return
      }

      pendingScrollPosition = nextPosition
      window.clearTimeout(scrollCommitTimer)
      scrollCommitTimer = window.setTimeout(() => {
        stablePosition = pendingScrollPosition ?? stablePosition
        pendingScrollPosition = null
        savePosition(stablePosition)
      }, 250)
    }

    const handleResize = () => {
      isResizing = true
      pendingScrollPosition = null
      window.clearTimeout(scrollCommitTimer)
      window.clearTimeout(resizeSettleTimer)
      if (resizeFrame !== undefined) {
        window.cancelAnimationFrame(resizeFrame)
      }

      const positionToRestore = stablePosition
      resizeFrame = window.requestAnimationFrame(() => {
        restorePosition(positionToRestore)
        resizeSettleTimer = window.setTimeout(() => {
          restorePosition(positionToRestore)
          stablePosition = window.scrollY
          savePosition(stablePosition)
          isResizing = false
        }, 180)
      })
    }

    const savedPosition = readSavedPosition()
    if (savedPosition > 0 && window.scrollY === 0) {
      resizeFrame = window.requestAnimationFrame(() => restorePosition(savedPosition))
    } else {
      savePosition(stablePosition)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)
    window.visualViewport?.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      window.visualViewport?.removeEventListener("resize", handleResize)
      window.clearTimeout(scrollCommitTimer)
      window.clearTimeout(resizeSettleTimer)
      if (resizeFrame !== undefined) {
        window.cancelAnimationFrame(resizeFrame)
      }
    }
  }, [key, pathname])

  return null
}

function RouteFallback() {
  const { pathname } = useLocation()

  if (pathname === "/") {
    return <div aria-hidden="true" style={{ minHeight: "100svh" }} />
  }

  return <PageLoader />
}

function PageTitle() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  useLayoutEffect(() => {
    document.title = getPageTitle(pathname, t)
  }, [i18n.resolvedLanguage, pathname, t])

  return null
}

function PageMetadata() {
  const { t, i18n } = useTranslation()

  useLayoutEffect(() => {
    const language = i18n.resolvedLanguage === "en" ? "en" : "fr"
    const socialLocale = language === "en" ? "en_GB" : "fr_FR"
    const description = t("meta.description")
    const socialDescription = t("meta.socialDescription")

    document.documentElement.lang = language
    document.querySelector('meta[name="description"]')?.setAttribute("content", description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute("content", socialLocale)
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", socialDescription)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", socialDescription)
  }, [i18n.resolvedLanguage, t])

  return null
}

function PageResourceHints() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if (pathname !== "/") return

    const preload = document.createElement("link")
    preload.rel = "preload"
    preload.as = "image"
    preload.type = "image/webp"
    preload.href = landingHeroMobile
    preload.imageSrcset = `${landingHeroMobile} 800w, ${landingHero} 1572w`
    preload.imageSizes = "100vw"
    preload.setAttribute("fetchpriority", "high")
    document.head.appendChild(preload)

    return () => preload.remove()
  }, [pathname])

  return null
}

type PageBackgroundMediaProps = {
  color?: string
  imageUrl?: string
  isReady: boolean
}

const PageBackgroundMedia = ({ color, imageUrl, isReady }: PageBackgroundMediaProps) => {
  const [resolvedImageUrl, setResolvedImageUrl] = useState("")

  useLayoutEffect(() => {
    if (!isReady) return
    setResolvedImageUrl("")
    applyPageBackground(color || DEFAULT_PAGE_BACKGROUND)
  }, [color, imageUrl, isReady])

  useEffect(() => {
    if (!isReady || !resolvedImageUrl) return
    applyPageBackground(color || DEFAULT_PAGE_BACKGROUND, resolvedImageUrl)
  }, [color, isReady, resolvedImageUrl])

  if (!isReady || !imageUrl) return null

  return (
    <MediaImage
      src={imageUrl}
      alt=""
      aria-hidden="true"
      className="page-background-media"
      onLoad={(event) => setResolvedImageUrl(event.currentTarget.currentSrc || event.currentTarget.src)}
    />
  )
}

function App() {
  const { isPreferenceCenterOpen, preferences } = useCookieConsent()
  const { isAuthReady, isAuthenticated, userProfile } = useAuth()
  const { pathname } = useLocation()
  const personalizationEnabled = isAuthenticated && isPersonalizedRoute(pathname)
  const selectedBackgroundPreset = getPageBackgroundPreset(userProfile.preferences?.pageBackgroundPresetId)

  useLayoutEffect(() => {
    if (!isAuthReady) return
    applyColorMode(
      personalizationEnabled ? userProfile.preferences?.colorMode : DEFAULT_COLOR_MODE,
      { persist: personalizationEnabled },
    )
  }, [isAuthReady, personalizationEnabled, userProfile.preferences?.colorMode])

  useEffect(() => {
    void updateAnalyticsConsent(preferences.analytics)
  }, [preferences.analytics])

  return (
    <div className="app-shell">
      <PageBackgroundMedia
        color={personalizationEnabled ? userProfile.preferences?.pageBackground : DEFAULT_PAGE_BACKGROUND}
        imageUrl={personalizationEnabled ? selectedBackgroundPreset?.src || userProfile.preferences?.pageBackgroundImageUrl : undefined}
        isReady={isAuthReady}
      />
      <PageTitle />
      <PageMetadata />
      <PageResourceHints />
      <ScrollToTop />
      <BlogArticleScrollGuard />
      <Header />
      <main className="main-area">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/sante-beaute" element={<BlogHealthBeautyPage />} />
            <Route path="/blog/mode" element={<BlogFashionPage />} />
            <Route path="/blog/mental" element={<BlogMentalPage />} />
            <Route path="/blog/sport-nutrition" element={<BlogSportNutritionPage />} />
            <Route path="/blog/lifestyle" element={<BlogLifestylePage />} />
            <Route element={<BlogArticlePublicationGate />}>
              <Route path="/blog/sante-beaute/:articleSlug" element={<BlogHealthBeautyArticlePage />} />
              <Route path="/blog/mode/:articleSlug" element={<BlogFashionArticlePage />} />
              <Route path="/blog/mental/:articleSlug" element={<BlogMentalArticlePage />} />
              <Route path="/blog/sport-nutrition/:articleSlug" element={<BlogSportNutritionArticlePage />} />
              <Route path="/blog/lifestyle/:articleSlug" element={<BlogLifestyleArticlePage />} />
            </Route>
            <Route path="/boutique" element={<BoutiquePage />} />
            <Route path="/boutique/:categoryId" element={<BoutiqueCategoryPage />} />
            <Route path="/boutique/produit/:productId" element={<BoutiqueProductPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/merci" element={<ThankYouPage />} />
            <Route path="/confidentialite" element={<ConfidentialitePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cookies" element={<GestionCookiesPage />} />
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="/cgv" element={<CgvPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/bienvenue" element={<OnboardingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/sport" element={<SportPage />} />
              <Route path="/sport/workout/*" element={<SportWorkoutPage />} />
              <Route path="/journaling" element={<JournalingPage />} />
              <Route path="/mindset" element={<SelfLovePage />} />
              <Route path="/self-love" element={<SelfLoveHome />} />
              <Route path="/manifestation" element={<ManifestationPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/calendrier" element={<CalendrierPage />} />
              <Route path="/finances" element={<FinancesPage />} />
              <Route path="/routine" element={<RoutinePage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/diet" element={<DietClassicPage />} />
              <Route path="/menu" element={<CuisinePage />} />
              <Route path="/Menu" element={<Navigate to="/menu" replace />} />
              <Route path="/alimentation" element={<Navigate to="/menu" replace />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/archives" element={<ArchivesHome />} />
              <Route element={<PremiumArchivesRoute />}>
                <Route path="/archives/mindset" element={<ArchivesPage section="self-love" />} />
                <Route path="/archives/journaling" element={<ArchivesPage section="journaling" />} />
                <Route path="/archives/projets" element={<ProjectArchives />} />
              </Route>
              <Route path="/mes-achats" element={<PurchasesPage />} />
              <Route path="/project" element={<ProjectPage />} />
              <Route path="/parametres" element={<SettingsLayout />}>
                <Route index element={<SettingsAccount />} />
                <Route path="affichage" element={<SettingsDisplay />} />
                <Route path="langues" element={<SettingsLanguages />} />
                <Route path="cookies" element={<SettingsCookies />} />
              </Route>
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/blog/nouvel-article" element={<BlogArticleCreatePage />} />
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
      {isPreferenceCenterOpen ? (
        <Suspense fallback={null}>
          <CookiePreferencesModal />
        </Suspense>
      ) : null}
    </div>
  )
}

export default App

