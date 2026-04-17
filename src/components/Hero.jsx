import Icons from './Icons';
import TripBackground from './TripBackground';
import SiteNav from './SiteNav';

function Hero({ onContact, currentPath }) {
  const proofItems = [
    {
      icon: 'Shield',
      label: 'Reliability first',
      title: 'Know what gets fixed before build starts',
      description: 'Projects are shaped around the operational problem that needs solving, not generic deliverables.',
    },
    {
      icon: 'Layers',
      label: 'Software + AI systems',
      title: 'Web and workflow work in one plan',
      description: 'Sites, apps, automations, and assistants are scoped together when they need to support the same business flow.',
    },
    {
      icon: 'Monitor',
      label: 'Low-drama delivery',
      title: 'Visible progress and practical next steps',
      description: 'You should always know what is being built, what decision is next, and what outcome the work supports.',
    },
  ];

  return (
    <div className="hero-wrapper">
      <section className="hero-card">
        <TripBackground />
        <SiteNav onContact={onContact} currentPath={currentPath} />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-eyebrow">Software systems for businesses that need clearer operations</p>
            <h1>
              Websites, web apps, and <span className="ai-emphasis">AI Workflows</span> that help your
              business run better.
            </h1>
            <p className="hero-summary">
              Uroboros Digital works with small/medium businesses and solo founders who need
              practical software, stronger digital presence, and <span className="ai-emphasis ai-emphasis--inline">AI-enhanced workflows</span>{' '}
              without the noise of a generic agency process.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn-primary hero-cta-btn hero-cta-btn--teal-selected"
                data-contact-trigger="true"
                onClick={() => onContact({ cta_label: 'Start a project', cta_placement: 'hero_primary' })}
              >
                <span>Start a project</span>
              </button>
              <a href="#services" className="btn-secondary hero-secondary-btn">Services</a>
            </div>
          </div>

          <div className="hero-proof-grid" aria-label="Engagement principles">
            {proofItems.map((item) => {
              const Icon = Icons[item.icon];

              return (
                <article className="hero-proof-card" key={item.title}>
                  <div className="hero-proof-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <p className="hero-proof-label">{item.label}</p>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
