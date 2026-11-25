import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';
import { HttpError, errorHandler, notFound } from './middleware/errors.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';

export function createApp({
  clientOrigins = env.clientOrigins,
  jwtSecret = env.jwtSecret,
  formLimit = env.rateLimitForms,
  globalLimit = env.rateLimitGlobal,
  loginLimit = env.rateLimitLogin,
  lockoutMax = 5,
  lockoutMs = 15 * 60 * 1000,
  trustProxy = env.trustProxy,
  siteUrl = env.publicSiteUrl || clientOrigins[0],
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy); // the real visitor IP, for rate limits and the audit log

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) =>
        !origin || clientOrigins.includes(origin) ? cb(null, true) : cb(new HttpError(403, 'Origin not allowed')),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true, // lets the admin session cookie travel from the website
      allowedHeaders: ['Content-Type', 'X-Requested-With'],
    })
  );
  // Public forms stay small (20kb); only the admin area may send larger content (100kb).
  const publicJson = express.json({ limit: '20kb' });
  const adminJson = express.json({ limit: '100kb' });
  app.use((req, res, next) => (req.path.startsWith('/api/admin') ? adminJson : publicJson)(req, res, next));
  app.use(cookieParser());
  app.use(mongoSanitize()); // strips $ and . operators from body/query/params

  app.use(
    '/api',
    rateLimit({ windowMs: 15 * 60 * 1000, limit: globalLimit, standardHeaders: 'draft-7', legacyHeaders: false })
  );
  app.use('/api', publicRoutes({ formLimit, siteUrl }));
  if (jwtSecret) {
    app.use('/api/admin', adminRoutes({ secret: jwtSecret, loginLimit, lockoutMax, lockoutMs }));
  } else {
    console.warn('JWT_SECRET is not set: the admin API is disabled.');
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
