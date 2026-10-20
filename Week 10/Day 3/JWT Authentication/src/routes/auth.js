import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  ACCESS_COOKIE,
  ACCESS_TTL,
  ACCESS_TTL_MS,
  REFRESH_COOKIE,
  REFRESH_TTL,
  REFRESH_TTL_MS,
  cookieOptions,
} from '../config/tokens.js'
import {
  hashToken,
  normalizeUsername,
  refreshTokensByHash,
  userIdByUsername,
  usersById,
} from '../data/users.js'
import { authenticate } from '../middleware/authenticate.js'

export const authRouter = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait and try again.' },
})

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many refresh attempts. Please wait and try again.' },
})

function issueTokens(response, user) {
  const accessToken = jwt.sign(
    { username: user.username },
    process.env.JWT_ACCESS_SECRET,
    {
      subject: user.id,
      issuer: 'jwt-learning-demo',
      audience: 'jwt-learning-demo-client',
      expiresIn: ACCESS_TTL,
    },
  )
  const refreshToken = jwt.sign(
    {},
    process.env.JWT_REFRESH_SECRET,
    {
      subject: user.id,
      jwtid: randomUUID(),
      issuer: 'jwt-learning-demo',
      audience: 'jwt-learning-demo-client',
      expiresIn: REFRESH_TTL,
    },
  )

  refreshTokensByHash.set(hashToken(refreshToken), {
    userId: user.id,
    expiresAt: Date.now() + REFRESH_TTL_MS,
  })

  response.cookie(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_TTL_MS))
  response.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_TTL_MS))
}

function clearAuthCookies(response) {
  response.clearCookie(ACCESS_COOKIE, cookieOptions(undefined))
  response.clearCookie(REFRESH_COOKIE, cookieOptions(undefined))
}

function publicUser(user) {
  return { id: user.id, username: user.username }
}

authRouter.post('/register', authLimiter, async (request, response) => {
  const { username, password } = request.body ?? {}
  if (typeof username !== 'string' || typeof password !== 'string') {
    response.status(400).json({ error: 'Username and password are required.' })
    return
  }

  const cleanedUsername = username.trim()
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(cleanedUsername)) {
    response.status(400).json({ error: 'Username must be 3–24 characters: letters, numbers, or underscores.' })
    return
  }
  if (password.length < 12 || password.length > 128) {
    response.status(400).json({ error: 'Password must be between 12 and 128 characters.' })
    return
  }

  const usernameKey = normalizeUsername(cleanedUsername)
  if (userIdByUsername.has(usernameKey)) {
    response.status(409).json({ error: 'That username is already in use.' })
    return
  }

  const user = {
    id: randomUUID(),
    username: cleanedUsername,
    passwordHash: await bcrypt.hash(password, 12),
  }

  usersById.set(user.id, user)
  userIdByUsername.set(usernameKey, user.id)
  issueTokens(response, user)
  response.status(201).json({ user: publicUser(user) })
})

authRouter.post('/login', authLimiter, async (request, response) => {
  const { username, password } = request.body ?? {}
  if (typeof username !== 'string' || typeof password !== 'string') {
    response.status(400).json({ error: 'Username and password are required.' })
    return
  }

  const userId = userIdByUsername.get(normalizeUsername(username))
  const user = userId ? usersById.get(userId) : undefined
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    response.status(401).json({ error: 'Username or password is incorrect.' })
    return
  }

  issueTokens(response, user)
  response.json({ user: publicUser(user) })
})

authRouter.post('/refresh', refreshLimiter, (request, response) => {
  const token = request.cookies[REFRESH_COOKIE]
  if (!token) {
    response.status(401).json({ error: 'Your session has expired. Please sign in again.' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'jwt-learning-demo',
      audience: 'jwt-learning-demo-client',
    })
    const tokenHash = hashToken(token)
    const storedToken = refreshTokensByHash.get(tokenHash)
    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string' ||
      !storedToken ||
      storedToken.userId !== payload.sub ||
      storedToken.expiresAt <= Date.now()
    ) {
      refreshTokensByHash.delete(tokenHash)
      clearAuthCookies(response)
      response.status(401).json({ error: 'Your session has expired. Please sign in again.' })
      return
    }

    const user = usersById.get(payload.sub)
    if (!user) {
      refreshTokensByHash.delete(tokenHash)
      clearAuthCookies(response)
      response.status(401).json({ error: 'Your account is no longer available.' })
      return
    }

    refreshTokensByHash.delete(tokenHash)
    issueTokens(response, user)
    response.json({ user: publicUser(user) })
  } catch {
    clearAuthCookies(response)
    response.status(401).json({ error: 'Your session has expired. Please sign in again.' })
  }
})

authRouter.post('/logout', (request, response) => {
  const token = request.cookies[REFRESH_COOKIE]
  if (token) refreshTokensByHash.delete(hashToken(token))
  clearAuthCookies(response)
  response.status(204).end()
})

authRouter.get('/me', authenticate, (request, response) => {
  response.json({ user: publicUser(request.user) })
})

authRouter.patch('/profile', authenticate, (request, response) => {
  const { username } = request.body ?? {}
  if (typeof username !== 'string' || !/^[a-zA-Z0-9_]{3,24}$/.test(username.trim())) {
    response.status(400).json({ error: 'Username must be 3–24 characters: letters, numbers, or underscores.' })
    return
  }

  const newUsername = username.trim()
  const newKey = normalizeUsername(newUsername)
  const existingId = userIdByUsername.get(newKey)
  if (existingId && existingId !== request.user.id) {
    response.status(409).json({ error: 'That username is already in use.' })
    return
  }

  userIdByUsername.delete(normalizeUsername(request.user.username))
  request.user.username = newUsername
  userIdByUsername.set(newKey, request.user.id)
  response.json({ user: publicUser(request.user) })
})
