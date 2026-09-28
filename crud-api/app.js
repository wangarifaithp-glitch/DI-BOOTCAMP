const express = require('express');
const { fetchPosts } = require('./data/dataService');

const app = express();
const PORT = 5000;

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await fetchPosts();
    console.log('Posts successfully retrieved and sent as a response.');
    res.json(posts);
  } catch (error) {
    console.error('Unable to retrieve posts:', error.message);
    res.status(502).json({ message: 'Unable to retrieve posts.' });
  }
});

app.listen(PORT, () => {
  console.log(`CRUD API running on port ${PORT}`);
});
