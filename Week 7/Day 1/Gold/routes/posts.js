const express = require('express');

const router = express.Router();
const posts = [];
let nextId = 1;

function getPostId(value) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validatePostFields(body) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
        return 'Title must be a non-empty string';
    }
    if (typeof body.content !== 'string' || body.content.trim() === '') {
        return 'Content must be a non-empty string';
    }
    return null;
}

router.get('/', (req, res) => {
    res.json(posts);
});

router.get('/:id', (req, res) => {
    const id = getPostId(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: 'Post ID must be a positive integer' });
    }

    const post = posts.find((item) => item.id === id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
});

router.post('/', (req, res) => {
    const validationError = validatePostFields(req.body || {});

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const post = {
        id: nextId++,
        title: req.body.title.trim(),
        content: req.body.content.trim(),
        timestamp: new Date().toISOString()
    };

    posts.push(post);
    res.status(201).json(post);
});

router.put('/:id', (req, res) => {
    const id = getPostId(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: 'Post ID must be a positive integer' });
    }

    const post = posts.find((item) => item.id === id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const validationError = validatePostFields(req.body || {});

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    post.title = req.body.title.trim();
    post.content = req.body.content.trim();
    res.json(post);
});

router.delete('/:id', (req, res) => {
    const id = getPostId(req.params.id);

    if (id === null) {
        return res.status(400).json({ error: 'Post ID must be a positive integer' });
    }

    const postIndex = posts.findIndex((item) => item.id === id);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    posts.splice(postIndex, 1);
    res.status(204).end();
});

module.exports = router;