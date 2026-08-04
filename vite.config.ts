import { defineConfig, loadEnv, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

// Dev-only plugin: serves the Vercel serverless /api/chat function from the
// Vite dev server, so the AI concierge works locally without `vercel dev`.
function chatApiDev() {
  return {
    name: 'chat-api-dev',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/chat', async (
        req: IncomingMessage & { body?: unknown },
        res: ServerResponse,
        next: () => void,
      ) => {
        if (req.method !== 'POST') return next()

        let body = ''
        req.on('data', (chunk: Buffer) => (body += chunk))
        req.on('end', async () => {
          try {
            req.body = body ? JSON.parse(body) : {}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { default: handler } = await import('./api/chat.js') as { default: (req: IncomingMessage, res: ServerResponse) => Promise<void> }
            await handler(req, res)
          } catch (err) {
            console.error('dev /api/chat error:', err)
            if (!res.headersSent) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Local dev chat handler failed' }))
            }
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (not just VITE_-prefixed) so GEMINI_API_KEY is available
  // to the server-side handler during local development.
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY

  return {
    plugins: [react(), tailwindcss(), chatApiDev()],
  }
})
