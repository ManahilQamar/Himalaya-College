import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { cleanJson } from '../lib/plugins.js';

// Login routes use this model from Stage 8. Passwords are only ever stored hashed.
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 150 },
    passwordHash: { type: String, required: true, select: false },
    passwordChangedAt: { type: Date, default: null }, // sessions issued before this stop working
    failedLogins: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
    role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
  },
  { timestamps: true }
);

adminSchema.statics.hashPassword = (plain) => bcrypt.hash(plain, 12);
adminSchema.methods.verifyPassword = function verifyPassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};
adminSchema.plugin(cleanJson);

export default mongoose.model('Admin', adminSchema);
