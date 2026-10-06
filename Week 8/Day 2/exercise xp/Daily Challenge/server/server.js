import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 3001

app.use(express.json())

app.get('/api/hello', (request, response) => {
  response.json({ message: 'Hello From Express' })
})

app.post('/api/world', (request, response) => {
  console.log('Received POST request body:', request.body)

  const { message } = request.body
  response.json({
    message: `I received your POST request. This is what you sent me: ${message}`,
  })
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Daily Challenge API listening at http://localhost:${port}`)
})
