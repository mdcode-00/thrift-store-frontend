import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ProductGrid } from '@/pages/product/ProductGrid'
import { ProductGridSkeleton } from '@/pages/product/ProductGridSkeleton'
import { Pagination } from '@/components/ui/Pagination'
import { useProducts } from '@/hooks/useProducts'
import { fetchProductsByCategory } from '@/api/products'

// ============================================================
// CategoryPage — /category/:category
// ============================================================

function slugToTitle(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function CategoryPage() {
  const { category = '' } = useParams<{ category: string }>()

  const fetchFn = useCallback(
    (page: number) => fetchProductsByCategory(category, { page, limit: 12 }),
    [category],
  )

  const { products, isLoading, error, page, totalPages, setPage } =
    useProducts(fetchFn, [category])

  function handlePageChange(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const title = slugToTitle(category)

  return (
    <div className="mx-auto max-w-350 px-4 py-12 sm:px-6 lg:px-10">
      <header className="mb-10">
        <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-2">
          Browse
        </span>
        <h1 className="font-serif text-4xl font-medium text-[var(--color-foreground)] sm:text-5xl">
          {title}
        </h1>
      </header>

      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : error ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--color-secondary)]">
          {error}
        </p>
      ) : products.length === 0 ? (
        <p className="py-16 text-center font-sans text-sm text-[var(--color-secondary)]">
          No pieces found in this category yet — check back soon.
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