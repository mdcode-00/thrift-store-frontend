import axiosInstance from './axiosInstance'
import type { Product } from '@/types'

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProductListResponse {
  products: Product[]
  pagination: Pagination
}

interface ProductQuery {
  page?: number
  limit?: number
  type?: string;
  minPrice?: number
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc'
}

export async function fetchProducts(query: ProductQuery = {}): Promise<ProductListResponse> {
  const { data } = await axiosInstance.get('/products', { params: query })
  return {
    products: data.product ?? data.data ?? [],
    pagination: normalizePagination(data.pagination ?? data),
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data } = await axiosInstance.get(`/products/${id}`)
  return data.product ?? data.data ?? data
}

export async function fetchProductsByCategory(
  category: string,
  query: ProductQuery = {},
): Promise<ProductListResponse> {
  const { data } = await axiosInstance.get(`/products/category/${category}`, { params: query })
  return {
    products: data.products ?? data.data ?? [],
    pagination: normalizePagination(data.pagination ?? data),
  }
}

export async function searchProducts(
  q: string,
  query: ProductQuery = {},
): Promise<ProductListResponse> {
  const { data } = await axiosInstance.get('/products/search', { params: { q, ...query } })
  return {
    products: data.products ?? data.data ?? [],
    pagination: normalizePagination(data.pagination ?? data),
  }
}

function normalizePagination(raw: Record<string, number>): Pagination {
  return {
    page: raw.page ?? 1,
    limit: raw.limit ?? 12,
    total: raw.total ?? 0,
    // handle both camelCase and snake_case keys
    totalPages: raw.totalPages ?? raw.totalPage ?? 1,
  }
}