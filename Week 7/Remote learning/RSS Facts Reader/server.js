const path = require('node:path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Parser = require('rss-parser')

const app = express()
const parser = new Parser()
const feedUrl = 'https://thefactfile.org/feed/'
const pagesPath = path.join(__dirname, 'public', 'pages')

app.set('view engine', 'ejs')
app.set('views', pagesPath)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

function toPost(item) {
  const rawContent = item.contentSnippet || item.content || item['content:encoded'] || ''
  const content = String(rawContent).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const rawCategories = Array.isArray(item.categories) ? item.categories : [item.category]

  return {
    title: item.title || 'Untitled fact',
    link: item.link || feedUrl,
    pubDate: item.isoDate || item.pubDate || '',
    creator: item.creator || item.author || 'Unknown',
    categories: rawCategories.filter((category) => typeof category === 'string' && category.trim()),
    content: content || 'No content was provided for this post.',
  }
}

async function getPosts() {
  const feed = await parser.parseURL(feedUrl)
  return feed.items.map(toPost)
}

function getCategories(posts) {
  return [...new Set(posts.flatMap((post) => post.categories))].sort((a, b) => a.localeCompare(b))
}

function renderSearch(res, posts, allPosts, values = {}) {
  return res.render('search', {
    posts,
    categories: getCategories(allPosts),
    selectedTitle: values.selectedTitle || '',
    selectedCategory: values.selectedCategory || '',
    notice: values.notice || '',
  })
}

app.get('/', async (_req, res) => {
  const posts = await getPosts()
  res.render('index', { posts })
})

app.get('/search', async (_req, res) => {
  const allPosts = await getPosts()
  renderSearch(res, [], allPosts)
})

app.post('/search/title', async (req, res) => {
  const allPosts = await getPosts()
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
  const matches = title
    ? allPosts.filter((post) => post.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()))
    : []

  renderSearch(res, matches, allPosts, {
    selectedTitle: title,
    notice: title ? '' : 'Enter a title to search.',
  })
})

app.post('/search/category', async (req, res) => {
  const allPosts = await getPosts()
  const category = typeof req.body.category === 'string' ? req.body.category.trim() : ''
  const matches = category
    ? allPosts.filter((post) => post.categories.some(
      (postCategory) => postCategory.toLocaleLowerCase() === category.toLocaleLowerCase(),
    ))
    : []

  renderSearch(res, matches, allPosts, {
    selectedCategory: category,
    notice: category ? '' : 'Choose a category to search.',
  })
})

app.use((error, _req, res, _next) => {
  console.error('RSS reader request failed:', error)
  res.status(500).send('Unable to load the facts right now. Please try again later.')
})

if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`RSS Facts Reader is running at http://localhost:${port}`)
  })
}

module.exports = app
