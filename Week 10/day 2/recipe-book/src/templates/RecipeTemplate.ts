import type { RecipeItem } from '../model/RecipeItem'

export type RecipeFilter = 'all' | 'favorites'

interface RecipeTemplateActions {
  onFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export class RecipeTemplate {
  private readonly container: HTMLElement
  private readonly actions: RecipeTemplateActions

  constructor(
    container: HTMLElement,
    actions: RecipeTemplateActions,
  ) {
    this.container = container
    this.actions = actions
  }

  render(recipes: readonly RecipeItem[], filter: RecipeFilter): void {
    this.container.replaceChildren()

    if (recipes.length === 0) {
      const emptyState = document.createElement('p')
      emptyState.className = 'empty-state'
      emptyState.textContent = filter === 'favorites'
        ? 'No favorites yet. Save a recipe with the star.'
        : 'Your recipe book is empty. Add your first favorite.'
      this.container.append(emptyState)
      return
    }

    const grid = document.createElement('div')
    grid.className = 'recipe-grid'
    recipes.forEach((recipe) => grid.append(this.createCard(recipe)))
    this.container.append(grid)
  }

  private createCard(recipe: RecipeItem): HTMLElement {
    const card = document.createElement('article')
    card.className = 'recipe-card'

    const cover = document.createElement('div')
    cover.className = 'recipe-cover'
    if (recipe.imageUrl) {
      const image = document.createElement('img')
      image.src = recipe.imageUrl
      image.alt = `${recipe.title} served on a plate`
      image.loading = 'lazy'
      image.addEventListener('error', () => cover.classList.add('image-unavailable'), { once: true })
      cover.append(image)
    }

    const coverIndex = document.createElement('span')
    coverIndex.className = 'cover-index'
    coverIndex.textContent = 'FROM THE KITCHEN'
    cover.append(coverIndex)

    const content = document.createElement('div')
    content.className = 'recipe-content'

    const headingRow = document.createElement('div')
    headingRow.className = 'recipe-heading-row'
    const title = document.createElement('h3')
    title.textContent = recipe.title
    const favoriteButton = document.createElement('button')
    favoriteButton.type = 'button'
    favoriteButton.className = 'favorite-button'
    favoriteButton.textContent = recipe.isFavorite ? '★' : '☆'
    favoriteButton.setAttribute('aria-label', recipe.isFavorite ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`)
    favoriteButton.setAttribute('aria-pressed', String(recipe.isFavorite))
    favoriteButton.addEventListener('click', () => this.actions.onFavorite(recipe.id))
    headingRow.append(title, favoriteButton)

    const ingredientCount = document.createElement('p')
    ingredientCount.className = 'ingredient-count'
    ingredientCount.textContent = `${recipe.ingredients.length} INGREDIENTS`

    const detailsButton = document.createElement('button')
    detailsButton.type = 'button'
    detailsButton.className = 'details-button'
    detailsButton.textContent = 'View recipe'

    const details = document.createElement('div')
    details.className = 'recipe-details'
    details.hidden = true

    const ingredientsHeading = document.createElement('h4')
    ingredientsHeading.textContent = 'Ingredients'
    const ingredientsList = document.createElement('ul')
    recipe.ingredients.forEach((ingredient) => {
      const item = document.createElement('li')
      item.textContent = ingredient
      ingredientsList.append(item)
    })

    const instructionsHeading = document.createElement('h4')
    instructionsHeading.textContent = 'Method'
    const instructions = document.createElement('p')
    instructions.textContent = recipe.instructions
    details.append(ingredientsHeading, ingredientsList, instructionsHeading, instructions)

    detailsButton.setAttribute('aria-expanded', 'false')
    detailsButton.addEventListener('click', () => {
      details.hidden = !details.hidden
      detailsButton.textContent = details.hidden ? 'View recipe' : 'Hide recipe'
      detailsButton.setAttribute('aria-expanded', String(!details.hidden))
    })

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.className = 'delete-button'
    deleteButton.textContent = 'Remove recipe'
    deleteButton.setAttribute('aria-label', `Delete ${recipe.title}`)
    deleteButton.addEventListener('click', () => this.actions.onDelete(recipe.id))

    content.append(headingRow, ingredientCount, detailsButton, details, deleteButton)
    card.append(cover, content)
    return card
  }
}