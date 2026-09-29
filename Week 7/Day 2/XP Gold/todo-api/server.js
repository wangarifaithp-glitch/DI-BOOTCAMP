const express = require('express');
const { initializeDatabase, pool } = require('./server/config/db');
const todoRoutes = require('./server/routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/todos', todoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({
    error: status === 400 ? 'Invalid JSON request body.' : 'Internal server error.'
  });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Todo API listening on port ${PORT}`);
    });
  })
  .catch(async (error) => {
    console.error('Unable to initialize the todo database:', error.message);
    await pool.end();
    process.exitCode = 1;
  });