import { Link } from 'react-router-dom';
import { SITE } from '../../lib/siteConfig';

export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <img
      src="/images/Logo.jpeg"
      alt="Himalaya College Logo"
      className={`${className} object-contain`}
    />
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <LogoMark className="h-12 w-12 shrink-0" />

      <span className="min-w-0 leading-tight">
        <span
          className={`block font-display text-lg font-semibold ${
            light ? 'text-white' : 'text-navy-900'
          }`}
        >
          {SITE.name}
        </span>

        <span
          className={`block text-xs ${
            light ? 'text-navy-200' : 'text-navy-400'
          }`}
        >
          {SITE.address}
        </span>
      </span>
    </Link>
  );
}