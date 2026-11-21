import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '../../components/ui/Button';
import { adminApi } from '../../lib/adminApi';
import FormEngine, { toForm, toPayload } from '../FormEngine';
import { QueryErrorBox } from '../shared';
import { useToast } from '../ui';

function SectionForm({ section, fields, college }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [values, setValues] = useState(() => toForm(college[section], fields));
  const [errors, setErrors] = useState({});

  // when the saved data changes (another section saved, or a reload) show the latest
  useEffect(() => { setValues(toForm(college[section], fields)); }, [college, section, fields]);

  const save = useMutation({
    mutationFn: () => adminApi.saveCollegeSection(section, toPayload(values, fields)),
    onSuccess: () => { setErrors({}); toast('Saved. The website now shows your changes.'); qc.invalidateQueries(); },
    onError: (err) => {
      if (err.errors) { setErrors(err.errors); setTimeout(() => document.querySelector('main [aria-invalid="true"]')?.focus(), 0); }
      else toast(err.message, 'error');
    },
  });

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
      <FormEngine fields={fields} value={values} errors={errors} onChange={setValues} />
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save changes'}</Button>
      </div>
    </form>
  );
}

// tabs = [{ key: 'about', label: 'About page', fields }]
export default function CollegeEditor({ title, intro, tabs }) {
  const [active, setActive] = useState(tabs[0].key);
  const q = useQuery({ queryKey: ['admin', 'college'], queryFn: adminApi.college });
  const tab = tabs.find((t) => t.key === active);

  return (
    <div>
      <h1 className="text-3xl">{title}</h1>
      {intro && <p className="mt-1 max-w-2xl text-navy-500">{intro}</p>}
      {tabs.length > 1 && (
        <div role="tablist" aria-label={title} className="mt-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              id={`tab-${t.key}`}
              aria-selected={active === t.key}
              aria-controls="tab-panel"
              onClick={() => setActive(t.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium ${active === t.key ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 text-navy-600 hover:border-navy-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div id="tab-panel" role={tabs.length > 1 ? 'tabpanel' : undefined} aria-labelledby={tabs.length > 1 ? `tab-${active}` : undefined} className="mt-6 rounded-xl border border-navy-100 bg-white p-6">
        {q.isLoading && <p className="text-navy-500">Loading…</p>}
        {q.isError && <QueryErrorBox query={q} />}
        {q.data && <SectionForm key={active} section={active} fields={tab.fields} college={q.data} />}
      </div>
    </div>
  );
}


