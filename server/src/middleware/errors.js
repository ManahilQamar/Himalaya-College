import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { isProd } from '../config/env.js';

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const notFound = (_req, _res, next) => next(new HttpError(404, 'Not found'));

// Turns zod errors into { message, errors: { field: message } }
export function parse(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const errors = {};
  result.error.issues.forEach((i) => {
    const key = i.path.join('.') || 'form';
    if (!errors[key]) errors[key] = i.message;
  });
  throw Object.assign(new HttpError(400, 'Please check the highlighted fields'), { errors });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  res.set('Cache-Control', 'no-store'); // an error must never be cached, or a fixed page would stay "missing"
  let status = err.status || 500;
  let message = err.message;
  let errors = err.errors;

  if (err instanceof ZodError) status = 400;
  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Validation failed';
    errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
  }
  if (err.type === 'entity.too.large') { status = 413; message = 'Request too large'; }
  if (err.type === 'entity.parse.failed') { status = 400; message = 'Invalid JSON'; }
  if (err.code === 11000) { status = 409; message = 'That value already exists'; }

  if (status >= 500) {
    console.error(err); // full detail stays in the server log only
    message = 'Something went wrong on our side';
  }
  res.status(status).json({ message: isProd && status >= 500 ? 'Server error' : message, ...(errors && { errors }) });
}
