import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { QueryErrorBox } from '../shared';
import FormEngine, { toForm, toPayload } from '../FormEngine';
import { ConfirmDialog, Modal, Switch, useToast } from '../ui';
import { adminApi } from '../../lib/adminApi';

// One screen for every content type: list, add, edit, publish/unpublish and delete.
export default function ResourcePage({ title, singular, resource, fields, columns, intro }) {
  const api = adminApi.resource(resource);
  const qc = useQueryClient();
  const toast = useToast();
  const list = useQuery({ queryKey: ['admin', resource], queryFn: api.list });
  const [editing, setEditing] = useState(null); // { id?: string, values }
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);

  const refresh = () => qc.invalidateQueries(); // admin lists and the public site both reload

  const save = useMutation({
    mutationFn: ({ id, values }) => (id ? api.update(id, toPayload(values, fields)) : api.create(toPayload(values, fields))),
    onSuccess: (_d, { id }) => {
      toast(id ? `${singular} saved` : `${singular} added`);
      setEditing(null);
      refresh();
    },
    onError: (err) => {
      if (err.errors) {
        setErrors(err.errors);
        setTimeout(() => document.querySelector('dialog [aria-invalid="true"]')?.focus(), 0);
      } else toast(err.message, 'error');
    },
  });
  const publish = useMutation({
    mutationFn: ({ id, value }) => api.setPublished(id, value),
    onSuccess: (doc) => { toast(doc.isPublished ? `${singular} published` : `${singular} hidden from the website`); refresh(); },
    onError: (err) => toast(err.message, 'error'),
  });
  const remove = useMutation({
    mutationFn: (id) => api.remove(id),
    onSuccess: () => { toast(`${singular} deleted`); setToDelete(null); refresh(); },
    onError: (err) => { toast(err.message, 'error'); setToDelete(null); },
  });

  const openForm = (doc) => { setErrors({}); setEditing({ id: doc?.id, values: toForm(doc, fields) }); };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">{title}</h1>
          {intro && <p className="mt-1 max-w-2xl text-navy-500">{intro}</p>}
        </div>
        <Button onClick={() => openForm(null)}><Plus size={18} aria-hidden="true" /> Add {singular.toLowerCase()}</Button>
      </div>

      <div className="mt-6">
        {list.isLoading && <p className="text-navy-500">Loading…</p>}
        {list.isError && <QueryErrorBox query={list} />}
        {list.data && list.data.length === 0 && (
          <p className="rounded-xl border border-dashed border-navy-200 bg-paper p-8 text-center text-navy-500">
            Nothing here yet. Use “Add {singular.toLowerCase()}” to create the first one.
          </p>
        )}
        {list.data?.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-navy-100 bg-white" tabIndex={0} role="region" aria-label={`${title} table`}>
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">{title}</caption>
              <thead className="bg-paper text-navy-500">
                <tr>
                  {columns.map((c) => <th key={c.label} scope="col" className="px-4 py-3 font-semibold">{c.label}</th>)}
                  <th scope="col" className="px-4 py-3 font-semibold">Published</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {list.data.map((doc) => (
                  <tr key={doc.id}>
                    {columns.map((c) => <td key={c.label} className="px-4 py-3 align-top">{c.render(doc)}</td>)}
                    <td className="px-4 py-3">
                      <Switch
                        checked={doc.isPublished}
                        label={`${doc.isPublished ? 'Unpublish' : 'Publish'} ${doc.title || doc.name}`}
                        disabled={publish.isPending}
                        onChange={(value) => publish.mutate({ id: doc.id, value })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" className="!px-3 !py-1.5" onClick={() => openForm(doc)} aria-label={`Edit ${doc.title || doc.name}`}>
                          <Pencil size={16} aria-hidden="true" /> Edit
                        </Button>
                        <Button variant="ghost" className="!px-3 !py-1.5 !text-red-700" onClick={() => setToDelete(doc)} aria-label={`Delete ${doc.title || doc.name}`}>
                          <Trash2 size={16} aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={Boolean(editing)} title={editing?.id ? `Edit ${singular.toLowerCase()}` : `Add ${singular.toLowerCase()}`} onClose={() => setEditing(null)} wide>
        {editing && (
          <form
            noValidate
            onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}
          >
            <FormEngine fields={fields} value={editing.values} errors={errors} onChange={(values) => setEditing({ ...editing, values })} />
            {errors.form && <p role="alert" className="mt-4 text-sm text-red-700">{errors.form}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save'}</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete ${singular.toLowerCase()}?`}
        message={`“${toDelete?.title || toDelete?.name}” will be removed permanently. This cannot be undone. To hide it without deleting, switch Published off instead.`}
        busy={remove.isPending}
        onConfirm={() => remove.mutate(toDelete.id)}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}


