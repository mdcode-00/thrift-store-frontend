import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { fetchOrders } from "@/api/orders";
import type { Order } from "@/types";

// ============================================================
// PaymentBadge — styled inline badge for order payment status
// ============================================================

function PaymentBadge({ status }: { status: Order["paymentStatus"] }) {
  const styles: Record<Order["paymentStatus"], string> = {
    paid: "bg-[#d1fae5] text-[#065f46]",
    pending: "bg-[var(--color-accent)] text-[var(--color-foreground)]",
    failed: "bg-[#fee2e2] text-[#991b1b]",
  };
  const labels: Record<Order["paymentStatus"], string> = {
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
  };
  return (
    <span
      className={[
        "inline-block px-2 py-0.5 text-[10px] font-sans font-semibold uppercase tracking-widest rounded-sm",
        styles[status],
      ].join(" ")}
    >
      {labels[status]}
    </span>
  );
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
  );
}

// ============================================================
// OrderCard — single order row for the list view
// ============================================================

function getExpectedDeliveryDate(date: string) {
  const deliveryDate = new Date(date);
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return deliveryDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function OrderCard({ order }: { order: Order }) {
  const [imageFailed, setImageFailed] = useState(false);
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
            ₹{order.price} &times; {order.quantity}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-sans text-xs text-secondary/70">
            {formatDate(order.soldAt || order.createdAt)}
          </span>

          <span className="text-secondary/40">•</span>

          {/* Attractive Free Shipping Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
            <Truck size={13} strokeWidth={1.8} />
            <span>Free Shipping</span>
          </div>

          {/* Estimated Delivery (7 Days) */}
          <span className="font-sans text-xs font-medium text-emerald-600">
            Expected delivery by{" "}
            {getExpectedDeliveryDate(order.soldAt || order.createdAt)}
          </span>

          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center sm:items-end shrink-0 sm:flex-col sm:justify-between sm:text-right">
        <span className="font-sans text-sm font-semibold text-foreground">
          ₹{(order.price * order.quantity).toFixed(2)}
        </span>
        <span className="hidden sm:block font-sans text-xs text-primary mt-1">
          View details &rarr;
        </span>
      </div>
    </Link>
  );
}


// ============================================================
// WhatsAppSupportSection — Compact Banner with Click-to-Chat Button
// ============================================================



// ============================================================
// OrdersPage — /orders
// ============================================================

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    fetchOrders(page, 10)
      .then((data) => {
        if (cancelled) return;
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      })
      .catch(() => {
        if (!cancelled)
          setError("Could not load your orders right now. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  function handlePageChange(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 ">
      {/* Header */}
      <div className="border-b border-border pb-6 mb-8">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
          Your Account
        </span>
        <h1 className="font-serif text-3xl font-medium text-foreground sm:text-4xl">
          Order History
        </h1>
      </div>

        {/* WhatsApp Support Banner Section */}
          <div className="mt-12 bg-surface border border-border rounded-lg p-6 max-w-xl mx-auto shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mx-auto sm:mx-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2zM12.04 20.15c-1.42 0-2.81-.38-4.03-1.1l-.29-.17-3.05.8.81-2.97-.19-.31c-.81-1.31-1.24-2.83-1.24-4.38 0-4.58 3.73-8.31 8.31-8.31 2.22 0 4.31.86 5.88 2.43 1.57 1.57 2.43 3.66 2.43 5.88 0 4.58-3.73 8.31-8.31 8.31zm4.56-6.19c-.25-.13-1.48-.73-1.71-.82-.23-.09-.4-.13-.57.13-.17.25-.66.82-.81.99-.15.17-.31.19-.56.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.39.11-.52.12-.12.25-.31.38-.47.13-.17.17-.28.25-.47.08-.19.04-.36-.02-.5-.06-.13-.57-1.38-.78-1.89-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.02 2.61.12.17 1.76 2.69 4.27 3.77.6.26 1.07.41 1.44.53.61.19 1.16.16 1.6-.02.49-.2 1.48-.61 1.69-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.48-.3z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-serif text-base font-medium text-foreground">Have any problem with your order?</h3>
          <p className="font-sans text-xs text-secondary">Contact our support team directly via WhatsApp.</p>
        </div>
      </div>

     <Link 
  to="/return-and-refund" 
 className="inline-flex items-center justify-center shrink-0 w-full sm:w-auto px-4 py-2.5 bg-primary text-white font-sans text-xs font-medium uppercase tracking-wider rounded-sm transition-colors hover:bg-secondary shadow-sm"
>
  Contact on WhatsApp
</Link>
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
            onClick={() => {
              setPage(1);
              setError(null);
              setIsLoading(true);
            }}
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
            Browse our curated vintage collection and find your next favourite
            piece.
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
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default OrdersPage;
