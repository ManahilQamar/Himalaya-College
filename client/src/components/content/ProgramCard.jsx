import { Link } from 'react-router-dom';
import { Clock, GraduationCap } from 'lucide-react';
import Button from '../ui/Button';
import PlaceholderBadge from '../ui/PlaceholderBadge';

export default function ProgramCard({ program: p, headingAs: Heading = 'h3' }) {
  return (
    <article className="group relative flex flex-col rounded-xl border border-navy-100 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <Heading className="text-2xl">
          <Link to={`/disciplines/${p.slug}`} className="after:absolute after:inset-0 hover:text-navy-600">
            {p.name}
          </Link>
        </Heading>
        {p.isPlaceholder && <PlaceholderBadge />}
      </div>
      <p className="mt-3 text-navy-500">{p.description}</p>
      <ul className="mt-5 space-y-2 text-sm text-navy-600">
        <li className="flex items-center gap-2"><GraduationCap size={18} className="text-[#173B7A]" aria-hidden="true" />{p.qualification}</li>
        <li className="flex items-center gap-2"><Clock size={18} className="text-[#173B7A]" aria-hidden="true" />{p.duration}</li>
      </ul>
      <div className="relative z-10 mt-6 flex flex-wrap gap-2 pt-1">
        <Button to={`/admissions?program=${p.slug}#interest`} className="!px-4 !py-2">Apply</Button>
        <Button to={`/disciplines/${p.slug}`} variant="ghost" className="!px-4 !py-2">View details</Button>
      </div>
    </article>
  );
}


