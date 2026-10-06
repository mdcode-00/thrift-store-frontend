// ============================================================
// ProductDetailSkeleton — two-column layout skeleton
// Left: image placeholder | Right: title, price, desc, buttons
// ============================================================

export function ProductDetailSkeleton() {
  return (
    <div
      className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8"
      aria-hidden="true"
      aria-label="Loading product"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image placeholder */}
        <div className="aspect-[3/4] w-full animate-pulse rounded-sm bg-[var(--color-muted)]" />

        {/* Text placeholders */}
        <div className="flex flex-col gap-4 py-2">
          {/* Badge */}
          <div className="h-5 w-16 animate-pulse rounded-sm bg-[var(--color-muted)]" />
          {/* Title */}
          <div className="h-9 w-3/4 animate-pulse rounded-sm bg-[var(--color-muted)]" />
          {/* Price */}
          <div className="h-6 w-28 animate-pulse rounded-sm bg-[var(--color-muted)]" />
          {/* Description lines */}
          <div className="mt-2 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-sm bg-[var(--color-muted)]" />
            <div className="h-4 w-5/6 animate-pulse rounded-sm bg-[var(--color-muted)]" />
            <div className="h-4 w-4/6 animate-pulse rounded-sm bg-[var(--color-muted)]" />
          </div>
          {/* Size / color selectors */}
          <div className="mt-4 h-10 w-full animate-pulse rounded-sm bg-[var(--color-muted)]" />
          {/* Add to cart button */}
          <div className="mt-2 h-12 w-full animate-pulse rounded-md bg-[var(--color-muted)]" />
          {/* Wishlist button */}
          <div className="h-12 w-full animate-pulse rounded-md bg-[var(--color-muted)]" />
        </div>
      </div>
    </div>
  )
}