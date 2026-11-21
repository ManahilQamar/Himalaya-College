import { Link } from 'react-router-dom';
import { SITE } from '../../lib/siteConfig';

// PLACEHOLDER mark (mountain + sun). Replace with the official college logo file when available.
export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="1" y="1" width="62" height="62" rx="13" fill="#173B7A" stroke="#8fa3d1" strokeOpacity=".4" strokeWidth="2" />
      <circle cx="44" cy="20" r="7" fill="#D6A84F" />
      <path d="M6 50 24 22l9 14 6-8 19 22z" fill="#fff" />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="min-w-0 leading-tight">
        <span className={`block font-display text-lg font-semibold ${light ? 'text-white' : 'text-navy-900'}`}>
          {SITE.name}
        </span>
        <span className={`block text-xs ${light ? 'text-navy-200' : 'text-navy-400'}`}>{SITE.address}</span>
      </span>
    </Link>
  );
}




