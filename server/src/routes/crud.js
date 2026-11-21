import { Router } from 'express';
import { audit } from '../lib/audit.js';
import { HttpError, asyncHandler, parse } from '../middleware/errors.js';
import { publishSchema } from '../validation/adminSchemas.js';

const OBJECT_ID = /^[a-f\d]{24}$/i;

// Standard list/get/create/update/publish/delete for a content type (admin only).
export default function crudRouter({ Model, schema, label, sort = { order: 1, createdAt: 1 }, publishFields = ['isPublished'] }) {
  const router = Router();
  const target = label.toLowerCase();
  const name = (doc) => doc.title || doc.name;
  const find = async (id) => {
    if (!OBJECT_ID.test(id)) throw new HttpError(404, `${label} not found`);
    const doc = await Model.findById(id);
    if (!doc) throw new HttpError(404, `${label} not found`);
    return doc;
  };

  router.get('/', asyncHandler(async (_req, res) => res.json(await Model.find().sort(sort).limit(500))));
  router.get('/:id', asyncHandler(async (req, res) => res.json(await find(req.params.id))));

  router.post('/', asyncHandler(async (req, res) => {
    const data = parse(schema, req.body);
    // Once the admin saves an item it is real content, not a placeholder any more.
    const doc = await Model.create({ ...data, isPlaceholder: false });
    await audit(req, 'create', target, name(doc));
    res.status(201).json(doc);
  }));

  router.put('/:id', asyncHandler(async (req, res) => {
    const doc = await find(req.params.id);
    doc.set({ ...parse(schema, req.body), isPlaceholder: false });
    await doc.save();
    await audit(req, 'update', target, name(doc));
    res.json(doc);
  }));

  router.patch('/:id/publish', asyncHandler(async (req, res) => {
    const { isPublished } = parse(publishSchema, req.body);
    const doc = await find(req.params.id);
    doc.set(publishFields[0], isPublished);
    await doc.save();
    await audit(req, isPublished ? 'publish' : 'unpublish', target, name(doc));
    res.json(doc);
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    const doc = await find(req.params.id);
    await doc.deleteOne();
    await audit(req, 'delete', target, name(doc));
    res.json({ ok: true });
  }));

  return router;
}
