import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectIsAuthenticated } from '@/store/slices/authSlice'
import type { RootState } from '@/store'

export function AdminRoute() {
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state))
  const user = useSelector((state: RootState) => selectCurrentUser(state))
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute