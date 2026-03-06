import { useState, useEffect } from 'react';
import Icons from './Icons';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="nav-logo"><Icons.Logo /> Uroboros Systems</a>
      <ul className="nav-links">
        <li><a href="#" className="active">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#process">Process</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <a href="#contact" className="nav-cta">Get in touch</a>
    </nav>
  );
}

export default Navbar;
