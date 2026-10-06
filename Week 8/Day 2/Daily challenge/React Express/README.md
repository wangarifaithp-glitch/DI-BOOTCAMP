# Week 8 Day 2: React + Express Challenge

The client and API server are kept in separate folders.

1. In one terminal, start the API:

   ```sh
   cd server
   npm install
   npm start
   ```

2. In another terminal, start the React client:

   ```sh
   cd client
   npm install
   npm run dev
   ```

The Vite development server proxies `/api` requests to the Express server on port 3001.
