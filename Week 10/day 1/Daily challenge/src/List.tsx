import type { Key, ReactNode } from 'react'

interface ListProps<T> {
  items: readonly T[]
  getKey: (item: T) => Key
  renderItem: (item: T, index: number) => ReactNode
  emptyMessage?: string
}

function List<T>({ items, getKey, renderItem, emptyMessage = 'Nothing here yet.' }: ListProps<T>) {
  if (items.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  return (
    <ul className="book-list">
      {items.map((item, index) => (
        <li key={getKey(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  )
}

export default List