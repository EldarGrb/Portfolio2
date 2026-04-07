export const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';

let calendlyScriptPromise = null;

function appendHeadLink(rel, href, options = {}) {
  if (typeof document === 'undefined') return;

  const selector = `link[rel="${rel}"][href="${href}"]`;
  if (document.head.querySelector(selector)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;

  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }

  document.head.appendChild(link);
}

export function warmCalendlyResources() {
  if (typeof document === 'undefined') return;

  appendHeadLink('preconnect', 'https://assets.calendly.com', { crossOrigin: 'anonymous' });
  appendHeadLink('preconnect', 'https://calendly.com');
  appendHeadLink('dns-prefetch', 'https://assets.calendly.com');
  appendHeadLink('dns-prefetch', 'https://calendly.com');
}

export function loadCalendlyScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Calendly can only load in the browser.'));
  }

  warmCalendlyResources();

  if (window.Calendly) {
    return Promise.resolve(window.Calendly);
  }

  if (calendlyScriptPromise) {
    return calendlyScriptPromise;
  }

  calendlyScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Calendly), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Calendly script failed to load.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.type = 'text/javascript';
    script.addEventListener('load', () => resolve(window.Calendly), { once: true });
    script.addEventListener('error', () => reject(new Error('Calendly script failed to load.')), { once: true });
    document.head.appendChild(script);
  });

  return calendlyScriptPromise;
}
