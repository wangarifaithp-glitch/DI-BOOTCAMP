import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getRecipes } from '../api/api'
import type { DataState, Recipe } from '../types/types'

export const fetchRecipes = createAsyncThunk<Recipe[], string, { rejectValue: string }>(
  'recipes/fetch',
  async (query, { rejectWithValue, signal }) => {
    try {
      return await getRecipes(query, signal)
    } catch (error) {
      if (signal.aborted) throw error
      return rejectWithValue(error instanceof Error ? error.message : 'Could not load recipes.')
    }
  },
)

const initialState: DataState<Recipe> = {
  items: [],
  status: 'idle',
  error: null,
}

const dataSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.currentRequestId = action.meta.requestId
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return
        state.status = 'succeeded'
        state.items = action.payload
        state.currentRequestId = undefined
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return
        state.currentRequestId = undefined

        if (action.meta.aborted) {
          state.status = state.items.length > 0 ? 'succeeded' : 'idle'
          return
        }

        state.status = 'failed'
        state.error = action.payload ?? 'Could not load recipes. Check your connection and retry.'
      })
  },
})

export default dataSlice.reducer