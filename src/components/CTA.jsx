import Icons from './Icons';
import { useFadeIn } from '../hooks/useFadeIn';

function CTA({ onContact }) {
  const ref = useFadeIn();
  return (
    <section className="cta-section" id="contact" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="cta-main">
        <div className="cta-bg" />
        <div className="cta-content">
          <span className="section-signature cta-signature" aria-hidden="true"><Icons.Logo /></span>
          <h2>Ready to start your next project with confidence?</h2>
          <p className="cta-note">Choose your path below. We reply within 24 hours.</p>
        </div>
      </div>
      <div className="cta-cards">
        <button className="cta-card" onClick={onContact}>
          <div className="cta-card-left">
            <span className="cta-card-icon"><Icons.Star /></span>
            <div>
              <h3>Start a project</h3>
              <p>Share your goals, scope, and timeline</p>
            </div>
          </div>
          <span className="cta-card-arrow">&rsaquo;</span>
        </button>
        <a className="cta-card" href="#services">
          <div className="cta-card-left">
            <span className="cta-card-icon"><Icons.Rocket /></span>
            <div>
              <h3>See relevant work</h3>
              <p>Review our capabilities and delivery approach</p>
            </div>
          </div>
          <span className="cta-card-arrow">&rsaquo;</span>
        </a>
      </div>
    </section>
  );
}

export default CTA;
