import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-navy-200">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-white">{item.label}</span>
              ) : (
                <>
                  <Link to={item.to} className="tap hover:text-white">{item.label}</Link>
                  <ChevronRight size={14} aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


