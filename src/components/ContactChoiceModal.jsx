import { useId } from 'react';
import ModalShell from './ModalShell';

const contactChoices = [
  {
    id: 'message',
    eyebrow: 'Message',
    title: 'Send a message',
    description: 'Send a quick note and I’ll reply within 24 hours.',
    detail: 'Start here',
  },
  {
    id: 'booking',
    eyebrow: 'Meeting',
    title: 'Book a meeting',
    description: 'Pick a time for a short intro call.',
    detail: 'Open Calendly',
  },
];

function ContactChoiceModal({ open, onClose, onSelectMessage, onSelectBooking }) {
  const titleId = useId();
  const subtitleId = useId();

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={subtitleId}
      className="modal-content--choice"
      closeLabel="Close contact options"
    >
      <h2 className="modal-title" id={titleId}>How would you like to start?</h2>
      <p className="modal-subtitle" id={subtitleId}>
        Choose one option to continue.
      </p>

      <div className="contact-choice-grid">
        {contactChoices.map((choice) => {
          const handleSelect = choice.id === 'message' ? onSelectMessage : onSelectBooking;

          return (
            <button
              key={choice.id}
              type="button"
              className="contact-choice-card"
              onClick={handleSelect}
            >
              <span className="contact-choice-eyebrow">{choice.eyebrow}</span>
              <h3>{choice.title}</h3>
              <p>{choice.description}</p>
              <span className="contact-choice-detail">{choice.detail}</span>
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}

export default ContactChoiceModal;
