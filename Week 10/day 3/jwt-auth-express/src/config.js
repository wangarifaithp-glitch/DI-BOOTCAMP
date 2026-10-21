require('dotenv').config()

function readSecret(name) {
  const value = process.env[name]

  if (!value || value.length < 32) {
    throw new Error(`${name} must be set to a random value of at least 32 characters.`)
  }

  return value
}

module.exports = {
  port: Number(process.env.PORT || 3000),
  accessSecret: readSecret('JWT_ACCESS_SECRET'),
  refreshSecret: readSecret('JWT_REFRESH_SECRET'),
  secureCookies: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true',
  issuer: 'week-10-day-3-jwt-auth',
  audience: 'week-10-api',
  accessTtl: '15m',
  refreshTtl: '7d',
  refreshTtlMs: 7 * 24 * 60 * 60 * 1000,
}