import { LoaderCircle } from "lucide-react"
import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"
import type { UserRole } from "@/types"

export function ProtectedRoute({ role }: { role: UserRole }) {
  const location = useLocation()
  const { isAuthenticated, isLoading, user } = useAuth()
  if (isLoading) return <div className="flex min-h-64 items-center justify-center"><LoaderCircle className="size-6 animate-spin" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user?.role !== role) return <Navigate to="/" replace />
  return <Outlet />
}
