import { v4 as uuidv4 } from 'uuid'

export interface RecipeItemData {
  id?: string
  title: string
  ingredients: string[]
  instructions: string
  isFavorite?: boolean
  imageUrl?: string
}

export class RecipeItem {
  readonly id: string
  title: string
  ingredients: string[]
  instructions: string
  isFavorite: boolean
  imageUrl?: string

  constructor(data: RecipeItemData) {
    this.id = data.id ?? uuidv4()
    this.title = data.title.trim()
    this.ingredients = [...data.ingredients]
    this.instructions = data.instructions.trim()
    this.isFavorite = data.isFavorite ?? false
    this.imageUrl = data.imageUrl
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite
  }
}