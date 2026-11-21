import { Fragment, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Download, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { adminApi } from '../../lib/adminApi';
import { QueryErrorBox, fmtDateTime } from '../shared';
import { ConfirmDialog, useToast } from '../ui';

const STATUSES = ['new', 'contacted', 'closed'];

export default function Admissions() {
  const qc = useQueryClient();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const q = useQuery({ queryKey: ['admin', 'admissions', page, status], queryFn: () => adminApi.admissions.list({ page, status }), placeholderData: (prev) => prev });

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin'] });
  const setSt = useMutation({
    mutationFn: ({ id, value }) => adminApi.admissions.setStatus(id, value),
    onSuccess: refresh,
    onError: (e) => toast(e.message, 'error'),
  });
  const del = useMutation({
    mutationFn: (id) => adminApi.admissions.remove(id),
    onSuccess: () => { toast('Submission deleted'); setToDelete(null); refresh(); },
    onError: (e) => { toast(e.message, 'error'); setToDelete(null); },
  });
  const exportCsv = useMutation({ mutationFn: adminApi.admissions.downloadCsv, onError: (e) => toast(e.message, 'error') });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">Admission interests</h1>
          <p className="mt-1 max-w-2xl text-navy-500">People who used “Express Your Interest”. A submission is not a confirmed admission.</p>
        </div>
        <Button variant="outline" onClick={() => exportCsv.mutate()} disabled={exportCsv.isPending}><Download size={18} aria-hidden="true" /> Export CSV</Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <label htmlFor="status-filter" className="text-sm font-semibold text-navy-800">Show</label>
        <select id="status-filter" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-lg border border-navy-200 bg-white px-3 py-2">
          <option value="">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {q.data && <span className="text-sm text-navy-500">{q.data.total} total</span>}
      </div>

      <div className="mt-4">
        {q.isLoading && <p className="text-navy-500">Loading…</p>}
        {q.isError && <QueryErrorBox query={q} />}
        {q.data?.items.length === 0 && <p className="rounded-xl border border-dashed border-navy-200 bg-paper p-8 text-center text-navy-500">No submissions found.</p>}
        {q.data?.items.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-navy-100 bg-white" tabIndex={0} role="region" aria-label="Admission interests table">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <caption className="sr-only">Admission interests</caption>
              <thead className="bg-paper text-navy-500">
                <tr>{['Received', 'Name', 'Contact', 'Program', 'Status', ''].map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h || 'Actions'}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {q.data.items.map((i) => (
                  <Fragment key={i.id}>
                    <tr>
                      <td className="px-4 py-3 align-top text-navy-500">{fmtDateTime(i.createdAt)}</td>
                      <td className="px-4 py-3 align-top"><p className="font-semibold text-navy-900">{i.fullName}</p><p className="text-navy-500">{i.city}</p></td>
                      <td className="px-4 py-3 align-top"><a href={`tel:${i.phone}`} className="tap hover:underline">{i.phone}</a><a href={`mailto:${i.email}`} className="tap break-all hover:underline">{i.email}</a></td>
                      <td className="px-4 py-3 align-top">{i.preferredProgram}</td>
                      <td className="px-4 py-3 align-top">
                        <select aria-label={`Status for ${i.fullName}`} value={i.status} onChange={(e) => setSt.mutate({ id: i.id, value: e.target.value })} className="rounded-md border border-navy-200 bg-white px-2 py-1">
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" className="!px-3 !py-1.5" aria-expanded={open === i.id} onClick={() => setOpen(open === i.id ? null : i.id)}>
                            Details <ChevronDown size={16} className={open === i.id ? 'rotate-180' : ''} aria-hidden="true" />
                          </Button>
                          <Button variant="ghost" className="!px-3 !py-1.5 !text-red-700" aria-label={`Delete submission from ${i.fullName}`} onClick={() => setToDelete(i)}><Trash2 size={16} aria-hidden="true" /></Button>
                        </div>
                      </td>
                    </tr>
                    {open === i.id && (
                      <tr className="bg-paper">
                        <td colSpan={6} className="px-4 py-3 text-navy-700">
                          <p><span className="font-semibold">Previous qualification:</span> {i.previousQualification}</p>
                          <p className="mt-1 whitespace-pre-wrap"><span className="font-semibold">Message:</span> {i.message || '—'}</p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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

      <ConfirmDialog open={Boolean(toDelete)} title="Delete this submission?" message={`The interest form from ${toDelete?.fullName} will be removed permanently.`}
        busy={del.isPending} onConfirm={() => del.mutate(toDelete.id)} onCancel={() => setToDelete(null)} />
    </div>
  );
}


