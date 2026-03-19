import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
import { ANALYTICS_CONFIG } from '../analytics/env';
import { submitLead } from '../lib/leadSubmission';
import TurnstileWidget from './TurnstileWidget';

function ContactModal({ open, onClose, context = {} }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [verificationError, setVerificationError] = useState('');
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusedElementRef = useRef(null);
  const titleId = useId();
  const subtitleId = useId();
  const { track } = useAnalytics();

  const trackValidationError = useCallback((reason, fieldName = '') => {
    track('contact_form_validation_error', {
      ...context,
      validation_reason: reason,
      validation_field: fieldName,
    });
  }, [context, track]);

  const handleClose = useCallback(() => {
    onClose();
    setStatus('idle');
    setVerificationError('');
    setTurnstileToken('');
    setTurnstileResetKey((value) => value + 1);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status === 'error') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ANALYTICS_CONFIG.turnstileSiteKey && !turnstileToken) {
      setVerificationError('Please complete the verification before sending your message.');
      trackValidationError('turnstile_missing');
      return;
    }

    track('contact_form_submit_attempt', context);
    setStatus('sending');
    setVerificationError('');
    try {
      const res = await submitLead({
        ...form,
        type: 'contact',
        turnstile_token: turnstileToken,
        cta_placement: context.cta_placement || '',
        cta_label: context.cta_label || '',
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTurnstileToken('');
        setTurnstileResetKey((value) => value + 1);
        track('contact_form_submit_success', context);
      } else {
        setStatus('error');
        track('contact_form_submit_error', context);
      }
    } catch {
      setStatus('error');
      track('contact_form_submit_error', context);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    if (!open) return undefined;

    previousFocusedElementRef.current = document.activeElement;
    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = modalRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isShift = event.shiftKey;

      if (!isShift && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (isShift && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      style.overflow = previousOverflow;
      if (previousFocusedElementRef.current instanceof HTMLElement) {
        previousFocusedElementRef.current.focus();
      }
    };
  }, [handleClose, onClose, open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        ref={modalRef}
      >
        <button className="modal-close" onClick={handleClose} ref={closeButtonRef} aria-label="Close contact form">&times;</button>
        <h2 className="modal-title" id={titleId}>Start your project</h2>
        <p className="modal-subtitle" id={subtitleId}>Share your goals, timeline, and scope. We reply within 24 hours.</p>

        {status === 'success' ? (
          <div className="modal-success">
            <p>Your message has been received. We&apos;ll get back to you within 24 hours.</p>
            <button className="btn-primary" onClick={handleClose}>Close</button>
          </div>
        ) : (
          <form
            className="modal-form"
            onSubmit={handleSubmit}
            onInvalidCapture={(event) => {
              const target = event.target;
              if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
                return;
              }

              trackValidationError('field_invalid', target.name || target.id || 'unknown');
            }}
          >
            <div className="modal-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="modal-field">
              <label htmlFor="contact-email">Email address</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="modal-field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                placeholder="Project goals, timeline, and what success looks like..."
                rows="4"
                value={form.message}
                onChange={handleChange}
              />
            </div>
            <TurnstileWidget
              siteKey={ANALYTICS_CONFIG.turnstileSiteKey}
              theme={ANALYTICS_CONFIG.turnstileTheme}
              resetKey={turnstileResetKey}
              onTokenChange={(token) => {
                setTurnstileToken(token);
                if (token) setVerificationError('');
              }}
              onError={() => setVerificationError('Verification could not load. Please refresh and try again.')}
            />
            {verificationError && (
              <p className="modal-helper-text" role="alert">{verificationError}</p>
            )}
            {status === 'error' && (
              <p className="modal-error" role="alert">We couldn&apos;t send your message right now. Please try again.</p>
            )}
            <button className="btn-primary modal-submit" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactModal;
