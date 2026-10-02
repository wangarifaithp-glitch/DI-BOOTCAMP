import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const dayFiveDirectory = fileURLToPath(new URL('../', import.meta.url))

export default defineConfig({
  server: {
    fs: {
      allow: [dayFiveDirectory],
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        voting: fileURLToPath(new URL('./voting.html', import.meta.url)),
      },
    },
  },
})