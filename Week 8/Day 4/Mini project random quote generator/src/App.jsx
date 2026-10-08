import { useState } from 'react'
import quotes from '../QuotesDatabase.js'

const uniqueQuotes = quotes.filter(
  (quote, index, allQuotes) =>
    allQuotes.findIndex((candidate) => candidate.quote === quote.quote) === index,
)

const palettes = [
  { background: '#315c5a', quote: '#315c5a', button: '#315c5a' },
  { background: '#744f74', quote: '#744f74', button: '#744f74' },
  { background: '#8a5b3d', quote: '#8a5b3d', button: '#8a5b3d' },
  { background: '#3f5b86', quote: '#3f5b86', button: '#3f5b86' },
  { background: '#9a4f5d', quote: '#9a4f5d', button: '#9a4f5d' },
  { background: '#596b3e', quote: '#596b3e', button: '#596b3e' },
  { background: '#455a64', quote: '#455a64', button: '#455a64' },
  { background: '#985d2e', quote: '#985d2e', button: '#985d2e' },
]

function randomIndex(except, length) {
  return (Math.floor(Math.random() * (length - 1)) + except + 1) % length
}

function App() {
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * uniqueQuotes.length),
  )
  const [paletteIndex, setPaletteIndex] = useState(() =>
    Math.floor(Math.random() * palettes.length),
  )

  const quote = uniqueQuotes[quoteIndex]
  const palette = palettes[paletteIndex]

  function showAnotherQuote() {
    setQuoteIndex((currentIndex) => randomIndex(currentIndex, uniqueQuotes.length))
    setPaletteIndex((currentIndex) => randomIndex(currentIndex, palettes.length))
  }

  return (
    <main className="page" style={{ '--page-color': palette.background }}>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <section className="quote-card" aria-label="Random quote">
        <p className="eyebrow">A moment of inspiration</p>
        <div className="quote-mark" aria-hidden="true">“</div>

        <figure className="quote-content" aria-live="polite" aria-atomic="true">
          <blockquote style={{ color: palette.quote }}>
            {quote.quote}
          </blockquote>
          <figcaption>
            <span className="author-rule" aria-hidden="true" />
            {quote.author || 'Unknown author'}
          </figcaption>
        </figure>

        <div className="card-divider" />
        <button
          className="new-quote-button"
          style={{ '--button-color': palette.button }}
          type="button"
          onClick={showAnotherQuote}
        >
          New quote
          <span aria-hidden="true">↗</span>
        </button>
        <p className="quote-count">{uniqueQuotes.length} thoughts to explore</p>
      </section>

      <footer className="page-footer">A LITTLE INSPIRATION FOR EVERY DAY</footer>
    </main>
  )
}

export default App
