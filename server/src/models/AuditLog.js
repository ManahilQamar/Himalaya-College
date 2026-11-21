import mongoose from 'mongoose';
import { cleanJson } from '../lib/plugins.js';

// Who did what in the admin area. Never stores form contents, only the item's name.
const auditLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    adminEmail: { type: String, trim: true, maxlength: 150, default: '' },
    action: { type: String, required: true, maxlength: 40 },
    target: { type: String, trim: true, maxlength: 60, default: '' },
    label: { type: String, trim: true, maxlength: 150, default: '' },
    ip: { type: String, maxlength: 64, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 }); // kept for 180 days
auditLogSchema.plugin(cleanJson);

export default mongoose.model('AuditLog', auditLogSchema);
