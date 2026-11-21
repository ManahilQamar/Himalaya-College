import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLatestAnnouncement } from '../../hooks/useContent';

// Shows the latest featured event. Falls back to a generic admissions line so the bar never shifts the layout.
export default function AnnouncementBar() {
  const { data: e } = useLatestAnnouncement();
  const tag = e ? (e.status === 'Completed' ? 'Latest' : e.status) : 'Admissions';
  const text = e ? e.title : 'Learn how to apply to Himalaya Degree College';
  const to = e ? `/events/${e.id}` : '/admissions';

  return (
    <div role="region" aria-label="Latest announcement" className="bg-navy-900 text-sm text-white">
      <Link to={to} className="container-x flex h-9 items-center [@media(pointer:coarse)]:h-11 justify-center gap-3 hover:text-[#173B7A]">
        <span className="shrink-0 rounded bg-[#173B7A] px-2 py-0.5 text-xs font-bold text-navy-900">{tag}</span>
        <span className="truncate">{text}</span>
        <ArrowRight size={16} className="hidden shrink-0 sm:block" aria-hidden="true" />
      </Link>
    </div>
  );
}


