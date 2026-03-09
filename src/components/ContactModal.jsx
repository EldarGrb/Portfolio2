import { useEffect, useId, useRef, useState } from 'react';

function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusedElementRef = useRef(null);
  const titleId = useId();
  const subtitleId = useId();

  const handleClose = () => {
    onClose();
    setStatus('idle');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://worker-proud-breeze-0b51.eldar-jahic-gb.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
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
        onClose();
        setStatus('idle');
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
  }, [open, onClose]);

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
          <form className="modal-form" onSubmit={handleSubmit}>
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
