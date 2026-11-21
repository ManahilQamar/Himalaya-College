import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import AdmissionInterest from '../models/AdmissionInterest.js';
import Campus from '../models/Campus.js';
import CollegeInformation from '../models/CollegeInformation.js';
import ContactMessage from '../models/ContactMessage.js';
import Event from '../models/Event.js';
import Program from '../models/Program.js';
import Service from '../models/Service.js';
import { HttpError, asyncHandler, parse } from '../middleware/errors.js';
import { contactSchema, eventQuerySchema, interestSchema } from '../validation/schemas.js';

const STATUS_ORDER = { Ongoing: 0, Upcoming: 1, Completed: 2 };
const OBJECT_ID = /^[a-f\d]{24}$/i;
const byOrder = { order: 1, createdAt: 1 };

export default function publicRoutes({ formLimit = 10 } = {}) {
  const router = Router();

  // Stricter limit on endpoints that write to the database.
  const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: formLimit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many submissions. Please try again later.' },
  });

  router.get('/health', (_req, res) => res.json({ ok: true }));

  router.get('/college', asyncHandler(async (_req, res) => {
    const doc = await CollegeInformation.findOne({ key: 'main' });
    if (!doc) throw new HttpError(404, 'College information has not been set up yet');
    res.json(doc);
  }));

  router.get('/services', asyncHandler(async (_req, res) => {
    res.json(await Service.find({ isPublished: true }).sort(byOrder));
  }));

  router.get('/programs', asyncHandler(async (_req, res) => {
    res.json(await Program.find({ isPublished: true }).sort(byOrder));
  }));
  router.get('/programs/:slug', asyncHandler(async (req, res) => {
    const doc = await Program.findOne({ slug: String(req.params.slug).toLowerCase(), isPublished: true });
    if (!doc) throw new HttpError(404, 'Program not found');
    res.json(doc);
  }));

  router.get('/campuses', asyncHandler(async (_req, res) => {
    res.json(await Campus.find({ isPublished: true }).sort(byOrder));
  }));
  router.get('/campuses/:slug', asyncHandler(async (req, res) => {
    const doc = await Campus.findOne({ slug: String(req.params.slug).toLowerCase(), isPublished: true });
    if (!doc) throw new HttpError(404, 'Campus not found');
    res.json(doc);
  }));

  router.get('/events', asyncHandler(async (req, res) => {
    const { category, status } = parse(eventQuerySchema, req.query);
    const filter = { isPublished: true, ...(category && { category }), ...(status && { status }) };
    const events = await Event.find(filter).limit(200);
    const time = (e) => (e.date ? e.date.getTime() : 0);
    events.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || time(b) - time(a) || b.createdAt - a.createdAt);
    res.json(events);
  }));

  // Must be declared before /events/:id
  router.get('/events/latest', asyncHandler(async (_req, res) => {
    const live = await Event.find({ isPublished: true, status: { $ne: 'Completed' } }).sort({ createdAt: -1 }).limit(50);
    res.json(live.find((e) => e.isFeatured) || live[0] || null);
  }));
  router.get('/events/:id', asyncHandler(async (req, res) => {
    if (!OBJECT_ID.test(req.params.id)) throw new HttpError(404, 'Event not found');
    const doc = await Event.findOne({ _id: req.params.id, isPublished: true });
    if (!doc) throw new HttpError(404, 'Event not found');
    res.json(doc);
  }));

  router.post('/admissions', formLimiter, asyncHandler(async (req, res) => {
    const { website, ...data } = parse(interestSchema, req.body);
    if (!website) await AdmissionInterest.create(data); // bots fill the hidden field: pretend success, store nothing
    res.status(201).json({ ok: true });
  }));

  router.post('/contact', formLimiter, asyncHandler(async (req, res) => {
    const { website, ...data } = parse(contactSchema, req.body);
    if (!website) await ContactMessage.create(data);
    res.status(201).json({ ok: true });
  }));

  return router;
}
