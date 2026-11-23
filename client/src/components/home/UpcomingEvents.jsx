import ChromaGrid from '../ChromaGrid';
import { useEvents } from '../../hooks/useContent';

// Hidden when there is nothing to show, so an empty or failed request never leaves a hole on the home page.
export default function UpcomingEvents() {
  const { data } = useEvents({ status: 'Upcoming' });

  if (!data || data.length === 0) return null;

  const items = data.slice(0, 3).map((event, index) => ({
    image:
      event.image ||
      event.imageUrl ||
      event.coverImage ||
      '/images/event-placeholder.png',

    title: event.title || event.name || 'Upcoming Event',

    subtitle:
      event.date ||
      event.category ||
      event.description ||
      'Upcoming event',

    accent:
      index === 0
        ? '#173B7A'
        : index === 1
          ? '#D6A84F'
          : '#4C6FAE',

    url: event.id ? `/events/${event.id}` : undefined,
  }));

  return (
    <section
      className="bg-paper py-16 sm:py-20"
      aria-labelledby="upcoming-heading"
    >
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="upcoming-heading"
              className="text-3xl sm:text-4xl"
            >
              Upcoming events and notices
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-navy-500">
              Stay updated with the latest events, activities and notices
              from Himalaya Degree College.
            </p>
          </div>

          <a
            href="/events"
            className="inline-flex items-center rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-800 transition hover:border-navy-900 hover:bg-navy-900 hover:text-white"
          >
            View all
          </a>
        </div>

        <div className="mt-8">
          <ChromaGrid
            items={items}
            columns={3}
            minCardWidth={220}
            gap={18}
            radius={260}
            softness={0.6}
            damping={0.45}
            fadeOut={0.6}
            grayscale={1}
            dim={0.12}
            glow={0.5}
            borderGlow={1}
            reveal="spotlight"
            aspectRatio="3 / 2"
            cardRadius={22}
            showInfo={true}
            frame={false}
            theme="light"
          />
        </div>
      </div>
    </section>
  );
}