import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAnalytics } from './analytics/useAnalytics';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ContactModal from './components/ContactModal';
import { getArticleBySlug } from './data/insights/articles';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import InsightsPage from './pages/InsightsPage';
import InsightArticlePage from './pages/InsightArticlePage';
import NotFoundPage from './pages/NotFoundPage';

function normalizePath(pathname) {
  if (!pathname) return '/';
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

function App({ currentPathOverride, prerender = false, initialArticle = null }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [contactContext, setContactContext] = useState({});
  const browserPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const showSpeedInsights = !prerender && typeof window !== 'undefined';
  const { consentStatus, isHydrated, track, trackPageView } = useAnalytics();

  const currentPath = normalizePath(currentPathOverride ?? browserPath);

  const handleOpenModal = useCallback((source = {}) => {
    setContactContext(source);
    if (source.cta_placement) {
      track('cta_click', source);
    }
    track('contact_modal_open', source);
    setModalOpen(true);
  }, [track]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setContactContext({});
  }, []);

  const insightPrefix = '/insights/';
  const isInsightsHub = currentPath === '/insights';
  const isInsightArticle = currentPath.startsWith(insightPrefix);
  const isAboutPage = currentPath === '/about';
  const articleSlug = isInsightArticle ? currentPath.slice(insightPrefix.length) : '';
  const articleMeta = articleSlug ? getArticleBySlug(articleSlug) : null;

  const pageAnalytics = useMemo(() => {
    if (currentPath === '/') {
      return {
        page_type: 'home',
        content_group: 'marketing_site',
      };
    }

    if (isAboutPage) {
      return {
        page_type: 'about',
        content_group: 'marketing_site',
      };
    }

    if (isInsightsHub) {
      return {
        page_type: 'insights_hub',
        content_group: 'insights',
      };
    }

    if (isInsightArticle && articleMeta) {
      return {
        page_type: 'insight_article',
        content_group: 'insights',
        article_slug: articleMeta.slug,
        article_title: articleMeta.title,
        article_category: articleMeta.category,
      };
    }

    return {
      page_type: 'not_found',
      content_group: 'error_page',
    };
  }, [articleMeta, currentPath, isAboutPage, isInsightArticle, isInsightsHub]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return undefined;

    const frameId = window.requestAnimationFrame(() => {
      trackPageView(currentPath, pageAnalytics);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [consentStatus, currentPath, isHydrated, pageAnalytics, trackPageView]);

  let page = null;

  if (currentPath === '/') {
    page = <HomePage onContact={handleOpenModal} />;
  } else if (isInsightsHub) {
    page = <InsightsPage currentPath={currentPath} onContact={handleOpenModal} />;
  } else if (isInsightArticle && articleMeta) {
    page = (
      <InsightArticlePage
        key={articleSlug}
        articleSlug={articleSlug}
        articleMeta={articleMeta}
        currentPath={currentPath}
        onContact={handleOpenModal}
        initialArticle={initialArticle}
      />
    );
  } else if (isAboutPage) {
    page = <AboutPage onContact={handleOpenModal} currentPath={currentPath} />;
  } else {
    page = <NotFoundPage currentPath={currentPath} onContact={handleOpenModal} />;
  }

  return (
    <>
      {page}
      <ContactModal open={modalOpen} onClose={handleCloseModal} context={contactContext} />
      {showSpeedInsights ? <SpeedInsights /> : null}
    </>
  );
}

export default App;
