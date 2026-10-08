import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'

const categories = [
  { label: 'Mountains', path: '/mountains', query: 'mountain landscape' },
  { label: 'Beaches', path: '/beaches', query: 'beach ocean' },
  { label: 'Birds', path: '/birds', query: 'birds wildlife' },
  { label: 'Food', path: '/food', query: 'food' },
]

const pageSize = 30

function buildImageSearchUrl(query, continuation) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: String(pageSize),
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '720',
    origin: '*',
  })

  if (continuation) {
    params.set('gsroffset', String(continuation.gsroffset))
    params.set('continue', continuation.continue)
  }

  return `https://commons.wikimedia.org/w/api.php?${params}`
}

function normalizeImages(data) {
  return Object.values(data.query?.pages ?? {}).map((page) => ({
    id: page.pageid,
    title: page.title.replace(/^File:/, ''),
    url: page.imageinfo?.[0]?.url,
    thumbnail: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url,
    foreign_landing_url: page.imageinfo?.[0]?.descriptionurl,
  })).filter((image) => image.url && image.foreign_landing_url)
}

function SearchBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (location.pathname.startsWith('/search/')) {
      setSearch(decodeURIComponent(location.pathname.slice('/search/'.length)))
    } else {
      setSearch('')
    }
  }, [location.pathname])

  function submitSearch(event) {
    event.preventDefault()
    const query = search.trim()
    if (query) navigate(`/search/${encodeURIComponent(query)}`)
  }

  return (
    <form className="search-form" role="search" onSubmit={submitSearch}>
      <label className="visually-hidden" htmlFor="image-search">Search photographs</label>
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.1 4.1" />
      </svg>
      <input
        id="image-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search images"
      />
      <button type="submit" aria-label="Submit search">
        <span>Search</span>
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  )
}

function Header() {
  const location = useLocation()

  return (
    <header className="site-header">
      <Link className="mark" to="/" aria-label="Go to the image collection">
        <span className="mark-icon" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
      </Link>
      <SearchBar />
      <a className="header-link" href="https://openverse.org/" target="_blank" rel="noreferrer">
        Explore
        <span aria-hidden="true">↗</span>
      </a>
      <nav className="category-nav" aria-label="Image categories">
        {categories.map((category) => {
          const isActive = location.pathname === category.path

          return (
            <Link
              key={category.label}
              className={`category-link${isActive ? ' is-active' : ''}`}
              to={category.path}
              aria-current={isActive ? 'page' : undefined}
            >
              {category.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

function SearchRoute() {
  const { query = '' } = useParams()
  return <Gallery key={query} query={query} title={query} isSearch />
}

function Gallery({ query, title, isSearch }) {
  const [images, setImages] = useState([])
  const [continuation, setContinuation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [imageErrors, setImageErrors] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchImages() {
      setLoading(true)
      setImages([])
      setContinuation(null)
      setError('')
      setImageErrors(0)

      try {
        const response = await fetch(buildImageSearchUrl(query), {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Image search failed (${response.status}). Please try again.`)
        }

        const data = await response.json()
        setImages(normalizeImages(data))
        setContinuation(data.continue ?? null)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Images could not be loaded. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchImages()
    return () => controller.abort()
  }, [query])

  async function loadMore() {
    if (loadingMore || !continuation) return

    setLoadingMore(true)
    setError('')
    try {
      const response = await fetch(buildImageSearchUrl(query, continuation))

      if (!response.ok) {
        throw new Error(`More images could not be loaded (${response.status}). Please try again.`)
      }

      const data = await response.json()
      setImages((currentImages) => [...currentImages, ...normalizeImages(data)])
      setContinuation(data.continue ?? null)
    } catch (fetchError) {
      setError(fetchError.message || 'More images could not be loaded. Please try again.')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <main className="main-content">
      <section className="gallery-intro" aria-labelledby="gallery-title">
        <p className="overline">{isSearch ? 'SEARCH RESULTS' : 'A COLLECTION OF IMAGES'}</p>
        <div className="intro-row">
          <h1 id="gallery-title">{title}</h1>
          {!loading && !error && (
            <p className="result-count">
              <span>{images.length.toLocaleString()}</span> images shown
            </p>
          )}
        </div>
        <p className="intro-caption">
          {isSearch
            ? `Images related to “${query}”.`
            : `A little inspiration from ${title.toLowerCase()}.`}
        </p>
      </section>

      {loading && (
        <div className="status-message" role="status">
          <span className="loader" aria-hidden="true" />
          Finding images
        </div>
      )}

      {!loading && error && (
        <div className="status-message error-message" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>Try again</button>
        </div>
      )}

      {!loading && !error && images.length === 0 && (
        <div className="status-message" role="status">
          No images found. Try another search.
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <>
          {imageErrors > 0 && (
            <p className="image-note" role="status">
              {imageErrors} {imageErrors === 1 ? 'image is' : 'images are'} unavailable.
            </p>
          )}
          <div className="photo-grid">
            {images.map((image, index) => (
              <article className="photo-card" key={`${image.id}-${index}`}>
                <a
                  className="photo-link"
                  href={image.foreign_landing_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${image.title || 'photograph'} on its source website`}
                >
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.title || `${title} photograph`}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.closest('.photo-card')?.classList.add('image-unavailable')
                      setImageErrors((count) => count + 1)
                    }}
                  />
                  <span className="photo-overlay">
                    <span className="photo-title">{image.title || title}</span>
                    <span className="photo-creator">Wikimedia Commons</span>
                    <span className="photo-arrow" aria-hidden="true">↗</span>
                  </span>
                </a>
              </article>
            ))}
          </div>
          <p className="attribution">
            Images are hosted by{' '}
            <a href="https://commons.wikimedia.org/" target="_blank" rel="noreferrer">Wikimedia Commons</a>.
          </p>
          {continuation && (
            <div className="pagination">
              <button type="button" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading images…' : 'Load more images'}
                {!loadingMore && <span aria-hidden="true">↓</span>}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/mountains" replace />} />
        {categories.map((category) => (
          <Route
            key={category.path}
            path={category.path}
            element={<Gallery query={category.query} title={category.label} />}
          />
        ))}
        <Route path="/search/:query" element={<SearchRoute />} />
        <Route path="*" element={<Navigate to="/mountains" replace />} />
      </Routes>
      <footer className="site-footer">
        <span>IMAGES FOR THE CURIOUS</span>
        <span>SHARED WITH CARE</span>
      </footer>
    </div>
  )
}

export default App
