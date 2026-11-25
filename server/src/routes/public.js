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

const STATIC_PAGES = ['/', '/about', '/services', '/disciplines', '/campuses', '/admissions', '/events', '/contact'];
const xmlEscape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const real = { isPublished: true, isPlaceholder: { $ne: true } }; // sample content is never offered to search engines

export default function publicRoutes({ formLimit = 10, siteUrl = '' } = {}) {
  const router = Router();

  // Public content: browsers always revalidate (a cheap "304 Not Modified" via ETag), so an admin who saves a change
  // sees it at once. Only a CDN in front (for example Vercel) may keep a copy for 60 seconds, then refresh it quietly.
  // That keeps the free API tier fast without making edits look "stuck".
  router.use(['/college', '/services', '/programs', '/campuses', '/events', '/sitemap.xml'], (req, res, next) => {
    if (req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=0, must-revalidate');
      res.set('CDN-Cache-Control', 'max-age=60, stale-while-revalidate=300');
      res.set('Vercel-CDN-Cache-Control', 'max-age=60, stale-while-revalidate=300');
    }
    next();
  });

  // Stricter limit on endpoints that write to the database.
  const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: formLimit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many submissions. Please try again later.' },
  });

  router.get('/health', (_req, res) => res.json({ ok: true }));

  router.get('/sitemap.xml', asyncHandler(async (_req, res) => {
    const [programs, campuses, events] = await Promise.all([
      Program.find(real).select('slug updatedAt'),
      Campus.find(real).select('slug updatedAt'),
      Event.find(real).select('updatedAt'),
    ]);
    const entries = [
      ...STATIC_PAGES.map((p) => ({ path: p, priority: p === '/' ? '1.0' : '0.8' })),
      ...programs.map((d) => ({ path: `/disciplines/${d.slug}`, lastmod: d.updatedAt, priority: '0.7' })),
      ...campuses.map((d) => ({ path: `/campuses/${d.slug}`, lastmod: d.updatedAt, priority: '0.7' })),
      ...events.map((d) => ({ path: `/events/${d.id}`, lastmod: d.updatedAt, priority: '0.5' })),
    ];
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries.map((e) => `  <url><loc>${xmlEscape(siteUrl + e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}<priority>${e.priority}</priority></url>`),
      '</urlset>',
    ].join('\n');
    res.type('application/xml').send(xml);
  }));

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
