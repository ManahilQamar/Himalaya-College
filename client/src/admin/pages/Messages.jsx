import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MailOpen, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { adminApi } from '../../lib/adminApi';
import { QueryErrorBox, fmtDateTime } from '../shared';
import { Badge, ConfirmDialog, useToast } from '../ui';

export default function Messages() {
  const qc = useQueryClient();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [unread, setUnread] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const q = useQuery({ queryKey: ['admin', 'messages', page, unread], queryFn: () => adminApi.messages.list({ page, unread }), placeholderData: (prev) => prev });

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin'] });
  const setRead = useMutation({ mutationFn: ({ id, value }) => adminApi.messages.setRead(id, value), onSuccess: refresh, onError: (e) => toast(e.message, 'error') });
  const del = useMutation({
    mutationFn: (id) => adminApi.messages.remove(id),
    onSuccess: () => { toast('Message deleted'); setToDelete(null); refresh(); },
    onError: (e) => { toast(e.message, 'error'); setToDelete(null); },
  });

  return (
    <div>
      <h1 className="text-3xl">Messages</h1>
      <p className="mt-1 text-navy-500">Messages sent from the Contact page. Reply by email or phone from the details shown.</p>
      <label className="mt-5 flex items-center gap-3">
        <input type="checkbox" className="h-5 w-5 accent-navy-800" checked={unread} onChange={(e) => { setUnread(e.target.checked); setPage(1); }} />
        <span className="font-semibold text-navy-800">Show unread only</span>
      </label>

      <div className="mt-4 space-y-3">
        {q.isLoading && <p className="text-navy-500">Loading…</p>}
        {q.isError && <QueryErrorBox query={q} />}
        {q.data?.items.length === 0 && <p className="rounded-xl border border-dashed border-navy-200 bg-paper p-8 text-center text-navy-500">{unread ? 'No unread messages.' : 'No messages yet.'}</p>}
        {q.data?.items.map((m) => (
          <article key={m.id} className={`rounded-xl border bg-white p-5 ${m.isRead ? 'border-navy-100' : 'border-campus-500'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 text-xl">{m.subject} {!m.isRead && <Badge tone="green">unread</Badge>}</h2>
                <p className="mt-1 text-sm text-navy-500">{m.name} · {fmtDateTime(m.createdAt)}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => setRead.mutate({ id: m.id, value: !m.isRead })}>
                  <MailOpen size={16} aria-hidden="true" /> {m.isRead ? 'Mark unread' : 'Mark read'}
                </Button>
                <Button variant="ghost" className="!px-3 !py-1.5 !text-red-700" aria-label={`Delete message from ${m.name}`} onClick={() => setToDelete(m)}><Trash2 size={16} aria-hidden="true" /></Button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-navy-700">{m.message}</p>
            <p className="mt-3 text-sm"><a href={`mailto:${m.email}`} className="font-semibold text-navy-800 hover:underline">{m.email}</a> · <a href={`tel:${m.phone}`} className="hover:underline">{m.phone}</a></p>
          </article>
        ))}
      </div>
      {q.data && q.data.pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-navy-500">Page {q.data.page} of {q.data.pages}</span>
          <Button variant="outline" disabled={page >= q.data.pages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}
      <ConfirmDialog open={Boolean(toDelete)} title="Delete this message?" message={`The message from ${toDelete?.name} will be removed permanently.`}
        busy={del.isPending} onConfirm={() => del.mutate(toDelete.id)} onCancel={() => setToDelete(null)} />
    </div>
  );
}


