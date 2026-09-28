const axios = require('axios');

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchPosts() {
  const response = await axios.get(POSTS_URL);
  return response.data;
}

module.exports = { fetchPosts };