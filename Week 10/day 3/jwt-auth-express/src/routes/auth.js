const { randomUUID } = require('node:crypto')
const bcrypt = require('bcrypt')
const express = require('express')
const { rateLimit } = require('express-rate-limit')
const requireAuth = require('../middleware/require-auth')
const {
  clearAuthCookies,
  createTokenPair,
  hashToken,
  rotateRefreshToken,
  revokeRefreshToken,
  setAuthCookies,
  verifyRefreshToken,
} = require('../tokens')
const {
  createUser,
  findRefreshSession,
  findUserById,
  findUserByUsername,
  identityExists,
  publicUser,
} = require('../store')

const router = express.Router()
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
})
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many registration attempts. Try again later.' },
})
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many refresh attempts. Try again later.' },
})

function validRegistration({ username, email, password }) {
  return (
    typeof username === 'string' && /^[a-zA-Z0-9_]{3,24}$/.test(username.trim()) &&
    typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    typeof password === 'string' && password.length >= 12 &&
    /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)
  )
}

router.post('/register', registrationLimiter, async (request, response) => {
  const { username, email, password } = request.body || {}

  if (!validRegistration({ username, email, password })) {
    return response.status(400).json({
      error: 'Use a 3-24 character username, a valid email, and a 12+ character password with upper, lower, and numeric characters.',
    })
  }

  if (identityExists(username.trim(), email.trim())) {
    return response.status(409).json({ error: 'Username or email is unavailable.' })
  }

  const user = createUser({
    id: randomUUID(),
    username,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  })
  setAuthCookies(response, createTokenPair(user))

  return response.status(201).json({ user: publicUser(user) })
})

router.post('/login', loginLimiter, async (request, response) => {
  const { username, password } = request.body || {}

  if (typeof username !== 'string' || typeof password !== 'string') {
    return response.status(400).json({ error: 'Username and password are required.' })
  }

  const user = findUserByUsername(username.trim())
  const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false

  if (!passwordMatches) {
    return response.status(401).json({ error: 'Invalid username or password.' })
  }

  setAuthCookies(response, createTokenPair(user))
  return response.status(200).json({ user: publicUser(user) })
})

router.post('/refresh', refreshLimiter, (request, response) => {
  const token = request.cookies.refresh_token

  if (!token) {
    clearAuthCookies(response)
    return response.status(401).json({ error: 'Refresh token required.' })
  }

  try {
    const claims = verifyRefreshToken(token)
    const tokenHash = hashToken(token)
    const session = findRefreshSession(tokenHash)

    if (!session || !rotateRefreshToken(token, claims)) {
      clearAuthCookies(response)
      return response.status(401).json({ error: 'Refresh token is invalid, expired, or already used.' })
    }

    const user = findUserById(claims.sub)
    if (!user) {
      clearAuthCookies(response)
      return response.status(401).json({ error: 'Account no longer exists.' })
    }

    setAuthCookies(response, createTokenPair(user))
    return response.status(200).json({ user: publicUser(user) })
  } catch {
    clearAuthCookies(response)
    return response.status(401).json({ error: 'Refresh token is invalid or expired.' })
  }
})

router.post('/logout', (request, response) => {
  revokeRefreshToken(request.cookies.refresh_token)
  clearAuthCookies(response)
  return response.status(204).end()
})

router.get('/status', requireAuth, (request, response) => {
  return response.status(200).json({ authenticated: true, user: request.user })
})

module.exports = router