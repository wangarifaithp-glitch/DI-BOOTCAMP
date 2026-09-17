// Simple Library System in TypeScript

// Interface Book
export {};

interface Book {
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre?: string; // optional
}

// Class Library
class Library {
  protected books: Book[];

  constructor() {
    this.books = [];
  }

  public addBook(book: Book): void {
    this.books.push(book);
  }

  public getBookDetails(isbn: string): Book | undefined {
    return this.books.find((book) => book.isbn === isbn);
  }
}

// Class DigitalLibrary extends Library
class DigitalLibrary extends Library {
  readonly website: string;

  constructor(website: string) {
    super();
    this.website = website;
  }

  public listBooks(): string[] {
    return this.books.map((b) => b.title);
  }
}

// Demo
const digitalLibrary = new DigitalLibrary("https://mydigitallibrary.example");

digitalLibrary.addBook({
  title: "Clean Code",
  author: "Robert C. Martin",
  isbn: "978-0132350884",
  publishedYear: 2008,
  genre: "Software Engineering",
});

digitalLibrary.addBook({
  title: "The Pragmatic Programmer",
  author: "Andrew Hunt, David Thomas",
  isbn: "978-0201616224",
  publishedYear: 1999,
});

digitalLibrary.addBook({
  title: "Design Patterns",
  author: "Erich Gamma et al.",
  isbn: "978-0201633610",
  publishedYear: 1994,
  genre: "Software Engineering",
});

console.log("Library website:", digitalLibrary.website);

console.log("\n=== Book Details ===");
const details = digitalLibrary.getBookDetails("978-0132350884");
if (details) {
  console.log(`Title: ${details.title}`);
  console.log(`Author: ${details.author}`);
  console.log(`ISBN: ${details.isbn}`);
  console.log(`Published: ${details.publishedYear}`);
  if (details.genre) {
    console.log(`Genre: ${details.genre}`);
  }
}

console.log("\n=== All Book Titles ===");
const titles = digitalLibrary.listBooks();
titles.forEach((title, index) => {
  console.log(`${index + 1}. ${title}`);
});