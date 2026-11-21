import { EVENT_CATEGORIES, EVENT_STATUSES } from '../../lib/siteConfig';

function Chips({ label, options, value, onChange }) {
  const cls = (active) =>
    `tap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active ? 'border-navy-900 bg-navy-900 text-white' : 'border-navy-200 text-navy-600 hover:border-navy-400'
    }`;
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={!value} className={cls(!value)} onClick={() => onChange('')}>All</button>
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={value === o} className={cls(value === o)} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

export default function EventFilters({ category, status, onChange }) {
  return (
    <div className="space-y-4">
      <Chips label="Filter by category" options={EVENT_CATEGORIES} value={category} onChange={(v) => onChange({ category: v })} />
      <Chips label="Filter by status" options={EVENT_STATUSES} value={status} onChange={(v) => onChange({ status: v })} />
    </div>
  );
}


