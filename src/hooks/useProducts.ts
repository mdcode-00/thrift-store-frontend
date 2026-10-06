import { useEffect, useState } from 'react'
import type { Product } from '@/types'
import type { ProductListResponse } from '@/api/products'

interface UseProductsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
  page: number
  totalPages: number
  setPage: (page: number) => void
}

export function useProducts(
  fetchFn: (page: number) => Promise<ProductListResponse>,
  deps: unknown[] = [],
): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    fetchFn(page)
      .then((data) => {
        if (cancelled) return
        setProducts(data.products)
        setTotalPages(data.pagination.totalPages)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load products right now.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...deps])

  return { products, isLoading, error, page, totalPages, setPage }
}