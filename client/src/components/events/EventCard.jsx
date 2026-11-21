import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PlaceholderBadge from '../ui/PlaceholderBadge';
import { formatDate } from '../../lib/format';

export function EventImage({ event, className = '' }) {
  if (event.image) {
    return <img src={event.image} alt="" loading="lazy" className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-navy-800 text-navy-300 ${className}`} aria-hidden="true">
      <CalendarDays size={40} />
    </div>
  );
}

export default function EventCard({ event: e, featured = false, headingAs: Heading = 'h3' }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-navy-100 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lift ${
        featured ? 'md:grid md:grid-cols-2' : ''
      }`}
    >
      <EventImage event={e} className={featured ? 'aspect-[16/9] w-full md:aspect-auto md:h-full' : 'aspect-[16/9] w-full'} />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={e.status} />
          <span className="text-sm text-navy-500">{e.category}</span>
          {e.isPlaceholder && <PlaceholderBadge />}
        </div>
        <Heading className={`mt-3 ${featured ? 'text-3xl' : 'text-2xl'}`}>
          <Link to={`/events/${e.id}`} className="after:absolute after:inset-0 hover:text-navy-600">{e.title}</Link>
        </Heading>
        <p className="mt-2 text-navy-500">{e.shortDescription}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-navy-600">
          <li className="flex items-center gap-2"><CalendarDays size={16} className="text-[#173B7A]" aria-hidden="true" />{formatDate(e.date)}</li>
          <li className="flex items-center gap-2"><MapPin size={16} className="text-[#173B7A]" aria-hidden="true" />{e.location}</li>
        </ul>
      </div>
    </article>
  );
}


