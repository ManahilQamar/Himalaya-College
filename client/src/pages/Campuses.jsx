import Seo from '../components/ui/Seo';
import PageHero from '../components/ui/PageHero';
import QueryState from '../components/ui/QueryState';
import CampusCard from '../components/content/CampusCard';
import { useCampuses } from '../hooks/useContent';

export default function Campuses() {
  const query = useCampuses();
  return (
    <>
      <Seo
        title="Campuses"
        description="Campuses of Himalaya Degree College: locations, facilities, programs and program coordinators."
        path="/campuses"
      />
      <PageHero title="Campuses" intro="Locations, facilities and the people to contact at each campus." />
      <section className="section-y">
        <div className="container-x">
          <QueryState query={query} skeletons={2} emptyTitle="No campuses published yet" emptyText="Campus details will appear here once the college adds them.">
            {(campuses) => (
              <div className="grid gap-6 md:grid-cols-2">
                {campuses.map((c) => <CampusCard key={c.id} campus={c} headingAs="h2" />)}
              </div>
            )}
          </QueryState>
        </div>
      </section>
    </>
  );
}


