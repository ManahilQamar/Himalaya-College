import { z } from 'zod';
import { EVENT_CATEGORIES, EVENT_STATUSES, INTEREST_STATUSES } from '../lib/constants.js';

const text = (max, min = 0) => z.string().trim().min(min).max(max).default('');
const required = (max, label) => z.string().trim().min(1, `${label} is required`).max(max);
// Item limits match the database models exactly, so users see clear messages instead of database errors.
const listOf = (max) => z.array(z.string().trim().max(max)).max(50).default([]);
const order = z.coerce.number().int().min(0).max(9999).optional();
const flag = z.boolean().optional();

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const optionalEmail = z.string().trim().max(120).refine((v) => v === '' || isEmail(v), 'Enter a valid email address').default('');
// Only full http(s) links, so a pasted "javascript:" link can never end up in an image tag.
const imageUrl = z.string().trim().max(500).refine((v) => v === '' || /^https?:\/\//i.test(v), 'Use a full link starting with https://').default('');

export const programSchema = z.object({
  name: required(150, 'Name'),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and dashes').max(80).optional(),
  description: required(2000, 'Description'),
  qualification: text(150),
  duration: text(100),
  careers: listOf(200),
  admissionInfo: text(2000),
  isPublished: flag,
  order,
});

export const serviceSchema = z.object({
  title: required(150, 'Title'),
  description: required(1000, 'Description'),
  icon: z.string().trim().regex(/^[A-Za-z0-9]{1,50}$/, 'Use an icon name such as BookOpen').default('Circle'),
  category: text(80),
  isPublished: flag,
  order,
});

export const campusSchema = z.object({
  name: required(150, 'Name'),
  slug: programSchema.shape.slug,
  location: text(200),
  image: imageUrl,
  intro: text(3000),
  facilities: listOf(200),
  programs: listOf(200),
  contact: z.object({ phone: text(40), email: optionalEmail, address: text(250) }).default({}),
  coordinator: z
    .object({ name: text(120), designation: text(120), phone: text(40), email: optionalEmail, officeHours: text(150), bio: text(2000) })
    .default({}),
  isPublished: flag,
  order,
});

const eventDate = z
  .union([z.string().trim(), z.null()])
  .optional()
  .transform((v, ctx) => {
    if (!v) return null;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) {
      ctx.addIssue({ code: 'custom', message: 'Enter a valid date' });
      return z.NEVER;
    }
    return d;
  });

export const eventSchema = z.object({
  title: required(200, 'Title'),
  category: z.enum(EVENT_CATEGORIES),
  shortDescription: text(400),
  fullDescription: text(10000),
  date: eventDate,
  time: text(60),
  location: text(200),
  image: imageUrl,
  status: z.enum(EVENT_STATUSES).default('Upcoming'),
  isPublished: flag,
  isFeatured: flag,
});

export const publishSchema = z.object({ isPublished: z.boolean() });
export const interestStatusSchema = z.object({ status: z.enum(INTEREST_STATUSES) });
export const messageReadSchema = z.object({ isRead: z.boolean() });

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(INTEREST_STATUSES).optional(),
  unread: z.enum(['true', 'false']).optional(),
});

// Only Google's own embed address is accepted, so a pasted link can never load another site inside the page.
const mapEmbedUrl = z
  .string()
  .trim()
  .max(600)
  .refine((v) => v === '' || /^https:\/\/www\.google\.com\/maps\/embed\?[^\s"'<>]+$/.test(v), 'Use the "Embed a map" link from Google Maps (it starts with https://www.google.com/maps/embed)')
  .default('');

// ---- College information, saved one section at a time ----
const titleText = z.object({ title: text(150), text: text(600) });
export const collegeSections = {
  about: z.object({
    intro: text(5000),
    facts: z.array(z.object({ label: text(80), value: text(200) })).max(20).default([]),
    values: z.array(titleText).max(12).default([]),
  }),
  home: z.object({
    intro: z.object({ heading: text(200), body: text(2000), points: z.array(titleText).max(8).default([]) }),
    stats: z
      .array(z.object({ label: text(60, 1), value: z.number().min(0).max(10000000).nullable().default(null), suffix: text(5) }))
      .max(8)
      .default([]),
  }),
  mdMessage: z.object({
    name: required(100, 'Name'),
    designation: text(100),
    photo: imageUrl,
    message: listOf(3000),
    vision: text(1500),
    mission: text(1500),
    goals: text(1500),
  }),
  admissions: z.object({
    whyChoose: z.array(titleText).max(8).default([]),
    process: z.array(titleText).max(12).default([]),
    eligibility: text(3000),
    documents: listOf(300),
    importantDates: text(2000),
    fees: text(2000),
    faqs: z.array(z.object({ q: text(300, 1), a: text(2000) })).max(30).default([]),
  }),
  contact: z.object({
    phones: listOf(40),
    whatsapp: text(40),
    email: optionalEmail,
    address: text(250),
    officeHours: text(150),
    tagline: text(300),
    mapEmbedUrl,
  }),
};

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(150),
  password: z.string().min(1).max(128),
});
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string().min(10, 'Use at least 10 characters').max(128),
});
