import { RecipeItem, type RecipeItemData } from './RecipeItem'

const STORAGE_KEY = 'week-10-recipe-book'

function isRecipeData(value: unknown): value is RecipeItemData & { id: string } {
  if (!value || typeof value !== 'object') return false

  const recipe = value as Record<string, unknown>
  return (
    typeof recipe.id === 'string' &&
    typeof recipe.title === 'string' &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.every((ingredient) => typeof ingredient === 'string') &&
    typeof recipe.instructions === 'string' &&
    typeof recipe.isFavorite === 'boolean' &&
    (recipe.imageUrl === undefined || typeof recipe.imageUrl === 'string')
  )
}

export class RecipeCollection {
  private recipes: RecipeItem[]
  private readonly storage: Storage

  constructor(initialRecipes: readonly RecipeItem[] = [], storage: Storage = localStorage) {
    this.storage = storage
    const savedRecipes = this.loadRecipes()
    this.recipes = savedRecipes ?? [...initialRecipes]

    if (savedRecipes === null && initialRecipes.length > 0) {
      this.saveRecipes()
    }
  }

  getRecipes(): readonly RecipeItem[] {
    return this.recipes
  }

  addRecipe(recipe: RecipeItem): void {
    if (this.recipes.some((existing) => existing.id === recipe.id)) {
      throw new Error('A recipe with this identifier already exists.')
    }

    this.commit([...this.recipes, recipe])
  }

  removeRecipe(id: string): void {
    this.commit(this.recipes.filter((recipe) => recipe.id !== id))
  }

  toggleFavorite(id: string): void {
    const recipe = this.recipes.find((item) => item.id === id)
    if (!recipe) return

    recipe.toggleFavorite()
    this.saveRecipes()
  }

  clear(): void {
    this.commit([])
  }

  private commit(nextRecipes: RecipeItem[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(nextRecipes))
    this.recipes = nextRecipes
  }

  private saveRecipes(): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.recipes))
  }

  private loadRecipes(): RecipeItem[] | null {
    try {
      const storedRecipes = this.storage.getItem(STORAGE_KEY)
      if (!storedRecipes) return null

      const parsed: unknown = JSON.parse(storedRecipes)
      if (!Array.isArray(parsed)) return []

      return parsed.filter(isRecipeData).map((recipe) => new RecipeItem(recipe))
    } catch {
      return null
    }
  }
}