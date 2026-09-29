const express = require('express');
const path = require('path');
const { initializeDatabase, pool } = require('./server/config/db');
const quizRoutes = require('./server/routes/quizRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/quiz', quizRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({
    message: status === 400 ? 'Invalid JSON request body.' : 'Internal server error.'
  });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Quiz game running at http://localhost:${PORT}`);
    });
  })
  .catch(async (error) => {
    console.error('Unable to initialize the quiz database:', error.message);
    await pool.end();
    process.exitCode = 1;
  });