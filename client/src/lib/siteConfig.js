// Central place for site-wide constants.
// Stage 7/8: most of this will move to the database (CollegeInformation) and be editable from admin.

export const SITE = {
  name: 'Himalaya Degree College',
  shortName: 'HDC',
  address: 'KSK, Razar, Swabi',
  url: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  email: 'hcst.swabi@yahoo.com',
  // TODO: verify with college. "0345-50292935" has one digit more than a normal 11-digit mobile number.
  phones: ['0300-9081968', '0345-50292935', '0344-9501666'],
  whatsapp: '03009081968',
};

export const toTel = (num) => `tel:${num.replace(/[^\d+]/g, '')}`;
// Pakistan: drop leading 0, prefix 92 for wa.me links
export const toWhatsApp = (num) => `https://wa.me/92${num.replace(/\D/g, '').replace(/^0/, '')}`;

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/disciplines', label: 'Disciplines' },
  { to: '/campuses', label: 'Campuses' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/events', label: 'Events', live: true },
  { to: '/contact', label: 'Contact' },
];

export const EVENT_CATEGORIES = [
  'Admissions', 'Examinations', 'Results', 'Seminars', 'Workshops', 'Events', 'Holidays', 'Important Notices',
];
export const EVENT_STATUSES = ['Upcoming', 'Ongoing', 'Completed'];


