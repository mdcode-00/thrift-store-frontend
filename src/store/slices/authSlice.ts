import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
     updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    finishInitializing(state) {
      state.isInitializing = false
    },
  },
})

export const { setCredentials, updateUser, logout, finishInitializing } = authSlice.actions

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token
export const selectIsInitializing = (state: { auth: AuthState }) => state.auth.isInitializing

export default authSlice.reducer