// Home page content. Stage 8: this moves to MongoDB (CollegeInformation + MDMessage)
// and becomes editable from the admin panel. Everything marked [ADD ...] is a placeholder.

export const HERO = {
  college: 'Himalaya Degree College',
  location: 'KSK, Razar, Swabi',
  headline: 'Empowering Students Through Education, Innovation & Opportunity',
  text:
    'A learning environment where academic discipline meets modern technology, so students graduate ready for university, work and community life.',
};

export const INTRO = {
  heading: 'Education that prepares students for what comes next',
  body:
    '[ADD OFFICIAL COLLEGE INTRODUCTION] Himalaya Degree College works to give students a serious academic foundation, practical skills and the confidence to move forward.',
  points: [
    { title: 'Educational purpose', text: 'Quality teaching that builds understanding, not only exam results.' },
    { title: 'Academic environment', text: 'A focused, supportive setting for students and teachers.' },
    { title: 'Student development', text: 'Guidance, activities and habits that build character and leadership.' },
    { title: 'Future-oriented learning', text: 'Technology and career skills that match today\u2019s opportunities.' },
  ],
};

// value: null means "not added yet". Set a number from the admin panel to enable the counter.
export const STATS = [
  { label: 'Programs', value: null, suffix: '+' },
  { label: 'Students', value: null, suffix: '+' },
  { label: 'Faculty members', value: null, suffix: '+' },
  { label: 'Campuses', value: null, suffix: '' },
];

export const MD = {
  name: 'MD Sikandar Hayat',
  designation: 'Managing Director',
  photo: null, // [ADD PHOTO] URL of the approved portrait
  isPlaceholder: true,
  message: [
    '[PLACEHOLDER] Quality education starts with respect for every student\u2019s potential. This section will carry the Managing Director\u2019s approved message to students, parents and the community.',
    '[PLACEHOLDER] Themes to cover: student development, modern technology, future-ready skills, professional growth, community development and better opportunities for students.',
  ],
  vision: '[ADD OFFICIAL VISION STATEMENT]',
  mission: '[ADD OFFICIAL MISSION STATEMENT]',
  goals: '[ADD FUTURE GOALS]',
};


