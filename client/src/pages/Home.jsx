import Seo from '../components/ui/Seo';
import Hero from '../components/home/Hero';
import Intro from '../components/home/Intro';
import MDMessage from '../components/home/MDMessage';
import UpcomingEvents from '../components/home/UpcomingEvents';
import ApplyBand from '../components/home/ApplyBand';

export default function Home() {
  return (
    <>
      <Seo
        description="Himalaya Degree College, KSK, Razar, Swabi. Empowering students through education, innovation and opportunity."
        path="/"
      />
      <Hero />
      <Intro />
      <MDMessage />
      <UpcomingEvents />
      <ApplyBand />
    </>
  );
}


