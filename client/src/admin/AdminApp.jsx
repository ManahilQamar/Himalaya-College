import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthProvider, useAuth } from './auth';
import { ToastProvider } from './ui';
import AdminLayout from './AdminLayout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Admissions from './pages/Admissions';
import Messages from './pages/Messages';
import ResourcePage from './pages/ResourcePage';
import CollegeEditor from './pages/CollegeEditor';
import Settings from './pages/Settings';
import ActivityLog from './pages/ActivityLog';
import { campusFields, collegeSections, eventFields, programFields, serviceFields } from './resources';
import { fmtDate } from './shared';
import { Badge } from './ui';

function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <p className="p-8 text-navy-500">Loading…</p>;
  if (status === 'unavailable') {
    return (
      <main className="mx-auto max-w-lg p-10">
        <h1 className="text-3xl">Admin needs the server</h1>
        <p className="mt-3 text-navy-600">This website is running without its server (VITE_API_URL is empty), so the admin panel is not available. Start the server and set VITE_API_URL in client/.env.</p>
      </main>
    );
  }
  if (status === 'out') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

const name = (d) => <span className="font-semibold text-navy-900">{d.name || d.title}</span>;
const sub = (t) => <span className="block text-navy-500">{t}</span>;

const eventCols = [
  { label: 'Title', render: (d) => <>{name(d)}{sub(d.category)}</> },
  { label: 'Status', render: (d) => <Badge tone={d.status === 'Upcoming' ? 'gold' : d.status === 'Ongoing' ? 'green' : 'gray'}>{d.status}</Badge> },
  { label: 'Date', render: (d) => fmtDate(d.date) },
  { label: 'Featured', render: (d) => (d.isFeatured ? <Badge tone="gold">navbar</Badge> : '—') },
];
const programCols = [{ label: 'Program', render: (d) => <>{name(d)}{sub(d.qualification)}</> }, { label: 'Duration', render: (d) => d.duration || '—' }];
const campusCols = [{ label: 'Campus', render: (d) => <>{name(d)}{sub(d.location)}</> }, { label: 'Coordinator', render: (d) => d.coordinator?.name || 'Not added' }];
const serviceCols = [{ label: 'Service', render: (d) => <>{name(d)}{sub(d.description)}</> }];

const collegeTabs = [
  { key: 'about', label: 'About page', fields: collegeSections.about },
  { key: 'home', label: 'Home page texts and statistics', fields: collegeSections.home },
  { key: 'contact', label: 'Contact information', fields: collegeSections.contact },
  { key: 'admissions', label: 'Admissions content and dates', fields: collegeSections.admissions },
];

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Helmet>
          <title>Admin | Himalaya Degree College</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Overview />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="messages" element={<Messages />} />
            <Route path="events" element={<ResourcePage title="Events & announcements" singular="Event" resource="events" fields={eventFields} columns={eventCols}
              intro="Admissions notices, exam schedules, results, seminars and events. The featured event appears in the navbar on every page." />} />
            <Route path="disciplines" element={<ResourcePage title="Programs" singular="Program" resource="programs" fields={programFields} columns={programCols} />} />
            <Route path="campuses" element={<ResourcePage title="Campuses" singular="Campus" resource="campuses" fields={campusFields} columns={campusCols}
              intro="Each campus has its own contact details and program coordinator." />} />
            <Route path="services" element={<ResourcePage title="Services" singular="Service" resource="services" fields={serviceFields} columns={serviceCols} />} />
            <Route path="college" element={<CollegeEditor title="College information" tabs={collegeTabs}
              intro="Text that appears across the website. Changes go live as soon as you save." />} />
            <Route path="md-message" element={<CollegeEditor title="Message from the Managing Director"
              intro="Use only text approved by the Managing Director."
              tabs={[{ key: 'mdMessage', label: 'MD message', fields: collegeSections.mdMessage }]} />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}


