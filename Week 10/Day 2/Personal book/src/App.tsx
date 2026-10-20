import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { setStorageError } from './app/booksSlice'
import { BookForm } from './components/BookForm'
import { BookList } from './components/BookList'
import { LibraryStats } from './components/LibraryStats'
import './App.css'

function App() {
  const library = useAppSelector((state) => state.library)
  const dispatch = useAppDispatch()

  useEffect(() => {
    try {
      localStorage.setItem('personal-book-library', JSON.stringify(library.books))
      dispatch(setStorageError(''))
    } catch (error) {
      console.error('Unable to save the book library.', error)
      dispatch(setStorageError('Your browser could not save changes. Check available storage and try again.'))
    }
  }, [library.books, dispatch])

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Page & Pine home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>page <i>&</i> pine</span>
        </a>
        <span className="header-note"><span aria-hidden="true">✳</span> YOUR PERSONAL READING SPACE</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A LITTLE SPACE FOR BIG STORIES</p>
          <h1>Every book has<br />a <em>place</em> here.</h1>
          <p className="hero-description">Keep track of the stories you love, the ones you're reading, and everything waiting on your shelf.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="sun-disc" />
          <span className="orbit orbit--one" />
          <span className="orbit orbit--two" />
          <div className="book-stack">
            <div className="book book--green"><span>THE ART OF<br />SLOW LIVING</span><i>✳</i></div>
            <div className="book book--cream"><span>GARDEN<br />OF WORDS</span><i>❋</i></div>
            <div className="book book--orange"><span>WILD<br />PLACES</span><i>✳</i></div>
          </div>
          <span className="sparkle sparkle--one">✳</span>
          <span className="sparkle sparkle--two">✧</span>
        </div>
      </section>

      <LibraryStats />

      {library.storageError && <p className="storage-error" role="alert">{library.storageError}</p>}

      <div className="content-grid">
        <BookForm />
        <BookList />
      </div>

      <footer className="site-footer">
        <span>Made for the love of reading</span>
        <span aria-hidden="true">✳</span>
        <span>One page at a time.</span>
      </footer>
    </main>
  )
}

export default App
