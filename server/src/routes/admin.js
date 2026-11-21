import bcrypt from 'bcryptjs';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import AdmissionInterest from '../models/AdmissionInterest.js';
import Admin from '../models/Admin.js';
import AuditLog from '../models/AuditLog.js';
import Campus from '../models/Campus.js';
import CollegeInformation from '../models/CollegeInformation.js';
import ContactMessage from '../models/ContactMessage.js';
import Event from '../models/Event.js';
import Program from '../models/Program.js';
import Service from '../models/Service.js';
import { audit } from '../lib/audit.js';
import { passwordProblem } from '../lib/password.js';
import { clearToken, csrfGuard, issueToken, requireAuth } from '../middleware/auth.js';
import { HttpError, asyncHandler, parse } from '../middleware/errors.js';
import {
  campusSchema, collegeSections, eventSchema, interestStatusSchema, listQuerySchema, loginSchema,
  messageReadSchema, passwordChangeSchema, programSchema, serviceSchema,
} from '../validation/adminSchemas.js';
import crudRouter from './crud.js';

const OBJECT_ID = /^[a-f\d]{24}$/i;
const objectId = (id, label) => {
  if (!OBJECT_ID.test(id)) throw new HttpError(404, `${label} not found`);
  return id;
};

// Spreadsheet programs run cells that start with = + - @ as formulas, so neutralise those.
const csvCell = (v) => {
  let s = String(v ?? '').replace(/\r?\n/g, ' ');
  if (/^[=@\t\r]/.test(s) || /^[+-](?!\d)/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

let dummyHash;
const getDummyHash = () => (dummyHash ??= bcrypt.hashSync('not-a-real-password', 12));

export default function adminRoutes({ secret, loginLimit = 10, lockoutMax = 5, lockoutMs = 15 * 60 * 1000 }) {
  const router = Router();
  // Admin responses hold private data (people's contact details), so browsers and proxies must never store them.
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.use(csrfGuard);

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: loginLimit,
    skipSuccessfulRequests: true, // only failed attempts count, so normal sign-ins from a shared network never get blocked
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many sign-in attempts. Please wait 15 minutes and try again.' },
  });

  // Same wording for every kind of failure, so an attacker cannot tell which emails are real or which accounts are locked.
  const SIGN_IN_FAILED = 'Incorrect email or password, or the account is temporarily locked after repeated failures. Try again in 15 minutes.';

  router.post('/auth/login', loginLimiter, asyncHandler(async (req, res) => {
    const { email, password } = parse(loginSchema, req.body);
    const admin = await Admin.findOne({ email }).select('+passwordHash');
    const locked = Boolean(admin?.lockedUntil && admin.lockedUntil > new Date());
    // Always run one bcrypt comparison so every failure takes about the same time.
    const ok = await bcrypt.compare(password, admin ? admin.passwordHash : getDummyHash());

    if (!admin || locked || !ok) {
      if (admin && !locked) {
        const updated = await Admin.findByIdAndUpdate(admin.id, { $inc: { failedLogins: 1 } }, { new: true });
        if (updated.failedLogins >= lockoutMax) {
          await Admin.updateOne({ _id: admin.id }, { failedLogins: 0, lockedUntil: new Date(Date.now() + lockoutMs) });
          await audit(req, 'account_locked', 'account', admin.email, admin);
        } else {
          await audit(req, 'login_failed', 'account', admin.email, admin);
        }
      }
      throw new HttpError(401, SIGN_IN_FAILED);
    }

    await Admin.updateOne({ _id: admin.id }, { failedLogins: 0, lockedUntil: null });
    issueToken(res, admin, secret);
    await audit(req, 'login', 'account', admin.email, admin);
    res.json({ admin });
  }));

  router.post('/auth/logout', (_req, res) => {
    clearToken(res);
    res.json({ ok: true });
  });

  const auth = requireAuth(secret);
  router.get('/auth/me', auth, (req, res) => res.json({ admin: req.admin }));

  router.put('/auth/password', auth, asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = parse(passwordChangeSchema, req.body);
    const admin = await Admin.findById(req.admin.id).select('+passwordHash');
    if (!(await admin.verifyPassword(currentPassword))) {
      throw Object.assign(new HttpError(400, 'Current password is incorrect'), { errors: { currentPassword: 'Current password is incorrect' } });
    }
    if (newPassword === currentPassword) {
      throw Object.assign(new HttpError(400, 'Choose a new password'), { errors: { newPassword: 'The new password must be different' } });
    }
    const problem = passwordProblem(newPassword, admin.email);
    if (problem) throw Object.assign(new HttpError(400, problem), { errors: { newPassword: problem } });
    admin.passwordHash = await Admin.hashPassword(newPassword);
    admin.passwordChangedAt = new Date();
    await admin.save();
    issueToken(res, admin, secret); // other sessions are signed out; this one continues
    await audit(req, 'password_changed', 'account', admin.email);
    res.json({ ok: true });
  }));

  // "Sign out everywhere": every session, including this one, stops working.
  router.post('/auth/logout-all', auth, asyncHandler(async (req, res) => {
    await Admin.updateOne({ _id: req.admin.id }, { passwordChangedAt: new Date(Date.now() + 1000) });
    await audit(req, 'logout_all', 'account', req.admin.email);
    clearToken(res);
    res.json({ ok: true });
  }));

  // Everything below needs a valid session.
  router.use(auth);

  router.get('/stats', asyncHandler(async (_req, res) => {
    const [totalInterests, newInterests, totalMessages, unreadMessages, upcomingEvents, publishedPrograms, recentInterests, recentMessages] =
      await Promise.all([
        AdmissionInterest.countDocuments(),
        AdmissionInterest.countDocuments({ status: 'new' }),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ isRead: false }),
        Event.countDocuments({ isPublished: true, status: 'Upcoming' }),
        Program.countDocuments({ isPublished: true }),
        AdmissionInterest.find().sort({ createdAt: -1 }).limit(5),
        ContactMessage.find().sort({ createdAt: -1 }).limit(5),
      ]);
    res.json({ totalInterests, newInterests, totalMessages, unreadMessages, upcomingEvents, publishedPrograms, recentInterests, recentMessages });
  }));

  router.get('/audit', asyncHandler(async (req, res) => {
    const { page, limit } = parse(listQuerySchema, req.query);
    const [items, total] = await Promise.all([
      AuditLog.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      AuditLog.countDocuments(),
    ]);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  }));

  router.use('/programs', crudRouter({ Model: Program, schema: programSchema, label: 'Program' }));
  router.use('/services', crudRouter({ Model: Service, schema: serviceSchema, label: 'Service' }));
  router.use('/campuses', crudRouter({ Model: Campus, schema: campusSchema, label: 'Campus' }));
  router.use('/events', crudRouter({ Model: Event, schema: eventSchema, label: 'Event', sort: { createdAt: -1 } }));

  // ---- Admission interest submissions ----
  router.get('/admissions/export.csv', asyncHandler(async (req, res) => {
    await audit(req, 'export', 'admission interests', 'CSV download');
    const rows = await AdmissionInterest.find().sort({ createdAt: -1 }).limit(10000);
    const head = ['Date', 'Name', 'Email', 'Phone', 'City', 'Preferred program', 'Previous qualification', 'Status', 'Message'];
    const lines = rows.map((r) =>
      [r.createdAt.toISOString().slice(0, 10), r.fullName, r.email, r.phone, r.city, r.preferredProgram, r.previousQualification, r.status, r.message]
        .map(csvCell).join(',')
    );
    res.type('text/csv').attachment('admission-interests.csv').send([head.map(csvCell).join(','), ...lines].join('\r\n'));
  }));

  router.get('/admissions', asyncHandler(async (req, res) => {
    const { page, limit, status } = parse(listQuerySchema, req.query);
    const filter = status ? { status } : {};
    const [items, total] = await Promise.all([
      AdmissionInterest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      AdmissionInterest.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  }));
  router.patch('/admissions/:id', asyncHandler(async (req, res) => {
    const { status } = parse(interestStatusSchema, req.body);
    const doc = await AdmissionInterest.findByIdAndUpdate(objectId(req.params.id, 'Submission'), { status }, { new: true });
    if (!doc) throw new HttpError(404, 'Submission not found');
    await audit(req, 'update', 'admission interest', `${doc.fullName} → ${status}`);
    res.json(doc);
  }));
  router.delete('/admissions/:id', asyncHandler(async (req, res) => {
    const doc = await AdmissionInterest.findByIdAndDelete(objectId(req.params.id, 'Submission'));
    if (!doc) throw new HttpError(404, 'Submission not found');
    await audit(req, 'delete', 'admission interest', doc.fullName);
    res.json({ ok: true });
  }));

  // ---- Contact messages ----
  router.get('/messages', asyncHandler(async (req, res) => {
    const { page, limit, unread } = parse(listQuerySchema, req.query);
    const filter = unread === 'true' ? { isRead: false } : {};
    const [items, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      ContactMessage.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  }));
  router.patch('/messages/:id', asyncHandler(async (req, res) => {
    const { isRead } = parse(messageReadSchema, req.body);
    const doc = await ContactMessage.findByIdAndUpdate(objectId(req.params.id, 'Message'), { isRead }, { new: true });
    if (!doc) throw new HttpError(404, 'Message not found');
    res.json(doc);
  }));
  router.delete('/messages/:id', asyncHandler(async (req, res) => {
    const doc = await ContactMessage.findByIdAndDelete(objectId(req.params.id, 'Message'));
    if (!doc) throw new HttpError(404, 'Message not found');
    await audit(req, 'delete', 'message', `${doc.subject} (from ${doc.name})`);
    res.json({ ok: true });
  }));

  // ---- College information (saved one section at a time) ----
  router.get('/college', asyncHandler(async (_req, res) => {
    const doc = await CollegeInformation.findOne({ key: 'main' });
    if (!doc) throw new HttpError(404, 'College information has not been set up yet. Run "npm run seed".');
    res.json(doc);
  }));
  router.put('/college/:section', asyncHandler(async (req, res) => {
    const schema = collegeSections[req.params.section];
    if (!schema) throw new HttpError(404, 'Unknown section');
    const data = parse(schema, req.body);
    // Saving a section marks it as real content (placeholder notice disappears on the website).
    const value = ['mdMessage', 'admissions'].includes(req.params.section) ? { ...data, isPlaceholder: false } : data;
    const doc = await CollegeInformation.findOneAndUpdate(
      { key: 'main' },
      { $set: { [req.params.section]: value } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    await audit(req, 'save', 'college information', req.params.section);
    res.json(doc);
  }));

  return router;
}
