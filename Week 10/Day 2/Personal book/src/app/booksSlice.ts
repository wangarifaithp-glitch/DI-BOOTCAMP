import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Book } from '../model/Book'

export type ReadingFilter = 'all' | 'unread' | 'read'
export type BookSort = 'recent' | 'title' | 'author'

export interface BooksState {
  books: Book[]
  categories: string[]
  filter: ReadingFilter
  category: string
  search: string
  sort: BookSort
  storageError: string
}

export function loadBooksState(): BooksState {
  const initialState: BooksState = {
    books: [],
    categories: [],
    filter: 'all',
    category: 'all',
    search: '',
    sort: 'recent',
    storageError: '',
  }

  try {
    const saved = localStorage.getItem('personal-book-library')
    if (!saved) return initialState
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed)) throw new Error('Expected a list of books.')

    const books: Book[] = []
    for (const value of parsed) {
      if (
        typeof value !== 'object' ||
        value === null ||
        typeof value.id !== 'string' ||
        typeof value.title !== 'string' ||
        typeof value.author !== 'string' ||
        typeof value.category !== 'string' ||
        typeof value.notes !== 'string' ||
        typeof value.isRead !== 'boolean' ||
        typeof value.dateAdded !== 'string'
      ) {
        throw new Error('A saved book has an invalid format.')
      }
      books.push(value as Book)
    }

    return { ...initialState, books, categories: [...new Set(books.map((book) => book.category))] }
  } catch (error) {
    console.error('Unable to load saved books.', error)
    return initialState
  }
}

const booksSlice = createSlice({
  name: 'books',
  initialState: loadBooksState,
  reducers: {
    addBook(state, action: PayloadAction<Book>) {
      state.books.unshift(action.payload)
      if (!state.categories.includes(action.payload.category)) {
        state.categories.push(action.payload.category)
      }
    },
    removeBook(state, action: PayloadAction<string>) {
      state.books = state.books.filter((book) => book.id !== action.payload)
    },
    toggleReadStatus(state, action: PayloadAction<string>) {
      const book = state.books.find((item) => item.id === action.payload)
      if (book) book.isRead = !book.isRead
    },
    setFilter(state, action: PayloadAction<ReadingFilter>) {
      state.filter = action.payload
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setSort(state, action: PayloadAction<BookSort>) {
      state.sort = action.payload
    },
    removeCategory(state, action: PayloadAction<string>) {
      const category = action.payload
      state.books = state.books.map((book) =>
        book.category === category ? { ...book, category: 'Uncategorized' } : book,
      )
      state.categories = [
        ...new Set([
          ...state.categories.filter((item) => item !== category),
          ...(state.books.some((book) => book.category === 'Uncategorized') ? ['Uncategorized'] : []),
        ]),
      ]
      if (state.category === category) state.category = 'all'
    },
    setStorageError(state, action: PayloadAction<string>) {
      state.storageError = action.payload
    },
  },
})

export const {
  addBook,
  removeBook,
  toggleReadStatus,
  setFilter,
  setCategory,
  setSearch,
  setSort,
  removeCategory,
  setStorageError,
} = booksSlice.actions

export default booksSlice.reducer
