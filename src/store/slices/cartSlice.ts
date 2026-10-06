import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, Product } from '@/types'

export interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload
      state.isLoading = false
      state.error = null
    },
    setCartLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setCartError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.isLoading = false
    },
    addToCart(state, action: PayloadAction<{ product: Product }>) {
      const { product } = action.payload
      const existing = state.items.find((item) => item.product._id === product._id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ product, quantity: 1 })
      }
    },
    removeFromCart(state, action: PayloadAction<{ productId: string }>) {
      const { productId } = action.payload
      state.items = state.items.filter((item) => item.product._id !== productId)
    },
    // NOTE: currently unused — no PATCH /cart/:productId endpoint exists yet.
    // Kept in case quantity-adjustment is added later.
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.product._id === productId)
      if (item) {
        item.quantity = Math.max(0, quantity)
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i !== item)
        }
      }
    },
    clearCart(state) {
      state.items = []
      state.isLoading = false
      state.error = null
    },
  },
})

export const {
  setCartItems,
  setCartLoading,
  setCartError,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions

export const selectIsInCart = (productId: string) => (state: { cart: CartState }) =>
  state.cart.items.some((item) => item.product._id === productId)

console.log(selectIsInCart)
export const selectCartItems = (state: { cart: CartState }) => state.cart.items
export const selectIsCartLoading = (state: { cart: CartState }) => state.cart.isLoading
export const selectCartError = (state: { cart: CartState }) => state.cart.error
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export default cartSlice.reducer