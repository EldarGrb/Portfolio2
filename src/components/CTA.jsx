import { useState } from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
import Icons from './Icons';
import { useFadeIn } from '../hooks/useFadeIn';

function CTA({ onContact }) {
  const options = [
    {
      id: 'website-system',
      label: 'Website or web app',
      summary: 'Clarify the offer, strengthen the user journey, and build a system that supports sales or delivery.',
      cta: 'Talk through the build',
    },
    {
      id: 'workflow-automation',
      label: 'Workflow automation',
      summary: 'Reduce repetitive admin, tighten handoffs, and connect the tools your business already depends on.',
      cta: 'Scope the workflow',
    },
    {
      id: 'assistant-layer',
      label: 'Voice or chat assistant',
      summary: 'Handle first-response questions, intake, and routing with AI that supports the real process behind it.',
      cta: 'Plan the assistant',
    },
  ];

  const [selected, setSelected] = useState(options[0].id);
  const activeOption = options.find((item) => item.id === selected) || options[0];
  const ref = useFadeIn();
  const { track } = useAnalytics();

  return (
    <section className="cta-section" id="contact" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="cta-main">
        <div className="cta-bg" />
        <div className="cta-content">
          <span className="section-signature cta-signature" aria-hidden="true"><Icons.Logo /></span>
          <h2>Choose the system that would make the biggest difference right now.</h2>
          <p className="cta-note">Start with the bottleneck that matters most. We can scope the right first build from there.</p>

          <div className="cta-conversation">
            <p className="cta-question">Where do you need the most help?</p>
            <div className="cta-selectors" aria-label="Project type options">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`cta-selector ${selected === option.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelected(option.id);
                    track('cta_click', {
                      cta_label: option.label,
                      cta_placement: 'cta_selector',
                    });
                  }}
                  aria-pressed={selected === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="cta-response" aria-live="polite">
              <h3>{activeOption.label}</h3>
              <p>{activeOption.summary}</p>
              <button
                type="button"
                className="btn-primary cta-dynamic-btn"
                onClick={() => onContact({
                  cta_label: activeOption.cta,
                  cta_placement: `cta_dynamic_${activeOption.id}`,
                })}
              >
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
