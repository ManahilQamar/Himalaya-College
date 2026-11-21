import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { SITE } from '../lib/siteConfig';

// About, Admissions and the home page texts all come from one "college" request, cached once.
const collegeQuery = (select) => ({ queryKey: ['college'], queryFn: api.getCollege, select });
export const useCollege = () => useQuery(collegeQuery());
export const useAbout = () => useQuery(collegeQuery((c) => c.about));
export const useServices = () => useQuery({ queryKey: ['services'], queryFn: api.getServices });
export const usePrograms = () => useQuery({ queryKey: ['programs'], queryFn: api.getPrograms });
export const useProgram = (slug) =>
  useQuery({ queryKey: ['program', slug], queryFn: () => api.getProgram(slug), retry: false });
export const useAdmissions = () => useQuery(collegeQuery((c) => c.admissions));
export const useCampuses = () => useQuery({ queryKey: ['campuses'], queryFn: api.getCampuses });
export const useCampus = (slug) =>
  useQuery({ queryKey: ['campus', slug], queryFn: () => api.getCampus(slug), retry: false });
export const useEvents = (filters = {}) =>
  useQuery({ queryKey: ['events', filters], queryFn: () => api.getEvents(filters) });
export const useEvent = (id) =>
  useQuery({ queryKey: ['event', id], queryFn: () => api.getEvent(id), retry: false });
export const useLatestAnnouncement = () =>
  useQuery({ queryKey: ['announcement'], queryFn: api.getLatestAnnouncement });

// Contact details shown in the footer, contact page and admissions page.
// Editable from the admin panel; the built-in values are only a fallback.
export function useSiteContact() {
  const { data } = useCollege();
  const c = data?.contact;
  return {
    phones: c?.phones?.length ? c.phones : SITE.phones,
    whatsapp: c?.whatsapp || SITE.whatsapp,
    email: c?.email || SITE.email,
    address: c?.address || SITE.address,
    officeHours: c?.officeHours || '[ADD OFFICE HOURS]',
  };
}


