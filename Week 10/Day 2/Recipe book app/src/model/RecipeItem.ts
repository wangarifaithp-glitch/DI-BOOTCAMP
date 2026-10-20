export interface RecipeInput {
  title: string
  ingredients: string[]
  instructions: string
}

export class RecipeItem {
  public id: string
  public title: string
  public ingredients: string[]
  public instructions: string
  public isFavorite: boolean

  constructor(
    id: string,
    title: string,
    ingredients: string[],
    instructions: string,
    isFavorite = false,
  ) {
    this.id = id
    this.title = title
    this.ingredients = ingredients
    this.instructions = instructions
    this.isFavorite = isFavorite
  }

  static create(input: RecipeInput): RecipeItem {
    return new RecipeItem(
      crypto.randomUUID(),
      input.title.trim(),
      input.ingredients.map((ingredient) => ingredient.trim()).filter(Boolean),
      input.instructions.trim(),
    )
  }
}
