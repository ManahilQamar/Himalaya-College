import mongoose from 'mongoose';
import { cleanJson, slugPlugin } from '../lib/plugins.js';

const str = (max = 200) => ({ type: String, trim: true, maxlength: max, default: '' });

const campusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    location: str(200),
    image: str(500),
    intro: str(3000),
    facilities: { type: [{ type: String, trim: true, maxlength: 200 }], default: [] },
    programs: { type: [{ type: String, trim: true, maxlength: 200 }], default: [] },
    contact: {
      phone: str(40),
      email: str(120),
      address: str(250),
    },
    coordinator: {
      name: str(120),
      designation: str(120),
      phone: str(40),
      email: str(120),
      officeHours: str(150),
      bio: str(2000),
    },
    isPublished: { type: Boolean, default: false, index: true },
    isPlaceholder: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
campusSchema.plugin(slugPlugin('name'));
campusSchema.plugin(cleanJson);

export default mongoose.model('Campus', campusSchema);
