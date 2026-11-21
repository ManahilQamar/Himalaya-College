import { z } from 'zod';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '../lib/constants.js';

const phone = z
  .string()
  .trim()
  .regex(/^[\d\s+()-]+$/, 'Enter a valid phone number')
  .refine((v) => {
    const digits = v.replace(/\D/g, '').length;
    return digits >= 10 && digits <= 15;
  }, 'Enter a valid phone number');

const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(150);

// Unknown keys are dropped (zod default), so clients cannot write extra fields such as `status`.
export const interestSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100),
  email,
  phone,
  city: z.string().trim().min(2, 'Enter your city').max(80),
  preferredProgram: z.string().trim().min(1, 'Choose a program').max(150),
  previousQualification: z.string().trim().min(2, 'Enter your previous qualification').max(120),
  message: z.string().trim().max(1000).optional().default(''),
  website: z.string().max(200).optional().default(''), // honeypot
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100),
  email,
  phone,
  subject: z.string().trim().min(3, 'Enter a subject').max(150),
  message: z.string().trim().min(10, 'Write at least 10 characters').max(2000),
  website: z.string().max(200).optional().default(''), // honeypot
});

// Query strings must be plain strings from a fixed list, which also blocks ?category[$ne]=x tricks.
export const eventQuerySchema = z.object({
  category: z.enum(EVENT_CATEGORIES).optional(),
  status: z.enum(EVENT_STATUSES).optional(),
});
