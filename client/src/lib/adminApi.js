import { API_URL, usingApi } from './api';

// Admin requests send the session cookie (credentials) and a custom header that blocks cross-site form attacks.
async function call(path, { method = 'GET', body, raw = false } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}/admin${path}`, {
      method,
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error('Could not reach the server'), { status: 0 });
  }
  if (raw && res.ok) return res;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/auth/login')) window.dispatchEvent(new Event('admin-unauthorized'));
    throw Object.assign(new Error(data?.message || 'Request failed'), { status: res.status, errors: data?.errors });
  }
  return data;
}

export const adminAvailable = usingApi;

export const adminApi = {
  login: (email, password) => call('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => call('/auth/logout', { method: 'POST' }),
  me: () => call('/auth/me'),
  logoutAll: () => call('/auth/logout-all', { method: 'POST' }),
  audit: ({ page = 1 } = {}) => call(`/audit?page=${page}&limit=25`),
  changePassword: (body) => call('/auth/password', { method: 'PUT', body }),
  stats: () => call('/stats'),
  college: () => call('/college'),
  saveCollegeSection: (section, body) => call(`/college/${section}`, { method: 'PUT', body }),
  // generic content: programs, services, campuses, events
  resource: (name) => ({
    list: () => call(`/${name}`),
    create: (body) => call(`/${name}`, { method: 'POST', body }),
    update: (id, body) => call(`/${name}/${id}`, { method: 'PUT', body }),
    setPublished: (id, isPublished) => call(`/${name}/${id}/publish`, { method: 'PATCH', body: { isPublished } }),
    remove: (id) => call(`/${name}/${id}`, { method: 'DELETE' }),
  }),
  admissions: {
    list: ({ page = 1, status = '' } = {}) => call(`/admissions?page=${page}&limit=20${status ? `&status=${status}` : ''}`),
    setStatus: (id, status) => call(`/admissions/${id}`, { method: 'PATCH', body: { status } }),
    remove: (id) => call(`/admissions/${id}`, { method: 'DELETE' }),
    async downloadCsv() {
      const res = await call('/admissions/export.csv', { raw: true });
      const url = URL.createObjectURL(await res.blob());
      const a = Object.assign(document.createElement('a'), { href: url, download: 'admission-interests.csv' });
      a.click();
      URL.revokeObjectURL(url);
    },
  },
  messages: {
    list: ({ page = 1, unread = false } = {}) => call(`/messages?page=${page}&limit=20${unread ? '&unread=true' : ''}`),
    setRead: (id, isRead) => call(`/messages/${id}`, { method: 'PATCH', body: { isRead } }),
    remove: (id) => call(`/messages/${id}`, { method: 'DELETE' }),
  },
};


