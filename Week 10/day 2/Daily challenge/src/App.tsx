import { useState, type FormEvent } from 'react'
import DataFetcher from './components/DataFetcher'
import { useRecipeSearch } from './hooks/useRecipeSearch'
import type { Recipe } from './types/types'
import './Lab.css'

function App() {
  const [draftQuery, setDraftQuery] = useState('pasta')
  const [query, setQuery] = useState('pasta')
  const { items, status, error, retry } = useRecipeSearch(query)

  function searchRecipes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextQuery = draftQuery.trim()
    if (nextQuery) setQuery(nextQuery)
  }

  function chooseSearch(nextQuery: string) {
    setDraftQuery(nextQuery)
    setQuery(nextQuery)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Recipe index home">
          <span className="brand-mark">R</span><span>RECIPE INDEX</span>
        </a>
        <div className="topbar-meta"><span className="live-dot" /> DAY 02 <span>/</span> TYPESCRIPT + REDUX</div>
      </header>

      <main className="page-shell" id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-rule" /> THE DAILY CHALLENGE</p>
            <h1>Find something<br /><em>good to make.</em></h1>
          </div>
          <p className="hero-note">A little inspiration for<br />whatever's in the fridge.</p>
        </section>

        <form className="search-form" onSubmit={searchRecipes} role="search">
          <label className="search-label" htmlFor="recipe-search">SEARCH RECIPES</label>
          <div className="search-control">
            <input
              id="recipe-search"
              type="search"
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              placeholder="Try pasta, soup, or sushi"
              aria-label="Search recipes"
            />
            <button className="search-button" type="submit">Search <span aria-hidden="true">↗</span></button>
          </div>
          <div className="suggestions" aria-label="Popular recipe searches">
            <span>TRY</span>
            {['pasta', 'salad', 'soup', 'sushi'].map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => chooseSearch(suggestion)}>{suggestion}</button>
            ))}
          </div>
        </form>

        <section className="results-section" aria-labelledby="results-heading">
          <div className="results-heading">
            <div>
              <p className="eyebrow">YOUR NEXT FAVORITE</p>
              <h2 id="results-heading">Recipes for “{query}”</h2>
            </div>
            {status === 'succeeded' && <span className="result-count">{items.length} FOUND</span>}
          </div>
          <DataFetcher<Recipe>
            data={items}
            status={status}
            error={error}
            onRetry={retry}
            getKey={(recipe) => recipe.id}
            emptyMessage="No recipes found. Try another search."
            renderItem={(recipe) => <RecipeCard recipe={recipe} />}
          />
        </section>
        <footer className="page-footer">
          <span>POWERED BY A PUBLIC RECIPE DATASET</span>
          <span>FETCHED THROUGH REDUX TOOLKIT</span>
        </footer>
      </main>
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const totalMinutes = recipe.prepTimeMinutes + recipe.cookTimeMinutes

  return (
    <article className="recipe-card">
      <div className="recipe-image-wrap">
        <img src={recipe.image} alt={recipe.name} loading="lazy" />
        <span className="image-index">RECIPE / {String(recipe.id).padStart(2, '0')}</span>
      </div>
      <div className="recipe-content">
        <div className="recipe-meta">
          <span>{totalMinutes} MIN</span><span>{recipe.servings} SERVINGS</span>
        </div>
        <h3>{recipe.name}</h3>
        <details>
          <summary>Ingredients & method</summary>
          <ul className="ingredient-list">
            {recipe.ingredients.map((ingredient, index) => <li key={`${recipe.id}-${index}`}>{ingredient}</li>)}
          </ul>
          <ol className="instruction-list">
            {recipe.instructions.map((instruction, index) => <li key={`${recipe.id}-step-${index}`}>{instruction}</li>)}
          </ol>
        </details>
      </div>
    </article>
  )
}

export default App
