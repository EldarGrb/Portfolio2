const GOOGLE_SCRIPT_ID = 'ga4-script';
const CLARITY_SCRIPT_ID = 'clarity-script';

function injectScript(id, src) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function ensureGoogleAnalytics(measurementId) {
  if (!measurementId || typeof window === 'undefined') return false;

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
  }

  if (window.__gaMeasurementId !== measurementId) {
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      send_page_view: false,
    });
    window.__gaMeasurementId = measurementId;
  }

  injectScript(GOOGLE_SCRIPT_ID, `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`);
  return true;
}

export function ensureClarity(projectId) {
  if (!projectId || typeof window === 'undefined' || document.getElementById(CLARITY_SCRIPT_ID)) return false;

  ((c, l, a, r, i, t, y) => {
    c[a] = c[a] || function clarityProxy() {
      (c[a].q = c[a].q || []).push(arguments);
    };
    t = l.createElement(r);
    t.async = 1;
    t.id = CLARITY_SCRIPT_ID;
    t.src = `https://www.clarity.ms/tag/${i}`;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', projectId);

  window.__clarityProjectId = projectId;
  return true;
}
