import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAnalytics } from './analytics/useAnalytics';
import { SpeedInsights } from '@vercel/speed-insights/react';
import BookingModal from './components/BookingModal';
import ContactChoiceModal from './components/ContactChoiceModal';
import ContactModal from './components/ContactModal';
import { getArticleBySlug } from './data/insights/articles';
import { loadCalendlyScript, warmCalendlyResources } from './lib/calendly';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import InsightsPage from './pages/InsightsPage';
import InsightArticlePage from './pages/InsightArticlePage';
import NotFoundPage from './pages/NotFoundPage';

function normalizePath(pathname) {
  if (!pathname) return '/';
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

function App({ currentPathOverride, prerender = false, initialArticle = null }) {
  const [activeContactModal, setActiveContactModal] = useState(null);
  const [contactContext, setContactContext] = useState({});
  const browserPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const showSpeedInsights = !prerender && typeof window !== 'undefined';
  const { consentStatus, isHydrated, track, trackPageView } = useAnalytics();

  const currentPath = normalizePath(currentPathOverride ?? browserPath);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return undefined;

    warmCalendlyResources();

    const preloadCalendly = () => {
      loadCalendlyScript().catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadCalendly, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preloadCalendly, 1200);
    return () => window.clearTimeout(timeoutId);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof document === 'undefined') return undefined;

    const handleIntentWarmup = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('[data-contact-trigger="true"]')) return;

      warmCalendlyResources();
      loadCalendlyScript().catch(() => {});
    };

    document.addEventListener('pointerover', handleIntentWarmup);
    document.addEventListener('focusin', handleIntentWarmup);

    return () => {
      document.removeEventListener('pointerover', handleIntentWarmup);
      document.removeEventListener('focusin', handleIntentWarmup);
    };
  }, [isHydrated]);

  const handleOpenContactOptions = useCallback((source = {}) => {
    setContactContext(source);
    warmCalendlyResources();
    loadCalendlyScript().catch(() => {});
    if (source.cta_placement) {
      track('cta_click', source);
    }
    track('contact_choice_open', source);
    setActiveContactModal('choice');
  }, [track]);

  const handleCloseModal = useCallback(() => {
    setActiveContactModal(null);
    setContactContext({});
  }, []);

  const handleChooseMessage = useCallback(() => {
    const payload = { ...contactContext, contact_path: 'message' };
    track('contact_path_selected', payload);
    track('contact_modal_open', payload);
    setActiveContactModal('message');
  }, [contactContext, track]);

  const handleChooseBooking = useCallback(() => {
    const payload = { ...contactContext, contact_path: 'booking' };
    track('contact_path_selected', payload);
    track('contact_booking_open', payload);
    setActiveContactModal('booking');
  }, [contactContext, track]);

  const handleReturnToChoice = useCallback(() => {
    setActiveContactModal('choice');
  }, []);

  const insightPrefix = '/insights/';
  const isInsightsHub = currentPath === '/insights';
  const isInsightArticle = currentPath.startsWith(insightPrefix);
  const isAboutPage = currentPath === '/about';
  const isContactPage = currentPath === '/contact';
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

    if (isContactPage) {
      return {
        page_type: 'contact',
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
  }, [articleMeta, currentPath, isAboutPage, isContactPage, isInsightArticle, isInsightsHub]);

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
    page = <HomePage onContact={handleOpenContactOptions} />;
  } else if (isInsightsHub) {
    page = <InsightsPage currentPath={currentPath} onContact={handleOpenContactOptions} />;
  } else if (isInsightArticle && articleMeta) {
    page = (
      <InsightArticlePage
        key={articleSlug}
        articleSlug={articleSlug}
        articleMeta={articleMeta}
        currentPath={currentPath}
        onContact={handleOpenContactOptions}
        initialArticle={initialArticle}
      />
    );
  } else if (isAboutPage) {
    page = <AboutPage onContact={handleOpenContactOptions} currentPath={currentPath} />;
  } else if (isContactPage) {
    page = <ContactPage onContact={handleOpenContactOptions} currentPath={currentPath} />;
  } else {
    page = <NotFoundPage currentPath={currentPath} onContact={handleOpenContactOptions} />;
  }

  return (
    <>
      {page}
      <ContactChoiceModal
        open={activeContactModal === 'choice'}
        onClose={handleCloseModal}
        onSelectMessage={handleChooseMessage}
        onSelectBooking={handleChooseBooking}
      />
      <ContactModal
        open={activeContactModal === 'message'}
        onClose={handleCloseModal}
        onBack={handleReturnToChoice}
        context={contactContext}
      />
      <BookingModal
        open={activeContactModal === 'booking'}
        onClose={handleCloseModal}
        onBack={handleReturnToChoice}
        onSendMessage={handleChooseMessage}
        context={contactContext}
      />
      {showSpeedInsights ? <SpeedInsights /> : null}
    </>
  );
}

export default App;
