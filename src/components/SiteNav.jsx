import { useEffect, useRef, useState } from 'react';
import Icons from './Icons';

function SiteNav({ currentPath, onContact, variant = 'default' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const inInsights = currentPath.startsWith('/insights');
  const useInsightsNav = inInsights;
  const isEditorial = variant === 'editorial';
  const servicesHref = inInsights ? '/#services' : '#services';
  const processHref = inInsights ? '/#process' : '#process';
  const contactHref = inInsights ? '/#contact' : '#contact';
  const navLinks = [
    { href: '/', label: 'Home', active: currentPath === '/' },
    { href: '/insights', label: 'Insights', active: inInsights },
    { href: servicesHref, label: 'Services', active: false },
    { href: processHref, label: 'Process', active: false },
    { href: contactHref, label: 'Contact', active: false },
  ];
  const mobileMenuLinks = useInsightsNav
    ? [
        { href: '/', label: 'Go to main page', active: false },
        ...navLinks.filter((item) => item.label !== 'Home'),
      ]
    : navLinks;

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const trigger = menuButtonRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const panel = menuRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [menuOpen]);

  const handleMenuClose = () => setMenuOpen(false);
  const handleContact = () => {
    setMenuOpen(false);
    onContact({
      cta_label: "Tell me what's slowing the business down",
      cta_placement: useInsightsNav ? 'nav_mobile_insights' : 'nav_mobile',
    });
  };

  return (
    <>
      <nav
        className={`navbar ${inInsights ? 'navbar-page' : ''} ${isEditorial ? 'navbar--editorial' : ''} ${useInsightsNav ? 'navbar--insights' : ''}`.trim()}
      >
        <div className="navbar-inner">
          <a href="/" className="nav-logo"><Icons.Logo /> Uroboros Systems</a>
          {useInsightsNav ? (
            <div className="nav-actions nav-actions--insights">
              <a href="/" className={`btn-secondary nav-home-link ${isEditorial ? 'nav-home-link--editorial' : ''}`.trim()}>
                Go to main page
              </a>
              <button
                type="button"
                className={`nav-cta ${isEditorial ? 'nav-cta--editorial' : ''}`.trim()}
                onClick={() => onContact({ cta_label: "Tell me what's slowing the business down", cta_placement: 'nav_insights' })}
              >
                Tell me what&apos;s slowing the business down
              </button>
              <button
                type="button"
                className={`nav-menu-toggle ${isEditorial ? 'nav-menu-toggle--editorial' : ''}`.trim()}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close insights navigation' : 'Open insights navigation'}
                onClick={() => setMenuOpen((open) => !open)}
                ref={menuButtonRef}
              >
                {menuOpen ? <Icons.X /> : <Icons.Menu />}
              </button>
            </div>
          ) : (
            <>
              <ul className="nav-links">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={item.active ? 'active' : ''}
                      aria-current={item.active ? 'page' : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="nav-actions">
                <button
                  type="button"
                  className={`nav-cta ${isEditorial ? 'nav-cta--editorial' : ''}`.trim()}
                  onClick={() => onContact({ cta_label: "Tell me what's slowing the business down", cta_placement: 'nav_primary' })}
                >
                  Tell me what&apos;s slowing the business down
                </button>
                <button
                  type="button"
                  className={`nav-menu-toggle ${isEditorial ? 'nav-menu-toggle--editorial' : ''}`.trim()}
                  aria-expanded={menuOpen}
                  aria-label={menuOpen ? 'Close site navigation' : 'Open site navigation'}
                  onClick={() => setMenuOpen((open) => !open)}
                  ref={menuButtonRef}
                >
                  {menuOpen ? <Icons.X /> : <Icons.Menu />}
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-backdrop" onClick={handleMenuClose}>
          <div
            className={`nav-mobile-panel ${isEditorial ? 'nav-mobile-panel--editorial' : ''}`.trim()}
            role="dialog"
            aria-modal="true"
            aria-label={useInsightsNav ? 'Insights navigation' : 'Site navigation'}
            onClick={(event) => event.stopPropagation()}
            ref={menuRef}
          >
            <div className="nav-mobile-head">
              <a href="/" className="nav-logo" onClick={handleMenuClose}><Icons.Logo /> Uroboros Systems</a>
              <button
                type="button"
                className="nav-mobile-close"
                onClick={handleMenuClose}
                aria-label="Close site navigation"
                ref={closeButtonRef}
              >
                <Icons.X />
              </button>
            </div>
            <div className="nav-mobile-links">
              {mobileMenuLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={item.active ? 'active' : ''}
                  aria-current={item.active ? 'page' : undefined}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <button type="button" className="btn-primary nav-mobile-cta" onClick={handleContact}>
              Tell me what&apos;s slowing the business down
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SiteNav;
