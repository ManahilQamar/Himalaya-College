// PLACEHOLDER DATA. Nothing here is official college information.
// Stage 7/8: replaced by MongoDB data managed from the admin panel (same field names as the models).

export const ABOUT = {
  intro:
    '[ADD OFFICIAL COLLEGE HISTORY AND INTRODUCTION] Himalaya Degree College is located at KSK, Razar, Swabi. This page will tell students and parents who the college is and what it stands for.',
  facts: [
    { label: 'Location', value: 'KSK, Razar, Swabi' },
    { label: 'Established', value: '[ADD YEAR]' },
    { label: 'Affiliation', value: '[ADD OFFICIAL AFFILIATION]' },
    { label: 'Medium of instruction', value: '[ADD]' },
  ],
  values: [
    { title: 'Quality education', text: 'Strong teaching and clear academic standards.' },
    { title: 'Student development', text: 'Guidance and activities that build character and confidence.' },
    { title: 'Modern technology', text: 'Digital tools and skills that match today\u2019s world.' },
    { title: 'Community development', text: 'Opening better opportunities for students and their families.' },
  ],
};

export const SERVICES = [
  { id: 's1', icon: 'BookOpen', title: 'Academic support', description: '[ADD OFFICIAL DETAILS] Help with coursework, revision and exam preparation.' },
  { id: 's2', icon: 'Compass', title: 'Student guidance', description: '[ADD OFFICIAL DETAILS] Advice on subjects, study habits and personal growth.' },
  { id: 's3', icon: 'Briefcase', title: 'Career development', description: '[ADD OFFICIAL DETAILS] Direction on higher education and career paths.' },
  { id: 's4', icon: 'ClipboardList', title: 'Admission support', description: '[ADD OFFICIAL DETAILS] Help with forms, documents and the admission process.' },
  { id: 's5', icon: 'Library', title: 'Library and learning resources', description: '[ADD OFFICIAL DETAILS] Books and study material for students.' },
  { id: 's6', icon: 'Monitor', title: 'Computer and technology facilities', description: '[ADD OFFICIAL DETAILS] Computer lab and digital learning tools.' },
  { id: 's7', icon: 'FlaskConical', title: 'Laboratories', description: '[ADD OFFICIAL DETAILS] Practical learning spaces for science subjects.' },
  { id: 's8', icon: 'Trophy', title: 'Extracurricular activities', description: '[ADD OFFICIAL DETAILS] Sports, societies and events outside the classroom.' },
  { id: 's9', icon: 'Users', title: 'Student development', description: '[ADD OFFICIAL DETAILS] Leadership, communication and teamwork programs.' },
].map((s) => ({ ...s, isPlaceholder: true }));

export const PROGRAMS = [1, 2, 3].map((n) => ({
  id: `p${n}`,
  slug: `program-${n}`,
  name: `[ADD PROGRAM NAME ${n}]`,
  description: '[ADD OFFICIAL PROGRAM DESCRIPTION] A short summary of what students learn in this program.',
  qualification: '[ADD QUALIFICATION AWARDED]',
  duration: '[ADD DURATION]',
  careers: ['[ADD CAREER OPPORTUNITY]', '[ADD CAREER OPPORTUNITY]', '[ADD CAREER OPPORTUNITY]'],
  admissionInfo: '[ADD OFFICIAL ADMISSION REQUIREMENTS FOR THIS PROGRAM]',
  isPlaceholder: true,
}));

export const CAMPUSES = [1, 2].map((n) => ({
  id: `c${n}`,
  slug: `campus-${n}`,
  name: `[ADD CAMPUS NAME ${n}]`,
  location: '[ADD CAMPUS LOCATION]',
  image: null, // [ADD CAMPUS IMAGE URL]
  intro: '[ADD OFFICIAL CAMPUS INTRODUCTION]',
  facilities: ['[ADD FACILITY]', '[ADD FACILITY]', '[ADD FACILITY]'],
  programs: ['[ADD PROGRAM OFFERED AT THIS CAMPUS]'],
  contact: { phone: '', email: '', address: '' },
  // Left empty on purpose. Filled in from the admin panel later.
  coordinator: { name: '', designation: '', phone: '', email: '', officeHours: '', bio: '' },
  isPlaceholder: true,
}));

export const ADMISSIONS = {
  isPlaceholder: true,
  whyChoose: [
    { title: 'Focus on quality teaching', text: '[CONFIRM WITH COLLEGE] Clear academic standards and supportive teachers.' },
    { title: 'Technology-ready learning', text: '[CONFIRM WITH COLLEGE] Digital skills that match today\u2019s world.' },
    { title: 'Guidance for your next step', text: '[CONFIRM WITH COLLEGE] Advice on study and career paths.' },
  ],
  process: [
    { title: 'Express your interest', text: 'Fill in the form on this page.' },
    { title: 'The admissions team contacts you', text: '[CONFIRM PROCESS WITH COLLEGE]' },
    { title: 'Submit your documents', text: '[CONFIRM PROCESS WITH COLLEGE]' },
    { title: 'Receive the admission decision', text: '[CONFIRM PROCESS WITH COLLEGE]' },
  ],
  eligibility: '[ADD OFFICIAL ELIGIBILITY CRITERIA]',
  documents: ['[ADD REQUIRED DOCUMENT]', '[ADD REQUIRED DOCUMENT]', '[ADD REQUIRED DOCUMENT]'],
  importantDates: '[ADD OFFICIAL ADMISSION DATES]',
  fees: '[ADD OFFICIAL FEE INFORMATION]',
  faqs: [
    { q: 'How do I apply?', a: 'Use the Express Your Interest form on this page. [CONFIRM FULL PROCESS WITH COLLEGE]' },
    { q: 'Does submitting the form confirm my admission?', a: 'No. The form tells the college you are interested. The admissions team will contact you about the next steps.' },
    { q: 'What documents do I need?', a: '[ADD OFFICIAL ANSWER]' },
    { q: 'What are the fees?', a: '[ADD OFFICIAL ANSWER]' },
    { q: 'When do admissions close?', a: '[ADD OFFICIAL ANSWER]' },
  ],
};

// date: null means "[ADD DATE]". Status, publish and featured flags are set by the admin panel later.
export const EVENTS = [
  ['e1', 'Admissions', 'Upcoming', true],
  ['e2', 'Examinations', 'Upcoming', false],
  ['e3', 'Seminars', 'Upcoming', false],
  ['e4', 'Results', 'Completed', false],
  ['e5', 'Important Notices', 'Ongoing', false],
].map(([id, category, status, isFeatured]) => ({
  id,
  title: `[ADD ${category.toUpperCase()} ANNOUNCEMENT TITLE]`,
  category,
  shortDescription: '[ADD A SHORT SUMMARY OF THIS ANNOUNCEMENT]',
  fullDescription: '[ADD THE FULL DESCRIPTION]\n\n[ADD ANY EXTRA DETAILS STUDENTS AND PARENTS SHOULD KNOW]',
  date: null,
  time: '[ADD TIME]',
  location: '[ADD LOCATION]',
  image: null,
  status,
  isPublished: true,
  isFeatured,
  isPlaceholder: true,
}));


