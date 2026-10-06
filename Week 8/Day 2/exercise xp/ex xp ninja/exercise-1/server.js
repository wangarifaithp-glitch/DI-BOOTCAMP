import express from 'express'

const app = express()
const users = [
  { id: 1, username: 'somebody' },
  { id: 2, username: 'somebody_else' },
]
const port = Number(process.env.PORT) || 3001

app.get('/users', (request, response) => {
  response.json(users)
})

app.listen(port, '127.0.0.1', () => {
  console.log(`Users API listening at http://localhost:${port}/users`)
})
