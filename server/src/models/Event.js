import mongoose from 'mongoose';
import { cleanJson } from '../lib/plugins.js';
import { EVENT_CATEGORIES, EVENT_STATUSES } from '../lib/constants.js';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, enum: EVENT_CATEGORIES, required: true, index: true },
    shortDescription: { type: String, trim: true, maxlength: 400, default: '' },
    fullDescription: { type: String, trim: true, maxlength: 10000, default: '' },
    date: { type: Date, default: null },
    time: { type: String, trim: true, maxlength: 60, default: '' },
    location: { type: String, trim: true, maxlength: 200, default: '' },
    image: { type: String, trim: true, maxlength: 500, default: '' },
    status: { type: String, enum: EVENT_STATUSES, default: 'Upcoming', index: true },
    isPublished: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false },
    isPlaceholder: { type: Boolean, default: false },
  },
  { timestamps: true }
);
eventSchema.plugin(cleanJson);

export default mongoose.model('Event', eventSchema);
