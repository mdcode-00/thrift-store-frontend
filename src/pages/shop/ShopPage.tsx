import { useCallback } from 'react'
import { ProductGrid } from '@/pages/product/ProductGrid'
import { ProductGridSkeleton } from '@/pages/product/ProductGridSkeleton'
import { Pagination } from '@/components/ui/Pagination'
import { useProducts } from '@/hooks/useProducts'
import { fetchProducts } from '@/api/products'

// ============================================================
// ShopPage — /shop
// Lists all products with pagination (12 per page)
// ============================================================

export function ShopPage() {
  const fetchFn = useCallback(
    (page: number) => fetchProducts({ page, limit: 12 }),
    [],
  )

  const { products, isLoading, error, page, totalPages, setPage } = useProducts(fetchFn)

  function handlePageChange(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
      {/* Page header */}
      <header className="mb-10">
        <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-2">
          The Collection
        </span>
        <h1 className="font-serif text-4xl font-medium text-[var(--color-foreground)] sm:text-5xl">
          Shop All Vintage
        </h1>
      </header>

      {/* Content */}
      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : error ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--color-secondary)]">
          {error}
        </p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--color-secondary)]">
          No products found.
        </p>
      ) : (
        <>
          <ProductGrid products={products} columns={4} />
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}