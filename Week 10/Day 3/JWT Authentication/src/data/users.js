import { createHash } from 'node:crypto'

export const usersById = new Map()
export const userIdByUsername = new Map()
export const refreshTokensByHash = new Map()

export function normalizeUsername(username) {
  return username.trim().toLowerCase()
}

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}
