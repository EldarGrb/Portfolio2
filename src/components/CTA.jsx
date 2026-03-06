import Icons from './Icons';
import { useFadeIn } from '../hooks/useFadeIn';

function CTA({ onContact }) {
  const ref = useFadeIn();
  return (
    <section className="cta-section" id="contact" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="cta-main">
        <div className="cta-bg" />
        <div className="cta-content">
          <h2>Ready to bring your next project to life?</h2>
          <button className="cta-btn" onClick={onContact}>
            <span style={{ fontSize: '0.85rem' }}>&#8629;</span> Book a free call
          </button>
        </div>
      </div>
      <div className="cta-cards">
        <button className="cta-card" onClick={onContact}>
          <div className="cta-card-left">
            <span className="cta-card-icon"><Icons.Star /></span>
            <div>
              <h3>Have a project in mind?</h3>
              <p>Let's discuss your idea</p>
            </div>
          </div>
          <span className="cta-card-arrow">&rsaquo;</span>
        </button>
        <button className="cta-card" onClick={onContact}>
          <div className="cta-card-left">
            <span className="cta-card-icon"><Icons.Rocket /></span>
            <div>
              <h3>Need expert development fast?</h3>
              <p>Get in touch today</p>
            </div>
          </div>
          <span className="cta-card-arrow">&rsaquo;</span>
        </button>
      </div>
    </section>
  );
}

export default CTA;
