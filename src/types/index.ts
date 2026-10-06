// ============================================================
// Vintage Thrift Room — Shared TypeScript Interfaces
// ============================================================

export type ProductBadge = 'NEW' | 'SALE' | 'VINTAGE' | 'STAFF PICK'

export interface ProductImage {
  url: string
  publicId: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image: ProductImage[]
  stock: number
  status: 'available' | 'sold'
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  description?: string
  count?: number
}

export interface Review {
   _id: string;
  user: { name: string };
  productName: string;
  rating: number;
  comment: string;
  order?: string;
  createdAt: string;
}

// Cart
export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

// Wishlist
export interface WishlistItem {
  product: Product
  addedAt: string
}

// Auth
export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface User {
  _id: string
  name: string
  email: string
  role?: 'admin' | 'user' | string
  phone?: string
  address?: Address
}

// API response shapes (ready for backend integration)
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
}

// Filter types for shop page
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating'
}

// Orders
export interface Order {
  _id: string
  productName: string
  description: string
  category: string
  thumbnailUrl: string
  price: number
  quantity: number
  buyerId: string
  paymentStatus: 'paid' | 'pending' | 'failed'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  shippingAddress?: Address
  soldAt: string
  createdAt: string
}


