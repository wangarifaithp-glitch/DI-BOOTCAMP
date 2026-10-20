export const ACCESS_COOKIE = 'access_token'
export const REFRESH_COOKIE = 'refresh_token'
export const ACCESS_TTL_MS = 15 * 60 * 1000
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000
export const ACCESS_TTL = '15m'
export const REFRESH_TTL = '7d'

export function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  }
}
