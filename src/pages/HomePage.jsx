import Hero from '../components/Hero';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Process from '../components/Process';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { getHomeSeo } from '../seo/pageSeo';
import { useSeo } from '../hooks/useSeo';

function HomePage({ onContact }) {
  useSeo(getHomeSeo());

  return (
    <>
      <Hero onContact={onContact} currentPath="/" />
      <Services onContact={onContact} />
      <Stats />
      <Process />
      <CTA onContact={onContact} />
      <Footer onContact={onContact} currentPath="/" />
    </>
  );
}

export default HomePage;
