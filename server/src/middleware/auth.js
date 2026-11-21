import jwt from 'jsonwebtoken';
import { env, isProd } from '../config/env.js';
import Admin from '../models/Admin.js';
import { HttpError, asyncHandler } from './errors.js';

export const COOKIE = 'hdc_admin';
const MAX_AGE_MS = 8 * 60 * 60 * 1000;

// The session token lives in an httpOnly cookie, so page scripts can never read it.
const cookieOptions = () => ({
  httpOnly: true,
  secure: isProd || env.cookieSameSite === 'none', // https only in production
  sameSite: env.cookieSameSite,
  path: '/api/admin',
});

export function issueToken(res, admin, secret) {
  const token = jwt.sign({}, secret, { subject: String(admin.id), expiresIn: '8h', algorithm: 'HS256' });
  res.cookie(COOKIE, token, { ...cookieOptions(), maxAge: MAX_AGE_MS });
}
export const clearToken = (res) => res.clearCookie(COOKIE, cookieOptions());

// Cross-site forms cannot set custom headers, so requiring one blocks CSRF on state-changing requests.
export function csrfGuard(req, _res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('x-requested-with') !== 'XMLHttpRequest') return next(new HttpError(403, 'Missing request header'));
  return next();
}

export const requireAuth = (secret) =>
  asyncHandler(async (req, _res, next) => {
    const token = req.cookies?.[COOKIE];
    if (!token) throw new HttpError(401, 'Please sign in');
    let payload;
    try {
      payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    } catch {
      throw new HttpError(401, 'Your session has expired. Please sign in again');
    }
    const admin = await Admin.findById(payload.sub); // passwordHash is never selected here
    if (!admin) throw new HttpError(401, 'Please sign in');
    if (admin.passwordChangedAt && payload.iat < Math.floor(admin.passwordChangedAt.getTime() / 1000)) {
      throw new HttpError(401, 'Your password was changed. Please sign in again');
    }
    req.admin = admin;
    next();
  });
