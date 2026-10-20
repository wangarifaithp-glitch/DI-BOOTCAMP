import { useCallback, useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchRecipes } from './features/dataSlice'
import { DataFetcher } from './components/DataFetcher'
import { RecipeCard } from './components/RecipeCard'
import type { Recipe } from './types/types'
import './App.css'

function App() {
  const dispatch = useAppDispatch()
  const { recipes, status, error } = useAppSelector((state) => state.data)
  const [searchValue, setSearchValue] = useState('chicken')
  const [query, setQuery] = useState('chicken')

  const loadRecipes = useCallback(
    (term: string) => dispatch(fetchRecipes(term)),
    [dispatch],
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const term = searchValue.trim()
    if (term) setQuery(term)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Simmer home">
          <span className="brand-icon" aria-hidden="true">✳</span>
          <span>simmer<span className="brand-period">.</span></span>
        </a>
        <span className="topbar-note"><span className="status-dot" /> GENERIC DATA FETCHER DEMO</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">FRESH IDEAS, ONE SEARCH AWAY</p>
          <h1>What sounds<br />good <em>today?</em></h1>
          <p>Explore a world of recipes. Search an ingredient, a dish, or simply follow your appetite.</p>
          <form className="search-form" onSubmit={handleSubmit}>
            <span className="search-symbol" aria-hidden="true">⌕</span>
            <label className="visually-hidden" htmlFor="recipe-search">Search recipes</label>
            <input
              id="recipe-search"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Try “salmon” or “pasta”"
              required
            />
            <button type="submit" disabled={status === 'loading' || !searchValue.trim()}>
              Search <span aria-hidden="true">↗</span>
            </button>
          </form>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-orbit hero-orbit--outer" />
          <div className="hero-orbit hero-orbit--inner" />
          <div className="plate"><span className="plate-center"><span>✳</span></span></div>
          <span className="floating-leaf floating-leaf--one">✿</span>
          <span className="floating-leaf floating-leaf--two">✦</span>
          <span className="floating-leaf floating-leaf--three">·</span>
        </div>
      </section>

      <section className="results-section" aria-labelledby="results-heading">
        <div className="results-heading">
          <div>
            <p className="eyebrow">FROM THE RECIPE BOX</p>
            <h2 id="results-heading">
              {status === 'succeeded' && recipes.length > 0 ? 'Recipes to savor' : 'A little inspiration'}
            </h2>
          </div>
          {status === 'succeeded' && recipes.length > 0 && (
            <span className="result-count">{recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}</span>
          )}
        </div>

        <DataFetcher<Recipe>
          query={query}
          items={recipes}
          status={status}
          error={error}
          onLoad={loadRecipes}
          getKey={(recipe) => recipe.id}
          renderItem={(recipe) => <RecipeCard recipe={recipe} />}
        />
      </section>

      <footer className="footer">
        <span>Made for curious cooks</span>
        <span aria-hidden="true">✳</span>
        <span>Powered by TheMealDB</span>
      </footer>
    </main>
  )
}

export default App
