import type { Recipe } from '../types/types'

interface MealDbRecipe {
  idMeal: string
  strMeal: string
  strCategory: string | null
  strArea: string | null
  strInstructions: string | null
  strMealThumb: string | null
  strSource: string | null
}

interface MealDbResponse {
  meals: MealDbRecipe[] | null
}

const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php'

export async function searchRecipes(query: string, signal?: AbortSignal): Promise<Recipe[]> {
  const url = new URL(API_URL)
  url.searchParams.set('s', query.trim())

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Recipe service returned ${response.status}. Please try again.`)
  }

  const payload: unknown = await response.json()
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('meals' in payload) ||
    !(payload.meals === null || Array.isArray(payload.meals))
  ) {
    throw new Error('The recipe service returned data in an unexpected format.')
  }

  const meals = (payload as MealDbResponse).meals ?? []
  return meals.map((meal) => {
    if (
      typeof meal.idMeal !== 'string' ||
      typeof meal.strMeal !== 'string' ||
      typeof meal.strMealThumb !== 'string'
    ) {
      throw new Error('The recipe service returned a recipe with missing information.')
    }

    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory ?? 'Recipe',
      area: meal.strArea ?? 'International',
      instructions: meal.strInstructions ?? '',
      imageUrl: meal.strMealThumb,
      sourceUrl: meal.strSource,
    }
  })
}
