import { useState } from 'react';
import Icons from './Icons';
import { useFadeIn } from '../hooks/useFadeIn';

function CTA({ onContact }) {
  const options = [
    {
      id: 'website',
      label: 'New website',
      summary: 'Build or redesign a site that converts and performs.',
      cta: 'Discuss your website project',
    },
    {
      id: 'automation',
      label: 'Automation / AI',
      summary: 'Automate workflows with practical AI and n8n orchestration.',
      cta: 'Plan your AI automation setup',
    },
    {
      id: 'performance',
      label: 'Performance upgrade',
      summary: 'Improve speed, Core Web Vitals, and reliability for your current stack.',
      cta: 'Request a performance audit',
    },
  ];

  const [selected, setSelected] = useState(options[0].id);
  const activeOption = options.find((item) => item.id === selected) || options[0];
  const ref = useFadeIn();

  return (
    <section className="cta-section" id="contact" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="cta-main">
        <div className="cta-bg" />
        <div className="cta-content">
          <span className="section-signature cta-signature" aria-hidden="true"><Icons.Logo /></span>
          <h2>Ready to start your next project with confidence?</h2>
          <p className="cta-note">Tell us what you need. We reply within 24 hours.</p>

          <div className="cta-conversation">
            <p className="cta-question">What are you looking for right now?</p>
            <div className="cta-selectors" role="tablist" aria-label="Project type">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`cta-selector ${selected === option.id ? 'active' : ''}`}
                  onClick={() => setSelected(option.id)}
                  role="tab"
                  aria-selected={selected === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="cta-response">
              <h3>{activeOption.label}</h3>
              <p>{activeOption.summary}</p>
              <button className="btn-primary cta-dynamic-btn" onClick={onContact}>
                {activeOption.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
