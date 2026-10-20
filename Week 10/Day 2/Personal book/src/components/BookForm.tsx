import { useState, type FormEvent } from 'react'
import { BookItem } from '../model/Book'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addBook } from '../app/booksSlice'

export function BookForm() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.library.categories)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedAuthor = author.trim()
    const trimmedCategory = category.trim() || 'Uncategorized'
    if (!trimmedTitle || !trimmedAuthor) {
      setError('Please enter both a book title and an author.')
      return
    }

    const book = new BookItem(
      crypto.randomUUID(),
      trimmedTitle,
      trimmedAuthor,
      trimmedCategory,
      notes.trim(),
      false,
      new Date().toISOString(),
    )
    dispatch(addBook(book.toJSON()))
    setTitle('')
    setAuthor('')
    setCategory('')
    setNotes('')
    setError('')
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">GROW YOUR SHELVES</p>
          <h2>Add a book</h2>
        </div>
        <span className="book-form__mark" aria-hidden="true">＋</span>
      </div>
      <label htmlFor="book-title">Book title</label>
      <input id="book-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. The Midnight Library" maxLength={120} required />
      <label htmlFor="book-author">Author</label>
      <input id="book-author" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="e.g. Matt Haig" maxLength={100} required />
      <label htmlFor="book-category">Category <span className="optional">optional</span></label>
      <input id="book-category" list="book-categories" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Fiction" maxLength={40} />
      <datalist id="book-categories">
        {categories.map((item) => <option key={item} value={item} />)}
      </datalist>
      <label htmlFor="book-notes">Notes <span className="optional">optional</span></label>
      <textarea id="book-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="A thought, quote, or reminder..." rows={3} maxLength={500} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--primary" type="submit">Add to library <span aria-hidden="true">↗</span></button>
    </form>
  )
}
