import { useAnalytics } from '../analytics/useAnalytics';
import Icons from './Icons';
import { useFadeIn } from '../hooks/useFadeIn';

function CTA({ onContact }) {
  const ref = useFadeIn();
  const { track } = useAnalytics();

  return (
    <section className="cta-section" id="contact" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="cta-main">
        <div className="cta-bg" />
        <div className="cta-content">
          <div className="cta-intro">
            <div className="cta-intro-mark" aria-hidden="true">
              <span className="section-signature cta-signature"><Icons.Logo /></span>
              <span className="cta-intro-rule" />
            </div>
            <div className="cta-copy">
              <h2>What&apos;s costing you more right now: weak conversion, messy ops, or too much manual follow-up?</h2>
              <p className="cta-note">Start with the bottleneck that matters most. We can scope the right first build from there.</p>
              <div className="cta-conversation">
                <button
                  type="button"
                  className="btn-primary cta-dynamic-btn"
                  data-contact-trigger="true"
                  onClick={() => {
                    track('cta_click', {
                      cta_label: 'Talk through the bottleneck',
                      cta_placement: 'cta_section',
                    });
                    onContact({
                      cta_label: 'Talk through the bottleneck',
                      cta_placement: 'cta_section',
                    });
                  }}
                >
                  <span>Talk through the bottleneck</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
