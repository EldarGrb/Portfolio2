import { useEffect, useState } from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
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
  const { track } = useAnalytics();

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

  const renderServiceTitle = (service) => {
    if (service.visual === 'aiWorkflows') {
      return (
        <>
          <span className="ai-emphasis">AI-enhanced workflows</span> that cut repetitive admin work
        </>
      );
    }

    if (service.visual === 'assistants') {
      return (
        <>
          <span className="ai-emphasis">Voice and chat assistants</span> that handle first-response work
        </>
      );
    }

    return service.title;
  };

  const renderServiceDescription = (service) => {
    if (service.visual === 'aiWorkflows') {
      return (
        <>
          Practical automation flows that connect your tools, move information where it belongs,
          and reduce manual follow-up with <span className="ai-emphasis ai-emphasis--inline">automation where it actually saves time</span>.
        </>
      );
    }

    if (service.visual === 'assistants') {
      return (
        <>
          <span className="ai-emphasis ai-emphasis--inline">AI assistants</span> for lead capture,
          support triage, and appointment or intake flows, designed to feel useful rather than gimmicky.
        </>
      );
    }

    return service.description;
  };

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
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onContact({ cta_label: 'Request proposal', cta_placement: 'services_header' })}
        >
          Request proposal
        </button>
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
                  onClick={() => {
                    setActive(i);
                    if (i !== active) {
                      track('service_accordion_open', {
                        service_id: s.visual,
                        service_name: s.title,
                      });
                    }
                  }}
                  aria-expanded={i === active}
                  aria-controls={panelId}
                >
                  <span className="service-header-icon"><Icon /></span>
                  <h3>{renderServiceTitle(s)}</h3>
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
                    <p>{renderServiceDescription(s)}</p>
                    <div className="service-tags">
                      {s.tags.map((t, j) => <span className="service-tag" key={j}>{t}</span>)}
                    </div>
                    <div className="service-actions">
                      <a href={s.href} className="btn-secondary">
                        View service page
                      </a>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => onContact({
                          cta_label: `Talk through ${s.title}`,
                          cta_placement: `service_${s.visual}`,
                          service_name: s.title,
                        })}
                      >
                        Talk through this service
                      </button>
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
