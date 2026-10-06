import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { fetchOrderById } from "@/api/orders";
import { fetchMyReviews, submitReview } from "@/api/review";
import { StarRating } from "@/components/ui/StarRaiting";
import { toast } from "react-hot-toast";
import type { Order, Review } from "@/types";

// ============================================================
// PaymentBadge — reused from OrdersPage (inline copy to avoid circular imports)
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
        "inline-block px-2.5 py-1 text-xs font-sans font-semibold uppercase tracking-widest rounded-sm",
        styles[status],
      ].join(" ")}
    >
      {labels[status]}
    </span>
  );
}

// ============================================================
// DetailRow — simple label/value pair
// ============================================================

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between items-start gap-4 py-3 border-b border-border/60 last:border-0">
      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary shrink-0">
        {label}
      </span>
      <span className="font-sans text-sm text-foreground text-right">
        {value}
      </span>
    </div>
  );
}

// ============================================================
// OrderDetailSkeleton — loading state
// ============================================================

function OrderDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-24 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full rounded-sm" />
        <div className="space-y-4 py-2">
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-5 w-16 rounded-sm mt-3" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// OrderDetailPage — /orders/:id
// ============================================================

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"notfound" | "other" | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [isCheckingReview, setIsCheckingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!order || order.paymentStatus !== "paid") return;

    setIsCheckingReview(true);
    fetchMyReviews()
      .then((reviews) => {
        const match = reviews.find((r) => r.order === order._id);
        if (match) setExistingReview(match);
      })
      .catch(() => {
        // non-critical — form will just show, and a duplicate submit
        // gets a clean 409 handled in handleSubmitReview anyway
      })
      .finally(() => setIsCheckingReview(false));
  }, [order]);

  async function handleSubmitReview() {
    if (!order || rating === 0 || comment.trim().length === 0) return;

    setIsSubmitting(true);
    try {
      const review = await submitReview(order._id, rating, comment.trim());
      setExistingReview(review);
      toast.success("Thanks for your review!");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Could not submit your review.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!id) {
      setError("notfound");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchOrderById(id)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const e = err as { response?: { status?: number } };
        if (e?.response?.status === 404) setError("notfound");
        else setError("other");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <OrderDetailSkeleton />;

  if (error === "notfound") {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/40 text-secondary">
          <ShoppingBag size={28} />
        </div>
        <h1 className="font-serif text-2xl font-medium text-foreground mb-3">
          Order not found
        </h1>
        <p className="font-sans text-sm text-secondary mb-6 max-w-sm mx-auto">
          This order either doesn&apos;t exist or doesn&apos;t belong to your
          account.
        </p>
        <Button as={Link} to="/orders" variant="primary" size="md">
          Back to Order History
        </Button>
      </div>
    );
  }

  if (error === "other") {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-20 text-center">
        <p className="font-sans text-sm text-secondary mb-6">
          Could not load this order. Please try again.
        </p>
        <Button as={Link} to="/orders" variant="outline" size="md">
          Back to Order History
        </Button>
      </div>
    );
  }

  if (!order) return null;

  const total = order.price * order.quantity;

  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 font-sans text-sm text-secondary hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Order History
      </Link>

      {/* Page title */}
      <div className="border-b border-border pb-5 mb-8">
        <span className="block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-1">
          Order Details
        </span>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-2xl font-medium text-foreground sm:text-3xl">
            {order.productName}
          </h1>
          <PaymentBadge status={order.paymentStatus} />
        </div>
        <p className="mt-1 font-sans text-xs text-secondary">
          Order ID: <span className="font-mono">{order._id}</span>
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Thumbnail */}
        <div className="aspect-square overflow-hidden rounded-sm bg-muted border border-border">
          {order.thumbnailUrl && !imageFailed ? (
            <img
              src={order.thumbnailUrl}
              alt={order.productName}
              className="h-full w-full object-cover object-center"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-secondary">
              <ShoppingBag size={48} />
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-0">
          <div className="rounded-sm border border-border bg-surface p-5">
            <h2 className="font-serif text-lg font-medium text-foreground border-b border-border pb-3 mb-0">
              Order Summary
            </h2>
            <div className="pt-1">
              <DetailRow label="Category" value={order.category} />
              <DetailRow
                label="Unit Price"
                value={`$${order.price.toFixed(2)}`}
              />
              <DetailRow label="Quantity" value={order.quantity} />
              <DetailRow label="Total" value={`$${total.toFixed(2)}`} />
              <DetailRow
                label="Ordered On"
                value={formatDate(order.soldAt || order.createdAt)}
              />
              {order.razorpayPaymentId && (
                <DetailRow label="Payment ID" value={order.razorpayPaymentId} />
              )}
            </div>
          </div>

          {/* Description */}
          {order.description && (
            <div className="mt-5">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                About This Piece
              </h3>
              <p className="font-sans text-sm text-secondary leading-relaxed">
                {order.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="mt-8 rounded-sm border border-border bg-surface p-5">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <MapPin size={16} className="text-primary" aria-hidden="true" />
            <h2 className="font-serif text-base font-medium text-foreground">
              Shipping Address
            </h2>
          </div>
          <div className="font-sans text-sm text-secondary space-y-0.5">
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && (
              <p>{order.shippingAddress.line2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="pt-2 text-xs text-secondary/70 font-mono">
              Phone: {order.shippingAddress.phone}
            </p>
          </div>
        </div>
      )}

      {/* Review section — goes right here */}
      {order.paymentStatus === "paid" && !isCheckingReview && (
        <div className="mt-8 rounded-sm border border-border bg-surface p-5">
          <h2 className="font-serif text-base font-medium text-foreground border-b border-border pb-3 mb-4">
            {existingReview ? "Your Review" : "Leave a Review"}
          </h2>

          {existingReview ? (
            <div className="space-y-2">
              <StarRating rating={existingReview.rating} size={16} />
              <p className="font-sans text-sm text-foreground">
                {existingReview.comment}
              </p>
              <p className="font-sans text-xs text-secondary">
                You reviewed this item
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  Your Rating
                </label>
                <StarRating
                  rating={rating}
                  size={24}
                  interactive
                  onChange={setRating}
                />
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  Your Review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  maxLength={500}
                  rows={4}
                  placeholder="Share your experience with this piece..."
                  className="w-full border border-border rounded-sm p-3 font-sans text-sm text-foreground bg-background focus:outline-none focus:border-primary"
                />
                <p className="text-right text-xs text-secondary mt-1">
                  {comment.length}/500
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitReview}
                disabled={
                  rating === 0 || comment.trim().length === 0 || isSubmitting
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button as={Link} to="/orders" variant="outline" size="md">
          &larr; Back to Orders
        </Button>
        <Button as={Link} to="/shop" variant="ghost" size="md">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

export default OrderDetailPage;
