const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const cookieName = 'story_circle_token'
const tokenLifetime = '12h'
const passwordRuleMessage = 'Use 12-72 characters with an uppercase letter, a lowercase letter, a number, and a symbol.'

function validatePassword(password) {
  if (typeof password !== 'string' || Buffer.byteLength(password, 'utf8') > 72) return false
  return password.length >= 12
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password)
    && /[^A-Za-z0-9]/.test(password)
}

function signToken(user) {
  return jwt.sign(
    { sub: String(user.id), email: user.email, displayName: user.display_name },
    process.env.JWT_SECRET,
    { expiresIn: tokenLifetime },
  )
}

function setAuthCookie(res, token) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 12 * 60 * 60 * 1000,
    path: '/',
  })
}

function clearAuthCookie(res) {
  res.clearCookie(cookieName, { httpOnly: true, sameSite: 'lax', path: '/' })
}

function requireAuth(req, res, next) {
  const token = req.cookies[cookieName]
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' })

  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: Number(claims.sub), email: claims.email }
    return next()
  } catch {
    clearAuthCookie(res)
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' })
  }
}

function getSocketUser(socket) {
  const cookies = socket.handshake.headers.cookie || ''
  const tokenCookie = cookies.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))
  if (!tokenCookie) throw new Error('Authentication required.')

  const token = decodeURIComponent(tokenCookie.slice(cookieName.length + 1))
  const claims = jwt.verify(token, process.env.JWT_SECRET)
  return { id: Number(claims.sub), email: claims.email }
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

module.exports = {
  clearAuthCookie,
  getSocketUser,
  hashPassword,
  passwordRuleMessage,
  requireAuth,
  setAuthCookie,
  signToken,
  validatePassword,
  verifyPassword,
}
