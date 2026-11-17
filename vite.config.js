import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const GATEWAY = process.env.VITE_GATEWAY_URL || 'http://localhost:8081'

// Browser navigations (Accept: text/html) to paths like /recipe/42 are SPA routes and must
// be served by Vite, while fetch() calls to the same prefix go to the gateway.
const spaFallback = (req) => (req.headers.accept?.includes('text/html') ? '/index.html' : undefined)

const toGateway = (extra = {}) => ({ target: GATEWAY, changeOrigin: false, secure: false, ...extra })

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Keep the Host header (localhost) so session/CSRF cookies stay first-party.
    proxy: {
      '/api':    toGateway({ bypass: spaFallback }),
      '/recipe': toGateway({ bypass: spaFallback }),
      '/oauth2': toGateway(),
      '/logout': toGateway(),
    },
  },
})
