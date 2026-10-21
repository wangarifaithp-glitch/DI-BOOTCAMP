const assert = require('node:assert/strict')
const { once } = require('node:events')
const { test } = require('node:test')

process.env.JWT_ACCESS_SECRET = 'test-access-secret-that-is-longer-than-32-characters'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-that-is-longer-than-32-characters'
process.env.COOKIE_SECURE = 'false'

const app = require('../src/app')
const { clearStore } = require('../src/store')

function getCookieHeader(response) {
  const setCookies = response.headers.getSetCookie()
  return setCookies.map((cookie) => cookie.split(';', 1)[0]).join('; ')
}

test('register, protect profile, rotate refresh tokens, logout, and login', async () => {
  clearStore()
  const server = app.listen(0)
  await once(server, 'listening')
  const address = server.address()
  const origin = `http://127.0.0.1:${address.port}`

  try {
    const invalidRegistration = await fetch(`${origin}/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'reader', email: 'reader@example.com', password: 'short' }),
    })
    assert.equal(invalidRegistration.status, 400)

    const registration = await fetch(`${origin}/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: 'reader_one',
        email: 'reader@example.com',
        password: 'LearningPass123',
      }),
    })
    assert.equal(registration.status, 201)
    const registeredUser = await registration.json()
    assert.equal(registeredUser.user.username, 'reader_one')
    assert.equal('passwordHash' in registeredUser.user, false)
    const registrationCookies = getCookieHeader(registration)
    assert.match(registrationCookies, /access_token=/)
    assert.match(registrationCookies, /refresh_token=/)

    const unauthorized = await fetch(`${origin}/api/me`)
    assert.equal(unauthorized.status, 401)

    const profileUpdate = await fetch(`${origin}/api/me`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: registrationCookies },
      body: JSON.stringify({ displayName: 'Book Reader' }),
    })
    assert.equal(profileUpdate.status, 200)
    assert.equal((await profileUpdate.json()).user.displayName, 'Book Reader')

    const refresh = await fetch(`${origin}/auth/refresh`, {
      method: 'POST',
      headers: { cookie: registrationCookies },
    })
    assert.equal(refresh.status, 200)
    const rotatedCookies = getCookieHeader(refresh)
    assert.notEqual(rotatedCookies, registrationCookies)

    const replay = await fetch(`${origin}/auth/refresh`, {
      method: 'POST',
      headers: { cookie: registrationCookies },
    })
    assert.equal(replay.status, 401)

    const logout = await fetch(`${origin}/auth/logout`, {
      method: 'POST',
      headers: { cookie: rotatedCookies },
    })
    assert.equal(logout.status, 204)

    const revokedRefresh = await fetch(`${origin}/auth/refresh`, {
      method: 'POST',
      headers: { cookie: rotatedCookies },
    })
    assert.equal(revokedRefresh.status, 401)

    const login = await fetch(`${origin}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'reader_one', password: 'LearningPass123' }),
    })
    assert.equal(login.status, 200)
    assert.match(getCookieHeader(login), /refresh_token=/)
  } finally {
    server.close()
    await once(server, 'close')
  }
})