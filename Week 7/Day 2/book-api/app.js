const express = require('express');
const { PORT } = require('./server/config/appConfig');
const booksRoutes = require('./server/routes/booksRoutes');

const app = express();

app.use(express.json());
app.use('/api/books', booksRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({
    message: status === 400 ? 'Invalid JSON request body' : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Book API running on port ${PORT}`);
});
