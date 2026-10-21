const usersById = new Map()
const userIdByUsername = new Map()
const userIdByEmail = new Map()
const refreshSessions = new Map()

function publicUser(user) {
  if (!user) return null

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
  }
}

function findUserById(id) {
  return usersById.get(id) || null
}

function findUserByUsername(username) {
  const id = userIdByUsername.get(username.toLowerCase())
  return id ? findUserById(id) : null
}

function identityExists(username, email) {
  return userIdByUsername.has(username.toLowerCase()) || userIdByEmail.has(email.toLowerCase())
}

function createUser({ id, username, email, passwordHash }) {
  const user = {
    id,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    displayName: username.trim(),
    passwordHash,
  }

  usersById.set(user.id, user)
  userIdByUsername.set(user.username.toLowerCase(), user.id)
  userIdByEmail.set(user.email, user.id)
  return user
}

function updateDisplayName(id, displayName) {
  const user = findUserById(id)
  if (!user) return null

  user.displayName = displayName
  return user
}

function saveRefreshSession(tokenHash, session) {
  refreshSessions.set(tokenHash, session)
}

function findRefreshSession(tokenHash) {
  return refreshSessions.get(tokenHash) || null
}

function revokeRefreshSession(tokenHash) {
  return refreshSessions.delete(tokenHash)
}

function clearStore() {
  usersById.clear()
  userIdByUsername.clear()
  userIdByEmail.clear()
  refreshSessions.clear()
}

module.exports = {
  clearStore,
  createUser,
  findRefreshSession,
  findUserById,
  findUserByUsername,
  identityExists,
  publicUser,
  revokeRefreshSession,
  saveRefreshSession,
  updateDisplayName,
}