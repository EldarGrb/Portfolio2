export const ANALYTICS_STORAGE_KEYS = {
  consent: 'uroboros-analytics-consent',
  attribution: 'uroboros-session-attribution',
};

export const ANALYTICS_CONFIG = {
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  clarityProjectId: import.meta.env.VITE_CLARITY_PROJECT_ID || '',
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY || '',
  leadWorkerEndpoint: import.meta.env.VITE_LEAD_WORKER_ENDPOINT || 'https://worker-proud-breeze-0b51.eldar-jahic-gb.workers.dev/',
  turnstileTheme: import.meta.env.VITE_TURNSTILE_THEME || 'auto',
};
