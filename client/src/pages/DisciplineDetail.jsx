import { useParams } from 'react-router-dom';
import { Clock, GraduationCap } from 'lucide-react';
import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';
import QueryState, { EmptyState } from '../components/ui/QueryState';
import PlaceholderBadge from '../components/ui/PlaceholderBadge';
import { useProgram } from '../hooks/useContent';

export default function DisciplineDetail() {
  const { slug } = useParams();
  const query = useProgram(slug);

  if (query.isError && query.error?.status === 404) {
    return (
      <>
        <Seo title="Program not found" path={`/disciplines/${slug}`} />
        <PageHero
          title="Program not found"
          crumbs={[{ label: 'Disciplines', to: '/disciplines' }, { label: 'Not found' }]}
        />
        <section className="section-y">
        <div className="container-x">
          <EmptyState
            title="This program is not available"
            text="This program does not exist or is no longer published."
            action={<Button to="/disciplines" className="mt-6">See all programs</Button>}
          />
        </div>
        </section>
      </>
    );
  }

  const p = query.data;
  return (
    <>
      <Seo title={p?.name || 'Program'} description={p?.description} path={`/disciplines/${slug}`} />
      <PageHero
        title={p?.name || 'Program'}
        crumbs={[{ label: 'Disciplines', to: '/disciplines' }, { label: p?.name || 'Program' }]}
      />
      <section className="section-y">
        <div className="container-x">
          <QueryState query={query} skeletons={2}>
            {(prog) => (
              <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
                <div className="space-y-10">
                  {prog.isPlaceholder && <PlaceholderBadge />}
                  <div>
                    <h2 className="text-3xl">About this program</h2>
                    <p className="mt-3 max-w-prose text-lg text-navy-500">{prog.description}</p>
                  </div>
                  <div>
                    <h2 className="text-3xl">Career opportunities</h2>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-navy-500">
                      {prog.careers.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-3xl">Admission information</h2>
                    <p className="mt-3 max-w-prose text-navy-500">{prog.admissionInfo}</p>
                  </div>
                </div>
                <aside className="self-start rounded-xl border border-navy-100 bg-paper p-6">
                  <ul className="space-y-4">
                    <li className="flex gap-3"><GraduationCap className="mt-1 text-[#173B7A]" size={20} aria-hidden="true" />
                      <span><span className="block text-sm text-navy-400">Qualification</span>{prog.qualification}</span></li>
                    <li className="flex gap-3"><Clock className="mt-1 text-[#173B7A]" size={20} aria-hidden="true" />
                      <span><span className="block text-sm text-navy-400">Duration</span>{prog.duration}</span></li>
                  </ul>
                  <Button to={`/admissions?program=${prog.slug}#interest`} className="mt-6 w-full">Apply for this program</Button>
                </aside>
              </div>
            )}
          </QueryState>
        </div>
      </section>
    </>
  );
}


