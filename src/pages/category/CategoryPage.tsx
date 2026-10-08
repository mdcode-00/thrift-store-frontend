import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductGrid } from "@/pages/product/ProductGrid";
import { ProductGridSkeleton } from "@/pages/product/ProductGridSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { useProducts } from "@/hooks/useProducts";
import { fetchProductsByCategory } from "@/api/products";
import { Sparkles } from "lucide-react";

// ============================================================
// CategoryPage — /category/:category
// ============================================================

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CategoryPage() {
  const { category = "" } = useParams<{ category: string }>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const fetchFn = useCallback(
    (page: number) => fetchProductsByCategory(category, { page, limit: 12, type: typeFilter }),
    [category, typeFilter],
  );

  const { products, isLoading, error, page, totalPages, setPage } = useProducts(
    fetchFn,
    [category, typeFilter],
  );

  function handlePageChange(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle type filter change and reset page to 1
  function handleTypeChange(t: string) {
    setTypeFilter(t === 'all' ? undefined : t);
    setPage(1);
  }

  const title = slugToTitle(category);

  return (
    <div className="mx-auto max-w-350 px-4 py-12 sm:px-6 lg:px-10">
      <header className="mb-8">
        <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-2">
          Browse
        </span>
        <h1 className="font-serif text-4xl font-medium text-[var(--color-foreground)] sm:text-5xl">
          {title}
        </h1>
      </header>

      {/* Category Type Filter Bar (Only on Category Page) */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {['all', 'upper', 'lower', 'accessory'].map((t) => {
          const isActive = (t === 'all' && !typeFilter) || typeFilter === t;

          return (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[var(--color-foreground)] text-[var(--color-background)]'
                  : 'bg-[var(--color-surface, #f3f4f6)] text-[var(--color-secondary)] hover:bg-[var(--color-surface-hover, #e5e7eb)]'
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : error ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--color-secondary)]">
          {error}
        </p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          {/* Decorative Icon Wrapper */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] animate-pulse">
            <Sparkles size={28} strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h3 className="font-serif text-xl font-medium text-[var(--color-foreground, #111)]">
            Something special is on the way
          </h3>

          {/* Description */}
          <p className="mt-2 max-w-sm font-sans text-sm text-[var(--color-secondary, #666)]">
            We are currently curating new pieces for this category. Check back
            soon or explore our other collections.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/shop"
              className="rounded-full bg-[var(--color-primary, #000)] px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-wider text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Explore All Pieces
            </a>
          </div>
        </div>
      ) : (
        <>
          <ProductGrid products={products} columns={4} />
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