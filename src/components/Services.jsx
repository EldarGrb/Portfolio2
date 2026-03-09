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
        <div className="services-header-copy">
          <span className="section-signature" aria-hidden="true"><Icons.Logo /></span>
          <h2 className="section-title">Expert services that move your project forward</h2>
        </div>
        <button className="btn-secondary" onClick={onContact}>Request proposal</button>
      </div>
      <div className="services-content">
        <div className="service-accordion">
          {services.map((s, i) => {
            const Icon = Icons[s.icon];
            const panelId = `service-panel-${i}`;
            return (
              <div className={`service-item ${s.featured ? 'featured' : ''} ${i === active ? 'active' : ''}`} key={i}>
                <button
                  className="service-header"
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={i === active}
                  aria-controls={panelId}
                >
                  <span className="service-header-icon"><Icon /></span>
                  <h3>{s.title}</h3>
                  {s.featured && <span className="service-featured-badge">Featured</span>}
                </button>
                <div className="service-body" id={panelId}>
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
