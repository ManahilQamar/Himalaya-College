import { AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

export function QueryErrorBox({ query }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <AlertCircle className="mx-auto text-red-600" size={28} aria-hidden="true" />
      <p className="mt-2 text-navy-700">{query.error?.message || 'Something went wrong.'}</p>
      <Button variant="outline" className="mt-4" onClick={() => query.refetch()}>Retry</Button>
    </div>
  );
}

export const fmtDate = (iso) =>
  iso ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso)) : '—';
export const fmtDateTime = (iso) =>
  iso ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '—';


