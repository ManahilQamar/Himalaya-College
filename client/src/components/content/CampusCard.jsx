import { Link } from 'react-router-dom';
import { Building2, MapPin } from 'lucide-react';
import PlaceholderBadge from '../ui/PlaceholderBadge';

export function CampusImage({ campus, className = '' }) {
  if (campus.image) {
    return <img src={campus.image} alt={`${campus.name} campus`} loading="lazy" className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex items-center justify-center bg-navy-800 text-navy-300 ${className}`} role="img" aria-label="Campus image placeholder">
      <Building2 size={44} aria-hidden="true" />
    </div>
  );
}

export default function CampusCard({ campus: c, headingAs: Heading = 'h3' }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-navy-100 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lift">
      <CampusImage campus={c} className="aspect-[16/9] w-full" />
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <Heading className="text-2xl">
            <Link to={`/campuses/${c.slug}`} className="after:absolute after:inset-0 hover:text-navy-600">{c.name}</Link>
          </Heading>
          {c.isPlaceholder && <PlaceholderBadge />}
        </div>
        <p className="mt-2 flex items-center gap-2 text-sm text-navy-500">
          <MapPin size={16} className="text-[#173B7A]" aria-hidden="true" />{c.location}
        </p>
        <p className="mt-3 text-navy-500">{c.intro}</p>
      </div>
    </article>
  );
}


