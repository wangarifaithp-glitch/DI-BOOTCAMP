# Simmer — Generic Recipe Data Fetcher

React + TypeScript + Redux Toolkit demo using a reusable generic `DataFetcher<T>` component. Search for a dish or ingredient to fetch recipe data, then expand a card to view its instructions.

## Run in Windows PowerShell

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite. Verify a production build with:

```powershell
npm.cmd run build
```

The challenge mentions Spoonacular, which requires a RapidAPI key. This demo uses TheMealDB's public recipe search endpoint instead, so it can run without credentials. The API implementation is isolated in `src/api/api.ts`.
