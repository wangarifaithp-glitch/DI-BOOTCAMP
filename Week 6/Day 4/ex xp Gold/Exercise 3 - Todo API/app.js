const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;
let nextId = 1;
const todos = [];

app.use(express.json());

function findTodo(id) {
  return todos.find((todo) => todo.id === Number(id));
}

app.post('/api/todos', (req, res) => {
  const { title, completed = false } = req.body;
  if (typeof title !== 'string' || !title.trim() || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'A title and boolean completed value are required.' });
  }

  const todo = { id: nextId++, title: title.trim(), completed };
  todos.push(todo);
  res.status(201).json(todo);
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.get('/api/todos/:id', (req, res) => {
  const todo = findTodo(req.params.id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found.' });
  }
  res.json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const todo = findTodo(req.params.id);
  const { title, completed } = req.body;

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found.' });
  }
  if (typeof title !== 'string' || !title.trim() || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'A title and boolean completed value are required.' });
  }

  todo.title = title.trim();
  todo.completed = completed;
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex((todo) => todo.id === Number(req.params.id));
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found.' });
  }

  todos.splice(todoIndex, 1);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Todo API running on port ${PORT}`);
  });
}

module.exports = app;