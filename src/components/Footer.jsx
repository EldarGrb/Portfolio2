import { useEffect, useId, useRef, useState } from 'react';
import Icons from './Icons';

const WORKER_ENDPOINT = 'https://worker-proud-breeze-0b51.eldar-jahic-gb.workers.dev/';

function Footer({ onContact }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusedElementRef = useRef(null);
  const titleId = useId();
  const bodyId = useId();

  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (!modalOpen) return;
    previousFocusedElementRef.current = document.activeElement;
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

  const handleModalBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-subscribe">
            <h3>Stay updated</h3>
            <form className="subscribe-form" onSubmit={handleSubmit}>
              <input
                className="subscribe-input"
                type="email"
                name="email"
                placeholder="Enter your email"
                aria-label="Email address"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status === 'error') setStatus('idle');
                }}
              />
              <button className="subscribe-btn" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                {status === 'sending' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {status === 'error' && (
              <p className="subscribe-error" role="alert">Could not subscribe right now. Please try again.</p>
            )}
            <div className="footer-links-grid" style={{ marginTop: 24 }}>
              <div>
                <h4>Pages</h4>
                <a href="/">Home</a>
                <a href="#services">Services</a>
                <a href="#process">Process</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          </div>
          <div className="footer-contact">
            <div className="footer-contact-grid">
              <div>
                <h4>Contact</h4>
                <button className="footer-contact-link" onClick={onContact}>Start a conversation</button>
              </div>
              <div>
                <h4>Location</h4>
                <p>Available worldwide<br />Remote-first</p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-logo">
            <Icons.Logo />
            Uroboros Systems
          </div>
        </div>
      </footer>

      {modalOpen && (
        <div className="modal-backdrop" onClick={handleModalBackdropClick}>
          <div
            className="modal-content newsletter-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            ref={modalRef}
          >
            <button className="modal-close" onClick={closeModal} ref={closeButtonRef} aria-label="Close subscription message">&times;</button>
            <h2 className="modal-title" id={titleId}>You&apos;re subscribed</h2>
            <p className="modal-subtitle" id={bodyId}>Thanks for joining our newsletter. Your first update will arrive soon.</p>
            <button className="btn-primary modal-submit" type="button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
