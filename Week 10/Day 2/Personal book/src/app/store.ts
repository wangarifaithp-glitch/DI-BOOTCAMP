import { configureStore } from '@reduxjs/toolkit'
import booksReducer, { loadBooksState } from './booksSlice'

export const store = configureStore({
  reducer: { library: booksReducer },
  preloadedState: { library: loadBooksState() },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
