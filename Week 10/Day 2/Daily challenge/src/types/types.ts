export interface Recipe {
  id: string
  name: string
  category: string
  area: string
  instructions: string
  imageUrl: string
  sourceUrl: string | null
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
