const express = require('express');
const { initializeDatabase, pool } = require('./server/config/db');
const userRoutes = require('./server/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error.code === '23505') {
    return res.status(409).json({ error: 'Username or email is already registered.' });
  }

  const status = error.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({
    error: status === 400 ? 'Invalid JSON request body.' : 'Internal server error.'
  });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`User API listening on port ${PORT}`);
    });
  })
  .catch(async (error) => {
    console.error('Unable to initialize the user database:', error.message);
    await pool.end();
    process.exitCode = 1;
  });