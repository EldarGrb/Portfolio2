import { useEffect, useId, useRef, useState } from 'react';

const WORKER_ENDPOINT = 'https://worker-proud-breeze-0b51.eldar-jahic-gb.workers.dev/';

function NewsletterSignup({
  variant = 'footer',
  className = '',
  eyebrow,
  title,
  description,
  placeholder = 'Enter your email',
  buttonLabel = 'Subscribe',
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusedElementRef = useRef(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    if (!modalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    previousFocusedElementRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setModalOpen(false);
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
  }, [modalOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus('sending');

    try {
      const response = await fetch(WORKER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter subscriber',
          email: email.trim(),
          message: 'Newsletter subscription request from portfolio footer.',
          type: 'newsletter_subscribe',
        }),
      });

      if (!response.ok) throw new Error('Subscription request failed');

      setStatus('success');
      setEmail('');
      setModalOpen(true);
    } catch {
      setStatus('error');
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
              setModalOpen(false);
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
              onClick={() => setModalOpen(false)}
              ref={closeButtonRef}
              aria-label="Close subscription message"
            >
              &times;
            </button>
            <h2 className="modal-title" id={titleId}>You&apos;re subscribed</h2>
            <p className="modal-subtitle" id={bodyId}>
              Thanks for joining our newsletter. Your first update will arrive soon.
            </p>
            <button className="btn-primary modal-submit" type="button" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default NewsletterSignup;
