// ============================================================
// Mock Product Data — Vintage Thrift Room
// Images: Unsplash CDN (portrait fashion photography)
// Replace image URLs with own assets or backend URLs later.
// ============================================================

export interface MockProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  images?: string[]
  category: string
  categorySlug?: string
  rating?: number
  reviewCount?: number
  badge?: string
  sizes?: string[]
  colors?: string[]
  description: string
  inStock?: boolean
  tags?: string[]
}

export const PRODUCTS: MockProduct[] = [
  {
    id: 'vtr-001',
    name: 'Vintage Denim Jacket',
    price: 58,
    originalPrice: 85,
    discount: 32,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop&q=80',
    ],
    category: "Women's",
    categorySlug: 'womens',
    rating: 4.7,
    reviewCount: 142,
    badge: 'SALE',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Indigo', 'Light Wash'],
    description:
      'A classic mid-wash denim jacket with a relaxed fit. Slightly cropped with authentic vintage detailing — brass buttons, chest pockets, and a naturally worn finish. A wardrobe anchor piece.',
    inStock: true,
    tags: ['denim', 'jacket', 'vintage', 'casual'],
  },
  {
    id: 'vtr-002',
    name: '90s Oversized Blazer',
    price: 72,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b3b6e?w=600&h=800&fit=crop&q=80',
    category: "Women's",
    categorySlug: 'womens',
    rating: 4.8,
    reviewCount: 89,
    badge: 'VINTAGE',
    sizes: ['S', 'M', 'L'],
    colors: ['Camel', 'Charcoal'],
    description:
      'Authentically 90s — broad shoulders, oversized silhouette, double-breasted front. A statement piece for layering over a slip dress or straight-leg jeans.',
    inStock: true,
    tags: ['blazer', '90s', 'oversized', 'vintage'],
  },
  {
    id: 'vtr-003',
    name: 'Classic Knit Sweater',
    price: 44,
    originalPrice: 62,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop&q=80',
    category: "Women's",
    categorySlug: 'womens',
    rating: 4.6,
    reviewCount: 203,
    badge: 'SALE',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Oat', 'Dusty Rose', 'Sage'],
    description:
      'Soft ribbed knit in earthy oatmeal tones. Relaxed fit with dropped shoulders and a slightly cropped length. Perfect for layering over a collared shirt or wearing alone.',
    inStock: true,
    tags: ['knit', 'sweater', 'cozy', 'autumn'],
  },
  {
    id: 'vtr-004',
    name: 'Vintage Leather Tote',
    price: 95,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop&q=80',
    category: 'Accessories',
    categorySlug: 'accessories',
    rating: 4.9,
    reviewCount: 67,
    badge: 'STAFF PICK',
    sizes: ['One Size'],
    colors: ['Cognac', 'Dark Brown'],
    description:
      'Genuine leather tote with a naturally developed patina. Spacious interior, sturdy handles, and an unlined raw edge finish that ages beautifully over time.',
    inStock: true,
    tags: ['bag', 'leather', 'tote', 'accessories'],
  },
  {
    id: 'vtr-005',
    name: 'Retro Cotton Shirt',
    price: 36,
    originalPrice: 50,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop&q=80',
    category: "Men's",
    categorySlug: 'mens',
    rating: 4.5,
    reviewCount: 118,
    badge: 'SALE',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Off-White', 'Ecru', 'Vintage Blue'],
    description:
      'Lightweight cotton poplin shirt with a vintage-washed finish. The slightly boxy cut and subtle texture make it feel lived-in from the first wear.',
    inStock: true,
    tags: ['shirt', 'cotton', 'retro', 'mens'],
  },
  {
    id: 'vtr-006',
    name: 'Corduroy Field Jacket',
    price: 88,
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&h=800&fit=crop&q=80',
    category: 'Outerwear',
    categorySlug: 'outerwear',
    rating: 4.8,
    reviewCount: 55,
    badge: 'NEW',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Rust', 'Forest Green', 'Caramel'],
    description:
      'Mid-weight corduroy jacket with four patch pockets and a sturdy corded zip. The earthy rust tone is a nod to 1970s workwear heritage. Fully lined for warmth.',
    inStock: true,
    tags: ['corduroy', 'jacket', 'outerwear', 'vintage'],
  },
  {
    id: 'vtr-007',
    name: 'Vintage Midi Dress',
    price: 62,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop&q=80',
    category: 'Dresses',
    categorySlug: 'dresses',
    rating: 4.7,
    reviewCount: 176,
    badge: 'VINTAGE',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Cream', 'Terracotta', 'Dusty Mauve'],
    description:
      'Flowing midi dress in a vintage-inspired floral print. Fitted bodice with a gentle A-line skirt. The fabric has a beautiful drape that moves naturally with the body.',
    inStock: true,
    tags: ['dress', 'midi', 'floral', 'vintage'],
  },
  {
    id: 'vtr-008',
    name: 'Straight-Leg Vintage Denim',
    price: 54,
    originalPrice: 75,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop&q=80',
    category: 'Denim',
    categorySlug: 'denim',
    rating: 4.6,
    reviewCount: 234,
    badge: 'SALE',
    sizes: ['24', '25', '26', '27', '28', '29', '30', '31', '32'],
    colors: ['Light Wash', 'Mid Wash', 'Dark Indigo'],
    description:
      'Relaxed straight-leg cut with a high rise and authentic whisker detailing. These jeans are pre-washed to achieve a perfectly faded, broken-in finish straight from the rack.',
    inStock: true,
    tags: ['denim', 'jeans', 'straight-leg', 'vintage'],
  },
  {
    id: 'vtr-009',
    name: 'Linen Wide-Leg Trousers',
    price: 49,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop&q=80',
    category: "Women's",
    categorySlug: 'womens',
    rating: 4.5,
    reviewCount: 91,
    badge: 'NEW',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Natural Linen', 'Clay', 'Ecru'],
    description:
      'Easy-fitting wide-leg trousers in washed linen. The relaxed silhouette and breathable fabric make these ideal for transitional dressing — from market mornings to evening dinners.',
    inStock: true,
    tags: ['linen', 'trousers', 'wide-leg', 'summer'],
  },
  {
    id: 'vtr-010',
    name: 'Wool Plaid Overshirt',
    price: 79,
    originalPrice: 110,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1551854838-212c9b32e231?w=600&h=800&fit=crop&q=80',
    category: "Men's",
    categorySlug: 'mens',
    rating: 4.7,
    reviewCount: 63,
    badge: 'SALE',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Caramel Plaid', 'Forest Plaid'],
    description:
      'Heavyweight wool-blend overshirt in a classic heritage plaid. Wear open as a light jacket or buttoned up as a shirt. The relaxed boxy fit makes it easy to layer.',
    inStock: true,
    tags: ['wool', 'plaid', 'overshirt', 'winter'],
  },
  {
    id: 'vtr-011',
    name: 'Vintage Canvas Backpack',
    price: 68,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop&q=80',
    category: 'Accessories',
    categorySlug: 'accessories',
    rating: 4.6,
    reviewCount: 44,
    badge: 'VINTAGE',
    sizes: ['One Size'],
    colors: ['Olive', 'Tan', 'Black'],
    description:
      'Waxed canvas backpack with leather trim and solid brass hardware. Multiple compartments with a roomy main section. Built to last and age gracefully.',
    inStock: true,
    tags: ['backpack', 'canvas', 'accessories', 'vintage'],
  },
  {
    id: 'vtr-012',
    name: 'Ribbed Turtleneck',
    price: 38,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop&q=80',
    category: "Women's",
    categorySlug: 'womens',
    rating: 4.8,
    reviewCount: 158,
    badge: 'NEW',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ivory', 'Dark Brown', 'Sage Green'],
    description:
      'Slim-fit ribbed turtleneck in a thick, cosy knit. The elevated neckline and clean lines make this a versatile layering piece that works from September through March.',
    inStock: true,
    tags: ['turtleneck', 'knit', 'ribbed', 'winter'],
  },
]

// Helper: get products by category slug
export function getProductsByCategory(slug: string): MockProduct[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug)
}

// Helper: get featured products (staff picks + vintage badges)
export function getFeaturedProducts(limit = 4): MockProduct[] {
  return PRODUCTS.filter((p) => p.badge === 'STAFF PICK' || p.badge === 'VINTAGE').slice(0, limit)
}

// Helper: get latest products (first N, simulating newest arrivals)
export function getLatestProducts(limit = 8): MockProduct[] {
  return PRODUCTS.filter((p) => p.badge === 'NEW' || !p.badge).slice(0, limit)
}

// Helper: get sale products
export function getSaleProducts(limit = 4): MockProduct[] {
  return PRODUCTS.filter((p) => p.badge === 'SALE').slice(0, limit)
}

// Helper: get product by ID
export function getProductById(id: string): MockProduct | undefined {
  return PRODUCTS.find((p) => p.id === id)
}