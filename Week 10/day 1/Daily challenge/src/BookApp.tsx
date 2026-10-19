import { useState, type FormEvent } from 'react'
import type { Book } from './Book'
import List from './List'

const starterBooks: Book[] = [
  { id: 'book-1', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin' },
  { id: 'book-2', title: 'Piranesi', author: 'Susanna Clarke' },
  { id: 'book-3', title: 'Kindred', author: 'Octavia E. Butler' },
]

function BookApp() {
  const [books, setBooks] = useState<Book[]>(starterBooks)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [formError, setFormError] = useState('')

  function addBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanTitle = title.trim()
    const cleanAuthor = author.trim()

    if (!cleanTitle || !cleanAuthor) {
      setFormError('Enter both a title and an author.')
      return
    }

    const newBook: Book = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      author: cleanAuthor,
    }

    setBooks((currentBooks) => [...currentBooks, newBook])
    setTitle('')
    setAuthor('')
    setFormError('')
  }

  return (
    <div className="book-app">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Reading room home">
          <span className="brand-mark" aria-hidden="true">B.</span>
          <span>THE READING ROOM</span>
        </a>
        <span className="day-label">WEEK 10 <span>/</span> DAY 01</span>
      </header>

      <main className="page-content" id="top">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PERSONAL LIBRARY <span>•</span> FIELD NOTES 01</p>
            <h1>Book shelf<span className="heading-period">.</span></h1>
          </div>
          <p className="collection-count"><strong>{books.length.toString().padStart(2, '0')}</strong><span>TITLES<br />COLLECTED</span></p>
        </div>

        <div className="library-layout">
          <aside className="add-panel" aria-labelledby="add-heading">
            <div className="panel-index"><span>01</span><span>NEW ENTRY</span></div>
            <h2 id="add-heading">Add a book</h2>
            <form onSubmit={addBook}>
              <label htmlFor="book-title">Title</label>
              <input
                id="book-title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. A Room of One's Own"
                autoComplete="off"
                required
              />
              <label htmlFor="book-author">Author</label>
              <input
                id="book-author"
                name="author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder="e.g. Virginia Woolf"
                autoComplete="name"
                required
              />
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <button className="add-button" type="submit"><span aria-hidden="true">+</span> Add to shelf</button>
            </form>
            <p className="form-footnote">A good book always finds room.</p>
          </aside>

          <section className="shelf" aria-labelledby="shelf-heading">
            <div className="shelf-heading">
              <div>
                <p className="eyebrow">YOUR COLLECTION</p>
                <h2 id="shelf-heading">On the shelf</h2>
              </div>
              <span className="shelf-total">{books.length} {books.length === 1 ? 'BOOK' : 'BOOKS'}</span>
            </div>
            <List
              items={books}
              getKey={(book) => book.id}
              emptyMessage="Your shelf is quiet. Add a book to begin."
              renderItem={(book, index) => (
                <article className="book-row">
                  <span className="book-number">{(index + 1).toString().padStart(2, '0')}</span>
                  <div className="book-details">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>
                  <span className="book-mark" aria-hidden="true">↗</span>
                </article>
              )}
            />
            <p className="shelf-caption" aria-live="polite">Showing {books.length} {books.length === 1 ? 'title' : 'titles'} in your collection</p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default BookApp