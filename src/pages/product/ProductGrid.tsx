import type { ReactNode } from 'react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

// ============================================================
// ProductGrid — MASTER.md §9
// Desktop: 4 cols | Tablet: 2-3 cols | Mobile: 2 cols
// ============================================================

type GridColumns = 2 | 3 | 4

interface ProductGridProps {
  products: Product[]
  columns?: GridColumns
  emptyState?: ReactNode
}

const columnClasses: Record<GridColumns, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}

export function ProductGrid({
  products,
  columns = 4,
  emptyState,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-secondary">
        {emptyState ?? (
          <p className="font-sans text-sm">No products found.</p>
        )}
      </div>
    )
  }

  return (
    <ul
      className={`grid ${columnClasses[columns]} gap-x-4 gap-y-8 sm:gap-x-5 lg:gap-x-6`}
      role="list"
    >
      {products.map((pro) => (
        <li key={pro._id}>
          <ProductCard product={pro} />
        </li>
      ))}
    </ul>
  )
}