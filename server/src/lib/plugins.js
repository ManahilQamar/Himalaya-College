import mongoose from 'mongoose';

// JSON output: expose `id`, hide internals (_id, __v, passwordHash).
export function cleanJson(schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = String(ret._id);
      delete ret._id;
      delete ret.passwordHash;
      delete ret.failedLogins;
      delete ret.lockedUntil;
      return ret;
    },
  });
}

export const slugify = (text) =>
  String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'item';

// Creates a unique URL slug from `source` when none is given.
export function slugPlugin(source) {
  return (schema) => {
    schema.add({ slug: { type: String, unique: true, index: true, trim: true, lowercase: true } });
    schema.pre('validate', async function setSlug(next) {
      if (this.slug) return next();
      const base = slugify(this[source]);
      let candidate = base;
      let n = 1;
      const Model = mongoose.model(this.constructor.modelName);
      // eslint-disable-next-line no-await-in-loop
      while (await Model.exists({ slug: candidate })) candidate = `${base}-${++n}`;
      this.slug = candidate;
      return next();
    });
  };
}
