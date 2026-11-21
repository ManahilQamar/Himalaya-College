import Button from '../ui/Button';
import EventCard from '../events/EventCard';
import { useEvents } from '../../hooks/useContent';

// Hidden when there is nothing to show, so an empty or failed request never leaves a hole on the home page.
export default function UpcomingEvents() {
  const { data } = useEvents({ status: 'Upcoming' });
  if (!data || data.length === 0) return null;
  return (
    <section className="bg-paper py-16 sm:py-20" aria-labelledby="upcoming-heading">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="upcoming-heading" className="text-3xl sm:text-4xl">Upcoming events and notices</h2>
          <Button to="/events" variant="outline" className="!px-5 !py-2.5">View all</Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.slice(0, 3).map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </div>
    </section>
  );
}


