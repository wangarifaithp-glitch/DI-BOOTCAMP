const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
let nextId = 3;
const data = [
  { id: 1, title: 'Learning Express', content: 'Express makes building APIs straightforward.' },
  { id: 2, title: 'REST Principles', content: 'Clear resources and HTTP methods make APIs predictable.' }
];

app.use(express.json());

function findPost(id) {
  return data.find((post) => post.id === Number(id));
}

app.get('/posts', (req, res) => {
  res.json(data);
});

app.get('/posts/:id', (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }
  res.json(post);
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  if (typeof title !== 'string' || !title.trim() || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  const post = { id: nextId++, title: title.trim(), content: content.trim() };
  data.push(post);
  res.status(201).json(post);
});

app.put('/posts/:id', (req, res) => {
  const post = findPost(req.params.id);
  const { title, content } = req.body;
  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }
  if (typeof title !== 'string' || !title.trim() || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  post.title = title.trim();
  post.content = content.trim();
  res.json(post);
});

app.delete('/posts/:id', (req, res) => {
  const postIndex = data.findIndex((item) => item.id === Number(req.params.id));
  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  data.splice(postIndex, 1);
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
    console.log(`Blog API running on port ${PORT}`);
  });
}

module.exports = app;