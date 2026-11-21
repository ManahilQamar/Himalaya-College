import mongoose from 'mongoose';
import { cleanJson } from '../lib/plugins.js';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);
contactMessageSchema.plugin(cleanJson);

export default mongoose.model('ContactMessage', contactMessageSchema);
