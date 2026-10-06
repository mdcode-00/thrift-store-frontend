import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ProductGrid } from '@/pages/product/ProductGrid'
import { ProductGridSkeleton } from '@/pages/product/ProductGridSkeleton'
import { Pagination } from '@/components/ui/Pagination'
import { Button } from '@/components/ui/Button'
import { useProducts } from '@/hooks/useProducts'
import { searchProducts } from '@/api/products'

function SearchResults({ q }: { q: string }) {
  const fetchFn = useCallback(
    (page: number) => {
      const trimmed = q.trim()
      if (!trimmed) {
        return Promise.resolve({
          products: [],
          pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
        })
      }
      return searchProducts(trimmed, { page, limit: 12 })
    },
    [q],
  )

  const { products, isLoading, error, page, totalPages, setPage } = useProducts(
    fetchFn,
    [q],
  )

  function handlePageChange(next: number) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!q.trim()) {
    return (
      <div className="py-16 text-center border border-dashed border-border rounded-sm p-8 bg-surface/50">
        <p className="font-serif text-xl text-foreground mb-2">
          Discover Rare Vintage
        </p>
        <p className="font-sans text-sm text-secondary max-w-md mx-auto">
          Type a query above to explore curated vintage jackets, dresses, denim, and accessories.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return <ProductGridSkeleton count={12} />
  }

  if (error) {
    return (
      <p className="py-16 text-center font-sans text-sm text-secondary">
        {error}
      </p>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-border rounded-sm p-8">
        <p className="font-serif text-xl text-foreground mb-2">
          No items found
        </p>
        <p className="font-sans text-sm text-secondary max-w-md mx-auto">
          We couldn&apos;t find any vintage pieces matching &ldquo;{q.trim()}&rdquo;. Try checking for spelling errors or searching for broader terms like &ldquo;jacket&rdquo; or &ldquo;denim&rdquo;.
        </p>
      </div>
    )
  }

  return (
    <>
      <ProductGrid products={products} columns={4} />
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  )
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') || ''

  const [prevQ, setPrevQ] = useState(q)
  const [inputValue, setInputValue] = useState(q)

  if (prevQ !== q) {
    setPrevQ(q)
    setInputValue(q)
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (trimmed) {
      setSearchParams({ q: trimmed })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
      <header className="mb-8">
        <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
          Search
        </span>
        <h1 className="font-serif text-4xl font-medium text-foreground sm:text-5xl">
          {q.trim() ? `Results for "${q.trim()}"` : 'Search Collection'}
        </h1>
      </header>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-10 max-w-lg flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
          />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by keyword, category, or style..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-sm text-foreground font-sans text-sm placeholder:text-secondary focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Search
        </Button>
      </form>

      {/* Results Section */}
      <SearchResults key={q} q={q} />
    </div>
  )
}

export default SearchPage
