import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../api/api'
import type { User } from '../types/types'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = { user: null, loading: true, error: null }

export const loadUser = createAsyncThunk('auth/loadUser', () => api.me())
export const authenticate = createAsyncThunk(
  'auth/authenticate',
  async (args: { email: string; password: string; displayName?: string; register: boolean }) => {
    const { register, ...values } = args
    return (await api.signIn(values, register)).user
  },
)
export const logout = createAsyncThunk('auth/logout', async () => {
  await api.signOut()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
    updateUser(state, action: { payload: User }) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null
        state.loading = false
      })
      .addCase(authenticate.pending, (state) => {
        state.error = null
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.error = action.error.message || 'Could not sign in.'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.error = null
      })
  },
})

export const { clearAuthError, updateUser } = authSlice.actions
export default authSlice.reducer
