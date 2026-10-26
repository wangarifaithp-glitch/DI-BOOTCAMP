# Story Circle

A collaborative storytelling app for Week 10, Day 5. It uses React, TypeScript, Redux Toolkit, Express, PostgreSQL, JWT cookies, bcrypt, and Socket.IO.

## Features

- Account registration and sign-in with strong passwords, bcrypt hashes, and HTTP-only JWT cookies.
- Password suggestions, a live strength guide, and single-use 30-minute password recovery links.
- A searchable library with 24 public sample stories from six fictional community writers.
- Create and edit stories, keep them private or make them public, and share a public story link.
- Invite registered writers by email to collaborate on a story.
- Autosave story edits, show live collaborators and cursor activity, and reject stale edits instead of silently overwriting them.
- Save and restore story versions.
- Add, edit, and delete comments; story owners can turn comments off.
- Customize your display name, bio, and avatar URL. Optional Cloudinary uploads are available with an unsigned upload preset.

## Requirements

- Node.js 20 or newer.
- PostgreSQL 14 or newer, with a database created for the app.

## Setup

From this folder:

```powershell
npm install
Copy-Item .env.example .env
```

Edit `.env` and set `JWT_SECRET` to a random secret of at least 32 characters. Keep `.env` private. The sample database URL is for the local development database, which starts on loopback port 5433:

```powershell
npm run db:local
npm run dev
```

Open <http://localhost:5174>. The development command runs the API on port 3105 and the Vite frontend on port 5174. The API also initializes the schema on startup.

The local database uses PostgreSQL 18 from `C:\Program Files\PostgreSQL\18\bin` by default. Set `PG_BIN` to your PostgreSQL `bin` directory if it is installed elsewhere. Its data stays in the ignored `.local-postgres` directory and is only bound to `127.0.0.1`. For an existing PostgreSQL database, set `DATABASE_URL` in `.env` and run `npm run db:init` instead.

For Cloudinary avatar uploads, configure `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` in `.env`. Use a Cloudinary unsigned preset with appropriate upload restrictions. If these values are absent, profile avatar URLs can still be entered manually.

New account passwords must be 12-72 characters and contain uppercase and lowercase letters, a number, and a symbol. The sign-up and password reset forms can suggest a random strong password. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` to deliver recovery emails. Without SMTP, development mode shows a one-time reset link in the browser; production requires SMTP and never returns reset links in the API response.

## Production build

```powershell
npm run build
$env:NODE_ENV = "production"
npm start
```

The production server serves the built frontend and API from the same origin. Set `CLIENT_ORIGIN` to your deployed frontend origin if serving the frontend separately. Set `DATABASE_SSL=true` when your hosted PostgreSQL provider requires TLS.

## Validation

```powershell
npm test
npm run lint
npm run build
```

This is a learning project, not a hardened production collaboration editor. Story updates use optimistic version checks rather than a CRDT/operational transform, and simultaneous edits may require reloading the latest version.
