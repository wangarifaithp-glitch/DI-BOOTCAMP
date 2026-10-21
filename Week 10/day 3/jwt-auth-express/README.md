# JWT Authentication with Express

## Checklist

- [x] Understand JWT headers, payloads, signatures, and common authentication uses.
- [x] Create an Express application with JSON and cookie middleware.
- [x] Register users with validation and bcrypt password hashing.
- [x] Sign short-lived access tokens and longer-lived refresh tokens.
- [x] Protect profile routes and return `401` when authentication is missing or invalid.
- [x] Store tokens in `httpOnly`, `sameSite` cookies; use `secure` cookies in production.
- [x] Rotate refresh tokens and revoke them on refresh or logout.
- [x] Rate-limit registration, login, and refresh endpoints.
- [x] Add an authenticated profile update route.
- [ ] Replace the in-memory user/session store with a persistent database.
- [ ] Add email confirmation and a production-ready recovery flow.

## 1. JWT Basics

A JSON Web Token is a signed token commonly used to carry claims between an application and an API. Its compact form has three Base64URL-encoded sections:

1. **Header**: token type and signing algorithm.
2. **Payload**: claims such as the subject (`sub`), token type, and expiration (`exp`). Do not put passwords or other secrets here; signing does not encrypt the payload.
3. **Signature**: verifies that the header and payload were signed with the expected key and have not been altered.

This sample uses separate secrets for access and refresh tokens. Access tokens expire after 15 minutes; refresh tokens expire after 7 days and are rotated on use.

## 2. Setup

Use a supported Node.js LTS release. From this directory, install the dependencies:

```powershell
npm install
```

Create a local environment file and generate two different secrets. In PowerShell, run the command twice:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64'))"
```

Create `.env` from `.env.example`, then fill in `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` with the generated values. Keep `.env` private and out of source control. The server refuses to start if either secret is missing or shorter than 32 characters.

Start the API and run the integration test:

```powershell
npm run dev
npm test
```

The server listens on `http://localhost:3000` by default. `GET /health` is a public health check.

## 3. Authentication Routes

### Register

`POST /auth/register`

```json
{
  "username": "reader_one",
  "email": "reader@example.com",
  "password": "LearningPass123"
}
```

Usernames must be 3-24 letters, numbers, or underscores. Passwords must be at least 12 characters and include an uppercase letter, a lowercase letter, and a number. Passwords are hashed with bcrypt before storage.

### Login

`POST /auth/login`

```json
{
  "username": "reader_one",
  "password": "LearningPass123"
}
```

Successful registration and login set the access and refresh cookies. The tokens are not returned in the JSON body.

### Protected profile

`GET /api/me` and `GET /auth/status` require a valid access-token cookie. `PATCH /api/me` accepts a display name:

```json
{
  "displayName": "Book Reader"
}
```

Unauthenticated or invalid requests receive `401`; malformed input receives `400`.

### Refresh and logout

`POST /auth/refresh` reads the refresh cookie, verifies it, invalidates that token, and issues a new pair. A refresh token can only be used once. `POST /auth/logout` revokes the current refresh token and clears both cookies.

## 4. Security Notes

- The cookies are `httpOnly` and `sameSite: strict`; `secure` is enabled when `NODE_ENV=production` or `COOKIE_SECURE=true`.
- Keep both signing keys secret, random, different from each other, and out of source control. Rotate them through a planned key-management process.
- Do not store sensitive information in JWT payloads. A JWT is signed, not encrypted.
- This is a learning API: user accounts and refresh-session hashes live in process memory and disappear when the server restarts. The refresh token itself is not stored, only its SHA-256 hash.
- The included rate limiter uses its default in-memory store. Use a shared store such as Redis when deploying multiple server instances.
- Cookie authentication needs CSRF defenses appropriate to the deployment. `SameSite` helps, but production cross-site clients may need CSRF tokens and strict origin checks.
- Use HTTPS in production, set `NODE_ENV=production`, and never log credentials, cookies, or tokens.

## 5. Further Exercises

- Replace the in-memory maps with a database and enforce unique username/email constraints there.
- Add email confirmation using one-time, expiring tokens stored as hashes.
- Add password reset and account recovery flows.
- Revoke all refresh sessions when a user changes their password.
- Add tests for duplicate accounts, invalid credentials, expiration, malformed JSON, and rate-limit responses.
- Add CSRF protection and origin validation for browser-based clients.

## Takeaway

JWTs can carry verifiable identity claims, but authentication still depends on careful password handling, token expiration and revocation, secure transport, cookie policy, validation, and persistent server-side session controls. Treat this project as a learning foundation, not a production-ready identity provider.