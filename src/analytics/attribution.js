import { ANALYTICS_STORAGE_KEYS } from './env';

const EMPTY_ATTRIBUTION = Object.freeze({
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: '',
  landing_page: '',
  referrer: '',
});

function getSessionStorage() {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getStoredAttribution() {
  const storage = getSessionStorage();
  if (!storage) return EMPTY_ATTRIBUTION;

  const raw = storage.getItem(ANALYTICS_STORAGE_KEYS.attribution);
  if (!raw) return EMPTY_ATTRIBUTION;

  try {
    return {
      ...EMPTY_ATTRIBUTION,
      ...JSON.parse(raw),
    };
  } catch {
    return EMPTY_ATTRIBUTION;
  }
}

export function captureSessionAttribution() {
  if (typeof window === 'undefined') return EMPTY_ATTRIBUTION;

  const storage = getSessionStorage();
  if (!storage) return EMPTY_ATTRIBUTION;

  const existing = getStoredAttribution();
  if (existing.landing_page) return existing;

  const searchParams = new URLSearchParams(window.location.search);
  const attribution = {
    utm_source: searchParams.get('utm_source') || '',
    utm_medium: searchParams.get('utm_medium') || '',
    utm_campaign: searchParams.get('utm_campaign') || '',
    utm_term: searchParams.get('utm_term') || '',
    utm_content: searchParams.get('utm_content') || '',
    landing_page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || '',
  };

  storage.setItem(ANALYTICS_STORAGE_KEYS.attribution, JSON.stringify(attribution));
  return attribution;
}
