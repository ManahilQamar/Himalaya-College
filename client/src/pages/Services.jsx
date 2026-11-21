import * as Icons from 'lucide-react';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import QueryState from '../components/ui/QueryState';
import PlaceholderBadge from '../components/ui/PlaceholderBadge';
import { useServices } from '../hooks/useContent';

export default function Services() {
  const query = useServices();
  return (
    <>
      <Seo
        title="Services"
        description="Academic support, student guidance, career development and learning resources at Himalaya Degree College."
        path="/services"
      />
      <PageHero title="Services" intro="Support for students at every step of their time at the college." />
      <section className="section-y">
        <div className="container-x">
          <QueryState query={query} skeletons={6} emptyTitle="No services published yet" emptyText="Check back soon.">
            {(services) => (
              <ul className="grid gap-x-14 gap-y-2 md:grid-cols-2">
                {services.map((s) => {
                  const Icon = Icons[s.icon] || Icons.Circle;
                  return (
                    <li key={s.id} className="flex gap-5 border-b border-navy-100 py-7">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-[#173B7A]">
                        <Icon size={24} aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="flex flex-wrap items-center gap-2 text-2xl">
                          {s.title}
                          {s.isPlaceholder && <PlaceholderBadge />}
                        </h2>
                        <p className="mt-2 text-navy-500">{s.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </QueryState>
        </div>
      </section>
    </>
  );
}


