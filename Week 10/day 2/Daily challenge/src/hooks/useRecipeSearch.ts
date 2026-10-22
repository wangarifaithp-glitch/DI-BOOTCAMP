import { useEffect } from 'react'
import { fetchRecipes } from '../features/dataSlice'
import { useAppDispatch, useAppSelector } from '../store'

export function useRecipeSearch(query: string) {
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.recipes)

  useEffect(() => {
    const request = dispatch(fetchRecipes(query))
    return () => request.abort()
  }, [dispatch, query])

  return {
    ...data,
    retry: () => dispatch(fetchRecipes(query)),
  }
}