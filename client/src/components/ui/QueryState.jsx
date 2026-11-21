import { AlertCircle, Inbox } from 'lucide-react';
import Button from './Button';

function Skeleton({ rows = 3 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-xl bg-navy-50" />
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-xl border border-dashed border-navy-200 bg-paper px-6 py-12 text-center">
      <Inbox className="mx-auto text-navy-300" size={32} aria-hidden="true" />
      <p className="mt-3 font-display text-xl text-navy-900">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-navy-500">{text}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', text, onRetry }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <AlertCircle className="mx-auto text-red-600" size={32} aria-hidden="true" />
      <p className="mt-3 font-display text-xl text-navy-900">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-navy-600">{text || 'Please check your connection and try again.'}</p>
      {onRetry && <Button variant="outline" className="mt-5" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

// Handles loading, error and empty for any react-query result.
export default function QueryState({ query, emptyTitle, emptyText, skeletons, children }) {
  if (query.isLoading) return <Skeleton rows={skeletons} />;
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />;
  const data = query.data;
  if (Array.isArray(data) && data.length === 0) return <EmptyState title={emptyTitle} text={emptyText} />;
  return children(data);
}


