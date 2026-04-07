import { useId } from 'react';
import { CALENDLY_BOOKING_URL } from '../data/contactConfig';
import CalendlyEmbed from './CalendlyEmbed';
import ModalShell from './ModalShell';

function BookingModal({ open, onClose, onBack, onSendMessage, context = {} }) {
  const titleId = useId();
  const subtitleId = useId();

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={subtitleId}
      className="modal-content--booking"
      closeLabel="Close booking dialog"
    >
      <div className="modal-utility-row">
        <button type="button" className="modal-back-button" onClick={onBack}>
          Back
        </button>
      </div>

      <h2 className="modal-title" id={titleId}>Book an intro call</h2>
      <p className="modal-subtitle" id={subtitleId}>
        Choose a time that works for you.
      </p>

      {CALENDLY_BOOKING_URL ? (
        <>
          <div className="booking-modal-panel">
            {open ? <CalendlyEmbed url={CALENDLY_BOOKING_URL} context={context} /> : null}
          </div>
          <p className="booking-modal-note">
            Want to write first?{' '}
            <button type="button" className="modal-inline-action" onClick={onSendMessage}>
              Send a message
            </button>
            {' '}or{' '}
            <a
              href={CALENDLY_BOOKING_URL}
              className="modal-inline-link"
              target="_blank"
              rel="noreferrer"
            >
              open in a new tab
            </a>
          </p>
        </>
      ) : (
        <div className="booking-modal-fallback">
          <p>Booking is not available right now.</p>
          <button type="button" className="btn-primary" onClick={onSendMessage}>
            Send a message
          </button>
        </div>
      )}
    </ModalShell>
  );
}

export default BookingModal;
