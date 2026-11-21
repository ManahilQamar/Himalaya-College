import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Disciplines = lazy(() => import('./pages/Disciplines'));
const DisciplineDetail = lazy(() => import('./pages/DisciplineDetail'));
const Campuses = lazy(() => import('./pages/Campuses'));
const CampusDetail = lazy(() => import('./pages/CampusDetail'));
const Admissions = lazy(() => import('./pages/Admissions'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminApp = lazy(() => import('./admin/AdminApp'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      {/* The admin area is a separate bundle with its own layout, never linked from the public site */}
      <Route path="admin/*" element={<Suspense fallback={<p className="p-8 text-navy-500">Loading…</p>}><AdminApp /></Suspense>} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="disciplines" element={<Disciplines />} />
        <Route path="disciplines/:slug" element={<DisciplineDetail />} />
        <Route path="campuses" element={<Campuses />} />
        <Route path="campuses/:slug" element={<CampusDetail />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}


