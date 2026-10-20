import jwt from 'jsonwebtoken'
import { ACCESS_COOKIE } from '../config/tokens.js'
import { usersById } from '../data/users.js'

export function authenticate(request, response, next) {
  const token = request.cookies[ACCESS_COOKIE]
  if (!token) {
    response.status(401).json({ error: 'Please sign in to continue.' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      issuer: 'jwt-learning-demo',
      audience: 'jwt-learning-demo-client',
    })
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      response.status(401).json({ error: 'Your session is invalid. Please sign in again.' })
      return
    }

    const user = usersById.get(payload.sub)
    if (!user) {
      response.status(401).json({ error: 'Your session has expired. Please sign in again.' })
      return
    }

    request.user = user
    next()
  } catch {
    response.status(401).json({ error: 'Your session has expired. Please sign in again.' })
  }
}
