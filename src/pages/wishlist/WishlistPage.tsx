import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart } from 'lucide-react'
import { axiosInstance } from '@/api/axiosInstance'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProductCard } from '@/pages/product/ProductCard'
import {
  selectWishlistItems,
  selectIsWishlistLoading,
  setWishlistItems,
  setWishlistLoading,
} from '@/store/slices/wishlistSlice'
import type { AppDispatch, RootState } from '@/store'
import type { WishlistItem } from '@/types'

export function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector((state: RootState) => selectWishlistItems(state))
  const isLoading = useSelector((state: RootState) => selectIsWishlistLoading(state))

  useEffect(() => {
    let isMounted = true
    async function loadWishlist() {
      dispatch(setWishlistLoading(true))
      try {
        const res = await axiosInstance.get('/wishlist')
        const data = res.data
        const fetchedItems: WishlistItem[] = Array.isArray(data)
          ? data
          : data.items || data.data || []
        if (isMounted) {
          dispatch(setWishlistItems(fetchedItems))
        }
      } catch (err) {
        console.warn('Could not fetch wishlist from API (using current local state):', err)
        if (isMounted) {
          dispatch(setWishlistLoading(false))
        }
      }
    }

    loadWishlist()

    return () => {
      isMounted = false
    }
  }, [dispatch])

  console.log(items)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="border-b border-border pb-6 mb-8">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-10 w-60" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-[3/4] w-full rounded-sm" />
              <Skeleton className="h-4 w-3/4 mt-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
      <div className="border-b border-border pb-6 mb-8">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
          Saved Collection
        </span>
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Curated Wishlist
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-secondary mb-4">
            <Heart size={28} />
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground">
            No saved pieces yet
          </h2>
          <p className="mt-2 font-sans text-sm text-secondary max-w-sm mx-auto">
            Click the heart icon on any vintage piece to save it to your personal room.
          </p>
          <div className="mt-6">
            <Button as={Link} to="/shop" variant="primary" size="md">
              Discover Vintage Pieces
            </Button>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" role="list">
          {items.map((item) => (
            <li key={item.product._id}>
              <ProductCard product={item.product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default WishlistPage