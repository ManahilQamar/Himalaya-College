import 'dotenv/config';

// All configuration comes from environment variables. Nothing secret is hardcoded.
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET,
  // 'lax' is right when the website and API share one domain (recommended). Use 'none' only if the API is on a different site.
  cookieSameSite: ['lax', 'strict', 'none'].includes(process.env.COOKIE_SAMESITE) ? process.env.COOKIE_SAMESITE : 'lax',
  // How many proxies sit in front of the API (used to read the real visitor IP for rate limits and the audit log).
  trustProxy: Number.isInteger(Number(process.env.TRUST_PROXY)) && process.env.TRUST_PROXY !== '' ? Number(process.env.TRUST_PROXY) : 1,
};
export const isProd = env.nodeEnv === 'production';
