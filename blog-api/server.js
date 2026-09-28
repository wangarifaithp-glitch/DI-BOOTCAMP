const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let nextId = 3;
const posts = [
  {
    id: 1,
    title: 'Welcome to the blog',
    content: 'This is the first post.'
  },
  {
    id: 2,
    title: 'Building a REST API',
    content: 'Express makes it straightforward to build RESTful APIs.'
  }
];

function findPost(postId) {
  return posts.find((post) => post.id === Number(postId));
}

function isValidPostId(postId) {
  return /^\d+$/.test(postId);
}

function validatePostFields(body) {
  return body &&
    typeof body.title === 'string' &&
    body.title.trim() &&
    typeof body.content === 'string' &&
    body.content.trim();
}

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.get('/posts/:id', (req, res) => {
  if (!isValidPostId(req.params.id)) {
    return res.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  res.json(post);
});

app.post('/posts', (req, res) => {
  if (!validatePostFields(req.body)) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const newPost = {
    id: nextId++,
    title: req.body.title.trim(),
    content: req.body.content.trim()
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

app.put('/posts/:id', (req, res) => {
  if (!isValidPostId(req.params.id)) {
    return res.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  if (!validatePostFields(req.body)) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  post.title = req.body.title.trim();
  post.content = req.body.content.trim();
  res.json(post);
});

app.delete('/posts/:id', (req, res) => {
  if (!isValidPostId(req.params.id)) {
    return res.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  const postIndex = posts.findIndex((post) => post.id === Number(req.params.id));
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  posts.splice(postIndex, 1);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Blog API listening on port ${PORT}`);
});
