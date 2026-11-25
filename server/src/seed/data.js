// PLACEHOLDER content only. Nothing here is official college information.
// Replace everything marked [ADD ...] from the admin panel (Stage 8).

const ph = (s) => ({ ...s, isPublished: true, isPlaceholder: true });

export const college = {
  key: 'main',
  about: {
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
  },
  home: {
    intro: {
      heading: 'Education that prepares students for what comes next',
      body: '[ADD OFFICIAL COLLEGE INTRODUCTION] Himalaya Degree College works to give students a serious academic foundation, practical skills and the confidence to move forward.',
      points: [
        { title: 'Educational purpose', text: 'Quality teaching that builds understanding, not only exam results.' },
        { title: 'Academic environment', text: 'A focused, supportive setting for students and teachers.' },
        { title: 'Student development', text: 'Guidance, activities and habits that build character and leadership.' },
        { title: 'Future-oriented learning', text: 'Technology and career skills that match today\u2019s opportunities.' },
      ],
    },
    stats: [
      { label: 'Programs', value: null, suffix: '+' },
      { label: 'Students', value: null, suffix: '+' },
      { label: 'Faculty members', value: null, suffix: '+' },
      { label: 'Campuses', value: null, suffix: '' },
    ],
  },
  mdMessage: {
    name: 'MD Sikandar Hayat',
    designation: 'Managing Director',
    photo: '',
    message: [
      '[PLACEHOLDER] Quality education starts with respect for every student\u2019s potential. This section will carry the Managing Director\u2019s approved message to students, parents and the community.',
      '[PLACEHOLDER] Themes to cover: student development, modern technology, future-ready skills, professional growth, community development and better opportunities for students.',
    ],
    vision: '[ADD OFFICIAL VISION STATEMENT]',
    mission: '[ADD OFFICIAL MISSION STATEMENT]',
    goals: '[ADD FUTURE GOALS]',
    isPlaceholder: true,
  },
  admissions: {
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
  },
  contact: {
    phones: ['0300-9081968', '0345-50292935', '0344-9501666'],
    whatsapp: '03009081968',
    email: 'hcst.swabi@yahoo.com',
    address: 'KSK, Razar, Swabi',
    officeHours: '[ADD OFFICE HOURS]',
    tagline: 'Quality education, modern technology and future-ready skills for every student.',
    mapEmbedUrl: '',
  },
};

const S = (icon, title, description, i) => ph({ icon, title, description: `[ADD OFFICIAL DETAILS] ${description}`, order: i });
export const services = [
  S('BookOpen', 'Academic support', 'Help with coursework, revision and exam preparation.', 1),
  S('Compass', 'Student guidance', 'Advice on subjects, study habits and personal growth.', 2),
  S('Briefcase', 'Career development', 'Direction on higher education and career paths.', 3),
  S('ClipboardList', 'Admission support', 'Help with forms, documents and the admission process.', 4),
  S('Library', 'Library and learning resources', 'Books and study material for students.', 5),
  S('Monitor', 'Computer and technology facilities', 'Computer lab and digital learning tools.', 6),
  S('FlaskConical', 'Laboratories', 'Practical learning spaces for science subjects.', 7),
  S('Trophy', 'Extracurricular activities', 'Sports, societies and events outside the classroom.', 8),
  S('Users', 'Student development', 'Leadership, communication and teamwork programs.', 9),
];

export const programs = [1, 2, 3].map((n) =>
  ph({
    slug: `program-${n}`,
    name: `[ADD PROGRAM NAME ${n}]`,
    description: '[ADD OFFICIAL PROGRAM DESCRIPTION] A short summary of what students learn in this program.',
    qualification: '[ADD QUALIFICATION AWARDED]',
    duration: '[ADD DURATION]',
    careers: ['[ADD CAREER OPPORTUNITY]', '[ADD CAREER OPPORTUNITY]', '[ADD CAREER OPPORTUNITY]'],
    admissionInfo: '[ADD OFFICIAL ADMISSION REQUIREMENTS FOR THIS PROGRAM]',
    order: n,
  })
);

export const campuses = [1, 2].map((n) =>
  ph({
    slug: `campus-${n}`,
    name: `[ADD CAMPUS NAME ${n}]`,
    location: '[ADD CAMPUS LOCATION]',
    image: '',
    intro: '[ADD OFFICIAL CAMPUS INTRODUCTION]',
    facilities: ['[ADD FACILITY]', '[ADD FACILITY]', '[ADD FACILITY]'],
    programs: ['[ADD PROGRAM OFFERED AT THIS CAMPUS]'],
    contact: { phone: '', email: '', address: '' },
    coordinator: { name: '', designation: '', phone: '', email: '', officeHours: '', bio: '' }, // left empty on purpose
    order: n,
  })
);

export const events = [
  ['Admissions', 'Upcoming', true],
  ['Examinations', 'Upcoming', false],
  ['Seminars', 'Upcoming', false],
  ['Results', 'Completed', false],
  ['Important Notices', 'Ongoing', false],
].map(([category, status, isFeatured]) =>
  ph({
    title: `[ADD ${category.toUpperCase()} ANNOUNCEMENT TITLE]`,
    category,
    status,
    isFeatured,
    shortDescription: '[ADD A SHORT SUMMARY OF THIS ANNOUNCEMENT]',
    fullDescription: '[ADD THE FULL DESCRIPTION]\n\n[ADD ANY EXTRA DETAILS STUDENTS AND PARENTS SHOULD KNOW]',
    date: null,
    time: '[ADD TIME]',
    location: '[ADD LOCATION]',
    image: '',
  })
);
