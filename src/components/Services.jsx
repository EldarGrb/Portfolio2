import { useState } from 'react';
import Icons from './Icons';
import { services } from '../data/servicesData';
import { useFadeIn } from '../hooks/useFadeIn';

function Services({ onContact }) {
  const [active, setActive] = useState(0);
  const ref = useFadeIn();
  return (
    <section className="section services" id="services" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="services-header">
        <h2 className="section-title">Expert services that move your project forward</h2>
        <button className="btn-secondary" onClick={onContact}>Get started</button>
      </div>
      <div className="services-content">
        <div className="service-accordion">
          {services.map((s, i) => {
            const Icon = Icons[s.icon];
            return (
              <div className={`service-item ${i === active ? 'active' : ''}`} key={i} onClick={() => setActive(i)}>
                <div className="service-header">
                  <span className="service-header-icon"><Icon /></span>
                  <h3>{s.title}</h3>
                </div>
                <div className="service-body">
                  <div className="service-body-inner">
                    <p>{s.description}</p>
                    <div className="service-tags">
                      {s.tags.map((t, j) => <span className="service-tag" key={j}>{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="service-image-wrapper">
          <img
            className="service-image"
            src={`/images/img${active + 1}.webp`}
            alt={services[active].title}
            key={active}
          />
        </div>
      </div>
    </section>
  );
}

export default Services;
