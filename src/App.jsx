import { useEffect, useState, useCallback } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import Process from './components/Process';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .cta-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Hero onContact={openModal} />
      <Services onContact={openModal} />
      <Stats />
      <Process />
      <CTA onContact={openModal} />
      <Footer onContact={openModal} />
      <ContactModal open={modalOpen} onClose={closeModal} />
    </>
  );
}

export default App;
