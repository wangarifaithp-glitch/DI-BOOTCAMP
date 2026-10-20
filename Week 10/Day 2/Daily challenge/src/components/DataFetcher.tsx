import { useEffect, useState, type ReactNode } from 'react'
import type { RequestStatus } from '../types/types'

interface DataFetcherProps<T> {
  query: string
  items: readonly T[]
  status: RequestStatus
  error: string | null
  onLoad: (query: string) => { abort: () => void }
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
}

export function DataFetcher<T>({
  query,
  items,
  status,
  error,
  onLoad,
  getKey,
  renderItem,
}: DataFetcherProps<T>) {
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!query.trim()) return
    const request = onLoad(query)
    return () => request.abort()
  }, [query, onLoad, retryCount])

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="state-panel" role="status">
        <span className="loader" aria-hidden="true" />
        <strong>Finding something delicious...</strong>
        <span>Fetching fresh recipes from the kitchen</span>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="state-panel state-panel--error" role="alert">
        <span className="state-icon" aria-hidden="true">!</span>
        <strong>We couldn’t load those recipes</strong>
        <span>{error ?? 'Please check your connection and try again.'}</span>
        <button className="retry-button" type="button" onClick={() => setRetryCount((count) => count + 1)}>
          Try again
        </button>
      </div>
    )
  }

  if (status === 'succeeded' && items.length === 0) {
    return (
      <div className="state-panel">
        <span className="state-icon" aria-hidden="true">⌕</span>
        <strong>No recipes found</strong>
        <span>Try another ingredient or recipe name.</span>
      </div>
    )
  }

  return (
    <>
      {status === 'loading' && <p className="refreshing" role="status">Updating recipes…</p>}
      <div className="recipe-grid">
        {items.map((item) => <div key={getKey(item)}>{renderItem(item)}</div>)}
      </div>
    </>
  )
}
