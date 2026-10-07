import { useContext, useRef, useState } from 'react'
import { ThemeContext, ThemeProvider } from './ThemeContext.jsx'

function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <section className="exercise-card" aria-labelledby="theme-title">
      <div className="card-heading">
        <span className="exercise-number">01</span>
        <div>
          <p className="eyebrow">useContext + useState</p>
          <h2 id="theme-title">Theme switcher</h2>
        </div>
      </div>
      <p className="card-description">
        The current theme is <strong>{theme}</strong>. Switch the page appearance with the button.
      </p>
      <button
        className="action-button"
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? 'Use dark theme' : 'Use light theme'}
      </button>
    </section>
  )
}

function CharacterCounter() {
  const inputRef = useRef(null)
  const [characterCount, setCharacterCount] = useState(0)

  const updateCharacterCount = () => {
    setCharacterCount(inputRef.current?.value.length ?? 0)
  }

  return (
    <section className="exercise-card" aria-labelledby="counter-title">
      <div className="card-heading">
        <span className="exercise-number">02</span>
        <div>
          <p className="eyebrow">useRef + useState</p>
          <h2 id="counter-title">Character counter</h2>
        </div>
      </div>
      <label className="input-label" htmlFor="message-input">Type a message</label>
      <textarea
        ref={inputRef}
        id="message-input"
        className="message-input"
        onChange={updateCharacterCount}
        placeholder="Your message..."
        rows={4}
      />
      <p className="character-count" aria-live="polite">
        Characters: <strong>{characterCount}</strong>
      </p>
    </section>
  )
}

function Exercises() {
  const { theme } = useContext(ThemeContext)

  return (
    <main className="page-shell" data-theme={theme}>
      <header className="page-header">
        <p className="eyebrow">React · Exercises XP</p>
        <h1>Hooks in action</h1>
        <p>Share a theme with context, then track your typing with a ref.</p>
      </header>
      <div className="exercise-list">
        <ThemeSwitcher />
        <CharacterCounter />
      </div>
      <footer className="page-footer">Week 7 · Day 3 <span>·</span> React XP</footer>
    </main>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Exercises />
    </ThemeProvider>
  )
}

export default App
