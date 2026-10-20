import './style.css'
import { RecipeCollection } from './model/RecipeCollection'
import { RecipeTemplate } from './templates/RecipeTemplate'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('The recipe app root element was not found.')

app.innerHTML = `
  <main class="recipe-app">
    <header class="app-header">
      <p class="eyebrow">YOUR PERSONAL COOKBOOK</p>
      <h1>Recipes worth <span>keeping.</span></h1>
      <p class="app-intro">Collect the dishes you love and keep every ingredient close at hand.</p>
    </header>

    <section class="entry-panel" aria-labelledby="formHeading">
      <div class="section-heading">
        <div>
          <p class="eyebrow">ADD TO YOUR COLLECTION</p>
          <h2 id="formHeading">New recipe</h2>
        </div>
        <span class="heading-mark" aria-hidden="true">+</span>
      </div>
      <form id="recipeEntryForm">
        <label for="recipeTitle">Recipe title</label>
        <input type="text" id="recipeTitle" name="title" placeholder="e.g. Sunday tomato pasta" required maxlength="100" />

        <label for="ingredients">Ingredients <span class="label-hint">one per line</span></label>
        <textarea id="ingredients" name="ingredients" placeholder="400g pasta&#10;2 tbsp olive oil&#10;3 cloves garlic" required rows="4"></textarea>

        <label for="instructions">Instructions</label>
        <textarea id="instructions" name="instructions" placeholder="Write the steps to make this recipe..." required rows="5"></textarea>

        <p class="form-error" id="formError" role="alert" hidden></p>
        <button class="button button--primary" type="submit">Save recipe <span aria-hidden="true">↗</span></button>
      </form>
    </section>

    <section class="collection-panel" aria-labelledby="collectionHeading">
      <div class="collection-heading">
        <div>
          <p class="eyebrow">THE GOOD STUFF</p>
          <h2 id="collectionHeading">Your collection <span id="recipeCount" class="count-badge">0</span></h2>
        </div>
        <button id="clearRecipesButton" class="button button--quiet" type="button" disabled>Clear all</button>
      </div>
      <div id="recipeContainer" class="recipe-grid" aria-live="polite"></div>
    </section>
  </main>
`

function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Required app element was not found: ${selector}`)
  return element
}

const form = getElement<HTMLFormElement>('#recipeEntryForm')
const titleInput = getElement<HTMLInputElement>('#recipeTitle')
const ingredientsInput = getElement<HTMLTextAreaElement>('#ingredients')
const instructionsInput = getElement<HTMLTextAreaElement>('#instructions')
const recipeContainer = getElement<HTMLDivElement>('#recipeContainer')
const clearButton = getElement<HTMLButtonElement>('#clearRecipesButton')
const recipeCount = getElement<HTMLSpanElement>('#recipeCount')
const formError = getElement<HTMLParagraphElement>('#formError')

const collection = new RecipeCollection()

function showError(message: string): void {
  formError.textContent = message
  formError.hidden = false
}

function renderRecipes(): void {
  template.render(collection.getAll())
  recipeCount.textContent = String(collection.getAll().length)
  clearButton.disabled = collection.getAll().length === 0
}

const template = new RecipeTemplate(
  recipeContainer,
  (id) => {
    try {
      collection.toggleFavorite(id)
      renderRecipes()
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Could not update the favorite.')
    }
  },
  (id) => {
    try {
      collection.remove(id)
      renderRecipes()
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Could not delete the recipe.')
    }
  },
)

try {
  collection.load()
} catch (error) {
  console.error('Unable to load saved recipes.', error)
  showError(error instanceof Error ? error.message : 'Saved recipes could not be loaded.')
}
renderRecipes()

form.addEventListener('submit', (event) => {
  event.preventDefault()
  formError.hidden = true

  try {
    collection.add({
      title: titleInput.value,
      ingredients: ingredientsInput.value.split(/\r?\n/),
      instructions: instructionsInput.value,
    })
    form.reset()
    renderRecipes()
    titleInput.focus()
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Could not save the recipe.')
  }
})

clearButton.addEventListener('click', () => {
  if (!window.confirm('Clear every recipe in your collection? This cannot be undone.')) return

  try {
    collection.clear()
    renderRecipes()
    formError.hidden = true
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Could not clear the recipes.')
  }
})
