import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pagination } from '@/components/ui/Pagination'
import { fetchOrders } from '@/api/orders'
import type { Order } from '@/types'

// ============================================================
// PaymentBadge — styled inline badge for order payment status
// ============================================================

function PaymentBadge({ status }: { status: Order['paymentStatus'] }) {
  const styles: Record<Order['paymentStatus'], string> = {
    paid: 'bg-[#d1fae5] text-[#065f46]',
    pending: 'bg-[var(--color-accent)] text-[var(--color-foreground)]',
    failed: 'bg-[#fee2e2] text-[#991b1b]',
  }
  const labels: Record<Order['paymentStatus'], string> = {
    paid: 'Paid',
    pending: 'Pending',
    failed: 'Failed',
  }
  return (
    <span
      className={[
        'inline-block px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-widest rounded-sm',
        styles[status],
      ].join(' ')}
    >
      {labels[status]}
    </span>
  )
}

// ============================================================
// OrderCardSkeleton — loading placeholder for one order row
// ============================================================

function OrderCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 border border-border bg-surface rounded-sm animate-pulse">
      <Skeleton className="w-20 h-20 shrink-0 rounded-sm" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
        <div className="pt-1">
          <Skeleton className="h-4 w-14 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// OrderCard — single order row for the list view
// ============================================================

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function OrderCard({ order }: { order: Order }) {
    const [imageFailed, setImageFailed] = useState(false)
  return (
    <Link
      to={`/orders/${order._id}`}
      className="flex flex-col sm:flex-row gap-4 p-4 border border-border bg-surface rounded-sm transition-all duration-200 hover:border-primary hover:shadow-sm"
    >
      {/* Thumbnail */}
      <div className="w-full sm:w-20 aspect-square sm:h-20 shrink-0 overflow-hidden rounded-sm bg-muted">
        {order.thumbnailUrl && !imageFailed ? (
          <img
            src={order.thumbnailUrl}
            alt={order.productName}
            className="h-full w-full object-cover object-center"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-secondary">
            <ShoppingBag size={24} />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-sans text-sm font-semibold text-foreground truncate">
            {order.productName}
          </h3>
          <p className="mt-0.5 font-sans text-xs text-secondary">
            ${order.price} &times; {order.quantity}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-sans text-xs text-secondary/70">
            {formatDate(order.soldAt || order.createdAt)}
          </span>
          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center sm:items-end shrink-0 sm:flex-col sm:justify-between sm:text-right">
        <span className="font-sans text-sm font-semibold text-foreground">
          ${(order.price * order.quantity).toFixed(2)}
        </span>
        <span className="hidden sm:block font-sans text-xs text-primary mt-1">
          View details &rarr;
        </span>
      </div>
    </Link>
  )
}

// ============================================================
// OrdersPage — /orders
// ============================================================

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetchOrders(page, 10)
      .then((data) => {
        if (cancelled) return
        setOrders(data.orders)
        setTotalPages(data.pagination.totalPages)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your orders right now. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [page])

  function handlePageChange(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-border pb-6 mb-8">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
          Your Account
        </span>
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Order History
        </h1>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="py-16 text-center">
          <p className="font-sans text-sm text-secondary mb-4">{error}</p>
          <Button
            onClick={() => { setPage(1); setError(null); setIsLoading(true) }}
            variant="outline"
            size="md"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-secondary">
            <ShoppingBag size={28} />
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">
            You haven&apos;t placed an order yet
          </h2>
          <p className="font-sans text-sm text-secondary mb-6 max-w-sm mx-auto">
            Browse our curated vintage collection and find your next favourite piece.
          </p>
          <Button as={Link} to="/shop" variant="primary" size="md">
            Browse the Collection
          </Button>
        </div>
      )}

      {/* Order list */}
      {!isLoading && !error && orders.length > 0 && (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}

export default OrdersPage
