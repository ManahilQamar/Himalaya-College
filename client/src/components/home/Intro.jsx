import Counter from '../motion/Counter';
import { useCollege } from '../../hooks/useContent';
import { INTRO, STATS } from '../../lib/homeContent';

export default function Intro() {
  // Falls back to the built-in text if the API is unreachable, so the home page never looks broken.
  const { data } = useCollege();
  const intro = data?.home?.intro ?? INTRO;
  const stats = data?.home?.stats ?? STATS;
  return (
    <>
      <section className="section-y" aria-labelledby="intro-heading">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <h2 id="intro-heading" className="text-3xl sm:text-4xl">{intro.heading}</h2>
            <p className="mt-5 max-w-prose text-lg text-navy-500">{intro.body}</p>
          </div>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {intro.points.map((p) => (
              <div key={p.title} className="border-t-2 border-[#173B7A] pt-4">
                <dt className="font-display text-xl text-navy-900">{p.title}</dt>
                <dd className="mt-2 text-navy-500">{p.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-navy-900 text-white" aria-label="College at a glance">
        <dl className="container-x grid grid-cols-2 gap-y-10 py-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col-reverse px-4 text-center ${i % 2 === 1 ? 'border-l border-white/10' : ''} ${i > 0 ? 'lg:border-l lg:border-white/10' : ''}`}
            >
              <dt className="mt-1 text-navy-200">
                {s.label}
                {s.value == null && <span className="block text-xs text-navy-300">Not added yet</span>}
              </dt>
              <dd className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} suffixClassName="text-[#173B7A]" />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}


