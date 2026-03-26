import Icons from './Icons';

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
              onClick={() => onContact({ cta_label: "Tell me what's slowing the business down", cta_placement: 'footer_minimal' })}
            >
              Tell me what&apos;s slowing the business down
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`footer ${isEditorial ? 'footer--editorial' : ''}`.trim()}>
      <div className="footer-divider" aria-hidden="true" />
      <div className="footer-frame footer-frame--default">
        <div className="footer-primary">
          <div className="footer-brand-block">
            <p className="footer-kicker section-label">Ready for a steadier build</p>
            <div className="footer-logo">
              <Icons.Logo />
              Uroboros Systems
            </div>
            <p className="footer-summary">
              Practical websites, web apps, and AI workflows for small businesses and solo founders
              who want clearer operations and calmer delivery.
            </p>
          </div>

          <div className="footer-cta-block">
            <p className="footer-cta-label">Need a clear first fix?</p>
            <button
              className="btn-primary footer-primary-action"
              type="button"
              onClick={() => onContact({ cta_label: "Tell me what's slowing the business down", cta_placement: 'footer_primary' })}
            >
              Tell me what&apos;s slowing the business down
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="/insights">Insights</a>
            <a href={servicesHref}>Services</a>
            <a href={processHref}>Process</a>
            <a href={contactHref}>Contact</a>
          </nav>
          <button
            className="footer-contact-link"
            type="button"
            onClick={() => onContact({ cta_label: 'Tell me what you\'re building', cta_placement: 'footer_detail' })}
          >
            Tell me what you&apos;re building
          </button>
          <p className="footer-status">Remote-first · Available worldwide</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
