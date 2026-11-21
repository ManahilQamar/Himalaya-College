import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { adminApi } from '../../lib/adminApi';
import { QueryErrorBox, fmtDateTime } from '../shared';
import { Badge } from '../ui';

const SECURITY = new Set(['login_failed', 'account_locked', 'password_changed', 'logout_all']);
const sentence = (e) => {
  const what = e.label ? `${e.target}: ${e.label}` : e.target;
  switch (e.action) {
    case 'login': return 'Signed in';
    case 'login_failed': return 'Failed sign-in attempt';
    case 'account_locked': return 'Account locked after repeated failed sign-ins';
    case 'password_changed': return 'Changed password';
    case 'logout_all': return 'Signed out of all devices';
    case 'create': return `Created ${what}`;
    case 'update': return `Edited ${what}`;
    case 'publish': return `Published ${what}`;
    case 'unpublish': return `Unpublished ${what}`;
    case 'delete': return `Deleted ${what}`;
    case 'save': return `Saved ${what}`;
    case 'export': return `Exported ${what}`;
    default: return `${e.action} ${what}`;
  }
};

export default function ActivityLog() {
  const [page, setPage] = useState(1);
  const q = useQuery({ queryKey: ['admin', 'audit', page], queryFn: () => adminApi.audit({ page }), placeholderData: (prev) => prev });
  return (
    <div>
      <h1 className="text-3xl">Activity log</h1>
      <p className="mt-1 max-w-2xl text-navy-500">Who signed in and what was changed, kept for 180 days. If you see a sign-in you do not recognise, change your password in Settings.</p>
      <div className="mt-6">
        {q.isLoading && <p className="text-navy-500">Loading…</p>}
        {q.isError && <QueryErrorBox query={q} />}
        {q.data?.items.length === 0 && <p className="rounded-xl border border-dashed border-navy-200 bg-paper p-8 text-center text-navy-500">No activity yet.</p>}
        {q.data?.items.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-navy-100 bg-white" tabIndex={0} role="region" aria-label="Activity log table">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">Activity log</caption>
              <thead className="bg-paper text-navy-500">
                <tr>{['When', 'Who', 'What', 'IP address'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {q.data.items.map((e) => (
                  <tr key={e.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-navy-500">{fmtDateTime(e.createdAt)}</td>
                    <td className="px-4 py-3">{e.adminEmail || '—'}</td>
                    <td className="px-4 py-3">{sentence(e)} {SECURITY.has(e.action) && <Badge tone={e.action === 'password_changed' || e.action === 'logout_all' ? 'gold' : 'red'}>security</Badge>}</td>
                    <td className="px-4 py-3 text-navy-500">{e.ip || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {q.data && q.data.pages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="text-sm text-navy-500">Page {q.data.page} of {q.data.pages}</span>
            <Button variant="outline" disabled={page >= q.data.pages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}


