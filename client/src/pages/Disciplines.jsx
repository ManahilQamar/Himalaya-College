import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import QueryState from '../components/ui/QueryState';
import ProgramCard from '../components/content/ProgramCard';
import { usePrograms } from '../hooks/useContent';

export default function Disciplines() {
  const query = usePrograms();
  return (
    <>
      <Seo
        title="Disciplines"
        description="Explore the programs and disciplines at Himalaya Degree College, Swabi: qualification, duration, careers and admission."
        path="/disciplines"
      />
      <PageHero title="Disciplines" intro="Programs, qualifications and the careers they lead to." />
      <section className="section-y">
        <div className="container-x">
          <QueryState query={query} skeletons={3} emptyTitle="No programs published yet" emptyText="Programs will appear here once the college adds them.">
            {(programs) => (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {programs.map((p) => <ProgramCard key={p.id} program={p} headingAs="h2" />)}
              </div>
            )}
          </QueryState>
        </div>
      </section>
    </>
  );
}


