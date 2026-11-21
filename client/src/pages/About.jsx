import { Link } from 'react-router-dom';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import QueryState from '../components/ui/QueryState';
import ApplyBand from '../components/home/ApplyBand';
import { useAbout } from '../hooks/useContent';

export default function About() {
  const query = useAbout();
  return (
    <>
      <Seo
        title="About us"
        description="Learn about Himalaya Degree College, KSK, Razar, Swabi: our purpose, academic environment and values."
        path="/about"
      />
      <PageHero title="About us" intro="Who we are and what we stand for." />

      <section className="section-y">
        <div className="container-x">
          <QueryState query={query} skeletons={2}>
            {(about) => (
              <>
                <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
                  <div>
                    <h2 className="text-3xl sm:text-4xl">Himalaya Degree College</h2>
                    <p className="mt-5 max-w-prose text-lg text-navy-500">{about.intro}</p>
                    <p className="mt-6 text-navy-500">
                      Read the{' '}
                      <Link to="/#md-heading" className="font-semibold text-navy-800 underline decoration-blue-700 underline-offset-4">
                        message from the Managing Director
                      </Link>
                      .
                    </p>
                  </div>
                  <dl className="divide-y divide-navy-100 self-start rounded-xl border border-navy-100 bg-paper">
                    {about.facts.map((f) => (
                      <div key={f.label} className="px-5 py-4">
                        <dt className="text-sm text-navy-400">{f.label}</dt>
                        <dd className="font-display text-lg text-navy-900">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <h2 className="mt-20 text-3xl">What guides us</h2>
                <ul className="mt-8 divide-y divide-navy-100 border-y border-navy-100">
                  {about.values.map((v) => (
                    <li key={v.title} className="grid gap-1 py-6 sm:grid-cols-[18rem_1fr] sm:gap-8">
                      <h3 className="text-2xl">{v.title}</h3>
                      <p className="text-navy-500">{v.text}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </QueryState>
        </div>
      </section>
      <ApplyBand />
    </>
  );
}


