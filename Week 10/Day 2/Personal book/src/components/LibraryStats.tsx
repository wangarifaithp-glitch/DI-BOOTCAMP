import { useAppSelector } from '../app/hooks'

export function LibraryStats() {
  const books = useAppSelector((state) => state.library.books)
  const readCount = books.filter((book) => book.isRead).length
  const percentRead = books.length ? Math.round((readCount / books.length) * 100) : 0
  return (
    <section className="stats" aria-label="Library statistics">
      <div className="stat-card">
        <span className="stat-icon stat-icon--books" aria-hidden="true">▤</span>
        <div><span className="stat-label">IN YOUR LIBRARY</span><strong>{books.length}</strong><span className="stat-caption">books collected</span></div>
      </div>
      <div className="stat-card">
        <span className="stat-icon stat-icon--read" aria-hidden="true">✓</span>
        <div><span className="stat-label">FINISHED READING</span><strong>{readCount}</strong><span className="stat-caption">{percentRead}% of your collection</span></div>
      </div>
      <div className="stat-card stat-card--progress">
        <div className="progress-heading"><span className="stat-label">READING PROGRESS</span><strong>{percentRead}%</strong></div>
        <div className="progress-track" role="progressbar" aria-label="Reading progress" aria-valuenow={percentRead} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percentRead}%` }} /></div>
        <span className="stat-caption">{books.length - readCount} {books.length - readCount === 1 ? 'book' : 'books'} waiting on your shelf</span>
      </div>
    </section>
  )
}
