import SiteNav from '../components/SiteNav';
import Footer from '../components/Footer';
import { getNotFoundSeo } from '../seo/pageSeo';
import { useSeo } from '../hooks/useSeo';

function NotFoundPage({ currentPath, onContact }) {
  useSeo(getNotFoundSeo(currentPath));

  return (
    <div className="page-shell not-found-page-shell">
      <SiteNav currentPath={currentPath} onContact={onContact} />
      <main className="not-found-page">
        <section className="not-found-hero" aria-labelledby="not-found-title">
          <div className="not-found-copy">
            <p className="section-label">404</p>
            <p className="not-found-path">Requested path: {currentPath}</p>
            <h1 id="not-found-title">This page is no longer part of the working path.</h1>
            <p className="not-found-intro">
              The link may be outdated, moved, or typed incorrectly. The quickest way forward is
              to head back home, browse insights, or jump into the services that are live now.
            </p>
            <div className="not-found-actions">
              <a href="/" className="btn-primary">Back to Home</a>
              <a href="/insights" className="btn-secondary">Browse Insights</a>
            </div>
          </div>

          <aside className="not-found-panel" aria-labelledby="not-found-next-title">
            <p className="section-label">Useful next moves</p>
            <h2 id="not-found-next-title">Choose the clearest route back in.</h2>
            <div className="not-found-links">
              <a href="/" className="not-found-link-card">
                <strong>Home</strong>
                <span>Return to the main overview and use the primary path back into the site.</span>
              </a>
              <a href="/#services" className="not-found-link-card">
                <strong>Services</strong>
                <span>See the core offers: websites, web apps, AI workflows, and assistants.</span>
              </a>
              <a href="/contact" className="not-found-link-card">
                <strong>Contact</strong>
                <span>Go straight to the contact page if you already know what needs fixing.</span>
              </a>
            </div>
          </aside>
        </section>
      </main>
      <Footer onContact={onContact} currentPath={currentPath} />
    </div>
  );
}

export default NotFoundPage;
