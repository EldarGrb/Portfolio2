import SiteNav from '../components/SiteNav';
import Footer from '../components/Footer';
import { getNotFoundSeo } from '../seo/pageSeo';
import { useSeo } from '../hooks/useSeo';

function NotFoundPage({ currentPath, onContact }) {
  useSeo(getNotFoundSeo(currentPath));

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
