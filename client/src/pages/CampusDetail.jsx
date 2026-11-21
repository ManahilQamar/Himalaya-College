import { useParams } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';
import QueryState, { EmptyState } from '../components/ui/QueryState';
import PlaceholderBadge from '../components/ui/PlaceholderBadge';
import { CampusImage } from '../components/content/CampusCard';
import { useCampus } from '../hooks/useContent';
import { toTel } from '../lib/siteConfig';

function Coordinator({ c }) {
  const hasAny = Object.values(c).some(Boolean);
  return (
    <div>
      <h2 className="text-3xl">Program coordinator</h2>
      {!hasAny ? (
        <p className="mt-3 rounded-xl border border-dashed border-navy-200 bg-paper p-5 text-navy-500">
          [ADD PROGRAM COORDINATOR] Coordinator details have not been added yet.
        </p>
      ) : (
        <div className="mt-4 rounded-xl border border-navy-100 p-6">
          {c.name && <p className="font-display text-2xl text-navy-900">{c.name}</p>}
          {c.designation && <p className="text-navy-500">{c.designation}</p>}
          <ul className="mt-4 space-y-2 text-navy-600">
            {c.phone && <li className="flex gap-2"><Phone size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" /><a href={toTel(c.phone)}>{c.phone}</a></li>}
            {c.email && <li className="flex gap-2"><Mail size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" /><a href={`mailto:${c.email}`}>{c.email}</a></li>}
            {c.officeHours && <li className="flex gap-2"><Clock size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" />{c.officeHours}</li>}
          </ul>
          {c.bio && <p className="mt-4 max-w-prose text-navy-500">{c.bio}</p>}
        </div>
      )}
    </div>
  );
}

export default function CampusDetail() {
  const { slug } = useParams();
  const query = useCampus(slug);

  if (query.isError && query.error?.status === 404) {
    return (
      <>
        <Seo title="Campus not found" path={`/campuses/${slug}`} />
        <PageHero title="Campus not found" crumbs={[{ label: 'Campuses', to: '/campuses' }, { label: 'Not found' }]} />
        <section className="section-y">
          <div className="container-x">
            <EmptyState title="This campus is not available" text="It does not exist or is no longer published."
              action={<Button to="/campuses" className="mt-6">See all campuses</Button>} />
          </div>
        </section>
      </>
    );
  }

  const c = query.data;
  return (
    <>
      <Seo title={c?.name || 'Campus'} description={c?.intro} path={`/campuses/${slug}`} />
      <PageHero title={c?.name || 'Campus'} crumbs={[{ label: 'Campuses', to: '/campuses' }, { label: c?.name || 'Campus' }]} />
      <section className="section-y">
        <div className="container-x">
          <QueryState query={query} skeletons={2}>
            {(campus) => (
              <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
                <div className="space-y-10">
                  <CampusImage campus={campus} className="aspect-[16/8] w-full rounded-xl" />
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl">About this campus</h2>
                      {campus.isPlaceholder && <PlaceholderBadge />}
                    </div>
                    <p className="mt-3 max-w-prose text-lg text-navy-500">{campus.intro}</p>
                  </div>
                  <div>
                    <h2 className="text-3xl">Facilities</h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-navy-500">{campus.facilities.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </div>
                  <div>
                    <h2 className="text-3xl">Programs</h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-navy-500">{campus.programs.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  </div>
                  <Coordinator c={campus.coordinator} />
                </div>
                <aside className="self-start rounded-xl border border-navy-100 bg-paper p-6">
                  <h2 className="text-2xl">Contact this campus</h2>
                  <ul className="mt-4 space-y-3 text-navy-600">
                    <li className="flex gap-2"><MapPin size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" />{campus.contact.address || campus.location}</li>
                    <li className="flex gap-2"><Phone size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" />{campus.contact.phone || '[ADD PHONE]'}</li>
                    <li className="flex gap-2"><Mail size={18} className="mt-1 text-[#173B7A]" aria-hidden="true" />{campus.contact.email || '[ADD EMAIL]'}</li>
                  </ul>
                  <Button to="/admissions#interest" className="mt-6 w-full">Express your interest</Button>
                </aside>
              </div>
            )}
          </QueryState>
        </div>
      </section>
    </>
  );
}


