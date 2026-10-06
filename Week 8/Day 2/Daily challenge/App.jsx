import AutoCompletedText from './AutoCompletedText.jsx'

function App() {
  return (
    <main className="page-shell">
      <header className="page-heading">
        <p className="eyebrow">Week 8 · Day 2 · Daily Challenge 2</p>
        <h1>Find a country<span>.</span></h1>
        <p className="intro">
          Start typing to search the country list, then choose a suggestion.
        </p>
      </header>
      <AutoCompletedText />
      <footer className="page-footer">React class components <span>·</span> Autocomplete</footer>
    </main>
  )
}

export default App
