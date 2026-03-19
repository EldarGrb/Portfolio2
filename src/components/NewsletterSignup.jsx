import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
import { ANALYTICS_CONFIG } from '../analytics/env';
import { submitLead } from '../lib/leadSubmission';
import TurnstileWidget from './TurnstileWidget';

function NewsletterSignup({
  variant = 'footer',
  className = '',
  eyebrow,
  title,
  description,
  placeholder = 'Enter your email',
  buttonLabel = 'Subscribe',
  placement = 'newsletter',
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [modalOpen, setModalOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [verificationError, setVerificationError] = useState('');
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusedElementRef = useRef(null);
  const titleId = useId();
  const bodyId = useId();
  const { track } = useAnalytics();

  const trackValidationError = useCallback((reason, fieldName = '') => {
    track('newsletter_validation_error', {
      placement,
      validation_reason: reason,
      validation_field: fieldName,
    });
  }, [placement, track]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setStatus('idle');
    setVerificationError('');
    setTurnstileToken('');
    setTurnstileResetKey((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!modalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    previousFocusedElementRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseModal();
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = modalRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocusedElementRef.current instanceof HTMLElement) {
        previousFocusedElementRef.current.focus();
      }
    };
  }, [handleCloseModal, modalOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    if (ANALYTICS_CONFIG.turnstileSiteKey && !turnstileToken) {
      setVerificationError('Please complete the verification before subscribing.');
      trackValidationError('turnstile_missing');
      return;
    }

    track('newsletter_submit_attempt', { placement });
    setStatus('sending');
    setVerificationError('');

    try {
      const response = await submitLead({
        name: 'Newsletter subscriber',
        email: email.trim(),
        message: `Newsletter subscription request from ${placement}.`,
        type: 'newsletter_subscribe',
        turnstile_token: turnstileToken,
        cta_placement: placement,
      });

      if (!response.ok) throw new Error('Subscription request failed');

      setStatus('success');
      setEmail('');
      setModalOpen(true);
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
      track('newsletter_submit_success', { placement });
    } catch {
      setStatus('error');
      track('newsletter_submit_error', { placement });
    }
  };

  const isCompact = variant === 'compact';
  const isEditorial = variant === 'compact' || variant === 'editorial';
  const wrapperClassName = [
    className,
    isCompact ? 'newsletter-signup newsletter-signup--compact' : '',
    isEditorial ? 'newsletter-signup--editorial' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className={wrapperClassName}>
        {eyebrow && (
          <p className={isEditorial ? 'newsletter-signup-label' : 'footer-card-label'}>
            {eyebrow}
          </p>
        )}
        {title && <h3 className={isEditorial ? 'newsletter-signup-title' : ''}>{title}</h3>}
        {description && (
          <p className={isEditorial ? 'newsletter-signup-copy' : 'footer-card-copy'}>
            {description}
          </p>
        )}
        <form
          className={isEditorial ? 'newsletter-signup-form' : 'subscribe-form'}
          onSubmit={handleSubmit}
          onInvalidCapture={(event) => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
              return;
            }

            trackValidationError('field_invalid', target.name || target.id || 'unknown');
          }}
        >
          <input
            className={isEditorial ? 'newsletter-signup-input' : 'subscribe-input'}
            type="email"
            name="email"
            placeholder={placeholder}
            aria-label="Email address"
            required
            disabled={status === 'sending'}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === 'error') setStatus('idle');
              if (verificationError) setVerificationError('');
            }}
          />
          <button
            className={isEditorial ? 'newsletter-signup-button' : 'subscribe-btn'}
            type="submit"
            disabled={status === 'sending'}
            aria-busy={status === 'sending'}
          >
            {status === 'sending' ? 'Subscribing...' : buttonLabel}
          </button>
        </form>
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
          <p className={isEditorial ? 'newsletter-signup-error' : 'subscribe-error'} role="alert">
            Could not subscribe right now. Please try again.
          </p>
        )}
      </div>

      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            className="modal-content newsletter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            ref={modalRef}
          >
            <button
              className="modal-close"
              onClick={handleCloseModal}
              ref={closeButtonRef}
              aria-label="Close subscription message"
            >
              &times;
            </button>
            <h2 className="modal-title" id={titleId}>You&apos;re subscribed</h2>
            <p className="modal-subtitle" id={bodyId}>
              Thanks for joining our newsletter. Your first update will arrive soon.
            </p>
            <button className="btn-primary modal-submit" type="button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NewsletterSignup;
