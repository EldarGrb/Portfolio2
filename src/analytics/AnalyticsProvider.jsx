import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { captureSessionAttribution, getStoredAttribution } from './attribution';
import { CONSENT_STATUS, getStoredConsent, persistConsent } from './consent';
import { ANALYTICS_CONFIG } from './env';
import { ensureClarity, ensureGoogleAnalytics } from './providers';
import ConsentBanner from '../components/ConsentBanner';
import AnalyticsContext from './context';

function logDebug(message, payload) {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;
  window.__analyticsDebug = window.__analyticsDebug || [];
  window.__analyticsDebug.push({ message, payload, at: Date.now() });
}

export function AnalyticsProvider({ children }) {
  const [consentStatus, setConsentStatus] = useState(() => (
    typeof window === 'undefined' ? CONSENT_STATUS.unset : getStoredConsent()
  ));
  const [attribution] = useState(() => (
    typeof window === 'undefined' ? getStoredAttribution() : captureSessionAttribution()
  ));
  const initializedRef = useRef(false);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isHydrated || consentStatus !== CONSENT_STATUS.accepted) return;

    const hasGa = ensureGoogleAnalytics(ANALYTICS_CONFIG.gaMeasurementId);
    const hasClarity = ensureClarity(ANALYTICS_CONFIG.clarityProjectId);

    if (!initializedRef.current) {
      initializedRef.current = true;
      logDebug('analytics_initialized', {
        googleAnalytics: hasGa,
        clarity: hasClarity,
      });
    }
  }, [consentStatus, isHydrated]);

  const updateConsent = useCallback((nextValue) => {
    persistConsent(nextValue);
    setConsentStatus(nextValue);
  }, []);

  const acceptConsent = useCallback(() => updateConsent(CONSENT_STATUS.accepted), [updateConsent]);
  const rejectConsent = useCallback(() => updateConsent(CONSENT_STATUS.rejected), [updateConsent]);

  const track = useCallback((eventName, properties = {}) => {
    const payload = {
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      ...properties,
    };

    logDebug(eventName, payload);

    if (consentStatus !== CONSENT_STATUS.accepted || typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return false;
    }

    window.gtag('event', eventName, payload);
    return true;
  }, [consentStatus]);

  const trackPageView = useCallback((currentPath) => {
    const payload = {
      page_path: currentPath,
      page_location: typeof window !== 'undefined' ? window.location.href : currentPath,
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_referrer: attribution.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
    };

    logDebug('page_view', payload);

    if (consentStatus !== CONSENT_STATUS.accepted || typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return false;
    }

    window.gtag('event', 'page_view', payload);
    return true;
  }, [attribution.referrer, consentStatus]);

  const contextValue = useMemo(() => ({
    attribution,
    consentStatus,
    hasConsent: consentStatus === CONSENT_STATUS.accepted,
    isHydrated,
    rejectConsent,
    acceptConsent,
    track,
    trackPageView,
  }), [acceptConsent, attribution, consentStatus, isHydrated, rejectConsent, track, trackPageView]);

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
      {isHydrated && consentStatus === CONSENT_STATUS.unset ? (
        <ConsentBanner onAccept={acceptConsent} onReject={rejectConsent} />
      ) : null}
    </AnalyticsContext.Provider>
  );
}
