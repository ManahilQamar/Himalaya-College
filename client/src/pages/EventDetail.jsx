import { useParams } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Tag } from 'lucide-react';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';
import QueryState, { EmptyState } from '../components/ui/QueryState';
import PlaceholderBadge from '../components/ui/PlaceholderBadge';
import StatusBadge from '../components/events/StatusBadge';
import { EventImage } from '../components/events/EventCard';
import { useEvent } from '../hooks/useContent';
import { formatDate } from '../lib/format';

export default function EventDetail() {
  const { id } = useParams();
  const query = useEvent(id);

  if (query.isError && query.error?.status === 404) {
    return (
      <>
        <Seo title="Event not found" path={`/events/${id}`} />
        <PageHero title="Event not found" crumbs={[{ label: 'Events', to: '/events' }, { label: 'Not found' }]} />
        <section className="section-y">
          <div className="container-x">
            <EmptyState title="This announcement is not available" text="It does not exist or is no longer published."
              action={<Button to="/events" className="mt-6">See all events</Button>} />
          </div>
        </section>
      </>
    );
  }

  const e = query.data;
  return (
    <>
      <Seo title={e?.title || 'Event'} description={e?.shortDescription} path={`/events/${id}`} image={e?.image || undefined} />
      <PageHero
        title={e?.title || 'Event'}
        crumbs={[{ label: 'Events', to: '/events' }, { label: e?.title || 'Event' }]}
      />
      <section className="section-y">
        <div className="container-x">
          <QueryState query={query} skeletons={2}>
            {(ev) => (
              <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
                <div className="space-y-8">
                  <EventImage event={ev} className="aspect-[16/8] w-full rounded-xl" />
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={ev.status} />
                    {ev.isPlaceholder && <PlaceholderBadge />}
                  </div>
                  <div className="space-y-4 text-lg text-navy-600">
                    {ev.fullDescription.split('\n\n').map((para, i) => <p key={i} className="max-w-prose">{para}</p>)}
                  </div>
                </div>
                <aside className="self-start rounded-xl border border-navy-100 bg-paper p-6">
                  <h2 className="text-2xl">Details</h2>
                  <dl className="mt-4 space-y-4">
                    {[
                      [Tag, 'Category', ev.category],
                      [CalendarDays, 'Date', formatDate(ev.date)],
                      [Clock, 'Time', ev.time],
                      [MapPin, 'Location', ev.location],
                    ].map(([Icon, label, value]) => (
                      <div key={label}>
                        <dt className="flex items-center gap-2 text-sm text-navy-500"><Icon size={18} className="text-[#173B7A]" aria-hidden="true" />{label}</dt>
                        <dd className="pl-7 text-navy-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Button to="/events" variant="outline" className="mt-6 w-full">All announcements</Button>
                </aside>
              </div>
            )}
          </QueryState>
        </div>
      </section>
    </>
  );
}


