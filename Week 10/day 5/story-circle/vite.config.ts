import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3105',
      '/socket.io': { target: 'ws://localhost:3105', ws: true },
    },
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
})
