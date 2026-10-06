import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductGrid } from '@/pages/product/ProductGrid'
import { useProducts } from '@/hooks/useProducts'
import { fetchProducts } from '@/api/products'
// import { PRODUCTS } from '@/data/products'

// ============================================================
// LatestProductsSection — MASTER.md §5 item 4
// Shows newest arrivals — badge: NEW or no badge
// ============================================================



export function LatestProductsSection() {

    const {
    products,
  } = useProducts(
    (page) => fetchProducts({ page, limit: 8 }),
    [],
  )

const LATEST = [...products]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime(),
  )
  .slice(0, 8)
  
  return (
    <section
      aria-labelledby="latest-heading"
      className="py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">

        {/* Section header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="block font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
              Just In
            </span>
            <h2
              id="latest-heading"
              className="font-serif text-3xl font-medium text-foreground sm:text-4xl"
            >
              Latest Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex shrink-0 items-center gap-1.5 font-sans text-sm font-medium text-secondary hover:text-primary transition-colors duration-150 group"
            aria-label="View all products in the shop"
          >
            View all
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <ProductGrid products={LATEST} columns={4} />
      </div>
    </section>
  )
}