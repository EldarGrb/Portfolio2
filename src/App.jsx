import { useState, useCallback } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ContactModal from './components/ContactModal';
import HomePage from './pages/HomePage';
import InsightsPage from './pages/InsightsPage';
import InsightArticlePage from './pages/InsightArticlePage';
import NotFoundPage from './pages/NotFoundPage';
import { getArticleBySlug } from './data/insights/articles';

function normalizePath(pathname) {
  if (!pathname) return '/';
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
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
  const article = articleSlug ? getArticleBySlug(articleSlug) : null;

  let page = null;

  if (currentPath === '/') {
    page = <HomePage onContact={openModal} />;
  } else if (isInsightsHub) {
    page = <InsightsPage currentPath={currentPath} onContact={openModal} />;
  } else if (isInsightArticle && article) {
    page = <InsightArticlePage article={article} currentPath={currentPath} onContact={openModal} />;
  } else {
    page = <NotFoundPage currentPath={currentPath} onContact={openModal} />;
  }

  return (
    <>
      {page}
      <ContactModal open={modalOpen} onClose={closeModal} />
      <SpeedInsights />
    </>
  );
}

export default App;
