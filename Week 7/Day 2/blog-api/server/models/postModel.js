const { pool } = require('../config/db');

async function getAllPosts() {
  const result = await pool.query('SELECT id, title, content FROM posts ORDER BY id');
  return result.rows;
}

async function getPostById(id) {
  const result = await pool.query(
    'SELECT id, title, content FROM posts WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function createPost(title, content) {
  const result = await pool.query(
    'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id, title, content',
    [title, content]
  );
  return result.rows[0];
}

async function updatePost(id, title, content) {
  const result = await pool.query(
    'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING id, title, content',
    [title, content, id]
  );
  return result.rows[0];
}

async function deletePost(id) {
  const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };