import mongoose from 'mongoose';
import { cleanJson } from '../lib/plugins.js';
import { INTEREST_STATUSES } from '../lib/constants.js';

const admissionInterestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    preferredProgram: { type: String, required: true, trim: true, maxlength: 150 },
    previousQualification: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: INTEREST_STATUSES, default: 'new', index: true },
  },
  { timestamps: true }
);
admissionInterestSchema.plugin(cleanJson);

export default mongoose.model('AdmissionInterest', admissionInterestSchema);
