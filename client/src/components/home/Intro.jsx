import { motion, useReducedMotion } from 'framer-motion';
import Counter from '../motion/Counter';
import { useCollege } from '../../hooks/useContent';
import { INTRO, STATS } from '../../lib/homeContent';

const EASE = [0.22, 1, 0.36, 1];

/* Simple inline icons (no extra package needed). Cycled by card position. */
const iconProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const ICONS = [
  // book
  () => (
    <svg {...iconProps}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    </svg>
  ),

  // award
  () => (
    <svg {...iconProps}>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14.5-1.5 6.5 5-3 5 3-1.5-6.5" />
    </svg>
  ),

  // users
  () => (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
    </svg>
  ),

  // compass / future
  () => (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  ),
];

const cardCols = (n) =>
  n === 4
    ? 'sm:grid-cols-2 lg:grid-cols-4'
    : n % 3 === 0
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : 'sm:grid-cols-2';

const statCols = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

/* Makes the gold glow follow the mouse inside a card */
const trackMouse = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`);
};

export default function Intro() {
  const { data } = useCollege();
  const reduceMotion = useReducedMotion();

  // If API data is incomplete, fall back to the local content
  const intro = data?.home?.intro ?? INTRO;

  const points = intro?.points?.length ? intro.points : INTRO.points;

  // Stats without a value are still shown (marked "Not added yet")
  const stats = data?.home?.stats?.length ? data.home.stats : STATS;

  const fade = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: false, amount: 0.25 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  const cardVariants = reduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 40, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: EASE },
        },
      };

  const listVariants = reduceMotion
    ? {}
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      };

  return (
    <section
    
      className="relative flex items-center overflow-hidden bg-[#F8F9FC] py-[clamp(2rem,6vh,4.5rem)] lg:min-h-[100svh]"
      aria-labelledby="intro-heading"
    >
      {/* Dotted texture, fades out towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(23,59,122,0.12)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      {/* Soft glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#D6A84F]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-[#173B7A]/5 blur-3xl"
      />

      {/* Outline rings for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-48 h-[34rem] w-[34rem] rounded-full border border-[#173B7A]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[26rem] w-[26rem] rounded-full border border-[#D6A84F]/20"
      />

      <div className="container-x relative w-full">
        {/* =========================
            HEADER (centered)
        ========================= */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fade(0)}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[#D6A84F]/40 bg-white/70 px-4 py-1.5 text-sm font-semibold text-[#173B7A] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#D6A84F]" />
              About Himalaya College
            </span>

            <h2
              id="intro-heading"
              className="mt-[clamp(0.75rem,2.2vh,1.5rem)] font-display text-[clamp(3rem,5.2vh,3rem)] font-bold leading-[1.12] tracking-tight text-navy-900"
            >
              {intro.heading}
            </h2>

            <motion.span
              aria-hidden="true"
              className="mx-auto mt-[clamp(0.75rem,2.2vh,1.5rem)] block h-1 rounded-full bg-gradient-to-r from-[#D6A84F] to-[#F0D28A]"
              initial={{ width: reduceMotion ? 80 : 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            />
          </motion.div>

          <motion.p
            {...fade(0.12)}
            className="mx-auto mt-[clamp(0.75rem,2.2vh,1.5rem)] max-w-2xl text-base leading-7 text-navy-500 lg:text-lg lg:leading-8"
          >
            {intro.body}
          </motion.p>
        </div>

        {/* =========================
            POINTS
        ========================= */}
        <motion.ul
          className={`mt-[clamp(1.25rem,4.5vh,3rem)] grid gap-[clamp(0.75rem,2vh,1.5rem)] ${cardCols(points.length)}`}
          variants={listVariants}
          initial={reduceMotion ? undefined : 'hidden'}
          whileInView={reduceMotion ? undefined : 'visible'}
          viewport={{ once: false, amount: 0.15 }}
        >
          {points.map((p, i) => {
            const Icon = ICONS[i % ICONS.length];

            return (
              <motion.li
                key={p.title}
                variants={cardVariants}
                onMouseMove={trackMouse}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -8, transition: { duration: 0.25 } }
                }
                className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-[clamp(1.1rem,3vh,2rem)] shadow-[0_12px_40px_rgba(23,59,122,0.07)] transition-shadow duration-500 hover:shadow-[0_28px_65px_rgba(23,59,122,0.25)]"
              >
                {/* Navy fill rising on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-b from-[#173B7A] to-[#0F2A5C] transition-transform duration-500 ease-out group-hover:scale-y-100"
                />

                {/* Gold glow that follows the mouse */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(320px circle at var(--x, 50%) var(--y, 50%), rgba(214,168,79,0.28), transparent 65%)',
                  }}
                />

                {/* Gold top edge */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-[0.3] bg-gradient-to-r from-[#D6A84F] to-[#F0D28A] transition-transform duration-500 group-hover:scale-x-100"
                />

                {/* Large faint icon for depth */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-7 -right-7 text-[#173B7A]/[0.06] transition-colors duration-500 group-hover:text-white/10 [&>svg]:h-32 [&>svg]:w-32"
                >
                  <Icon />
                </span>

                <div className="relative">
                  {/* Icon */}
                  <span className="flex h-[clamp(2.75rem,6.5vh,3.5rem)] w-[clamp(2.75rem,6.5vh,3.5rem)] items-center justify-center rounded-2xl bg-gradient-to-br from-[#173B7A]/10 to-[#173B7A]/5 text-[#173B7A] ring-1 ring-[#173B7A]/10 transition-all duration-500 group-hover:rotate-6 group-hover:bg-[#D6A84F] group-hover:text-[#0F2A5C] group-hover:ring-[#D6A84F]">
                    <Icon />
                  </span>

                  {/* Title */}
                  <h3 className="mt-[clamp(0.75rem,2.4vh,1.5rem)] font-display text-xl font-semibold leading-snug text-navy-900 transition-colors duration-500 group-hover:text-white">
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-[0.95rem] leading-7 text-navy-500 transition-colors duration-500 group-hover:text-white/80">
                    {p.text}
                  </p>

                  {/* Gold line */}
                  <span className="mt-[clamp(0.75rem,2.4vh,1.5rem)] block h-[3px] w-10 rounded-full bg-[#D6A84F] transition-all duration-500 group-hover:w-20" />
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* =========================
            STATS PANEL
        ========================= */}
        {stats.length > 0 && (
          <motion.div
            {...fade(0.1)}
            className="relative mt-[clamp(1rem,3.5vh,2.5rem)] overflow-hidden rounded-3xl bg-gradient-to-br from-[#173B7A] via-[#143270] to-[#0F2A5C] text-white shadow-[0_30px_70px_rgba(15,42,92,0.35)] ring-1 ring-white/10"
          >
            {/* Gold top line */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#D6A84F] to-transparent"
            />

            {/* Glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D6A84F]/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl"
            />

            {/* Fine dotted texture */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:22px_22px]"
            />

            <dl
              aria-label="College at a glance"
              className={`relative grid grid-cols-2 ${
                statCols[stats.length] ?? 'lg:grid-cols-4'
              }`}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  variants={cardVariants}
                  initial={reduceMotion ? undefined : 'hidden'}
                  whileInView={reduceMotion ? undefined : 'visible'}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
                  className="relative flex flex-col-reverse border-white/10 px-4 py-[clamp(1rem,3.4vh,2.25rem)] text-center transition-colors duration-300 hover:bg-white/[0.04] [&:nth-child(even)]:border-l [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0 lg:[&:not(:first-child)]:border-l"
                >
                  {/* Label (shown under the number) */}
                  <dt className="text-sm font-medium text-white/75 sm:text-base">
                    {s.label}

                    {s.value == null && (
                      <span className="mx-auto mt-1.5 block w-fit rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] font-normal text-white/50">
                        Not added yet
                      </span>
                    )}
                  </dt>

                  {/* Small gold divider between number and label */}
                  <span
                    aria-hidden="true"
                    className="mx-auto my-[clamp(0.4rem,1.2vh,0.8rem)] block h-[2px] w-8 rounded-full bg-[#D6A84F]"
                  />

                  {/* Number */}
                  <dd className="font-display text-[clamp(1.9rem,5.2vh,3.4rem)] font-extrabold leading-none tabular-nums">
                    {s.value != null ? (
                      <Counter
                        value={s.value}
                        suffix={s.suffix}
                        suffixClassName="text-[#D6A84F]"
                      />
                    ) : (
                      <span className="text-3xl text-white/40">—</span>
                    )}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        )}
      </div>
    </section>
  );
}