import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { removeCategory, setCategory, setFilter, setSearch, setSort, type ReadingFilter } from '../app/booksSlice'
import { BookCard } from './BookCard'

const filters: { label: string; value: ReadingFilter }[] = [
  { label: 'All books', value: 'all' },
  { label: 'To read', value: 'unread' },
  { label: 'Finished', value: 'read' },
]

export function BookList() {
  const dispatch = useAppDispatch()
  const { books, categories, filter, category, search, sort } = useAppSelector((state) => state.library)

  const visibleBooks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return books
      .filter((book) => filter === 'all' || (filter === 'read') === book.isRead)
      .filter((book) => category === 'all' || book.category === category)
      .filter((book) => !query || `${book.title} ${book.author} ${book.category}`.toLocaleLowerCase().includes(query))
      .sort((first, second) => {
        if (sort === 'title') return first.title.localeCompare(second.title)
        if (sort === 'author') return first.author.localeCompare(second.author)
        return second.dateAdded.localeCompare(first.dateAdded)
      })
  }, [books, filter, category, search, sort])

  return (
    <section className="library" aria-labelledby="library-heading">
      <div className="library-heading">
        <div>
          <p className="eyebrow">YOUR READING JOURNEY</p>
          <h2 id="library-heading">My library <span className="count">{books.length}</span></h2>
        </div>
        <label className="sort-control">
          <span>Sort</span>
          <select aria-label="Sort books" value={sort} onChange={(event) => dispatch(setSort(event.target.value as typeof sort))}>
            <option value="recent">Recently added</option>
            <option value="title">Title A–Z</option>
            <option value="author">Author A–Z</option>
          </select>
        </label>
      </div>

      <label className="search-box">
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input aria-label="Search books" value={search} onChange={(event) => dispatch(setSearch(event.target.value))} placeholder="Search title, author, or category..." />
        {search && <button type="button" className="clear-search" onClick={() => dispatch(setSearch(''))} aria-label="Clear search">×</button>}
      </label>

      <div className="library-controls">
        <div className="filter-tabs" role="group" aria-label="Filter by reading status">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={filter === item.value ? 'filter-tab filter-tab--active' : 'filter-tab'}
              aria-pressed={filter === item.value}
              onClick={() => dispatch(setFilter(item.value))}
            >
              {item.label}
              {item.value === 'all' && <span className="tab-count">{books.length}</span>}
              {item.value === 'unread' && <span className="tab-count">{books.filter((book) => !book.isRead).length}</span>}
              {item.value === 'read' && <span className="tab-count">{books.filter((book) => book.isRead).length}</span>}
            </button>
          ))}
        </div>
        {categories.length > 0 && (
          <div className="category-control">
            <label htmlFor="category-filter">Category</label>
            <select id="category-filter" aria-label="Filter by category" value={category} onChange={(event) => dispatch(setCategory(event.target.value))}>
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            {category !== 'all' && (
              <button
                className="category-delete"
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${category}" category? Books in it will move to Uncategorized.`)) {
                    dispatch(removeCategory(category))
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {visibleBooks.length > 0 ? (
        <div className="book-grid">
          {visibleBooks.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state__icon" aria-hidden="true">▤</span>
          <h3>{books.length === 0 ? 'A shelf full of possibility' : 'No books found'}</h3>
          <p>{books.length === 0 ? 'Add your first book and start building a reading list that feels like yours.' : 'Try a different search or adjust your filters.'}</p>
        </div>
      )}
    </section>
  )
}
