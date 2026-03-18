import SiteNav from '../components/SiteNav';
import Footer from '../components/Footer';
import { SITE_URL } from '../data/insights/articles';
import { useSeo } from '../hooks/useSeo';

function NotFoundPage({ currentPath, onContact }) {
  useSeo({
    title: 'Page Not Found | Uroboros Systems',
    description: 'The page you requested could not be found.',
    canonical: `${SITE_URL}${currentPath}`,
    url: `${SITE_URL}${currentPath}`,
    type: 'website',
    schemas: [],
  });

  return (
    <div className="page-shell insights-page-shell">
      <SiteNav currentPath={currentPath} onContact={onContact} />
      <main className="not-found-page">
        <p className="section-label">404</p>
        <h1>Page not found</h1>
        <p>The requested URL does not exist. Browse insights or return to the homepage.</p>
        <div className="not-found-actions">
          <a href="/" className="btn-primary">Back to Home</a>
          <a href="/insights" className="btn-secondary">Browse Insights</a>
        </div>
      </main>
      <Footer onContact={onContact} currentPath={currentPath} />
    </div>
  );
}

export default NotFoundPage;
