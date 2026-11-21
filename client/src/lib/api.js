import { ABOUT, ADMISSIONS, CAMPUSES, EVENTS, PROGRAMS, SERVICES } from './placeholderData';
import { INTRO, MD, STATS } from './homeContent';
import { SITE } from './siteConfig';

// Data access layer. Components never call fetch directly.
//  - VITE_API_URL set   -> talks to the Express/MongoDB API (server/)
//  - VITE_API_URL empty -> uses built-in placeholder data, so the frontend also runs on its own
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const usingApi = Boolean(API_URL);

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error('Could not reach the server'), { status: 0 });
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw Object.assign(new Error(data?.message || 'Request failed'), { status: res.status, errors: data?.errors });
  }
  return data;
}

const query = (params = {}) => {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
  return q.toString() ? `?${q}` : '';
};

const remote = {
  getCollege: () => request('/college'),
  getServices: () => request('/services'),
  getPrograms: () => request('/programs'),
  getProgram: (slug) => request(`/programs/${encodeURIComponent(slug)}`),
  getCampuses: () => request('/campuses'),
  getCampus: (slug) => request(`/campuses/${encodeURIComponent(slug)}`),
  getEvents: (filters) => request(`/events${query(filters)}`),
  getEvent: (id) => request(`/events/${encodeURIComponent(id)}`),
  getLatestAnnouncement: () => request('/events/latest'),
  submitInterest: (payload) => request('/admissions', { method: 'POST', body: payload }),
  submitContact: (payload) => request('/contact', { method: 'POST', body: payload }),
};

// ---- placeholder mode (no API) ----
const delay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 150));
const notFound = (what) => Object.assign(new Error(`${what} not found`), { status: 404 });
const STATUS_ORDER = { Ongoing: 0, Upcoming: 1, Completed: 2 };
const published = () => EVENTS.filter((e) => e.isPublished);
const find = (list, key, value, what) => {
  const found = list.find((x) => x[key] === value);
  return found ? delay(found) : Promise.reject(notFound(what));
};

const local = {
  getCollege: () =>
    delay({
      about: ABOUT,
      home: { intro: INTRO, stats: STATS },
      mdMessage: MD,
      admissions: ADMISSIONS,
      contact: { phones: SITE.phones, whatsapp: SITE.whatsapp, email: SITE.email, address: SITE.address },
    }),
  getServices: () => delay(SERVICES),
  getPrograms: () => delay(PROGRAMS),
  getProgram: (slug) => find(PROGRAMS, 'slug', slug, 'Program'),
  getCampuses: () => delay(CAMPUSES),
  getCampus: (slug) => find(CAMPUSES, 'slug', slug, 'Campus'),
  getEvents: ({ category, status } = {}) =>
    delay(
      published()
        .filter((e) => (!category || e.category === category) && (!status || e.status === status))
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
    ),
  getEvent: (id) => find(published(), 'id', id, 'Event'),
  getLatestAnnouncement: () => {
    const live = published().filter((e) => e.status !== 'Completed');
    return delay(live.find((e) => e.isFeatured) || live[0] || null);
  },
  submitInterest: (payload) => delay({ ok: true, name: payload.fullName }), // not stored
  submitContact: (payload) => delay({ ok: true, name: payload.name }), // not stored
};

export const api = usingApi ? remote : local;


