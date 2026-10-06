import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { axiosInstance } from '@/api/axiosInstance'
import { logout } from '@/store/slices/authSlice'
import { clearCart } from '@/store/slices/cartSlice'
import { clearWishlist } from '@/store/slices/wishlistSlice'
import type { AppDispatch } from '@/store'

export function useAuthLogout() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // 1. Call POST /auth/logout FIRST (revokes server-side refresh token & clears cookie)
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      console.warn('Server logout error (proceeding with local cleanup):', error)
    } finally {
      // 2. Dispatch logout to clear Redux auth state
      dispatch(logout())

      // 3. Clear cart and wishlist Redux state
      dispatch(clearCart())
      dispatch(clearWishlist())

      toast.success('You have been signed out.')

      // 4. Navigate to /
      navigate('/')
    }
  }

  return handleLogout
}

export default useAuthLogout