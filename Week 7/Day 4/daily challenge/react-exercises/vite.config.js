import react from '@vitejs/plugin-react'
import { defineConfig, transformWithOxc } from 'vite'

const jsxInJs = {
  name: 'jsx-in-js-files',
  enforce: 'pre',
  async transform(code, id) {
    if (!/[\\/]src[\\/].*\.js(?:\?.*)?$/.test(id)) return null

    const result = await transformWithOxc(code, id, {
      lang: 'jsx',
      jsx: { runtime: 'automatic' },
    })

    return { code: result.code, map: result.map }
  },
}

export default defineConfig({
  plugins: [jsxInJs, react()],
  optimizeDeps: {
    noDiscovery: true,
    include: ['react', 'react-dom/client', 'react-responsive-carousel'],
  },
})
