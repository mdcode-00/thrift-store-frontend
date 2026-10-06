import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product, WishlistItem } from '@/types'

export interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload
      state.isLoading = false
      state.error = null
    },
    setWishlistLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setWishlistError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.isLoading = false
    },
    toggleWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload
      const index = state.items.findIndex((i) => i.product._id === product._id)
      if (index !== -1) {
        state.items.splice(index, 1)
      } else {
        state.items.push({ product, addedAt: new Date().toISOString() })
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product._id !== action.payload)
    },
    clearWishlist(state) {
      state.items = []
      state.isLoading = false
      state.error = null
    },
  },
})

export const {
  setWishlistItems,
  setWishlistLoading,
  setWishlistError,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions

export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items
export const selectIsWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.isLoading
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error
export const selectIsWishlisted = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.some((i) => i.product._id === productId)
export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.items.length

export default wishlistSlice.reducer