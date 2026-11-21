import { useSearchParams } from 'react-router-dom';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import QueryState from '../components/ui/QueryState';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import { useEvents } from '../hooks/useContent';

export default function Events() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const status = params.get('status') || '';
  const query = useEvents({ category, status });

  const onChange = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };
  const filtered = Boolean(category || status);

  return (
    <>
      <Seo
        title="Events and announcements"
        description="Latest admissions notices, exam schedules, results, seminars and events at Himalaya Degree College."
        path="/events"
      />
      <PageHero title="Events and announcements" intro="Notices, schedules and campus events from the college." />
      <section className="section-y">
        <div className="container-x">
          <EventFilters category={category} status={status} onChange={onChange} />
          <div className="mt-10" aria-live="polite">
            <QueryState
              query={query}
              skeletons={3}
              emptyTitle={filtered ? 'No events match these filters' : 'No announcements yet'}
              emptyText={filtered ? 'Try a different category or status.' : 'New notices will appear here.'}
            >
              {(events) => {
                const lead = !filtered && events.find((e) => e.isFeatured);
                const rest = lead ? events.filter((e) => e !== lead) : events;
                return (
                  <div className="space-y-6">
                    {lead && <EventCard event={lead} featured headingAs="h2" />}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {rest.map((e) => <EventCard key={e.id} event={e} headingAs="h2" />)}
                    </div>
                  </div>
                );
              }}
            </QueryState>
          </div>
        </div>
      </section>
    </>
  );
}


