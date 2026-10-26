const assert = require('node:assert/strict')
const test = require('node:test')

process.env.JWT_SECRET = 'test-only-secret-with-at-least-thirty-two-characters'

const jwt = require('jsonwebtoken')
const {
  hashPassword,
  requireAuth,
  setAuthCookie,
  signToken,
  validatePassword,
  verifyPassword,
} = require('./auth')

test('passwords are stored as hashes and can be verified', async () => {
  const password = 'StoryCircle123!'
  const hash = await hashPassword(password)

  assert.notEqual(hash, password)
  assert.equal(await verifyPassword(password, hash), true)
  assert.equal(await verifyPassword('not-the-password', hash), false)
})

test('strong passwords require length, uppercase, lowercase, number, and symbol', () => {
  assert.equal(validatePassword('BrightStory24!'), true)
  assert.equal(validatePassword('storycircle123!'), false)
  assert.equal(validatePassword('STORYCIRCLE123!'), false)
  assert.equal(validatePassword('BrightStory!!'), false)
  assert.equal(validatePassword('BrightStory24'), false)
  assert.equal(validatePassword('Short1!'), false)
  assert.equal(validatePassword(`BrightStory24!${'x'.repeat(60)}`), false)
})

test('signed access tokens contain an account id, not a password', () => {
  const token = signToken({
    id: 42,
    email: 'writer@example.com',
    display_name: 'Story Writer',
    password_hash: 'must-not-be-in-the-token',
  })
  const claims = jwt.verify(token, process.env.JWT_SECRET)

  assert.equal(claims.sub, '42')
  assert.equal(claims.email, 'writer@example.com')
  assert.equal('password_hash' in claims, false)
})

test('authentication middleware rejects missing cookies', () => {
  let nextCalled = false
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
  }

  requireAuth({ cookies: {} }, response, () => { nextCalled = true })

  assert.equal(response.statusCode, 401)
  assert.equal(response.body.error, 'Please sign in to continue.')
  assert.equal(nextCalled, false)
})

test('authentication middleware accepts a valid signed cookie', () => {
  const token = signToken({ id: 7, email: 'writer@example.com', display_name: 'Writer' })
  const request = { cookies: { story_circle_token: token } }
  let nextCalled = false

  requireAuth(request, {}, () => { nextCalled = true })

  assert.equal(nextCalled, true)
  assert.deepEqual(request.user, { id: 7, email: 'writer@example.com' })
})

test('authentication cookies are HTTP-only and same-site', () => {
  const response = {
    cookie(name, value, options) {
      this.cookieOptions = { name, value, ...options }
    },
  }

  setAuthCookie(response, 'signed-token')

  assert.equal(response.cookieOptions.name, 'story_circle_token')
  assert.equal(response.cookieOptions.httpOnly, true)
  assert.equal(response.cookieOptions.sameSite, 'lax')
  assert.equal(response.cookieOptions.secure, false)
})
