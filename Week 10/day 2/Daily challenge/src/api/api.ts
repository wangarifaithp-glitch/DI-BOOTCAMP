import type { Recipe } from '../types/types'

interface RecipeApiResponse {
  recipes?: unknown
}

function isRecipe(value: unknown): value is Recipe {
  if (!value || typeof value !== 'object') return false

  const recipe = value as Record<string, unknown>
  return (
    typeof recipe.id === 'number' &&
    typeof recipe.name === 'string' &&
    typeof recipe.image === 'string' &&
    Array.isArray(recipe.ingredients) && recipe.ingredients.every((item) => typeof item === 'string') &&
    Array.isArray(recipe.instructions) && recipe.instructions.every((item) => typeof item === 'string') &&
    typeof recipe.prepTimeMinutes === 'number' &&
    typeof recipe.cookTimeMinutes === 'number' &&
    typeof recipe.servings === 'number'
  )
}

export async function getRecipes(query: string, signal?: AbortSignal): Promise<Recipe[]> {
  const endpoint = new URL('https://dummyjson.com/recipes/search')
  endpoint.searchParams.set('q', query)
  endpoint.searchParams.set('limit', '12')

  const response = await fetch(endpoint, { signal })
  if (!response.ok) {
    throw new Error(`Recipe service returned ${response.status}. Please try again.`)
  }

  const payload: RecipeApiResponse = await response.json()
  if (!Array.isArray(payload.recipes)) {
    throw new Error('The recipe service returned an unexpected response.')
  }

  const recipes = payload.recipes.filter(isRecipe)
  if (recipes.length !== payload.recipes.length) {
    throw new Error('The recipe service returned data in an unsupported format.')
  }

  return recipes
}