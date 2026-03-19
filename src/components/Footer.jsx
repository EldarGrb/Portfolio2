import Icons from './Icons';
import NewsletterSignup from './NewsletterSignup';

function Footer({ onContact, currentPath = '/', variant = 'default' }) {
  const isMinimal = variant === 'minimal';
  const isEditorial = variant === 'editorial' || variant === 'minimal';

  const inInsights = currentPath.startsWith('/insights');
  const servicesHref = inInsights ? '/#services' : '#services';
  const processHref = inInsights ? '/#process' : '#process';
  const contactHref = inInsights ? '/#contact' : '#contact';

  if (isMinimal) {
    return (
      <footer className={`footer footer--minimal ${isEditorial ? 'footer--editorial' : ''}`.trim()}>
        <div className="footer-frame footer-frame--minimal">
          <div className="footer-minimal-brand">
            <p className="footer-minimal-kicker">Uroboros Systems Insights</p>
            <div className="footer-logo">
              <Icons.Logo />
              Uroboros Systems
            </div>
            <p className="footer-minimal-copy">
              Practical websites, apps, and AI workflows for teams that want clearer execution.
            </p>
          </div>

          <nav className="footer-minimal-nav" aria-label="Footer navigation">
            <a href="/">Home</a>
            <a href="/insights">Insights</a>
            <a href={servicesHref}>Services</a>
            <a href={processHref}>Process</a>
            <a href={contactHref}>Contact</a>
          </nav>

          <div className="footer-minimal-cta">
            <p>Need help applying one of these ideas to your workflow?</p>
            <button
              className="btn-primary"
              type="button"
              onClick={() => onContact({ cta_label: 'Start a project', cta_placement: 'footer_minimal' })}
            >
              Start a project
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`footer ${isEditorial ? 'footer--editorial' : ''}`.trim()}>
      <div className="footer-frame">
        <div className="footer-hero">
          <div className="footer-lead">
            <p className="footer-kicker section-label">Ready for a steadier build</p>
            <h2>Build the next website, web app, or AI workflow with more clarity.</h2>
            <p className="footer-summary">
              Uroboros Systems helps small businesses and solo founders ship practical software
              with stronger communication, calmer execution, and AI that supports the work
              instead of distracting from it.
            </p>
            <div className="footer-actions">
              <button
                className="btn-primary footer-primary-action"
                type="button"
                onClick={() => onContact({ cta_label: 'Start a project', cta_placement: 'footer_primary' })}
              >
                Start a project
              </button>
              <a className="btn-secondary footer-secondary-action" href="/insights">
                Read the notes
              </a>
            </div>
          </div>

          <aside className="footer-aside" aria-label="Who this is best for">
            <p className="footer-panel-label">Best fit</p>
            <ul className="footer-fit-list">
              <li>Businesses that need a sharper website or client-facing web app.</li>
              <li>Teams that want AI workflows or assistants tied to real operations.</li>
              <li>Founders who want clearer delivery, practical next steps, and less guesswork.</li>
            </ul>
          </aside>
        </div>

        <div className="footer-support">
          <NewsletterSignup
            className="footer-subscribe"
            eyebrow="Practical software notes"
            title="Occasional notes on web systems, AI workflows, and clearer delivery."
            description="Short, useful updates for teams planning a website, web app, or operational workflow."
            placement="footer_newsletter"
          />

          <nav className="footer-links-panel" aria-label="Footer navigation">
            <p className="footer-card-label">Explore</p>
            <div className="footer-links-grid">
              <div>
                <h4>Pages</h4>
                <a href="/" className="footer-link-optional">Home</a>
                <a href="/insights">Insights</a>
              </div>
              <div>
                <h4>Work</h4>
                <a href={servicesHref}>Services</a>
                <a href={processHref} className="footer-link-optional">Process</a>
                <a href={contactHref}>Contact</a>
              </div>
            </div>
          </nav>

          <div className="footer-details">
            <p className="footer-card-label">Availability</p>
            <div className="footer-contact-grid">
              <div>
                <h4>Response</h4>
                <p>Usually within 24 hours for new project inquiries.</p>
              </div>
              <div>
                <h4>Location</h4>
                <p>Available worldwide<br />Remote-first</p>
              </div>
            </div>
            <button
              className="footer-contact-link"
              type="button"
              onClick={() => onContact({ cta_label: 'Tell me what you\'re building', cta_placement: 'footer_detail' })}
            >
              Tell me what you&apos;re building
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">
            <Icons.Logo />
            Uroboros Systems
          </div>
          <p className="footer-closing">Calm software systems for growing businesses and solo founders.</p>
          <p className="footer-status">Remote-first · Available worldwide</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
