import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import PageLoader from "./PageLoader"

const PremiumArchivesRoute = () => {
  const { isAuthReady, isPremium } = useAuth()

  if (!isAuthReady) {
    return <PageLoader />
  }

  return isPremium ? <Outlet /> : <Navigate to="/archives" replace />
}

export default PremiumArchivesRoute
