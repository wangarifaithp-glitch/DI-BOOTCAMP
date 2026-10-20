import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { authRouter } from './src/routes/auth.js'

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env

if (!JWT_ACCESS_SECRET || JWT_ACCESS_SECRET.length < 32) {
  throw new Error('JWT_ACCESS_SECRET must be configured with at least 32 characters.')
}

if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET.length < 32) {
  throw new Error('JWT_REFRESH_SECRET must be configured with at least 32 characters.')
}

const app = express()
const port = Number(process.env.PORT) || 3000

app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use(express.static('public'))

app.use((error, _request, response, _next) => {
  console.error('Unhandled application error:', error)
  response.status(500).json({ error: 'An unexpected server error occurred.' })
})

app.listen(port, '127.0.0.1', () => {
  console.log(`JWT learning demo running at http://127.0.0.1:${port}`)
  console.log('Demo data is stored in memory and will be cleared when the server stops.')
})
