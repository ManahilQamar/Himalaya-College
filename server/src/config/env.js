import 'dotenv/config';

// All configuration comes from environment variables. Nothing secret is hardcoded.
const whole = (name, fallback) => {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET,
  // Rate limits per visitor IP. A school or college often shares one IP address, so the general limit is generous.
  rateLimitGlobal: whole('RATE_LIMIT_GLOBAL', 3000), // all API requests per 15 minutes
  rateLimitForms: whole('RATE_LIMIT_FORMS', 10), // admission/contact submissions per hour
  rateLimitLogin: whole('RATE_LIMIT_LOGIN', 10), // FAILED admin sign-ins per 15 minutes
  // The public address of the website (used in sitemap.xml). Defaults to the first CLIENT_ORIGIN.
  publicSiteUrl: (process.env.PUBLIC_SITE_URL || '').trim().replace(/\/$/, ''),
  // 'lax' is right when the website and API share one domain (recommended). Use 'none' only if the API is on a different site.
  cookieSameSite: ['lax', 'strict', 'none'].includes(process.env.COOKIE_SAMESITE) ? process.env.COOKIE_SAMESITE : 'lax',
  // How many proxies sit in front of the API (used to read the real visitor IP for rate limits and the audit log).
  trustProxy: Number.isInteger(Number(process.env.TRUST_PROXY)) && process.env.TRUST_PROXY !== '' ? Number(process.env.TRUST_PROXY) : 1,
};
export const isProd = env.nodeEnv === 'production';
