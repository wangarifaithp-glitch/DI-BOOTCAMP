import type { Book } from '../model/Book'
import { useAppDispatch } from '../app/hooks'
import { removeBook, toggleReadStatus } from '../app/booksSlice'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const dispatch = useAppDispatch()
  return (
    <article className={`book-card${book.isRead ? ' book-card--read' : ''}`}>
      <div className="book-card__top">
        <span className="book-category">{book.category}</span>
        <button
          className="remove-button"
          type="button"
          aria-label={`Remove ${book.title}`}
          title="Remove book"
          onClick={() => dispatch(removeBook(book.id))}
        >
          ×
        </button>
      </div>
      <h3>{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      {book.notes && <p className="book-notes">{book.notes}</p>}
      <div className="book-card__bottom">
        <span className={`status ${book.isRead ? 'status--read' : ''}`}>
          <span aria-hidden="true">{book.isRead ? '✓' : '○'}</span>
          {book.isRead ? 'Finished' : 'On my list'}
        </span>
        <button
          className="read-toggle"
          type="button"
          onClick={() => dispatch(toggleReadStatus(book.id))}
          aria-label={book.isRead ? `Mark ${book.title} as unread` : `Mark ${book.title} as read`}
        >
          {book.isRead ? 'Mark unread' : 'Mark as read'}
        </button>
      </div>
    </article>
  )
}
