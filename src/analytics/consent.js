import { ANALYTICS_STORAGE_KEYS } from './env';

export const CONSENT_STATUS = {
  accepted: 'accepted',
  rejected: 'rejected',
  unset: 'unset',
};

export function getStoredConsent() {
  if (typeof window === 'undefined') return CONSENT_STATUS.unset;

  const value = window.localStorage.getItem(ANALYTICS_STORAGE_KEYS.consent);
  return value === CONSENT_STATUS.accepted || value === CONSENT_STATUS.rejected
    ? value
    : CONSENT_STATUS.unset;
}

export function persistConsent(value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ANALYTICS_STORAGE_KEYS.consent, value);
}
