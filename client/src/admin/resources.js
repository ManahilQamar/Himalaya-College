// What each admin form contains. The server validates everything again.
import { EVENT_CATEGORIES, EVENT_STATUSES } from '../lib/siteConfig';

const published = { name: 'isPublished', type: 'checkbox', label: 'Published', hint: 'Only published items are visible on the website.' };
const order = { name: 'order', type: 'number', label: 'Display order', hint: 'Smaller numbers appear first.' };
const titleText = [
  { name: 'title', label: 'Title' },
  { name: 'text', label: 'Text', type: 'textarea', rows: 2 },
];

export const programFields = [
  { name: 'name', label: 'Program name', required: true, full: true },
  { name: 'description', label: 'Short description', type: 'textarea', required: true },
  { name: 'qualification', label: 'Qualification awarded' },
  { name: 'duration', label: 'Duration' },
  { name: 'careers', label: 'Career opportunities', type: 'lines', hint: 'One career per line' },
  { name: 'admissionInfo', label: 'Admission information', type: 'textarea' },
  order,
  published,
];

export const serviceFields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'icon', label: 'Icon name', hint: 'Example: BookOpen, Library, Monitor', placeholder: 'BookOpen' },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'category', label: 'Category (optional)' },
  order,
  published,
];

export const campusFields = [
  { name: 'name', label: 'Campus name', required: true },
  { name: 'location', label: 'Location' },
  { name: 'image', label: 'Image link (https://…)', type: 'url', full: true },
  { name: 'intro', label: 'Introduction', type: 'textarea' },
  { name: 'facilities', label: 'Facilities', type: 'lines', hint: 'One facility per line' },
  { name: 'programs', label: 'Programs offered', type: 'lines', hint: 'One program per line' },
  { name: 'contact.phone', label: 'Campus phone' },
  { name: 'contact.email', label: 'Campus email', type: 'email' },
  { name: 'contact.address', label: 'Campus address', full: true },
  { name: 'coordinator.name', label: 'Coordinator name' },
  { name: 'coordinator.designation', label: 'Coordinator designation' },
  { name: 'coordinator.phone', label: 'Coordinator phone' },
  { name: 'coordinator.email', label: 'Coordinator email', type: 'email' },
  { name: 'coordinator.officeHours', label: 'Coordinator office hours', full: true },
  { name: 'coordinator.bio', label: 'Coordinator bio', type: 'textarea' },
  order,
  published,
];

export const eventFields = [
  { name: 'title', label: 'Title', required: true, full: true },
  { name: 'category', label: 'Category', type: 'select', options: EVENT_CATEGORIES, default: EVENT_CATEGORIES[0] },
  { name: 'status', label: 'Status', type: 'select', options: EVENT_STATUSES, default: 'Upcoming' },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'time', label: 'Time', placeholder: 'For example 9:00 AM' },
  { name: 'location', label: 'Location', full: true },
  { name: 'image', label: 'Featured image link (https://…)', type: 'url', full: true },
  { name: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2 },
  { name: 'fullDescription', label: 'Full description', type: 'textarea', rows: 7, hint: 'Leave a blank line between paragraphs.' },
  { name: 'isFeatured', type: 'checkbox', label: 'Show in the navbar announcement', hint: 'The featured upcoming or ongoing event appears at the top of every page.' },
  published,
];

// College information, saved one section at a time
export const collegeSections = {
  about: [
    { name: 'intro', label: 'Introduction', type: 'textarea', rows: 6 },
    { name: 'facts', label: 'Key facts', type: 'repeater', addLabel: 'Add fact', fields: [{ name: 'label', label: 'Label' }, { name: 'value', label: 'Value' }] },
    { name: 'values', label: 'What guides us', type: 'repeater', addLabel: 'Add value', fields: titleText },
  ],
  home: [
    { name: 'intro.heading', label: 'Introduction heading', full: true },
    { name: 'intro.body', label: 'Introduction text', type: 'textarea' },
    { name: 'intro.points', label: 'Introduction points', type: 'repeater', addLabel: 'Add point', fields: titleText },
    {
      name: 'stats', label: 'Statistics counters', type: 'repeater', addLabel: 'Add statistic',
      hint: 'Leave the number empty to show "Not added yet" on the website.',
      fields: [
        { name: 'label', label: 'Label' },
        { name: 'value', label: 'Number', type: 'number', nullable: true },
        { name: 'suffix', label: 'Suffix', placeholder: '+' },
      ],
    },
  ],
  mdMessage: [
    { name: 'name', label: 'Name', required: true },
    { name: 'designation', label: 'Designation' },
    { name: 'photo', label: 'Photograph link (https://…)', type: 'url', full: true },
    { name: 'message', label: 'Message', type: 'lines', rows: 8, hint: 'One paragraph per line. Use only the Managing Director’s approved words.' },
    { name: 'vision', label: 'Vision', type: 'textarea', rows: 3 },
    { name: 'mission', label: 'Mission', type: 'textarea', rows: 3 },
    { name: 'goals', label: 'Future goals', type: 'textarea', rows: 3 },
  ],
  admissions: [
    { name: 'whyChoose', label: 'Why choose us', type: 'repeater', addLabel: 'Add reason', fields: titleText },
    { name: 'process', label: 'Admission process steps', type: 'repeater', addLabel: 'Add step', fields: titleText },
    { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
    { name: 'documents', label: 'Required documents', type: 'lines', hint: 'One document per line' },
    { name: 'importantDates', label: 'Important dates (admission dates)', type: 'textarea' },
    { name: 'fees', label: 'Fee information', type: 'textarea' },
    { name: 'faqs', label: 'Frequently asked questions', type: 'repeater', addLabel: 'Add question', fields: [{ name: 'q', label: 'Question', full: true }, { name: 'a', label: 'Answer', type: 'textarea', rows: 3 }] },
  ],
  contact: [
    { name: 'phones', label: 'Phone numbers', type: 'lines', hint: 'One number per line' },
    { name: 'whatsapp', label: 'WhatsApp number' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'address', label: 'Address' },
    { name: 'officeHours', label: 'Office hours', full: true },
  ],
};


