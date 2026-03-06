import { useState } from 'react';

function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  if (!open) return null;

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
      onClose();
      setStatus('idle');
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={() => { onClose(); setStatus('idle'); }}>&times;</button>
        <h2 className="modal-title">Get in touch</h2>
        <p className="modal-subtitle">Tell us about your project and we'll get back to you shortly.</p>

        {status === 'success' ? (
          <div className="modal-success">
            <p>Message sent successfully. We'll be in touch soon.</p>
            <button className="btn-primary" onClick={() => { onClose(); setStatus('idle'); }}>Close</button>
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
                placeholder="Tell us about your project..."
                rows="4"
                value={form.message}
                onChange={handleChange}
              />
            </div>
            {status === 'error' && (
              <p className="modal-error">Something went wrong. Please try again.</p>
            )}
            <button className="btn-primary modal-submit" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactModal;
