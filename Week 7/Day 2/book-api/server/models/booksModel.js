const books = [
  { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937 },
  { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', publishedYear: 1813 },
  { id: 3, title: '1984', author: 'George Orwell', publishedYear: 1949 }
];

function getAllBooks() {
  return books;
}

function getBookById(id) {
  return books.find((book) => book.id === id);
}

function createBook(fields) {
  const book = {
    id: books.length ? Math.max(...books.map((item) => item.id)) + 1 : 1,
    ...fields
  };
  books.push(book);
  return book;
}

function updateBook(id, fields) {
  const book = getBookById(id);
  if (!book) return undefined;
  Object.assign(book, fields);
  return book;
}

function deleteBook(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };