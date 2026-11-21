import mongoose from 'mongoose';
import { cleanJson } from '../lib/plugins.js';

const text = (max = 3000) => ({ type: String, trim: true, maxlength: max, default: '' });
const list = (max = 300) => ({ type: [{ type: String, trim: true, maxlength: max }], default: [] });
const titleText = { title: text(150), text: text(600) };

// One document (key: "main") holding the editable site-wide content.
const collegeSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true, immutable: true },
    about: {
      intro: text(5000),
      facts: { type: [{ label: text(80), value: text(200), _id: false }], default: [] },
      values: { type: [{ ...titleText, _id: false }], default: [] },
    },
    home: {
      intro: {
        heading: text(200),
        body: text(2000),
        points: { type: [{ ...titleText, _id: false }], default: [] },
      },
      // value: null means "not added yet"
      stats: {
        type: [{ label: text(60), value: { type: Number, min: 0, default: null }, suffix: text(5), _id: false }],
        default: [],
      },
    },
    mdMessage: {
      name: text(100),
      designation: text(100),
      photo: text(500),
      message: list(3000),
      vision: text(1500),
      mission: text(1500),
      goals: text(1500),
      isPlaceholder: { type: Boolean, default: true },
    },
    admissions: {
      isPlaceholder: { type: Boolean, default: true },
      whyChoose: { type: [{ ...titleText, _id: false }], default: [] },
      process: { type: [{ ...titleText, _id: false }], default: [] },
      eligibility: text(3000),
      documents: list(300),
      importantDates: text(2000),
      fees: text(2000),
      faqs: { type: [{ q: text(300), a: text(2000), _id: false }], default: [] },
    },
    contact: {
      phones: list(40),
      whatsapp: text(40),
      email: text(150),
      address: text(250),
      officeHours: text(150),
    },
  },
  { timestamps: true }
);
collegeSchema.plugin(cleanJson);

export default mongoose.model('CollegeInformation', collegeSchema);
