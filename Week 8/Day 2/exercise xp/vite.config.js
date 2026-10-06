import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/users': 'http://127.0.0.1:3001',
      '/api': 'http://127.0.0.1:3002',
    },
  },
})
