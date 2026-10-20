# Key & Cookie — JWT Authentication Demo

A local Node.js and Express learning demo for registration, login, protected routes, HTTP-only JWT cookies, refresh-token rotation, logout/revocation, profile updates, password hashing, and rate limits.

## Run in Windows PowerShell

```powershell
npm.cmd install
node -e "const c=require('node:crypto'), f=require('node:fs'); f.writeFileSync('.env', 'PORT=3000\nJWT_ACCESS_SECRET='+c.randomBytes(48).toString('hex')+'\nJWT_REFRESH_SECRET='+c.randomBytes(48).toString('hex')+'\n', {flag:'wx'})"
npm.cmd run dev
```

Open **http://127.0.0.1:3000/**. Use the “Create account” tab to register. A valid username is 3–24 letters, numbers, or underscores; the password must be at least 12 characters.

## Demo behavior

- Passwords are hashed with bcryptjs before they are stored.
- Access tokens last 15 minutes; refresh tokens last 7 days.
- Both tokens are stored in `HttpOnly`, `SameSite=Strict` cookies.
- Refresh tokens are rotated on refresh and tracked by hash so logout revokes the current refresh token.
- Login, registration, and refresh endpoints are rate-limited.
- User accounts and refresh-token records are in memory and reset when the server stops.
- The server binds only to `127.0.0.1`. This teaching sample is not production-ready; use persistent storage, HTTPS, operational secret management, and a reviewed CSRF/session strategy before deploying.

To stop the dev server, press `Ctrl+C` in the terminal where it is running. Keep `.env` private; it is excluded by `.gitignore`.
