import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../lib/adminApi';
import { QueryErrorBox, fmtDateTime } from '../shared';
import { Badge } from '../ui';

function Stat({ label, value, to, alert }) {
  return (
    <Link to={to} className="rounded-xl border border-navy-100 bg-white p-5 transition hover:border-navy-300 hover:shadow-lift">
      <p className="text-sm text-navy-500">{label}</p>
      <p className={`mt-1 font-display text-4xl ${alert && value > 0 ? 'text-campus-600' : 'text-navy-900'}`}>{value}</p>
    </Link>
  );
}

export default function Overview() {
  const q = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminApi.stats });
  if (q.isLoading) return <p className="text-navy-500">Loading…</p>;
  if (q.isError) return <QueryErrorBox query={q} />;
  const s = q.data;
  return (
    <div>
      <h1 className="text-3xl">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Admission interests" value={s.totalInterests} to="/admin/admissions" />
        <Stat label="New (not contacted yet)" value={s.newInterests} to="/admin/admissions" alert />
        <Stat label="Unread messages" value={s.unreadMessages} to="/admin/messages" alert />
        <Stat label="Upcoming events" value={s.upcomingEvents} to="/admin/events" />
        <Stat label="Published programs" value={s.publishedPrograms} to="/admin/disciplines" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="ri">
          <h2 id="ri" className="text-2xl">Latest admission interests</h2>
          {s.recentInterests.length === 0 ? <p className="mt-3 text-navy-500">No submissions yet.</p> : (
            <ul className="mt-3 divide-y divide-navy-100 rounded-xl border border-navy-100 bg-white">
              {s.recentInterests.map((i) => (
                <li key={i.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div><p className="font-semibold text-navy-900">{i.fullName}</p><p className="text-sm text-navy-500">{i.city} · {fmtDateTime(i.createdAt)}</p></div>
                  <Badge tone={i.status === 'new' ? 'green' : 'gray'}>{i.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="rm">
          <h2 id="rm" className="text-2xl">Latest messages</h2>
          {s.recentMessages.length === 0 ? <p className="mt-3 text-navy-500">No messages yet.</p> : (
            <ul className="mt-3 divide-y divide-navy-100 rounded-xl border border-navy-100 bg-white">
              {s.recentMessages.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div><p className="font-semibold text-navy-900">{m.subject}</p><p className="text-sm text-navy-500">{m.name} · {fmtDateTime(m.createdAt)}</p></div>
                  {!m.isRead && <Badge tone="green">unread</Badge>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}


