require('dotenv').config()

const http = require('node:http')
const path = require('node:path')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const { Server } = require('socket.io')
const { getSocketUser } = require('./auth')
const { initializeDatabase, pool } = require('./db')
const authRoutes = require('./routes/auth')
const storyRoutes = require('./routes/stories')
const { seedPublicStories } = require('./seed-stories')

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be configured.')
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters.')
}

const app = express()
const server = http.createServer(app)
const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const io = new Server(server, {
  cors: { origin, credentials: true },
})

app.locals.io = io
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin, credentials: true }))
app.use(express.json({ limit: '110kb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/stories', storyRoutes)

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'dist')
  app.use(express.static(clientDist))
  app.get('*path', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}

app.use((error, _req, res, _next) => {
  console.error('Request failed:', error)
  if (res.headersSent) return
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

io.use((socket, next) => {
  try {
    socket.data.user = getSocketUser(socket)
    next()
  } catch {
    next(new Error('Authentication required.'))
  }
})

io.on('connection', (socket) => {
  socket.join(`user:${socket.data.user.id}`)
  socket.on('story:join', async (storyId) => {
    if (!Number.isSafeInteger(Number(storyId)) || Number(storyId) < 1) return
    try {
      const { rows } = await pool.query(
        `SELECT s.visibility, s.owner_id, u.display_name FROM stories s
         JOIN users u ON u.id = $2
         WHERE s.id = $1 AND (
           s.visibility = 'public' OR s.owner_id = $2 OR
           EXISTS (SELECT 1 FROM story_collaborators c WHERE c.story_id = s.id AND c.user_id = $2)
         )`,
        [storyId, socket.data.user.id],
      )
      if (!rows[0]) return

      const room = `story:${storyId}`
      socket.join(room)
      socket.data.storyId = String(storyId)
      socket.data.displayName = rows[0].display_name
      const peers = [...(io.sockets.adapter.rooms.get(room) || [])]
        .map((id) => io.sockets.sockets.get(id))
        .filter((peer) => peer && peer.id !== socket.id)
        .map((peer) => ({ id: peer.id, userId: peer.data.user.id, displayName: peer.data.displayName }))
      socket.emit('story:presence', peers)
      socket.to(room).emit('presence:joined', {
        id: socket.id,
        userId: socket.data.user.id,
        displayName: socket.data.displayName,
      })
    } catch (error) {
      console.error('Could not join story collaboration room:', error)
      socket.emit('story:error', { error: 'Could not join the live writing room.' })
    }
  })

  socket.on('story:leave', (storyId) => {
    const room = `story:${Number(storyId)}`
    socket.leave(room)
    if (socket.data.storyId === String(storyId)) delete socket.data.storyId
  })

  socket.on('story:cursor', (cursor) => {
    if (typeof socket.data.storyId !== 'string' || !cursor || typeof cursor !== 'object') return
    const position = Number(cursor.position)
    if (!Number.isSafeInteger(position) || position < 0) return
    socket.to(`story:${socket.data.storyId}`).emit('story:cursor', {
      userId: socket.data.user.id,
      displayName: socket.data.displayName,
      position,
    })
  })

  socket.on('disconnect', () => {
    if (socket.data.storyId) {
      socket.to(`story:${socket.data.storyId}`).emit('presence:left', { id: socket.id })
    }
  })
})

async function start() {
  await initializeDatabase()
  await seedPublicStories()
  const port = Number(process.env.PORT || 3000)
  server.listen(port, () => console.log(`Story Circle is running at http://localhost:${port}`))
}

if (require.main === module) {
  start().catch(async (error) => {
    console.error('Could not start Story Circle:', error.message)
    await pool.end()
    process.exitCode = 1
  })
}

module.exports = { app, io, server, start }
