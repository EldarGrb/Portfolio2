import { useEffect, useState } from 'react';
import Icons from './Icons';
import ServiceVisual from './ServiceVisual';
import { services } from '../data/servicesData';
import { useFadeIn } from '../hooks/useFadeIn';

function Services({ onContact }) {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)').matches : false
  ));
  const ref = useFadeIn();
  const activeService = services[active];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const onChange = (event) => setIsMobile(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  return (
    <section className="section services" id="services" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="services-header">
        <div className="services-header-copy">
          <span className="section-signature" aria-hidden="true"><Icons.Logo /></span>
          <h2 className="section-title">Focused systems for the parts of the business that need to work better.</h2>
          <p className="services-intro">
            Each engagement is scoped around a real operational goal: better lead flow,
            clearer delivery, smoother internal work, or less first-response admin.
          </p>
        </div>
        <button className="btn-secondary" onClick={onContact}>Request proposal</button>
      </div>
      <div className="services-content">
        <div className="service-accordion">
          {services.map((s, i) => {
            const Icon = Icons[s.icon];
            const headerId = `service-header-${i}`;
            const panelId = `service-panel-${i}`;
            return (
              <div className={`service-item ${s.featured ? 'featured' : ''} ${i === active ? 'active' : ''}`} key={i}>
                <button
                  id={headerId}
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
                <div
                  className="service-body"
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  hidden={i !== active}
                >
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
        {!isMobile && (
          <div className="service-image-wrapper">
            <ServiceVisual
              key={activeService.visual}
              visual={activeService.visual}
              label={activeService.imageAlt}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;
