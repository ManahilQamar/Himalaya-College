export function formatDate(iso) {
  if (!iso) return '[ADD DATE]';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '[ADD DATE]';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}


