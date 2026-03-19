import { getStoredAttribution } from '../analytics/attribution';
import { ANALYTICS_CONFIG } from '../analytics/env';

export function buildLeadPayload(basePayload) {
  const attribution = getStoredAttribution();

  return {
    ...basePayload,
    ...attribution,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  };
}

export async function submitLead(basePayload) {
  return fetch(ANALYTICS_CONFIG.leadWorkerEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildLeadPayload(basePayload)),
  });
}
