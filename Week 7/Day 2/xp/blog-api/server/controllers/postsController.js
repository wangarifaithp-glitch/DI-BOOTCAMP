const postModel = require('../models/postModel');

function parsePostId(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1) {
    return null;
  }
  return Number(value);
}

function validatePost(body) {
  return body &&
    typeof body.title === 'string' && body.title.trim() &&
    typeof body.content === 'string' && body.content.trim();
}

async function getAllPosts(req, res) {
  res.json(await postModel.getAllPosts());
}

async function getPost(req, res) {
  const id = parsePostId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  const post = await postModel.getPostById(id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }
  res.json(post);
}

async function createPost(req, res) {
  if (!validatePost(req.body)) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const post = await postModel.createPost(req.body.title.trim(), req.body.content.trim());
  res.status(201).json(post);
}

async function updatePost(req, res) {
  const id = parsePostId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Post ID must be a positive integer.' });
  }
  if (!validatePost(req.body)) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const post = await postModel.updatePost(id, req.body.title.trim(), req.body.content.trim());
  if (!post) {
    return res.status(404).json({ error: 'Post not found.' });
  }
  res.json(post);
}

async function deletePost(req, res) {
  const id = parsePostId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'Post ID must be a positive integer.' });
  }
  if (!await postModel.deletePost(id)) {
    return res.status(404).json({ error: 'Post not found.' });
  }
  res.status(204).send();
}

module.exports = { getAllPosts, getPost, createPost, updatePost, deletePost };