import { RecipeItem, type RecipeInput } from './RecipeItem'

const STORAGE_KEY = 'recipe-book.recipes.v1'

interface StoredRecipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  isFavorite: boolean
}

function isStoredRecipe(value: unknown): value is StoredRecipe {
  if (typeof value !== 'object' || value === null) return false

  const recipe = value as Record<string, unknown>
  return (
    typeof recipe.id === 'string' &&
    typeof recipe.title === 'string' &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.every((ingredient) => typeof ingredient === 'string') &&
    typeof recipe.instructions === 'string' &&
    typeof recipe.isFavorite === 'boolean'
  )
}

export class RecipeCollection {
  private recipes: RecipeItem[] = []

  getAll(): readonly RecipeItem[] {
    return this.recipes
  }

  load(): void {
    const savedRecipes = localStorage.getItem(STORAGE_KEY)
    if (savedRecipes === null) return

    let parsed: unknown
    try {
      parsed = JSON.parse(savedRecipes)
    } catch (error) {
      throw new Error('Saved recipes could not be read because the data is invalid.', {
        cause: error,
      })
    }

    if (!Array.isArray(parsed) || !parsed.every(isStoredRecipe)) {
      throw new Error('Saved recipes could not be read because the data has an invalid format.')
    }

    this.recipes = parsed.map(
      (recipe) =>
        new RecipeItem(
          recipe.id,
          recipe.title,
          recipe.ingredients,
          recipe.instructions,
          recipe.isFavorite,
        ),
    )
  }

  add(input: RecipeInput): void {
    const recipe = RecipeItem.create(input)
    if (!recipe.title || !recipe.instructions || recipe.ingredients.length === 0) {
      throw new Error('A title, at least one ingredient, and instructions are required.')
    }

    this.recipes.unshift(recipe)
    this.save()
  }

  remove(id: string): void {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== id)
    this.save()
  }

  toggleFavorite(id: string): void {
    const recipe = this.recipes.find((item) => item.id === id)
    if (!recipe) return

    recipe.isFavorite = !recipe.isFavorite
    this.save()
  }

  clear(): void {
    this.recipes = []
    this.save()
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.recipes))
  }
}
