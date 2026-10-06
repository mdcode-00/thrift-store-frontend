// ============================================================
// ProductCardSkeleton — matches ProductCard 3:4 aspect ratio
// Uses Tailwind animate-pulse (respects prefers-reduced-motion
// via the global index.css rule).
// ============================================================

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {/* Image placeholder — 3:4 ratio to match ProductCard */}
      <div className="aspect-[3/4] w-full animate-pulse rounded-sm bg-[var(--color-muted)]" />
      {/* Title line */}
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded-sm bg-[var(--color-muted)]" />
      {/* Subtitle / rating line */}
      <div className="h-3 w-1/3 animate-pulse rounded-sm bg-[var(--color-muted)]" />
      {/* Price line */}
      <div className="h-4 w-1/4 animate-pulse rounded-sm bg-[var(--color-muted)]" />
    </div>
  )
}