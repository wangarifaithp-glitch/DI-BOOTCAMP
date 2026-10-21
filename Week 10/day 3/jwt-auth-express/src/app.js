require('./config')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const helmet = require('helmet')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(bodyParser.json({ limit: '10kb' }))
app.use(cookieParser())

app.get('/health', (request, response) => {
  return response.status(200).json({ status: 'ok' })
})

app.use('/auth', authRoutes)
app.use('/api', profileRoutes)

app.use((request, response) => {
  return response.status(404).json({ error: 'Route not found.' })
})

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error)

  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
    ? error.status
    : 500

  return response.status(status).json({
    error: status === 500 ? 'An unexpected server error occurred.' : 'Invalid request body.',
  })
})

module.exports = app