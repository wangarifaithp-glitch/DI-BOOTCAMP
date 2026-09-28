const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const JSON_PLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com/posts';

app.use(express.json());

app.get('/api/posts', async (req, res) => {
  try {
    const response = await axios.get(JSON_PLACEHOLDER_URL);
    res.json(response.data);
  } catch (error) {
    res.status(502).json({ message: 'Unable to retrieve posts.' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const response = await axios.get(`${JSON_PLACEHOLDER_URL}/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status === 404 ? 404 : 502;
    res.status(status).json({ message: 'Unable to retrieve the requested post.' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const response = await axios.post(JSON_PLACEHOLDER_URL, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(502).json({ message: 'Unable to create the post.' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const response = await axios.put(`${JSON_PLACEHOLDER_URL}/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status === 404 ? 404 : 502;
    res.status(status).json({ message: 'Unable to update the requested post.' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    await axios.delete(`${JSON_PLACEHOLDER_URL}/${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    const status = error.response?.status === 404 ? 404 : 502;
    res.status(status).json({ message: 'Unable to delete the requested post.' });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && error.body) {
    return res.status(400).json({ message: 'Request body must contain valid JSON.' });
  }
  next(error);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Intermediate CRUD API running on port ${PORT}`);
  });
}

module.exports = app;