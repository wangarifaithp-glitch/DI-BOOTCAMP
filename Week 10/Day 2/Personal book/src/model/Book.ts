export interface Book {
  id: string
  title: string
  author: string
  category: string
  notes: string
  isRead: boolean
  dateAdded: string
}

export interface BookInput {
  title: string
  author: string
  category: string
  notes: string
}

export class BookItem implements Book {
  public readonly id: string
  public readonly title: string
  public readonly author: string
  public readonly category: string
  public readonly notes: string
  public readonly isRead: boolean
  public readonly dateAdded: string

  constructor(
    id: string,
    title: string,
    author: string,
    category: string,
    notes: string,
    isRead: boolean,
    dateAdded: string,
  ) {
    this.id = id
    this.title = title
    this.author = author
    this.category = category
    this.notes = notes
    this.isRead = isRead
    this.dateAdded = dateAdded
  }

  get readingStatus(): string {
    return this.isRead ? 'Read' : 'To read'
  }

  toJSON(): Book {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      category: this.category,
      notes: this.notes,
      isRead: this.isRead,
      dateAdded: this.dateAdded,
    }
  }

  static fromJSON(value: unknown): BookItem | null {
    if (typeof value !== 'object' || value === null) return null
    const book = value as Record<string, unknown>
    if (
      typeof book.id !== 'string' ||
      typeof book.title !== 'string' ||
      typeof book.author !== 'string' ||
      typeof book.category !== 'string' ||
      typeof book.notes !== 'string' ||
      typeof book.isRead !== 'boolean' ||
      typeof book.dateAdded !== 'string'
    ) {
      return null
    }

    return new BookItem(
      book.id,
      book.title,
      book.author,
      book.category,
      book.notes,
      book.isRead,
      book.dateAdded,
    )
  }
}
