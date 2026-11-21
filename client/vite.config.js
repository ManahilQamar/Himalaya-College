import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vercel.json is the single source of truth for the security headers.
// The local preview applies the very same headers, so a Content-Security-Policy problem shows up here, not in production.
const vercel = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'));
const securityHeaders = Object.fromEntries(
  vercel.headers.find((h) => h.source === '/(.*)').headers.map((h) => [h.key, h.value])
);

// The website calls /api on its own address and the dev/preview server forwards it to the API,
// exactly like the Vercel rewrite does in production. That keeps the admin cookie first-party.
const api = { '/api': { target: process.env.DEV_API_URL || 'http://localhost:5000' } };

export default defineConfig({
  plugins: [react()],
  build: {
    // Never inline fonts as data: URIs; the Content-Security-Policy only allows fonts from our own address.
    assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
  },
  server: { port: 5173, proxy: api },
  preview: { headers: securityHeaders, proxy: api },
});
