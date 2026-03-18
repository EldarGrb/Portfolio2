import { useMemo } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Stats from '../components/Stats';
import Process from '../components/Process';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import { SITE_URL } from '../data/insights/articles';
import { useSeo } from '../hooks/useSeo';

function HomePage({ onContact }) {
  const schemas = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Uroboros Systems',
      url: SITE_URL,
      description: 'Software systems for growing businesses: websites, web apps, AI-enhanced workflows, and practical automation.',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: 'English',
      },
    },
  ], []);

  useSeo({
    title: 'Uroboros Systems — Websites, Web Apps, and AI Workflows',
    description: 'Uroboros Systems builds websites, web apps, AI-enhanced workflows, and practical software systems for small businesses and founders.',
    canonical: `${SITE_URL}/`,
    url: `${SITE_URL}/`,
    type: 'website',
    schemas,
  });

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
