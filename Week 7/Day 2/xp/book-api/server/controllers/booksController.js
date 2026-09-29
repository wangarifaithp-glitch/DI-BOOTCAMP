const booksModel = require('../models/booksModel');

function parseBookId(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1) return null;
  return Number(value);
}

function validateBook(body) {
  return body &&
    typeof body.title === 'string' && body.title.trim() &&
    typeof body.author === 'string' && body.author.trim() &&
    Number.isInteger(body.publishedYear);
}

function getAllBooks(req, res) {
  res.json({ books: booksModel.getAllBooks() });
}

function getBook(req, res) {
  const id = parseBookId(req.params.bookId);
  if (!id) return res.status(400).json({ message: 'Book ID must be a positive integer' });

  const book = booksModel.getBookById(id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.status(200).json(book);
}

function createBook(req, res) {
  if (!validateBook(req.body)) {
    return res.status(400).json({
      message: 'Title, author, and integer publishedYear are required'
    });
  }
  const book = booksModel.createBook({
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    publishedYear: req.body.publishedYear
  });
  res.status(201).json(book);
}

function updateBook(req, res) {
  const id = parseBookId(req.params.bookId);
  if (!id) return res.status(400).json({ message: 'Book ID must be a positive integer' });
  if (!validateBook(req.body)) {
    return res.status(400).json({
      message: 'Title, author, and integer publishedYear are required'
    });
  }

  const book = booksModel.updateBook(id, {
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    publishedYear: req.body.publishedYear
  });
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
}

function deleteBook(req, res) {
  const id = parseBookId(req.params.bookId);
  if (!id) return res.status(400).json({ message: 'Book ID must be a positive integer' });
  if (!booksModel.deleteBook(id)) return res.status(404).json({ message: 'Book not found' });
  res.status(204).send();
}

module.exports = { getAllBooks, getBook, createBook, updateBook, deleteBook };