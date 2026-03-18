import { useEffect, useRef, useState } from 'react';
import SiteNav from './SiteNav';
import Footer from './Footer';

function InsightsLayout({
  currentPath,
  onContact,
  sidebar = null,
  mobileSidebarLabel = 'Open navigation',
  footerVariant = 'default',
  shellVariant = 'editorial',
  shellClassName = '',
  contentClassName = '',
  children,
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarPanelRef = useRef(null);
  const sidebarToggleRef = useRef(null);
  const closeButtonRef = useRef(null);
  const hasSidebar = Boolean(sidebar);

  useEffect(() => {
    if (!mobileSidebarOpen || !hasSidebar) return undefined;

    const previousOverflow = document.body.style.overflow;
    const trigger = sidebarToggleRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileSidebarOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const panel = sidebarPanelRef.current;
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
  }, [hasSidebar, mobileSidebarOpen]);

  return (
    <div
      className={`page-shell insights-docs-shell ${shellVariant === 'editorial' ? 'page-shell--editorial' : ''} ${shellClassName}`.trim()}
    >
      <SiteNav currentPath={currentPath} onContact={onContact} variant={shellVariant} />

      <main className="insights-docs-main">
        {hasSidebar && (
          <>
            <div className="insights-mobile-controls">
              <button
                type="button"
                className="insights-sidebar-toggle"
                aria-expanded={mobileSidebarOpen}
                aria-controls="insights-mobile-sidebar"
                onClick={() => setMobileSidebarOpen((open) => !open)}
                ref={sidebarToggleRef}
              >
                {mobileSidebarOpen ? 'Close navigation' : mobileSidebarLabel}
              </button>
            </div>

            <div
              className={`insights-mobile-sidebar-overlay ${mobileSidebarOpen ? 'open' : ''}`}
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden={!mobileSidebarOpen}
            >
              <div
                id="insights-mobile-sidebar"
                className="insights-mobile-sidebar-sheet"
                role="dialog"
                aria-modal="true"
                aria-label="Insights navigation"
                onClick={(event) => event.stopPropagation()}
                ref={sidebarPanelRef}
              >
                <div className="insights-mobile-sidebar-head">
                  <p>Navigation</p>
                  <button
                    type="button"
                    className="insights-mobile-sidebar-close"
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-label="Close sidebar"
                    ref={closeButtonRef}
                  >
                    &times;
                  </button>
                </div>
                {sidebar}
              </div>
            </div>
          </>
        )}

        <div className={`insights-docs-grid ${hasSidebar ? '' : 'insights-docs-grid--full'}`.trim()}>
          {hasSidebar && (
            <aside className="insights-docs-sidebar" aria-label="Insights navigation">
              {sidebar}
            </aside>
          )}

          <section className={`insights-docs-content ${contentClassName}`.trim()}>
            {children}
          </section>
        </div>
      </main>

      <Footer onContact={onContact} currentPath={currentPath} variant={footerVariant} />
    </div>
  );
}

export default InsightsLayout;
