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
      <section className="about-teaser section" id="about" aria-labelledby="about-teaser-title">
        <div className="about-teaser-inner">
          <div className="about-teaser-copy">
            <p className="section-label">About</p>
            <h2 id="about-teaser-title">The person behind the work.</h2>
            <p>
              I&apos;m Eldar Jahic, and I build practical software systems for teams that want less
              friction, clearer communication, and a steadier way to ship.
            </p>
          </div>
          <div className="about-teaser-actions">
            <a href="/about" className="btn-secondary">
              About
            </a>
            <button
              type="button"
              className="btn-primary"
              onClick={() => onContact({ cta_label: 'Start a project', cta_placement: 'home_about_teaser' })}
            >
              Start a project
            </button>
          </div>
        </div>
      </section>
      <Services onContact={onContact} />
      <Stats />
      <Process />
      <CTA onContact={onContact} />
      <Footer onContact={onContact} currentPath="/" />
    </>
  );
}

export default HomePage;
