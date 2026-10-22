export interface Recipe {
  id: number
  name: string
  image: string
  ingredients: string[]
  instructions: string[]
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface DataState<T> {
  items: T[]
  status: RequestStatus
  error: string | null
  currentRequestId?: string
}