import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api } from '../api/api'
import type { Story } from '../types/types'

interface StoriesState {
  items: Story[]
  selectedId: number | null
  loading: boolean
  error: string | null
}

const initialState: StoriesState = { items: [], selectedId: null, loading: false, error: null }

export const loadStories = createAsyncThunk('stories/load', () => api.stories())

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    selectStory(state, action: PayloadAction<number | null>) {
      state.selectedId = action.payload
    },
    upsertStory(state, action: PayloadAction<Story>) {
      const index = state.items.findIndex((story) => story.id === action.payload.id)
      if (index < 0) state.items.unshift(action.payload)
      else state.items[index] = action.payload
      state.items.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    },
    removeStory(state, action: PayloadAction<number>) {
      state.items = state.items.filter((story) => story.id !== action.payload)
      if (state.selectedId === action.payload) state.selectedId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadStories.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(loadStories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Could not load stories.'
      })
  },
})

export const { removeStory, selectStory, upsertStory } = storiesSlice.actions
export default storiesSlice.reducer
