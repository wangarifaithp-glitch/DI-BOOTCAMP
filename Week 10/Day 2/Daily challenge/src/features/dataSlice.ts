import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { searchRecipes } from '../api/api'
import type { Recipe, RequestStatus } from '../types/types'

interface DataState {
  recipes: Recipe[]
  status: RequestStatus
  error: string | null
  query: string
}

const initialState: DataState = {
  recipes: [],
  status: 'idle',
  error: null,
  query: '',
}

export const fetchRecipes = createAsyncThunk<Recipe[], string, { rejectValue: string }>(
  'data/fetchRecipes',
  async (query, { rejectWithValue, signal }) => {
    try {
      return await searchRecipes(query, signal)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred while fetching recipes.',
      )
    }
  },
)

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRecipes.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.query = action.meta.arg
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.recipes = action.payload
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Could not fetch recipes.'
      })
  },
})

export default dataSlice.reducer
