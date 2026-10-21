const { clearAuthCookies, verifyAccessToken } = require('../tokens')
const { findUserById, publicUser } = require('../store')

function requireAuth(request, response, next) {
  const token = request.cookies.access_token

  if (!token) {
    return response.status(401).json({ error: 'Authentication required.' })
  }

  try {
    const claims = verifyAccessToken(token)
    const user = findUserById(claims.sub)

    if (!user) throw new Error('Account no longer exists')

    request.user = publicUser(user)
    return next()
  } catch {
    clearAuthCookies(response)
    return response.status(401).json({ error: 'Access token is invalid or expired.' })
  }
}

module.exports = requireAuth