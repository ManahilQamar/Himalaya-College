import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useEvents } from '../../hooks/useContent';

const pad = (n) => String(n).padStart(2, '0');

// Callback ref: element late mount ho tab bhi observer lag jata hai
function useInView(threshold = 0.2) {
  const [node, setNode] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, threshold]);

  return [setNode, visible];
}

function normalize(event, index) {
  const d = event.date ? new Date(event.date) : null;
  const valid = d && !Number.isNaN(d.getTime());
  return {
    image: event.image || event.imageUrl || event.coverImage || null,
    title: event.title || event.name || 'Upcoming Event',
    category: event.category || 'Event',
    description: event.description || '',
    to: event.id ? `/events/${event.id}` : '/events',
    day: valid ? pad(d.getDate()) : pad(index + 1),
    month: valid ? d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Notice',
    label: valid
      ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      : 'Notice',
  };
}

export default function UpcomingEvents() {
  const { data } = useEvents({ status: 'Upcoming' });
  const [ref, inView] = useInView();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [paused, setPaused] = useState(false);

  if (!data || data.length === 0) return null;

  const events = data.slice(0, 4).map(normalize);
  const current = events[active] ?? events[0];
  const multi = events.length > 1;

  const go = (i) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
  };
  const next = () => go((active + 1) % events.length);

  return (
    <section
      ref={ref}
      aria-labelledby="upcoming-heading"
      className={`relative overflow-hidden bg-navy-900 text-white lg:h-[100svh] lg:min-h-[640px] ${
        inView ? 'is-in' : ''
      }`}
    >
      <div className="container-x flex h-full flex-col py-12 lg:py-14">
        {/* Header */}
        <header className="flex items-end justify-between gap-6 border-b border-white/20 pb-5">
          <div>
            <p className="ev-fade text-[11px] font-semibold uppercase tracking-[0.28em] text-[#F5C451]">
              Campus calendar
            </p>
            <h2
              id="upcoming-heading"
              className="mt-3 font-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl"
            >
              <span className="ev-mask">
                <span className="ev-rise">Upcoming events</span>
              </span>
            </h2>
          </div>
          <Link
            to="/events"
            className="ev-link ev-fade pb-1 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ '--d': '300ms' }}
          >
            All events
          </Link>
        </header>

        {/* Body */}
        <div
          className="grid min-h-0 flex-1 gap-8 pt-8 lg:grid-cols-12 lg:gap-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Image stage */}
          <div
            className="ev-fade relative order-1 h-[34svh] overflow-hidden bg-navy-800 lg:order-2 lg:col-span-6 lg:h-auto"
            style={{ '--d': '200ms' }}
          >
            {events.map((e, i) => (
              <div
                key={i}
                aria-hidden="true"
                className={`ev-img ${i === active ? 'is-active' : i === prev ? 'is-prev' : ''}`}
              >
                {e.image ? (
                  <img src={e.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-navy-800 font-display text-[12rem] leading-none text-white/[0.07]">
                    {e.day}
                  </span>
                )}
              </div>
            ))}

            {/* Date box */}
            <div
              key={active}
              className="ev-swap absolute bottom-0 left-0 z-10 flex items-end gap-3 bg-navy-900 px-5 py-4"
            >
              <span className="font-display text-5xl leading-none sm:text-6xl">{current.day}</span>
              <span className="pb-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                {current.month}
              </span>
            </div>

            {/* Counter */}
            <div className="absolute right-4 top-4 z-10 font-mono text-xs tracking-widest text-white/80 mix-blend-difference">
              {pad(active + 1)} / {pad(events.length)}
            </div>
          </div>

          {/* List */}
          <ol
            className="ev-fade order-2 flex flex-col justify-center lg:order-1 lg:col-span-6"
            style={{ '--d': '100ms' }}
          >
            {events.map((e, i) => {
              const isActive = i === active;
              return (
                <li key={i} className="relative border-b border-white/15 first:border-t">
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() => go(i)}
                    onMouseEnter={() => go(i)}
                    onFocus={() => go(i)}
                    className="flex w-full items-baseline gap-5 py-5 text-left"
                  >
                    <span className="w-8 shrink-0 font-mono text-xs text-white/40">{pad(i + 1)}</span>
                    <span
                      className={`flex-1 font-display text-2xl leading-tight transition-colors duration-500 sm:text-3xl ${
                        isActive ? 'text-white' : 'text-white/35 hover:text-white/70'
                      }`}
                    >
                      {e.title}
                    </span>
                    <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.16em] text-white/45 sm:block">
                      {e.label}
                    </span>
                  </button>

                  {/* Expand panel */}
                  <div className={`ev-panel ${isActive ? 'is-open' : ''}`}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="pb-6 pl-[3.25rem]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F5C451]">
                          {e.category}
                        </p>
                        {e.description && (
                          <p className="mt-2 line-clamp-3 max-w-md text-sm leading-relaxed text-white/65">
                            {e.description}
                          </p>
                        )}
                        <Link
                          to={e.to}
                          className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white"
                        >
                          <span className="ev-link">View details</span>
                          <ArrowUpRight
                            size={16}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Autoplay progress: khatam ho to agla event */}
                  {isActive && multi && (
                    <span
                      className="ev-bar absolute bottom-[-1px] left-0 h-px w-full bg-[#F5C451]"
                      style={{ animationPlayState: paused ? 'paused' : 'running' }}
                      onAnimationEnd={next}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}