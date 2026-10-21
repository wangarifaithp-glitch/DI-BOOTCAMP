const { createHash, randomUUID } = require('node:crypto')
const jwt = require('jsonwebtoken')
const config = require('./config')
const { findRefreshSession, revokeRefreshSession, saveRefreshSession } = require('./store')

const baseCookieOptions = {
  httpOnly: true,
  secure: config.secureCookies,
  sameSite: 'strict',
  path: '/',
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

function createTokenPair(user) {
  const refreshId = randomUUID()
  const accessToken = jwt.sign(
    { type: 'access' },
    config.accessSecret,
    {
      subject: user.id,
      issuer: config.issuer,
      audience: config.audience,
      expiresIn: config.accessTtl,
    },
  )
  const refreshToken = jwt.sign(
    { type: 'refresh' },
    config.refreshSecret,
    {
      subject: user.id,
      jwtid: refreshId,
      issuer: config.issuer,
      audience: config.audience,
      expiresIn: config.refreshTtl,
    },
  )

  saveRefreshSession(hashToken(refreshToken), {
    userId: user.id,
    refreshId,
    expiresAt: Date.now() + config.refreshTtlMs,
  })

  return { accessToken, refreshToken }
}

function verifyAccessToken(token) {
  const claims = jwt.verify(token, config.accessSecret, {
    issuer: config.issuer,
    audience: config.audience,
  })

  if (claims.type !== 'access') throw new Error('Wrong token type')
  return claims
}

function verifyRefreshToken(token) {
  const claims = jwt.verify(token, config.refreshSecret, {
    issuer: config.issuer,
    audience: config.audience,
  })

  if (claims.type !== 'refresh' || !claims.jti) throw new Error('Invalid refresh token')
  return claims
}

function rotateRefreshToken(token, claims) {
  const tokenHash = hashToken(token)
  const session = findRefreshSession(tokenHash)

  if (
    !session ||
    session.userId !== claims.sub ||
    session.refreshId !== claims.jti ||
    session.expiresAt <= Date.now()
  ) {
    return false
  }

  revokeRefreshSession(tokenHash)
  return true
}

function revokeRefreshToken(token) {
  if (token) revokeRefreshSession(hashToken(token))
}

function setAuthCookies(response, tokens) {
  response.cookie('access_token', tokens.accessToken, {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,
  })
  response.cookie('refresh_token', tokens.refreshToken, {
    ...baseCookieOptions,
    maxAge: config.refreshTtlMs,
  })
}

function clearAuthCookies(response) {
  response.clearCookie('access_token', baseCookieOptions)
  response.clearCookie('refresh_token', baseCookieOptions)
}

module.exports = {
  clearAuthCookies,
  createTokenPair,
  hashToken,
  rotateRefreshToken,
  revokeRefreshToken,
  setAuthCookies,
  verifyAccessToken,
  verifyRefreshToken,
}