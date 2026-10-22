import type { Key, ReactNode } from 'react'
import type { RequestStatus } from '../types/types'

interface DataFetcherProps<T> {
  data: readonly T[]
  status: RequestStatus
  error: string | null
  onRetry: () => unknown
  getKey: (item: T) => Key
  renderItem: (item: T) => ReactNode
  emptyMessage: string
}

function DataFetcher<T>({
  data,
  status,
  error,
  onRetry,
  getKey,
  renderItem,
  emptyMessage,
}: DataFetcherProps<T>) {
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="fetch-state loading-state" role="status">
        <span className="loading-mark" aria-hidden="true" />
        <p>Finding recipes...</p>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="fetch-state error-state" role="alert">
        <span className="error-mark" aria-hidden="true">!</span>
        <div><h3>We couldn't load recipes.</h3><p>{error ?? 'Check your connection and try again.'}</p></div>
        <button className="retry-button" type="button" onClick={onRetry}>Retry</button>
      </div>
    )
  }

  if (data.length === 0) {
    return <p className="fetch-state empty-state">{emptyMessage}</p>
  }

  return (
    <div className="recipe-grid" aria-live="polite">
      {data.map((item) => <div key={getKey(item)}>{renderItem(item)}</div>)}
    </div>
  )
}

export default DataFetcher