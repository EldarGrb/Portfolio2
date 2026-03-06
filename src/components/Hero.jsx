import { useState, useEffect } from 'react';
import Icons from './Icons';
import { marqueeItems } from '../data/marqueeData';
import TripBackground from './TripBackground';

function Hero({ onContact }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="hero-wrapper">
      <section className="hero-card">
        <TripBackground />
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <a href="#" className="nav-logo"><Icons.Logo /> Uroboros Systems</a>
          <ul className="nav-links">
            <li><a href="#" className="active">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button className="nav-cta" onClick={onContact}>Get in touch</button>
        </nav>
        <div className="hero-content">
          <h1>Built for your vision, focused on results.</h1>
          <a href="#services" className="btn-primary hero-cta-btn">Explore our services</a>
        </div>
      </section>
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => {
            const Icon = Icons[item.icon];
            return (
              <div className="marquee-item" key={i}>
                <Icon />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Hero;
