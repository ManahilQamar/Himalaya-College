import mongoose from 'mongoose';
import { cleanJson, slugPlugin } from '../lib/plugins.js';

const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    qualification: { type: String, trim: true, maxlength: 150, default: '' },
    duration: { type: String, trim: true, maxlength: 100, default: '' },
    careers: { type: [{ type: String, trim: true, maxlength: 200 }], default: [] },
    admissionInfo: { type: String, trim: true, maxlength: 2000, default: '' },
    isPublished: { type: Boolean, default: false, index: true },
    isPlaceholder: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
programSchema.plugin(slugPlugin('name'));
programSchema.plugin(cleanJson);

export default mongoose.model('Program', programSchema);
