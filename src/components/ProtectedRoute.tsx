import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/store/slices/authSlice'
import type { RootState } from '@/store'

export function ProtectedRoute() {
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state))
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute

export function GuestRoute() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/account" replace /> : <Outlet />;
}