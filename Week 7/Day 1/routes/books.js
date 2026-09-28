const express = require('express');

const router = express.Router();
const books = [];
let nextId = 1;

router.get('/', (req, res) => {
    res.json(books);
});

router.post('/', (req, res) => {
    const { title, author } = req.body;

    if (typeof title !== 'string' || title.trim() === '' ||
        typeof author !== 'string' || author.trim() === '') {
        return res.status(400).json({ error: 'Non-empty title and author are required' });
    }

    const book = {
        id: nextId++,
        title: title.trim(),
        author: author.trim()
    };

    books.push(book);
    res.status(201).json(book);
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const book = books.find((item) => item.id === id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author } = req.body;

    if (title === undefined && author === undefined) {
        return res.status(400).json({ error: 'Provide a title or author' });
    }
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    if (author !== undefined && (typeof author !== 'string' || author.trim() === '')) {
        return res.status(400).json({ error: 'Author must be a non-empty string' });
    }

    if (title !== undefined) {
        book.title = title.trim();
    }
    if (author !== undefined) {
        book.author = author.trim();
    }

    res.json(book);
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const bookIndex = books.findIndex((item) => item.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    res.status(204).end();
});

module.exports = router;