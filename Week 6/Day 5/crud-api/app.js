const express = require('express');
const { fetchPosts } = require('./data/dataService');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await fetchPosts();
    console.log('Posts successfully retrieved and sent as a response.');
    res.json(posts);
  } catch (error) {
    console.error('Unable to retrieve posts:', error.message);
    res.status(502).json({ message: 'Unable to retrieve posts from the external API.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Axios CRUD API running on port ${PORT}`);
  });
}

module.exports = app;