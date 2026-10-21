const express = require('express')
const requireAuth = require('../middleware/require-auth')
const { updateDisplayName } = require('../store')

const router = express.Router()

router.use(requireAuth)

router.get('/me', (request, response) => {
  return response.status(200).json({ user: request.user })
})

router.patch('/me', (request, response) => {
  const displayName = typeof request.body?.displayName === 'string'
    ? request.body.displayName.trim()
    : ''

  if (displayName.length < 2 || displayName.length > 48) {
    return response.status(400).json({ error: 'Display name must be between 2 and 48 characters.' })
  }

  const updatedUser = updateDisplayName(request.user.id, displayName)
  return response.status(200).json({ user: {
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    displayName: updatedUser.displayName,
  } })
})

module.exports = router