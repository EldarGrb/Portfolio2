import { useCallback, useEffect, useRef } from 'react';

function ModalShell({
  open,
  onClose,
  labelledBy,
  describedBy,
  className = '',
  closeLabel = 'Close dialog',
  children,
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusedElementRef = useRef(null);

  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

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
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = modalRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll(
        'button, [href], input, textarea, select, iframe, [tabindex]:not([tabindex="-1"])',
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
      document.removeEventListener('keydown', onKeyDown);
      style.overflow = previousOverflow;
      if (previousFocusedElementRef.current instanceof HTMLElement) {
        previousFocusedElementRef.current.focus();
      }
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className={`modal-content ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        ref={modalRef}
      >
        <button className="modal-close" onClick={onClose} ref={closeButtonRef} aria-label={closeLabel}>&times;</button>
        {children}
      </div>
    </div>
  );
}

export default ModalShell;
