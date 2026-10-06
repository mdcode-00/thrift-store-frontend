import type { Category } from '@/types'

// ============================================================
// Mock Category Data — Vintage Thrift Room
// ============================================================

export const CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    name: "Women's",
    slug: 'womens',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&h=800&fit=crop&q=80',
    description: 'Curated vintage pieces for her',
    count: 124,
  },
  {
    id: 'cat-002',
    name: "Men's",
    slug: 'mens',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=800&fit=crop&q=80',
    description: 'Timeless menswear from every era',
    count: 88,
  },
  {
    id: 'cat-003',
    name: 'Outerwear',
    slug: 'outerwear',
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop&q=80',
    description: 'Jackets, coats & layers',
    count: 56,
  },
  {
    id: 'cat-004',
    name: 'Dresses',
    slug: 'dresses',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&q=80',
    description: 'Vintage dresses for every occasion',
    count: 72,
  },
  {
    id: 'cat-005',
    name: 'Denim',
    slug: 'denim',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop&q=80',
    description: 'Jeans, jackets & more',
    count: 63,
  },
  {
    id: 'cat-006',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&q=80',
    description: 'Bags, belts & finishing touches',
    count: 39,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}