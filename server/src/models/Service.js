import mongoose from 'mongoose';
import { cleanJson } from '../lib/plugins.js';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    icon: { type: String, trim: true, maxlength: 50, default: 'Circle' },
    category: { type: String, trim: true, maxlength: 80, default: '' },
    isPublished: { type: Boolean, default: false, index: true },
    isPlaceholder: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
serviceSchema.plugin(cleanJson);

export default mongoose.model('Service', serviceSchema);
