# Fable — Collaborative Story Room

A React + TypeScript + Redux Toolkit storytelling prototype. Create and edit stories, add collaborators, comment and react, save and restore revisions, update your profile, and share a story link.

## Run in Windows PowerShell

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. Check the production bundle with:

```powershell
npm.cmd run build
```

## Local demo behavior

- Story, profile, comment, and version data persist in this browser's local storage.
- Changes sync between open tabs using `BroadcastChannel` (with storage-event fallback).
- Use the profile selector to switch between sample writers and test shared-story views.
- Share links select a story using its `?story=` query parameter.

This is a front-end learning prototype, not a deployed collaborative service. Profile switching is a demo convenience, not authentication. It does not connect to PostgreSQL, JWT login, file/avatar uploads, or a hosted WebSocket server. Changes sync only between tabs on this browser profile. Add a secured backend and real-time service before using it with multiple people or private stories.
