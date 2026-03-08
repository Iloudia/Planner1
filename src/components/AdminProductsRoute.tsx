import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ADMIN_PRODUCTS_EMAIL = "iloudiav@gmail.com"

const AdminProductsRoute = () => {
  const { isAuthenticated, isAuthReady, userEmail } = useAuth()

  if (!isAuthReady) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if ((userEmail ?? "").toLowerCase() !== ADMIN_PRODUCTS_EMAIL) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

export default AdminProductsRoute
