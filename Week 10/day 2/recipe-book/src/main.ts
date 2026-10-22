import './style.css'
import { RecipeCollection } from './model/RecipeCollection'
import { RecipeItem } from './model/RecipeItem'
import { RecipeTemplate, type RecipeFilter } from './templates/RecipeTemplate'

const starterRecipes = [
  new RecipeItem({
    title: 'Lemony chickpea bowls',
    ingredients: ['1 can chickpeas', '1 lemon', '2 cups cooked rice', 'Parsley and olive oil'],
    instructions: 'Crisp the chickpeas in a pan with olive oil. Spoon over rice, then finish with lemon zest, juice, and parsley.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85',
  }),
  new RecipeItem({
    title: 'Tomato butter pasta',
    ingredients: ['250 g pasta', '1 cup cherry tomatoes', '2 tbsp butter', 'Parmesan and basil'],
    instructions: 'Boil the pasta until just tender. Melt butter with the tomatoes until they burst, then toss with pasta water, parmesan, and basil.',
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85',
  }),
  new RecipeItem({
    title: 'Ginger carrot soup',
    ingredients: ['500 g carrots', '1 small onion', '1 tsp fresh ginger', '700 ml vegetable stock'],
    instructions: 'Soften onion and ginger, add sliced carrots and stock, then simmer until tender. Blend smooth and season to taste.',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85',
  }),
]

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) throw new Error('The recipe app root element was not found.')

app.innerHTML = `
  <header class="topbar">
    <a class="wordmark" href="#top" aria-label="Kitchen notes home"><span class="wordmark-mark">K</span><span>KITCHEN NOTES</span></a>
    <span class="day-tag">WEEK 10 <i>/</i> DAY 02</span>
  </header>
  <main class="page-shell" id="top">
    <section class="page-intro" aria-labelledby="page-title">
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span> YOUR PERSONAL RECIPE INDEX</p>
        <h1 id="page-title">Recipes worth<br><em>keeping.</em></h1>
      </div>
      <p class="intro-note">A small collection for the meals<br>you'll want to make again.</p>
    </section>
    <div class="workspace">
      <aside class="entry-panel" aria-labelledby="entry-title">
        <div class="panel-kicker"><span>01</span><span>ADD TO THE BOOK</span></div>
        <h2 id="entry-title">New recipe</h2>
        <form id="recipeEntryForm">
          <label for="recipeTitle">Recipe title</label>
          <input type="text" id="recipeTitle" name="title" maxlength="80" placeholder="e.g. Sunday tomato sauce" required>
          <label for="ingredients">Ingredients <span>one per line</span></label>
          <textarea id="ingredients" name="ingredients" rows="5" maxlength="1200" placeholder="2 tbsp olive oil&#10;1 clove garlic&#10;A pinch of sea salt" required></textarea>
          <label for="instructions">Instructions</label>
          <textarea id="instructions" name="instructions" rows="5" maxlength="3000" placeholder="Write the steps, one at a time..." required></textarea>
          <p class="form-message" id="formMessage" role="status" aria-live="polite"></p>
          <button class="submit-button" type="submit"><span>Add recipe</span><b aria-hidden="true">+</b></button>
        </form>
        <p class="panel-footnote">Good things are better shared.<br>Start with your own kitchen.</p>
      </aside>
      <section class="collection-panel" aria-labelledby="collection-title">
        <div class="collection-heading">
          <div>
            <p class="eyebrow">THE COLLECTION</p>
            <h2 id="collection-title">Your recipe book <span id="recipeCount">0</span></h2>
          </div>
          <button class="clear-button" id="clearRecipesButton" type="button">Clear all</button>
        </div>
        <div class="filter-row" role="group" aria-label="Filter recipes">
          <button class="filter-button is-selected" type="button" data-filter="all" aria-pressed="true">All recipes</button>
          <button class="filter-button" type="button" data-filter="favorites" aria-pressed="false">Favorites <span aria-hidden="true">★</span></button>
        </div>
        <div id="recipeContainer" class="recipe-container" aria-live="polite"></div>
      </section>
    </div>
    <footer class="page-footer"><span>MADE FOR THE EVERYDAY TABLE</span><span id="storageStatus">SAVED IN THIS BROWSER</span></footer>
  </main>
`

const collection = new RecipeCollection(starterRecipes)
const recipeContainer = document.querySelector<HTMLDivElement>('#recipeContainer')!
const recipeCount = document.querySelector<HTMLSpanElement>('#recipeCount')!
const storageStatus = document.querySelector<HTMLSpanElement>('#storageStatus')!
const formMessage = document.querySelector<HTMLParagraphElement>('#formMessage')!
const recipeForm = document.querySelector<HTMLFormElement>('#recipeEntryForm')!
const template = new RecipeTemplate(recipeContainer, {
  onFavorite: (id) => runCollectionChange(() => collection.toggleFavorite(id)),
  onDelete: (id) => runCollectionChange(() => collection.removeRecipe(id)),
})

let activeFilter: RecipeFilter = 'all'

function renderRecipes(): void {
  const recipes = collection.getRecipes()
  const visibleRecipes = activeFilter === 'favorites'
    ? recipes.filter((recipe) => recipe.isFavorite)
    : recipes

  recipeCount.textContent = recipes.length.toString().padStart(2, '0')
  template.render(visibleRecipes, activeFilter)
}

function runCollectionChange(change: () => void): void {
  try {
    change()
    storageStatus.textContent = 'SAVED IN THIS BROWSER'
    renderRecipes()
  } catch {
    storageStatus.textContent = 'COULD NOT SAVE CHANGES'
  }
}

recipeForm.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault()
  const formData = new FormData(recipeForm)
  const title = String(formData.get('title') ?? '').trim()
  const ingredients = String(formData.get('ingredients') ?? '')
    .split(/\r?\n/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
  const instructions = String(formData.get('instructions') ?? '').trim()

  if (!title || ingredients.length === 0 || !instructions) {
    formMessage.textContent = 'Add a title, at least one ingredient, and instructions.'
    return
  }

  try {
    collection.addRecipe(new RecipeItem({ title, ingredients, instructions }))
    recipeForm.reset()
    formMessage.textContent = ''
    activeFilter = 'all'
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
      const selected = button.dataset.filter === activeFilter
      button.classList.toggle('is-selected', selected)
      button.setAttribute('aria-pressed', String(selected))
    })
    storageStatus.textContent = 'SAVED IN THIS BROWSER'
    renderRecipes()
  } catch {
    formMessage.textContent = 'This browser could not save the recipe. Check local storage and try again.'
    storageStatus.textContent = 'COULD NOT SAVE CHANGES'
  }
})

document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter === 'favorites' ? 'favorites' : 'all'
    document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((filterButton) => {
      const selected = filterButton === button
      filterButton.classList.toggle('is-selected', selected)
      filterButton.setAttribute('aria-pressed', String(selected))
    })
    renderRecipes()
  })
})

document.querySelector<HTMLButtonElement>('#clearRecipesButton')!.addEventListener('click', () => {
  if (collection.getRecipes().length === 0 || !window.confirm('Clear every recipe from this browser?')) return
  runCollectionChange(() => collection.clear())
})

renderRecipes()