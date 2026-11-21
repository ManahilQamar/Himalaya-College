import { Plus, Trash2 } from 'lucide-react';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';

// ---- helpers: forms are described by a list of field definitions ----
export const getIn = (obj, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), obj);
export function setIn(obj, path, value) {
  const [head, ...rest] = path.split('.');
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  const key = Array.isArray(obj) ? Number(head) : head;
  copy[key] = rest.length ? setIn(obj?.[key] ?? {}, rest.join('.'), value) : value;
  return copy;
}

// server document -> form values
export function toForm(doc, fields) {
  let out = {};
  fields.forEach((f) => {
    const v = getIn(doc || {}, f.name);
    let next;
    if (f.type === 'repeater') next = (v || []).map((item) => toForm(item, f.fields));
    else if (f.type === 'lines') next = v || [];
    else if (f.type === 'checkbox') next = v ?? f.default ?? false;
    else if (f.type === 'number') next = v ?? '';
    else if (f.type === 'date') next = v ? String(v).slice(0, 10) : '';
    else next = v ?? f.default ?? '';
    out = setIn(out, f.name, next);
  });
  return out;
}

// form values -> request body
export function toPayload(values, fields) {
  let out = {};
  fields.forEach((f) => {
    const v = getIn(values, f.name);
    let next;
    if (f.type === 'repeater') next = (v || []).map((item) => toPayload(item, f.fields));
    else if (f.type === 'lines') next = (v || []).map((s) => s.trim()).filter(Boolean);
    else if (f.type === 'number') next = v === '' || v == null ? (f.nullable ? null : undefined) : Number(v);
    else if (f.type === 'date') next = v || null;
    else next = v;
    if (next !== undefined) out = setIn(out, f.name, next);
  });
  return out;
}

function Repeater({ field, value, onChange, errors, path }) {
  const items = value || [];
  const blank = () => toForm({}, field.fields);
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 text-sm font-semibold text-navy-800">{field.label}</legend>
      {field.hint && <p className="mb-2 text-sm text-navy-500">{field.hint}</p>}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-navy-100 bg-paper p-4">
            <FormEngine
              fields={field.fields}
              value={item}
              prefix={`${path}.${i}.`}
              errors={errors}
              onChange={(next) => onChange(items.map((x, j) => (j === i ? next : x)))}
            />
            <Button
              variant="ghost"
              className="mt-3 !px-3 !py-1.5 !text-red-700"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              aria-label={`Remove ${field.label} item ${i + 1}`}
            >
              <Trash2 size={16} aria-hidden="true" /> Remove
            </Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-navy-400">Nothing added yet.</p>}
      </div>
      <Button variant="outline" className="mt-3 !px-4 !py-2" onClick={() => onChange([...items, blank()])}>
        <Plus size={16} aria-hidden="true" /> {field.addLabel || 'Add'}
      </Button>
    </fieldset>
  );
}

export default function FormEngine({ fields, value, onChange, errors = {}, prefix = '' }) {
  const set = (name, v) => onChange(setIn(value, name, v));
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const path = prefix + f.name;
        const v = getIn(value, f.name);
        const err = errors[path];
        const span = f.full || ['textarea', 'lines', 'repeater', 'checkbox'].includes(f.type) ? 'sm:col-span-2' : '';

        if (f.type === 'repeater') {
          return <Repeater key={f.name} field={f} value={v} errors={errors} path={path} onChange={(next) => set(f.name, next)} />;
        }
        if (f.type === 'checkbox') {
          return (
            <label key={f.name} className={`flex items-start gap-3 ${span}`}>
              <input type="checkbox" className="mt-1 h-5 w-5 accent-navy-800" checked={Boolean(v)} onChange={(e) => set(f.name, e.target.checked)} />
              <span>
                <span className="font-semibold text-navy-800">{f.label}</span>
                {f.hint && <span className="block text-sm text-navy-500">{f.hint}</span>}
              </span>
            </label>
          );
        }
        const common = { label: f.label, required: f.required, error: err, className: span };
        if (f.type === 'textarea') {
          return <Field key={f.name} {...common} as="textarea" rows={f.rows || 4} value={v} onChange={(e) => set(f.name, e.target.value)} />;
        }
        if (f.type === 'lines') {
          return (
            <Field key={f.name} {...common} as="textarea" rows={f.rows || 4} value={(v || []).join('\n')} placeholder={f.hint || 'One per line'}
              onChange={(e) => set(f.name, e.target.value.split('\n'))} />
          );
        }
        if (f.type === 'select') {
          return (
            <Field key={f.name} {...common} as="select" value={v} onChange={(e) => set(f.name, e.target.value)}>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </Field>
          );
        }
        if (f.type === 'number') {
          return <Field key={f.name} {...common} type="number" min="0" value={v} onChange={(e) => set(f.name, e.target.value === '' ? '' : Number(e.target.value))} />;
        }
        return (
          <Field key={f.name} {...common} type={f.type || 'text'} value={v} placeholder={f.placeholder}
            onChange={(e) => set(f.name, e.target.value)} />
        );
      })}
    </div>
  );
}


