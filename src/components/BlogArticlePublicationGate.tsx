import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useBlogPublishing } from "../context/BlogPublishingContext"
import PageLoader from "./PageLoader"

const BlogArticlePublicationGate = () => {
  const { pathname } = useLocation()
  const { isAdmin, isAuthReady } = useAuth()
  const { isLoading, isPublished } = useBlogPublishing()

  if (!isAuthReady || isLoading) {
    return <PageLoader />
  }

  if (isAdmin || isPublished(pathname)) {
    return <Outlet />
  }

  return <Navigate to="/blog" replace />
}

export default BlogArticlePublicationGate
