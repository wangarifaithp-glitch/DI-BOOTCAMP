const express = require('express')
const { rateLimit } = require('express-rate-limit')
const { createHash, randomBytes } = require('node:crypto')
const nodemailer = require('nodemailer')
const { pool } = require('../db')
const {
  clearAuthCookie,
  hashPassword,
  requireAuth,
  setAuthCookie,
  signToken,
  passwordRuleMessage,
  validatePassword,
  verifyPassword,
} = require('../auth')

const router = express.Router()
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please wait and try again.' },
})
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many recovery requests. Please wait and try again.' },
})

function publicUser(row) {
  return {
    id: Number(row.id),
    email: row.email,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
  }
}

router.post('/register', authLimiter, async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const displayName = typeof req.body.displayName === 'string' ? req.body.displayName.trim() : ''
  const password = typeof req.body.password === 'string' ? req.body.password : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Enter a valid email address.' })
  }
  if (displayName.length < 2 || displayName.length > 40) {
    return res.status(400).json({ error: 'Display name must be 2 to 40 characters.' })
  }
  if (!validatePassword(password)) return res.status(400).json({ error: passwordRuleMessage })

  const passwordHash = await hashPassword(password)
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING *',
      [email, passwordHash, displayName],
    )
    const user = publicUser(rows[0])
    setAuthCookie(res, signToken(rows[0]))
    return res.status(201).json({ user })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with that email already exists.' })
    throw error
  }
})

router.post('/login', authLimiter, async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = typeof req.body.password === 'string' ? req.body.password : ''
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  if (!rows[0] || !(await verifyPassword(password, rows[0].password_hash))) {
    return res.status(401).json({ error: 'Email or password is incorrect.' })
  }

  setAuthCookie(res, signToken(rows[0]))
  return res.json({ user: publicUser(rows[0]) })
})

router.post('/forgot-password', resetLimiter, async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const genericMessage = 'If an account exists for that email, password recovery instructions are on the way.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.json({ message: genericMessage })
  }

  const { rows } = await pool.query('SELECT id, email FROM users WHERE email = $1', [email])
  if (!rows[0]) return res.json({ message: genericMessage })

  const token = randomBytes(32).toString('base64url')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1 OR expires_at < NOW()', [rows[0].id])
  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '30 minutes')`,
    [rows[0].id, tokenHash],
  )

  const clientOrigin = (process.env.CLIENT_ORIGIN || 'http://localhost:5174').replace(/\/+$/, '')
  const resetUrl = `${clientOrigin}/?reset=${encodeURIComponent(token)}`
  const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM)
  const partialSmtpConfig = Boolean(
    process.env.SMTP_HOST || process.env.SMTP_PORT || process.env.SMTP_USER
      || process.env.SMTP_PASSWORD || process.env.SMTP_FROM,
  ) && !hasSmtpConfig
  if (partialSmtpConfig) {
    await pool.query('DELETE FROM password_reset_tokens WHERE token_hash = $1', [tokenHash])
    return res.status(503).json({ error: 'Password recovery email is not fully configured. Contact the site administrator.' })
  }
  if (hasSmtpConfig) {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD || '' }
        : undefined,
    })
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: rows[0].email,
      subject: 'Reset your Story Circle password',
      text: `This link expires in 30 minutes. If you did not request this, ignore this email.\n\n${resetUrl}`,
      html: `<p>This link expires in 30 minutes. If you did not request this, ignore this email.</p><p><a href="${resetUrl}">Reset your Story Circle password</a></p>`,
    })
    return res.json({ message: genericMessage })
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.json({ message: genericMessage, resetUrl })
  }

  await pool.query('DELETE FROM password_reset_tokens WHERE token_hash = $1', [tokenHash])
  return res.status(503).json({ error: 'Password recovery email is not configured. Contact the site administrator.' })
})

router.post('/reset-password', resetLimiter, async (req, res) => {
  const token = typeof req.body.token === 'string' ? req.body.token : ''
  const password = typeof req.body.password === 'string' ? req.body.password : ''
  if (!token || token.length > 128) return res.status(400).json({ error: 'This password reset link is invalid or expired.' })
  if (!validatePassword(password)) return res.status(400).json({ error: passwordRuleMessage })

  const tokenHash = createHash('sha256').update(token).digest('hex')
  const passwordHash = await hashPassword(password)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows: tokens } = await client.query(
      `SELECT id, user_id FROM password_reset_tokens
       WHERE token_hash = $1 AND expires_at > NOW()
       FOR UPDATE`,
      [tokenHash],
    )
    if (!tokens[0]) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: 'This password reset link is invalid or expired.' })
    }
    await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, tokens[0].user_id])
    await client.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [tokens[0].user_id])
    await client.query('COMMIT')
    clearAuthCookie(res)
    return res.json({ message: 'Your password has been reset. Sign in with your new password.' })
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
})

router.post('/logout', (_req, res) => {
  clearAuthCookie(res)
  res.status(204).end()
})

router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, email, display_name, bio, avatar_url FROM users WHERE id = $1',
    [req.user.id],
  )
  if (!rows[0]) return res.status(401).json({ error: 'Account not found.' })
  return res.json({ user: publicUser(rows[0]) })
})

router.patch('/me', requireAuth, async (req, res) => {
  const displayName = typeof req.body.displayName === 'string' ? req.body.displayName.trim() : ''
  const bio = typeof req.body.bio === 'string' ? req.body.bio.trim() : ''
  const avatarUrl = typeof req.body.avatarUrl === 'string' ? req.body.avatarUrl.trim() : ''
  if (displayName.length < 2 || displayName.length > 40) {
    return res.status(400).json({ error: 'Display name must be 2 to 40 characters.' })
  }
  if (bio.length > 280) return res.status(400).json({ error: 'Bio must be 280 characters or fewer.' })
  if (avatarUrl && !/^https?:\/\/.{1,500}$/i.test(avatarUrl)) {
    return res.status(400).json({ error: 'Avatar must be a valid http or https image URL.' })
  }

  const { rows } = await pool.query(
    `UPDATE users SET display_name = $1, bio = $2, avatar_url = $3
     WHERE id = $4 RETURNING id, email, display_name, bio, avatar_url`,
    [displayName, bio, avatarUrl, req.user.id],
  )
  return res.json({ user: publicUser(rows[0]) })
})

module.exports = router
