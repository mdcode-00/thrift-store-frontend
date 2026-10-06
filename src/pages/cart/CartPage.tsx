import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { axiosInstance } from '@/api/axiosInstance'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  selectCartItems,
  selectCartTotal,
  selectIsCartLoading,
  setCartItems,
  setCartLoading,
  removeFromCart,
} from '@/store/slices/cartSlice'
import type { AppDispatch, RootState } from '@/store'
import type { CartItem } from '@/types'

export function CartPage() {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector((state: RootState) => selectCartItems(state))
  const total = useSelector((state: RootState) => selectCartTotal(state))
  const isLoading = useSelector((state: RootState) => selectIsCartLoading(state))

  useEffect(() => {
    let isMounted = true
    async function loadCart() {
      dispatch(setCartLoading(true))
      try {
        const res = await axiosInstance.get('/cart')
        const data = res.data
        const fetchedItems: CartItem[] = Array.isArray(data)
          ? data
          : data.items || data.data || []
        if (isMounted) {
          dispatch(setCartItems(fetchedItems))
        }
      } catch (err) {
        console.warn('Could not fetch cart from API (using current local state):', err)
        if (isMounted) {
          dispatch(setCartLoading(false))
        }
      }
    }

    loadCart()

    return () => {
      isMounted = false
    }
  }, [dispatch])

  async function handleRemove(productId: string) {
    try {
      await axiosInstance.delete(`/cart/${productId}`)
      dispatch(removeFromCart({ productId }))
    } catch (err) {
      console.error('Could not remove item from cart:', err)
    }
  }

 if (isLoading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-border pb-6">
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-10 w-52" />
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border border-border bg-surface rounded-sm">
                <Skeleton className="w-24 h-32 rounded-sm shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-8 w-24 rounded-sm" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-border bg-surface p-6 rounded-sm h-fit space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="border-b border-border pb-6">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
          Your Wardrobe
        </span>
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Shopping Bag
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-secondary mb-4">
            <ShoppingBag size={28} />
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground">
            Your shopping bag is empty
          </h2>
          <p className="mt-2 font-sans text-sm text-secondary max-w-sm mx-auto">
            Discover curated vintage jackets, dresses, knitwear, and denim in our collection.
          </p>
          <div className="mt-6">
            <Button as={Link} to="/shop" variant="primary" size="md">
              Start Shopping
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col sm:flex-row gap-4 p-4 border border-border bg-surface rounded-sm"
              >
                <Link
                  to={`/product/${item.product._id}`}
                  className="w-full sm:w-28 aspect-[3/4] sm:aspect-auto sm:h-36 overflow-hidden rounded-sm bg-muted shrink-0"
                >
                  <img
                    src={item.product.image[0]?.url}
                    alt={item.product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/product/${item.product._id}`}>
                        <h3 className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-primary font-medium mt-1">
                        ${item.product.price} each
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product._id)}
                      aria-label={`Remove ${item.product.name} from bag`}
                      className="text-secondary hover:text-destructive p-1 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/60">
                    <span className="text-xs text-secondary">Qty: {item.quantity}</span>

                    <span className="font-sans text-sm font-semibold text-foreground">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border border-border bg-surface p-6 rounded-sm h-fit">
            <h2 className="font-serif text-xl font-medium text-foreground border-b border-border pb-4">
              Order Summary
            </h2>
            <div className="space-y-3 py-4 text-sm font-sans">
              <div className="flex justify-between text-secondary">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">${total}</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Shipping</span>
                <span>{total >= 75 ? 'Free' : '$8.00'}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-base font-semibold text-foreground">
                <span>Estimated Total</span>
                <span>${total >= 75 ? total : total + 8}</span>
              </div>
            </div>

            <Button
              as={Link}
              to="/checkout"
              variant="primary"
              size="lg"
              fullWidth
              className="mt-4 gap-2"
            >
              Proceed to Checkout
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage