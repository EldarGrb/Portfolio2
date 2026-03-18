import { Suspense, lazy, useCallback, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ContactModal from './components/ContactModal';
import { getArticleBySlug } from './data/insights/articles';

const HomePage = lazy(() => import('./pages/HomePage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const InsightArticlePage = lazy(() => import('./pages/InsightArticlePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function normalizePath(pathname) {
  if (!pathname) return '/';
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

function RouteLoadingFallback() {
  return <div className="route-loading-fallback" aria-hidden="true" />;
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const currentPath = normalizePath(window.location.pathname);

  const insightPrefix = '/insights/';
  const isInsightsHub = currentPath === '/insights';
  const isInsightArticle = currentPath.startsWith(insightPrefix);
  const articleSlug = isInsightArticle ? currentPath.slice(insightPrefix.length) : '';
  const articleMeta = articleSlug ? getArticleBySlug(articleSlug) : null;

  let page = null;

  if (currentPath === '/') {
    page = <HomePage onContact={openModal} />;
  } else if (isInsightsHub) {
    page = <InsightsPage currentPath={currentPath} onContact={openModal} />;
  } else if (isInsightArticle && articleMeta) {
    page = (
      <InsightArticlePage
        key={articleSlug}
        articleSlug={articleSlug}
        articleMeta={articleMeta}
        currentPath={currentPath}
        onContact={openModal}
      />
    );
  } else {
    page = <NotFoundPage currentPath={currentPath} onContact={openModal} />;
  }

  return (
    <>
      <Suspense fallback={<RouteLoadingFallback />}>
        {page}
      </Suspense>
      <ContactModal open={modalOpen} onClose={closeModal} />
      <SpeedInsights />
    </>
  );
}

export default App;
