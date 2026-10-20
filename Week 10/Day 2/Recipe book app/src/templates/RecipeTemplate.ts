import type { RecipeItem } from '../model/RecipeItem'

export class RecipeTemplate {
  private readonly container: HTMLElement
  private readonly onToggleFavorite: (id: string) => void
  private readonly onRemove: (id: string) => void

  constructor(
    container: HTMLElement,
    onToggleFavorite: (id: string) => void,
    onRemove: (id: string) => void,
  ) {
    this.container = container
    this.onToggleFavorite = onToggleFavorite
    this.onRemove = onRemove

    this.container.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const button = target.closest<HTMLButtonElement>('button[data-action]')
      if (!button) return

      const id = button.dataset.id
      if (!id) return

      if (button.dataset.action === 'favorite') this.onToggleFavorite(id)
      if (button.dataset.action === 'delete') this.onRemove(id)
    })
  }

  render(recipes: readonly RecipeItem[]): void {
    this.container.replaceChildren()

    if (recipes.length === 0) {
      const emptyMessage = document.createElement('p')
      emptyMessage.className = 'empty-state'
      emptyMessage.textContent = 'Your recipe book is empty. Add your first recipe to get started.'
      this.container.append(emptyMessage)
      return
    }

    for (const recipe of recipes) {
      this.container.append(this.createCard(recipe))
    }
  }

  private createCard(recipe: RecipeItem): HTMLElement {
    const card = document.createElement('article')
    card.className = 'recipe-card'

    const header = document.createElement('div')
    header.className = 'recipe-card__header'

    const title = document.createElement('h3')
    title.className = 'recipe-card__title'
    title.textContent = recipe.title

    const actions = document.createElement('div')
    actions.className = 'recipe-card__actions'

    const favoriteButton = document.createElement('button')
    favoriteButton.className = 'icon-button'
    favoriteButton.type = 'button'
    favoriteButton.dataset.action = 'favorite'
    favoriteButton.dataset.id = recipe.id
    favoriteButton.setAttribute('aria-label', recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites')
    favoriteButton.setAttribute('aria-pressed', String(recipe.isFavorite))
    favoriteButton.title = recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'
    favoriteButton.textContent = recipe.isFavorite ? '★' : '☆'

    const deleteButton = document.createElement('button')
    deleteButton.className = 'icon-button icon-button--delete'
    deleteButton.type = 'button'
    deleteButton.dataset.action = 'delete'
    deleteButton.dataset.id = recipe.id
    deleteButton.setAttribute('aria-label', `Delete ${recipe.title}`)
    deleteButton.title = 'Delete recipe'
    deleteButton.textContent = '×'

    actions.append(favoriteButton, deleteButton)
    header.append(title, actions)

    const details = document.createElement('details')
    details.className = 'recipe-card__details'

    const summary = document.createElement('summary')
    summary.textContent = 'View recipe'

    const ingredientsHeading = document.createElement('h4')
    ingredientsHeading.textContent = 'Ingredients'

    const ingredientsList = document.createElement('ul')
    for (const ingredient of recipe.ingredients) {
      const item = document.createElement('li')
      item.textContent = ingredient
      ingredientsList.append(item)
    }

    const instructionsHeading = document.createElement('h4')
    instructionsHeading.textContent = 'Instructions'

    const instructions = document.createElement('p')
    instructions.className = 'recipe-card__instructions'
    instructions.textContent = recipe.instructions

    details.append(summary, ingredientsHeading, ingredientsList, instructionsHeading, instructions)
    card.append(header, details)
    return card
  }
}
