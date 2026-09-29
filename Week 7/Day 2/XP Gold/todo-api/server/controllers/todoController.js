const todoModel = require('../models/todoModel');

function parseTodoId(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1) return null;
  return Number(value);
}

function isValidTitle(title) {
  return typeof title === 'string' && title.trim().length > 0;
}

async function getAllTodos(req, res) {
  res.json(await todoModel.getAllTodos());
}

async function getTodo(req, res) {
  const id = parseTodoId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Todo ID must be a positive integer.' });

  const todo = await todoModel.getTodoById(id);
  if (!todo) return res.status(404).json({ error: 'Todo not found.' });
  res.json(todo);
}

async function createTodo(req, res) {
  const { title, completed = false } = req.body || {};
  if (!isValidTitle(title) || typeof completed !== 'boolean') {
    return res.status(400).json({
      error: 'A non-empty title and an optional boolean completed value are required.'
    });
  }

  const todo = await todoModel.createTodo(title.trim(), completed);
  res.status(201).json(todo);
}

async function updateTodo(req, res) {
  const id = parseTodoId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Todo ID must be a positive integer.' });

  const { title, completed } = req.body || {};
  if (!isValidTitle(title) || typeof completed !== 'boolean') {
    return res.status(400).json({
      error: 'A non-empty title and boolean completed value are required.'
    });
  }

  const todo = await todoModel.updateTodo(id, title.trim(), completed);
  if (!todo) return res.status(404).json({ error: 'Todo not found.' });
  res.json(todo);
}

async function deleteTodo(req, res) {
  const id = parseTodoId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Todo ID must be a positive integer.' });
  if (!await todoModel.deleteTodo(id)) {
    return res.status(404).json({ error: 'Todo not found.' });
  }
  res.status(204).send();
}

module.exports = { getAllTodos, getTodo, createTodo, updateTodo, deleteTodo };