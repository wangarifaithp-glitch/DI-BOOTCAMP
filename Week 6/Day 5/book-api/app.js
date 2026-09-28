const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;
let nextId = 3;
const books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'David Thomas', publishedYear: 1999 },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', publishedYear: 2008 }
];

app.use(express.json());

function findBook(bookId) {
  return books.find((book) => book.id === Number(bookId));
}

function validateBook(body) {
  return typeof body.title === 'string'
    && body.title.trim()
    && typeof body.author === 'string'
    && body.author.trim()
    && Number.isInteger(body.publishedYear);
}

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/:bookId', (req, res) => {
  const book = findBook(req.params.bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  res.json(book);
});

app.post('/api/books', (req, res) => {
  if (!validateBook(req.body)) {
    return res.status(400).json({ message: 'Title, author, and integer publishedYear are required.' });
  }

  const book = {
    id: nextId++,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    publishedYear: req.body.publishedYear
  };
  books.push(book);
  res.status(201).json(book);
});

app.put('/api/books/:bookId', (req, res) => {
  const book = findBook(req.params.bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  if (!validateBook(req.body)) {
    return res.status(400).json({ message: 'Title, author, and integer publishedYear are required.' });
  }

  book.title = req.body.title.trim();
  book.author = req.body.author.trim();
  book.publishedYear = req.body.publishedYear;
  res.json(book);
});

app.delete('/api/books/:bookId', (req, res) => {
  const bookIndex = books.findIndex((book) => book.id === Number(req.params.bookId));
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  books.splice(bookIndex, 1);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.body) {
    return res.status(400).json({ message: 'Request body must contain valid JSON.' });
  }
  console.error(error);
  res.status(500).json({ message: 'Internal server error.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Book API running on port ${PORT}`);
  });
}

module.exports = app;